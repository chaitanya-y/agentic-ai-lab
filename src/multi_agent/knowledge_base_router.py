"""Multi-source knowledge base router using LangGraph fan-out.

Docs source:
https://docs.langchain.com/oss/python/langchain/multi-agent/router-knowledge-base

This module follows the LangChain router tutorial structure:
- classify a user query into source-specific sub-questions
- route relevant work to specialized agents with `Send`
- run GitHub, Notion, and Slack specialists independently
- synthesize the specialist results into one final answer

What to observe when running:
- `Router selected sources` shows the routing decision.
- Each specialist result shows a source-specific answer.
- `results: Annotated[..., operator.add]` merges parallel specialist outputs.
- `Final synthesized answer` combines the routed evidence.

Conceptual difference from the other multi-agent examples:
- `personal_assistant.py`: supervisor delegates to subagents as tools.
- `customer_support_handoffs.py`: one agent changes behavior across states.
- This file: a router fans out one question to multiple knowledge specialists
  and then merges the results.

Safety note:
- No real GitHub, Notion, or Slack API is called.
- Each specialist searches a small local demo knowledge base.

Model note:
- This demo is intended for a hosted model such as OpenAI because it makes
  several model calls: router, specialists, and final synthesis.
- The router asks the model for JSON and falls back to deterministic routing if
  parsing fails. A production version should use provider-native structured
  output or a stricter output parser for the routing decision.
"""

from __future__ import annotations

import json
import operator
import os
import pathlib
import sys
from typing import Annotated, Literal, TypedDict

from dotenv import load_dotenv
from langchain.messages import AIMessage, HumanMessage
from langgraph.graph import END, START, StateGraph, add_messages
from langgraph.types import Send

PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC_ROOT = PROJECT_ROOT / "src"
sys.path.insert(0, str(SRC_ROOT))

from agents.model_config import build_chat_model
from utils.token_usage import TokenUsage, print_openai_usage_report

load_dotenv(PROJECT_ROOT / ".env")

SourceName = Literal["github", "notion", "slack"]


class Route(TypedDict):
    """A source-specific sub-question selected by the router."""

    source: SourceName
    query: str


class SourceResult(TypedDict):
    """A result returned by one specialist source."""

    source: SourceName
    answer: str


class RouterState(TypedDict):
    """Graph state shared across the router workflow."""

    query: str
    routes: list[Route]
    results: Annotated[list[SourceResult], operator.add]
    messages: Annotated[list, add_messages]


DEMO_KNOWLEDGE = {
    "github": """
    GitHub repository notes:
    - API authentication middleware lives in src/api/auth.py.
    - Requests must include an Authorization header with a Bearer token.
    - The token is validated by verify_bearer_token before a route handler runs.
    - Tests for authentication behavior are in tests/test_auth.py.
    """,
    "notion": """
    Notion engineering wiki:
    - Public API clients authenticate with personal access tokens.
    - The recommended header format is Authorization: Bearer <token>.
    - Tokens should be stored in a secret manager or local .env file, never in code.
    - Rotating tokens every 90 days is recommended for production systems.
    """,
    "slack": """
    Slack support thread summary:
    - Developers often forget the "Bearer " prefix in the Authorization header.
    - 401 errors usually mean the token is missing, expired, or scoped incorrectly.
    - For local testing, confirm API_TOKEN is loaded before starting the server.
    - The platform team recommends checking logs for auth_failure details.
    """,
}


def enabled(env_var: str, default: bool = False) -> bool:
    """Return True when an env var is truthy, with a configurable default."""
    value = os.getenv(env_var)
    if value is None:
        return default
    return value.lower() in {"1", "true", "yes", "on"}


def log_line(message: str = "") -> None:
    """Print a labeled line so demo output is easy to scan."""
    print(f">> {message}" if message else ">>")


def log_block(title: str, content: str) -> None:
    """Print a labeled multi-line block."""
    print(f"\n>> {title}")
    for line in content.splitlines():
        print(f">>   {line}")
    print(f">> End {title}\n")


