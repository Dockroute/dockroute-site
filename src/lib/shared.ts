export const appName = "DockRoute";
export const appDescription =
  "External-DNS for plain Docker hosts. DockRoute watches your containers, reads dockroute.* labels and keeps your DNS records — and Cloudflare Tunnel routes — in sync.";

// Public URL of the deployed site; override at build time for your host.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dockroute.dev";

export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";
export const docsContentRoute = "/llms.mdx/docs";

// The product repo: nav GitHub button, releases, star links.
export const gitConfig = {
  user: "Dockroute",
  repo: "Dockroute",
  branch: "main",
};

// This site's own repo: "edit this page" links for the docs content.
export const siteRepo = {
  user: "Dockroute",
  repo: "dockroute-site",
  branch: "main",
};
