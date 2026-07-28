import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
      <Image
        src="/brand/dockroute-mascot-pip.webp"
        alt="Pip, the DockRoute mascot, looking for a route"
        width={180}
        height={180}
      />
      <p className="font-mono text-sm font-medium tracking-wide text-coral uppercase">
        404 — no route to host
      </p>
      <h1 className="text-3xl font-extrabold">
        This page isn&apos;t on the chart.
      </h1>
      <p className="max-w-md text-fd-muted-foreground">
        The address resolved, but nothing is docked here. Head back to the
        harbor or browse the documentation.
      </p>
      <div className="mt-2 flex gap-3">
        <Link
          href="/"
          className="rounded-lg bg-fd-primary px-5 py-2.5 font-semibold text-fd-primary-foreground"
        >
          Back home
        </Link>
        <Link
          href="/docs"
          className="rounded-lg border border-fd-border px-5 py-2.5 font-semibold"
        >
          Documentation
        </Link>
      </div>
    </main>
  );
}
