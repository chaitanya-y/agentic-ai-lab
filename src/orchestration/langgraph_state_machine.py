"""LangGraph orchestration patterns.

This script is intentionally model-free so you can learn the graph mechanics
without needing API keys. It covers:

- state and reducers
- conditional routing
- checkpointed multi-turn state
- human-in-the-loop interrupts
- subgraphs
- streaming

Run one demo at a time:

    python3 src/orchestration/langgraph_state_machine.py --demo reducers
    python3 src/orchestration/langgraph_state_machine.py --demo routing
    python3 src/orchestration/langgraph_state_machine.py --demo checkpoints
    python3 src/orchestration/langgraph_state_machine.py --demo interrupt
    python3 src/orchestration/langgraph_state_machine.py --demo subgraph
    python3 src/orchestration/langgraph_state_machine.py --demo streaming
"""

from __future__ import annotations

import argparse
import operator
from pathlib import Path
from typing import Annotated, Literal, TypedDict

from dotenv import load_dotenv
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.types import Command, interrupt

PROJECT_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(PROJECT_ROOT / ".env")


class StoryState(TypedDict):
    topic: str
    steps: Annotated[list[str], operator.add]
    result: str


def demo_reducers() -> None:
    """Show how state gets updated and accumulated."""

    def refine_topic(state: StoryState):
        return {"topic": f"{state['topic']} and cats", "steps": ["refine_topic"]}

    def generate_result(state: StoryState):
        return {
            "result": f"Final story about {state['topic']}",
            "steps": ["generate_result"],
        }

    graph = (
        StateGraph(StoryState)
        .add_node("refine_topic", refine_topic)
        .add_node("generate_result", generate_result)
        .add_edge(START, "refine_topic")
        .add_edge("refine_topic", "generate_result")
        .add_edge("generate_result", END)
        .compile()
    )

    result = graph.invoke({"topic": "ice cream", "steps": [], "result": ""})
    print("Reducers demo")
    print(result)


class RouteState(TypedDict):
    number: int
    parity: str
    trace: Annotated[list[str], operator.add]


def demo_routing() -> None:
    """Show conditional routing."""

    def classify(state: RouteState):
        parity = "even" if state["number"] % 2 == 0 else "odd"
        return {"parity": parity, "trace": [f"classified:{parity}"]}

    def even_path(state: RouteState):
        return {"trace": ["even_path"], "number": state["number"] * 2}

    def odd_path(state: RouteState):
        return {"trace": ["odd_path"], "number": state["number"] + 1}

    def route(state: RouteState) -> Literal["even_path", "odd_path"]:
        return "even_path" if state["parity"] == "even" else "odd_path"

    graph = (
        StateGraph(RouteState)
        .add_node("classify", classify)
        .add_node("even_path", even_path)
        .add_node("odd_path", odd_path)
        .add_edge(START, "classify")
        .add_conditional_edges("classify", route, ["even_path", "odd_path"])
        .add_edge("even_path", END)
        .add_edge("odd_path", END)
        .compile()
    )

    result = graph.invoke({"number": 10, "parity": "", "trace": []})
    print("Routing demo")
    print(result)


class CounterState(TypedDict):
    messages: Annotated[list[str], operator.add]
    reply: str


def demo_checkpoints() -> None:
    """Show thread-scoped persistence across invocations."""

    def respond(state: CounterState):
        return {
            "reply": f"seen {len(state['messages'])} messages",
            "messages": [f"assistant: {len(state['messages'])} total"],
        }

    graph = (
        StateGraph(CounterState)
        .add_node("respond", respond)
        .add_edge(START, "respond")
        .add_edge("respond", END)
        .compile(checkpointer=InMemorySaver())
    )

    config = {"configurable": {"thread_id": "learning-thread"}}

    first = graph.invoke({"messages": ["user: hello"], "reply": ""}, config=config)
    second = graph.invoke({"messages": ["user: follow up"], "reply": ""}, config=config)
    print("Checkpoint demo")
    print(first)
    print(second)


