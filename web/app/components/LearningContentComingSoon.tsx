import Link from "next/link";

export function LearningContentComingSoon() {
  return (
    <main className="inner-page">
      <section className="page-hero">
        <p className="eyebrow">Content is being added weekly</p>
        <h1>Detailed learning content is coming soon.</h1>
        <p>
          The roadmap is available now. Detailed explanations, examples, and runnable labs will be published as each
          section is completed.
        </p>
        <Link className="button button-dark" href="/roadmap">
          Back to roadmap
        </Link>
      </section>
    </main>
  );
}
