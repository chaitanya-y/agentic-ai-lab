"use client";

import { useEffect, useState, type ReactNode } from "react";
import { visitProgressKeys } from "../../lib/visitProgress";

export function RoadmapAccessGate({ children }: { children: ReactNode }) {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const hasVisitedRoadmap = window.localStorage.getItem(visitProgressKeys.roadmapVisited) === "true";

    if (hasVisitedRoadmap) {
      setHasAccess(true);
      return;
    }

    window.location.replace("/roadmap");
  }, []);

  if (!hasAccess) {
    return (
      <main className="learning-access-check" aria-live="polite">
        <p>Opening the roadmap…</p>
      </main>
    );
  }

  return children;
}
