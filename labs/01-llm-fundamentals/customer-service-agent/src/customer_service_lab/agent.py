from __future__ import annotations

import json
import os
from time import perf_counter
from typing import Any

from dotenv import load_dotenv
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage, ToolMessage
from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field, ValidationError, field_validator

from customer_service_lab.shared import (
    CustomerReply,
    ModelCallMetrics,
    RunTrace,
    configured_model,
    langchain_request_id,
    langchain_stop_reason,
    langchain_usage,
    safe_error_name,
)

AGENT_PROMPT_VERSION = "customer-service-agent.v1"
MAX_MODEL_CALLS = 2
MAX_TOOL_CALLS = 1
AGENT_OUTPUT_BUDGET = 300
RETRY_LIMIT = 2

AGENT_INSTRUCTIONS = """
You are a customer service agent for order status questions.

Use LookupOrder only when the customer provides a five digit order number and
verified order data is needed. Never invent an order number or order status.
If an order number is missing, ask the customer for it. The application checks
customer access and executes tools. You do not control either action.
""".strip()

OLLAMA_REPLY_INSTRUCTIONS = """
Return the final customer response as one JSON object with these exact fields:
{
  "message": "a concise response for the customer",
  "source": "verified_order_data, request_for_information, or safe_fallback",
  "order_verified": true
}

Use verified_order_data and true only when an authorized tool result contains
the order facts. Otherwise use safe_fallback and false. Return JSON only.
""".strip()


def create_agent_model() -> tuple[Any, str, str]:
    """Create the configured LangChain model and return its name and provider."""

    # Provider selection is explicit so a model name never controls routing.
    provider = os.getenv("MODEL_PROVIDER", "openai").strip().lower()

    if provider == "openai":
        # Hosted calls expose OpenAI request identifiers and usage metadata.
        model_name = configured_model()
        model = ChatOpenAI(
            model=model_name,
            timeout=20,
            max_retries=RETRY_LIMIT,
            max_tokens=AGENT_OUTPUT_BUDGET,
            stream_usage=True,
            include_response_headers=True,
            use_responses_api=True,
        )
        return model, model_name, provider

    if provider == "ollama":
        # The local model uses the same LangChain interface. Reasoning is
        # disabled so this small task spends its budget on required output.
        model_name = os.getenv("OLLAMA_MODEL", "qwen3:14b")
        model = ChatOllama(
            model=model_name,
            base_url=os.getenv("OLLAMA_HOST", "http://localhost:11434"),
            num_predict=AGENT_OUTPUT_BUDGET,
            temperature=0,
            reasoning=False,
        )
        return model, model_name, provider

    raise ValueError("MODEL_PROVIDER must be openai or ollama")


class LookupOrder(BaseModel):
    """Look up the current status of one order."""

    order_id: str = Field(
        description="The five digit order number supplied by the customer"
    )

    @field_validator("order_id")
    @classmethod
    def require_five_digits(cls, value: str) -> str:
        """Reject malformed order identifiers before a lookup can execute."""

        if len(value) != 5 or not value.isdigit():
            raise ValueError("order_id must contain five digits")
        return value


class OrderRecord(BaseModel):
    """Limited order fields that the tool is permitted to return."""

    order_id: str
    status: str
    expected_delivery: str
    latest_update: str


class OrderStore:
    """A local stand in for an authenticated order service."""

    def __init__(self) -> None:
        """Create one local record representing an authenticated order service."""

        self._orders = {
            ("customer_001", "10492"): OrderRecord(
                order_id="10492",
                status="In transit",
                expected_delivery="Tomorrow by 8 PM",
                latest_update="Departed the regional distribution center",
            )
        }

    def lookup(self, authenticated_customer_id: str, order_id: str) -> OrderRecord:
        """Return an order only when it belongs to the authenticated customer."""

        # Customer identity comes from trusted application state, not the model.
        record = self._orders.get((authenticated_customer_id, order_id))
        if record is None:
            # The same result is used for missing and unauthorized orders so the
            # application does not reveal whether another customer's order exists.
            raise PermissionError("Order is unavailable to this customer")
        return record


