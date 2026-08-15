/**
 * semantic-release opens every body with `## [1.2.3](compare-url) (date)`.
 * The tag and the date are already rendered around the notes, so drop that
 * line and let the content start where it actually starts.
 */
export function stripVersionHeading(body: string): string {
  return body.replace(/^\s*#{1,6}\s*\[?v?\d+\.\d+\.\d+[^\n]*\n+/, "").trim();
}

/** A one-line plain-text summary of a release body, for cards and previews. */
export function releaseExcerpt(body: string, maxLength = 180): string {
  const text = stripVersionHeading(body)
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links keep their text
    .replace(/^#{1,6}\s+/gm, "") // headings
    .replace(/^[*+-]\s+/gm, "") // bullets
    .replace(/[*_`>]/g, "") // emphasis, inline code, quotes
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
