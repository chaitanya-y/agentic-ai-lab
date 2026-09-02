from __future__ import annotations

import os
from time import perf_counter
from typing import Any

from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from customer_service_lab.shared import (
    ModelCallMetrics,
    RunTrace,
    SupportRequest,
    configured_model,
    langchain_request_id,
    langchain_stop_reason,
    langchain_usage,
    safe_error_name,
)

ANALYZER_PROMPT_VERSION = "support-analyzer.langchain.v1"
EXPLANATION_PROMPT_VERSION = "support-explanation.langchain.v1"
ANALYZER_OUTPUT_BUDGET = 250
EXPLANATION_OUTPUT_BUDGET = 180
RETRY_LIMIT = 2

ANALYZER_INSTRUCTIONS = """
Classify the support request. Extract a five digit order number only when the
customer provides one. State whether verified order data is needed and list
any missing information. Do not invent customer or order details.
""".strip()

EXPLANATION_INSTRUCTIONS = """
Explain the supplied support analysis in two short sentences. Do not claim
that an order lookup has occurred. Ask for missing information when needed.
""".strip()


def analyze_request(
    model: ChatOpenAI,
    customer_message: str,
    trace: RunTrace,
) -> SupportRequest:
    """Classify one message through LangChain and validate its typed result."""

    call = ModelCallMetrics(
        name="analyze_support_request",
        model=trace.model,
        prompt_version=ANALYZER_PROMPT_VERSION,
        configured_output_budget_tokens=ANALYZER_OUTPUT_BUDGET,
        configured_retry_limit=RETRY_LIMIT,
    )
    started = perf_counter()
    # LangChain wraps the chat model with the same Pydantic contract used by
    # the direct provider example.
    structured_model = model.with_structured_output(
        SupportRequest,
        method="json_schema",
        include_raw=True,
    )

    try:
        # Typed messages keep application instructions separate from user input.
        result: dict[str, Any] = structured_model.invoke(
            [
                SystemMessage(content=ANALYZER_INSTRUCTIONS),
                HumanMessage(content=customer_message),
            ],
            max_tokens=ANALYZER_OUTPUT_BUDGET,
        )
        call.latency_ms = round((perf_counter() - started) * 1000, 1)
        raw = result["raw"]
        call.provider_request_id = langchain_request_id(raw)
        call.usage = langchain_usage(raw)
        call.stop_reason = langchain_stop_reason(raw)

        if result.get("parsing_error") is not None or result.get("parsed") is None:
            raise ValueError("The structured response did not pass validation")

        call.validation_result = "passed"
        return result["parsed"]
    except Exception as error:
        call.latency_ms = round((perf_counter() - started) * 1000, 1)
        call.validation_result = "failed"
        call.error = safe_error_name(error)
        trace.errors.append(call.error)
        raise
    finally:
        # Record the attempted call whether parsing succeeds or fails.
        trace.model_calls.append(call)
        trace.model_call_count += 1
        trace.step_count += 1


def stream_explanation(
    model: ChatOpenAI,
    analysis: SupportRequest,
    trace: RunTrace,
) -> str:
    """Stream the explanation through LangChain and collect its final metadata."""

    call = ModelCallMetrics(
        name="stream_support_explanation",
        model=trace.model,
        prompt_version=EXPLANATION_PROMPT_VERSION,
        configured_output_budget_tokens=EXPLANATION_OUTPUT_BUDGET,
        configured_retry_limit=RETRY_LIMIT,
    )
    started = perf_counter()
    complete_message = None
    pieces: list[str] = []

    try:
        # Message chunks are combined so usage and completion metadata from the
        # final stream can be recorded after visible text has been printed.
        for chunk in model.stream(
            [
                SystemMessage(content=EXPLANATION_INSTRUCTIONS),
                HumanMessage(content=analysis.model_dump_json()),
            ],
            max_tokens=EXPLANATION_OUTPUT_BUDGET,
        ):
            complete_message = chunk if complete_message is None else complete_message + chunk
            text = chunk.text
            if not text:
                continue
            if call.ttft_ms is None:
                call.ttft_ms = round((perf_counter() - started) * 1000, 1)
            pieces.append(text)
            print(text, end="", flush=True)

        if complete_message is None:
            raise ValueError("The model returned an empty stream")

        call.latency_ms = round((perf_counter() - started) * 1000, 1)
        call.provider_request_id = langchain_request_id(complete_message)
        call.usage = langchain_usage(complete_message)
        call.stop_reason = langchain_stop_reason(complete_message)
        call.validation_result = "not_applicable"
        return "".join(pieces)
    except Exception as error:
        call.latency_ms = round((perf_counter() - started) * 1000, 1)
        call.error = safe_error_name(error)
        trace.errors.append(call.error)
        raise
    finally:
        # A failed stream remains part of the application trace.
        trace.model_calls.append(call)
        trace.model_call_count += 1
        trace.step_count += 1


def main() -> None:
    """Configure ChatOpenAI and run the LangChain analyzer example."""

    load_dotenv()
    model_name = configured_model()
    customer_message = os.getenv(
        "CUSTOMER_MESSAGE",
        "Where is order 10492? It was supposed to arrive yesterday.",
    )
    trace = RunTrace(model=model_name, prompt_version=ANALYZER_PROMPT_VERSION)
    started = perf_counter()

    try:
        # ChatOpenAI exposes OpenAI through LangChain's common chat model API.
        model = ChatOpenAI(
            model=model_name,
            timeout=20,
            max_retries=RETRY_LIMIT,
            stream_usage=True,
            include_response_headers=True,
            use_responses_api=True,
        )
        analysis = analyze_request(model, customer_message, trace)
        print("Structured analysis")
        print(analysis.model_dump_json(indent=2))
        print("\nStreamed explanation")
        stream_explanation(model, analysis, trace)
        print()
        trace.stop_reason = "completed"
        trace.validation_result = "passed"
    except Exception:
        print("The request failed. Review the error type in the run metadata.")
        trace.stop_reason = "error"
        trace.validation_result = "failed"
    finally:
        trace.end_to_end_ms = round((perf_counter() - started) * 1000, 1)
        trace.print_summary()


if __name__ == "__main__":
    main()
