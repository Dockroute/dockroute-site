import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { gitConfig } from "@/lib/shared";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
  },
};

const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

export default function HomePage() {
  return (
    <main className="flex-1">
      <Hero />
      <RouteStory />
      <HowItWorks />
      <SafetyModel />
      <ConfigExample />
      <UseCases />
      <OpenSource />
      <FinalCta />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* faint harbor-chart grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-fd-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-fd-border) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 0%, black 40%, transparent 90%)",
        }}
      />
      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-6 pt-16 pb-20 md:grid-cols-[1.1fr_1fr] md:items-center md:pt-24">
        <div>
          <p className="font-mono text-sm font-medium tracking-wide text-teal-deep uppercase dark:text-teal">
            External-DNS for plain Docker hosts
          </p>
          <h1 className="mt-4 text-4xl font-extrabold text-balance md:text-5xl">
            DNS records that follow your containers.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-fd-muted-foreground">
            DockRoute watches your Docker containers, reads{" "}
            <code className="font-mono text-sm text-fd-foreground">
              dockroute.*
            </code>{" "}
            labels and keeps your DNS provider in sync. Your Compose file is the
            source of truth. No Kubernetes required.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/docs/quickstart"
              className="rounded-lg bg-fd-primary px-5 py-2.5 font-semibold text-fd-primary-foreground transition-colors hover:bg-teal-deep dark:hover:bg-[#39bcae]"
            >
              Get Started
            </Link>
            <a
              href={githubUrl}
              className="rounded-lg border border-fd-border bg-fd-card px-5 py-2.5 font-semibold transition-colors hover:bg-fd-accent"
            >
              View on GitHub
            </a>
          </div>
          <p className="mt-6 font-mono text-xs text-fd-muted-foreground">
            MIT licensed · single container · Cloudflare DNS + Tunnel today,
            more providers on the route
          </p>
        </div>
        <HeroPanel />
      </div>
    </section>
  );
}

function HeroPanel() {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-sm">
        <div className="flex items-center justify-between border-b border-fd-border px-4 py-2.5">
          <span className="font-mono text-xs text-fd-muted-foreground">
            compose.yaml
          </span>
          <span className="rounded-full bg-teal/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-teal-deep dark:text-teal">
            watching
          </span>
        </div>
        <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
          <code>
            <Y k="services" />
            {"\n  "}
            <Y k="whoami" />
            {"\n    "}
            <Y k="image" v="traefik/whoami" />
            {"\n    "}
            <Y k="labels" />
            {"\n      "}
            <Y k="dockroute.enabled" v='"true"' />
            {"\n      "}
            <Y k="dockroute.hostname" v='"whoami.example.com"' />
            {"\n      "}
            <Y k="dockroute.tunnel.service" v='"http://whoami:80"' />
          </code>
        </pre>
        <div className="border-t border-fd-border bg-fd-muted/60 px-4 py-3 font-mono text-[12px] leading-relaxed text-fd-muted-foreground">
          <p>
            <span className="text-teal-deep dark:text-teal">create</span> CNAME
            whoami.example.com → tunnel
          </p>
          <p>
            <span className="text-teal-deep dark:text-teal">create</span> TXT
            _dockroute-cname.whoami.example.com
          </p>
          <p>
            <span className="text-coral">●</span> route published — in sync
          </p>
        </div>
      </div>
      <Image
        src="/brand/dockroute-mascot-pip.webp"
        alt="Pip, the DockRoute mascot — a puffin harbor pilot"
        width={150}
        height={150}
        priority
        className="absolute -right-4 -bottom-10 hidden w-32 md:block lg:w-36"
      />
    </div>
  );
}

function Y({ k, v }: { k: string; v?: string }) {
  return (
    <>
      <span className="text-teal-deep dark:text-teal">{k}</span>
      <span className="text-fd-muted-foreground">:</span>
      {v ? <span className="text-fd-foreground"> {v}</span> : null}
    </>
  );
}

