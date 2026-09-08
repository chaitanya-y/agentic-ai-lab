import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { phase2ReviewLessons } from "../../../lib/phase2Review";
import { isDevelopmentPreview } from "../../../lib/siteStatus";

export const metadata: Metadata = {
  title: "Phase 2 content review",
  description: "A development review of the Prompt Engineering and Context Engineering phase.",
  robots: { follow: false, index: false }
};

export default function Phase2ReviewPage() {
  if (!isDevelopmentPreview()) {
    notFound();
  }

  return (
    <main className="content-review-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/roadmap">Roadmap</Link>
        <span>/</span>
        <span>Phase 2 review</span>
      </nav>

      <header className="content-review-hero">
        <p className="eyebrow">Development review</p>
        <h1>Phase 2 implementation</h1>
        <p>
          The phase contains five focused lessons and one connected application. This review lists the theory, examples, code, and
          practice now available on the development preview.
        </p>
        <div className="content-review-facts" aria-label="Review summary">
          <span><strong>5</strong> lessons</span>
          <span><strong>12</strong> hours</span>
          <span><strong>55</strong> offline tests</span>
        </div>
      </header>

      <section className="content-review-lessons" aria-label="Phase 2 lessons">
        {phase2ReviewLessons.map((lesson, index) => (
          <article className="content-review-lesson" key={lesson.slug}>
            <div className="content-review-lesson-heading">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{lesson.title}</h2>
                <p>{lesson.time}</p>
              </div>
            </div>
            <div className="content-review-changes">
              <section className="content-review-change">
                <div className="content-review-change-heading">
                  <span className="content-review-badge content-review-badge-added">Added</span>
                  <h3>Lesson content and practice</h3>
                </div>
                <div className="content-review-comparison content-review-comparison-single">
                  <div>
                    {lesson.additions.map((addition) => <blockquote key={addition}>{addition}</blockquote>)}
                  </div>
                </div>
                <Link className="content-review-lesson-link" href={`/learn/${lesson.slug}`}>
                  Read lesson →
                </Link>
              </section>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
