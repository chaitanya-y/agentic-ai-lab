"use client";

import { useEffect, useState } from "react";
type RoadmapLesson = {
  slug: string;
  time: string;
  title: string;
};

type RoadmapLessonListProps = {
  lessons: RoadmapLesson[];
};

export function RoadmapLessonList({ lessons }: RoadmapLessonListProps) {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!showToast) {
      return;
    }

    const timeoutId = window.setTimeout(() => setShowToast(false), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [showToast]);

  return (
    <>
      <div className="timeline-lessons">
        {lessons.map((item) => (
          <button className="roadmap-lesson-disabled" key={item.slug} onClick={() => setShowToast(true)} type="button">
            <span>{item.title}</span>
            <small>{item.time}</small>
          </button>
        ))}
      </div>
      {showToast ? (
        <p aria-live="polite" className="lesson-toast" role="status">
          This lesson is not available yet. We’re adding detailed content each week.
        </p>
      ) : null}
    </>
  );
}
