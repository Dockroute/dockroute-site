import { llms } from "fumadocs-core/source";
import { appDescription, appName, siteUrl } from "@/lib/shared";
import { source } from "@/lib/source";

export const revalidate = false;

export function GET() {
  // demote the generated "# Docs" heading and make links absolute, so the
  // index reads as a section of a spec-shaped llms.txt (https://llmstxt.org)
  const index = llms(source)
    .index()
    .replace(/^# /, "## ")
    .replaceAll("](/", `](${siteUrl}/`);

  const body = `# ${appName}

> ${appDescription}

Notes for agents and LLMs:

- Every docs page listed below has a plain-markdown version: append \`.md\` to its URL (e.g. ${siteUrl}/docs/quickstart.md) or request the page with \`Accept: text/markdown\`.
- The complete documentation as a single markdown file: ${siteUrl}/llms-full.txt
- Machine-readable sitemap: ${siteUrl}/sitemap.xml
- Full-text search over the docs: ${siteUrl}/api/search?query=your+terms
- Source code and issue tracker: https://github.com/Dockroute/Dockroute

${index}`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown" },
  });
}
