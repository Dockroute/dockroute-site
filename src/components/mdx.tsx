import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { LatestReleaseCard } from "./social/latest-release-card";
import { OpenSourceActions } from "./social/open-source-actions";
import { ReleaseBadge } from "./social/release-badge";
import { RepoStats } from "./social/repo-stats";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    // Live repository data, usable straight from MDX content.
    RepoStats,
    ReleaseBadge,
    LatestReleaseCard,
    OpenSourceActions,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
