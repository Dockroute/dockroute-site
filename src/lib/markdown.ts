import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

/**
 * Minimal markdown pipeline for text that does not come from `content/docs`,
 * currently GitHub release bodies.
 *
 * `allowDangerousHtml` is deliberately off: raw HTML inside a release body is
 * dropped instead of being injected into the page.
 */
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify);

export async function markdownToHtml(markdown: string): Promise<string> {
  if (!markdown.trim()) return "";
  return String(await processor.process(markdown));
}
