"use client";

import { useEffect } from "react";
import { visitProgressKeys } from "../../lib/visitProgress";

type VisitMarkerProps = {
  page: "whyLab" | "roadmap";
};

export function VisitMarker({ page }: VisitMarkerProps) {
  useEffect(() => {
    const key = page === "whyLab" ? visitProgressKeys.whyLabVisited : visitProgressKeys.roadmapVisited;
    window.localStorage.setItem(key, "true");
  }, [page]);

  return null;
}
