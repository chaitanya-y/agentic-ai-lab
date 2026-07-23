import Link from "next/link";
import { notFound } from "next/navigation";
import { agents } from "../../../lib/agents";
import { allLessons, getAdjacentLessons, getLesson, getPhase } from "../../../lib/curriculum";

type LessonPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return allLessons.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: LessonPageProps) {
  const { slug } = await params;
  const item = getLesson(slug);
  if (!item) {
    return { title: "Lesson not found" };
  }
  return {
    title: item.title,
    description: item.summary
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const item = getLesson(slug);
  if (!item) {
    notFound();
  }

  const phase = getPhase(item.phaseId);
  const { previous, next } = getAdjacentLessons(item.slug);
  const linkedLab = item.labSlug ? agents.find((agent) => agent.slug === item.labSlug) : undefined;

  return (
    <main className="lesson-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/roadmap">Phase {item.phaseNumber}</Link>
        <span>/</span>
        <span>{item.title}</span>
      </nav>

      <header className={`lesson-hero accent-${phase?.accent ?? "blue"}`}>
        <div className="lesson-phase">
          <span>Phase {item.phaseNumber}</span>
          <strong>{item.phaseTitle}</strong>
        </div>
        <h1>{item.title}</h1>
        <p>{item.summary}</p>
        <div className="lesson-facts">
          <span>
            <strong>Time</strong>
            {item.time}
          </span>
          <span>
            <strong>Format</strong>
            {item.format}
          </span>
          <span>
            <strong>Phase commitment</strong>
            {item.phaseTime}
          </span>
        </div>
      </header>

      <div className="lesson-layout">
        <aside className="lesson-aside">
          <p>In this lesson</p>
          <a href="#problem">Why it matters</a>
          <a href="#concept">Concept explanation</a>
          <a href="#example">Application example</a>
          <a href="#build">Practical exercise</a>
          <a href="#outcome">Expected output</a>
          {linkedLab ? <a href="#lab">Runnable lab</a> : null}
          <div className="tag-list">
            {item.concepts.map((concept) => (
              <span key={concept}>{concept}</span>
            ))}
          </div>
        </aside>

        <article className="lesson-content">
          <section id="problem">
            <p className="section-label">The problem</p>
            <h2>Why this matters</h2>
            <p>{item.why}</p>
          </section>

          <section id="concept">
            <p className="section-label">The concept</p>
            <h2>Concept explanation</h2>
            <p>{item.explanation}</p>
          </section>

          <section className="example-callout" id="example">
            <p className="section-label">Application example</p>
            <p>{item.example}</p>
          </section>

          <section id="build">
            <p className="section-label">Practice</p>
            <h2>Practical exercise</h2>
            <ol className="practice-list">
              {item.practice.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          {linkedLab ? (
            <section className="linked-lab" id="lab">
              <div>
                <p className="section-label">Repository lab</p>
                <h2>{linkedLab.name}</h2>
                <p>{linkedLab.summary}</p>
              </div>
              <Link className="button button-dark" href={`/agents/${linkedLab.slug}`}>
                Open runnable lab
              </Link>
            </section>
          ) : null}

          <section className="finish-line" id="outcome">
            <p className="section-label">Completion criteria</p>
            <h2>Expected output</h2>
            <p>{item.outcome}</p>
          </section>
        </article>
      </div>

      <nav className="lesson-pagination" aria-label="Adjacent lessons">
        {previous ? (
          <Link href={`/learn/${previous.slug}`}>
            <span>← Previous</span>
            <strong>{previous.title}</strong>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/learn/${next.slug}`}>
            <span>Next →</span>
            <strong>{next.title}</strong>
          </Link>
        ) : (
          <Link href="/roadmap">
            <span>Roadmap complete</span>
            <strong>Review the full path →</strong>
          </Link>
        )}
      </nav>
    </main>
  );
}
