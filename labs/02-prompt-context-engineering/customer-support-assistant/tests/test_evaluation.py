from __future__ import annotations

import json

from support_assistant.evaluation import (
    EvaluationCase,
    load_evaluation_cases,
    run_evaluation,
    score_case,
)
from support_assistant.models import RunTrace, SupportRequest, SupportResponse
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


def test_evaluation_fixtures_keep_examples_out_of_scored_splits() -> None:
    cases = load_evaluation_cases()

    assert len(cases) == 24
    assert {case.split for case in cases} == {"development", "held_out"}
    assert all(not case.case_id.startswith("example_") for case in cases)
