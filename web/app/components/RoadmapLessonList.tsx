"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { visitProgressEvent, visitProgressKeys } from "../../lib/visitProgress";
type RoadmapLesson = {
  activityLabel?: string;
  slug: string;
  time: string;
  title: string;
};

type RoadmapLessonListProps = {
  isPublished: boolean;
  lessons: RoadmapLesson[];
};

export function RoadmapLessonList({ isPublished, lessons }: RoadmapLessonListProps) {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!showToast) {
      return;
    }

    const timeoutId = window.setTimeout(() => setShowToast(false), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [showToast]);

  const confirmRoadmapVisit = () => {
    window.localStorage.setItem(visitProgressKeys.roadmapVisited, "true");
    window.dispatchEvent(new Event(visitProgressEvent));
  };

  return (
    <>
      <div className="timeline-lessons">
        {lessons.map((item) =>
          isPublished ? (
            <Link href={`/learn/${item.slug}`} key={item.slug} onClick={confirmRoadmapVisit}>
              <span className="roadmap-lesson-label">
                <span>{item.title}</span>
                {item.activityLabel ? <span className="roadmap-activity-badge">{item.activityLabel}</span> : null}
              </span>
              <small className="roadmap-lesson-time">{item.time}</small>
            </Link>
          ) : (
            <button className="roadmap-lesson-disabled" key={item.slug} onClick={() => setShowToast(true)} type="button">
              <span className="roadmap-lesson-label">
                <span>{item.title}</span>
                {item.activityLabel ? <span className="roadmap-activity-badge">{item.activityLabel}</span> : null}
              </span>
              <small className="roadmap-lesson-time">{item.time}</small>
            </button>
          )
        )}
      </div>
      {showToast ? (
        <p aria-live="polite" className="lesson-toast" role="status">
          This lesson is not available yet. We’re adding detailed content each week.
        </p>
      ) : null}
    </>
  );
}