def stream_decision(
    model_with_tools: Any,
    messages: list[Any],
    model_name: str,
    trace: RunTrace,
) -> AIMessage:
    """Ask the model to request one tool or return a clarification question."""

    call = ModelCallMetrics(
        name="choose_next_action",
        model=model_name,
        prompt_version=AGENT_PROMPT_VERSION,
        configured_output_budget_tokens=AGENT_OUTPUT_BUDGET,
        configured_retry_limit=RETRY_LIMIT,
    )
    started = perf_counter()
    complete_message = None

    try:
        # Tool call chunks must be combined before LangChain can expose the
        # complete tool name, identifier, and arguments.
        for chunk in model_with_tools.stream(messages):
            complete_message = chunk if complete_message is None else complete_message + chunk
            has_output = bool(chunk.text or getattr(chunk, "tool_call_chunks", None))
            if has_output and call.ttft_ms is None:
                call.ttft_ms = round((perf_counter() - started) * 1000, 1)

        if complete_message is None:
            raise ValueError("The model returned an empty stream")

        call.latency_ms = round((perf_counter() - started) * 1000, 1)
        call.provider_request_id = langchain_request_id(complete_message)
        call.usage = langchain_usage(complete_message)
        call.stop_reason = langchain_stop_reason(complete_message)
        call.validation_result = "passed"
        # The loop needs only the completed text and proposed tool calls.
        return AIMessage(
            content=complete_message.content,
            tool_calls=complete_message.tool_calls,
        )
    except Exception as error:
        call.latency_ms = round((perf_counter() - started) * 1000, 1)
        call.validation_result = "failed"
        call.error = safe_error_name(error)
        trace.errors.append(call.error)
        raise
    finally:
        # Record the decision call even when streaming fails.
        trace.model_calls.append(call)
        trace.model_call_count += 1
        trace.step_count += 1


def create_final_reply(
    model: Any,
    messages: list[Any],
    model_name: str,
    trace: RunTrace,
    provider: str | None = None,
) -> CustomerReply:
    """Generate and validate the customer response after tool processing."""

    call = ModelCallMetrics(
        name="write_validated_customer_reply",
        model=model_name,
        prompt_version=AGENT_PROMPT_VERSION,
        configured_output_budget_tokens=AGENT_OUTPUT_BUDGET,
        configured_retry_limit=RETRY_LIMIT,
    )
    started = perf_counter()

    try:
        if provider == "ollama":
            # qwen3:14b may ignore a forced CustomerReply tool call. Request
            # JSON through the common model interface and validate it locally.
            raw = model.invoke(
                [*messages, HumanMessage(content=OLLAMA_REPLY_INSTRUCTIONS)]
            )
            try:
                parsed = CustomerReply.model_validate_json(raw.text)
                parsing_error = None
            except ValidationError as error:
                parsed = None
                parsing_error = error
            result: dict[str, Any] = {
                "raw": raw,
                "parsed": parsed,
                "parsing_error": parsing_error,
            }
        else:
            # OpenAI can use function calling to fill the CustomerReply schema.
            structured_model = model.with_structured_output(
                CustomerReply,
                method="function_calling",
                include_raw=True,
            )
            result = structured_model.invoke(messages)

        call.latency_ms = round((perf_counter() - started) * 1000, 1)
        raw = result["raw"]
        call.provider_request_id = langchain_request_id(raw)
        call.usage = langchain_usage(raw)
        call.stop_reason = langchain_stop_reason(raw)

        # Classify structural failures without storing raw customer content.
        if result.get("parsing_error") is not None or result.get("parsed") is None:
            raw_tool_calls = getattr(raw, "tool_calls", None) or []
            invalid_tool_calls = getattr(raw, "invalid_tool_calls", None) or []
            parsing_error = result.get("parsing_error")

            if invalid_tool_calls:
                call.error = "InvalidCustomerReplyToolArguments"
            elif provider != "ollama" and not raw_tool_calls:
                call.error = "MissingCustomerReplyToolCall"
            elif parsing_error is not None:
                call.error = (
                    "CustomerReplyParsingError:"
                    f"{safe_error_name(parsing_error)}"
                )
            else:
                call.error = "MissingParsedCustomerReply"

            trace.errors.append(call.error)
            raise ValueError(call.error)

        call.validation_result = "passed"
        return result["parsed"]
    except Exception as error:
        call.latency_ms = round((perf_counter() - started) * 1000, 1)
        call.validation_result = "failed"
        if call.error is None:
            call.error = safe_error_name(error)
            trace.errors.append(call.error)
        raise
    finally:
        # Preserve the final model attempt even when output validation fails.
        trace.model_calls.append(call)
        trace.model_call_count += 1
        trace.step_count += 1


def safe_fallback() -> CustomerReply:
    """Return a response that makes no unverified order claim."""

    return CustomerReply(
        message="I could not verify that order. Please check the order number or contact support.",
        source="safe_fallback",
        order_verified=False,
    )


