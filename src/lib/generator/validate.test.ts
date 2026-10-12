import { describe, expect, test } from "bun:test";
import {
  isIPv4,
  isIPv6,
  isValidTarget,
  isValidTunnelServiceUrl,
  validateHostname,
  validateSeconds,
  validateTarget,
  validateTunnelService,
} from "./validate";

// Target cases mirrored from Dockroute/Dockroute's src/core/labels.test.ts
// ("validates targets against their record type" / "skips targets that do
// not match their record type"), so the generator never accepts a target the
// real container would reject.
describe("isValidTarget", () => {
  test("accepts a matching target per record type", () => {
    expect(isValidTarget("A", "192.168.1.10")).toBe(true);
    expect(isValidTarget("AAAA", "2001:db8::1")).toBe(true);
    expect(isValidTarget("CNAME", "origin.example.com")).toBe(true);
  });

  test("rejects a target that does not match its record type", () => {
    expect(isValidTarget("A", "2001:db8::1")).toBe(false);
    expect(isValidTarget("AAAA", "192.0.2.1")).toBe(false);
    expect(isValidTarget("CNAME", "192.0.2.1")).toBe(false);
    expect(isValidTarget("CNAME", "2001:db8::1")).toBe(false);
  });
});

describe("isIPv4", () => {
  test("accepts dotted-decimal addresses", () => {
    expect(isIPv4("0.0.0.0")).toBe(true);
    expect(isIPv4("255.255.255.255")).toBe(true);
  });

  test("rejects out-of-range octets and non-addresses", () => {
    expect(isIPv4("256.0.0.1")).toBe(false);
    expect(isIPv4("1.2.3")).toBe(false);
    expect(isIPv4("origin.example.com")).toBe(false);
  });
});

describe("isIPv6", () => {
  test("accepts compressed and full addresses", () => {
    expect(isIPv6("2001:db8::1")).toBe(true);
    expect(isIPv6("::1")).toBe(true);
  });

  test("accepts addresses the URL parser normalizes to a different form", () => {
    expect(isIPv6("2001:0db8::1")).toBe(true);
    expect(isIPv6("2001:db8:0:0:0:0:0:1")).toBe(true);
    expect(isIPv6("::ffff:1.2.3.4")).toBe(true);
  });

  test("rejects IPv4 addresses and hostnames", () => {
    expect(isIPv6("192.0.2.1")).toBe(false);
    expect(isIPv6("origin.example.com")).toBe(false);
  });

  // A `]` in the input closes the bracket early, so the URL parser treats
  // the remainder as path/query/fragment instead of failing to parse —
  // these must not be accepted as IPv6 literals.
  test("rejects values that close the bracket early with trailing path/query/fragment", () => {
    expect(isIPv6("::1]/x")).toBe(false);
    expect(isIPv6("::1]?a")).toBe(false);
    expect(isIPv6("::1]#x")).toBe(false);
    expect(isIPv6("2001:db8::1]/../evil")).toBe(false);
  });
});

describe("isValidTarget with URL-normalized IPv6 forms", () => {
  test("accepts them for AAAA", () => {
    expect(isValidTarget("AAAA", "2001:0db8::1")).toBe(true);
    expect(isValidTarget("AAAA", "2001:db8:0:0:0:0:0:1")).toBe(true);
    expect(isValidTarget("AAAA", "::ffff:1.2.3.4")).toBe(true);
  });

  test("rejects them for CNAME", () => {
    expect(isValidTarget("CNAME", "2001:0db8::1")).toBe(false);
    expect(isValidTarget("CNAME", "2001:db8:0:0:0:0:0:1")).toBe(false);
    expect(isValidTarget("CNAME", "::ffff:1.2.3.4")).toBe(false);
  });
});

describe("validateTarget", () => {
  test("requires a non-blank target", () => {
    expect(validateTarget("A", "")).toBeDefined();
    expect(validateTarget("A", "   ")).toBeDefined();
  });

  test("passes a valid target", () => {
    expect(validateTarget("A", "10.0.0.1")).toBeUndefined();
  });
});

describe("validateHostname", () => {
  test("requires a non-blank hostname", () => {
    expect(validateHostname("")).toBeDefined();
    expect(validateHostname("   ")).toBeDefined();
  });

  test("passes a non-blank hostname", () => {
    expect(validateHostname("whoami.example.com")).toBeUndefined();
  });
});

// Mirrors core's secondsFromEnv in src/config.ts.
describe("validateSeconds", () => {
  test("blank is valid regardless of min", () => {
    expect(validateSeconds("", 1)).toBeUndefined();
    expect(validateSeconds("", 0)).toBeUndefined();
  });

  test("enforces the inclusive minimum", () => {
    expect(validateSeconds("0", 1)).toBeDefined();
    expect(validateSeconds("0", 0)).toBeUndefined();
  });

  test("rejects non-numeric values", () => {
    expect(validateSeconds("soon", 0)).toBeDefined();
  });
});

// Mirrors core's isValidServiceUrl in src/core/labels.ts.
describe("isValidTunnelServiceUrl / validateTunnelService", () => {
  test("accepts the schemes cloudflared supports", () => {
    expect(isValidTunnelServiceUrl("http://whoami:80")).toBe(true);
    expect(isValidTunnelServiceUrl("https://whoami:443")).toBe(true);
    expect(isValidTunnelServiceUrl("tcp://whoami:5432")).toBe(true);
    expect(isValidTunnelServiceUrl("ssh://whoami:22")).toBe(true);
  });

  test("rejects an unsupported scheme or a malformed URL", () => {
    expect(isValidTunnelServiceUrl("whoami:80")).toBe(false);
    expect(isValidTunnelServiceUrl("ftp://whoami:21")).toBe(false);
  });

  test("validateTunnelService requires a non-blank, valid URL", () => {
    expect(validateTunnelService("")).toBeDefined();
    expect(validateTunnelService("whoami:80")).toBeDefined();
    expect(validateTunnelService("http://whoami:80")).toBeUndefined();
  });
});
