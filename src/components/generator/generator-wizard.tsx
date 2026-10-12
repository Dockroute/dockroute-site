"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { generateFiles } from "@/lib/generator/compose";
import { DEFAULT_STATE, type WizardState } from "@/lib/generator/state";
import {
  isValidTarget,
  POLICIES,
  RECORD_TYPES,
  validateHostname,
  validateSeconds,
  validateTarget,
  validateTunnelService,
} from "@/lib/generator/validate";
import { CodeBlock } from "./code-block";
import { SelectField, TextField, ToggleField } from "./fields";

const STEPS = [
  { id: "basic", title: "Basic" },
  { id: "provider", title: "Provider" },
  { id: "tunnel", title: "Cloudflare Tunnel" },
  { id: "example", title: "Example app" },
  { id: "review", title: "Review" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

export function GeneratorWizard() {
  const [state, setState] = useState<WizardState>(DEFAULT_STATE);
  const [step, setStep] = useState<StepId>("basic");

  const patch = (next: Partial<WizardState>) =>
    setState((s) => ({ ...s, ...next }));

  const files = useMemo(() => generateFiles(state), [state]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[14rem_1fr_18rem]">
      <Sidebar step={step} onStep={setStep} state={state} />
      <div className="min-w-0 space-y-6">
        {step === "basic" && <BasicStep state={state} patch={patch} />}
        {step === "provider" && <ProviderStep state={state} patch={patch} />}
        {step === "tunnel" && <TunnelStep state={state} patch={patch} />}
        {step === "example" && <ExampleStep state={state} patch={patch} />}
        {step === "review" && <ReviewStep state={state} files={files} />}
        <StepNav step={step} onStep={setStep} />
      </div>
      <Summary state={state} />
    </div>
  );
}

function Sidebar({
  step,
  onStep,
  state,
}: {
  step: StepId;
  onStep: (step: StepId) => void;
  state: WizardState;
}) {
  return (
    <nav className="h-fit space-y-1 lg:sticky lg:top-20">
      {STEPS.map((s, i) => {
        const disabled = s.id === "tunnel" && state.provider !== "cloudflare";
        return (
          <button
            key={s.id}
            type="button"
            disabled={disabled}
            onClick={() => onStep(s.id)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
              step === s.id
                ? "bg-fd-primary text-fd-primary-foreground font-semibold"
                : disabled
                  ? "cursor-not-allowed text-fd-muted-foreground/50"
                  : "text-fd-foreground hover:bg-fd-accent",
            )}
          >
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full border text-xs",
                step === s.id
                  ? "border-fd-primary-foreground"
                  : "border-fd-border",
              )}
            >
              {i + 1}
            </span>
            {s.title}
          </button>
        );
      })}
    </nav>
  );
}

