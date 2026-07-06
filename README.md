# Agentic AI Lab

A focused AI engineering portfolio demonstrating retrieval systems, agentic tool
use, graph orchestration, local embeddings, and safe model execution patterns.

The implementations use LangChain and LangGraph where they are useful, but the
repo is organized around engineering capabilities: retrieval, orchestration,
tooling, state, and operational safety.

## Highlights

- End-to-end semantic search over documents with chunking, embeddings, and vector search
- RAG agent that exposes retrieval as a tool and lets the model decide when to search
- RAG chain that retrieves deterministically before generation for lower latency and easier debugging
- Tool-calling agents with explicit control flow and model/tool message inspection
- LangGraph state-machine examples covering reducers, routing, checkpoints, interrupts, subgraphs, and streaming
- Local Hugging Face embeddings with commented hosted OpenAI embedding alternatives for comparison
- Guardrails for secrets, local data, model caches, and paid API calls

## Architecture Coverage

| Area | What It Demonstrates | Module |
| --- | --- | --- |
| Retrieval | PDF loading, chunking, local embeddings, vector search | `src/retrieval/semantic_search.py` |
| Agentic RAG | Retrieval as a tool, multi-step tool use, grounded answers | `src/agents/rag_agent.py` |
| RAG Chain | Middleware-driven retrieval before a single model call | `src/agents/rag_chain.py` |
| Tool Agents | Tool schemas, tool execution loops, final response routing | `src/agents/arithmetic_tool_agent.py` |
| Graph Workflows | State, reducers, conditional routing, checkpoints, interrupts | `src/orchestration/langgraph_state_machine.py` |

## Repository Structure

```text
src/
  retrieval/
    semantic_search.py              # PDF retrieval pipeline with local embeddings

  orchestration/
    langgraph_state_machine.py      # LangGraph state and control-flow patterns

  agents/
    rag_agent.py                    # Agentic RAG over Lilian Weng's agents blog post
    rag_chain.py                    # Deterministic RAG chain with retrieval middleware
    arithmetic_tool_agent.py        # Explicit tool-calling agent loop
    weather_tool_graph.py           # Tool-backed graph workflow

docs/
  langgraph_orchestration_notes.md  # Notes on graph orchestration concepts
  publishing.md                     # Public repo checklist

data/
  README.md                         # Sample data instructions
```

Local scratch work lives in `sandbox/` and is ignored by Git. Large local data
files, model caches, virtual environments, and secrets are not committed.

## Setup

This project uses [`uv`](https://docs.astral.sh/uv/) for reproducible Python
dependency management.

```bash
uv sync
cp .env.example .env
```

Never commit `.env`.

## Embedding Strategy

The active embedding path uses a local Hugging Face model:

```text
Qwen/Qwen3-Embedding-0.6B
```

This avoids hosted embedding API costs. The first run downloads model weights to
the Hugging Face cache; later runs reuse the local cache. The code also shows a
commented `OpenAIEmbeddings` option for comparison when a hosted embedding model
is preferred.

## Running The Systems

### Semantic Search

Download the sample PDF described in [data/README.md](data/README.md), then run:

```bash
uv run python src/retrieval/semantic_search.py
```

By default, the pipeline embeds only the first `20` chunks to keep local runs
laptop-friendly. To index the full PDF:

```bash
MAX_CHUNKS=0 uv run python src/retrieval/semantic_search.py
```

### RAG Agent

The RAG agent follows the LangChain RAG tutorial pattern: load a public blog
post, split it into chunks, index it, expose retrieval as a tool, and let the
model decide when to search.

```bash
MODEL_PROVIDER=ollama uv run python src/agents/rag_agent.py
```

Debug retrieval and model messages:

```bash
SHOW_RETRIEVED_CONTEXT=true SHOW_AGENT_MESSAGES=true MODEL_PROVIDER=ollama uv run python src/agents/rag_agent.py
```

### RAG Chain

The RAG chain retrieves first in middleware, injects context into the model input,
and calls the model once.

```bash
MODEL_PROVIDER=ollama uv run python src/agents/rag_chain.py
```

Inspect the exact context-injected model input:

```bash
SHOW_FINAL_MODEL_INPUT=true MODEL_PROVIDER=ollama uv run python src/agents/rag_chain.py
```

### LangGraph Orchestration

```bash
uv run python src/orchestration/langgraph_state_machine.py --demo reducers
uv run python src/orchestration/langgraph_state_machine.py --demo routing
uv run python src/orchestration/langgraph_state_machine.py --demo checkpoints
uv run python src/orchestration/langgraph_state_machine.py --demo interrupts
uv run python src/orchestration/langgraph_state_machine.py --demo subgraphs
uv run python src/orchestration/langgraph_state_machine.py --demo streaming
```

### Tool-Calling Agents

```bash
uv run python src/agents/arithmetic_tool_agent.py
uv run python src/agents/weather_tool_graph.py
```

## Hosted Model Safety

RAG modules may call a chat model. Use Ollama for local chat inference:

```bash
MODEL_PROVIDER=ollama uv run python src/agents/rag_agent.py
```

To use hosted OpenAI models, opt in explicitly:

```bash
MODEL_PROVIDER=openai ALLOW_PAID_API_CALLS=true uv run python src/agents/rag_agent.py
```

This explicit flag prevents accidental paid API calls.

## Operational Notes

- `.env` is ignored because it may contain API keys.
- `.venv` is ignored because environments should be rebuilt with `uv sync`.
- `data/*.pdf` is ignored to avoid committing large source documents.
- Hugging Face model weights are cached outside this repo by default.
- `InMemoryVectorStore` stores vectors only in RAM; vectors disappear when a script exits.
- `sandbox/` is ignored because it contains rough local experiments.

## Roadmap

Planned additions:

- SQL agent with safe query execution and review flow
- Persistent vector store example
- LangGraph custom RAG workflow with relevance grading and query rewriting
- Multi-agent patterns for routing, handoffs, and subagents

## Positioning

This repository is intentionally small, executable, and inspectable. It shows the
mechanics behind agentic AI systems instead of hiding everything behind a single
high-level API call.
