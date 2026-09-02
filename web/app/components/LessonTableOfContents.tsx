"use client";

import { useEffect, useState } from "react";

type LessonTopic = {
  id: string;
  title: string;
};

export function LessonTableOfContents({ topics }: { topics: LessonTopic[] }) {
  const [activeTopic, setActiveTopic] = useState(topics[0]?.id ?? "");

  useEffect(() => {
    let frameId = 0;

    const updateActiveTopic = () => {
      frameId = 0;
      const readingLine = 240;
      let currentTopic = topics[0]?.id ?? "";

      for (const topic of topics) {
        const section = document.getElementById(topic.id);
        if (section && section.getBoundingClientRect().top <= readingLine) {
          currentTopic = topic.id;
        }
      }

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
        currentTopic = topics.at(-1)?.id ?? currentTopic;
      }

      setActiveTopic(currentTopic);
    };

    const scheduleUpdate = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(updateActiveTopic);
      }
    };

    updateActiveTopic();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
    };
  }, [topics]);

  return (
    <aside className="lesson-table-of-contents" aria-label="Lesson topics">
      <p>Lesson topics</p>
      <nav>
        {topics.map((topic) => (
          <a
            aria-current={activeTopic === topic.id ? "location" : undefined}
            className={activeTopic === topic.id ? "active" : undefined}
            href={`#${topic.id}`}
            key={topic.id}
            onClick={() => setActiveTopic(topic.id)}
          >
            {topic.title}
          </a>
        ))}
      </nav>
    </aside>
  );
}
