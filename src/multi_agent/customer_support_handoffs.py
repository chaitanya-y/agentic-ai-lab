"""Customer support handoffs using a state-machine agent.

Docs source:
https://docs.langchain.com/oss/python/langchain/multi-agent/handoffs-customer-support

This module follows the LangChain handoffs tutorial structure:
- define custom agent state with a `current_step`
- use tools that return `Command` objects to update workflow state
- use middleware to swap the agent's prompt and tools for each step
- persist the conversation with an in-memory checkpointer

Conceptual difference from `personal_assistant.py`:
- Subagents pattern: a supervisor calls specialist agents as tools.
- Handoffs pattern: one agent changes behavior as state moves across steps.

Runtime flow:
1. `warranty_collector` asks whether the device is in warranty.
2. `record_warranty_status` saves warranty state and moves to `issue_classifier`.
3. `record_issue_type` saves hardware/software classification and moves to
   `resolution_specialist`.
4. `provide_solution` or `escalate_to_human` handles the final resolution.

Why the state tools use `return_direct=True`:
- The tool result ends the current turn immediately after state is updated.
- This prevents the model from collecting warranty, classifying the issue, and
  solving the case all in one turn.
- The next user message continues from the updated state because the
  checkpointer persists `current_step`, `warranty_status`, and `issue_type`.

Safety note:
- No real ticket, refund, repair, or support system is called.
- Escalation and solutions are simulated local tool responses.
"""

from __future__ import annotations

import os
import pathlib
import sys
from collections.abc import Callable
from typing import Literal, NotRequired
from uuid import uuid4

from dotenv import load_dotenv
from langchain.agents import AgentState, create_agent
from langchain.agents.middleware import ModelRequest, ModelResponse, wrap_model_call
from langchain.messages import HumanMessage, ToolMessage
from langchain.tools import ToolRuntime, tool
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.types import Command

PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC_ROOT = PROJECT_ROOT / "src"
sys.path.insert(0, str(SRC_ROOT))

from agents.model_config import build_chat_model
from utils.demo_io import enabled, log_block, log_line
from utils.token_usage import collect_token_usage, print_openai_usage_report

load_dotenv(PROJECT_ROOT / ".env")

SupportStep = Literal["warranty_collector", "issue_classifier", "resolution_specialist"]


class SupportState(AgentState):
    """State for the customer support handoff workflow."""

    current_step: NotRequired[SupportStep]
    warranty_status: NotRequired[Literal["in_warranty", "out_of_warranty"]]
    issue_type: NotRequired[Literal["hardware", "software"]]


@tool(return_direct=True)
def record_warranty_status(
    status: Literal["in_warranty", "out_of_warranty"],
    runtime: ToolRuntime[None, SupportState],
) -> Command:
    """Record warranty status and hand off to issue classification."""
    return Command(
        update={
            "messages": [
                ToolMessage(
                    content=(
                        f"Warranty status recorded as: {status}. "
                        "Please describe the issue so I can classify it."
                    ),
                    tool_call_id=runtime.tool_call_id,
                )
            ],
            "warranty_status": status,
            "current_step": "issue_classifier",
        }
    )


@tool(return_direct=True)
def record_issue_type(
    issue_type: Literal["hardware", "software"],
    runtime: ToolRuntime[None, SupportState],
) -> Command:
    """Record issue type and hand off to the resolution specialist."""
    return Command(
        update={
            "messages": [
                ToolMessage(
                    content=(
                        f"Issue type recorded as: {issue_type}. "
                        "Ask what to do next when you are ready for resolution steps."
                    ),
                    tool_call_id=runtime.tool_call_id,
                )
            ],
            "issue_type": issue_type,
            "current_step": "resolution_specialist",
        }
    )


@tool
def provide_solution(solution: str) -> str:
    """Provide a simulated support solution to the customer."""
    return f"Simulated solution provided: {solution}"


@tool
def escalate_to_human(reason: str) -> str:
    """Escalate the case to a simulated human support specialist."""
    return f"Simulated escalation created for human support. Reason: {reason}"


WARRANTY_COLLECTOR_PROMPT = """You are a customer support agent helping with device issues.

CURRENT STEP: Warranty verification

At this step:
1. Greet the customer warmly.
2. Ask if their device is under warranty.
3. If the user already provided warranty information, call record_warranty_status.

Strict workflow rule:
- After calling record_warranty_status, stop this stage. Do not classify the issue.
- Do not provide a solution in this stage.
- If you need to respond after recording warranty, ask the customer to describe
  the issue in the next message.

Keep the response brief and friendly."""

