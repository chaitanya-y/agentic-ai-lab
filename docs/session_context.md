# Agentic AI Lab Session Context

This note captures the important context from the working sessions that built
and refined Agentic AI Lab. It is intentionally a summary, not a raw chat
transcript, so the project stays readable and safe for a public repository.

## Project Mission

Agentic AI Lab is a hands-on AI engineering portfolio for software engineers
transitioning into agentic engineering and applied AI/ML.

The project is intentionally practical. The goal is to help engineers learn
in-demand agentic engineering skills before getting lost in every possible
mathematical or research topic. The learning path prioritizes systems people can
build, run, inspect, debug, and explain.

## Positioning

- Use the name `Agentic AI Lab` consistently.
- Present the repo as a professional AI engineering portfolio, not a hobby
  tutorial.
- Emphasize hands-on labs, realistic agent workflows, and production-minded
  tradeoffs.
- Make the project useful for both learners and recruiters reviewing technical
  depth.

## Core Systems Built

- Semantic search over documents with chunking, embeddings, and vector search.
- Deterministic RAG chain that retrieves before a single model call.
- Agentic RAG where retrieval is exposed as a model-controlled tool.
- LangGraph RAG workflow with retrieval decisions, grading, query rewriting,
  answer generation, and local vector cache support.
- SQL agent over the Chinook database with schema inspection, query checking,
  read-only execution, optional human review, and token/cost reporting.
- LangGraph SQL workflow with explicit schema selection, query generation,
  execution, answer synthesis, recursion limits, and token limits.
- Tool-calling examples for arithmetic and weather-style tools.
- Multi-agent examples covering supervisor delegation, handoffs, knowledge-base
  routing, and skills-based context loading.
- Voice-agent sandwich pipeline: speech-to-text, agent reasoning, and
  text-to-speech.
- Deep Agents research demo with Tavily search and a docs-aligned research
  harness.

## Shared Utilities

- `src/utils/demo_io.py` provides consistent console output helpers.
- `src/utils/token_usage.py` estimates token usage and OpenAI cost across model
  calls.
- `src/agents/model_config.py` centralizes model-provider selection for local
  Qwen and hosted OpenAI.

## Model Strategy

- Local-first demos use Qwen through Ollama where practical.
- Hosted OpenAI calls are supported for stronger tool calling and structured
  output.
- Paid API calls are gated through environment flags.
- OpenAI embedding code is intentionally shown as a commented alternative when
  embedding examples use local Hugging Face embeddings by default.

## Retrieval And Cache Notes

- Local embeddings use `Qwen/Qwen3-Embedding-0.6B`.
- `InMemoryVectorStore` is used for learning-oriented examples and disappears
  when the script exits.
- LangGraph RAG can use temporary vector cache files under
  `sandbox/vector_cache/`.
- `sandbox/` is ignored by Git and should stay out of public commits unless a
  file is intentionally promoted into `src/`.

## Web Portfolio App

The `web/` directory contains a Next.js portfolio UI.

Current web app direction:

- Center the homepage around `Agentic AI Lab`.
- Explain that the lab helps SDEs transition into agentic engineering.
- Include a minimal roadmap:
  - transformer basics: vectors, attention, FFNN, tokens
  - retrieval and RAG: chunking, embeddings, vector databases, reranking
  - agent foundations: tools, MCP, memory, structured outputs
  - agentic workflows: LangGraph, multi-agent systems, guardrails, token costs
- Use a colorful editorial visual style inspired by modern AI blog pages, with
  abstract gradient image-like sections.
- Keep GitHub links visible on the homepage and on each agent page.
- Each agent page should read like a mini-blog, not just a card:
  - concept explanation
  - in-depth explanation
  - simple example
  - real-world use cases
  - technologies used
  - pros
  - tradeoffs
  - official/helpful links
  - takeaway

## Important Working Preferences

- Do not commit `.env`.
- Do not commit model caches, vector cache files, PDFs, virtual environments, or
  local scratch work.
- Before pushing to GitHub, ask for confirmation even if the user says “push.”
- Commit messages should be professional and focused.
- Documentation should be kept current with code changes.
- Prefer docs-aligned implementations for LangChain, LangGraph, Deep Agents, and
  related examples.
- Explain agentic concepts simply, but with enough depth that beginners can
  understand the system and recruiters can see engineering judgment.

## Recent Web App Follow-Ups

- The user prefers `Agentic AI Lab`, not `AI Agentic Lab`.
- The user asked for deeper agent blogs, especially for LangGraph pages.
- LangGraph pages should clearly explain what LangGraph is and include official
  LangGraph documentation links.
- Blog layouts should avoid excessive boxed sections. Prefer readable article
  sections for prose-heavy content.

## Suggested Next Tasks

- Refine the web app blog layout so pros, cons, technologies, and use cases read
  as article sections instead of heavy boxes.
- Add progress/confetti interactions at roadmap milestones such as 25%, 50%, and
  75% if the learning experience needs more delight.
- Add deployment instructions for the Next.js app once hosting is chosen.
- Continue expanding production-grade examples after the learning demos are
  stable.
