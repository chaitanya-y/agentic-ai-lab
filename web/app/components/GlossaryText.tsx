import { glossaryTerms } from "../../lib/glossaryTerms";

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
  const parts = text.split(glossaryPattern);

  return parts.map((part, index) => {
    const match = glossaryTerms.find(({ term }) => term.toLowerCase() === part.toLowerCase());

    if (!match || shownTerms.has(match.term)) {
      return part;
    }

    shownTerms.add(match.term);

    return (
      <span className="term-tooltip" key={`${match.term}-${index}`} tabIndex={0}>
        {part}
        <span className="term-tooltip-definition" role="tooltip">
          {match.definition}
        </span>
      </span>
    );
  });
}
