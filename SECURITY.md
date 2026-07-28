# Security Policy

This repository holds the DockRoute website — a statically-generated Next.js
site shipped as a Docker image. It handles no credentials and no user data,
but we still take reports seriously (dependency vulnerabilities, XSS in
rendered content, supply-chain issues in the image).

## Reporting a vulnerability

Please **do not open a public issue** for security problems. Instead use
GitHub's private vulnerability reporting
(*Security → Report a vulnerability* on the repository), or email
`danilo.dorgam@codeinloop.com.br`.

You can expect an acknowledgement within a few days. Please include steps to
reproduce and the impact you foresee.

## Scope notes

- The published image (`ghcr.io/dockroute/dockroute-site`) runs as a
  non-root user and serves prerendered content; it needs no Docker socket,
  no tokens and no volumes.
- Every image build is scanned with Trivy in CI; fixable CRITICAL/HIGH
  findings block the release.

## Supported versions

Only the latest published image receives fixes.
