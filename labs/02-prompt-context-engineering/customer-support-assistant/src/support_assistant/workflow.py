from __future__ import annotations

import argparse
import json
from datetime import date
from pathlib import Path
from time import perf_counter
from typing import Iterable
from uuid import uuid4

from pydantic import BaseModel

from support_assistant.config import Settings
from support_assistant.context import (
    ContextBudgetExceeded,
    build_context,
    load_conversation,
)
from support_assistant.models import (
    ContextReport,
    ConversationTurn,
    RunTrace,
    SupportRequest,
    SupportResponse,
)
from support_assistant.prompts import (
    PromptVersion,
    render_analysis_messages,
    render_response_messages,
)
from support_assistant.providers import ModelCallFailure, SupportModel, create_model
from support_assistant.validation import validate_support_response


RESPONSE_PROMPT_VERSION = "support-response.context.v1"


class WorkflowResult(BaseModel):
    """Final application result with its intermediate contracts."""

    request: SupportRequest | None = None
    context: ContextReport | None = None
    response: SupportResponse
    trace: RunTrace


def format_workflow_result(result: WorkflowResult) -> str:
    """Format the contracts learners should inspect after one run."""

    request = result.request.model_dump(mode="json") if result.request else None
    context = (
        {
            "included_source_ids": result.context.included_source_ids,
            "excluded_sources": [
                source.model_dump(mode="json")
                for source in result.context.excluded_sources
            ],
            "selected_conversation_turn_ids": (
                result.context.selected_conversation_turn_ids
            ),
            "estimated_input_tokens": result.context.estimated_input_tokens,
            "input_budget_tokens": result.context.input_budget_tokens,
            "output_reserve_tokens": result.context.output_reserve_tokens,
        }
        if result.context
        else None
    )
    parts = [
        "Customer response\n" + result.response.message,
        "Structured request\n" + json.dumps(request, indent=2),
        "Selected context\n" + json.dumps(context, indent=2),
        "Run metadata\n"
        + json.dumps(result.trace.model_dump(mode="json"), indent=2),
    ]
    return "\n\n".join(parts)


def _safe_failure(message: str) -> SupportResponse:
    return SupportResponse(
        outcome="cannot_answer",
        message=message,
        evidence_ids=[],
        missing_information=[],
    )


def _complete(
    *,
    started: float,
    trace: RunTrace,
    request: SupportRequest | None,
    context: ContextReport | None,
    response: SupportResponse,
) -> WorkflowResult:
    trace.end_to_end_ms = round((perf_counter() - started) * 1000, 1)
    return WorkflowResult(
        request=request,
        context=context,
        response=response,
        trace=trace,
    )


