import assert from "node:assert/strict";
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
