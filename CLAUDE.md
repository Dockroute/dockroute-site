# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is Bun (`bun.lock`).

- `bun install` — install deps (postinstall runs `fumadocs-mdx` to regenerate `.source/`)
- `bun run dev` — dev server at http://localhost:3000
- `bun run build` — production build
- `bun run types:check` — regenerates MDX collections + Next typegen, then `tsc --noEmit`
- `bun run lint` — Biome check (lint + format check)
- `bun run format` — Biome format, writes changes

There are no tests.

## Architecture

Documentation site built with Next.js (App Router) + Fumadocs. Content lives in `content/docs/` as MDX; everything else is wiring around it.

**Content pipeline:** `source.config.ts` defines the MDX collection (`content/docs`, with `includeProcessedMarkdown` enabled so pages expose a processed-markdown text form). `fumadocs-mdx` compiles it into the generated `.source/` directory (git-ignored from linting, aliased as `collections/*` in tsconfig). `src/lib/source.ts` wraps that in Fumadocs' `loader()` to produce the `source` object used by all pages/routes, plus helpers for a page's OG-image URL, raw-markdown URL, and LLM text.

**Shared constants:** `src/lib/shared.ts` holds the app name, site URL (`NEXT_PUBLIC_SITE_URL` override), route prefixes (`/docs`, `/og/docs`, `/llms.mdx/docs`), `gitConfig` (GitHub user/repo/branch used to build "edit on GitHub" links) and `repoLinks` (every outbound URL to the product repo — star, fork, new issue, releases, security policy). Route paths in the `src/app` tree must stay in sync with these constants.

**Social/dynamic layer:** `src/lib/github.ts` fetches live repo facts (stars, forks, open issues, releases) from the public GitHub API with `next: { revalidate: 3600 }`, so the site is ISR rather than fully static and one API call per hour serves every page. **Every function returns `null` instead of throwing** — these run during `next build` in CI and inside the Docker image, so a rate limit or an offline build must degrade to "no number shown", never to a failed build. A prerender that missed the data self-heals on the first revalidation. `GITHUB_TOKEN` is an optional *runtime* env var that lifts the anonymous 60/hour limit; never pass it as a build arg. The components that consume it live in `src/components/social/` and each renders a fallback (or nothing) for `null`. Release-note markdown is rendered through `src/lib/markdown.ts` with `allowDangerousHtml` off.

**Brand:** BRAND_GUIDE.md is the source of truth for colors, typography, and copy tone — all public copy is English. The theme is applied by overriding Fumadocs' `--color-fd-*` variables in `src/app/global.css` (light in `:root`, dark in `.dark`, plus a `.dark #nd-sidebar` override that neutral.css would otherwise pin to gray). Brand colors are also exposed as Tailwind utilities (`text-teal`, `bg-navy`, …) via `@theme inline`. Fonts: Manrope (`--font-manrope`) and IBM Plex Mono (`--font-plex-mono`) wired in `src/app/layout.tsx` via next/font. Optimized brand assets live in `public/brand/` (`.webp` + `dockroute-icon-128.png` for the nav); regenerate from the source PNGs with sharp if they change.

**Routes:**
- `src/app/docs/[[...slug]]/page.tsx` — renders all doc pages via `source.getPage()`
- `src/app/(home)/changelog/page.tsx` — release history rendered from the GitHub API (inside the `(home)` group so it inherits the marketing nav/footer)
- `src/app/api/search/route.ts` — search endpoint
- `src/app/og/docs/[...slug]/route.tsx` — generated OG images
- `src/app/llms.txt` / `llms-full.txt` / `llms.mdx/docs/[[...slug]]` — LLM-facing plain-markdown exports of the docs
- `src/proxy.ts` (Next proxy/middleware) rewrites `/docs/*.md` requests and `Accept: text/markdown` negotiation to the `/llms.mdx/docs/*/content.md` routes, so every doc page has a markdown representation at its own URL. It MUST live under `src/` — at the project root Next silently ignores it (the build only shows `ƒ Proxy` when detected)

**MDX components:** `src/components/mdx.tsx` (`getMDXComponents`) is where custom components available in MDX content are registered — including `RepoStats`, `ReleaseBadge`, `LatestReleaseCard` and `OpenSourceActions`, which are async server components usable directly in MDX (they carry `not-prose` so Fumadocs' typography does not restyle them). Doc pages pass `createRelativeLink` so MDX files can link to each other by relative file path.

Note: `fumadocs-ui` is aliased to `@fumadocs/base-ui` in package.json; imports still use the `fumadocs-ui/*` path.

## Deployment

Self-hosted via Docker in a homelab, with DNS published by DockRoute itself (dogfooding). `next.config.mjs` sets `output: 'standalone'`; the Dockerfile builds with Bun (`--ignore-scripts`, then explicit `bunx fumadocs-mdx`) and runs the standalone server on node:22-alpine. `docker-compose.yml` pulls `ghcr.io/dockroute/dockroute-site:latest` and carries the `dockroute.*` labels — the hostname must be set to the real domain before deploying.

CI (`.github/workflows/`, mirrored from the Dockroute/Dockroute repo): `ci.yml` runs lint + types:check + build plus a Docker build scanned by Trivy (fixable CRITICAL/HIGH block); `release.yml` on `v*.*.*` tags publishes the multi-arch image to GHCR (Trivy-gated) and creates a GitHub release — the `SITE_URL` repo variable feeds the `NEXT_PUBLIC_SITE_URL` build arg; `codeql.yml` is weekly + per-PR static analysis.

## Style

- Biome for linting/formatting: 2-space indent, recommended rules plus Next/React domains. `.source/` is excluded.
- Path alias `@/*` → `./src/*`.
