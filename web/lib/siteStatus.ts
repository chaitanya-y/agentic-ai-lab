const publishedPhaseIds = new Set(["llm-fundamentals"]);
const previewPhaseIds = new Set(["prompts-context-structured-output"]);

// Agent examples and other detailed content remain unavailable until their release.
export const learningContentPublished = false;

export function isPhasePublished(phaseId: string) {
  return publishedPhaseIds.has(phaseId);
}

export function isDevelopmentPreview() {
  return process.env.NODE_ENV === "development" || process.env.VERCEL_GIT_COMMIT_REF === "dev";
}

export function isPhaseAvailable(phaseId: string) {
  return isPhasePublished(phaseId) || (isDevelopmentPreview() && previewPhaseIds.has(phaseId));
}
