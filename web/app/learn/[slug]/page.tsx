import Link from "next/link";
import { notFound } from "next/navigation";
import { LearningContentComingSoon } from "../../components/LearningContentComingSoon";
import { allLessons, getAdjacentLessons, getLesson, getPhase } from "../../../lib/curriculum";
import { learningContentPublished } from "../../../lib/siteStatus";

type LessonPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return allLessons.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: LessonPageProps) {
  if (!learningContentPublished) {
    return {
      title: "Lessons coming soon",
      description: "Detailed Agentic AI Lab lessons will be released tomorrow."
    };
  }

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

  if (!learningContentPublished) {
    return <LearningContentComingSoon />;
  }

  const phase = getPhase(item.phaseId);
  const { previous, next } = getAdjacentLessons(item.slug);

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

      <article className="lesson-reading-content">
        <section>
          <h2>Content</h2>
          {item.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <section className="lesson-example">
          <h2>Example: Customer Service Agent</h2>
          <p>{item.example}</p>
        </section>
      </article>

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
