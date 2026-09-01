import Link from "next/link";
import { notFound } from "next/navigation";
import { GlossaryText } from "../../components/GlossaryText";
import { LessonNotes } from "../../components/LessonNotes";
import { LearningContentComingSoon } from "../../components/LearningContentComingSoon";
import { allLessons, getAdjacentLessons, getLesson, getLessonSections, getPhase } from "../../../lib/curriculum";
import { isPhasePublished } from "../../../lib/siteStatus";

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

  if (!isPhasePublished(item.phaseId)) {
    return {
      title: "Lessons coming soon",
      description: "Detailed Agentic AI Lab lessons will be released as each phase is completed."
    };
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

  if (!isPhasePublished(item.phaseId)) {
    return <LearningContentComingSoon />;
  }

  const phase = getPhase(item.phaseId);
  const { previous, next } = getAdjacentLessons(item.slug);
  const previousIsPublished = previous ? isPhasePublished(previous.phaseId) : false;
  const nextIsPublished = next ? isPhasePublished(next.phaseId) : false;
  const sections = getLessonSections(item);

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
        <LessonNotes lessonSlug={item.slug} />
      </header>

      <div className="lesson-content-layout">
        <aside className="lesson-table-of-contents" aria-label="Lesson topics">
          <p>Lesson topics</p>
          <nav>
            {sections.map((section) => (
              <a href={`#${section.id}`} key={section.id}>
                {section.title}
              </a>
            ))}
            <a href="#customer-service-example">Customer Service Agent example</a>
          </nav>
        </aside>

        <article className="lesson-reading-content" data-lesson-slug={item.slug}>
          {sections.map((section) => (
            <section id={section.id} key={section.id}>
              <h2>{section.title}</h2>
              {section.content.map((paragraph, paragraphIndex) => (
                <p data-note-anchor={`${section.id}-${paragraphIndex}`} key={paragraph} tabIndex={-1}>
                  <GlossaryText text={paragraph} />
                </p>
              ))}
              {section.example ? (
                <aside className="lesson-concept-example" aria-label={`${section.title} example`}>
                  <p className="lesson-example-label">Example</p>
                  <h3>{section.example.title}</h3>
                  {section.example.content.map((paragraph, paragraphIndex) => (
                    <p data-note-anchor={`${section.id}-example-${paragraphIndex}`} key={paragraph} tabIndex={-1}>
                      <GlossaryText text={paragraph} />
                    </p>
                  ))}
                </aside>
              ) : null}
            </section>
          ))}

          <section className="lesson-example" id="customer-service-example">
            <p className="lesson-example-label">Lesson example</p>
            <h2>Customer Service Agent</h2>
            <p data-note-anchor="customer-service-example-0" tabIndex={-1}>
              <GlossaryText text={item.example} />
            </p>
          </section>
        </article>
      </div>

      <nav className="lesson-pagination" aria-label="Adjacent lessons">
        {previous && previousIsPublished ? (
          <Link href={`/learn/${previous.slug}`}>
            <span>← Previous</span>
            <strong>{previous.title}</strong>
          </Link>
        ) : (
          <span />
        )}
        {next && nextIsPublished ? (
          <Link href={`/learn/${next.slug}`}>
            <span>Next →</span>
            <strong>{next.title}</strong>
          </Link>
        ) : next ? (
          <span>
            <span>Next lesson</span>
            <strong>Coming soon</strong>
          </span>
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
