import Link from "next/link";
import { curriculum, totalHours } from "../../lib/curriculum";

export const metadata = {
  title: "Agentic Engineering Roadmap",
  description:
    "A realistic, prerequisite-aware roadmap for software engineers moving into production agentic engineering."
};

const schedules = [
  {
    title: "Steady",
    pace: "8 hours / week",
    duration: "5–6 months",
    fit: "Designed for working engineers who need time for exercises, review, and project documentation."
  },
  {
    title: "Focused",
    pace: "12 hours / week",
    duration: "3.5–4.5 months",
    fit: "Designed for engineers who can dedicate regular weekday and weekend study time to the transition."
  },
  {
    title: "Intensive",
    pace: "20 hours / week",
    duration: "9–11 weeks",
    fit: "Suitable for a career break when the schedule includes sufficient time for testing, documentation, and review."
  }
];

export default function RoadmapPage() {
  return (
    <main className="inner-page">
      <section className="page-hero roadmap-hero">
        <p className="eyebrow">Prerequisite-aware roadmap</p>
        <h1>A structured path from software engineering to production agent systems.</h1>
        <p>
          Plan for 150–200 total hours. The written curriculum is about {totalHours} guided hours; the remaining time
          covers repetition, debugging, evaluation runs, documentation, and portfolio polish.
        </p>
        <div className="page-meta">
          <span>9 phases</span>
          <span>4–6 months part-time</span>
          <span>1 production-style capstone</span>
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
              <div className="timeline-details">
                <p>
                  <strong>Prerequisite</strong>
                  {phase.prerequisite}
                </p>
                <p>
                  <strong>Exit outcome</strong>
                  {phase.outcome}
                </p>
              </div>
              <div className="timeline-lessons">
                {phase.lessons.map((item) => (
                  <Link href={`/learn/${item.slug}`} key={item.slug}>
                    <span>{item.title}</span>
                    <small>{item.time}</small>
                  </Link>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="schedule-section">
        <div className="section-intro">
          <p className="eyebrow">Study schedules</p>
          <h2>Choose a schedule that supports consistent practice and documentation.</h2>
          <p>
            These estimates assume you already write production software. If Python, APIs, testing, or databases are
            new, add time for those prerequisites rather than skipping them.
          </p>
        </div>
        <div className="schedule-grid">
          {schedules.map((schedule) => (
            <article key={schedule.title}>
              <span>{schedule.title}</span>
              <h3>{schedule.duration}</h3>
              <strong>{schedule.pace}</strong>
              <p>{schedule.fit}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="roadmap-note">
        <div>
          <p className="eyebrow">Advanced study</p>
          <h2>Advanced AI/ML topics after the core roadmap.</h2>
        </div>
        <p>
          After the capstone, useful next subjects include probability, linear algebra, classical ML, neural-network
          training, fine-tuning, recommendation systems, and model serving. The core roadmap provides the system
          experience needed to connect these subjects to specific engineering decisions.
        </p>
      </section>
    </main>
  );
}
