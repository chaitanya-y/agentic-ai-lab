from __future__ import annotations

import pytest

from support_assistant.context import build_context
from support_assistant.models import SupportRequest, SupportResponse
from support_assistant.validation import (
    IncompleteModelResponse,
    ProhibitedActionClaim,
    UnknownEvidenceReference,
    UnsupportedOrderClaim,
    validate_completion_status,
    validate_support_response,
)


def order_request() -> SupportRequest:
    return SupportRequest(
        issue_type="order_status",
        order_id="10492",
        requested_outcome="status",
    )


def order_context():
    return build_context(
        request=order_request(),
        authenticated_customer_id="customer_001",
    )


def test_incomplete_generation_is_not_treated_as_valid_output() -> None:
    with pytest.raises(IncompleteModelResponse, match="output limit"):
        validate_completion_status("output_limit")


def test_response_rejects_an_unknown_evidence_reference() -> None:
    response = SupportResponse(
        outcome="answered",
        message="Order 10492 is in transit.",
        evidence_ids=["made_up_source"],
    )

    with pytest.raises(UnknownEvidenceReference, match="made_up_source"):
        validate_support_response(response, order_request(), order_context())


def test_response_rejects_a_different_order_identifier() -> None:
    response = SupportResponse(
        outcome="answered",
        message="Order 77777 is processing.",
        evidence_ids=["order_10492"],
    )

    with pytest.raises(UnsupportedOrderClaim, match="77777"):
        validate_support_response(response, order_request(), order_context())


def test_response_rejects_an_unavailable_completed_action() -> None:
    response = SupportResponse(
        outcome="answered",
        message="Your refund has been issued for order 10492.",
        evidence_ids=["order_10492"],
    )

    with pytest.raises(ProhibitedActionClaim, match="refund"):
        validate_support_response(response, order_request(), order_context())


def test_grounded_order_response_passes_all_validation_stages() -> None:
    response = SupportResponse(
        outcome="answered",
        message="Order 10492 is in transit. The delivery estimate is September 8, 2026 by 8 PM.",
        evidence_ids=["order_10492", "policy_order_status"],
    )

    outcome = validate_support_response(response, order_request(), order_context())

    assert outcome.passed is True
    assert outcome.stages == ["completion", "schema", "evidence", "application_rules"]
