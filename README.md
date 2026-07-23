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
- SQL agent over the Chinook sample database with query checking and optional human review
- Multi-agent supervisor pattern with calendar and email specialist subagents
- Deep Agents research harness with planning, file-system, and delegation-ready capabilities
- Next.js portfolio UI for browsing every implemented agent with GitHub source links
- Docs-aligned voice-agent sandwich pipeline with STT, LangChain agent, and TTS stages
- Tool-calling agents with explicit control flow and model/tool message inspection
- LangGraph state-machine examples covering reducers, routing, checkpoints, interrupts, subgraphs, and streaming
- Local Qwen chat and embedding models with hosted OpenAI alternatives gated behind explicit opt-in
- Guardrails for secrets, local data, model caches, and paid API calls

## Explore The Portfolio UI

The fastest way to review this project is through the Next.js portfolio app. It
groups every implemented agent by category, explains the architecture and
concepts behind each system, and links directly to the relevant GitHub source
file.

```bash
cd web
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Recommended Review Path

For a quick technical review of the repository:

1. Start with the portfolio UI to understand the agent catalog and system map.
2. Review `src/agents/model_config.py` and `src/utils/` to see model selection,
   paid-call gating, shared output helpers, and token/cost accounting.
3. Inspect `src/retrieval/semantic_search.py`, then compare
   `src/agents/rag_chain.py` with `src/agents/rag_agent.py` to see deterministic
   RAG versus agentic RAG.
4. Move to `src/workflows/` for explicit LangGraph control flow, including
   custom RAG and SQL workflows.
5. Finish with `src/multi_agent/` and `src/deep_agents/` for supervisor,
   handoff, routing, skill-loading, and Deep Agents patterns.

## Architecture Coverage

| Area | What It Demonstrates | Module |
| --- | --- | --- |
| Retrieval | PDF loading, chunking, local embeddings, vector search | `src/retrieval/semantic_search.py` |
| Agentic RAG | Retrieval as a tool, multi-step tool use, grounded answers | `src/agents/rag_agent.py` |
| RAG Chain | Middleware-driven retrieval before a single model call | `src/agents/rag_chain.py` |
| LangGraph RAG | Custom retrieval agent with grading, query rewriting, and graph routing | `src/workflows/langgraph_rag_agent.py` |
| SQL Agent | Schema inspection, query checking, read-only execution, human review | `src/agents/sql_agent.py` |
| LangGraph SQL | Custom SQL graph with explicit query generation, checking, execution, and final answer loop | `src/workflows/langgraph_sql_agent.py` |
| Multi-Agent | Subagents, handoffs, specialist routing, safe delegated tool execution | `src/multi_agent/` |
| Deep Agents | Agent harness with planning, virtual filesystem, context management, and subagent-ready execution | `src/deep_agents/` |
| Voice Agent | STT -> LangChain agent -> TTS sandwich pipeline with async streaming stages | `src/agents/voice_agent.py` |
| Tool Agents | Tool schemas, tool execution loops, final response routing | `src/agents/arithmetic_tool_agent.py` |
| Graph Workflows | State, reducers, conditional routing, checkpoints, interrupts | `src/orchestration/langgraph_state_machine.py` |
| Model Operations | Local/hosted model selection, token accounting, cost estimates, shared demo output helpers | `src/agents/model_config.py`, `src/utils/` |
| Portfolio UI | Next.js dashboard for explaining and linking to each agent implementation | `web/` |

## Repository Structure

```text
src/
  utils/
    token_usage.py                  # Token accounting and OpenAI cost estimates
    demo_io.py                      # Shared console-output helpers for demos

  retrieval/
    semantic_search.py              # PDF retrieval pipeline with local embeddings

  orchestration/
    langgraph_state_machine.py      # LangGraph state and control-flow patterns

  workflows/
    langgraph_rag_agent.py          # Custom LangGraph agentic RAG workflow
    langgraph_sql_agent.py          # Custom LangGraph SQL workflow

  multi_agent/
    personal_assistant.py           # Supervisor with calendar and email subagents
    customer_support_handoffs.py    # Customer support state-machine handoffs
    knowledge_base_router.py        # Multi-source GitHub/Notion/Slack router
    skills_sql_assistant.py         # On-demand SQL skills and progressive disclosure

  deep_agents/
    research_agent.py               # Deep Agents research harness quickstart

  agents/
    model_config.py                 # Shared local Qwen / hosted OpenAI model selection
    rag_agent.py                    # Agentic RAG over Lilian Weng's agents blog post
    rag_chain.py                    # Deterministic RAG chain with retrieval middleware
    sql_agent.py                    # SQL agent over the Chinook SQLite database
    voice_agent.py                  # Voice-agent sandwich pipeline
    arithmetic_tool_agent.py        # Explicit tool-calling agent loop
    weather_tool_graph.py           # Tool-backed graph workflow

