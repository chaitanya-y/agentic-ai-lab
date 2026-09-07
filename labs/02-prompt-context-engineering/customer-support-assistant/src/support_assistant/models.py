from __future__ import annotations

from datetime import date
from typing import Literal

from pydantic import BaseModel, Field, model_validator


IssueType = Literal["order_status", "damaged_item", "refund", "other"]
RequestedOutcome = Literal["status", "replacement", "refund", "information", "other"]
ResponseOutcome = Literal["answered", "needs_information", "cannot_answer"]


class SupportRequest(BaseModel):
    """Structured interpretation of one customer request."""

    issue_type: IssueType
    order_id: str | None = Field(
        default=None,
        description="A five digit order number when present, otherwise null",
        pattern=r"^\d{5}$",
    )
    requested_outcome: RequestedOutcome | None = None
    missing_information: list[str] = Field(default_factory=list)


class EvidenceSource(BaseModel):
    """One inspectable source that may be considered for model context."""

    source_id: str
    source_type: Literal["order", "policy", "conversation"]
    audience: Literal["customer", "internal"]
    version: str
    effective_from: date | None = None
    effective_until: date | None = None
    topics: list[str] = Field(default_factory=list)
    content: str


class OrderRecord(BaseModel):
    """Synthetic order data owned by one authenticated customer."""

    customer_id: str
    order_id: str = Field(pattern=r"^\d{5}$")
    status: str
    expected_delivery: str | None = None
    latest_update: str


class ConversationTurn(BaseModel):
    """One supplied conversation turn considered for the next request."""

    turn_id: str
    role: Literal["customer", "assistant"]
    content: str


class ExcludedSource(BaseModel):
    """A source omitted from context with a deterministic reason."""

    source_id: str
    reason: str


class ContextReport(BaseModel):
    """The rendered context and the decisions used to assemble it."""

    rendered_context: str
    included_source_ids: list[str]
    excluded_sources: list[ExcludedSource]
    selected_conversation_turn_ids: list[str] = Field(default_factory=list)
    estimated_input_tokens: int
    input_budget_tokens: int
    output_reserve_tokens: int

    @property
    def excluded_source_ids(self) -> list[str]:
        return [item.source_id for item in self.excluded_sources]


class SupportResponse(BaseModel):
    """A customer facing response and its evidence contract."""

    outcome: ResponseOutcome
    message: str = Field(min_length=1)
    evidence_ids: list[str] = Field(default_factory=list)
    missing_information: list[str] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_outcome_contract(self) -> "SupportResponse":
        if self.outcome == "answered" and not self.evidence_ids:
            raise ValueError("an answered response requires evidence")
        if self.outcome == "needs_information" and not self.missing_information:
            raise ValueError("a needs_information response must name missing_information")
        return self


class ModelCallTrace(BaseModel):
    """Metadata for one model request."""

    name: str
    provider: str
    model: str
    prompt_version: str
    latency_ms: float
    input_tokens: int | None = None
    output_tokens: int | None = None
    cached_input_tokens: int | None = None
    provider_request_id: str | None = None
    completion_status: str
    error: str | None = None


class RunTrace(BaseModel):
    """Inspectable record of the fixed application workflow."""

    trace_id: str
    model_calls: list[ModelCallTrace] = Field(default_factory=list)
    selected_evidence_ids: list[str] = Field(default_factory=list)
    excluded_evidence: list[ExcludedSource] = Field(default_factory=list)
    validation_stages: list[str] = Field(default_factory=list)
    completion_reason: str = "not_started"
    end_to_end_ms: float | None = None

    @property
    def model_call_count(self) -> int:
        return len(self.model_calls)