function StepNav({
  step,
  onStep,
}: {
  step: StepId;
  onStep: (step: StepId) => void;
}) {
  const index = STEPS.findIndex((s) => s.id === step);
  const prev = STEPS[index - 1];
  const next = STEPS[index + 1];
  const button =
    "rounded-lg border border-fd-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-fd-accent";
  return (
    <div className="flex justify-between border-t border-fd-border pt-4">
      {prev ? (
        <button
          type="button"
          onClick={() => onStep(prev.id)}
          className={button}
        >
          ← {prev.title}
        </button>
      ) : (
        <span />
      )}
      {next ? (
        <button
          type="button"
          onClick={() => onStep(next.id)}
          className={button}
        >
          {next.title} →
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-xl border border-fd-border bg-fd-card p-5">
      <h2 className="text-lg font-semibold text-fd-foreground">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function BasicStep({
  state,
  patch,
}: {
  state: WizardState;
  patch: (next: Partial<WizardState>) => void;
}) {
  return (
    <Panel title="Basic">
      <TextField
        label="Image"
        value={state.image}
        onChange={(image) => patch({ image })}
        monospace
      />
      <TextField
        label="Owner id"
        value={state.ownerId}
        onChange={(ownerId) => patch({ ownerId })}
        help="DOCKROUTE_OWNER_ID — lets several DockRoute instances share a zone safely. Give every host a unique id."
      />
      <SelectField
        label="Sync policy"
        value={state.policy}
        onChange={(policy) => patch({ policy })}
        options={POLICIES.map((p) => ({ value: p, label: p }))}
        help="sync = create/update/delete owned records; upsert-only = never delete; create-only = never update or delete."
      />
      <TextField
        label="Delete grace period (seconds)"
        value={state.deleteGraceSeconds}
        onChange={(deleteGraceSeconds) => patch({ deleteGraceSeconds })}
        error={validateSeconds(state.deleteGraceSeconds, 0)}
        help="DOCKROUTE_DELETE_GRACE_SECONDS — seconds a record must stay gone before it's deleted. 0 deletes at once."
      />
      <TextField
        label="TXT prefix"
        value={state.txtPrefix}
        onChange={(txtPrefix) => patch({ txtPrefix })}
        help="DOCKROUTE_TXT_PREFIX — ownership TXT record name prefix."
        monospace
      />
      <TextField
        label="Default target (optional)"
        value={state.defaultTarget}
        onChange={(defaultTarget) => patch({ defaultTarget })}
        placeholder="203.0.113.10"
        help="DOCKROUTE_DEFAULT_TARGET — fallback record target for containers that omit dockroute.target."
      />
      <TextField
        label="Domain filter (optional)"
        value={state.domainFilter}
        onChange={(domainFilter) => patch({ domainFilter })}
        placeholder="example.com, example.net"
        help="DOCKROUTE_DOMAIN_FILTER — comma-separated zone allowlist. Empty = every zone the token can see."
      />
    </Panel>
  );
}

function ProviderStep({
  state,
  patch,
}: {
  state: WizardState;
  patch: (next: Partial<WizardState>) => void;
}) {
  return (
    <Panel title="Provider">
      <SelectField
        label="DNS provider"
        value={state.provider}
        onChange={(provider) =>
          patch({
            provider,
            tunnelEnabled: provider === "cloudflare" && state.tunnelEnabled,
          })
        }
        options={[
          {
            value: "log",
            label: "log — dry run, prints the desired state, no credentials",
          },
          {
            value: "cloudflare",
            label: "cloudflare — manages real DNS records (and tunnels)",
          },
        ]}
      />
      {state.provider === "cloudflare" ? (
        <p className="rounded-lg bg-fd-accent p-3 text-sm text-fd-accent-foreground">
          Needs an API token with <strong>Zone → Zone → Read</strong> and{" "}
          <strong>Zone → DNS → Edit</strong> (plus{" "}
          <strong>Account → Cloudflare Tunnel → Edit</strong> if you turn on
          tunnel publishing next). The generated <code>.env</code> has a{" "}
          <code>CLOUDFLARE_API_TOKEN</code> placeholder — paste your real token
          in there, never in the compose file.
        </p>
      ) : (
        <p className="rounded-lg bg-fd-accent p-3 text-sm text-fd-accent-foreground">
          The log provider runs the whole pipeline and prints the desired state
          instead of touching a zone — the safest way to check your labels
          first.
        </p>
      )}
    </Panel>
  );
}

function TunnelStep({
  state,
  patch,
}: {
  state: WizardState;
  patch: (next: Partial<WizardState>) => void;
}) {
  if (state.provider !== "cloudflare") {
    return (
      <Panel title="Cloudflare Tunnel">
        <p className="text-sm text-fd-muted-foreground">
          Only available with the Cloudflare provider — go back to the Provider
          step and switch to Cloudflare first.
        </p>
      </Panel>
    );
  }
  return (
    <Panel title="Cloudflare Tunnel">
      <ToggleField
        label="Include a cloudflared service"
        checked={state.tunnelEnabled}
        onChange={(tunnelEnabled) => patch({ tunnelEnabled })}
        help="DockRoute does not create tunnels or move traffic — it manages the tunnel's public-hostname ingress rules and the CNAME records pointing at it. You need an existing Cloudflare Tunnel and run cloudflared yourself, typically in the same Compose stack."
      />
      {state.tunnelEnabled ? (
        <p className="rounded-lg bg-fd-accent p-3 text-sm text-fd-accent-foreground">
          The generated files add a <code>cloudflared</code> service and{" "}
          <code>CLOUDFLARE_ACCOUNT_ID</code>, <code>CLOUDFLARE_TUNNEL_ID</code>{" "}
          and <code>TUNNEL_TOKEN</code> placeholders in <code>.env</code>. Fill
          them in with your existing tunnel's details.
        </p>
      ) : null}
    </Panel>
  );
}

function ExampleStep({
  state,
  patch,
}: {
  state: WizardState;
  patch: (next: Partial<WizardState>) => void;
}) {
  const tunnelMode = state.provider === "cloudflare" && state.tunnelEnabled;
  return (
    <Panel title="Example app">
      <ToggleField
        label="Add an example service with DockRoute labels"
        checked={state.exampleAppEnabled}
        onChange={(exampleAppEnabled) => patch({ exampleAppEnabled })}
        help="A traefik/whoami container labeled so DockRoute picks it up — delete it once you've swapped in your real services."
      />
      {state.exampleAppEnabled ? (
        <>
          <TextField
            label="Hostname"
            value={state.exampleHostname}
            onChange={(exampleHostname) => patch({ exampleHostname })}
            error={validateHostname(state.exampleHostname)}
            monospace
          />
          {tunnelMode ? (
            <TextField
              label="Tunnel origin URL"
              value={state.exampleTunnelService}
              onChange={(exampleTunnelService) =>
                patch({ exampleTunnelService })
              }
              error={validateTunnelService(state.exampleTunnelService)}
              help="dockroute.tunnel.service — how cloudflared reaches the service inside the Docker network."
              monospace
            />
          ) : (
            <>
              <SelectField
                label="Record type"
                value={state.exampleRecordType}
                onChange={(exampleRecordType) => patch({ exampleRecordType })}
                options={RECORD_TYPES.map((t) => ({ value: t, label: t }))}
              />
              <TextField
                label={
                  state.defaultTarget.trim()
                    ? "Target (optional — falls back to the default target)"
                    : "Target"
                }
                value={state.exampleTarget}
                onChange={(exampleTarget) => patch({ exampleTarget })}
                error={
                  state.defaultTarget.trim()
                    ? undefined
                    : validateTarget(
                        state.exampleRecordType,
                        state.exampleTarget,
                      )
                }
                monospace
              />
            </>
          )}
        </>
      ) : null}
    </Panel>
  );
}

function exampleTargetWarning(state: WizardState): string | undefined {
  if (!state.exampleAppEnabled) return undefined;
  const tunnelMode = state.provider === "cloudflare" && state.tunnelEnabled;
  if (tunnelMode) return undefined;
  const effectiveTarget =
    state.exampleTarget.trim() || state.defaultTarget.trim();
  if (
    effectiveTarget &&
    isValidTarget(state.exampleRecordType, effectiveTarget)
  )
    return undefined;
  return `The example app has no valid ${state.exampleRecordType} target (target and default target are both empty, or the default target doesn't match ${state.exampleRecordType}) — DockRoute will silently skip it without creating a record. Go back to the Example app step and fix the target.`;
}

function ReviewStep({
  state,
  files,
}: {
  state: WizardState;
  files: { compose: string; env: string };
}) {
  const warning = exampleTargetWarning(state);
  return (
    <Panel title="Review">
      <p className="text-sm text-fd-muted-foreground">
        Everything below is generated in your browser — nothing is sent
        anywhere. Secrets are <code>CHANGE_ME</code> placeholders; fill them in
        before <code>docker compose up</code>.
      </p>
      {warning ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
          {warning}
        </p>
      ) : null}
      <CodeBlock
        title="compose.yaml"
        filename="compose.yaml"
        content={files.compose}
      />
      <CodeBlock title=".env" filename=".env" content={files.env} />
    </Panel>
  );
}

function Summary({ state }: { state: WizardState }) {
  const items: string[] = [
    `Image: ${state.image}`,
    `Owner id: ${state.ownerId || "default"}`,
    `Policy: ${state.policy}`,
    `Provider: ${state.provider}`,
  ];
  if (state.provider === "cloudflare" && state.tunnelEnabled) {
    items.push("Cloudflare Tunnel: included");
  }
  if (state.exampleAppEnabled) {
    items.push(`Example app: ${state.exampleHostname || "(hostname not set)"}`);
  }
  return (
    <aside className="h-fit space-y-3 rounded-xl border border-fd-border bg-fd-card p-4 lg:sticky lg:top-20">
      <h3 className="text-sm font-semibold text-fd-foreground">Summary</h3>
      <ul className="space-y-1.5 text-sm text-fd-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}
