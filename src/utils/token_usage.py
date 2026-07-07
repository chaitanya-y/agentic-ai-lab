"""Token usage and cost helpers for model-backed demos."""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any

DEFAULT_OPENAI_PRICES_PER_1M = {
    "gpt-5-nano": {"input": 0.05, "output": 0.40},
}


@dataclass
class TokenUsage:
    """Token usage collected from model responses."""

    input_tokens: int = 0
    output_tokens: int = 0
    total_tokens: int = 0

    def add(
        self,
        input_tokens: int = 0,
        output_tokens: int = 0,
        total_tokens: int = 0,
    ) -> None:
        self.input_tokens += input_tokens
        self.output_tokens += output_tokens
        self.total_tokens += total_tokens or input_tokens + output_tokens

    def add_from_message(self, message: Any) -> None:
        """Add token usage from a LangChain message or message chunk."""
        usage = getattr(message, "usage_metadata", None)
        if isinstance(usage, dict):
            self.add(
                input_tokens=int(usage.get("input_tokens", 0) or 0),
                output_tokens=int(usage.get("output_tokens", 0) or 0),
                total_tokens=int(usage.get("total_tokens", 0) or 0),
            )
            return

        response_metadata = getattr(message, "response_metadata", None)
        if not isinstance(response_metadata, dict):
            return

        token_usage = response_metadata.get("token_usage", {})
        if not isinstance(token_usage, dict):
            return

        self.add(
            input_tokens=int(token_usage.get("prompt_tokens", 0) or 0),
            output_tokens=int(token_usage.get("completion_tokens", 0) or 0),
            total_tokens=int(token_usage.get("total_tokens", 0) or 0),
        )


def get_openai_rates_per_1m() -> tuple[float, float]:
    """Return input/output OpenAI prices per 1M tokens."""
    model_name = os.getenv("OPENAI_MODEL", "gpt-5-nano")
    default_rates = DEFAULT_OPENAI_PRICES_PER_1M.get(model_name, {})
    input_rate = float(
        os.getenv(
            "OPENAI_INPUT_COST_PER_1M",
            str(default_rates.get("input", 0)),
        )
    )
    output_rate = float(
        os.getenv(
            "OPENAI_OUTPUT_COST_PER_1M",
            str(default_rates.get("output", 0)),
        )
    )
    return input_rate, output_rate


def print_openai_usage_report(usage: TokenUsage) -> None:
    """Print token and estimated cost information for OpenAI runs."""
    if os.getenv("MODEL_PROVIDER", "qwen").lower() != "openai":
        return

    input_rate, output_rate = get_openai_rates_per_1m()
    input_cost = usage.input_tokens / 1_000_000 * input_rate
    output_cost = usage.output_tokens / 1_000_000 * output_rate
    total_cost = input_cost + output_cost

    print("\n\n=== OpenAI usage estimate ===")
    print(f"Input tokens: {usage.input_tokens}")
    print(f"Output tokens: {usage.output_tokens}")
    print(f"Total tokens: {usage.total_tokens}")

    if input_rate == 0 and output_rate == 0:
        print(
            "Cost not calculated. Set OPENAI_INPUT_COST_PER_1M and "
            "OPENAI_OUTPUT_COST_PER_1M."
        )
        return

    print(f"Input rate: ${input_rate:.4f} / 1M tokens")
    print(f"Output rate: ${output_rate:.4f} / 1M tokens")
    print(f"Estimated cost: ${total_cost:.6f}")
    print("Pricing changes over time; override rates in .env if needed.")
