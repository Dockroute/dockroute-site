import { siteUrl } from "@/lib/shared";

export const revalidate = false;

// AI crawlers get an explicit group so the policy for them is deliberate,
// not an accident of the wildcard. The docs are also exported for LLMs at
// /llms.txt, /llms-full.txt and per-page /docs/*.md.
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "Claude-User",
  "Claude-SearchBot",
  "Google-Extended",
  "PerplexityBot",
  "CCBot",
];

export function GET() {
  const body = `# ${siteUrl}/robots.txt
User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /
Disallow: /api/
Disallow: /og/

${aiCrawlers.map((bot) => `User-agent: ${bot}`).join("\n")}
Allow: /
Disallow: /api/
Disallow: /og/

Sitemap: ${siteUrl}/sitemap.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