docs/
  langgraph_orchestration_notes.md  # Notes on graph orchestration concepts
  publishing.md                     # Public repo checklist
  session_context.md                # Sanitized project/session context notes

data/
  README.md                         # Sample data instructions

web/
  app/                              # Next.js app router pages
  lib/agents.ts                     # Agent catalog and GitHub source links
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

Local chat demos use Qwen through Ollama by default:

```bash
ollama pull qwen3:14b
```

Never commit `.env`.
If an API key is accidentally pasted into chat, logs, or a public issue, rotate
that key in the provider console even if `.env` is ignored by Git.

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
MODEL_PROVIDER=qwen uv run python src/agents/rag_agent.py
```

Debug retrieval and model messages:

```bash
SHOW_RETRIEVED_CONTEXT=true SHOW_AGENT_MESSAGES=true MODEL_PROVIDER=qwen uv run python src/agents/rag_agent.py
```

### RAG Chain

The RAG chain retrieves first in middleware, injects context into the model input,
and calls the model once.

```bash
MODEL_PROVIDER=qwen uv run python src/agents/rag_chain.py
```

Inspect the exact context-injected model input:

```bash
SHOW_FINAL_MODEL_INPUT=true MODEL_PROVIDER=qwen uv run python src/agents/rag_chain.py
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

### LangGraph Agentic RAG

This workflow follows the LangGraph custom RAG agent tutorial: the graph decides
whether to retrieve, grades retrieved context, rewrites the query when retrieval
is not relevant, and generates a grounded answer.

```bash
MODEL_PROVIDER=qwen uv run python src/workflows/langgraph_rag_agent.py
```

Inspect retrieved context:

```bash
SHOW_RETRIEVED_CONTEXT=true MODEL_PROVIDER=qwen uv run python src/workflows/langgraph_rag_agent.py
```

Inspect the LangGraph message history:

```bash
SHOW_GRAPH_MESSAGES=true MODEL_PROVIDER=qwen uv run python src/workflows/langgraph_rag_agent.py
```

The workflow separates token budgets for tool decisions, document grading, and
final answers:

```env
MAX_CHUNKS=60
RAG_GRAPH_CHUNK_SIZE=300
RAG_GRAPH_CHUNK_OVERLAP=75
RAG_GRAPH_RETRIEVAL_K=4
RAG_GRAPH_USE_VECTOR_CACHE=true
RAG_GRAPH_DECISION_MAX_TOKENS=1024
RAG_GRAPH_GRADER_MAX_TOKENS=512
RAG_GRAPH_ANSWER_MAX_TOKENS=1024
```

Temporary vector cache:

```text
sandbox/vector_cache/
```

The first run creates document embeddings and saves the in-memory vector store
there. Later runs with the same `MAX_CHUNKS`, `RAG_GRAPH_CHUNK_SIZE`, and
`RAG_GRAPH_CHUNK_OVERLAP` load the cache and skip document re-embedding. The
cache is only for local testing and is ignored by Git. Delete the matching cache
file to force embeddings to regenerate.

### Tool-Calling Agents

```bash
MODEL_PROVIDER=qwen uv run python src/agents/sql_agent.py
uv run python src/agents/arithmetic_tool_agent.py
uv run python src/agents/weather_tool_graph.py
```

The SQL agent downloads the Chinook SQLite sample database into `data/` on first
run. Query execution is read-only, restricted to `SELECT` statements, and limited
to one successful SQL query by default through `MAX_SQL_QUERIES=1`. To pause
before query execution for human review:

```bash
SQL_HUMAN_REVIEW=true MODEL_PROVIDER=qwen uv run python src/agents/sql_agent.py
```

### LangGraph SQL Agent

This workflow follows the LangGraph SQL agent tutorial. Unlike the high-level
LangChain SQL agent, it makes the control flow explicit: list tables, select
schema, generate SQL, check SQL, execute SQL, then produce a final answer.

```bash
MODEL_PROVIDER=qwen uv run python src/workflows/langgraph_sql_agent.py
```

Show token and cost estimates for OpenAI runs:

```env
SHOW_TOKEN_USAGE=true
LANGGRAPH_SQL_MAX_TOKENS=4096
LANGGRAPH_SQL_RECURSION_LIMIT=8
```

### Voice Agent

This workflow follows the LangChain voice-agent tutorial architecture: audio
bytes stream into speech-to-text, final transcripts trigger a LangChain agent,
and streamed agent text is sent to text-to-speech.

