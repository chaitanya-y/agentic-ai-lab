from ollama import ResponseError
from pydantic import ValidationError

from customer_service_lab.ollama_analyzer import analyze_request, local_failure_message
from customer_service_lab.shared import RunTrace, SupportRequest


class FakeOllamaClient:
    def __init__(self) -> None:
        self.call_arguments: dict[str, object] | None = None

    def chat(self, **kwargs):
        self.call_arguments = kwargs
        message = type(
            "Message",
            (),
            {
                "content": (
                    '{"issue_type":"order_status","order_id":"10492",'
                    '"needs_order_data":true,"missing_details":[]}'
                )
            },
        )()
        return type(
            "Response",
            (),
            {"message": message, "prompt_eval_count": 20, "eval_count": 10},
        )()


def test_analyzer_uses_json_instructions_instead_of_ollama_format() -> None:
    client = FakeOllamaClient()
    trace = RunTrace(model="qwen3:14b", prompt_version="test")

    request = analyze_request(
        client,  # type: ignore[arg-type]
        "qwen3:14b",
        "Where is order 10492?",
        trace,
    )

    assert request.order_id == "10492"
    assert client.call_arguments is not None
    assert "format" not in client.call_arguments


def test_local_failure_message_distinguishes_an_unreachable_service() -> None:
    message = local_failure_message(
        ConnectionError("connection refused"),
        "http://localhost:11434",
        "qwen3:14b",
    )

    assert "http://localhost:11434" in message
    assert "OLLAMA_HOST" in message


def test_local_failure_message_distinguishes_a_missing_model() -> None:
    message = local_failure_message(
        ResponseError("model not found", status_code=404),
        "http://localhost:11434",
        "qwen3:14b",
    )

    assert "qwen3:14b" in message
    assert "ollama pull qwen3:14b" in message


def test_local_failure_message_shows_other_ollama_errors() -> None:
    message = local_failure_message(
        ResponseError("not enough available memory", status_code=500),
        "http://localhost:11434",
        "qwen3:14b",
    )

    assert "qwen3:14b" in message
    assert "not enough available memory" in message


def test_local_failure_message_distinguishes_invalid_structured_output() -> None:
    try:
        SupportRequest.model_validate_json("{}")
    except ValidationError as error:
        message = local_failure_message(
            error,
            "http://localhost:11434",
            "qwen3:14b",
        )
    else:
        raise AssertionError("The invalid support request should not validate")

    assert "did not match the SupportRequest contract" in message
