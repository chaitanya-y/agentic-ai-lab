import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { phase2Curriculum } from "../lib/phases/phase2.ts";

const expectedExercises = new Map([
  ["prompt-engineering", 3],
  ["prompt-injection-and-trust-boundaries", 3],
  ["prompt-evaluation", 5],
  ["context-engineering", 5]
]);

test("hands on exercises stay inside one lesson section", () => {
  for (const [lessonSlug, exerciseCount] of expectedExercises) {
    const lesson = phase2Curriculum.lessons.find((item) => item.slug === lessonSlug);
    assert.ok(lesson, `missing lesson ${lessonSlug}`);

    const handsOnSections = lesson.sections?.filter((section) => section.title === "Hands On Practice") ?? [];
    assert.equal(handsOnSections.length, 1, `${lessonSlug} must have one Hands On Practice section`);
    assert.equal(handsOnSections[0].exercises?.length, exerciseCount);

    for (const exercise of handsOnSections[0].exercises ?? []) {
      assert.ok(exercise.fileLabel, `${exercise.id} must explain whether a file changes`);
      assert.ok(exercise.files?.length, `${exercise.id} must identify the relevant files`);
      assert.ok(exercise.content.length, `${exercise.id} must explain what to do`);
      assert.ok(exercise.expectedResult?.length, `${exercise.id} must explain how to verify the result`);
    }

    const topLevelExercises = lesson.sections?.filter((section) => section.title.startsWith("Exercise ")) ?? [];
    assert.equal(topLevelExercises.length, 0, `${lessonSlug} exercises must not appear in the lesson topics menu`);
  }
});

test("the shared prompt starter labels each exercise once", () => {
  const starterPath = new URL(
    "../../labs/02-prompt-context-engineering/customer-support-assistant/practice/starter.py",
    import.meta.url
  );
  const starter = readFileSync(starterPath, "utf8");
  const headings = starter.match(
    /^\s*# (?:Prompt Engineering Exercise [1-3]|Prompt Evaluation Exercise [1-2])$/gm
  ) ?? [];

  assert.deepEqual(
    headings.map((heading) => heading.trim()),
    [
      "# Prompt Engineering Exercise 1",
      "# Prompt Engineering Exercise 2",
      "# Prompt Engineering Exercise 3",
      "# Prompt Evaluation Exercise 1",
      "# Prompt Evaluation Exercise 2"
    ]
  );
});

test("the prompt template answer completes the named starter variable", () => {
  const lesson = phase2Curriculum.lessons.find((item) => item.slug === "prompt-engineering");
  const handsOn = lesson?.sections?.find((section) => section.title === "Hands On Practice");
  const exercise = handsOn?.exercises?.find((item) => item.id === "prompt-exercise-two");
  const solution = exercise?.solution?.code ?? "";

  assert.match(solution, /SUPPORT_SUMMARY_TEMPLATE\s*=\s*PromptTemplate\(/);
  assert.match(solution, /SUPPORT_SUMMARY_TEMPLATE\.render\(/);
  assert.match(solution, /print\("\\nPrompt Engineering Exercise 2"\)/);
  assert.match(solution, /print\(prompt\)/);
  assert.doesNotMatch(solution, /^template\s*=\s*PromptTemplate\(/m);
});

test("the prompt validation answer prints both handled errors", () => {
  const lesson = phase2Curriculum.lessons.find((item) => item.slug === "prompt-engineering");
  const handsOn = lesson?.sections?.find((section) => section.title === "Hands On Practice");
  const exercise = handsOn?.exercises?.find((item) => item.id === "prompt-exercise-three");
  const solution = exercise?.solution?.code ?? "";

  assert.match(solution, /print\("\\nPrompt Engineering Exercise 3"\)/);
  assert.match(solution, /SUPPORT_SUMMARY_TEMPLATE\.render\(variables\)/);
  assert.match(solution, /except ValueError as error:/);
  assert.match(solution, /print\(error\)/);
  assert.match(solution, /"tone": "friendly"/);
});

test("prompt engineering explains example order and uses the revised time", () => {
  const lesson = phase2Curriculum.lessons.find((item) => item.slug === "prompt-engineering");
  const exampleSelection = lesson?.sections?.find((section) => section.id === "example-selection");

  assert.equal(lesson?.time, "1.5 hours");
  assert.ok(
    exampleSelection?.content.some((paragraph) =>
      paragraph.includes("Examples are part of the model’s ordered input")
    )
  );
});
