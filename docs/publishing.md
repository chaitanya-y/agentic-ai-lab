# Publishing Plan

## Repository Name

Use:

```text
agentic-ai-lab
```

Why:

- It is broader than LangChain.
- It reads like an AI engineering portfolio, not a framework tutorial.
- It can grow into RAG systems, vector databases, local models, graph workflows,
  multi-agent systems, and deployment examples.

## Push These Files

```text
.env.example
.gitignore
LICENSE
README.md
pyproject.toml
uv.lock
web/package.json
web/package-lock.json
web/next.config.ts
web/tsconfig.json
web/next-env.d.ts
web/app/layout.tsx
web/app/page.tsx
web/app/globals.css
web/app/components/AgentExplorer.tsx
web/app/agents/[slug]/page.tsx
web/lib/agents.ts
data/README.md
docs/langgraph_orchestration_notes.md
docs/publishing.md
src/utils/token_usage.py
src/utils/demo_io.py
src/retrieval/semantic_search.py
src/orchestration/langgraph_state_machine.py
src/workflows/langgraph_rag_agent.py
src/workflows/langgraph_sql_agent.py
src/multi_agent/__init__.py
src/multi_agent/personal_assistant.py
src/multi_agent/customer_support_handoffs.py
src/multi_agent/knowledge_base_router.py
src/multi_agent/skills_sql_assistant.py
src/deep_agents/__init__.py
src/deep_agents/research_agent.py
src/agents/rag_agent.py
src/agents/rag_chain.py
src/agents/model_config.py
src/agents/sql_agent.py
src/agents/voice_agent.py
src/agents/arithmetic_tool_agent.py
src/agents/weather_tool_graph.py
```

## Do Not Push These Files

```text
.env
.venv/
__pycache__/
data/nke-10k-2023.pdf
data/Chinook.db
sandbox/
```

## Why Sandbox Is Excluded

`sandbox/` is useful for local experiments, but it is not polished enough for a
public engineering portfolio yet. Individual files can be cleaned up and moved
into `src/` later when they become production-quality modules.

## Suggested Commit Message

```text
Refactor shared demo utilities
```
