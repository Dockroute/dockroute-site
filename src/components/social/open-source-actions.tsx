import { CircleDot, GitFork, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { repoLinks } from "@/lib/shared";
import { GitHubStarButton } from "./github-star-button";

const button =
  "inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-card px-5 py-2.5 font-semibold transition-colors hover:bg-fd-accent";

/** The four things people actually do with an open-source project. */
export function OpenSourceActions({ className }: { className?: string }) {
  return (
    <div className={cn("not-prose flex flex-col gap-4", className)}>
      <div className="flex flex-wrap gap-3">
        <GitHubStarButton />
        <a href={repoLinks.fork} className={button}>
          <GitFork aria-hidden className="size-4.5" />
          Fork
        </a>
        <a href={repoLinks.newIssue} className={button}>
          <CircleDot aria-hidden className="size-4.5" />
          Open an issue
        </a>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <Link
          href="/docs/contributing"
          className="font-semibold text-teal-deep hover:underline dark:text-teal"
        >
          Contributing guide →
        </Link>
        <a
          href={repoLinks.security}
          className="inline-flex items-center gap-1.5 text-fd-muted-foreground hover:text-fd-foreground"
        >
          <ShieldCheck aria-hidden className="size-4" />
          Report a vulnerability
        </a>
      </div>
    </div>
  );
}
