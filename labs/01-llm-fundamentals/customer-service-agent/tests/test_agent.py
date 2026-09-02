import pytest
from langchain_core.messages import AIMessage, AIMessageChunk
from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI

from customer_service_lab.agent import OrderStore, create_agent_model, run_agent
from customer_service_lab.shared import CustomerReply


class FakeBoundModel:
    def __init__(self, chunks: list[AIMessageChunk]) -> None:
        self.chunks = chunks

    def stream(self, messages, **kwargs):
        yield from self.chunks


def test_model_factory_selects_openai_explicitly(monkeypatch) -> None:
    monkeypatch.setenv("MODEL_PROVIDER", "openai")
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    monkeypatch.setenv("OPENAI_MODEL", "test-openai-model")

    model, model_name, provider = create_agent_model()

    assert isinstance(model, ChatOpenAI)
    assert model_name == "test-openai-model"
    assert provider == "openai"


def test_model_factory_selects_ollama_explicitly(monkeypatch) -> None:
    monkeypatch.setenv("MODEL_PROVIDER", "ollama")
    monkeypatch.setenv("OLLAMA_MODEL", "qwen3:14b")
    monkeypatch.setenv("OLLAMA_HOST", "http://localhost:11434")

    model, model_name, provider = create_agent_model()

    assert isinstance(model, ChatOllama)
    assert model_name == "qwen3:14b"
    assert provider == "ollama"
    assert model.reasoning is False


def test_model_factory_rejects_an_unknown_provider(monkeypatch) -> None:
    monkeypatch.setenv("MODEL_PROVIDER", "unknown")

    with pytest.raises(ValueError, match="openai or ollama"):
        create_agent_model()


class TimeoutBoundModel:
    def stream(self, messages, **kwargs):
        raise TimeoutError("The provider did not respond in time")
        yield


class FakeStructuredModel:
    def __init__(self, reply: CustomerReply) -> None:
        self.reply = reply

    def invoke(self, messages, **kwargs):
        raw = AIMessage(
            content="",
            usage_metadata={
                "input_tokens": 40,
                "output_tokens": 18,
                "total_tokens": 58,
                "input_token_details": {"cache_read": 10},
            },
            response_metadata={
                "headers": {"x-request-id": "req_final"},
                "finish_reason": "stop",
            },
        )
        return {"raw": raw, "parsed": self.reply, "parsing_error": None}


class InvalidStructuredModel:
    def invoke(self, messages, **kwargs):
        return {
            "raw": AIMessage(content=""),
            "parsed": None,
            "parsing_error": ValueError("Invalid response"),
        }


class FakeModel:
    def __init__(
        self,
        chunks: list[AIMessageChunk],
        reply: CustomerReply,
    ) -> None:
        self.bound = FakeBoundModel(chunks)
        self.structured = FakeStructuredModel(reply)

    def bind_tools(self, tools, **kwargs):
        return self.bound

    def with_structured_output(self, schema, **kwargs):
        return self.structured

    def invoke(self, messages, **kwargs):
        return AIMessage(
            content=self.structured.reply.model_dump_json(),
            usage_metadata={
                "input_tokens": 40,
                "output_tokens": 18,
                "total_tokens": 58,
            },
            response_metadata={"done_reason": "stop"},
        )


def tool_call_chunks(order_id: str = "10492") -> list[AIMessageChunk]:
    return [
        AIMessageChunk(
            content="",
            tool_call_chunks=[
                {
                    "name": "LookupOrder",
                    "args": f'{{"order_id":"{order_id}"}}',
                    "id": "call_1",
                    "index": 0,
                    "type": "tool_call_chunk",
                }
            ],
            response_metadata={
                "headers": {"x-request-id": "req_decision"},
                "finish_reason": "tool_calls",
            },
            usage_metadata={
                "input_tokens": 30,
                "output_tokens": 8,
                "total_tokens": 38,
            },
        )
    ]