def run_support_workflow(
    *,
    model: SupportModel,
    customer_message: str,
    authenticated_customer_id: str,
    prompt_version: PromptVersion = PromptVersion.REVISED,
    conversation_history: Iterable[ConversationTurn] = (),
    input_budget_tokens: int = 4_000,
    output_reserve_tokens: int = 500,
    as_of: date | None = None,
    fixture_directory: Path | None = None,
) -> WorkflowResult:
    """Run the fixed analysis, context, response, and validation sequence."""

    started = perf_counter()
    trace = RunTrace(trace_id=str(uuid4()))
    request = None
    context = None

    try:
        analysis = model.analyze(
            render_analysis_messages(customer_message, prompt_version),
            prompt_version.value,
        )
        trace.model_calls.append(analysis.trace)
        request = analysis.value
        trace.validation_stages.extend(["analysis_completion", "analysis_schema"])
    except ModelCallFailure as error:
        trace.model_calls.append(error.trace)
        trace.completion_reason = "model_error"
        return _complete(
            started=started,
            trace=trace,
            request=None,
            context=None,
            response=_safe_failure(
                "The request could not be processed. Please try again later."
            ),
        )

    if request.missing_information or (
        request.issue_type != "other" and request.order_id is None
    ):
        missing = request.missing_information or ["order_id"]
        trace.completion_reason = "needs_information"
        return _complete(
            started=started,
            trace=trace,
            request=request,
            context=None,
            response=SupportResponse(
                outcome="needs_information",
                message="Please provide the information needed to continue: "
                + ", ".join(missing)
                + ".",
                evidence_ids=[],
                missing_information=missing,
            ),
        )

    context_arguments = {
        "request": request,
        "authenticated_customer_id": authenticated_customer_id,
        "conversation_history": conversation_history,
        "input_budget_tokens": input_budget_tokens,
        "output_reserve_tokens": output_reserve_tokens,
        "as_of": as_of,
    }
    if fixture_directory is not None:
        context_arguments["fixture_directory"] = fixture_directory

    try:
        context = build_context(**context_arguments)
        trace.selected_evidence_ids = context.included_source_ids
        trace.excluded_evidence = context.excluded_sources
        trace.validation_stages.append("context_selection")
    except PermissionError:
        trace.completion_reason = "order_unavailable"
        return _complete(
            started=started,
            trace=trace,
            request=request,
            context=None,
            response=_safe_failure(
                "I could not verify that order. Check the order number or contact support."
            ),
        )
    except ContextBudgetExceeded:
        trace.completion_reason = "context_budget_exceeded"
        return _complete(
            started=started,
            trace=trace,
            request=request,
            context=None,
            response=_safe_failure(
                "The available information could not be prepared within the request limit."
            ),
        )

    try:
        response_call = model.respond(
            render_response_messages(request, context),
            RESPONSE_PROMPT_VERSION,
        )
        trace.model_calls.append(response_call.trace)
        response = response_call.value
    except ModelCallFailure as error:
        trace.model_calls.append(error.trace)
        trace.completion_reason = "model_error"
        return _complete(
            started=started,
            trace=trace,
            request=request,
            context=context,
            response=_safe_failure(
                "A response could not be generated. Please try again later."
            ),
        )

    try:
        validation = validate_support_response(
            response,
            request,
            context,
            completion_status=response_call.trace.completion_status,
        )
        trace.validation_stages.extend(validation.stages)
    except ValueError as error:
        trace.validation_stages.append(type(error).__name__)
        trace.completion_reason = "validation_failed"
        return _complete(
            started=started,
            trace=trace,
            request=request,
            context=context,
            response=_safe_failure(
                "The generated response could not be verified from the available information."
            ),
        )

    trace.completion_reason = response.outcome
    return _complete(
        started=started,
        trace=trace,
        request=request,
        context=context,
        response=response,
    )


def main() -> None:
    """Run one request with the provider selected in the local environment."""

    parser = argparse.ArgumentParser(description="Run the customer support assistant")
    parser.add_argument(
        "message",
        nargs="?",
        default="Where is order 10492?",
        help="Customer message to process",
    )
    parser.add_argument(
        "--customer",
        default="customer_001",
        help="Authenticated synthetic customer identifier",
    )
    parser.add_argument(
        "--conversation",
        help="Optional synthetic conversation identifier from fixtures",
    )
    parser.add_argument(
        "--prompt-version",
        choices=[version.value for version in PromptVersion],
        default=PromptVersion.REVISED.value,
    )
    arguments = parser.parse_args()

    settings = Settings.from_environment()
    history = (
        load_conversation(arguments.conversation)
        if arguments.conversation
        else []
    )
    result = run_support_workflow(
        model=create_model(settings),
        customer_message=arguments.message,
        authenticated_customer_id=arguments.customer,
        prompt_version=PromptVersion(arguments.prompt_version),
        conversation_history=history,
        input_budget_tokens=settings.input_budget_tokens,
        output_reserve_tokens=settings.output_reserve_tokens,
    )
    print(format_workflow_result(result))


if __name__ == "__main__":
    main()
