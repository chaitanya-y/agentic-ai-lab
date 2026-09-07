from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from support_assistant.models import ModelCallTrace, SupportRequest, SupportResponse
from support_assistant.prompts import PromptVersion
from support_assistant.providers import ModelCallFailure, ModelInvocation
from support_assistant.workflow import run_support_workflow


def trace(name: str) -> ModelCallTrace:
    return ModelCallTrace(
        name=name,
        provider="test",
        model="test-model",
        prompt_version="test.v1",
        latency_ms=1.0,
        completion_status="completed",
    )


@dataclass
class FakeModel:
    request: SupportRequest
    response: SupportResponse | None = None
    fail_analysis: bool = False
    calls: list[str] = field(default_factory=list)

    def analyze(self, messages: list[Any], prompt_version: str) -> ModelInvocation[SupportRequest]:
        self.calls.append("analysis")
        if self.fail_analysis:
            failed_trace = trace("analyze_support_request")
            failed_trace.completion_status = "error"
            failed_trace.error = "TimeoutError"
            raise ModelCallFailure("analysis failed", failed_trace)
        return ModelInvocation(value=self.request, trace=trace("analyze_support_request"))

    def respond(self, messages: list[Any], prompt_version: str) -> ModelInvocation[SupportResponse]:
        self.calls.append("response")
        if self.response is None:
            raise AssertionError("The workflow requested an unexpected response call")
        return ModelInvocation(value=self.response, trace=trace("generate_support_response"))


def order_request(order_id: str | None = "10492") -> SupportRequest:
    return SupportRequest(
        issue_type="order_status",
        order_id=order_id,
        requested_outcome="status",
        missing_information=[] if order_id else ["order_id"],
    )


def test_complete_request_uses_two_model_calls() -> None:
    model = FakeModel(
        request=order_request(),
        response=SupportResponse(
            outcome="answered",
            message="Order 10492 is in transit and expected September 8, 2026 by 8 PM.",
            evidence_ids=["order_10492", "policy_order_status"],
        ),
    )

    result = run_support_workflow(
        model=model,
        customer_message="Where is order 10492?",
        authenticated_customer_id="customer_001",
        prompt_version=PromptVersion.REVISED,
    )

    assert result.response.outcome == "answered"
    assert result.trace.model_call_count == 2
    assert result.trace.completion_reason == "answered"
    assert model.calls == ["analysis", "response"]


def test_missing_order_id_stops_after_analysis() -> None:
    model = FakeModel(request=order_request(order_id=None))

    result = run_support_workflow(
        model=model,
        customer_message="Where is my order?",
        authenticated_customer_id="customer_001",
    )

    assert result.response.outcome == "needs_information"
    assert result.response.missing_information == ["order_id"]
    assert result.trace.model_call_count == 1
    assert result.trace.completion_reason == "needs_information"
    assert model.calls == ["analysis"]


def test_unavailable_order_stops_before_response_generation() -> None:
    model = FakeModel(request=order_request(order_id="77777"))

    result = run_support_workflow(
        model=model,
        customer_message="Where is order 77777?",
        authenticated_customer_id="customer_001",
    )

    assert result.response.outcome == "cannot_answer"
    assert result.trace.model_call_count == 1
    assert result.trace.completion_reason == "order_unavailable"


def test_unknown_evidence_returns_a_safe_validation_failure() -> None:
    model = FakeModel(
        request=order_request(),
        response=SupportResponse(
            outcome="answered",
            message="Order 10492 is in transit.",
            evidence_ids=["not_supplied"],
        ),
    )

    result = run_support_workflow(
        model=model,
        customer_message="Where is order 10492?",
        authenticated_customer_id="customer_001",
    )

    assert result.response.outcome == "cannot_answer"
    assert result.trace.completion_reason == "validation_failed"
    assert result.trace.model_call_count == 2
    assert "UnknownEvidenceReference" in result.trace.validation_stages


def test_model_failure_preserves_the_failed_call_trace() -> None:
    model = FakeModel(request=order_request(), fail_analysis=True)

    result = run_support_workflow(
        model=model,
        customer_message="Where is order 10492?",
        authenticated_customer_id="customer_001",
    )

    assert result.response.outcome == "cannot_answer"
    assert result.trace.model_call_count == 1
    assert result.trace.model_calls[0].error == "TimeoutError"
    assert result.trace.completion_reason == "model_error"
