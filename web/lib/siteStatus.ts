const publishedPhaseIds = new Set(["llm-fundamentals"]);

// Agent examples and other detailed content remain unavailable until their release.
export const learningContentPublished = false;

export function isPhasePublished(phaseId: string) {
  return publishedPhaseIds.has(phaseId);
}
