# LangGraph Learning Path

This is a beginner-to-advanced path for learning LangGraph in one day.
It is organized to move from graph basics to the features that make LangGraph
useful for real agents: persistence, interrupts, streaming, subgraphs, and
shared memory.

## What to learn, in order

1. **Graph basics**
   - State
   - Nodes
   - Edges
   - `START` and `END`
   - Compiling a graph

2. **State updates**
   - Overwrite semantics
   - Reducers
   - Message lists and accumulated state

3. **Control flow**
   - Sequential execution
   - Conditional routing
   - `Command` for advanced routing

4. **Persistence**
   - Checkpointers
   - `thread_id`
   - Multi-turn continuation
   - Time travel and replay

5. **Human-in-the-loop**
   - `interrupt()`
   - `Command(resume=...)`
   - Review / approval workflows

6. **Streaming**
   - `updates`
   - `values`
   - Debugging execution step by step

7. **Subgraphs**
   - Reusable workflows
   - Parent / child graph composition
   - Shared state across nested graphs

8. **Tools and agents**
   - Tool calling loops
   - `create_agent`
   - LangGraph-backed agents
   - When to use raw LangGraph vs higher-level agent builders

9. **Shared memory**
   - Checkpointer vs store
   - Short-term vs long-term memory
   - Cross-thread persistence

## Suggested study order today

### Round 1: Core mental model

Run:
- [`langgraph_state_machine.py`](../src/orchestration/langgraph_state_machine.py)

Focus on:
- how state moves between nodes
- how reducers change the meaning of an update
- how conditional routing changes execution

### Round 2: Persistence and review

Run:
- [`weather_tool_graph.py`](../src/agents/weather_tool_graph.py)
- [`langgraph_state_machine.py`](../src/orchestration/langgraph_state_machine.py)

Focus on:
- why `thread_id` matters
- what a checkpointer actually preserves
- how interrupts let humans safely steer execution

### Round 3: Agent-style patterns

Run:
- [`arithmetic_tool_agent.py`](../src/agents/arithmetic_tool_agent.py)
- [`weather_tool_graph.py`](../src/agents/weather_tool_graph.py)

Focus on:
- how tool loops work
- how LangGraph underpins agent control flow

### Round 4: Real-world orchestration

Coming later as a polished module.

Focus on:
- long-running tasks
- large tool outputs
- why stateful orchestration matters once tasks become multi-step

## Hands-on exercises

1. Change the reducer in the demo script from list-append to overwrite and observe
   what breaks.
2. Add a third node to the sequential demo and print the state at each step.
3. Change the routing condition so the graph takes the other branch.
4. Resume the interrupt demo with a different answer and watch the final state change.
5. Add a subgraph step that computes a summary from the shared state.
6. Replace one deterministic node with a real tool call or model call.

## Concept map

- `StateGraph` is for explicit orchestration.
- `checkpointer` gives you durable threads and resumes.
- `interrupt()` gives you human approval and pause/resume.
- `stream()` gives you observability while the graph runs.
- subgraphs let you build reusable workflows.
- stores let you share memory across threads.
- `create_agent` is the high-level agent layer built on LangGraph.

## Good mental model

Think of LangGraph as:
- a typed state machine
- with durable checkpoints
- that can pause for humans
- that can stream its execution
- and can compose reusable subgraphs

That is the core of the framework.