def run_agent(
    model: Any,
    model_name: str,
    customer_message: str,
    authenticated_customer_id: str,
    order_store: OrderStore | None = None,
    provider: str | None = None,
) -> tuple[CustomerReply, RunTrace]:
    """Run the bounded agent and return its validated reply and trace."""

    # This trace describes the complete request across model and tool steps.
    trace = RunTrace(
        model=model_name,
        prompt_version=AGENT_PROMPT_VERSION,
        provider=provider,
        configured_output_budget_tokens=AGENT_OUTPUT_BUDGET,
    )
    started = perf_counter()
    store = order_store or OrderStore()
    # The initial messages establish the task before a tool can be proposed.
    messages: list[Any] = [
        SystemMessage(content=AGENT_INSTRUCTIONS),
        HumanMessage(content=customer_message),
    ]
    model_calls = 0
    final_reply: CustomerReply | None = None

    try:
        while model_calls < MAX_MODEL_CALLS and final_reply is None:
            if model_calls == 0:
                # Binding exposes the tool schema but does not execute the tool.
                model_with_tools = model.bind_tools(
                    [LookupOrder],
                    strict=True,
                    tool_choice="auto",
                )
                decision = stream_decision(
                    model_with_tools, messages, model_name, trace
                )
                model_calls += 1
                messages.append(decision)
                trace.tool_call_count = len(decision.tool_calls)

                if len(decision.tool_calls) > MAX_TOOL_CALLS:
                    trace.errors.append("ToolCallLimitExceeded")
                    trace.validation_result = "failed"
                    final_reply = safe_fallback()
                    trace.stop_reason = "tool_call_limit"
                    continue

                if decision.tool_calls:
                    # A model proposal is untrusted until the application checks it.
                    proposed_call = decision.tool_calls[0]
                    trace.tool_name = proposed_call.get("name")

                    if trace.tool_name != LookupOrder.__name__:
                        trace.errors.append("UnknownTool")
                        trace.validation_result = "failed"
                        final_reply = safe_fallback()
                        trace.stop_reason = "unknown_tool"
                        continue

                    try:
                        arguments = LookupOrder.model_validate(proposed_call.get("args"))
                        trace.argument_validation_result = "passed"
                        trace.validation_result = "passed"
                    except ValidationError as error:
                        trace.errors.append(safe_error_name(error))
                        trace.argument_validation_result = "failed"
                        trace.validation_result = "failed"
                        final_reply = safe_fallback()
                        trace.stop_reason = "invalid_tool_arguments"
                        continue

                    tool_started = perf_counter()
                    try:
                        # Authentication is supplied only when application code
                        # executes the lookup.
                        order = store.lookup(
                            authenticated_customer_id,
                            arguments.order_id,
                        )
                        tool_output = order.model_dump_json()
                        trace.tool_result = "success"
                        trace.authorization_result = "authorized"
                    except PermissionError:
                        tool_output = json.dumps(
                            {"status": "not_authorized_or_not_found"}
                        )
                        trace.tool_result = "unavailable"
                        trace.authorization_result = "not_authorized_or_not_found"

                    trace.tool_latency_ms = round(
                        (perf_counter() - tool_started) * 1000, 1
                    )
                    trace.step_count += 1
                    messages.append(
                        # The ToolMessage links trusted output to the proposal.
                        ToolMessage(
                            content=tool_output,
                            tool_call_id=proposed_call["id"],
                        )
                    )
                else:
                    # Without a tool proposal, return the clarification directly.
                    trace.argument_validation_result = "not_required"
                    trace.authorization_result = "not_required"
                    response_text = decision.text.strip()
                    if not response_text:
                        response_text = "Please provide the five digit order number."
                    final_reply = CustomerReply(
                        message=response_text,
                        source="request_for_information",
                        order_verified=False,
                    )

            else:
                # The second model call explains the authorized tool result.
                candidate = create_final_reply(
                    model, messages, model_name, trace, provider
                )
                model_calls += 1
                claims_verified_data = (
                    candidate.source == "verified_order_data"
                    or candidate.order_verified
                )
                if claims_verified_data and trace.authorization_result != "authorized":
                    trace.errors.append("FinalReplyAuthorizationViolation")
                    trace.validation_result = "failed"
                    trace.stop_reason = "final_reply_policy"
                    final_reply = safe_fallback()
                else:
                    final_reply = candidate

        if final_reply is None:
            # Exhausting the model-call budget is a controlled stop.
            final_reply = safe_fallback()
            trace.stop_reason = "model_call_limit"

        trace.stop_reason = trace.stop_reason or (
            "needs_information"
            if final_reply.source == "request_for_information"
            else "completed"
        )
        trace.validation_result = trace.validation_result or "passed"
        return final_reply, trace
    except Exception as error:
        if not trace.model_calls or trace.model_calls[-1].error is None:
            trace.errors.append(safe_error_name(error))
        trace.stop_reason = "error"
        trace.validation_result = "failed"
        return safe_fallback(), trace
    finally:
        trace.end_to_end_ms = round((perf_counter() - started) * 1000, 1)


def main() -> None:
    """Load configuration, run one agent request, and print its trace."""

    load_dotenv()
    # Only model setup changes when MODEL_PROVIDER changes.
    model, model_name, provider = create_agent_model()
    customer_message = os.getenv(
        "CUSTOMER_MESSAGE",
        "Where is order 10492? It was supposed to arrive yesterday.",
    )
    authenticated_customer_id = os.getenv(
        "AUTHENTICATED_CUSTOMER_ID", "customer_001"
    )

    # Both providers enter the same bounded application loop.
    reply, trace = run_agent(
        model=model,
        model_name=model_name,
        customer_message=customer_message,
        authenticated_customer_id=authenticated_customer_id,
        provider=provider,
    )

    print("Customer response")
    print(reply.message)
    trace.print_summary()


if __name__ == "__main__":
    main()
