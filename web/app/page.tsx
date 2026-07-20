import { AgentExplorer } from "./components/AgentExplorer";
import { agents, repoUrl } from "../lib/agents";

const stats = [
  { label: "Agent systems", value: agents.length.toString() },
  { label: "Patterns", value: "RAG / SQL / Graph / Multi-agent / Voice" },
  { label: "Model modes", value: "Local Qwen + OpenAI" }
];

const roadmap = [
  {
    stage: "01",
    milestone: "25%",
    title: "Transformer Basics",
    summary: "Learn only the practical pieces first: vectors, attention, and feed-forward layers.",
    topics: ["Vectors", "Attention", "FFNN", "tokens"],
    quote: "You do not need every proof before you can build useful AI systems."
  },
  {
    stage: "02",
    milestone: "50%",
    title: "Retrieval And RAG",
    summary: "Build useful systems with documents before going deep into math.",
    topics: ["Chunking", "embeddings", "vector databases", "reranking"],
    quote: "This is where many software engineers become immediately dangerous."
  },
  {
    stage: "03",
    milestone: "75%",
    title: "Agent Foundations",
    summary: "Move from one model call to agents that can use tools, memory, and external context.",
    topics: ["Tools", "MCP", "memory", "structured outputs"],
    quote: "Now you are not just prompting. You are engineering behavior."
  },
  {
    stage: "04",
    milestone: "100%",
    title: "Agentic Workflows",
    summary: "Make agents reliable with graphs, routing, human review, evals, and cost visibility.",
    topics: ["LangGraph", "multi-agent", "guardrails", "token costs"],
    quote: "Ship systems people can inspect, trust, and improve."
  }
];

const visualCards = [
  {
    title: "Transformers",
    className: "visual-card amber",
    caption: "Useful intuition before deep theory."
  },
  {
    title: "RAG",
    className: "visual-card red",
    caption: "Context, retrieval, and grounded answers."
  },
  {
    title: "Agents",
    className: "visual-card green",
    caption: "Tools, memory, routing, and action."
  }
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy centered">
          <span className="eyebrow">Hands-on AI engineering roadmap</span>
          <h1>AI Agentic Lab</h1>
          <p>
            A practical lab for software engineers transitioning into agentic engineering and applied AI/ML. The goal
            is not to spend months wandering through every math topic first. Start with the in-demand skills that ship
            real systems: transformers at a useful level, RAG, tools, memory, MCP, LangGraph, SQL agents, multi-agent
            workflows, evaluations, and cost-aware model operations.
          </p>
          <div className="hero-actions">
            <a className="secondary-action" href="#agents">
              Explore the lab
            </a>
            <a className="primary-action" href={repoUrl} rel="noreferrer" target="_blank">
              View GitHub
            </a>
          </div>
        </div>
      </section>

      <section className="visual-stories" aria-label="Core learning pillars">
        {visualCards.map((card) => (
          <article className={card.className} key={card.title}>
            <div className="visual-noise" />
            <h2>{card.title}</h2>
            <p>{card.caption}</p>
          </article>
        ))}
      </section>

      <section className="roadmap" id="roadmap">
        <div className="section-heading compact">
          <span className="eyebrow">Realistic roadmap</span>
          <h2>Learn what helps you build agentic systems first.</h2>
          <p>
            This sequence keeps the path minimal and practical: enough foundations to understand the systems, then
            hands-on agent engineering patterns used in production-style applications.
          </p>
        </div>

        <div className="roadmap-grid">
          {roadmap.map((item) => (
            <article className="roadmap-card" key={item.stage}>
              <div className="roadmap-topline">
                <span className="roadmap-stage">{item.stage}</span>
                <span className="roadmap-milestone">{item.milestone}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <div className="concept-list">
                {item.topics.map((topic) => (
                  <span key={topic}>{topic}</span>
                ))}
              </div>
              <blockquote>{item.quote}</blockquote>
            </article>
          ))}
        </div>
      </section>

      <section className="principles" id="systems">
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

      <section className="portfolio-strip" aria-label="Repository overview">
        {stats.map((stat) => (
          <div className="stat-row" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </section>

      <AgentExplorer />
    </main>
  );
}
