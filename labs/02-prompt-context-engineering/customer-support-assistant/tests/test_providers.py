from __future__ import annotations

import pytest
from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI

from support_assistant.config import Settings
from support_assistant.providers import PaidAPICallNotAllowed, create_model


def test_openai_requires_explicit_paid_call_authorization() -> None:
    settings = Settings(
        provider="openai",
        model="test-model",
        openai_api_key="test-key",
        allow_paid_api_calls=False,
    )

    with pytest.raises(PaidAPICallNotAllowed, match="ALLOW_PAID_API_CALLS"):
        create_model(settings)


def test_openai_requires_an_api_key_after_authorization() -> None:
    settings = Settings(
        provider="openai",
        model="test-model",
        openai_api_key=None,
        allow_paid_api_calls=True,
    )

    with pytest.raises(ValueError, match="OPENAI_API_KEY"):
        create_model(settings)


def test_create_model_builds_the_selected_openai_client() -> None:
    settings = Settings(
        provider="openai",
        model="test-model",
        openai_api_key="test-key",
        allow_paid_api_calls=True,
    )

    model = create_model(settings)

    assert model.provider == "openai"
    assert model.model_name == "test-model"
    assert isinstance(model.model, ChatOpenAI)


def test_create_model_builds_an_ollama_client_without_an_api_key() -> None:
    settings = Settings(
        provider="ollama",
        model="qwen3:14b",
        ollama_host="http://localhost:11434",
    )

    model = create_model(settings)

    assert model.provider == "ollama"
    assert model.model_name == "qwen3:14b"
    assert isinstance(model.model, ChatOllama)
    assert model.model.reasoning is False
