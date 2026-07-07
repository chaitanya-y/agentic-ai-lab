"""LangGraph weather agent with an explicit tool-calling loop."""

from pathlib import Path
from typing import Annotated, Literal, TypedDict

from dotenv import load_dotenv
from langchain.messages import AnyMessage, HumanMessage, SystemMessage, ToolMessage
from langchain.tools import tool
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages
from model_config import build_chat_model

PROJECT_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(PROJECT_ROOT / ".env")


class WeatherState(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]
    llm_calls: int


@tool
def get_weather(city: str) -> str:
    """Get the weather for a city."""
    return f"It's always sunny in {city}!"


tools = [get_weather]
tools_by_name = {tool.name: tool for tool in tools}

model = build_chat_model(temperature=0)
model_with_tools = model.bind_tools(tools)


def call_model(state: WeatherState) -> WeatherState:
    """Ask the model to answer or request a weather tool call."""
    response = model_with_tools.invoke(
        [
            SystemMessage(
                content=(
                    "You are a concise weather assistant. "
                    "Use the get_weather tool when the user asks about weather."
                )
            ),
            *state["messages"],
        ]
    )
    return {
        "messages": [response],
        "llm_calls": state.get("llm_calls", 0) + 1,
    }


def tool_node(state: WeatherState) -> WeatherState:
    """Execute weather tool calls requested by the latest model message."""
    results = []
    for tool_call in state["messages"][-1].tool_calls:
        selected_tool = tools_by_name[tool_call["name"]]
        observation = selected_tool.invoke(tool_call["args"])
        results.append(
            ToolMessage(content=str(observation), tool_call_id=tool_call["id"])
        )
    return {"messages": results, "llm_calls": state.get("llm_calls", 0)}


def should_continue(state: WeatherState) -> Literal["tool_node", "__end__"]:
    """Route to tools when the model requested tool calls; otherwise stop."""
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "tool_node"
    return END


def build_graph():
    builder = StateGraph(WeatherState)
    builder.add_node("call_model", call_model)
    builder.add_node("tool_node", tool_node)
    builder.add_edge(START, "call_model")
    builder.add_conditional_edges(
        "call_model",
        should_continue,
        ["tool_node", END],
    )
    builder.add_edge("tool_node", "call_model")
    return builder.compile(checkpointer=InMemorySaver())


def main() -> None:
    graph = build_graph()
    config = {"configurable": {"thread_id": "langgraph-weather-demo"}}

    result = graph.invoke(
        {
            "messages": [
                HumanMessage(content="san franscisco only")
            ],
            "llm_calls": 0,
        },
        config=config,
    )

    for message in result["messages"]:
        message.pretty_print()
    print(f"LLM calls: {result['llm_calls']}")


if __name__ == "__main__":
    main()
