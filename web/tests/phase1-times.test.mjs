import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Phase 1 lesson times match the published learning plan", () => {
  const curriculum = readFileSync(new URL("../lib/curriculum.ts", import.meta.url), "utf8");
  const phaseStart = curriculum.indexOf('id: "llm-fundamentals"');
  const phaseEnd = curriculum.indexOf('id: "retrieval-augmented-generation"', phaseStart);
  const phase = curriculum.slice(phaseStart, phaseEnd);

  assert.notEqual(phaseStart, -1);
  assert.notEqual(phaseEnd, -1);
  assert.match(phase, /time: "6\.5 hours",\n\s+hours: 6\.5,/);

  const expectedTimes = new Map([
    ["what-is-a-large-language-model", "1 hour"],
    ["transformer-architecture-and-attention", "1 hour"],
    ["how-llms-are-trained-and-improved", "1 hour"],
    ["inference-tokens-context-and-latency", "1 hour"],
    ["using-llm-apis-and-langchain", "1.5 hours"],
    ["building-a-basic-agent-with-langchain", "1 hour"]
  ]);

  for (const [slug, time] of expectedTimes) {
    assert.match(phase, new RegExp(`"${slug}",\\n\\s+"[^"]+",\\n\\s+"${time}"`));
  }
});
