"use client";

import { useState } from "react";

type LessonCodeBlockProps = {
  code: string;
  description?: string;
  file: string;
  intent?: "practice";
  title: string;
};

export function LessonCodeBlock({ code, description, file, intent, title }: LessonCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  function copyWithFallback() {
    const textarea = document.createElement("textarea");
    textarea.value = code;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const didCopy = document.execCommand("copy");
    textarea.remove();
    return didCopy;
  }

  async function copyCode() {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(code);
      } else if (!copyWithFallback()) {
        throw new Error("Copy is not available");
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(copyWithFallback());
      window.setTimeout(() => setCopied(false), 1600);
    }
  }

  return (
    <figure className="lesson-code-block">
      <figcaption>
        <div>
          <strong>{title}</strong>
          <span>{file}</span>
        </div>
        <button type="button" onClick={copyCode}>
          {copied ? "Copied" : "Copy code"}
        </button>
      </figcaption>
      {intent || description ? (
        <p className={`lesson-code-guidance${intent ? ` intent-${intent}` : ""}`}>
          {intent === "practice" ? (
            <>
              <strong>Hands on.</strong>{" "}Follow this step as part of the complete exercise.{" "}
            </>
          ) : null}
          {description}
        </p>
      ) : null}
      <pre tabIndex={0}>
        <code>{code}</code>
      </pre>
    </figure>
  );
}
