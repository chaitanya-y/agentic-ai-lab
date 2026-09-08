from __future__ import annotations

import argparse
import json
from datetime import UTC, datetime
from pathlib import Path
from typing import Callable, Literal

from pydantic import BaseModel, Field, TypeAdapter

from support_assistant.context import FIXTURE_DIRECTORY
from support_assistant.config import Settings
from support_assistant.context import load_conversation
from support_assistant.models import IssueType, ResponseOutcome
from support_assistant.prompts import PromptVersion
from support_assistant.providers import create_model
from support_assistant.workflow import WorkflowResult, run_support_workflow


class EvaluationCase(BaseModel):
    """One task-specific case kept outside prompt demonstrations."""

    case_id: str
    split: Literal["development", "held_out"]
    customer_message: str
    authenticated_customer_id: str
    conversation_id: str | None = None
    expected_issue_type: IssueType | None = None
    expected_order_id: str | None = None
    expected_outcome: ResponseOutcome
    required_evidence_ids: list[str] = Field(default_factory=list)
    forbidden_evidence_ids: list[str] = Field(default_factory=list)
    forbidden_message_phrases: list[str] = Field(default_factory=list)


class CaseResult(BaseModel):
    """Observable checks for one evaluation case."""

    case_id: str
    passed: bool
    checks: dict[str, bool]
    failure_reasons: list[str]
    observed_issue_type: str | None
    observed_order_id: str | None
    observed_outcome: str
    observed_evidence_ids: list[str]
    input_tokens: int | None
    output_tokens: int | None
    end_to_end_ms: float | None


class EvaluationReport(BaseModel):
    """A bounded comparison report rather than a production accuracy claim."""

    result_kind: Literal["offline_fixture", "live_model"]
    prompt_version: str
    provider: str
    model: str
    generated_at: datetime
    total_cases: int
    passed_cases: int
    pass_rate: float
    total_input_tokens: int | None
    total_output_tokens: int | None
    average_end_to_end_ms: float | None
    results: list[CaseResult]


def sum_complete_token_usage(values: list[int | None]) -> int | None:
    """Sum token counts only when every model call reports its usage."""

    if not values or any(value is None for value in values):
        return None
    return sum(value for value in values if value is not None)


def load_evaluation_cases(
    split: Literal["development", "held_out"] | None = None,
    fixture_directory: Path = FIXTURE_DIRECTORY,
) -> list[EvaluationCase]:
    """Load the fixed evaluation set, optionally selecting one split."""

    with (fixture_directory / "evaluation_cases.json").open(encoding="utf-8") as handle:
        cases = TypeAdapter(list[EvaluationCase]).validate_python(json.load(handle))
    return [case for case in cases if split is None or case.split == split]


def select_evaluation_cases(
    cases: list[EvaluationCase],
    *,
    split: Literal["development", "held_out"],
    limit: int,
) -> list[EvaluationCase]:
    """Select a small, repeatable subset for an intentional live run."""

    if limit < 1:
        raise ValueError("evaluation limit must be at least one")
    return [case for case in cases if case.split == split][:limit]


def score_case(case: EvaluationCase, result: WorkflowResult) -> CaseResult:
    """Score fields and application boundaries with deterministic checks."""

    issue_type = result.request.issue_type if result.request else None
    order_id = result.request.order_id if result.request else None
    evidence_ids = set(result.response.evidence_ids)
    normalized_message = result.response.message.casefold()
    input_tokens = sum_complete_token_usage(
        [call.input_tokens for call in result.trace.model_calls]
    )
    output_tokens = sum_complete_token_usage(
        [call.output_tokens for call in result.trace.model_calls]
    )

    checks = {
        "issue_type": issue_type == case.expected_issue_type,
        "order_id": order_id == case.expected_order_id,
        "outcome": result.response.outcome == case.expected_outcome,
        "required_evidence": set(case.required_evidence_ids).issubset(evidence_ids),
        "forbidden_evidence": evidence_ids.isdisjoint(case.forbidden_evidence_ids),
        "forbidden_message": all(
            phrase.casefold() not in normalized_message
            for phrase in case.forbidden_message_phrases
        ),
    }
    labels = {
        "issue_type": "issue type",
        "order_id": "order identifier",
        "outcome": "completion outcome",
        "required_evidence": "required evidence",
        "forbidden_evidence": "forbidden evidence",
        "forbidden_message": "forbidden message content",
    }
    failures = [f"Failed {labels[name]} check" for name, passed in checks.items() if not passed]

    return CaseResult(
        case_id=case.case_id,
        passed=all(checks.values()),
        checks=checks,
        failure_reasons=failures,
        observed_issue_type=issue_type,
        observed_order_id=order_id,
        observed_outcome=result.response.outcome,
        observed_evidence_ids=result.response.evidence_ids,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        end_to_end_ms=result.trace.end_to_end_ms,
    )


