from __future__ import annotations

from support_assistant.evaluation import load_evaluation_cases, select_evaluation_cases
from support_assistant.models import RunTrace, SupportRequest, SupportResponse
from support_assistant.workflow import WorkflowResult, format_workflow_result


def test_workflow_output_names_each_observable_stage() -> None:
    result = WorkflowResult(
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
            trace_id="trace_cli",
            selected_evidence_ids=["order_10492", "policy_order_status"],
            validation_stages=["analysis_schema", "application_rules"],
            completion_reason="answered",
            end_to_end_ms=12.5,
        ),
    )

    output = format_workflow_result(result)

    assert "Customer response" in output
    assert "Structured request" in output
    assert "Selected context" in output
    assert "Run metadata" in output
    assert '"trace_id": "trace_cli"' in output


def test_evaluation_selection_is_bounded_and_split_specific() -> None:
    cases = load_evaluation_cases()

    selected = select_evaluation_cases(cases, split="development", limit=4)

    assert len(selected) == 4
    assert all(case.split == "development" for case in selected)
