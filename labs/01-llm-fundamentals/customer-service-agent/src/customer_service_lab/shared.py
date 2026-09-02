from __future__ import annotations

import json
import os
from dataclasses import asdict, dataclass, field
from typing import Any, Literal
from uuid import uuid4

from pydantic import BaseModel, Field, model_validator


class SupportRequest(BaseModel):
    """Information the application needs before deciding its next step."""

    issue_type: Literal["order_status", "damaged_item", "refund", "other"] = Field(
        description="The support issue expressed by the customer"
    )
    # The key is required. None represents a request with no order number.
    order_id: str | None = Field(
        description="A five digit order number when one is present, otherwise null",
        pattern=r"^\d{5}$",
    )
    needs_order_data: bool = Field(
        description="Whether verified order data is required to answer the request"
    )
    missing_details: list[str] = Field(
        description="Information the customer still needs to provide"
    )


class CustomerReply(BaseModel):
    """The validated response returned by the customer service agent."""

    message: str = Field(
        description="A concise response written for the customer", min_length=1
    )
    source: Literal[
        "verified_order_data", "request_for_information", "safe_fallback"
    ] = Field(description="The basis for the response")
    order_verified: bool = Field(
        description="Whether the response uses an authorized order lookup result"
    )

    @model_validator(mode="after")
    def require_consistent_verification(self) -> CustomerReply:
        """Keep the declared source consistent with the verification flag."""

        uses_verified_data = self.source == "verified_order_data"
        if uses_verified_data != self.order_verified:
            raise ValueError("source and order_verified must describe the same result")
        return self


@dataclass
class TokenUsage:
    """Token counters reported by a provider for one model call."""

    input_tokens: int | None = None
    output_tokens: int | None = None
    cached_input_tokens: int | None = None


@dataclass
class ModelCallMetrics:
    """Timing, usage, validation, and provider data for one model call."""

    name: str
    model: str
    prompt_version: str
    configured_output_budget_tokens: int | None = None
    configured_retry_limit: int | None = None
    provider_request_id: str | None = None
    usage: TokenUsage = field(default_factory=TokenUsage)
    ttft_ms: float | None = None
    latency_ms: float | None = None
    stop_reason: str | None = None
    validation_result: str | None = None
    error: str | None = None


@dataclass
class RunTrace:
    """Operational metadata collected across one complete application run."""

    model: str
    prompt_version: str
    provider: str | None = None
    trace_id: str = field(default_factory=lambda: str(uuid4()))
    model_calls: list[ModelCallMetrics] = field(default_factory=list)
    configured_output_budget_tokens: int | None = None
    model_call_count: int = 0
    tool_call_count: int = 0
    tool_name: str | None = None
    tool_latency_ms: float | None = None
    tool_result: str | None = None
    argument_validation_result: str | None = None
    authorization_result: str | None = None
    step_count: int = 0
    stop_reason: str | None = None
    validation_result: str | None = None
    errors: list[str] = field(default_factory=list)
    end_to_end_ms: float | None = None

    def print_summary(self) -> None:
        """Print operational metadata without prompts, tool arguments, or tool data."""

        print("\nRun metadata")
        print(json.dumps(asdict(self), indent=2))


def configured_model() -> str:
    """Read the hosted model name while providing a practical default."""

    return os.getenv("OPENAI_MODEL", "gpt-5.4-mini")


def openai_usage(response: Any) -> TokenUsage:
    """Convert OpenAI SDK usage fields into the shared trace format."""

    usage = getattr(response, "usage", None)
    details = getattr(usage, "input_tokens_details", None)
    return TokenUsage(
        input_tokens=getattr(usage, "input_tokens", None),
        output_tokens=getattr(usage, "output_tokens", None),
        cached_input_tokens=getattr(details, "cached_tokens", None),
    )


def ollama_usage(response: Any) -> TokenUsage:
    """Convert Ollama token counters into the trace format used by this lab."""

    return TokenUsage(
        input_tokens=getattr(response, "prompt_eval_count", None),
        output_tokens=getattr(response, "eval_count", None),
    )


def langchain_usage(message: Any) -> TokenUsage:
    """Convert LangChain message usage metadata into the trace format."""

    usage = getattr(message, "usage_metadata", None) or {}
    details = usage.get("input_token_details") or {}
    return TokenUsage(
        input_tokens=usage.get("input_tokens"),
        output_tokens=usage.get("output_tokens"),
        cached_input_tokens=details.get("cache_read")
        or details.get("cached_tokens"),
    )


def langchain_request_id(message: Any) -> str | None:
    """Read a provider request identifier from LangChain response metadata."""

    metadata = getattr(message, "response_metadata", None) or {}
    headers = metadata.get("headers") or {}
    for name, value in headers.items():
        if name.lower() == "x-request-id":
            return value
    return metadata.get("request_id")


def langchain_stop_reason(message: Any) -> str | None:
    """Read the provider's completion reason from normalized metadata."""

    metadata = getattr(message, "response_metadata", None) or {}
    return (
        metadata.get("finish_reason")
        or metadata.get("done_reason")
        or metadata.get("status")
    )


def safe_error_name(error: Exception) -> str:
    """Record the error type without copying request or customer data into logs."""

    return type(error).__name__