ISSUE_CLASSIFIER_PROMPT = """You are a customer support agent helping with device issues.

CURRENT STEP: Issue classification
CUSTOMER INFO: Warranty status is {warranty_status}

At this step:
1. Ask the customer to describe the issue if the latest user message does not
   describe the issue.
2. Classify physical damage, broken parts, battery swelling, or cracked screens
   as hardware.
3. Classify app crashes, slow performance, setup, or account problems as software.
4. Call record_issue_type once the latest user message clearly describes the issue.

Strict workflow rule:
- Do not classify based only on messages that happened before warranty was
  recorded.
- If the latest user message only gives warranty information, ask for issue
  details instead of calling record_issue_type.
- After calling record_issue_type, do not provide a solution in the same turn.
  Wait for the user to ask what to do next.

If unclear, ask one clarifying question."""

RESOLUTION_SPECIALIST_PROMPT = """You are a customer support agent helping with device issues.

CURRENT STEP: Resolution
CUSTOMER INFO: Warranty status is {warranty_status}, issue type is {issue_type}

At this step:
1. For software issues, call provide_solution with troubleshooting steps.
2. For hardware issues in warranty, call provide_solution with warranty repair instructions.
3. For hardware issues out of warranty, call escalate_to_human for paid repair options.

Strict workflow rule:
- Only provide the solution when the latest user message asks what to do next,
  asks for help, or asks for a resolution.
- If the latest user message only described the issue, acknowledge the
  classification and ask whether they want next steps.

Be specific, practical, and concise."""


STEP_CONFIG = {
    "warranty_collector": {
        "prompt": WARRANTY_COLLECTOR_PROMPT,
        "tools": [record_warranty_status],
        "requires": [],
    },
    "issue_classifier": {
        "prompt": ISSUE_CLASSIFIER_PROMPT,
        "tools": [record_issue_type],
        "requires": ["warranty_status"],
    },
    "resolution_specialist": {
        "prompt": RESOLUTION_SPECIALIST_PROMPT,
        "tools": [provide_solution, escalate_to_human],
        "requires": ["warranty_status", "issue_type"],
    },
}


@wrap_model_call
def apply_step_config(
    request: ModelRequest,
    handler: Callable[[ModelRequest], ModelResponse],
) -> ModelResponse:
    """Configure the agent based on the current support step."""
    current_step = request.state.get("current_step", "warranty_collector")
    step_config = STEP_CONFIG[current_step]

    for key in step_config["requires"]:
        if request.state.get(key) is None:
            raise ValueError(f"{key} must be set before reaching {current_step}")

    system_prompt = step_config["prompt"].format(**request.state)
    request = request.override(
        system_prompt=system_prompt,
        tools=step_config["tools"],
    )
    return handler(request)


def build_customer_support_agent():
    """Create the customer support state-machine agent."""
    model = build_chat_model(
        temperature=0,
        max_tokens=int(os.getenv("MULTI_AGENT_MAX_TOKENS", "4096")),
    )
    all_tools = [
        record_warranty_status,
        record_issue_type,
        provide_solution,
        escalate_to_human,
    ]
    return create_agent(
        model,
        tools=all_tools,
        state_schema=SupportState,
        middleware=[apply_step_config],
        checkpointer=InMemorySaver(),
    )


def print_messages(result: dict) -> None:
    """Print messages for the current turn when debugging is enabled."""
    if not enabled("SHOW_MULTI_AGENT_MESSAGES", default=True):
        return

    log_line("Current conversation messages")
    for index, message in enumerate(result["messages"], start=1):
        message_type = getattr(message, "type", message.__class__.__name__)
        tool_calls = getattr(message, "tool_calls", None)
        content = getattr(message, "content", "")
        log_line(f"[{index}] {message_type}")
        if tool_calls:
            log_line(f"tool_calls={tool_calls}")
        if content:
            log_block(f"Message {index} content", content)


def run_customer_support_handoffs() -> None:
    """Run the customer support handoff/state-machine demo."""
    agent = build_customer_support_agent()
    thread_id = str(uuid4())
    config = {"configurable": {"thread_id": thread_id}}
    turns = [
        "Hi, my phone screen is cracked.",
        "Yes, it is still under warranty.",
        "The screen is physically cracked from dropping it.",
        "What should I do next?",
    ]

    result = None
    for turn_number, user_message in enumerate(turns, start=1):
        log_block(f"Turn {turn_number} user", user_message)
        result = agent.invoke(
            {"messages": [HumanMessage(content=user_message)]},
            config,
        )
        log_line(f"Current step: {result.get('current_step', 'warranty_collector')}")
        if result.get("warranty_status"):
            log_line(f"Warranty status: {result['warranty_status']}")
        if result.get("issue_type"):
            log_line(f"Issue type: {result['issue_type']}")
        print_messages(result)

    if result:
        usage = collect_token_usage(result["messages"])
        if enabled("SHOW_TOKEN_USAGE", default=True):
            print_openai_usage_report(usage)


if __name__ == "__main__":
    run_customer_support_handoffs()
