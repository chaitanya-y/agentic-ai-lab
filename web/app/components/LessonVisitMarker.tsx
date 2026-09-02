"use client";

import { useEffect } from "react";
import { visitProgressKeys } from "../../lib/visitProgress";

export function LessonVisitMarker({ lessonSlug }: { lessonSlug: string }) {
  useEffect(() => {
    window.localStorage.setItem(visitProgressKeys.lastLesson, lessonSlug);
  }, [lessonSlug]);

  return null;
}
