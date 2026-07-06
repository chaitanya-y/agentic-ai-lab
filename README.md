# Agentic AI Lab

A portfolio-style collection of small, working AI engineering systems covering
retrieval, agent tool use, graph orchestration, memory, and local model tradeoffs.

The current implementations use LangChain and LangGraph where they provide useful
abstractions, but the repository is organized around engineering capabilities,
not a single framework.

## What This Demonstrates

- Retrieval pipelines: documents, chunking, embeddings, vector search, retrievers
- Agent tool use: tool schemas, tool execution loops, final-response routing
- Graph orchestration: state, reducers, conditional edges, checkpoints, interrupts
- Local model operations: Hugging Face embedding models, cache behavior, CPU tradeoffs
- Production instincts: secrets management, ignored data artifacts, reproducible setup

## Repository Structure

```text
src/
  retrieval/
    semantic_search.py              # PDF retrieval pipeline with local embeddings

  orchestration/
    langgraph_state_machine.py      # State, reducers, routing, checkpoints, interrupts

  agents/
    arithmetic_tool_agent.py        # Explicit tool-calling agent loop
    weather_tool_graph.py           # Tool-backed graph workflow

docs/
  langgraph_orchestration_notes.md  # Concept notes for graph orchestration
  publishing.md                     # Public repo checklist

data/
  README.md                         # Sample data instructions
```

Local scratch work lives in `sandbox/` and is ignored by Git.

## Setup

This project uses [`uv`](https://docs.astral.sh/uv/) for reproducible Python
dependency management.

```bash
uv sync
```

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

Never commit `.env`.

## Retrieval: Semantic Search

Download the sample PDF described in [data/README.md](data/README.md), then run:

```bash
uv run python src/retrieval/semantic_search.py
```

By default, the pipeline embeds only the first `20` chunks so it is friendly for
laptops running local embedding models.

To embed the full PDF:

```bash
MAX_CHUNKS=0 uv run python src/retrieval/semantic_search.py
```

That can take longer and may make your machine warm because it uses a local
embedding model.

## Local vs Paid Embeddings

The retrieval pipeline uses:

```text
Qwen/Qwen3-Embedding-0.6B
```

This model is downloaded from Hugging Face and runs locally in the Python
process. There is no OpenAI API cost for that path.

The file also includes a commented OpenAI embedding option for comparison:

```python
# embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
```

Uncommenting that line and using OpenAI embeddings will call a paid API.

## Orchestration: LangGraph State Machine

```bash
uv run python src/orchestration/langgraph_state_machine.py --demo reducers
uv run python src/orchestration/langgraph_state_machine.py --demo routing
uv run python src/orchestration/langgraph_state_machine.py --demo checkpoints
uv run python src/orchestration/langgraph_state_machine.py --demo interrupts
uv run python src/orchestration/langgraph_state_machine.py --demo subgraphs
uv run python src/orchestration/langgraph_state_machine.py --demo streaming
```

## Agents: Tool-Calling Workflows

```bash
uv run python src/agents/arithmetic_tool_agent.py
uv run python src/agents/weather_tool_graph.py
```

## Safety Notes

- `.env` is ignored because it may contain API keys.
- `.venv` is ignored because environments should be rebuilt with `uv sync`.
- Hugging Face model weights are cached outside this repo by default.
- `InMemoryVectorStore` stores vectors only in RAM; vectors disappear when the
  script exits.
- `sandbox/` is ignored because it contains rough local experiments.

## Positioning

This repository is intentionally small and inspectable. It is meant to show that
I understand the mechanics behind agentic AI systems, not just how to call a
high-level API.
