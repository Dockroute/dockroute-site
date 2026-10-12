import { describe, expect, test } from "bun:test";
import { generateFiles } from "./compose";
import { DEFAULT_STATE } from "./state";

// Values a user types must survive into compose.yaml as the exact string
// they entered — not truncated at a YAML comment, not interpolated as a
// compose `${VAR}` reference, and not left in an invalid document. A broken
// owner id is a security bug: two hosts whose ids both get mangled to the
// same text can end up sharing one DockRoute TXT ownership record.
describe("generateFiles — user input is quoted safely in compose.yaml", () => {
  test("a `#` does not start a YAML comment and truncate the value", () => {
    const { compose } = generateFiles({ ...DEFAULT_STATE, ownerId: "host #1" });
    expect(compose).toContain('DOCKROUTE_OWNER_ID: "host #1"');
    expect(compose).not.toContain("DOCKROUTE_OWNER_ID: host");
  });

  test("a `$` is escaped so compose doesn't try to interpolate it", () => {
    const { compose } = generateFiles({ ...DEFAULT_STATE, ownerId: "a$b" });
    expect(compose).toContain('DOCKROUTE_OWNER_ID: "a$$b"');
  });

  test("a `: ` does not get parsed as a nested mapping", () => {
    const { compose } = generateFiles({ ...DEFAULT_STATE, ownerId: "x: y" });
    expect(compose).toContain('DOCKROUTE_OWNER_ID: "x: y"');
  });

  test("quotes and backslashes in a value round-trip as valid YAML", () => {
    const { compose } = generateFiles({
      ...DEFAULT_STATE,
      ownerId: 'say "hi"\\now',
    });
    expect(compose).toContain('DOCKROUTE_OWNER_ID: "say \\"hi\\"\\\\now"');
  });

  test("same escaping applies to every other free-text field", () => {
    const { compose } = generateFiles({
      ...DEFAULT_STATE,
      image: "registry.example.com/dockroute:1.0 #pinned",
      txtPrefix: "_dr#",
      defaultTarget: "target: 1",
      domainFilter: "a.example.com, b#.example.com",
      exampleHostname: "whoami #1.example.com",
      exampleTarget: "198.51.100.1 # primary",
    });
    expect(compose).toContain(
      'image: "registry.example.com/dockroute:1.0 #pinned"',
    );
    expect(compose).toContain('DOCKROUTE_TXT_PREFIX: "_dr#"');
    expect(compose).toContain('DOCKROUTE_DEFAULT_TARGET: "target: 1"');
    expect(compose).toContain(
      'DOCKROUTE_DOMAIN_FILTER: "a.example.com, b#.example.com"',
    );
    expect(compose).toContain('dockroute.hostname: "whoami #1.example.com"');
    expect(compose).toContain('dockroute.target: "198.51.100.1 # primary"');
  });

  test("tunnel origin is quoted the same way", () => {
    const { compose } = generateFiles({
      ...DEFAULT_STATE,
      provider: "cloudflare",
      tunnelEnabled: true,
      exampleTunnelService: "http://whoami:80 #primary",
    });
    expect(compose).toContain(
      'dockroute.tunnel.service: "http://whoami:80 #primary"',
    );
  });
});

describe("generateFiles — scenario (a): Cloudflare DNS only", () => {
  test("produces a dockroute + example service with an A record", () => {
    const { compose, env } = generateFiles({
      ...DEFAULT_STATE,
      provider: "cloudflare",
    });
    expect(compose).toContain("DOCKROUTE_PROVIDER: cloudflare");
    expect(compose).toContain(`CLOUDFLARE_API_TOKEN: \${CLOUDFLARE_API_TOKEN}`);
    expect(compose).not.toContain("cloudflared:");
    expect(env).toContain("CLOUDFLARE_API_TOKEN=CHANGE_ME");
    expect(env).not.toContain("TUNNEL_TOKEN");
  });
});

describe("generateFiles — scenario (b): Cloudflare + cloudflared tunnel", () => {
  test("adds the cloudflared service and tunnel env placeholders", () => {
    const { compose, env } = generateFiles({
      ...DEFAULT_STATE,
      provider: "cloudflare",
      tunnelEnabled: true,
    });
    expect(compose).toContain("cloudflared:");
    expect(compose).toContain(
      `CLOUDFLARE_ACCOUNT_ID: \${CLOUDFLARE_ACCOUNT_ID}`,
    );
    expect(compose).toContain(`CLOUDFLARE_TUNNEL_ID: \${CLOUDFLARE_TUNNEL_ID}`);
    expect(compose).toContain(
      `dockroute.tunnel.service: "${DEFAULT_STATE.exampleTunnelService}"`,
    );
    expect(env).toContain("CLOUDFLARE_ACCOUNT_ID=CHANGE_ME");
    expect(env).toContain("CLOUDFLARE_TUNNEL_ID=CHANGE_ME");
    expect(env).toContain("TUNNEL_TOKEN=CHANGE_ME");
  });
});
