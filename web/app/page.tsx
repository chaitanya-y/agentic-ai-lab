import Link from "next/link";
import { AgentExplorer } from "./components/AgentExplorer";
import { CurriculumContents } from "./components/CurriculumContents";
import { allLessons, curriculum, totalHours } from "../lib/curriculum";
import { agents, profileUrl, repoUrl } from "../lib/agents";

const proofPoints = [
  {
    value: `${curriculum.length}`,
    label: "focused phases",
    note: "From practical LLM intuition to a production capstone."
  },
  {
    value: `${allLessons.length}`,
    label: "plain-language lessons",
    note: "Every lesson includes a time estimate, example, and build outcome."
  },
  {
    value: `${agents.length}`,
    label: "runnable systems",
    note: "Local Qwen and hosted OpenAI paths where each is useful."
  },
  {
    value: `~${totalHours}h`,
    label: "guided curriculum",
    note: "Plan 150–200 hours after review, exercises, and portfolio polish."
  }
];

const learningLoop = [
  {
    number: "01",
    title: "Understand",
    body: "Start with the problem and a simple mental model. Learn enough theory to explain the design choice."
  },
  {
    number: "02",
    title: "Build",
    body: "Implement the smallest useful version and inspect prompts, state, retrieval, tools, and outputs."
  },
  {
    number: "03",
    title: "Test",
    body: "Evaluate weak context, incorrect tool results, retries, prompt injection, and high-cost execution paths."
  },
  {
    number: "04",
    title: "Evaluate",
    body: "Measure quality, trace execution, calculate cost, and document the remaining technical tradeoffs."
  }
];

const roleOutcomes = [
  "Design reliable model-backed features with structured inputs and outputs.",
  "Build and evaluate semantic search, deterministic RAG, and agentic RAG.",
  "Create safe tool-calling and MCP integrations with explicit permissions.",
  "Model stateful workflows, memory, routing, checkpoints, and human review.",
  "Decide when multi-agent architecture is useful—and when it is unnecessary.",
  "Operate agent systems with evaluations, traces, security controls, budgets, and release gates."
];

export default function Home() {
  return (
    <main>
      <section className="home-hero home-hero-simple">
        <div className="hero-intro">
          <h1>Agentic AI engineering Lab for software engineers</h1>
          <p>
            Learn to design, build, and operate reliable agent systems using your existing software engineering
            skills. Follow a focused path through RAG, tools, MCP, workflows, evaluation, security, and production
            deployment.
          </p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/blog">
              Read the project objectives →
            </Link>
          </div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Curriculum overview">
        {proofPoints.map((item) => (
          <article key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
            <p>{item.note}</p>
          </article>
        ))}
      </section>

      <section className="learning-loop-section">
        <div className="section-intro inverse">
          <p className="eyebrow">Learning methodology</p>
          <h2>A structured engineering workflow.</h2>
          <p>Each topic combines conceptual study, implementation, failure analysis, and measurable evaluation.</p>
        </div>
        <div className="learning-loop-grid">
          {learningLoop.map((item) => (
            <article key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contents-section" id="contents">
        <div className="section-intro">
          <p className="eyebrow">Curriculum contents</p>
          <h2>A nine-phase curriculum for production agent engineering.</h2>
          <p>
            Engineers new to agentic systems should follow the phases in order. Experienced engineers can use the
            catalog to select topics that address specific knowledge or implementation gaps.
          </p>
          <div className="section-actions">
            <Link className="button button-dark" href="/catalog">
              Search all lessons
            </Link>
            <Link className="button button-light" href="/roadmap">
              View prerequisites
            </Link>
          </div>
        </div>
        <CurriculumContents />
      </section>

      <section className="outcome-section">
        <div>
          <p className="eyebrow">What you should be able to do</p>
          <h2>Practical skills for agentic engineering roles.</h2>
          <p>
            The roadmap is complete when you can defend the architecture, show evidence of quality, and discuss where
            the system should still defer to deterministic code or a person.
          </p>
        </div>
        <ol>
          {roleOutcomes.map((item, index) => (
            <li key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item}
            </li>
          ))}
        </ol>
      </section>

      <AgentExplorer />

      <section className="community-section">
        <div className="section-intro">
          <p className="eyebrow">Project community</p>
          <h2>Support and contribute to Agentic AI Lab.</h2>
        </div>
        <div className="community-grid">
          <article>
            <span className="community-icon">01</span>
            <h3>Follow</h3>
            <p>Follow the maintainer for new lessons, project notes, and practical agent engineering experiments.</p>
            <a href={profileUrl} rel="noreferrer" target="_blank">
              Follow Chaitanya ↗
            </a>
          </article>
          <article>
            <span className="community-icon">02</span>
            <h3>Star</h3>
            <p>Star the repository to save the roadmap and improve its visibility for other software engineers.</p>
            <a href={repoUrl} rel="noreferrer" target="_blank">
              Star the repository ↗
            </a>
          </article>
          <article>
            <span className="community-icon">03</span>
            <h3>Contribute</h3>
            <p>Improve an explanation, report a broken lab, add an evaluation case, or suggest a missing topic.</p>
            <Link href="/contribute">See contribution ideas →</Link>
          </article>
        </div>
      </section>
    </main>
  );
}
