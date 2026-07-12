"""Shared console-output helpers for local agent demos.

The repository examples are intentionally executable from the terminal. These
helpers keep output consistent across agents, workflows, and multi-agent demos
without repeating small functions in every file.
"""

from __future__ import annotations

import os
from typing import Any


TRUTHY_ENV_VALUES = {"1", "true", "yes", "on"}


def enabled(env_var: str, default: bool = False) -> bool:
    """Return True when an environment variable is set to a truthy value."""
    value = os.getenv(env_var)
    if value is None:
        return default
    return value.lower() in TRUTHY_ENV_VALUES


def log_line(message: str = "") -> None:
    """Print a labeled single-line message for scan-friendly demo output."""
    print(f">> {message}" if message else ">>")


def log_block(title: str, content: str) -> None:
    """Print a labeled multi-line block for model/tool/debug output."""
    print(f"\n>> {title}")
    for line in content.splitlines():
        print(f">>   {line}")
    print(f">> End {title}\n")


def message_text(message: Any) -> str:
    """Return displayable text from a LangChain message-like object."""
    content = getattr(message, "content", "")
    if isinstance(content, str):
        return content

    if isinstance(content, list):
        text_blocks: list[str] = []
        for block in content:
            if isinstance(block, dict):
                if block.get("type") == "text" and block.get("text"):
                    text_blocks.append(str(block["text"]))
                elif block.get("type") == "reasoning" and block.get("summary"):
                    text_blocks.append(str(block["summary"]))
            elif isinstance(block, str):
                text_blocks.append(block)
        if text_blocks:
            return "\n".join(text_blocks)

    return str(content)


def final_text(result: dict) -> str:
    """Return the final message text from a LangChain agent result."""
    return message_text(result["messages"][-1])