def build_router_model(max_tokens_env: str, default_max_tokens: int):
    """Create a chat model for router workflow calls."""
    return build_chat_model(
        temperature=0,
        max_tokens=int(os.getenv(max_tokens_env, str(default_max_tokens))),
    )


def extract_json_object(text: str) -> dict:
    """Parse the first JSON object from an LLM response."""
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:].strip()

    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("No JSON object found in model response.")
    return json.loads(cleaned[start : end + 1])


def fallback_routes(query: str) -> list[Route]:
    """Local keyword fallback when the model does not return valid JSON."""
    lowered = query.lower()
    routes: list[Route] = []

    if any(word in lowered for word in ["code", "repo", "github", "test", "middleware"]):
        routes.append({"source": "github", "query": query})
    if any(word in lowered for word in ["docs", "wiki", "policy", "recommended", "notion"]):
        routes.append({"source": "notion", "query": query})
    if any(word in lowered for word in ["error", "debug", "slack", "thread", "issue", "401"]):
        routes.append({"source": "slack", "query": query})
    if any(word in lowered for word in ["auth", "token", "api", "authenticate", "authorization"]):
        routes = [
            {"source": "github", "query": "Where is API authentication implemented?"},
            {"source": "notion", "query": "What is the recommended API authentication format?"},
            {"source": "slack", "query": "What common authentication issues have developers reported?"},
        ]

    return routes or [
        {"source": "github", "query": query},
        {"source": "notion", "query": query},
        {"source": "slack", "query": query},
    ]


def normalize_routes(raw_routes: list[dict], original_query: str) -> list[Route]:
    """Keep only valid source routes and fill missing sub-queries."""
    valid_sources = {"github", "notion", "slack"}
    routes: list[Route] = []
    seen: set[str] = set()

    for item in raw_routes:
        source = str(item.get("source", "")).lower()
        if source not in valid_sources or source in seen:
            continue
        seen.add(source)
        routes.append(
            {
                "source": source,  # type: ignore[typeddict-item]
                "query": str(item.get("query") or original_query),
            }
        )

    return routes or fallback_routes(original_query)


def classify_query(state: RouterState) -> dict:
    """Classify the user query into source-specific routes."""
    query = state["query"]
    model = build_router_model("ROUTER_MAX_TOKENS", 2048)
    prompt = f"""You are a knowledge base router.

Available sources:
- github: source code, tests, implementation details, repository issues
- notion: internal docs, policies, architecture notes, operating procedures
- slack: team discussions, debugging threads, recently reported problems

User query:
{query}

Return only JSON in this shape:
{{
  "routes": [
    {{"source": "github", "query": "source-specific sub-question"}},
    {{"source": "notion", "query": "source-specific sub-question"}},
    {{"source": "slack", "query": "source-specific sub-question"}}
  ]
}}

Choose only the sources that are useful. Use multiple routes when the query
needs evidence from more than one source."""

    response = model.invoke([HumanMessage(content=prompt)])
    content = str(getattr(response, "content", ""))

    try:
        parsed = extract_json_object(content)
        routes = normalize_routes(parsed.get("routes", []), query)
    except Exception as exc:  # noqa: BLE001 - demo fallback keeps local runs robust.
        log_line(f"Router JSON parsing failed, using fallback: {exc.__class__.__name__}")
        routes = fallback_routes(query)

    route_summary = "\n".join(
        f"- {route['source']}: {route['query']}" for route in routes
    )
    log_block("Router selected sources", route_summary)
    return {
        "routes": routes,
        "messages": [AIMessage(content=f"Router selected:\n{route_summary}")],
    }


def route_to_specialists(state: RouterState) -> list[Send]:
    """Fan out to the selected source specialists in parallel."""
    return [
        Send(
            f"{route['source']}_specialist",
            {
                "query": state["query"],
                "routes": [route],
                "results": [],
                "messages": state["messages"],
            },
        )
        for route in state["routes"]
    ]


