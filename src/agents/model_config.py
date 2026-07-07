"""Shared chat model configuration for agent demos.

The repo defaults to local Qwen through Ollama for safe, free execution. Hosted
OpenAI models are still supported, but require an explicit opt-in flag.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from langchain.chat_models import init_chat_model

PROJECT_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(PROJECT_ROOT / ".env")


def build_chat_model(temperature: float = 0) -> Any:
    """Build a chat model from environment variables.

    Supported providers:
    - qwen: local Qwen model through Ollama
    - ollama: any local Ollama model
    - openai: hosted OpenAI model, requires ALLOW_PAID_API_CALLS=true
    """
    provider = os.getenv("MODEL_PROVIDER", "qwen").lower()

    if provider == "openai":
        if os.getenv("ALLOW_PAID_API_CALLS", "").lower() != "true":
            raise RuntimeError(
                "OpenAI chat calls may cost money. Set "
                "ALLOW_PAID_API_CALLS=true to run with MODEL_PROVIDER=openai, "
                "or set MODEL_PROVIDER=qwen for the local Qwen model."
            )
        model_name = os.getenv("OPENAI_MODEL", "gpt-5-nano")
        print(f"Using OpenAI model: {model_name}")
        return init_chat_model(
            model_name,
            model_provider="openai",
            temperature=temperature,
            stream_usage=True,
        )

    if provider in {"qwen", "ollama"}:
        model_name = os.getenv("OLLAMA_MODEL", "qwen3.5:9b")
        base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        label = "Qwen via Ollama" if provider == "qwen" else "Ollama"
        print(f"Using {label} model: {model_name}")
        return init_chat_model(
            model_name,
            model_provider="ollama",
            base_url=base_url,
            temperature=temperature,
        )

    raise RuntimeError(
        "MODEL_PROVIDER must be 'qwen', 'ollama', or 'openai'. "
        f"Received: {provider!r}"
    )
