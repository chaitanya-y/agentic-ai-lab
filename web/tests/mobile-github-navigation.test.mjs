import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("mobile navigation does not hide the GitHub button by link position", () => {
  const styles = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.doesNotMatch(styles, /\.site-header nav a:nth-child\(4\)/);
});
