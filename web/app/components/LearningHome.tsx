"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { visitProgressKeys } from "../../lib/visitProgress";

export type ReleasedLearningPhase = {
  id: string;
  number: string;
  title: string;
  time: string;
  lessons: Array<{
    slug: string;
    time: string;
    title: string;
  }>;
};

export function LearningHome({ phases }: { phases: ReleasedLearningPhase[] }) {
  const lessons = useMemo(() => phases.flatMap((phase) => phase.lessons), [phases]);
  const [lastLessonSlug, setLastLessonSlug] = useState<string | null>(null);

  useEffect(() => {
    const savedSlug = window.localStorage.getItem(visitProgressKeys.lastLesson);
    if (savedSlug && lessons.some((lesson) => lesson.slug === savedSlug)) {
      setLastLessonSlug(savedSlug);
    }
  }, [lessons]);

  const continueLesson = lessons.find((lesson) => lesson.slug === lastLessonSlug) ?? lessons[0];

  return (
    <main className="inner-page learning-index-page">
      <section className="page-hero learning-index-hero">
        <p className="eyebrow">Released lessons</p>
        <h1>Continue learning.</h1>
        {continueLesson ? (
          <Link className="button button-dark learning-continue-button" href={`/learn/${continueLesson.slug}`}>
            {lastLessonSlug ? "Continue" : "Start learning"} →
          </Link>
        ) : null}
      </section>

      <div className="learning-phase-list">
        {phases.map((phase) => (
          <section className="learning-phase" key={phase.id}>
            <header>
              <span>{phase.number}</span>
              <div>
                <h2>{phase.title}</h2>
                <p>{phase.time}</p>
              </div>
            </header>
            <ol>
              {phase.lessons.map((lesson, index) => (
                <li key={lesson.slug}>
                  <Link href={`/learn/${lesson.slug}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{lesson.title}</strong>
                    <small>{lesson.time}</small>
                    <i aria-hidden="true">→</i>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </main>
  );
}
