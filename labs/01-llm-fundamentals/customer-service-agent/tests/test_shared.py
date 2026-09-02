import pytest
from pydantic import ValidationError

from customer_service_lab.shared import CustomerReply, SupportRequest, ollama_usage


def test_support_request_accepts_a_five_digit_order_number() -> None:
    request = SupportRequest(
        issue_type="order_status",
        order_id="10492",
        needs_order_data=True,
        missing_details=[],
    )

    assert request.order_id == "10492"


def test_support_request_rejects_an_invalid_order_number() -> None:
    with pytest.raises(ValidationError):
        SupportRequest(
            issue_type="order_status",
            order_id="order 10492",
            needs_order_data=True,
            missing_details=[],
        )


def test_ollama_usage_uses_local_runtime_counters() -> None:
    response = type("OllamaResponse", (), {"prompt_eval_count": 18, "eval_count": 7})()

    usage = ollama_usage(response)

    assert usage.input_tokens == 18
    assert usage.output_tokens == 7
    assert usage.cached_input_tokens is None


def test_support_request_accepts_null_when_no_order_number_is_present() -> None:
    request = SupportRequest(
        issue_type="other",
        order_id=None,
        needs_order_data=False,
        missing_details=[],
    )

    assert request.order_id is None


def test_support_request_requires_the_order_id_key() -> None:
    with pytest.raises(ValidationError):
        SupportRequest.model_validate(
            {
                "issue_type": "other",
                "needs_order_data": False,
                "missing_details": [],
            }
        )


def test_customer_reply_requires_a_consistent_verified_source() -> None:
    with pytest.raises(ValidationError):
        CustomerReply(
            message="The order is in transit.",
            source="safe_fallback",
            order_verified=True,
        )