class ReviewState(TypedDict):
    request: str
    approved: bool
    notes: Annotated[list[str], operator.add]


def demo_interrupts() -> None:
    """Show pause and resume with human input."""

    def human_review(state: ReviewState):
        decision = interrupt({"request": state["request"]})
        if isinstance(decision, dict):
            approved = bool(decision.get("approved", False))
            note = str(decision.get("note", ""))
        else:
            approved = bool(decision)
            note = str(decision)
        return {"approved": approved, "notes": [f"reviewed:{note or approved}"]}

    graph = (
        StateGraph(ReviewState)
        .add_node("human_review", human_review)
        .add_edge(START, "human_review")
        .add_edge("human_review", END)
        .compile(checkpointer=InMemorySaver())
    )

    config = {"configurable": {"thread_id": "review-thread"}}

    paused = graph.invoke(
        {"request": "Approve publish?", "approved": False, "notes": []},
        config=config,
    )
    print("Interrupt demo")
    print("Paused run:")
    print(paused)

    resumed = graph.invoke(Command(resume={"approved": True, "note": "looks good"}), config=config)
    print("Resumed run:")
    print(resumed)


class SharedState(TypedDict):
    topic: str
    summary: str
    trace: Annotated[list[str], operator.add]


class SubState(TypedDict):
    topic: str
    summary: str
    trace: Annotated[list[str], operator.add]


def demo_subgraph() -> None:
    """Show how a subgraph can be plugged into a parent graph."""

    def sub_step_one(state: SubState):
        return {"trace": ["sub_step_one"]}

    def sub_step_two(state: SubState):
        return {
            "summary": f"subgraph summary for {state['topic']}",
            "trace": ["sub_step_two"],
        }

    subgraph = (
        StateGraph(SubState)
        .add_node("sub_step_one", sub_step_one)
        .add_node("sub_step_two", sub_step_two)
        .add_edge(START, "sub_step_one")
        .add_edge("sub_step_one", "sub_step_two")
        .add_edge("sub_step_two", END)
        .compile()
    )

    def parent_step(state: SharedState):
        return {"trace": ["parent_step"], "topic": f"learn {state['topic']}"}

    graph = (
        StateGraph(SharedState)
        .add_node("parent_step", parent_step)
        .add_node("subgraph", subgraph)
        .add_edge(START, "parent_step")
        .add_edge("parent_step", "subgraph")
        .add_edge("subgraph", END)
        .compile()
    )

    result = graph.invoke(
        {"topic": "langgraph", "summary": "", "trace": []}
    )
    print("Subgraph demo")
    print(result)


class StreamState(TypedDict):
    topic: str
    joke: str


def demo_streaming() -> None:
    """Show updates vs values streaming."""

    def refine_topic(state: StreamState):
        return {"topic": f"{state['topic']} and cats"}

    def generate_joke(state: StreamState):
        return {"joke": f"Joke about {state['topic']}"}

    graph = (
        StateGraph(StreamState)
        .add_node("refine_topic", refine_topic)
        .add_node("generate_joke", generate_joke)
        .add_edge(START, "refine_topic")
        .add_edge("refine_topic", "generate_joke")
        .add_edge("generate_joke", END)
        .compile()
    )

    print("Streaming demo: updates")
    for chunk in graph.stream({"topic": "ice cream", "joke": ""}, stream_mode="updates"):
        print(chunk)

    print("Streaming demo: values")
    for chunk in graph.stream({"topic": "ice cream", "joke": ""}, stream_mode="values"):
        print(chunk)


DEMOS = {
    "reducers": demo_reducers,
    "routing": demo_routing,
    "checkpoints": demo_checkpoints,
    "interrupt": demo_interrupts,
    "subgraph": demo_subgraph,
    "streaming": demo_streaming,
}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--demo",
        choices=sorted(DEMOS),
        required=True,
        help="Which LangGraph concept demo to run.",
    )
    args = parser.parse_args()
    DEMOS[args.demo]()


if __name__ == "__main__":
    main()
