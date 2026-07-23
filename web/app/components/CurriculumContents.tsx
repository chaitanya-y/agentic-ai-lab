import Link from "next/link";
import { curriculum } from "../../lib/curriculum";

export function CurriculumContents({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "curriculum-list compact" : "curriculum-list"}>
      {curriculum.map((phase, index) => (
        <details className={`phase-panel accent-${phase.accent}`} key={phase.id} open={!compact && index === 0}>
          <summary>
            <span className="phase-number">{phase.number}</span>
            <span className="phase-summary-copy">
              <strong>{phase.title}</strong>
              <small>{phase.summary}</small>
            </span>
            <span className="phase-time">{phase.time}</span>
            <span className="summary-toggle" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="phase-panel-body">
            <div className="phase-outcome">
              <p>
                <strong>Start when:</strong> {phase.prerequisite}
              </p>
              <p>
                <strong>Finish with:</strong> {phase.outcome}
              </p>
            </div>
            <ol className="lesson-rows">
              {phase.lessons.map((item, lessonIndex) => (
                <li key={item.slug}>
                  <Link href={`/learn/${item.slug}`}>
                    <span className="lesson-index">
                      {phase.number}.{String(lessonIndex + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.summary}</small>
                    </span>
                    <span className="lesson-meta">
                      {item.format} · {item.time}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </details>
      ))}
    </div>
  );
}
