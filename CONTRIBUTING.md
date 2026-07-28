# Contributing to dockroute-site

Thanks for your interest! This repository holds the marketing and
documentation site for [DockRoute](https://github.com/Dockroute/Dockroute).
Contributions of all kinds are welcome: docs fixes, copy improvements, design
polish and code.

## Development setup

The site runs on [Bun](https://bun.sh):

```sh
bun install
bun run dev          # http://localhost:3000
bun run lint         # Biome (bun run format to fix formatting)
bun run types:check  # MDX collections + Next typegen + strict TypeScript
bun run build        # production build
```

All three checks must pass before a PR — CI enforces them, plus a Docker
image build with a Trivy vulnerability scan.

## Ground rules

- **`main` stays clean** — all changes land via pull request.
- **Documentation must be faithful to the code.** Every label, environment
  variable, default value and behavior described here must match the actual
  DockRoute source — not just its README. Do not document features that do
  not exist yet; when the product changes, the docs change in the same
  spirit.
- **Follow the brand guide.** [BRAND_GUIDE.md](BRAND_GUIDE.md) governs
  colors, typography, illustration and copy tone. New UI uses the existing
  theme tokens (`--color-fd-*` overrides and the brand utilities in
  `src/app/global.css`) rather than ad-hoc colors.
- **English only** in site copy, code, comments and commits. All public
  content is English.
- **Keep marketing calm.** Short, direct sentences; outcomes before
  architecture; no "revolutionary", no "AI-powered", no pirate jokes.

## Where things live

- `content/docs/` — documentation pages (MDX + `meta.json` for ordering).
- `src/app/(home)/page.tsx` — the landing page.
- `src/app/global.css` — brand theme (light/dark tokens).
- `public/brand/` — logo, icon and mascot assets.

## Commit / PR conventions

- Conventional-style prefixes appreciated: `feat:`, `fix:`, `docs:`,
  `chore:`.
- Keep PRs focused; describe *why*, not just *what*.
- UI changes: include before/after screenshots in light **and** dark mode.
