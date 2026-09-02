import { curriculum, totalHours } from "../../lib/curriculum";
import { isPhasePublished } from "../../lib/siteStatus";
import { RoadmapLessonList } from "../components/RoadmapLessonList";
import { VisitMarker } from "../components/VisitMarker";

export const metadata = {
  title: "Agentic Engineering Roadmap",
  description:
    "A realistic, prerequisite-aware roadmap for software engineers moving into production agentic engineering."
};

export default function RoadmapPage() {
  return (
    <main className="inner-page">
      <VisitMarker page="roadmap" />
      <section className="page-hero roadmap-hero">
        <p className="eyebrow">117 hour roadmap</p>
        <h1>Agentic AI engineering roadmap.</h1>
        <p>
          A focused {totalHours} hour course for software engineers preparing to build AI applications. Start with LLM
          fundamentals, then move through retrieval, tools, agentic workflows, and evaluation before completing the
          Customer Service Agent capstone.
        </p>
        <div className="page-meta">
          <span>{curriculum.length} phases</span>
          <span>{totalHours} hours</span>
          <span>1 capstone project</span>
        </div>
      </section>

      <section className="roadmap-timeline">
        {curriculum.map((phase, index) => (
          <article className={`timeline-item accent-${phase.accent}`} key={phase.id}>
            <div className="timeline-marker">
              <span>{phase.number}</span>
              {index < curriculum.length - 1 ? <i aria-hidden="true" /> : null}
            </div>
            <div className="timeline-card">
              <div className="timeline-top">
                <div>
                  <p>Phase {phase.number}</p>
                  <h2>{phase.title}</h2>
                </div>
                <strong>{phase.time}</strong>
              </div>
              <p>{phase.summary}</p>
              <RoadmapLessonList
                isPublished={isPhasePublished(phase.id)}
                lessons={phase.lessons.map(({ slug, time, title }) => ({ slug, time, title }))}
              />
            </div>
          </article>
        ))}
      </section>

      <p className="roadmap-time-note">
        Plan for around 15 hours each week to complete the course in two months. The estimate includes reading,
        implementation, debugging, evaluation, and capstone work.
      </p>
    </main>
  );
}
