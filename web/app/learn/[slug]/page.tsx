import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { GlossaryText } from "../../components/GlossaryText";
import { LessonCodeBlock } from "../../components/LessonCodeBlock";
import { LessonLabPanel } from "../../components/LessonLabPanel";
import { LessonTableOfContents } from "../../components/LessonTableOfContents";
import { LessonNotes } from "../../components/LessonNotes";
import { LessonVisitMarker } from "../../components/LessonVisitMarker";
import { LessonVisual } from "../../components/LessonVisual";
import { LearningContentComingSoon } from "../../components/LearningContentComingSoon";
import { RoadmapAccessGate } from "../../components/RoadmapAccessGate";
import { allLessons, getAdjacentLessons, getLesson, getLessonSections, getPhase, type LessonSection } from "../../../lib/curriculum";
import { getLessonCodeExamples } from "../../../lib/lessonCodeExamples";
import { getLessonLab } from "../../../lib/lessonLabs";
import { isPhasePublished } from "../../../lib/siteStatus";

type LessonPageProps = {
  params: Promise<{ slug: string }>;
};

function LessonSectionContent({ lessonSlug, section }: { lessonSlug: string; section: LessonSection }) {
  const codeExamples = getLessonCodeExamples(lessonSlug, section.id);

  function renderCodeExample(example: (typeof codeExamples)[number]) {
    return (
      <LessonCodeBlock
        code={example.code}
        description={example.description}
        file={example.file}
        intent={example.intent}
        key={`${example.file}-${example.title}`}
        title={example.title}
      />
    );
  }

  return (
    <section id={section.id}>
      <h2>{section.title}</h2>
      <LessonVisual lessonSlug={lessonSlug} sectionId={section.id} />
      {section.content.map((paragraph, paragraphIndex) => (
        <Fragment key={`${section.id}-${paragraphIndex}`}>
          <p data-note-anchor={`${section.id}-${paragraphIndex}`} tabIndex={-1}>
            <GlossaryText text={paragraph} />
          </p>
          {codeExamples
            .filter((example) => example.afterParagraph === paragraphIndex)
            .map(renderCodeExample)}
        </Fragment>
      ))}
      {codeExamples.filter((example) => example.afterParagraph === undefined).map(renderCodeExample)}
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
  );
}

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
  const lab = getLessonLab(item.slug);
  const showLessonExample = Boolean(item.example);
  const lessonTopics = [
    ...sections.map(({ id, title }) => ({ id, title })),
    ...(showLessonExample ? [{ id: "customer-service-example", title: "Customer Service Agent example" }] : [])
  ];

  return (
    <RoadmapAccessGate>
      <main className="lesson-page">
      <LessonVisitMarker lessonSlug={item.slug} />
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
        </div>
        <LessonNotes lessonSlug={item.slug} />
      </header>

      <div className="lesson-content-layout">
        <LessonTableOfContents topics={lessonTopics} />

        <article className="lesson-reading-content" data-lesson-slug={item.slug}>
          {item.slug === "using-llm-apis-and-langchain" ? (
            <aside className="lesson-code-reading-note" aria-label="Code example guidance">
              <strong>Code examples in this lesson</strong>
              <p>
                The short code snippets in this lesson are for observation while you read the concepts. Do not run or modify them yet. If a line or concept is unclear, use a coding agent to ask questions and understand it before continuing. The final topic, Build a Support Request Analyzer, explains the project setup, the files and functions to inspect, and the complete steps for running all three implementations.
              </p>
            </aside>
          ) : null}
          {lab ? (
            <LessonLabPanel
              description={lab.description}
              path={lab.path}
              title={lab.title}
              url={lab.url}
            />
          ) : null}
          {sections.map((section) => (
            <LessonSectionContent key={section.id} lessonSlug={item.slug} section={section} />
          ))}

          {item.example ? (
            <section className="lesson-example" id="customer-service-example">
              <p className="lesson-example-label">Lesson example</p>
              <h2>Customer Service Agent</h2>
              <p data-note-anchor="customer-service-example-0" tabIndex={-1}>
                <GlossaryText text={item.example} />
              </p>
            </section>
          ) : null}

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
    </RoadmapAccessGate>
  );
}
