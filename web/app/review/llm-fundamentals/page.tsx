import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { llmFundamentalsReview } from "../../../lib/llmFundamentalsReview";

export const metadata: Metadata = {
  title: "LLM Fundamentals content review",
  description: "A development review of changes made to the LLM Fundamentals lessons.",
  robots: { follow: false, index: false }
};

function reviewIsAvailable() {
  return process.env.NODE_ENV === "development" || process.env.VERCEL_GIT_COMMIT_REF === "dev";
}

export default function LlmFundamentalsReviewPage() {
  if (!reviewIsAvailable()) {
    notFound();
  }

  const changeCount = llmFundamentalsReview.reduce((total, lesson) => total + lesson.changes.length, 0);
  const addedCount = llmFundamentalsReview.reduce(
    (total, lesson) => total + lesson.changes.filter((change) => change.category === "Added").length,
    0
  );

  return (
    <main className="content-review-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/roadmap">LLM Fundamentals</Link>
        <span>/</span>
        <span>Content review</span>
      </nav>

      <header className="content-review-hero">
        <p className="eyebrow">Development review</p>
        <h1>What changed in LLM Fundamentals</h1>
        <p>
          This page compares the previous lesson direction with the revised content. It records direct rewrites,
          renamed topics, and material that has been added since the last version.
        </p>
        <div className="content-review-facts" aria-label="Review summary">
          <span><strong>{llmFundamentalsReview.length}</strong> lessons reviewed</span>
          <span><strong>{changeCount}</strong> recorded changes</span>
          <span><strong>{addedCount}</strong> additions</span>
        </div>
      </header>

      <section className="content-review-lessons" aria-label="Lesson changes">
        {llmFundamentalsReview.map((lesson, lessonIndex) => (
          <article className="content-review-lesson" key={lesson.lesson}>
            <div className="content-review-lesson-heading">
              <span>{String(lessonIndex + 1).padStart(2, "0")}</span>
              <h2>{lesson.lesson}</h2>
            </div>

            <div className="content-review-changes">
              {lesson.changes.map((change) => (
                <section className="content-review-change" key={`${lesson.lesson}-${change.title}`}>
                  <div className="content-review-change-heading">
                    <span className={`content-review-badge content-review-badge-${change.category.toLowerCase()}`}>
                      {change.category}
                    </span>
                    <h3>{change.title}</h3>
                  </div>
                  <div className={`content-review-comparison${change.previous ? "" : " content-review-comparison-single"}`}>
                    {change.previous ? (
                      <div>
                        <p>Previous</p>
                        <blockquote>{change.previous}</blockquote>
                      </div>
                    ) : null}
                    <div>
                      <p>{change.previous ? "Revised" : "Added"}</p>
                      <blockquote>{change.current}</blockquote>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
