import Link from "next/link";
import { allLessons, curriculum, totalHours } from "../../lib/curriculum";
import { agents, repoUrl } from "../../lib/agents";

export const metadata = {
  title: "Why Agentic AI Lab Exists",
  description:
    "What Agentic AI Lab is trying to achieve for software engineers transitioning into agentic engineering roles."
};

const boundaries = [
  {
    title: "Role-relevant systems",
    included: "LLM application boundaries, RAG, tools, MCP, state, memory, workflows, multi-agent design, evaluations, security, cost, and deployment.",
    deferred: "Broad surveys of every ML algorithm, training foundation models, and advanced mathematics without an immediate engineering use."
  },
  {
    title: "Inspectable behavior",
    included: "Retrieved chunks, tool arguments, SQL, graph state, checkpoints, approval decisions, traces, evaluation results, and token cost.",
    deferred: "Demos that appear intelligent but hide why they worked, what failed, or which system performed the action."
  },
  {
    title: "Reliability and operations",
    included: "Failure injection, bounded retries, idempotency, prompt-injection defenses, privacy boundaries, release gates, and human escalation.",
    deferred: "Assuming a polished response is correct because it sounds confident."
  }
];

const proof = [
  "A searchable curriculum with prerequisites and time estimates.",
  "Runnable local and hosted examples for the main agent patterns.",
  "A plain-language explanation and real-world example for every lesson.",
  "Evaluation tasks that measure retrieval, routing, tool choice, safety, latency, and cost.",
  "A publishable Customer Operations Lite capstone built with synthetic data.",
  "Architecture and failure analysis suitable for technical interviews."
];

export default function BlogPage() {
  return (
    <main className="article-page">
      <header className="article-hero">
        <div className="article-meta">
          <span>Project note</span>
          <span>8–10 minute read</span>
          <span>Approximately {totalHours} guided hours</span>
        </div>
        <h1>What Agentic AI Lab is trying to achieve</h1>
        <p>
          A structured transition path for software engineers who want to design, build, evaluate, and operate
          production agent systems.
        </p>
      </header>

      <article className="article-body">
        <section className="article-lead">
          <p>
            Software engineers entering this field need enough model knowledge to make sound system decisions, along
            with practical experience in retrieval, tools, orchestration, evaluation, and production operations.
            Agentic AI Lab organizes those requirements into an applied engineering curriculum.
          </p>
          <p>
            The project begins with the skills that appear repeatedly in real agentic engineering work: model
            boundaries, context design, retrieval, tool use, explicit state, evaluation, observability, security, and
            cost. Deeper AI/ML remains important and follows after the core agent engineering capabilities are in
            place.
          </p>
        </section>

        <section>
          <p className="section-label">The target learner</p>
          <h2>The curriculum assumes professional software-development experience.</h2>
          <p>
            The roadmap assumes you can read Python, work with APIs and JSON, understand a database query, write tests,
            and debug a service. We build on that foundation. Your existing engineering judgment is not replaced by a
            model; it becomes more important because model behavior is probabilistic and external tools can create real
            effects.
          </p>
          <p>
            If those software fundamentals are new, the curriculum can still be useful, but the time estimate will be
            longer. The stated 150–200 hours is realistic for a working software engineer who practices each phase and
            documents the capstone.
          </p>
        </section>

        <section>
          <p className="section-label">The role definition</p>
          <h2>Agentic engineering is software engineering across a new trust boundary.</h2>
          <p>
            A normal backend function should return a defined result or an error. A model can return a plausible answer
            that is incomplete, incorrectly grounded, or based on the wrong instruction. An agent can also choose a
            tool, repeat a step, consume an unexpected amount of context, or propose a consequential action.
          </p>
          <p>
            The agentic engineer designs the surrounding system: which evidence enters, which tools are available, what
            state is durable, where deterministic rules apply, when a human must review, how quality is evaluated, and
            how the team understands failures in production.
          </p>
        </section>

        <section className="article-boundaries">
          <p className="section-label">Our curriculum choices</p>
          <h2>Curriculum scope and sequencing</h2>
          {boundaries.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <div>
                <p>
                  <strong>Included in the core roadmap</strong>
                  {item.included}
                </p>
                <p>
                  <strong>Deferred topics</strong>
                  {item.deferred}
                </p>
              </div>
            </article>
          ))}
        </section>

        <section>
          <p className="section-label">The learning path</p>
          <h2>The phases progress from model foundations to production operation.</h2>
          <ol className="article-phase-list">
            {curriculum.map((phase) => (
              <li key={phase.id}>
                <span>{phase.number}</span>
                <div>
                  <h3>{phase.title}</h3>
                  <p>{phase.summary}</p>
                </div>
                <strong>{phase.time}</strong>
              </li>
            ))}
          </ol>
          <p>
            The phases are ordered, but the repository is also a reference. An experienced RAG engineer can jump to
            MCP or production evaluations; a backend engineer new to models should begin with the practical
            foundations and reliable-application phases.
          </p>
        </section>

        <section className="article-callout">
          <p className="section-label">The capstone</p>
          <h2>Customer Operations Lite integrates the curriculum into one system.</h2>
          <p>
            The final project uses fictional customers, synthetic tickets, invented policies, and generic business
            rules. It combines knowledge retrieval, read-only SQL, narrow tools, LangGraph state, human review,
            evaluations, tracing, cost accounting, and security tests.
          </p>
          <p>
            The limited scope keeps the project suitable for a public repository. It demonstrates reusable
            architecture while excluding proprietary workflows, private data, and company-specific business logic.
          </p>
          <Link className="button button-coral" href="/learn/capstone-scope-and-architecture">
            Read the capstone plan
          </Link>
        </section>

        <section>
          <p className="section-label">Portfolio evidence</p>
          <h2>Portfolio claims should be supported by evidence.</h2>
          <ul className="proof-list">
            {proof.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            A technical portfolio should document the task, baseline, architecture, evaluation set, measured results,
            failure categories, safety boundaries, latency, cost, and planned improvements. This evidence demonstrates
            the engineering decisions behind the implementation.
          </p>
        </section>

        <section className="article-finish">
          <p className="section-label">Expected outcomes</p>
          <h2>Graduates can explain and support their architecture decisions.</h2>
          <p>
            By the end, you should be able to explain why one feature is a deterministic workflow and another is an
            agent; why a RAG chain may be better than agentic retrieval; why a tool needs approval and idempotency; why
            multiple agents may not be justified; and what your evaluations say about the system today.
          </p>
          <p>
            Agentic AI Lab currently contains {allLessons.length} curriculum lessons and {agents.length} runnable system
            examples. It will keep growing, but the standard stays the same: clear concepts, inspectable code, realistic
            examples, and measurable behavior.
          </p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/roadmap">
              Open the roadmap
            </Link>
            <a className="button button-light" href={repoUrl} rel="noreferrer" target="_blank">
              View the repository
            </a>
          </div>
        </section>
      </article>
    </main>
  );
}
