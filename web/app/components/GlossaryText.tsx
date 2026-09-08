import { glossaryTerms } from "../../lib/glossaryTerms";
import { parseInlineLinks } from "../../lib/inlineLinks";

type GlossaryTextProps = {
  text: string;
};

const escapedTerms = glossaryTerms
  .map(({ term }) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .sort((left, right) => right.length - left.length)
  .join("|");

const glossaryPattern = new RegExp(`\\b(${escapedTerms})\\b`, "gi");

export function GlossaryText({ text }: GlossaryTextProps) {
  const shownTerms = new Set<string>();

  function renderGlossaryTerms(value: string, partIndex: number) {
    return value.split(glossaryPattern).map((part, termIndex) => {
      const match = glossaryTerms.find(({ term }) => term.toLowerCase() === part.toLowerCase());

      if (!match || shownTerms.has(match.term)) {
        return part;
      }

      shownTerms.add(match.term);

      return (
        <span className="term-tooltip" key={`${match.term}-${partIndex}-${termIndex}`} tabIndex={0}>
          {part}
          <span className="term-tooltip-definition" role="tooltip">
            {match.definition}
          </span>
        </span>
      );
    });
  }

  return parseInlineLinks(text).map((part, partIndex) => {
    if (part.type === "link") {
      return (
        <a
          className="lesson-inline-link"
          href={part.href}
          key={`${part.href}-${partIndex}`}
          rel="noreferrer"
          target="_blank"
        >
          {part.label}
        </a>
      );
    }

    return renderGlossaryTerms(part.value, partIndex);
  });
}
