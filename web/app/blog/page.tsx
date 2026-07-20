import Link from "next/link";
import { agents, repoUrl } from "../../lib/agents";

const principles = [
  {
    title: "Start with systems, not endless theory",
    body:
      "A software engineer does not need to master every branch of machine learning math before building useful AI applications. This lab teaches the minimum foundations needed to build, debug, and reason about agentic systems."
  },
  {
    title: "Prioritize in-demand skills",
    body:
      "The roadmap focuses on transformers, retrieval, RAG, tools, MCP, memory, LangGraph, SQL agents, multi-agent patterns, voice, Deep Agents, evaluation, and cost-aware operations."
  },
  {
    title: "Make every abstraction visible",
    body:
      "Each demo prints or exposes the important moving parts: retrieved chunks, tool calls, SQL queries, graph state, human review points, token usage, and model-provider choices."
  }
];

const learningPath = [
  "Build semantic search so documents, chunks, embeddings, and vector stores become concrete.",
  "Compare deterministic RAG chains with agentic RAG so retrieval control becomes obvious.",
  "Use tool agents to understand model-tool-message loops before connecting risky external systems.",
  "Move into LangGraph when the workflow needs state, routing, retries, checkpoints, and human approval.",
  "Explore multi-agent systems only after single-agent behavior is understandable.",
  "Use Deep Agents for broad research-style work that needs planning, search, files, and delegation."
];

export const metadata = {
  title: "What AI Agentic Lab Is Building | Agentic AI Lab",
  description:
    "A practical guide to the Agentic AI Lab roadmap for software engineers transitioning into agentic engineering."
};

export default function BlogPage() {
  return (
    <main className="blog-page">
      <section className="blog-hero">
        <span className="eyebrow">Lab blog</span>
        <h1>What this lab is really building</h1>
        <p>
          AI Agentic Lab is a hands-on portfolio for software engineers who want to transition into agentic engineering
          without getting lost in every possible AI/ML topic. The goal is simple: learn the concepts that help you ship
          useful AI systems, then deepen the theory as the systems demand it.
        </p>
        <div className="hero-actions">
          <a className="primary-action" href={repoUrl} rel="noreferrer" target="_blank">
            View GitHub
          </a>
          <Link className="secondary-action" href="/#agents">
            Browse agents
          </Link>
        </div>
      </section>

      <section className="blog-essay">
        <p>
          Many engineers begin AI by trying to learn all of machine learning, deep learning, linear algebra,
          probability, optimization, and research papers at once. Those topics matter, but they are not always the best
          first move for someone who wants to build agentic products. A better first step is to understand the systems
          that are already in demand: retrieval, tool use, memory, workflows, evaluation, safety, and cost control.
        </p>
        <p>
          This repository treats agentic engineering as software engineering plus AI-specific building blocks. The
          demos are intentionally practical. They show how data enters the system, how a model decides, how tools are
          called, how state moves through a graph, how retrieval context is inspected, and how hosted model costs are
          estimated.
        </p>
      </section>

      <section className="blog-principles">
        {principles.map((principle) => (
          <article key={principle.title}>
            <h2>{principle.title}</h2>
            <p>{principle.body}</p>
          </article>
        ))}
      </section>

      <section className="blog-roadmap-card">
        <div>
          <span className="eyebrow">Suggested path</span>
          <h2>A realistic sequence for agentic engineering</h2>
        </div>
        <ol>
          {learningPath.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="blog-essay">
        <h2>How to use this lab</h2>
        <p>
          Start with the portfolio UI and open one agent at a time. Read the concept explanation, run the command, then
          inspect the source file. Do not rush. The point is to connect the mental model with code that actually runs.
        </p>
        <p>
          After that, compare patterns. A RAG chain is predictable but less flexible. A RAG agent is flexible but can
          cost more. A LangGraph workflow requires more code but gives you control. A multi-agent system can model
          teams of specialists, but it also introduces coordination complexity. These tradeoffs are the real curriculum.
        </p>
      </section>

      <section className="blog-summary-band">
        <span>{agents.length} implemented systems</span>
        <p>
          The lab is built to grow from learning demos into production-style agent examples: local models, OpenAI,
          retrieval, SQL, graph orchestration, multi-agent workflows, voice, Deep Agents, token usage, and safety
          controls.
        </p>
      </section>
    </main>
  );
}
