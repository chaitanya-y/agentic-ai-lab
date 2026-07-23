# Agentic AI Engineering Lab for Software Engineers

Agentic AI Lab is an applied learning project for software engineers who want to
design, build, evaluate, and operate reliable agent systems.

The repository combines a structured curriculum with runnable implementations of
retrieval, tool use, MCP, workflow orchestration, multi-agent coordination,
evaluation, security, and production operations.

## Explore the Learning App

The web application provides the complete curriculum, roadmap, glossary, and
implementation catalog.

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The application includes:

- A searchable lesson catalog
- Prerequisites and time estimates for every phase
- Plain-language explanations and application examples
- Practical exercises and expected outputs
- Detailed pages for each runnable implementation
- Direct links between lessons and relevant source code

## About the Project

Software engineers entering agentic engineering need more than experience with
model APIs. They need to understand how context is assembled, how evidence is
retrieved, how tools are controlled, how workflow state is managed, and how
quality, safety, latency, and cost are measured in production.

Agentic AI Lab organizes these capabilities into a prerequisite-aware roadmap.
Each phase connects a technical concept to implementation, failure analysis, and
measurable evaluation.

The initial curriculum focuses on skills used in agentic engineering roles.
Advanced AI/ML subjects such as model training, fine-tuning, classical machine
learning, and deeper mathematics are planned as later extensions.

## Intended Audience

This project is designed for software engineers who are comfortable with:

- Python and backend application development
- APIs, JSON, and database queries
- Testing, debugging, and version control
- Basic cloud or service deployment concepts

Engineers who already have these foundations can focus on the model-specific
trust boundaries and system-design decisions introduced throughout the roadmap.

## Learning Outcomes

After completing the core roadmap, you should be able to:

- Explain the model, context, and reliability limits that affect an application.
- Build and evaluate semantic search, deterministic RAG, and agentic RAG.
- Design tool-calling and MCP integrations with explicit permissions and validation.
- Implement stateful workflows with routing, memory, checkpoints, and human review.
- Determine when a multi-agent architecture is appropriate.
- Evaluate agent behavior using datasets, traces, failure categories, and release gates.
- Apply security, privacy, observability, latency, and cost controls.
- Present a production-oriented capstone with documented engineering evidence.

## Roadmap

The curriculum contains 49 lessons across nine phases:

| Phase | Topic | Estimated time |
| --- | --- | ---: |
| 01 | Practical LLM Foundations | 5–7 hours |
| 02 | Reliable LLM Applications | 8–10 hours |
| 03 | Retrieval and Production RAG | 18–24 hours |
| 04 | Tools, Actions, and MCP | 16–20 hours |
| 05 | Agent Foundations and Workflow Patterns | 12–16 hours |
| 06 | Stateful Workflows with LangGraph | 18–24 hours |
| 07 | Multi-Agent Systems | 10–14 hours |
| 08 | Production Agent Engineering | 20–28 hours |
| 09 | Customer Operations Lite Capstone | 35–50 hours |

The written curriculum represents approximately 175 guided hours. A realistic
completion estimate for a software engineer is 150–200 total hours, depending on
prior experience and the amount of time spent repeating exercises, debugging,
running evaluations, and documenting the capstone.

| Study schedule | Weekly commitment | Expected duration |
| --- | ---: | ---: |
| Steady | 8 hours | 5–6 months |
| Focused | 12 hours | 3.5–4.5 months |
| Intensive | 20 hours | 9–11 weeks |

## Learning Methodology

Each topic follows a consistent engineering workflow:

1. **Understand** — Learn the concept and the design problem it addresses.
2. **Build** — Implement the smallest useful version with inspectable behavior.
3. **Test** — Introduce realistic failure conditions and identify system boundaries.
4. **Evaluate** — Measure quality, safety, latency, cost, and operational behavior.
5. **Document** — Record the architecture, tradeoffs, results, and remaining limitations.

## Implementation Labs

The repository currently includes 15 runnable examples covering the main system
patterns in the curriculum.

| Area | Implementation |
| --- | --- |
| Semantic retrieval | PDF loading, chunking, embeddings, and vector similarity search |
| Deterministic RAG | Retrieval before generation with explicit context assembly |
| Agentic RAG | Retrieval exposed as a tool with model-directed tool selection |
| LangGraph RAG | Retrieval grading, query rewriting, routing, and grounded generation |
| SQL agents | Schema inspection, query validation, read-only execution, and human review |
| Tool-calling agents | Tool schemas, execution loops, validation, and result routing |
| Stateful workflows | Reducers, conditional routing, checkpoints, interrupts, and streaming |
| Multi-agent systems | Supervisors, specialist routing, handoffs, and parallel delegation |
| Context skills | On-demand domain context using progressive disclosure |
| Voice agents | Speech-to-text, agent processing, and text-to-speech stages |
| Deep Agents | Planning, research, context management, and delegation-ready execution |

## Repository Structure

