from __future__ import annotations

import json
from dataclasses import dataclass
from time import perf_counter
from typing import Any, Generic, Protocol, TypeVar

from langchain_core.messages import BaseMessage, HumanMessage
from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI
from pydantic import BaseModel

from support_assistant.config import Settings
from support_assistant.models import ModelCallTrace, SupportRequest, SupportResponse


StructuredValue = TypeVar("StructuredValue", bound=BaseModel)


class PaidAPICallNotAllowed(RuntimeError):
    """A hosted model was selected without explicit run authorization."""


@dataclass(frozen=True)
class ModelInvocation(Generic[StructuredValue]):
    """A validated result paired with observable call metadata."""

    value: StructuredValue
    trace: ModelCallTrace


class ModelCallFailure(RuntimeError):
    """A model call failed after producing trace metadata."""

    def __init__(self, message: str, trace: ModelCallTrace) -> None:
        super().__init__(message)
        self.trace = trace


class SupportModel(Protocol):
    """The two model operations required by the fixed workflow."""

    def analyze(
        self,
        messages: list[BaseMessage],
        prompt_version: str,
    ) -> ModelInvocation[SupportRequest]: ...

    def respond(
        self,
        messages: list[BaseMessage],
        prompt_version: str,
    ) -> ModelInvocation[SupportResponse]: ...


def _usage(raw: Any) -> tuple[int | None, int | None, int | None]:
    usage = getattr(raw, "usage_metadata", None) or {}
    details = usage.get("input_token_details") or {}
    return (
        usage.get("input_tokens"),
        usage.get("output_tokens"),
        details.get("cache_read"),
    )


def _request_id(raw: Any) -> str | None:
    metadata = getattr(raw, "response_metadata", None) or {}
    headers = metadata.get("headers") or {}
    return headers.get("x-request-id") or metadata.get("id")


def _completion_status(raw: Any) -> str:
    metadata = getattr(raw, "response_metadata", None) or {}
    reason = (
        metadata.get("finish_reason")
        or metadata.get("stop_reason")
        or metadata.get("done_reason")
        or "completed"
    )
    if reason in {"stop", "completed", "complete"}:
        return "completed"
    if reason in {"length", "max_tokens", "output_limit"}:
        return "output_limit"
    return str(reason)


class LangChainSupportModel:
    """Provider-specific structured output behind one small interface."""

    def __init__(self, model: Any, provider: str, model_name: str) -> None:
        self.model = model
        self.provider = provider
        self.model_name = model_name

    def analyze(
        self,
        messages: list[BaseMessage],
        prompt_version: str,
    ) -> ModelInvocation[SupportRequest]:
        return self._invoke_structured(
            schema=SupportRequest,
            messages=messages,
            call_name="analyze_support_request",
            prompt_version=prompt_version,
        )

    def respond(
        self,
        messages: list[BaseMessage],
        prompt_version: str,
    ) -> ModelInvocation[SupportResponse]:
        return self._invoke_structured(
            schema=SupportResponse,
            messages=messages,
            call_name="generate_support_response",
            prompt_version=prompt_version,
        )

    def _invoke_structured(
        self,
        *,
        schema: type[StructuredValue],
        messages: list[BaseMessage],
        call_name: str,
        prompt_version: str,
    ) -> ModelInvocation[StructuredValue]:
        started = perf_counter()
        raw = None

        try:
            if self.provider == "openai":
                structured_model = self.model.with_structured_output(
                    schema,
                    method="json_schema",
                    include_raw=True,
                )
                result = structured_model.invoke(messages)
                raw = result["raw"]
                parsed = result.get("parsed")
                parsing_error = result.get("parsing_error")
                if parsing_error is not None:
                    raise parsing_error
                if parsed is None:
                    raise ValueError("provider returned no parsed structured output")
            else:
                schema_instruction = HumanMessage(
                    content=(
                        "Return only one JSON object matching this JSON Schema.\n"
                        + json.dumps(schema.model_json_schema(), separators=(",", ":"))
                    )
                )
                raw = self.model.invoke([*messages, schema_instruction])
                parsed = schema.model_validate_json(raw.text)

            input_tokens, output_tokens, cached_input_tokens = _usage(raw)
            trace = ModelCallTrace(
                name=call_name,
                provider=self.provider,
                model=self.model_name,
                prompt_version=prompt_version,
                latency_ms=round((perf_counter() - started) * 1000, 1),
                input_tokens=input_tokens,
                output_tokens=output_tokens,
                cached_input_tokens=cached_input_tokens,
                provider_request_id=_request_id(raw),
                completion_status=_completion_status(raw),
            )
            return ModelInvocation(value=parsed, trace=trace)
        except Exception as error:
            trace = ModelCallTrace(
                name=call_name,
                provider=self.provider,
                model=self.model_name,
                prompt_version=prompt_version,
                latency_ms=round((perf_counter() - started) * 1000, 1),
                provider_request_id=_request_id(raw) if raw is not None else None,
                completion_status=(
                    _completion_status(raw) if raw is not None else "error"
                ),
                error=f"{type(error).__name__}: {error}",
            )
            raise ModelCallFailure(str(error), trace) from error


def create_model(settings: Settings) -> LangChainSupportModel:
    """Create the selected provider client without hiding paid call consent."""

    if settings.provider == "openai":
        if not settings.allow_paid_api_calls:
            raise PaidAPICallNotAllowed(
                "Set ALLOW_PAID_API_CALLS=true before using the hosted model"
            )
        if not settings.openai_api_key:
            raise ValueError("OPENAI_API_KEY is required for the OpenAI provider")
        model = ChatOpenAI(
            model=settings.model,
            api_key=settings.openai_api_key,
            timeout=20,
            max_retries=2,
            max_tokens=settings.output_reserve_tokens,
            stream_usage=True,
            include_response_headers=True,
            use_responses_api=True,
        )
    else:
        model = ChatOllama(
            model=settings.model,
            base_url=settings.ollama_host,
            num_predict=settings.output_reserve_tokens,
            temperature=0,
            reasoning=False,
            format="json",
        )

    return LangChainSupportModel(
        model=model,
        provider=settings.provider,
        model_name=settings.model,
    )
