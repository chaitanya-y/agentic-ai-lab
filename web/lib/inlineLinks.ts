export type InlineTextPart =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string };

const inlineLinkPattern = /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g;

export function parseInlineLinks(text: string): InlineTextPart[] {
  const parts: InlineTextPart[] = [];
  let currentIndex = 0;

  for (const match of text.matchAll(inlineLinkPattern)) {
    const matchIndex = match.index ?? 0;
    if (matchIndex > currentIndex) {
      parts.push({ type: "text", value: text.slice(currentIndex, matchIndex) });
    }

    parts.push({ type: "link", label: match[1], href: match[2] });
    currentIndex = matchIndex + match[0].length;
  }

  if (currentIndex < text.length) {
    parts.push({ type: "text", value: text.slice(currentIndex) });
  }

  return parts.length ? parts : [{ type: "text", value: text }];
}
