"""LangGraph arithmetic agent with an explicit tool-calling loop."""

from pathlib import Path
from typing import Annotated, Literal, TypedDict

from dotenv import load_dotenv
from langchain.messages import AnyMessage, HumanMessage, SystemMessage, ToolMessage
from langchain.tools import tool
from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages
from model_config import build_chat_model

PROJECT_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(PROJECT_ROOT / ".env")


@tool
def multiply(a: int, b: int) -> int:
    """Multiply `a` and `b`."""
    return a * b


@tool
def add(a: int, b: int) -> int:
    """Add `a` and `b`."""
    return a + b


@tool
def divide(a: int, b: int) -> float:
    """Divide `a` by `b`."""
    return a / b


tools = [add, multiply, divide]
tools_by_name = {tool.name: tool for tool in tools}

model = build_chat_model(temperature=0)
model_with_tools = model.bind_tools(tools)


class MessagesState(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]
    llm_calls: int


def llm_call(state: MessagesState) -> MessagesState:
    """Ask the LLM whether to answer directly or request a tool call."""
    response = model_with_tools.invoke(
        [
            SystemMessage(
                content=(
                    "You are a helpful assistant tasked with performing "
                    "arithmetic on a set of inputs."
                )
            ),
            *state["messages"],
        ]
    )
    return {
        "messages": [response],
        "llm_calls": state.get("llm_calls", 0) + 1,
    }


def tool_node(state: MessagesState) -> MessagesState:
    """Execute all tool calls requested by the latest model message."""
    result = []
    for tool_call in state["messages"][-1].tool_calls:
        selected_tool = tools_by_name[tool_call["name"]]
        observation = selected_tool.invoke(tool_call["args"])
        result.append(
            ToolMessage(content=str(observation), tool_call_id=tool_call["id"])
        )
    return {"messages": result, "llm_calls": state.get("llm_calls", 0)}


def should_continue(state: MessagesState) -> Literal["tool_node", "__end__"]:
    """Route to tools when the model requested tool calls; otherwise stop."""
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "tool_node"
    return END


def build_agent():
    agent_builder = StateGraph(MessagesState)
    agent_builder.add_node("llm_call", llm_call)
    agent_builder.add_node("tool_node", tool_node)
    agent_builder.add_edge(START, "llm_call")
    agent_builder.add_conditional_edges(
        "llm_call",
        should_continue,
        ["tool_node", END],
    )
    agent_builder.add_edge("tool_node", "llm_call")
    return agent_builder.compile()


def main() -> None:
    agent = build_agent()
    result = agent.invoke(
        {
            "messages": [
                HumanMessage(
                    content="Add 3 and 4, then multiply the result by 10."
                )
            ],
            "llm_calls": 0,
        }
    )

    for message in result["messages"]:
        message.pretty_print()
    print(f"LLM calls: {result['llm_calls']}")


if __name__ == "__main__":
    main()