const routeStops = [
  { label: "Docker Compose", detail: "your labels" },
  { label: "DockRoute", detail: "watch + reconcile" },
  { label: "DNS provider", detail: "records + routes" },
  { label: "Your domain", detail: "live" },
];

function RouteStory() {
  return (
    <section className="border-y border-fd-border bg-fd-card/50">
      <div className="reveal mx-auto w-full max-w-6xl px-6 py-14">
        <h2 className="sr-only">The route</h2>
        {/* Desktop: harbor chart */}
        <svg
          viewBox="0 0 960 150"
          role="img"
          aria-label="Route from Docker Compose through DockRoute to your DNS provider and live domain"
          className="hidden w-full md:block"
        >
          <title>From Docker Compose to live DNS</title>
          {/* route line */}
          <path
            d="M 120 60 C 220 60 240 60 330 60 S 500 60 590 60 S 770 60 840 60"
            fill="none"
            strokeWidth="2"
            className="route-flow stroke-teal"
          />
          {routeStops.map((stop, i) => {
            const x = 120 + i * 240;
            const isEnd = i === routeStops.length - 1;
            return (
              <g key={stop.label}>
                {isEnd ? (
                  <>
                    <circle cx={x} cy={60} r={13} className="fill-coral" />
                    <circle cx={x} cy={60} r={5} className="fill-offwhite" />
                  </>
                ) : i === 0 ? (
                  <rect
                    x={x - 12}
                    y={48}
                    width={24}
                    height={24}
                    rx={4}
                    className="fill-navy dark:fill-offwhite"
                  />
                ) : i === 1 ? (
                  <>
                    <circle
                      cx={x}
                      cy={60}
                      r={30}
                      className="fill-offwhite stroke-fd-border"
                      strokeWidth={1}
                    />
                    <image
                      href="/brand/dockroute-icon-128.png"
                      x={x - 22}
                      y={38}
                      width={44}
                      height={44}
                    />
                  </>
                ) : (
                  <>
                    <circle cx={x} cy={60} r={11} className="fill-coral" />
                    <circle cx={x} cy={60} r={4.5} className="fill-offwhite" />
                  </>
                )}
                <text
                  x={x}
                  y={102}
                  textAnchor="middle"
                  className="fill-fd-foreground font-sans text-[15px] font-bold"
                >
                  {stop.label}
                </text>
                <text
                  x={x}
                  y={124}
                  textAnchor="middle"
                  className="fill-fd-muted-foreground font-mono text-[11px]"
                >
                  {stop.detail}
                </text>
              </g>
            );
          })}
        </svg>
        {/* Mobile: vertical route */}
        <ol className="md:hidden">
          {routeStops.map((stop, i) => (
            <li key={stop.label} className="relative pb-8 pl-8 last:pb-0">
              {i < routeStops.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-3 left-[7px] h-full w-0.5 bg-teal"
                />
              )}
              {i === 1 ? (
                <img
                  src="/brand/dockroute-icon-128.png"
                  alt=""
                  aria-hidden
                  className="absolute top-0 -left-2 size-8 rounded-full border border-fd-border bg-offwhite p-0.5"
                />
              ) : (
                <span
                  aria-hidden
                  className="absolute top-1.5 left-0 grid size-4 place-items-center rounded-full bg-coral"
                >
                  <span className="size-1.5 rounded-full bg-offwhite" />
                </span>
              )}
              <p className="font-bold">{stop.label}</p>
              <p className="font-mono text-xs text-fd-muted-foreground">
                {stop.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const steps = [
  {
    n: "01",
    title: "Label your containers",
    body: "Add dockroute.enabled and dockroute.hostname to any service in your Compose file. That label is the whole contract — no sidecar config, no templates.",
  },
  {
    n: "02",
    title: "DockRoute watches Docker",
    body: "It streams container lifecycle events — start, die, stop, destroy — from the Docker socket, with a periodic full resync as a safety net. Desired state always comes from what is actually running.",
  },
  {
    n: "03",
    title: "Records reconcile",
    body: "The provider diffs desired against actual and creates, updates or removes records — plus Cloudflare Tunnel ingress routes when you ask for them.",
  },
];

function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="reveal">
        <p className="font-mono text-sm font-medium tracking-wide text-teal-deep uppercase dark:text-teal">
          How it works
        </p>
        <h2 className="mt-3 text-3xl font-extrabold">
          From Docker labels to live DNS.
        </h2>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {steps.map((step) => (
          <article
            key={step.n}
            className="reveal rounded-xl border border-fd-border bg-fd-card p-6"
          >
            <p className="font-mono text-sm font-semibold text-coral">
              {step.n}
            </p>
            <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">
              {step.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

const safetyRules = [
  {
    status: "owned",
    title: "Ownership is proven, not assumed",
    body: "Every record DockRoute creates gets a companion TXT record carrying its owner id — the same registry model as Kubernetes ExternalDNS.",
  },
  {
    status: "conflict → skipped",
    title: "Unowned records are untouchable",
    body: "A record without proof of ownership is never modified, deleted or adopted. Conflicts are logged and skipped, under every policy.",
  },
  {
    status: "sync policy",
    title: "Cleanup only when you allow it",
    body: "Orphaned records are removed only under the default sync policy, and only when ownership is proven. upsert-only and create-only never delete.",
  },
  {
    status: "preserved",
    title: "Your tunnel rules stay yours",
    body: "Tunnel ingress rules DockRoute did not create are preserved verbatim, in their original order, ahead of managed rules.",
  },
];

function SafetyModel() {
  return (
    <section className="border-y border-fd-border bg-fd-card/50">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="reveal max-w-2xl">
          <p className="font-mono text-sm font-medium tracking-wide text-teal-deep uppercase dark:text-teal">
            Safety model
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-balance">
            It never alters what it cannot prove it manages.
          </h2>
          <p className="mt-4 text-fd-muted-foreground">
            Your DNS zone usually holds more than your containers. DockRoute
            treats everything it did not create as someone else&apos;s —
            including records made by another DockRoute instance.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {safetyRules.map((rule) => (
            <article
              key={rule.title}
              className="reveal rounded-xl border border-fd-border bg-fd-card p-6"
            >
              <span className="rounded-full bg-fd-muted px-2.5 py-1 font-mono text-[11px] font-medium text-fd-muted-foreground uppercase">
                {rule.status}
              </span>
              <h3 className="mt-3 text-lg font-bold">{rule.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">
                {rule.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConfigExample() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
      <div className="reveal">
        <p className="font-mono text-sm font-medium tracking-wide text-teal-deep uppercase dark:text-teal">
          Configuration
        </p>
        <h2 className="mt-3 text-3xl font-extrabold">
          One more service in your stack.
        </h2>
        <p className="mt-4 text-fd-muted-foreground">
          DockRoute runs as a single container next to your services. Point it
          at the Docker socket, pick a provider, and it starts reconciling.
          Start with the{" "}
          <code className="font-mono text-sm text-fd-foreground">log</code>{" "}
          provider for a zero-credential dry run.
        </p>
        <Link
          href="/docs/configuration/environment"
          className="mt-6 inline-block font-semibold text-teal-deep hover:underline dark:text-teal"
        >
          Full configuration reference →
        </Link>
      </div>
      <div className="reveal overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-sm">
        <div className="border-b border-fd-border px-4 py-2.5 font-mono text-xs text-fd-muted-foreground">
          compose.yaml
        </div>
        <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
          <code>
            <Y k="services" />
            {"\n  "}
            <Y k="dockroute" />
            {"\n    "}
            <Y k="image" v="ghcr.io/dockroute/dockroute:latest" />
            {"\n    "}
            <Y k="environment" />
            {"\n      "}
            <Y k="DOCKROUTE_PROVIDER" v="cloudflare" />
            {"\n      "}
            <Y k="DOCKROUTE_OWNER_ID" v="home-lab" />
            {"\n      "}
            <Y k="CLOUDFLARE_API_TOKEN" v={"${CLOUDFLARE_API_TOKEN}"} />
            {"\n    "}
            <Y k="volumes" />
            {"\n      "}
            <span className="text-fd-muted-foreground">- </span>
            <span className="text-fd-foreground">
              /var/run/docker.sock:/var/run/docker.sock:ro
            </span>
          </code>
        </pre>
      </div>
    </section>
  );
}

const audiences = [
  {
    eyebrow: "Homelab",
    title: "Expose services without the ritual",
    body: "Publish through an existing Cloudflare Tunnel with one label — no port forwarding, no dynamic-DNS scripts, no hand-edited zone files. Take a service down and its records follow.",
  },
  {
    eyebrow: "Small teams",
    title: "Compose in production, safely",
    body: "Sync policies, per-instance owner ids and a domain allowlist let several stacks share one zone without stepping on each other — or on the records you manage by hand.",
  },
];

function UseCases() {
  return (
    <section className="border-y border-fd-border bg-fd-card/50">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <h2 className="reveal text-3xl font-extrabold text-balance">
          Simple enough for a homelab. Reliable enough for your SaaS.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {audiences.map((a) => (
            <article
              key={a.eyebrow}
              className="reveal rounded-xl border border-fd-border bg-fd-card p-6"
            >
              <p className="font-mono text-xs font-medium tracking-wide text-coral uppercase">
                {a.eyebrow}
              </p>
              <h3 className="mt-2 text-lg font-bold">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">
                {a.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function OpenSource() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="reveal grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <p className="font-mono text-sm font-medium tracking-wide text-teal-deep uppercase dark:text-teal">
            Open source
          </p>
          <h2 className="mt-3 text-3xl font-extrabold">
            MIT licensed, built in the open.
          </h2>
          <p className="mt-4 text-fd-muted-foreground">
            DockRoute borrows its safety model from Kubernetes ExternalDNS and
            applies it where most homelabs actually live: plain Docker hosts.
            Providers are pluggable behind one interface — Cloudflare works end
            to end today, and the planner, ownership rules and tests are
            provider-agnostic so new ones slot in cleanly.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={githubUrl}
              className="rounded-lg border border-fd-border bg-fd-card px-5 py-2.5 font-semibold transition-colors hover:bg-fd-accent"
            >
              Star on GitHub
            </a>
            <Link
              href="/docs/contributing"
              className="rounded-lg px-5 py-2.5 font-semibold text-teal-deep hover:underline dark:text-teal"
            >
              Add a provider →
            </Link>
          </div>
        </div>
        <div className="rounded-xl border border-fd-border bg-fd-card p-6">
          <p className="font-mono text-xs font-medium tracking-wide text-coral uppercase">
            Eating our own dog food
          </p>
          <p className="mt-3 text-sm leading-relaxed text-fd-muted-foreground">
            This site runs from a Docker Compose stack in a homelab, and the DNS
            record you used to reach it was published by DockRoute itself — from
            a{" "}
            <code className="font-mono text-fd-foreground">
              dockroute.hostname
            </code>{" "}
            label on the site&apos;s own container.
          </p>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-navy dark:bg-navy-harbor">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 text-center">
        <h2 className="text-3xl font-extrabold text-balance text-offwhite">
          Your services know where to go.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[#a7bbc5]">
          Start with the dry-run provider — no credentials, no risk — and see
          the records DockRoute computes before it ever touches a zone.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/docs/quickstart"
            className="rounded-lg bg-teal px-5 py-2.5 font-semibold text-ink transition-colors hover:bg-[#39bcae]"
          >
            Get Started
          </Link>
          <a
            href={githubUrl}
            className="rounded-lg border border-[#294d67] px-5 py-2.5 font-semibold text-offwhite transition-colors hover:bg-[#163b5c]"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
