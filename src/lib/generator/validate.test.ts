/// <reference types="bun-types" />
import { describe, expect, test } from "bun:test";
import {
  isIPv4,
  isIPv6,
  isValidTarget,
  isValidTunnelServiceUrl,
  validatePolicy,
  validateSeconds,
  validateTarget,
  validateTtl,
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

  test("rejects IPv4 addresses and hostnames", () => {
    expect(isIPv6("192.0.2.1")).toBe(false);
    expect(isIPv6("origin.example.com")).toBe(false);
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

// Mirrors core's "warns and uses the default when an explicit ttl is
// invalid" — a blank value is not an error, it falls back to the default.
describe("validateTtl", () => {
  test("blank is valid (falls back to the default)", () => {
    expect(validateTtl("")).toBeUndefined();
  });

  test("rejects a non-numeric or non-positive ttl", () => {
    expect(validateTtl("5m")).toBeDefined();
    expect(validateTtl("0")).toBeDefined();
    expect(validateTtl("-1")).toBeDefined();
  });

  test("accepts a positive number", () => {
    expect(validateTtl("60")).toBeUndefined();
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

describe("validatePolicy", () => {
  test("accepts the three core policies", () => {
    expect(validatePolicy("sync")).toBeUndefined();
    expect(validatePolicy("upsert-only")).toBeUndefined();
    expect(validatePolicy("create-only")).toBeUndefined();
  });

  test("rejects anything else", () => {
    expect(validatePolicy("whatever")).toBeDefined();
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
