# --- build stage -------------------------------------------------------------
FROM oven/bun:1 AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Public URL of the site, baked into the build (metadata, OG tags).
ARG NEXT_PUBLIC_SITE_URL=https://www.dockroute.dev
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

COPY package.json bun.lock ./
# postinstall (fumadocs-mdx) needs the config + content, so install without
# scripts first and generate explicitly after copying the sources.
RUN bun install --frozen-lockfile --ignore-scripts

COPY . .
RUN bunx fumadocs-mdx && bun run build

# --- runtime stage -----------------------------------------------------------
FROM node:26-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# The runtime only needs `node server.js`; drop npm/corepack and their bundled
# dependencies (tar, sigstore, ...) so they stop showing up in image scans.
RUN rm -rf /usr/local/lib/node_modules /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack /opt/yarn*

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node
EXPOSE 3000
CMD ["node", "server.js"]
