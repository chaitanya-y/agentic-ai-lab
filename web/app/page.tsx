import { AgentExplorer } from "./components/AgentExplorer";
import { agents, repoUrl } from "../lib/agents";

const stats = [
  { label: "Agent systems", value: agents.length.toString() },
  { label: "Patterns", value: "RAG / SQL / Graph / Multi-agent / Voice" },
  { label: "Model modes", value: "Local Qwen + OpenAI" }
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Agentic AI Lab</span>
          <h1>A field guide to the agents, graphs, tools, and retrieval systems in this repo.</h1>
          <p>
            Explore every implemented system: what problem it solves, how it is wired, which concepts it teaches, and
            where the source code lives.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href={repoUrl} rel="noreferrer" target="_blank">
              View GitHub repository
            </a>
            <a className="secondary-action" href="#agents">
              Browse agents
            </a>
          </div>
        </div>
        <div className="hero-panel" aria-label="Repository overview">
          <div className="panel-rings" />
          <p className="panel-kicker">Portfolio coverage</p>
          {stats.map((stat) => (
            <div className="stat-row" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="principles">
        <article>
          <span>01</span>
          <h2>Docs-backed implementations</h2>
          <p>Examples track LangChain, LangGraph, and Deep Agents documentation while staying runnable locally.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Visible architecture</h2>
          <p>Each agent page explains state, tools, model calls, retrieval, routing, and guardrails.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Operational safety</h2>
          <p>Hosted calls require explicit opt-in, local caches stay ignored, and costs are estimated when available.</p>
        </article>
      </section>

      <AgentExplorer />
    </main>
  );
}
