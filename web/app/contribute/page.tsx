import { issuesUrl, profileUrl, repoUrl } from "../../lib/agents";

export const metadata = {
  title: "Contribute",
  description: "Ways to improve the Agentic AI Lab curriculum, code labs, examples, and evaluations."
};

const contributionIdeas = [
  {
    title: "Fix a learning gap",
    body: "Clarify a confusing explanation, add a smaller example, correct a broken link, or point out a missing prerequisite."
  },
  {
    title: "Improve a runnable lab",
    body: "Reproduce an issue, improve an error message, add a local-model path, or make setup more reliable across machines."
  },
  {
    title: "Add proof, not hype",
    body: "Contribute evaluation cases, failure scenarios, security tests, latency measurements, or cost comparisons."
  },
  {
    title: "Share a public-safe pattern",
    body: "Propose a small agentic engineering example using synthetic data and generic business rules."
  }
];

export default function ContributePage() {
  return (
    <main className="inner-page">
      <section className="page-hero">
        <p className="eyebrow">Community guide · 5 minute read</p>
        <h1>Help make the transition path clearer and more practical.</h1>
        <p>
          Contributions do not need to be large. A precise bug report, a better failure case, or a clearer paragraph
          can save the next engineer hours.
        </p>
        <div className="hero-actions">
          <a className="button button-dark" href={issuesUrl} rel="noreferrer" target="_blank">
            View open issues
          </a>
          <a className="button button-light" href={repoUrl} rel="noreferrer" target="_blank">
            Open the repository
          </a>
        </div>
      </section>

      <section className="contribution-grid">
        {contributionIdeas.map((idea, index) => (
          <article key={idea.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{idea.title}</h2>
            <p>{idea.body}</p>
          </article>
        ))}
      </section>

      <section className="contribution-steps">
        <div>
          <p className="eyebrow">A useful contribution</p>
          <h2>Keep the change small, testable, and easy to review.</h2>
        </div>
        <ol>
          <li>Search existing issues before opening a new one.</li>
          <li>Explain the learner problem or system failure with a concrete example.</li>
          <li>For code, include the command you ran and the result you expected.</li>
          <li>Use synthetic data and remove secrets, customer data, and proprietary business logic.</li>
          <li>Keep explanations original, direct, and understandable by a working software engineer.</li>
        </ol>
      </section>

      <section className="community-endcap">
        <p>
          Not ready to contribute code? A repository star and thoughtful feedback are valuable too.
        </p>
        <div>
          <a href={repoUrl} rel="noreferrer" target="_blank">
            Star the repository ↗
          </a>
          <a href={profileUrl} rel="noreferrer" target="_blank">
            Follow Chaitanya ↗
          </a>
        </div>
      </section>
    </main>
  );
}