def repeated_tool_call_chunks() -> list[AIMessageChunk]:
    return [
        AIMessageChunk(
            content="",
            tool_call_chunks=[
                {
                    "name": "LookupOrder",
                    "args": '{"order_id":"10492"}',
                    "id": "call_1",
                    "index": 0,
                    "type": "tool_call_chunk",
                },
                {
                    "name": "LookupOrder",
                    "args": '{"order_id":"10492"}',
                    "id": "call_2",
                    "index": 1,
                    "type": "tool_call_chunk",
                },
            ],
        )
    ]


def test_authorized_order_uses_one_tool_and_two_model_calls() -> None:
    model = FakeModel(
        tool_call_chunks(),
        CustomerReply(
            message="Order 10492 is in transit and is expected tomorrow by 8 PM.",
            source="verified_order_data",
            order_verified=True,
        ),
    )

    reply, trace = run_agent(
        model=model,
        model_name="test-model",
        customer_message="Where is order 10492?",
        authenticated_customer_id="customer_001",
        order_store=OrderStore(),
    )

    assert reply.order_verified is True
    assert trace.tool_result == "success"
    assert trace.authorization_result == "authorized"
    assert trace.argument_validation_result == "passed"
    assert trace.model_call_count == 2
    assert trace.tool_call_count == 1
    assert trace.step_count == 3
    assert trace.model_calls[0].provider_request_id == "req_decision"
    assert trace.model_calls[1].provider_request_id == "req_final"
    assert trace.model_calls[1].usage.cached_input_tokens == 10
    summary = trace.execution_summary()
    assert "Decision: propose LookupOrder" in summary
    assert "Argument validation: passed" in summary
    assert "Authorization: authorized" in summary
    assert "3. Second model call" in summary


def test_authenticated_identity_stays_outside_model_control() -> None:
    model = FakeModel(
        tool_call_chunks(),
        CustomerReply(
            message="I could not verify that order. Please check the order number.",
            source="safe_fallback",
            order_verified=False,
        ),
    )

    reply, trace = run_agent(
        model=model,
        model_name="test-model",
        customer_message="Where is order 10492?",
        authenticated_customer_id="another_customer",
        order_store=OrderStore(),
    )

    assert reply.order_verified is False
    assert trace.tool_result == "unavailable"
    assert trace.authorization_result == "not_authorized_or_not_found"
    assert "In transit" not in reply.message


def test_missing_order_number_does_not_call_tool() -> None:
    chunks = [
        AIMessageChunk(
            content="Please provide the five digit order number.",
            response_metadata={"finish_reason": "stop"},
            usage_metadata={
                "input_tokens": 24,
                "output_tokens": 9,
                "total_tokens": 33,
            },
        )
    ]
    model = FakeModel(
        chunks,
        CustomerReply(
            message="Please provide the five digit order number.",
            source="request_for_information",
            order_verified=False,
        ),
    )

    reply, trace = run_agent(
        model=model,
        model_name="test-model",
        customer_message="Where is my order?",
        authenticated_customer_id="customer_001",
    )

    assert reply.source == "request_for_information"
    assert trace.tool_name is None
    assert trace.tool_latency_ms is None
    assert trace.stop_reason == "needs_information"
    assert trace.model_call_count == 1
    assert trace.tool_call_count == 0
    summary = trace.execution_summary()
    assert "Decision: ask the customer for more information" in summary
    assert "No tool call was proposed." in summary
    assert "2. Application control" not in summary


def test_invalid_tool_arguments_stop_before_tool_execution() -> None:
    model = FakeModel(
        tool_call_chunks(order_id="ABC"),
        CustomerReply(
            message="This result should not be used.",
            source="safe_fallback",
            order_verified=False,
        ),
    )

    reply, trace = run_agent(
        model=model,
        model_name="test-model",
        customer_message="Where is order ABC?",
        authenticated_customer_id="customer_001",
    )

    assert reply.source == "safe_fallback"
    assert trace.tool_latency_ms is None
    assert trace.stop_reason == "invalid_tool_arguments"
    assert trace.validation_result == "failed"
    assert trace.argument_validation_result == "failed"
    assert trace.model_call_count == 1
    assert trace.tool_call_count == 1


