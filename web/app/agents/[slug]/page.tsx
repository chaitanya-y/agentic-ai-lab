import Link from "next/link";
import { notFound } from "next/navigation";
import { agentBlogs } from "../../../lib/agentBlogs";
import { agents, getAgent, repoUrl } from "../../../lib/agents";

type AgentPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return agents.map((agent) => ({ slug: agent.slug }));
}

export async function generateMetadata({ params }: AgentPageProps) {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) {
    return { title: "Agent not found" };
  }
  return {
    title: `${agent.name} | Agentic AI Lab`,
    description: agent.summary
  };
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params;
  const agent = getAgent(slug);

  if (!agent) {
    notFound();
  }

  const blog = agentBlogs[agent.slug as keyof typeof agentBlogs];

  return (
    <main className="agent-page">
      <nav className="breadcrumb">
        <Link href="/">Agentic AI Lab</Link>
        <span>/</span>
        <span>{agent.name}</span>
      </nav>

      <section className="agent-hero">
        <div>
          <span className="eyebrow">{agent.category}</span>
          <h1>{agent.name}</h1>
          <p>{agent.summary}</p>
          <div className="page-meta agent-meta">
            <span>60–90 minute lab</span>
            <span>{agent.status} model path</span>
            <span>Runnable source included</span>
          </div>
        </div>
        <div className="agent-links">
          <a className="primary-action" href={agent.githubUrl} rel="noreferrer" target="_blank">
            GitHub source
          </a>
          <a className="secondary-action" href={repoUrl} rel="noreferrer" target="_blank">
            Repository
          </a>
        </div>
      </section>

      <section className="detail-layout">
        <article className="detail-card wide">
          <span className="eyebrow">How to use this page</span>
          <h2>Read, run, inspect, then change one constraint.</h2>
          <p>
            Spend about 15 minutes on the architecture, 20–30 minutes running and tracing the command, and the
            remaining time changing a prompt, tool, model, or failure path. The lesson is complete when you can explain
            the tradeoff from evidence rather than from the happy-path output.
          </p>
        </article>

        <article className="detail-card wide">
          <span className="eyebrow">Problem</span>
          <h2>What this agent demonstrates</h2>
          <p>{agent.problem}</p>
        </article>

        <article className="detail-card">
          <span className="eyebrow">Architecture</span>
          <h2>Flow</h2>
          <ol className="flow-list">
            {agent.architecture.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <article className="detail-card">
          <span className="eyebrow">Concepts</span>
          <h2>What to learn</h2>
          <div className="concept-list large">
            {agent.concepts.map((concept) => (
              <span key={concept}>{concept}</span>
            ))}
          </div>
        </article>

        <article className="detail-card wide">
          <span className="eyebrow">Run it</span>
          <h2>Command</h2>
          <pre>
            <code>{agent.runCommand}</code>
          </pre>
          <p className="source-path">Source: {agent.sourcePath}</p>
        </article>
      </section>

      {blog ? (
        <article className="agent-blog">
          <span className="eyebrow">Field notes</span>
          <h2>{blog.headline}</h2>

          <div className="blog-prose">
            {blog.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <section className="blog-deep-dive">
            <h3>In-depth explanation</h3>
            <ol>
              {blog.deepDive.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
          </section>

          <section className="blog-callout">
            <span>Simple example</span>
            <p>{blog.simpleExample}</p>
          </section>

          <section className="blog-grid">
            <div>
              <h3>Real-life use cases</h3>
              <ul>
                {blog.realWorldUseCases.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Technologies used</h3>
              <ul>
                {blog.technologies.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="blog-grid">
            <div>
              <h3>Pros</h3>
              <ul>
                {blog.pros.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Tradeoffs</h3>
              <ul>
                {blog.cons.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          {blog.references?.length ? (
            <section className="blog-references">
              <h3>Official and helpful links</h3>
              <div className="reference-list">
                {blog.references.map((reference) => (
                  <a href={reference.url} key={reference.url} rel="noreferrer" target="_blank">
                    {reference.label}
                  </a>
                ))}
              </div>
            </section>
          ) : null}

          <section className="blog-takeaway">
            <span>Takeaway</span>
            <p>{blog.takeaway}</p>
          </section>
        </article>
      ) : null}
    </main>
  );
}