```text
agentic-ai-lab/
├── src/
│   ├── agents/          # RAG, SQL, voice, weather, and tool-calling agents
│   ├── retrieval/       # Semantic-search implementation
│   ├── orchestration/   # LangGraph state and control-flow examples
│   ├── workflows/       # Custom LangGraph RAG and SQL workflows
│   ├── multi_agent/     # Supervisors, routers, handoffs, and skills
│   ├── deep_agents/     # Research-agent harness
│   └── utils/           # Shared output and token-usage utilities
├── web/
│   ├── app/             # Next.js pages and interface components
│   └── lib/             # Curriculum, glossary, and lab content
├── data/                # Instructions for local sample data
├── docs/                # Project and publishing documentation
└── .env.example         # Environment configuration reference
```

## Python Setup

The Python examples require Python 3.12 or later and use
[`uv`](https://docs.astral.sh/uv/) for dependency management.

```bash
uv sync
cp .env.example .env
```

Local model examples use Qwen through Ollama:

```bash
ollama pull qwen3:14b
```

Run an example with the local model:

```bash
MODEL_PROVIDER=qwen uv run python src/agents/rag_agent.py
```

Hosted OpenAI execution requires explicit opt-in:

```bash
MODEL_PROVIDER=openai \
ALLOW_PAID_API_CALLS=true \
uv run python src/agents/rag_agent.py
```

This requirement reduces the risk of accidental paid API calls.

## Selected Commands

### Semantic Search

Follow the sample-document instructions in
[`data/README.md`](data/README.md), then run:

```bash
uv run python src/retrieval/semantic_search.py
```

### Deterministic and Agentic RAG

```bash
MODEL_PROVIDER=qwen uv run python src/agents/rag_chain.py
MODEL_PROVIDER=qwen uv run python src/agents/rag_agent.py
MODEL_PROVIDER=qwen uv run python src/workflows/langgraph_rag_agent.py
```

### SQL Agents

```bash
MODEL_PROVIDER=qwen uv run python src/agents/sql_agent.py
MODEL_PROVIDER=qwen uv run python src/workflows/langgraph_sql_agent.py
```

SQL execution is restricted to read-only `SELECT` statements. Human review can
be enabled before execution:

```bash
SQL_HUMAN_REVIEW=true \
MODEL_PROVIDER=qwen \
uv run python src/agents/sql_agent.py
```

### LangGraph State and Control Flow

```bash
uv run python src/orchestration/langgraph_state_machine.py --demo reducers
uv run python src/orchestration/langgraph_state_machine.py --demo routing
uv run python src/orchestration/langgraph_state_machine.py --demo checkpoints
uv run python src/orchestration/langgraph_state_machine.py --demo interrupts
uv run python src/orchestration/langgraph_state_machine.py --demo subgraphs
uv run python src/orchestration/langgraph_state_machine.py --demo streaming
```

### Multi-Agent Patterns

```bash
MODEL_PROVIDER=qwen uv run python src/multi_agent/personal_assistant.py
MODEL_PROVIDER=qwen uv run python src/multi_agent/customer_support_handoffs.py
```

Some multi-agent and research examples use hosted services because they require
multiple capable tool-calling steps. Review the relevant source file and
`.env.example` before enabling paid execution.

## Customer Operations Lite Capstone

The final phase combines the curriculum into a production-oriented customer
operations system. Its public scope uses fictional customers, synthetic tickets,
invented policies, and generic business rules.

The capstone includes:

- Knowledge retrieval with citations
- Read-only customer and account queries
- Narrow, permission-controlled tools
- Explicit workflow state and human review
- Evaluation datasets and failure analysis
- Tracing, token accounting, latency, and cost reporting
- Prompt-injection, privacy, and authorization tests

The public implementation demonstrates reusable architecture while excluding
proprietary workflows, private data, and company-specific business logic.

## Safety and Operational Controls

- Secrets and local environment files are excluded from version control.
- Hosted model calls require an explicit paid-call flag.
- SQL examples enforce read-only query boundaries.
- Side-effecting integrations use simulations or approval points.
- Local model, embedding, and cache files remain outside the repository.
- Evaluation and observability are treated as part of the implementation.

Never commit API keys. Rotate a key immediately if it appears in chat, logs, an
issue, or a committed file.

## Contributing

Contributions that improve curriculum clarity, add evaluation evidence, correct
technical issues, or provide publishable engineering patterns are welcome.

Before opening a pull request:

1. Keep the change focused.
2. Explain the engineering reason for the change.
3. Add or update tests when behavior changes.
4. Document required services, credentials, and expected cost.
5. Use synthetic or publicly licensed data.
6. Verify that no secrets or proprietary information are included.

You can also open an
[issue](https://github.com/chaitanya-y/agentic-ai-lab/issues) to report an error
or propose a curriculum improvement.

## Support the Project

If Agentic AI Lab is useful to you:

- [Star the repository](https://github.com/chaitanya-y/agentic-ai-lab)
- [Follow Chaitanya](https://github.com/chaitanya-y)
- Share feedback or contribute an improvement

## License

This project is available under the [MIT License](LICENSE).
