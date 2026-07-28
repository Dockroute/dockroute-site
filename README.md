# dockroute-site

[![CI](https://github.com/Dockroute/dockroute-site/actions/workflows/ci.yml/badge.svg)](https://github.com/Dockroute/dockroute-site/actions/workflows/ci.yml)
[![CodeQL](https://github.com/Dockroute/dockroute-site/actions/workflows/codeql.yml/badge.svg)](https://github.com/Dockroute/dockroute-site/actions/workflows/codeql.yml)
[![Release](https://img.shields.io/github/v/release/Dockroute/dockroute-site?include_prereleases)](https://github.com/Dockroute/dockroute-site/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Marketing and documentation site for [DockRoute](https://github.com/Dockroute/Dockroute) —
External-DNS for plain Docker hosts. Built with Next.js + Fumadocs, themed after
[BRAND_GUIDE.md](BRAND_GUIDE.md).

## Development

```sh
bun install
bun run dev          # http://localhost:3000
bun run lint         # Biome
bun run types:check  # MDX + Next typegen + tsc
bun run build        # production build
```

Docs content lives in `content/docs/` as MDX. The landing page is
`src/app/(home)/page.tsx`.

## Deployment

Tagged releases (`v*.*.*`) publish a multi-arch image to
`ghcr.io/dockroute/dockroute-site` (amd64 + arm64), gated by lint, typecheck,
build and a Trivy vulnerability scan. The site — naturally — publishes its own
DNS record through DockRoute:

```sh
docker compose up -d
```

Before deploying:

- set the `dockroute.hostname` label in `docker-compose.yml` to your domain
  (picked up by the DockRoute instance running on the host);
- set the `SITE_URL` repository variable on GitHub so releases bake the right
  public URL into metadata/OG tags (defaults to `https://dockroute.dev`).

The compose file includes commented-out `dockroute` and `cloudflared` services
for hosts that don't run them yet, and a commented `build:` block for building
locally instead of pulling from GHCR.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) — the short version: docs must stay
faithful to the DockRoute source code, UI must follow the brand guide, and
`lint` + `types:check` + `build` must pass (CI enforces them).

Security reports: see [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
