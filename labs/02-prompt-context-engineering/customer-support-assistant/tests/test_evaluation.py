from __future__ import annotations

import json

from support_assistant.evaluation import (
    EvaluationCase,
    load_evaluation_cases,
    run_evaluation,
    score_case,
)
from support_assistant.models import ModelCallTrace, RunTrace, SupportRequest, SupportResponse
from support_assistant.prompts import prompt_examples
from support_assistant.workflow import WorkflowResult


def successful_result() -> WorkflowResult:
    return WorkflowResult(
        request=SupportRequest(
            issue_type="order_status",
            order_id="10492",
            requested_outcome="status",
        ),
        response=SupportResponse(
            outcome="answered",
            message="Order 10492 is in transit.",
            evidence_ids=["order_10492", "policy_order_status"],
        ),
        trace=RunTrace(
            trace_id="trace_test",
            selected_evidence_ids=["order_10492", "policy_order_status"],
            completion_reason="answered",
        ),
    )


def traced_successful_result() -> WorkflowResult:
    result = successful_result()
    result.trace.model_calls = [
        ModelCallTrace(
            name="analyze_support_request",
            provider="fixture",
            model="deterministic",
            prompt_version="support-analysis.revised.v1",
            latency_ms=40.0,
            input_tokens=11,
            output_tokens=3,
            completion_status="completed",
        ),
        ModelCallTrace(
            name="generate_support_response",
            provider="fixture",
            model="deterministic",
            prompt_version="support-response.context.v1",
            latency_ms=80.0,
            input_tokens=17,
            output_tokens=5,
            completion_status="completed",
        ),
    ]
    result.trace.end_to_end_ms = 150.0
    return result


def evaluation_case() -> EvaluationCase:
    return EvaluationCase(
        case_id="test_order_status",
        split="development",
        customer_message="Where is order 10492?",
        authenticated_customer_id="customer_001",
        expected_issue_type="order_status",
        expected_order_id="10492",
        expected_outcome="answered",
        required_evidence_ids=["order_10492", "policy_order_status"],
        forbidden_evidence_ids=["policy_internal_refund_notes"],
        forbidden_message_phrases=["refund has been issued"],
    )


def test_score_case_checks_fields_outcome_and_evidence() -> None:
    result = score_case(evaluation_case(), successful_result())

    assert result.passed is True
    assert result.checks == {
        "issue_type": True,
        "order_id": True,
        "outcome": True,
        "required_evidence": True,
        "forbidden_evidence": True,
        "forbidden_message": True,
    }


def test_score_case_reports_missing_required_evidence() -> None:
    workflow_result = successful_result()
    workflow_result.response.evidence_ids = ["order_10492"]

    result = score_case(evaluation_case(), workflow_result)

    assert result.passed is False
    assert result.checks["required_evidence"] is False
    assert "required evidence" in result.failure_reasons[0]


def test_score_case_preserves_token_usage_and_end_to_end_latency() -> None:
    result = score_case(evaluation_case(), traced_successful_result())

    assert result.input_tokens == 28
    assert result.output_tokens == 8
    assert result.end_to_end_ms == 150.0


def test_run_evaluation_reports_counts_and_percentage(tmp_path) -> None:
    failing_case = evaluation_case().model_copy(
        update={"case_id": "test_wrong_order", "expected_order_id": "10429"}
    )
    output_path = tmp_path / "report.json"

    report = run_evaluation(
        cases=[evaluation_case(), failing_case],
        runner=lambda case: successful_result(),
        prompt_version="support-analysis.revised.v1",
        provider="fixture",
        model="deterministic",
        result_kind="offline_fixture",
        output_path=output_path,
    )

    assert report.total_cases == 2
    assert report.passed_cases == 1
    assert report.pass_rate == 50.0
    written = json.loads(output_path.read_text())
    assert written["result_kind"] == "offline_fixture"
    assert len(written["results"]) == 2


def test_run_evaluation_aggregates_operational_measurements() -> None:
    report = run_evaluation(
        cases=[evaluation_case(), evaluation_case().model_copy(update={"case_id": "second"})],
        runner=lambda case: traced_successful_result(),
        prompt_version="support-analysis.revised.v1",
        provider="fixture",
        model="deterministic",
        result_kind="offline_fixture",
    )

    assert report.total_input_tokens == 56
    assert report.total_output_tokens == 16
    assert report.average_end_to_end_ms == 150.0


def test_evaluation_fixtures_keep_examples_out_of_scored_splits() -> None:
    cases = load_evaluation_cases()
    example_messages = {example.customer_message for example in prompt_examples()}
    evaluation_messages = {case.customer_message for case in cases}

    assert len(cases) == 24
    assert {case.split for case in cases} == {"development", "held_out"}
    assert all(not case.case_id.startswith("example_") for case in cases)
    assert example_messages.isdisjoint(evaluation_messages)
