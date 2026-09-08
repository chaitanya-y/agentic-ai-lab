import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const stylesheetPath = new URL("../app/globals.css", import.meta.url);
const stylesheet = readFileSync(stylesheetPath, "utf8");

test("exercise list items can shrink so text wraps and code scrolls inside the lesson column", () => {
  const rule = stylesheet.match(/\.lesson-exercise-steps > li\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.match(rule, /min-width:\s*0\s*;/);
});