def test_unauthorized_lookup_cannot_be_reported_as_verified() -> None:
    model = FakeModel(
        tool_call_chunks(),
        CustomerReply(
            message="The order is in transit.",
            source="verified_order_data",
            order_verified=True,
        ),
    )

    reply, trace = run_agent(
        model=model,
        model_name="test-model",
        customer_message="Where is order 10492?",
        authenticated_customer_id="another_customer",
        order_store=OrderStore(),
    )

    assert reply.source == "safe_fallback"
    assert reply.order_verified is False
    assert trace.stop_reason == "final_reply_policy"
    assert trace.validation_result == "failed"
    assert "FinalReplyAuthorizationViolation" in trace.errors


def test_unknown_order_uses_the_same_safe_result_as_unauthorized_order() -> None:
    model = FakeModel(
        tool_call_chunks(order_id="99999"),
        CustomerReply(
            message="I could not verify that order. Please check the order number.",
            source="safe_fallback",
            order_verified=False,
        ),
    )

    reply, trace = run_agent(
        model=model,
        model_name="test-model",
        customer_message="Where is order 99999?",
        authenticated_customer_id="customer_001",
        order_store=OrderStore(),
    )

    assert reply.source == "safe_fallback"
    assert trace.tool_result == "unavailable"
    assert trace.authorization_result == "not_authorized_or_not_found"


def test_repeated_tool_proposals_stop_before_tool_execution() -> None:
    model = FakeModel(
        repeated_tool_call_chunks(),
        CustomerReply(
            message="This response should not be used.",
            source="safe_fallback",
            order_verified=False,
        ),
    )

    reply, trace = run_agent(
        model=model,
        model_name="test-model",
        customer_message="Where is order 10492?",
        authenticated_customer_id="customer_001",
    )

    assert reply.source == "safe_fallback"
    assert trace.stop_reason == "tool_call_limit"
    assert trace.tool_latency_ms is None
    assert trace.tool_call_count == 2


def test_provider_timeout_returns_a_controlled_fallback() -> None:
    model = FakeModel(
        [],
        CustomerReply(
            message="This response should not be used.",
            source="safe_fallback",
            order_verified=False,
        ),
    )
    model.bound = TimeoutBoundModel()

    reply, trace = run_agent(
        model=model,
        model_name="test-model",
        customer_message="Where is order 10492?",
        authenticated_customer_id="customer_001",
    )

    assert reply.source == "safe_fallback"
    assert trace.stop_reason == "error"
    assert trace.validation_result == "failed"
    assert "TimeoutError" in trace.errors


def test_invalid_final_response_returns_a_controlled_fallback() -> None:
    model = FakeModel(
        tool_call_chunks(),
        CustomerReply(
            message="This response should not be used.",
            source="safe_fallback",
            order_verified=False,
        ),
    )
    model.structured = InvalidStructuredModel()

    reply, trace = run_agent(
        model=model,
        model_name="test-model",
        customer_message="Where is order 10492?",
        authenticated_customer_id="customer_001",
        order_store=OrderStore(),
    )

    assert reply.source == "safe_fallback"
    assert trace.stop_reason == "error"
    assert trace.validation_result == "failed"
    assert trace.errors == ["MissingCustomerReplyToolCall"]
    assert trace.model_calls[-1].error == "MissingCustomerReplyToolCall"


def test_ollama_final_reply_uses_json_content_instead_of_a_tool_call() -> None:
    model = FakeModel(
        tool_call_chunks(),
        CustomerReply(
            message="Order 10492 is in transit.",
            source="verified_order_data",
            order_verified=True,
        ),
    )

    reply, trace = run_agent(
        model=model,
        model_name="qwen3:14b",
        provider="ollama",
        customer_message="Where is order 10492?",
        authenticated_customer_id="customer_001",
        order_store=OrderStore(),
    )

    assert reply.source == "verified_order_data"
    assert trace.stop_reason == "completed"
    assert trace.validation_result == "passed"
    assert trace.errors == []
