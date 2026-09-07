from __future__ import annotations

import os
from typing import Self

from dotenv import load_dotenv
from pydantic import BaseModel, Field, field_validator


class Settings(BaseModel):
    """Runtime settings with explicit provider selection."""

    provider: str = "openai"
    model: str = "gpt-5.4-mini"
    openai_api_key: str | None = None
    ollama_host: str = "http://localhost:11434"
    allow_paid_api_calls: bool = False
    input_budget_tokens: int = Field(default=4_000, ge=256)
    output_reserve_tokens: int = Field(default=500, ge=64)

    @field_validator("provider")
    @classmethod
    def validate_provider(cls, value: str) -> str:
        provider = value.strip().lower()
        if provider not in {"openai", "ollama"}:
            raise ValueError("provider must be openai or ollama")
        return provider

    @classmethod
    def from_environment(cls) -> Self:
        """Load local settings without making a provider request."""

        load_dotenv()
        provider = os.getenv("MODEL_PROVIDER", "openai").strip().lower()
        default_model = "qwen3:14b" if provider == "ollama" else "gpt-5.4-mini"
        model_variable = "OLLAMA_MODEL" if provider == "ollama" else "OPENAI_MODEL"

        return cls(
            provider=provider,
            model=os.getenv(model_variable, default_model),
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            ollama_host=os.getenv("OLLAMA_HOST", "http://localhost:11434"),
            allow_paid_api_calls=os.getenv("ALLOW_PAID_API_CALLS", "false").lower() == "true",
            input_budget_tokens=int(os.getenv("INPUT_BUDGET_TOKENS", "4000")),
            output_reserve_tokens=int(os.getenv("OUTPUT_RESERVE_TOKENS", "500")),
        )
