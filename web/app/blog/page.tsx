import { linkedinUrl } from "../../lib/agents";
import { RoadmapLink } from "../components/GuidedLinks";
import { VisitMarker } from "../components/VisitMarker";

export const metadata = {
  title: "Why I Started Agentic AI Lab",
  description:
    "Why Agentic AI Lab is a focused path for software engineers who want to move into AI engineering."
};

export default function BlogPage() {
  return (
    <main className="article-page">
      <VisitMarker page="whyLab" />
      <header className="article-hero">
        <p className="article-reading-time">About 3 minutes</p>
        <h1>Why I started Agentic AI Lab</h1>
        <a className="article-author" href={linkedinUrl} rel="noreferrer" target="_blank">
          By Chaitanya Yarramsetti <span>Connect on LinkedIn ↗</span>
        </a>
      </header>

      <article className="article-body">
        <section className="article-lead">
          <p>
            I started Agentic AI Lab after hearing the same question from software engineers, friends, colleagues, and
            people I met through work. How do I move into AI engineering without spending months figuring out what
            matters? Many had watched videos on LangChain or built a basic agent. The demos were useful, but they did
            not show how to design an LLM application, use data and tools safely, evaluate it, or explain the
            engineering choices behind it.
          </p>
        </section>

        <section>
          <p>
            The options can be difficult to navigate. There are short tutorials that jump between topics, structured
            courses that cost thousands of dollars, and longer resources that can take many months to complete. For
            someone working full time, the missing piece is often a clear path. What to learn first, what to practise,
            and when the work is strong enough to support an AI engineering job application.
          </p>
        </section>

        <section className="article-finish">
          <p>
            Agentic AI Lab is a focused 120 hour path for people with some experience in the software industry. You do
            not need to come from one particular role. Frontend engineers, backend engineers, testers, SAP consultants,
            and tooling engineers already understand enough about how software products are built. It focuses on the
            theory and hands on work needed to build LLM applications and agents, then brings those skills together in
            one capstone project. If you are new to software development, spend a few hours with this{" "}
            <a href="https://www.youtube.com/watch?v=5PdEmeopJVQ" rel="noreferrer" target="_blank">
              freeCodeCamp full stack course
            </a>{" "}
            to see how a frontend, backend, API, and database work together, then return here.
          </p>
          <div className="hero-actions">
            <RoadmapLink className="button button-dark">
              View the roadmap
            </RoadmapLink>
          </div>
        </section>
      </article>
    </main>
  );
}
