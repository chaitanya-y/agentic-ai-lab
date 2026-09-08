import assert from "node:assert/strict";
import test from "node:test";

import { parseInlineLinks } from "../lib/inlineLinks.ts";


test("inline lesson links preserve surrounding text and expose a safe destination", () => {
  assert.deepEqual(
    parseInlineLinks(
      "Clone the repository from [GitHub](https://github.com/chaitanya-y/agentic-ai-lab) before continuing."
    ),
    [
      { type: "text", value: "Clone the repository from " },
      {
        type: "link",
        label: "GitHub",
        href: "https://github.com/chaitanya-y/agentic-ai-lab"
      },
      { type: "text", value: " before continuing." }
    ]
  );
});

test("unsafe link schemes remain ordinary lesson text", () => {
  assert.deepEqual(parseInlineLinks("Open [this](javascript:alert(1)) link."), [
    { type: "text", value: "Open [this](javascript:alert(1)) link." }
  ]);
});
