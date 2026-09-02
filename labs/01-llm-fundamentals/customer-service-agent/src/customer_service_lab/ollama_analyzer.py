from __future__ import annotations

import os
from time import perf_counter
from typing import Any

from dotenv import load_dotenv
from ollama import Client, ResponseError
from pydantic import ValidationError

from customer_service_lab.shared import (
    ModelCallMetrics,
    RunTrace,
    SupportRequest,
    ollama_usage,
    safe_error_name,
)

ANALYZER_PROMPT_VERSION = "support-analyzer.ollama.v1"
EXPLANATION_PROMPT_VERSION = "support-explanation.ollama.v1"
ANALYZER_OUTPUT_BUDGET = 250
EXPLANATION_OUTPUT_BUDGET = 180

ANALYZER_INSTRUCTIONS = """
Classify the support request. Extract a five digit order number only when the
customer provides one. State whether verified order data is needed and list
any missing information. Do not invent customer or order details.

Return only one JSON object with these exact fields:
{
  "issue_type": "order_status, damaged_item, refund, or other",
  "order_id": "a five digit order number or null",
  "needs_order_data": true,
  "missing_details": ["a list of missing details"]
}
""".strip()

EXPLANATION_INSTRUCTIONS = """
Explain the supplied support analysis in two short sentences. Do not claim
that an order lookup has occurred. Ask for missing information when needed.
""".strip()


def local_failure_message(error: Exception, host: str, model: str) -> str:
    """Give the learner a specific next step without printing request data."""

    if isinstance(error, ConnectionError):
        return (
            f"Could not connect to Ollama at {host}. Confirm that the Ollama "
            "application is running and that OLLAMA_HOST uses its local address."
        )

    if isinstance(error, ResponseError) and error.status_code == 404:
        return (
            f"Ollama is reachable, but {model} is not installed. "
            f"Run `ollama pull {model}` and try again."
        )

    if isinstance(error, ResponseError):
        return (
            f"Ollama returned an error while running {model}: {error.error} "
            "Check the message above before trying again."
        )

    if isinstance(error, ValidationError):
        return (
            "The local model returned data that did not match the SupportRequest "
            "contract. Run the request again or use the hosted route while "
            "investigating the local model output."
        )

    return (
        f"The local run stopped with {safe_error_name(error)}. Check the run "
        "metadata below before trying again."
    )


def analyze_request(
    client: Client,
    model: str,
    customer_message: str,
    trace: RunTrace,
) -> SupportRequest:
    """Ask the local model for JSON and validate it as a SupportRequest."""

    call = ModelCallMetrics(
        name="analyze_support_request",
        model=model,
        prompt_version=ANALYZER_PROMPT_VERSION,
        configured_output_budget_tokens=ANALYZER_OUTPUT_BUDGET,
        configured_retry_limit=0,
    )
    started = perf_counter()

    try:
        # qwen3:14b receives an explicit JSON instruction. Pydantic performs
        # the application-side validation after Ollama returns.
        response = client.chat(
            model=model,
            messages=[
                {"role": "system", "content": ANALYZER_INSTRUCTIONS},
                {"role": "user", "content": customer_message},
            ],
            options={"num_predict": ANALYZER_OUTPUT_BUDGET, "temperature": 0},
            think=False,
        )
        call.latency_ms = round((perf_counter() - started) * 1000, 1)
        call.usage = ollama_usage(response)
        call.stop_reason = getattr(response, "done_reason", None)

        analysis = SupportRequest.model_validate_json(response.message.content)
        call.validation_result = "passed"
        return analysis
    except Exception as error:
        call.latency_ms = round((perf_counter() - started) * 1000, 1)
        call.validation_result = "failed"
        call.error = safe_error_name(error)
        trace.errors.append(call.error)
        raise
    finally:
        # Local calls are recorded even though they have no provider request id.
        trace.model_calls.append(call)
        trace.model_call_count += 1
        trace.step_count += 1


def stream_explanation(
    client: Client,
    model: str,
    analysis: SupportRequest,
    trace: RunTrace,
) -> str:
    """Stream a local explanation and record Ollama timing and token counts."""

    call = ModelCallMetrics(
        name="stream_support_explanation",
        model=model,
        prompt_version=EXPLANATION_PROMPT_VERSION,
        configured_output_budget_tokens=EXPLANATION_OUTPUT_BUDGET,
        configured_retry_limit=0,
    )
    started = perf_counter()
    pieces: list[str] = []
    final_chunk: Any | None = None

    try:
        # The validated analysis becomes the input to a separate explanation
        # call, matching the hosted examples in this lab.
        stream = client.chat(
            model=model,
            messages=[
                {"role": "system", "content": EXPLANATION_INSTRUCTIONS},
                {"role": "user", "content": analysis.model_dump_json()},
            ],
            stream=True,
            options={"num_predict": EXPLANATION_OUTPUT_BUDGET, "temperature": 0},
            think=False,
        )
        for chunk in stream:
            # Ollama supplies usage totals on the final stream chunk.
            final_chunk = chunk
            text = chunk.message.content or ""
            if not text:
                continue
            if call.ttft_ms is None:
                call.ttft_ms = round((perf_counter() - started) * 1000, 1)
            pieces.append(text)
            print(text, end="", flush=True)

        if final_chunk is None:
            raise ValueError("Ollama returned an empty stream")

        call.latency_ms = round((perf_counter() - started) * 1000, 1)
        call.usage = ollama_usage(final_chunk)
        call.stop_reason = getattr(final_chunk, "done_reason", None)
        call.validation_result = "not_applicable"
        return "".join(pieces)
    except Exception as error:
        call.latency_ms = round((perf_counter() - started) * 1000, 1)
        call.error = safe_error_name(error)
        trace.errors.append(call.error)
        raise
    finally:
        # Preserve failed calls in the same trace shape as hosted calls.
        trace.model_calls.append(call)
        trace.model_call_count += 1
        trace.step_count += 1


def main() -> None:
    """Load Ollama settings and run both local analyzer model calls."""

    load_dotenv()
    model = os.getenv("OLLAMA_MODEL", "qwen3:14b")
    host = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    customer_message = os.getenv(
        "CUSTOMER_MESSAGE",
        "Where is order 10492? It was supposed to arrive yesterday.",
    )
    trace = RunTrace(model=model, prompt_version=ANALYZER_PROMPT_VERSION)
    started = perf_counter()

    try:
        # The local client sends requests to the Ollama service configured in
        # OLLAMA_HOST and never needs an OpenAI API key.
        client = Client(host=host)
        analysis = analyze_request(client, model, customer_message, trace)
        print("Structured analysis")
        print(analysis.model_dump_json(indent=2))
        print("\nStreamed explanation")
        stream_explanation(client, model, analysis, trace)
        print()
        trace.stop_reason = "completed"
        trace.validation_result = "passed"
    except Exception as error:
        print(local_failure_message(error, host, model))
        trace.stop_reason = "error"
        trace.validation_result = "failed"
    finally:
        trace.end_to_end_ms = round((perf_counter() - started) * 1000, 1)
        trace.print_summary()


if __name__ == "__main__":
    main()
