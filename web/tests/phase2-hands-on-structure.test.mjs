import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { phase2Curriculum } from "../lib/phases/phase2.ts";
import { phase2CodeExamples } from "../lib/phases/phase2CodeExamples.ts";

const expectedExercises = new Map([
  ["prompt-engineering", 3],
  ["prompt-injection-and-trust-boundaries", 3],
  ["prompt-evaluation", 4],
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

test("the Prompt Engineering starter labels only its three exercises", () => {
  const starterPath = new URL(
    "../../labs/02-prompt-context-engineering/customer-support-assistant/practice/prompt_starter.py",
    import.meta.url
  );
  const starter = readFileSync(starterPath, "utf8");
  const headings = starter.match(/^\s*# Prompt Engineering Exercise [1-3]$/gm) ?? [];

  assert.deepEqual(
    headings.map((heading) => heading.trim()),
    [
      "# Prompt Engineering Exercise 1",
      "# Prompt Engineering Exercise 2",
      "# Prompt Engineering Exercise 3"
    ]
  );
  assert.doesNotMatch(starter, /Prompt Evaluation Exercise/);
});

test("the Prompt Evaluation starter contains one deterministic scoring exercise", () => {
  const starterPath = new URL(
    "../../labs/02-prompt-context-engineering/customer-support-assistant/practice/evaluation_starter.py",
    import.meta.url
  );
  const starter = readFileSync(starterPath, "utf8");
  const headings = starter.match(/^\s*# Prompt Evaluation Exercise [1-4]$/gm) ?? [];

  assert.deepEqual(
    headings.map((heading) => heading.trim()),
    ["# Prompt Evaluation Exercise 1"]
  );
  assert.doesNotMatch(starter, /Prompt Engineering Exercise/);
});

test("Prompt Evaluation separates scoring, dataset review, development comparison, and held out evaluation", () => {
  const lesson = phase2Curriculum.lessons.find((item) => item.slug === "prompt-evaluation");
  const handsOn = lesson?.sections?.find((section) => section.id === "evaluation-lab");
  const exercises = handsOn?.exercises ?? [];

  assert.deepEqual(
    exercises.map((exercise) => exercise.id),
    [
      "evaluation-exercise-one",
      "evaluation-exercise-two",
      "evaluation-exercise-three",
      "evaluation-exercise-four"
    ]
  );
  assert.deepEqual(
    exercises[2]?.files,
    [
      ".env",
      "src/support_assistant/prompts.py",
      ".artifacts/eval-baseline.json",
      ".artifacts/eval-revised.json",
      ".artifacts/eval-few-shot.json"
    ]
  );
  assert.ok(exercises[3]?.files?.includes(".artifacts/eval-held-out.json"));
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

test("context implementation work stays inside Hands On Practice", () => {
  const lesson = phase2Curriculum.lessons.find((item) => item.slug === "context-engineering");
  assert.ok(lesson);

  const sectionIds = new Set(lesson.sections?.map((section) => section.id));
  for (const removedId of [
    "build-context-budget-manager",
    "build-source-selector",
    "build-conversation-selector",
    "test-context-assembly"
  ]) {
    assert.equal(sectionIds.has(removedId), false, `${removedId} must be nested under hands on work`);
  }

  const handsOn = lesson.sections?.find((section) => section.id === "context-engineering-lab");
  assert.equal(handsOn?.title, "Hands On Practice");
  assert.equal(handsOn?.exercises?.length, 5);
  assert.equal(handsOn?.example, undefined);

  for (const [index, exercise] of (handsOn?.exercises ?? []).entries()) {
    assert.match(
      exercise.solution?.code ?? "",
      new RegExp(`print\\(.*Context Engineering Exercise ${index + 1}`)
    );
  }
});

test("context commands appear after each exercise run instruction", () => {
  const lesson = phase2Curriculum.lessons.find((item) => item.slug === "context-engineering");
  const handsOn = lesson?.sections?.find((section) => section.id === "context-engineering-lab");
  const examples = phase2CodeExamples["context-engineering"];

  for (const exercise of handsOn?.exercises ?? []) {
    for (const example of examples[exercise.id] ?? []) {
      if (example.afterResult) {
        continue;
      }

      const instructionPattern = example.code.includes("practice/context_starter.py")
        ? /Run (?:the starter|`practice\/context_starter\.py`)/
        : example.code.includes("practice/context_answers.py")
          ? /Next run `practice\/context_answers\.py`/
          : example.code.includes("pytest")
            ? /Run the focused context tests/
            : /corrected_order/;
      const runInstructionIndex = exercise.content.findIndex((paragraph) =>
        instructionPattern.test(paragraph)
      );

      assert.notEqual(
        runInstructionIndex,
        -1,
        `${exercise.id} must explain ${example.title.toLowerCase()}`
      );
      assert.equal(
        example.afterParagraph,
        runInstructionIndex,
        `${exercise.id} commands must follow its run instruction`
      );
    }
  }
});

test("Context Engineering completion commands follow Exercise 5 results", () => {
  const lesson = phase2Curriculum.lessons.find((item) => item.slug === "context-engineering");
  const handsOn = lesson?.sections?.find((section) => section.id === "context-engineering-lab");
  const exercise = handsOn?.exercises?.find((item) => item.id === "context-exercise-five");
  const examples = phase2CodeExamples["context-engineering"]?.["context-exercise-five"] ?? [];
  const starter = examples.find((example) => example.code.includes("practice/context_starter.py"));
  const completionCommands = examples.filter((example) => example.afterResult === true);

  assert.equal(exercise?.content.length, 4);
  assert.equal(starter?.afterParagraph, 3);
  assert.deepEqual(
    completionCommands.map((example) => example.code),
    [
      "uv run python practice/context_answers.py",
      "uv run pytest tests/test_context.py tests/test_context_practice.py"
    ]
  );
});

test("Context Engineering does not contain the complete Phase 2 assistant run", () => {
  const lesson = phase2Curriculum.lessons.find((item) => item.slug === "context-engineering");
  const handsOn = lesson?.sections?.find((section) => section.id === "context-engineering-lab");
  const run = handsOn?.exercises?.find((item) => item.id === "context-complete-assistant");
  const examples = phase2CodeExamples["context-engineering"]?.["context-complete-assistant"] ?? [];

  assert.equal(run, undefined);
  assert.deepEqual(examples, []);
});

test("Prompt Engineering completion commands follow Exercise 3 results", () => {
  const lesson = phase2Curriculum.lessons.find((item) => item.slug === "prompt-engineering");
  const handsOn = lesson?.sections?.find((section) => section.id === "prompt-engineering-practice");
  const exercise = handsOn?.exercises?.find((item) => item.id === "prompt-exercise-three");
  const examples = phase2CodeExamples["prompt-engineering"]?.["prompt-exercise-three"] ?? [];
  const starter = examples.find((example) => example.code === "uv run python practice/prompt_starter.py");
  const completionCommands = examples.filter((example) => example.afterResult === true);

  assert.equal(exercise?.content.length, 3);
  assert.equal(starter?.afterParagraph, 2);
  assert.deepEqual(
    completionCommands.map((example) => example.code),
    [
      "uv run python practice/prompt_answers.py",
      "uv run pytest tests/test_prompt_practice.py tests/test_prompts.py"
    ]
  );
});

test("trust boundary exercises identify inspection, testing, and coding work", () => {
  const lesson = phase2Curriculum.lessons.find(
    (item) => item.slug === "prompt-injection-and-trust-boundaries"
  );
  const handsOn = lesson?.sections?.find((section) => section.id === "trust-boundaries-lab");
  const exercises = handsOn?.exercises ?? [];

  assert.match(
    handsOn?.content[1] ?? "",
    /Exercise 1 inspects.*Exercise 2 runs.*Exercise 3 is the only coding exercise.*None of the exercises makes a model call/s
  );
  assert.deepEqual(
    exercises.map((exercise) => exercise.title),
    [
      "Exercise 1: Trust Boundary Mapping",
      "Exercise 2: Trust Boundary Testing",
      "Exercise 3: Prompt Injection Regression Testing"
    ]
  );
  assert.match(exercises[0]?.content[0] ?? "", /not edit a file or run a command/i);
  assert.match(exercises[0]?.solution?.code ?? "", /Record access.*load_order/s);
  assert.match(exercises[1]?.content[0] ?? "", /not edit source code or make a model call/i);
  assert.match(exercises[1]?.expectedResult?.[0] ?? "", /10 passed/);
  assert.match(exercises[2]?.content[0] ?? "", /only exercise.*changes code/i);
  assert.match(exercises[2]?.expectedResult?.[0] ?? "", /1 passed and 4 deselected/);
  assert.match(exercises[2]?.expectedResult?.[0] ?? "", /5 passed/);
});

test("trust boundary tests include the focused record authorization case", () => {
  const examples =
    phase2CodeExamples["prompt-injection-and-trust-boundaries"]?.["trust-exercise-two"] ?? [];

  assert.equal(examples.length, 1);
  assert.match(
    examples[0]?.code ?? "",
    /tests\/test_context\.py::test_order_lookup_does_not_reveal_another_customers_order/
  );
});

test("prompt injection explanations describe shared text and application enforcement plainly", () => {
  const lesson = phase2Curriculum.lessons.find(
    (item) => item.slug === "prompt-injection-and-trust-boundaries"
  );
  const injection = lesson?.sections?.find((section) => section.id === "prompt-injection-definition");
  const separation = lesson?.sections?.find((section) => section.id === "instruction-data-separation");
  const indirect = lesson?.sections?.find((section) => section.id === "direct-and-indirect-injection");

  assert.equal(lesson?.time, "1 hour");
  assert.equal(phase2Curriculum.time, "6.5 hours");
  assert.equal(phase2Curriculum.hours, 6.5);
  assert.equal(
    phase2Curriculum.lessons.find((item) => item.slug === "prompt-evaluation")?.time,
    "1 hour"
  );
  assert.equal(
    phase2Curriculum.lessons.find(
      (item) => item.slug === "customer-support-response-assistant"
    )?.time,
    "1.5 hours"
  );
  assert.equal(
    lesson?.summary,
    "Understand direct and indirect prompt injection, then use trust boundaries and application controls to protect data access and prevent unauthorized actions."
  );
  assert.ok(
    injection?.content.some((paragraph) =>
      paragraph.includes("process application instructions and untrusted content through the same language input")
    )
  );
  assert.ok(
    injection?.content.some((paragraph) =>
      paragraph.includes("Jailbreaking attempts to bypass a model provider’s safety behavior")
    )
  );
  assert.ok(
    injection?.content.some((paragraph) =>
      paragraph.includes("The practical goal is not to identify every suspicious phrase")
    )
  );
  assert.ok(
    separation?.content.some((paragraph) =>
      paragraph.includes("Do not combine customer text or retrieved content with a system instruction")
    )
  );
  assert.ok(
    indirect?.example?.content.some((paragraph) =>
      paragraph.includes("It may still invent a value")
    )
  );
  assert.ok(
    indirect?.example?.content.every((paragraph) =>
      !paragraph.includes("cannot reveal information it never received")
    )
  );
});
