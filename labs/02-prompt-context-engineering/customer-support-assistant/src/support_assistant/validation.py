from __future__ import annotations

import re

from pydantic import BaseModel

from support_assistant.models import ContextReport, SupportRequest, SupportResponse


ORDER_ID_PATTERN = re.compile(r"\b\d{5}\b")
PROHIBITED_COMPLETED_ACTIONS = (
    "refund has been issued",
    "refund was issued",
    "refund has been approved",
    "refund was approved",
    "replacement has been ordered",
    "replacement was ordered",
)


class IncompleteModelResponse(ValueError):
    """The provider did not complete the requested output."""


class UnknownEvidenceReference(ValueError):
    """The response cited evidence that the application did not supply."""


class UnsupportedOrderClaim(ValueError):
    """The response named an order outside the validated request."""


class ProhibitedActionClaim(ValueError):
    """The response claimed that an unavailable action was completed."""


class ValidationOutcome(BaseModel):
    """Named validation stages completed by application code."""

    passed: bool
    stages: list[str]


def validate_completion_status(status: str) -> None:
    """Reject output that stopped before normal completion."""

    normalized = status.strip().lower()
    if normalized in {"completed", "complete", "stop"}:
        return
    if normalized in {"output_limit", "length", "max_tokens"}:
        raise IncompleteModelResponse("model output ended at the output limit")
    raise IncompleteModelResponse(f"model response did not complete: {normalized}")


def validate_support_response(
    response: SupportResponse,
    request: SupportRequest,
    context: ContextReport,
    *,
    completion_status: str = "completed",
) -> ValidationOutcome:
    """Validate completion, evidence, identifiers, and unavailable actions."""

    validate_completion_status(completion_status)
    available_evidence = set(context.included_source_ids)
    unknown_evidence = [
        evidence_id
        for evidence_id in response.evidence_ids
        if evidence_id not in available_evidence
    ]
    if unknown_evidence:
        raise UnknownEvidenceReference(
            "response cited unavailable evidence: " + ", ".join(unknown_evidence)
        )

    mentioned_order_ids = set(ORDER_ID_PATTERN.findall(response.message))
    if request.order_id:
        unsupported_ids = mentioned_order_ids - {request.order_id}
    else:
        unsupported_ids = mentioned_order_ids
    if unsupported_ids:
        raise UnsupportedOrderClaim(
            "response named an unsupported order: " + ", ".join(sorted(unsupported_ids))
        )

    normalized_message = response.message.casefold()
    for phrase in PROHIBITED_COMPLETED_ACTIONS:
        if phrase in normalized_message:
            raise ProhibitedActionClaim(
                "response claimed a refund or replacement action that this lab cannot execute"
            )

    return ValidationOutcome(
        passed=True,
        stages=["completion", "schema", "evidence", "application_rules"],
    )
