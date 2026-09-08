import assert from "node:assert/strict";
import test from "node:test";

import { isPhaseAvailable, isPhasePublished } from "../lib/siteStatus.ts";

test("Phase 2 lessons are published for production visitors", () => {
  const phaseId = "prompts-context-structured-output";

  assert.equal(isPhasePublished(phaseId), true);
  assert.equal(isPhaseAvailable(phaseId), true);
});
