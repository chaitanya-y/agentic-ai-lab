"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { visitProgressEvent, visitProgressKeys } from "../../lib/visitProgress";

type LinkProps = {
  className: string;
  children: ReactNode;
};

export function WhyLabLink({ className, children }: LinkProps) {
  const [shouldNudge, setShouldNudge] = useState(false);

  useEffect(() => {
    const hasVisitedWhyLab =
      window.location.pathname === "/blog" || window.localStorage.getItem(visitProgressKeys.whyLabVisited) === "true";
    const hasSeenHint = window.localStorage.getItem(visitProgressKeys.whyLabHintShown) === "true";

    if (hasVisitedWhyLab || hasSeenHint) {
      return;
    }

    window.localStorage.setItem(visitProgressKeys.whyLabHintShown, "true");
    setShouldNudge(true);
    const timer = window.setTimeout(() => setShouldNudge(false), 8000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Link className={`${className}${shouldNudge ? " first-visit-nudge" : ""}`} href="/blog">
      {children}
    </Link>
  );
}

export function RoadmapLink({ className, children }: LinkProps) {
  const [shouldShimmer, setShouldShimmer] = useState(false);

  useEffect(() => {
    const hasVisitedWhyLab = window.localStorage.getItem(visitProgressKeys.whyLabVisited) === "true";
    const hasVisitedRoadmap = window.localStorage.getItem(visitProgressKeys.roadmapVisited) === "true";
    setShouldShimmer(hasVisitedWhyLab && !hasVisitedRoadmap);
  }, []);

  return (
    <Link className={`${className}${shouldShimmer ? " roadmap-guidance-shimmer" : ""}`} href="/roadmap">
      {children}
    </Link>
  );
}

export function LearningNavLink() {
  const [canLearn, setCanLearn] = useState(false);

  useEffect(() => {
    const updateAccess = () => {
      setCanLearn(window.localStorage.getItem(visitProgressKeys.roadmapVisited) === "true");
    };

    updateAccess();
    window.addEventListener("storage", updateAccess);
    window.addEventListener(visitProgressEvent, updateAccess);

    return () => {
      window.removeEventListener("storage", updateAccess);
      window.removeEventListener(visitProgressEvent, updateAccess);
    };
  }, []);

  return canLearn ? <Link href="/learn">Learn</Link> : null;
}
