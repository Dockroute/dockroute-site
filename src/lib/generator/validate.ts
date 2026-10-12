/**
 * Validation mirroring Dockroute/Dockroute's src/config.ts and
 * src/core/labels.ts, so the generator never accepts a value the real
 * container would reject or silently fall back on.
 */

export const POLICIES = ["sync", "upsert-only", "create-only"] as const;
export type Policy = (typeof POLICIES)[number];

export const RECORD_TYPES = ["A", "AAAA", "CNAME"] as const;
export type RecordType = (typeof RECORD_TYPES)[number];

const TUNNEL_SERVICE_SCHEMES = ["http:", "https:", "tcp:", "ssh:"];

const IPV4_RE =
  /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

export function isIPv4(value: string): boolean {
  return IPV4_RE.test(value);
}

/** No IPv6 parser in the browser, so this borrows the URL parser's bracketed
 * host syntax: only a valid IPv6 literal parses between `[` and `]`. */
export function isIPv6(value: string): boolean {
  try {
    return new URL(`http://[${value}]`).hostname === `[${value.toLowerCase()}]`;
  } catch {
    return false;
  }
}

export function targetRequirement(type: RecordType): string {
  switch (type) {
    case "A":
      return "IPv4 address for an A record";
    case "AAAA":
      return "IPv6 address for an AAAA record";
    case "CNAME":
      return "hostname for a CNAME record (use an A or AAAA record for an IP)";
  }
}

/** Mirrors core's isValidTarget in src/core/labels.ts. */
export function isValidTarget(type: RecordType, target: string): boolean {
  switch (type) {
    case "A":
      return isIPv4(target);
    case "AAAA":
      return isIPv6(target);
    case "CNAME":
      return !isIPv4(target) && !isIPv6(target);
  }
}

export function validateTarget(
  type: RecordType,
  target: string,
): string | undefined {
  const trimmed = target.trim();
  if (!trimmed)
    return "Required — the record's target (or set a default target instead).";
  if (!isValidTarget(type, trimmed)) {
    return `Not a valid ${targetRequirement(type)}.`;
  }
  return undefined;
}

export function validateHostname(hostname: string): string | undefined {
  if (!hostname.trim()) return "Required.";
  return undefined;
}

/** Mirrors core's ttl fallback in src/core/labels.ts (blank is not an error). */
export function validateTtl(raw: string): string | undefined {
  if (!raw.trim()) return undefined;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    return "Must be a number of seconds greater than 0 (blank uses the default of 300).";
  }
  return undefined;
}

/** Mirrors core's secondsFromEnv in src/config.ts — blank means "unset". */
export function validateSeconds(raw: string, min: number): string | undefined {
  if (!raw.trim()) return undefined;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < min) {
    return `Must be a number of seconds >= ${min} (blank uses the default).`;
  }
  return undefined;
}

export function validatePolicy(policy: string): string | undefined {
  if (!POLICIES.includes(policy as Policy)) {
    return `Must be one of: ${POLICIES.join(", ")}.`;
  }
  return undefined;
}

/** Mirrors core's isValidServiceUrl in src/core/labels.ts. */
export function isValidTunnelServiceUrl(value: string): boolean {
  try {
    return TUNNEL_SERVICE_SCHEMES.includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

export function validateTunnelService(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed)
    return "Required — the origin URL cloudflared forwards the hostname to.";
  if (!isValidTunnelServiceUrl(trimmed)) {
    return `Must start with one of: ${TUNNEL_SERVICE_SCHEMES.map((s) => `${s}//`).join(", ")}.`;
  }
  return undefined;
}

export function validateRequired(
  value: string,
  label: string,
): string | undefined {
  return value.trim() ? undefined : `${label} is required.`;
}