def run_source_specialist(source: SourceName, state: RouterState) -> dict:
    """Ask one source specialist to answer from its local knowledge base."""
    source_query = state["routes"][0]["query"]
    model = build_router_model("ROUTER_SPECIALIST_MAX_TOKENS", 2048)
    prompt = f"""You are the {source} knowledge specialist.

Answer the source-specific question using only this local demo knowledge.
If the knowledge does not contain the answer, say what is missing.

Source-specific question:
{source_query}

Local demo knowledge:
{DEMO_KNOWLEDGE[source]}

Return a concise answer with the strongest useful facts."""

    response = model.invoke([HumanMessage(content=prompt)])
    answer = str(getattr(response, "content", "")).strip()
    if not answer:
        answer = " ".join(DEMO_KNOWLEDGE[source].split())

    log_block(f"{source.title()} specialist result", answer)
    return {
        "results": [{"source": source, "answer": answer}],
        "messages": [response],
    }


def github_specialist(state: RouterState) -> dict:
    """Answer from simulated GitHub repository knowledge."""
    return run_source_specialist("github", state)


def notion_specialist(state: RouterState) -> dict:
    """Answer from simulated Notion documentation knowledge."""
    return run_source_specialist("notion", state)


def slack_specialist(state: RouterState) -> dict:
    """Answer from simulated Slack thread knowledge."""
    return run_source_specialist("slack", state)


def synthesize_answer(state: RouterState) -> dict:
    """Synthesize all specialist results into one final response."""
    model = build_router_model("ROUTER_SYNTHESIS_MAX_TOKENS", 2048)
    evidence = "\n\n".join(
        f"{result['source'].title()} result:\n{result['answer']}"
        for result in state["results"]
    )
    prompt = f"""You are synthesizing answers from multiple knowledge specialists.

Original user query:
{state["query"]}

Specialist results:
{evidence}

Write a concise final answer in at most 5 bullets. Cite which source each major
point came from."""

    response = model.invoke([HumanMessage(content=prompt)])
    content = str(getattr(response, "content", "")).strip()
    if not content:
        content = evidence or "No specialist results were returned."

    log_block("Final synthesized answer", content)
    return {"messages": [response if content == getattr(response, "content", "") else AIMessage(content=content)]}


def build_knowledge_base_router():
    """Assemble the router graph."""
    builder = StateGraph(RouterState)
    builder.add_node(classify_query)
    builder.add_node(github_specialist)
    builder.add_node(notion_specialist)
    builder.add_node(slack_specialist)
    builder.add_node(synthesize_answer)

    builder.add_edge(START, "classify_query")
    builder.add_conditional_edges("classify_query", route_to_specialists)
    builder.add_edge("github_specialist", "synthesize_answer")
    builder.add_edge("notion_specialist", "synthesize_answer")
    builder.add_edge("slack_specialist", "synthesize_answer")
    builder.add_edge("synthesize_answer", END)
    return builder.compile()


def collect_token_usage(messages: list) -> TokenUsage:
    """Collect token usage from messages in the final graph state."""
    usage = TokenUsage()
    for message in messages:
        usage.add_from_message(message)
    return usage


def run_knowledge_base_router() -> None:
    """Run the multi-source router demo."""
    query = "How do I authenticate API requests, and what should I check if I get a 401?"
    log_block("User query", query)

    graph = build_knowledge_base_router()
    final_state = graph.invoke(
        {
            "query": query,
            "routes": [],
            "results": [],
            "messages": [HumanMessage(content=query)],
        }
    )

    if enabled("SHOW_MULTI_AGENT_MESSAGES", default=True):
        log_line("Final router messages")
        for index, message in enumerate(final_state["messages"], start=1):
            message_type = getattr(message, "type", message.__class__.__name__)
            content = getattr(message, "content", "")
            log_line(f"[{index}] {message_type}")
            if content:
                log_block(f"Message {index} content", str(content))

    if enabled("SHOW_TOKEN_USAGE", default=True):
        usage = collect_token_usage(final_state["messages"])
        print_openai_usage_report(usage)


if __name__ == "__main__":
    run_knowledge_base_router()
