"""Deep Agents research assistant following the LangChain quickstart.

Docs source:
https://docs.langchain.com/oss/python/deepagents/quickstart

This file intentionally stays close to the docs:
- create a Tavily-backed `internet_search` tool
- create a Deep Agent with `create_deep_agent`
- give it research instructions
- invoke it with a user question

Required env vars:
- `TAVILY_API_KEY`
- `DEEP_AGENT_MODEL`, for example `openai:gpt-5-nano`
- OpenAI runs also require `OPENAI_API_KEY` and `ALLOW_PAID_API_CALLS=true`
"""

from __future__ import annotations

import os
import pathlib
import sys
from typing import Literal

from deepagents import create_deep_agent
from dotenv import load_dotenv
from tavily import TavilyClient

PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC_ROOT = PROJECT_ROOT / "src"
sys.path.insert(0, str(SRC_ROOT))

from utils.demo_io import enabled, final_text, log_block, log_line
from utils.token_usage import collect_token_usage, print_openai_usage_report

load_dotenv(PROJECT_ROOT / ".env")


def require_paid_api_approval() -> None:
    """Require explicit approval before hosted model/search API calls."""
    if os.getenv("ALLOW_PAID_API_CALLS", "").lower() != "true":
        raise RuntimeError(
            "Deep Agents quickstart uses hosted model/search APIs. Set "
            "ALLOW_PAID_API_CALLS=true after confirming you want to run it."
        )


require_paid_api_approval()
tavily_client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])


def internet_search(
    query: str,
    max_results: int = 5,
    topic: Literal["general", "news", "finance"] = "general",
    include_raw_content: bool = False,
):
    """Run a web search."""
    log_block("Tavily search query", query)
    return tavily_client.search(
        query,
        max_results=max_results,
        include_raw_content=include_raw_content,
        topic=topic,
    )


research_instructions = """You are an expert researcher. Your job is to conduct
thorough research and then write a polished report.

You have access to an internet search tool as your primary means of gathering
information.

## `internet_search`

Use this to run an internet search for a given query. You can specify the max
number of results to return, the topic, and whether raw content should be
included.
"""


agent = create_deep_agent(
    model=os.getenv("DEEP_AGENT_MODEL", "openai:gpt-5-nano"),
    tools=[internet_search],
    system_prompt=research_instructions,
)


def print_messages(result: dict) -> None:
    """Print final Deep Agent messages for debugging and learning."""
    if not enabled("SHOW_DEEP_AGENT_MESSAGES", default=True):
        return

    log_line("Final deep agent messages")
    for index, message in enumerate(result["messages"], start=1):
        message_type = getattr(message, "type", message.__class__.__name__)
        tool_calls = getattr(message, "tool_calls", None)
        content = getattr(message, "content", "")
        log_line(f"[{index}] {message_type}")
        if tool_calls:
            log_line(f"tool_calls={tool_calls}")
        if content:
            log_block(f"Message {index} content", str(content))


def run_deep_research_agent() -> None:
    """Run the Deep Agents quickstart research demo."""
    question = "What is LangGraph?"
    log_block("User research question", question)
    recursion_limit = int(os.getenv("DEEP_AGENT_RECURSION_LIMIT", "8"))
    result = agent.invoke(
        {"messages": [{"role": "user", "content": question}]},
        {"recursion_limit": recursion_limit},
    )

    log_block("Final Deep Agents answer", final_text(result))
    print_messages(result)

    if enabled("SHOW_TOKEN_USAGE", default=True):
        usage = collect_token_usage(result["messages"])
        print_openai_usage_report(usage)


if __name__ == "__main__":
    run_deep_research_agent()
