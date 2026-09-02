from __future__ import annotations

import os
from time import perf_counter

from dotenv import load_dotenv
from openai import OpenAI

from customer_service_lab.shared import (
    ModelCallMetrics,
    RunTrace,
    SupportRequest,
    configured_model,
    openai_usage,
    safe_error_name,
)

ANALYZER_PROMPT_VERSION = "support-analyzer.provider.v1"
EXPLANATION_PROMPT_VERSION = "support-explanation.provider.v1"
ANALYZER_OUTPUT_BUDGET = 250
EXPLANATION_OUTPUT_BUDGET = 180
RETRY_LIMIT = 2

ANALYZER_INSTRUCTIONS = """
Classify the support request. Extract a five digit order number only when the
customer provides one. State whether verified order data is needed and list
any missing information. Do not invent customer or order details.
""".strip()

EXPLANATION_INSTRUCTIONS = """
Explain the support request analysis in two short sentences. Do not claim that
an order lookup has occurred. Ask for missing information when needed.
""".strip()


def analyze_request(
    client: OpenAI,
    model: str,
    customer_message: str,
    trace: RunTrace,
) -> SupportRequest:
    """Classify one customer message and return a validated SupportRequest."""

    # One metrics object follows this model call through success or failure.
    call = ModelCallMetrics(
        name="analyze_support_request",
        model=model,
        prompt_version=ANALYZER_PROMPT_VERSION,
        configured_output_budget_tokens=ANALYZER_OUTPUT_BUDGET,
        configured_retry_limit=RETRY_LIMIT,
    )
    started = perf_counter()

    try:
        # The provider receives the instructions, customer input, and Pydantic
        # response contract in one request.
        response = client.responses.parse(
            model=model,
            instructions=ANALYZER_INSTRUCTIONS,
            input=customer_message,
            text_format=SupportRequest,
            max_output_tokens=ANALYZER_OUTPUT_BUDGET,
        )
        call.latency_ms = round((perf_counter() - started) * 1000, 1)
        call.provider_request_id = getattr(response, "_request_id", None)
        call.usage = openai_usage(response)
        call.stop_reason = getattr(response, "status", None)

        # output_parsed is safe to use only when the provider returned an
        # object that satisfied the SupportRequest contract.
        analysis = response.output_parsed
        if analysis is None:
            raise ValueError("The model did not return a parsed support request")

        call.validation_result = "passed"
        return analysis
    except Exception as error:
        call.latency_ms = round((perf_counter() - started) * 1000, 1)
        call.validation_result = "failed"
        call.error = safe_error_name(error)
        trace.errors.append(call.error)
        raise
    finally:
        # Record the attempted call even when the provider or validation fails.
        trace.model_calls.append(call)
        trace.model_call_count += 1
        trace.step_count += 1


def stream_explanation(
    client: OpenAI,
    model: str,
    analysis: SupportRequest,
    trace: RunTrace,
) -> str:
    """Stream a short explanation and measure first output and total latency."""

    call = ModelCallMetrics(
        name="stream_support_explanation",
        model=model,
        prompt_version=EXPLANATION_PROMPT_VERSION,
        configured_output_budget_tokens=EXPLANATION_OUTPUT_BUDGET,
        configured_retry_limit=RETRY_LIMIT,
    )
    started = perf_counter()
    pieces: list[str] = []

    try:
        # The second request receives validated analysis rather than the
        # original customer message.
        with client.responses.stream(
            model=model,
            instructions=EXPLANATION_INSTRUCTIONS,
            input=analysis.model_dump_json(),
            max_output_tokens=EXPLANATION_OUTPUT_BUDGET,
        ) as stream:
            for event in stream:
                # A provider stream contains several event types. Only text
                # deltas belong in the visible explanation.
                if event.type != "response.output_text.delta":
                    continue
                if call.ttft_ms is None:
                    call.ttft_ms = round((perf_counter() - started) * 1000, 1)
                pieces.append(event.delta)
                print(event.delta, end="", flush=True)

            response = stream.get_final_response()

        call.latency_ms = round((perf_counter() - started) * 1000, 1)
        call.provider_request_id = getattr(response, "_request_id", None)
        call.usage = openai_usage(response)
        call.stop_reason = getattr(response, "status", None)
        call.validation_result = "not_applicable"
        return "".join(pieces)
    except Exception as error:
        call.latency_ms = round((perf_counter() - started) * 1000, 1)
        call.error = safe_error_name(error)
        trace.errors.append(call.error)
        raise
    finally:
        # Keep both completed and failed streaming calls visible in the trace.
        trace.model_calls.append(call)
        trace.model_call_count += 1
        trace.step_count += 1


def main() -> None:
    """Load local configuration and run the direct OpenAI SDK example."""

    # Environment values keep secrets and changeable inputs outside source.
    load_dotenv()
    model = configured_model()
    customer_message = os.getenv(
        "CUSTOMER_MESSAGE",
        "Where is order 10492? It was supposed to arrive yesterday.",
    )
    trace = RunTrace(model=model, prompt_version=ANALYZER_PROMPT_VERSION)
    started = perf_counter()

    try:
        # This client is used for both model calls in the example.
        client = OpenAI(timeout=20, max_retries=RETRY_LIMIT)
        analysis = analyze_request(client, model, customer_message, trace)
        print("Structured analysis")
        print(analysis.model_dump_json(indent=2))
        print("\nStreamed explanation")
        stream_explanation(client, model, analysis, trace)
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