def run_evaluation(
    *,
    cases: list[EvaluationCase],
    runner: Callable[[EvaluationCase], WorkflowResult],
    prompt_version: str,
    provider: str,
    model: str,
    result_kind: Literal["offline_fixture", "live_model"],
    output_path: Path | None = None,
) -> EvaluationReport:
    """Run a bounded set of cases and optionally write a readable report."""

    results = [score_case(case, runner(case)) for case in cases]
    passed_cases = sum(result.passed for result in results)
    total_cases = len(results)
    total_input_tokens = sum_complete_token_usage(
        [result.input_tokens for result in results]
    )
    total_output_tokens = sum_complete_token_usage(
        [result.output_tokens for result in results]
    )
    latency_values = [result.end_to_end_ms for result in results]
    average_end_to_end_ms = (
        round(sum(value for value in latency_values if value is not None) / total_cases, 1)
        if total_cases and all(value is not None for value in latency_values)
        else None
    )
    report = EvaluationReport(
        result_kind=result_kind,
        prompt_version=prompt_version,
        provider=provider,
        model=model,
        generated_at=datetime.now(UTC),
        total_cases=total_cases,
        passed_cases=passed_cases,
        pass_rate=round((passed_cases / total_cases * 100) if total_cases else 0.0, 1),
        total_input_tokens=total_input_tokens,
        total_output_tokens=total_output_tokens,
        average_end_to_end_ms=average_end_to_end_ms,
        results=results,
    )

    if output_path is not None:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(report.model_dump_json(indent=2), encoding="utf-8")

    return report


def main() -> None:
    """Run a bounded live evaluation and save the inspectable report."""

    parser = argparse.ArgumentParser(description="Evaluate the support assistant")
    parser.add_argument(
        "--split",
        choices=["development", "held_out"],
        default="development",
    )
    parser.add_argument("--limit", type=int, default=4)
    parser.add_argument(
        "--prompt-version",
        choices=[version.value for version in PromptVersion],
        default=PromptVersion.REVISED.value,
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(".artifacts/evaluation-report.json"),
    )
    arguments = parser.parse_args()

    settings = Settings.from_environment()
    model = create_model(settings)
    prompt_version = PromptVersion(arguments.prompt_version)
    cases = select_evaluation_cases(
        load_evaluation_cases(),
        split=arguments.split,
        limit=arguments.limit,
    )

    def run_case(case: EvaluationCase) -> WorkflowResult:
        history = (
            load_conversation(case.conversation_id)
            if case.conversation_id
            else []
        )
        return run_support_workflow(
            model=model,
            customer_message=case.customer_message,
            authenticated_customer_id=case.authenticated_customer_id,
            prompt_version=prompt_version,
            conversation_history=history,
            input_budget_tokens=settings.input_budget_tokens,
            output_reserve_tokens=settings.output_reserve_tokens,
        )

    report = run_evaluation(
        cases=cases,
        runner=run_case,
        prompt_version=prompt_version.value,
        provider=settings.provider,
        model=settings.model,
        result_kind="live_model",
        output_path=arguments.output,
    )
    print(
        f"{report.passed_cases} of {report.total_cases} cases passed "
        f"({report.pass_rate}%)."
    )
    print(f"Report saved to {arguments.output}")


if __name__ == "__main__":
    main()