The LangChain docs use AssemblyAI for STT and Cartesia for TTS over WebSockets.
This repo keeps that same sandwich pipeline and adapter shape. By default,
`VOICE_AGENT_MODE=mock` feeds local mock audio through the same pipeline so the
code can run without microphone/browser setup or STT/TTS provider keys. Set
`VOICE_AGENT_MODE=provider` only when you have provider credentials and optional
WebSocket dependencies installed.

What to observe:

1. `stt_stream` emits `stt_chunk` partial transcripts and a final `stt_output`.
2. `agent_stream` passes through STT events and emits `agent_chunk` text.
3. `tts_stream` sends agent chunks to TTS and emits `tts_chunk` audio bytes.
4. `build_pipeline` composes all stages with LangChain `RunnableGenerator`.

```bash
VOICE_AGENT_MODE=mock MODEL_PROVIDER=qwen uv run python src/agents/voice_agent.py
```

Provider mode requires real STT/TTS credentials:

```env
VOICE_AGENT_MODE=provider
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
CARTESIA_API_KEY=your_cartesia_api_key_here
```

Provider mode also requires WebSocket provider dependencies such as
`websockets`. They are not required for the default mock mode.

For hosted-model testing:

```bash
VOICE_AGENT_MODE=mock MODEL_PROVIDER=openai ALLOW_PAID_API_CALLS=true uv run python src/agents/voice_agent.py
```

### Multi-Agent Personal Assistant

This workflow follows the LangChain multi-agent subagents tutorial. A supervisor
agent delegates to a calendar specialist and an email specialist. Calendar and
email side effects are stubbed, so the demo is safe and does not call real
calendar or email APIs.

```bash
MODEL_PROVIDER=qwen uv run python src/multi_agent/personal_assistant.py
```

Inspect the final supervisor message history:

```bash
SHOW_MULTI_AGENT_MESSAGES=true MODEL_PROVIDER=qwen uv run python src/multi_agent/personal_assistant.py
```

OpenAI runs also report combined supervisor and subagent token usage when
`SHOW_TOKEN_USAGE=true`.

### Multi-Agent Customer Support Handoffs

This workflow follows the LangChain multi-agent handoffs tutorial. A single
support agent changes behavior across warranty collection, issue classification,
and resolution steps. Tools return `Command` updates that move the workflow to
the next support state.

This example demonstrates a state-machine style support flow:

1. Collect warranty status.
2. Classify the issue as hardware or software.
3. Route to repair guidance, troubleshooting, or human escalation.

The state-transition tools use `return_direct=True` so each stage stops after it
updates state. That makes the handoff boundary visible: the next user turn
continues from the updated `current_step` instead of letting the model solve the
entire case in one response.

```bash
MODEL_PROVIDER=qwen uv run python src/multi_agent/customer_support_handoffs.py
```

Inspect the state-machine message history:

```bash
SHOW_MULTI_AGENT_MESSAGES=true MODEL_PROVIDER=qwen uv run python src/multi_agent/customer_support_handoffs.py
```

### Multi-Agent Knowledge Base Router

This workflow follows the LangChain multi-agent router tutorial. A router
classifies a question, fans out source-specific sub-questions to GitHub, Notion,
and Slack specialists with LangGraph `Send`, then synthesizes the specialist
results into one answer.

The demo uses local simulated knowledge sources, so it does not call real
GitHub, Notion, or Slack APIs. This workflow is intended for OpenAI because it
makes several model calls: routing, source specialists, and final synthesis.
The router asks the model for JSON and falls back to deterministic routing if
JSON parsing fails; a production version should use structured output for the
routing decision.

What to observe:

1. The router selects relevant sources and creates source-specific sub-questions.
2. LangGraph `Send` fans out work to multiple specialist nodes.
3. `operator.add` merges parallel specialist results into one state field.
4. The synthesis node combines routed evidence into a final answer.

```bash
MODEL_PROVIDER=openai ALLOW_PAID_API_CALLS=true uv run python src/multi_agent/knowledge_base_router.py
```

Inspect the routed specialist messages:

```bash
SHOW_MULTI_AGENT_MESSAGES=true MODEL_PROVIDER=openai ALLOW_PAID_API_CALLS=true uv run python src/multi_agent/knowledge_base_router.py
```

### Multi-Agent Skills SQL Assistant

This workflow follows the LangChain multi-agent skills tutorial. The assistant
uses `SkillMiddleware` to inject lightweight skill descriptions into the model
request, then calls `load_skill` only when it needs full schema and business-rule
context.

This example demonstrates progressive disclosure:

1. `SkillMiddleware` injects available skill descriptions without loading full schemas.
2. The model calls `load_skill("sales_analytics")` for a sales query.
3. The tool returns domain-specific tables, columns, and business logic.
4. The final answer writes SQL using only the loaded skill context.

