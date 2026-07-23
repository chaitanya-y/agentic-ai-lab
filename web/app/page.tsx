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
    value: `${totalHours}h`,
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
    title: "Break",
    body: "Try weak context, bad tool results, retries, prompt injection, and expensive paths before users do."
  },
  {
    number: "04",
    title: "Prove",
    body: "Add evaluations, traces, cost measurements, and a clear explanation of the remaining tradeoffs."
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
              What we&apos;re trying to achieve →
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

      <section className="mission-section">
        <div className="section-intro">
          <p className="eyebrow">What this is</p>
          <h2>A job-focused bridge, not an encyclopedia of AI.</h2>
        </div>
        <div className="mission-copy">
          <p>
            Agentic engineering is software engineering with new boundaries: nondeterministic models, dynamic context,
            tool permissions, long-running state, and quality that must be measured. This lab teaches those boundaries
            through systems you can run, inspect, test, and explain.
          </p>
          <p>
            We intentionally postpone broad model-training and advanced ML topics. After you can ship a grounded,
            observable, secure agent workflow, you will know which deeper AI/ML subjects are worth adding next.
          </p>
          <Link className="text-link" href="/blog">
            Read what we are building and why →
          </Link>
        </div>
      </section>

      <section className="learning-loop-section">
        <div className="section-intro inverse">
          <p className="eyebrow">How every topic works</p>
          <h2>Learn with an engineering loop.</h2>
          <p>Reading creates vocabulary. Building, breaking, and measuring creates judgment.</p>
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
          <p className="eyebrow">Complete contents</p>
          <h2>Nine phases. One production-minded path.</h2>
          <p>
            Follow the phases in order if this is your first agentic system. Experienced engineers can use the catalog
            to jump directly to a missing skill.
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
          <h2>Interview-ready outcomes, not checked boxes.</h2>
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

      <section className="capstone-teaser">
        <div className="capstone-label">
          <span>Final build</span>
          <strong>35–50 hours</strong>
        </div>
        <div>
          <p className="eyebrow">Customer Operations Lite</p>
          <h2>Bring retrieval, SQL, tools, state, review, and production proof into one portfolio system.</h2>
          <p>
            Use fictional customers, synthetic conversations, and generic business rules. The capstone demonstrates
            the engineering patterns without publishing proprietary product logic, data, or prompts.
          </p>
          <Link className="button button-coral" href="/learn/capstone-scope-and-architecture">
            Explore the capstone
          </Link>
        </div>
      </section>

      <AgentExplorer />

      <section className="community-section">
        <div className="section-intro">
          <p className="eyebrow">Keep the lab useful</p>
          <h2>If this helps you, help it reach the next engineer.</h2>
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
            <p>If the roadmap is useful, star the repository so you can find it later and others can discover it.</p>
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
