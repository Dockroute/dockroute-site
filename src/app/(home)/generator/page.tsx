import type { Metadata } from "next";
import { GeneratorWizard } from "@/components/generator/generator-wizard";

export const metadata: Metadata = {
  title: "Compose generator",
  description:
    "Generate a ready-to-use compose.yaml and .env for DockRoute — DNS provider, optional Cloudflare Tunnel, optional example service.",
  alternates: {
    canonical: "/generator",
  },
  openGraph: {
    url: "/generator",
  },
};

export default function GeneratorPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold text-fd-foreground sm:text-3xl">
          Compose generator
        </h1>
        <p className="max-w-2xl text-fd-muted-foreground">
          Answer a few questions and get a <code>compose.yaml</code> +{" "}
          <code>.env</code> tailored to your setup. Everything runs in your
          browser — nothing is sent anywhere, and secrets are always
          placeholders.
        </p>
      </div>
      <GeneratorWizard />
    </main>
  );
}
