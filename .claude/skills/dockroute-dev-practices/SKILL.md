---
name: dockroute-dev-practices
description: Development best practices for the dockroute-site codebase (Next.js 16 + Fumadocs, Bun, Biome) — docs-must-match-code accountability, the shared-constants/route sync rule, the graceful-degradation pattern for external API calls at build time, and the brand/style conventions. Use this skill whenever writing or reviewing code or content in this repo — docs pages, routes, components, or config — even if the user doesn't mention "best practices" explicitly.
---

# DockRoute Site Development Practices

This repo is the marketing and documentation site for
[DockRoute](https://github.com/Dockroute/Dockroute). Read `CONTRIBUTING.md`
and `CLAUDE.md` first if you haven't — they're the source of truth; this
skill summarizes the parts that matter most day to day.

## Docs must match the code — the most important rule

Every label, environment variable, default value and behavior documented in
`content/docs/` must match the actual DockRoute source, not just its README.

- Before editing or adding a doc page, check the claim against
  `Dockroute/Dockroute` (labels in `src/docker`, provider config in
  `src/providers/`) rather than copying from memory or an older page.
- Don't document features that don't exist yet. When the product changes,
  the docs change in the same PR cycle, not "eventually".
- Prefer examples that are actually testable: a `docker-compose.yml` snippet
  should be one that really comes up, with the labels it claims to need.

Why: a docs site that drifts from the product is worse than no docs — it
actively misleads self-hosters wiring up DNS.

## Shared constants & route sync

- `src/lib/shared.ts` is the single source for the app name, site URL,
  route prefixes (`/docs`, `/og/docs`, `/llms.mdx/docs`), `gitConfig` and
  `repoLinks`/`siteRepo`. Never hardcode a GitHub URL or route prefix
  elsewhere — add it here and import it.
- If you add or move a route under `src/app/`, update the matching constant
  in `shared.ts` in the same change. The proxy (`src/proxy.ts`) and the
  markdown/OG routes derive their paths from these constants; drifting them
  apart silently breaks `/docs/*.md` negotiation or OG image URLs.
- `src/proxy.ts` MUST live under `src/` — Next silently ignores it at the
  project root (the build only shows `ƒ Proxy` when it's picked up).

## Graceful degradation for external calls at build time

`src/lib/github.ts` fetches live repo stats during `next build` — in CI and
inside the Docker image — so a rate limit, network hiccup or offline build
must never fail the build.

- Any function that calls an external API at build/render time **returns
  `null` instead of throwing**, with a timeout (`AbortSignal.timeout(...)`).
  Callers render a fallback (or nothing) for `null`; never let a missing
  number crash a page.
- This applies to any new data source added to `src/components/social/` or
  similar async server components, not just the GitHub client.
- Secrets passed to these calls (e.g. `GITHUB_TOKEN`) are runtime env vars
  only — never a Docker build arg, or they'd be baked into the published
  image.

## Brand & content conventions

- `BRAND_GUIDE.md` governs colors, typography, illustration and copy tone.
  New UI uses the existing theme tokens (`--color-fd-*` overrides and brand
  Tailwind utilities in `src/app/global.css`), not ad-hoc colors.
- English only in site copy, code, comments and commits.
- Marketing copy stays calm: short, direct sentences, outcomes before
  architecture, no "revolutionary", no "AI-powered", no pirate jokes.
- UI changes include before/after screenshots in light **and** dark mode in
  the PR description.

## Bun, Biome & TypeScript conventions

- Package manager is Bun (`bun.lock`). No npm/yarn/pnpm lockfiles.
- Biome owns linting and formatting (`bun run lint` to check, `bun run
  format` to write). 2-space indent, recommended rules plus Next/React
  domains; `.source/` (fumadocs-mdx's generated output) is excluded.
- Path alias `@/*` → `./src/*`.
- `strict` TypeScript. `bun run types:check` regenerates the MDX
  collections and Next typegen before `tsc --noEmit` — run it after
  changing `content/docs/`, `source.config.ts`, or route signatures, not
  just after `.ts` edits.
- There are no unit tests in this repo (unlike `Dockroute/Dockroute`, which
  uses `bun:test`). Correctness here is enforced by the typecheck, Biome,
  and a real `next build` — don't invent a test suite for this repo.

## The gate before any PR

All of these must pass locally before opening a PR — CI runs the same three
plus a Docker build scanned by Trivy:

```sh
bun install
bun run lint         # Biome
bun run types:check  # fumadocs-mdx + next typegen + tsc --noEmit
bun run build        # production build
```

PR titles and commits follow Conventional Commits (`feat:`, `fix:`, `docs:`,
`chore:`) — validated by the `pr-title` workflow. Keep PRs small and
focused, describing *why* in the description. No direct pushes to `main`;
everything lands via branch + PR, and dependency bumps come from Dependabot.
