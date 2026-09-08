import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { phase2CodeExamples } from "../lib/phases/phase2CodeExamples.ts";

test("Phase 1 test commands stay inside the runnable lesson sections", () => {
  const curriculum = readFileSync(new URL("../lib/curriculum.ts", import.meta.url), "utf8");
  const examples = readFileSync(new URL("../lib/lessonCodeExamples.ts", import.meta.url), "utf8");

  assert.doesNotMatch(curriculum, /id: "testing-the-analyzer"/);
  assert.doesNotMatch(examples, /"testing-the-analyzer": \[/);
  assert.match(
    examples,
    /"build-support-request-analyzer": \[[\s\S]*uv run pytest tests\/test_shared\.py tests\/test_ollama_analyzer\.py/
  );
  assert.match(examples, /"run-the-agent": \[[\s\S]*code: `uv run pytest`/);
});

test("Phase 2 hands on work provides focused and complete test commands", () => {
  const expectedCommands = [
    [
      "prompt-engineering",
      "prompt-exercise-three",
      "uv run pytest tests/test_prompt_practice.py tests/test_prompts.py"
    ],
    [
      "context-engineering",
      "context-exercise-five",
      "uv run pytest tests/test_context.py tests/test_context_practice.py"
    ],
    [
      "prompt-injection-and-trust-boundaries",
      "trust-exercise-two",
      "uv run pytest tests/test_trust_boundaries.py tests/test_validation.py tests/test_context.py::test_order_lookup_does_not_reveal_another_customers_order"
    ],
    ["prompt-evaluation", "evaluation-exercise-four", "uv run pytest tests/test_evaluation.py"],
    ["customer-support-response-assistant", "project-setup", "uv run pytest"]
  ];

  for (const [lessonSlug, sectionId, expectedCommand] of expectedCommands) {
    const examples = phase2CodeExamples[lessonSlug]?.[sectionId] ?? [];
    assert.ok(
      examples.some((example) => example.code === expectedCommand),
      `${lessonSlug}/${sectionId} must include its test command`
    );
  }
});

test("Context Engineering completion actions remain offline", () => {
  const exerciseExamples = phase2CodeExamples["context-engineering"]?.["context-exercise-five"] ?? [];
  const liveExamples = phase2CodeExamples["context-engineering"]?.["context-complete-assistant"] ?? [];
  const answerIndex = exerciseExamples.findIndex(
    (example) => example.code === "uv run python practice/context_answers.py"
  );

  assert.notEqual(answerIndex, -1);
  assert.ok(exerciseExamples[answerIndex].description?.includes("five completed exercises"));
  assert.equal(exerciseExamples.some((example) => example.code.includes("support-assistant")), false);
  assert.deepEqual(liveExamples, []);
});
