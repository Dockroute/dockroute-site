import type { Policy, RecordType } from "./validate";

export type Provider = "log" | "cloudflare";

export interface WizardState {
  image: string;
  ownerId: string;
  txtPrefix: string;
  policy: Policy;
  deleteGraceSeconds: string;
  defaultTarget: string;
  domainFilter: string;
  provider: Provider;
  tunnelEnabled: boolean;
  cloudflareAccountId: string;
  cloudflareTunnelId: string;
  exampleAppEnabled: boolean;
  exampleHostname: string;
  exampleRecordType: RecordType;
  exampleTarget: string;
  exampleTunnelService: string;
}

export const DEFAULT_STATE: WizardState = {
  image: "ghcr.io/dockroute/dockroute:latest",
  ownerId: "default",
  txtPrefix: "_dockroute-",
  policy: "sync",
  deleteGraceSeconds: "60",
  defaultTarget: "",
  domainFilter: "",
  provider: "log",
  tunnelEnabled: false,
  cloudflareAccountId: "",
  cloudflareTunnelId: "",
  exampleAppEnabled: true,
  exampleHostname: "whoami.example.com",
  exampleRecordType: "A",
  exampleTarget: "",
  exampleTunnelService: "http://whoami:80",
};
