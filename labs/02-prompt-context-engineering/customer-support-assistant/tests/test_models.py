from __future__ import annotations

import pytest
from pydantic import ValidationError

from support_assistant.config import Settings
from support_assistant.models import SupportRequest, SupportResponse


def test_support_request_allows_an_absent_order_id() -> None:
    request = SupportRequest(
        issue_type="damaged_item",
        order_id=None,
        requested_outcome="replacement",
        missing_information=["order_id"],
    )

    assert request.order_id is None


def test_support_request_rejects_a_malformed_order_id() -> None:
    with pytest.raises(ValidationError, match="order_id"):
        SupportRequest(
            issue_type="order_status",
            order_id="A10492",
            requested_outcome="status",
            missing_information=[],
        )


def test_answered_response_requires_evidence() -> None:
    with pytest.raises(ValidationError, match="evidence"):
        SupportResponse(
            outcome="answered",
            message="Your order is in transit.",
            evidence_ids=[],
            missing_information=[],
        )


def test_needs_information_response_names_what_is_missing() -> None:
    response = SupportResponse(
        outcome="needs_information",
        message="Please provide your five digit order number.",
        evidence_ids=[],
        missing_information=["order_id"],
    )

    assert response.missing_information == ["order_id"]


def test_needs_information_response_rejects_an_empty_missing_list() -> None:
    with pytest.raises(ValidationError, match="missing_information"):
        SupportResponse(
            outcome="needs_information",
            message="Please provide more information.",
            evidence_ids=[],
            missing_information=[],
        )


def test_settings_reject_an_unknown_provider() -> None:
    with pytest.raises(ValueError, match="openai or ollama"):
        Settings(provider="unknown", model="example")


def test_settings_use_a_provider_specific_default_model(monkeypatch) -> None:
    monkeypatch.setenv("MODEL_PROVIDER", "ollama")
    monkeypatch.delenv("OLLAMA_MODEL", raising=False)

    settings = Settings.from_environment()

    assert settings.provider == "ollama"
    assert settings.model == "qwen3:14b"
