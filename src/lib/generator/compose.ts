import type { WizardState } from "./state";

const CHANGE_ME = "CHANGE_ME";

export interface GeneratedFiles {
  compose: string;
  env: string;
}

/** `${name}`, built without a literal `${` so Biome doesn't mistake a
 * compose variable reference for a forgotten template-string placeholder. */
function envRef(name: string): string {
  return `$\{${name}}`;
}

/** Renders a user-supplied value as a safe YAML double-quoted scalar.
 * `$` is doubled first so compose's own interpolation treats it as a
 * literal `$` instead of (or alongside) a `${VAR}`/`$VAR` reference —
 * otherwise a value like `a$b` silently loses the `$b` with a compose
 * warning, and a value with `#`, `:` or a leading special char can break
 * the YAML or get truncated as a comment. */
function yamlString(value: string): string {
  return JSON.stringify(value.replaceAll("$", "$$$$"));
}

/**
 * Builds a ready-to-use compose.yaml + .env for DockRoute from the wizard
 * state. Every key here maps to an env var or label Dockroute/Dockroute's
 * src/config.ts or src/core/labels.ts actually reads — nothing invented.
 * Secrets are always `${VAR}` placeholders resolved from .env, never baked
 * into the compose file itself.
 */
export function generateFiles(state: WizardState): GeneratedFiles {
  return { compose: generateCompose(state), env: generateEnv(state) };
}

function generateCompose(state: WizardState): string {
  const lines: string[] = ["services:", "  dockroute:"];
  lines.push(`    image: ${yamlString(state.image)}`);
  lines.push("    container_name: dockroute");
  lines.push("    restart: unless-stopped");
  lines.push("    environment:");
  lines.push(`      DOCKROUTE_PROVIDER: ${state.provider}`);
  lines.push(
    `      DOCKROUTE_OWNER_ID: ${yamlString(state.ownerId.trim() || "default")}`,
  );
  lines.push(`      DOCKROUTE_POLICY: ${state.policy}`);
  lines.push(
    `      DOCKROUTE_DELETE_GRACE_SECONDS: ${yamlString(state.deleteGraceSeconds.trim() || "60")}`,
  );
  if (state.txtPrefix.trim() && state.txtPrefix.trim() !== "_dockroute-") {
    lines.push(
      `      DOCKROUTE_TXT_PREFIX: ${yamlString(state.txtPrefix.trim())}`,
    );
  }
  if (state.defaultTarget.trim()) {
    lines.push(
      `      DOCKROUTE_DEFAULT_TARGET: ${yamlString(state.defaultTarget.trim())}`,
    );
  }
  if (state.domainFilter.trim()) {
    lines.push(
      `      DOCKROUTE_DOMAIN_FILTER: ${yamlString(state.domainFilter.trim())}`,
    );
  }
  if (state.provider === "cloudflare") {
    lines.push(`      CLOUDFLARE_API_TOKEN: ${envRef("CLOUDFLARE_API_TOKEN")}`);
    if (state.tunnelEnabled) {
      lines.push(
        `      CLOUDFLARE_ACCOUNT_ID: ${envRef("CLOUDFLARE_ACCOUNT_ID")}`,
      );
      lines.push(
        `      CLOUDFLARE_TUNNEL_ID: ${envRef("CLOUDFLARE_TUNNEL_ID")}`,
      );
    }
  }
  lines.push("    volumes:");
  lines.push("      - /var/run/docker.sock:/var/run/docker.sock:ro");
  if (state.tunnelEnabled) {
    lines.push("    depends_on:");
    lines.push("      - cloudflared");
  }

  if (state.tunnelEnabled) {
    lines.push("");
    lines.push("  cloudflared:");
    lines.push("    image: cloudflare/cloudflared:latest");
    lines.push("    container_name: cloudflared");
    lines.push("    restart: unless-stopped");
    lines.push("    command: tunnel run");
    lines.push("    environment:");
    lines.push(`      TUNNEL_TOKEN: ${envRef("TUNNEL_TOKEN")}`);
  }

  if (state.exampleAppEnabled) {
    lines.push("");
    lines.push("  whoami:");
    lines.push("    image: traefik/whoami");
    lines.push("    container_name: whoami");
    lines.push("    restart: unless-stopped");
    lines.push("    labels:");
    lines.push('      dockroute.enabled: "true"');
    lines.push(
      `      dockroute.hostname: ${yamlString(state.exampleHostname.trim())}`,
    );
    if (state.tunnelEnabled) {
      lines.push(
        `      dockroute.tunnel.service: ${yamlString(state.exampleTunnelService.trim())}`,
      );
    } else {
      if (state.exampleRecordType !== "A") {
        lines.push(`      dockroute.type: ${state.exampleRecordType}`);
      }
      if (state.exampleTarget.trim()) {
        lines.push(
          `      dockroute.target: ${yamlString(state.exampleTarget.trim())}`,
        );
      }
    }
  }

  lines.push("");
  return lines.join("\n");
}

function generateEnv(state: WizardState): string {
  const lines: string[] = [
    "# Secrets for docker compose. Fill these in before `docker compose up`",
    "# and never commit this file.",
  ];
  if (state.provider === "cloudflare") {
    lines.push("");
    lines.push(
      "# Zone -> Zone -> Read, Zone -> DNS -> Edit (+ Account -> Cloudflare Tunnel -> Edit for tunnels)",
    );
    lines.push(`CLOUDFLARE_API_TOKEN=${CHANGE_ME}`);
  }
  if (state.tunnelEnabled) {
    lines.push("");
    lines.push(
      "# Existing Cloudflare Tunnel — DockRoute does not create tunnels.",
    );
    lines.push(`CLOUDFLARE_ACCOUNT_ID=${CHANGE_ME}`);
    lines.push(`CLOUDFLARE_TUNNEL_ID=${CHANGE_ME}`);
    lines.push(`TUNNEL_TOKEN=${CHANGE_ME}`);
  }
  lines.push("");
  return lines.join("\n");
}
