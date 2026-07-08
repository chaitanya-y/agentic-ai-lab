"""Supervisor-style multi-agent personal assistant.

Docs source:
https://docs.langchain.com/oss/python/langchain/multi-agent/subagents-personal-assistant

This module follows the LangChain multi-agent tutorial structure:
- define focused calendar and email tools
- create specialist calendar and email agents
- wrap each specialist agent as a high-level supervisor tool
- create a supervisor agent that coordinates the specialists
- run a safe local demo with stubbed calendar/email side effects

Safety note:
- No real calendar event is created.
- No real email is sent.
- Tool functions return simulated results so the workflow is safe for local demos.
"""

from __future__ import annotations

import os
import pathlib
import sys

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.tools import tool

PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC_ROOT = PROJECT_ROOT / "src"
sys.path.insert(0, str(SRC_ROOT))

from agents.model_config import build_chat_model

load_dotenv(PROJECT_ROOT / ".env")


def log_line(message: str = "") -> None:
    """Print a labeled line so demo output is easy to scan."""
    print(f">> {message}" if message else ">>")


def log_block(title: str, content: str) -> None:
    """Print a labeled multi-line block."""
    print(f"\n>> {title}")
    for line in content.splitlines():
        print(f">>   {line}")
    print(f">> End {title}\n")


@tool
def create_calendar_event(
    title: str,
    start_time: str,
    end_time: str,
    attendees: list[str],
    location: str = "",
) -> str:
    """Create a calendar event. Requires exact ISO datetime format."""
    location_text = f" at {location}" if location else ""
    return (
        f"Simulated calendar event created: {title} from {start_time} to "
        f"{end_time}{location_text} with {len(attendees)} attendees."
    )


@tool
def get_available_time_slots(
    attendees: list[str],
    date: str,
    duration_minutes: int,
) -> list[str]:
    """Check calendar availability for attendees on a specific ISO date."""
    _ = attendees, date, duration_minutes
    return ["09:00", "14:00", "16:00"]


@tool
def send_email(
    to: list[str],
    subject: str,
    body: str,
    cc: list[str] | None = None,
) -> str:
    """Send an email. This demo simulates sending and does not call an email API."""
    cc_text = f"; cc: {', '.join(cc)}" if cc else ""
    preview = body.replace("\n", " ")[:120]
    return (
        f"Simulated email sent to {', '.join(to)}{cc_text}. "
        f"Subject: {subject}. Body preview: {preview}"
    )


CALENDAR_AGENT_PROMPT = (
    "You are a calendar scheduling assistant. "
    "Parse natural language scheduling requests into ISO datetime strings. "
    "Use get_available_time_slots to check availability when needed. "
    "Use create_calendar_event to schedule events. "
    "This is a safe demo, so tool results are simulated. "
    "Always confirm what was scheduled in your final response."
)

EMAIL_AGENT_PROMPT = (
    "You are an email assistant. "
    "Compose professional emails from natural language requests. "
    "Extract recipients, write a clear subject, and write a concise body. "
    "Use send_email for the final simulated send. "
    "If the recipient is a team name, use a reasonable demo email address like "
    "design-team@example.com. "
    "Always confirm what was sent in your final response."
)

SUPERVISOR_PROMPT = (
    "You are a helpful personal assistant. "
    "You can schedule calendar events and send emails by delegating to specialist "
    "agents. Break down multi-step requests into the right specialist calls. "
    "Return a concise final summary after the specialists finish."
)


def build_calendar_agent(model):
    """Create the specialist calendar agent."""
    return create_agent(
        model,
        tools=[create_calendar_event, get_available_time_slots],
        system_prompt=CALENDAR_AGENT_PROMPT,
    )


def build_email_agent(model):
    """Create the specialist email agent."""
    return create_agent(
        model,
        tools=[send_email],
        system_prompt=EMAIL_AGENT_PROMPT,
    )


def final_text(result: dict) -> str:
    """Return the final message content from an agent invocation result."""
    message = result["messages"][-1]
    content = getattr(message, "content", "")
    return content if isinstance(content, str) else str(content)


def build_personal_assistant():
    """Create a supervisor that delegates to calendar and email subagents."""
    model = build_chat_model(
        temperature=0,
        max_tokens=int(os.getenv("MULTI_AGENT_MAX_TOKENS", "4096")),
    )
    calendar_agent = build_calendar_agent(model)
    email_agent = build_email_agent(model)

    @tool
    def schedule_event(request: str) -> str:
        """Schedule calendar events using natural language.

        Use this when the user wants to create, modify, or check calendar
        appointments. Handles date/time parsing, availability checking, and event
        creation.
        """
        log_block("Supervisor delegated to calendar agent", request)
        result = calendar_agent.invoke({"messages": [{"role": "user", "content": request}]})
        response = final_text(result)
        log_block("Calendar agent result", response)
        return response

    @tool
    def manage_email(request: str) -> str:
        """Send emails using natural language.

        Use this when the user wants to send notifications, reminders, or any
        email communication. Handles recipient extraction, subject generation,
        and email composition.
        """
        log_block("Supervisor delegated to email agent", request)
        result = email_agent.invoke({"messages": [{"role": "user", "content": request}]})
        response = final_text(result)
        log_block("Email agent result", response)
        return response

    return create_agent(
        model,
        tools=[schedule_event, manage_email],
        system_prompt=SUPERVISOR_PROMPT,
    )


def run_personal_assistant() -> None:
    """Run the supervisor/subagent demo."""
    query = (
        "Schedule a meeting with the design team next Tuesday at 2pm for 1 hour, "
        "and send them an email reminder about reviewing the new mockups."
    )
    log_block("User request", query)

    supervisor = build_personal_assistant()
    result = supervisor.invoke({"messages": [{"role": "user", "content": query}]})
    log_block("Final supervisor answer", final_text(result))

    if os.getenv("SHOW_MULTI_AGENT_MESSAGES", "").lower() in {"1", "true", "yes", "on"}:
        log_line("Final supervisor messages")
        for index, message in enumerate(result["messages"], start=1):
            message_type = getattr(message, "type", message.__class__.__name__)
            tool_calls = getattr(message, "tool_calls", None)
            content = getattr(message, "content", "")
            log_line(f"[{index}] {message_type}")
            if tool_calls:
                log_line(f"tool_calls={tool_calls}")
            if content:
                log_block(f"Message {index} content", content)


if __name__ == "__main__":
    run_personal_assistant()