Unlike the SQL agents in `src/agents/` and `src/workflows/`, this demo does not
execute SQL. It focuses on on-demand context loading.

```bash
MODEL_PROVIDER=openai ALLOW_PAID_API_CALLS=true uv run python src/multi_agent/skills_sql_assistant.py
```

Inspect the skill-loading message history:

```bash
SHOW_MULTI_AGENT_MESSAGES=true MODEL_PROVIDER=openai ALLOW_PAID_API_CALLS=true uv run python src/multi_agent/skills_sql_assistant.py
```

### Deep Agents Research Agent

This workflow follows the Deep Agents quickstart. It creates a research agent
with `create_deep_agent`, a Tavily-backed `internet_search` tool, and research
instructions that ask the harness to gather evidence and synthesize a polished
report.

Deep Agents is a higher-level agent harness built on LangChain and LangGraph. It
adds built-in planning, virtual filesystem tools, context management, subagent
delegation, streaming, and human-in-the-loop hooks. This demo intentionally
follows the docs and requires a real `TAVILY_API_KEY`.

Because the Deep Agents harness injects planning, filesystem, subagent, and
context-management middleware, hosted tool-calling models are recommended for
this demo.

What to observe:

1. `agent = create_deep_agent(...)` builds the Deep Agents harness.
2. `internet_search` calls Tavily exactly like the docs quickstart pattern.
3. The harness may use built-in planning/file/context tools depending on the model.
4. `SHOW_DEEP_AGENT_MESSAGES=true` prints the final message and tool history.

Required environment:

```env
ALLOW_PAID_API_CALLS=true
DEEP_AGENT_MODEL=openai:gpt-5-nano
TAVILY_API_KEY=your_tavily_api_key_here
```

```bash
uv run python src/deep_agents/research_agent.py
```

## Hosted Model Safety

Agent modules may call a chat model. Use local Qwen through Ollama for free local chat inference:

```bash
MODEL_PROVIDER=qwen uv run python src/agents/rag_agent.py
```

To use hosted OpenAI models, opt in explicitly:

```bash
MODEL_PROVIDER=openai ALLOW_PAID_API_CALLS=true uv run python src/agents/rag_agent.py
```

This explicit flag prevents accidental paid API calls.

The SQL agent prints an OpenAI token and cost estimate when `MODEL_PROVIDER=openai`.
Pricing can change, so override rates in `.env` when needed:

```env
OPENAI_INPUT_COST_PER_1M=0.05
OPENAI_OUTPUT_COST_PER_1M=0.40
```

## Token Budget Tuning

The `*_MAX_TOKENS` settings in `.env` are practical defaults, not fixed rules.
Increase them if a model returns an empty message, fails to emit a tool call,
cuts off a structured response, or answers before a tool result appears.

This is especially important for hosted reasoning models because their output
budget can include hidden reasoning tokens plus visible text or tool-call JSON.
For example, if a SQL workflow does not produce a `sql_db_query` tool result,
try raising:

```env
LANGGRAPH_SQL_MAX_TOKENS=4096
```

For the LangGraph RAG workflow, tune these independently:

```env
RAG_GRAPH_DECISION_MAX_TOKENS=1024
RAG_GRAPH_GRADER_MAX_TOKENS=512
RAG_GRAPH_ANSWER_MAX_TOKENS=1024
```

For the multi-agent router workflow, tune routing, specialist answers, and final
synthesis independently:

```env
ROUTER_MAX_TOKENS=2048
ROUTER_SPECIALIST_MAX_TOKENS=2048
ROUTER_SYNTHESIS_MAX_TOKENS=2048
SKILLS_SQL_MAX_TOKENS=2048
DEEP_AGENT_MODEL=openai:gpt-5-nano
DEEP_AGENT_RECURSION_LIMIT=8
```

Rule of thumb: if the model is choosing tools or producing structured output,
give it more budget before assuming the workflow logic is wrong.

## Operational Notes

- `.env` is ignored because it may contain API keys.
- `.venv` is ignored because environments should be rebuilt with `uv sync`.
- `data/*.pdf` is ignored to avoid committing large source documents.
- `data/*.db` is ignored to avoid committing local SQLite databases.
- Hugging Face model weights are cached outside this repo by default.
- `InMemoryVectorStore` stores vectors only in RAM; vectors disappear when a script exits.
- `sandbox/vector_cache/` may contain temporary LangGraph RAG vector-store caches for faster local testing.
- `sandbox/` is ignored because it contains rough local experiments.

## Roadmap

Planned additions:

- Persistent vector store example
- Multi-agent patterns for routing, handoffs, and subagents

## Positioning

This repository is intentionally small, executable, and inspectable. It shows the
mechanics behind agentic AI systems instead of hiding everything behind a single
high-level API call.
