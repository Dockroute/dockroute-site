import { Tag } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import { getLatestRelease } from "@/lib/github";

/** Compact "v0.2.0 · released 3 days ago" chip linking to the release notes. */
export async function ReleaseBadge({ className }: { className?: string }) {
  const release = await getLatestRelease();
  if (!release) return null;

  const date = formatDate(release.publishedAt);

  return (
    <a
      href={release.url}
      className={cn(
        "not-prose inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-3 py-1 font-mono text-xs no-underline transition-colors hover:border-teal hover:bg-fd-accent",
        className,
      )}
    >
      <Tag aria-hidden className="size-3.5 text-coral" />
      <span className="font-medium text-teal-deep dark:text-teal">
        {release.tag}
      </span>
      {date ? (
        <time
          dateTime={release.publishedAt}
          title={date.absolute}
          className="text-fd-muted-foreground"
        >
          released {date.relative}
        </time>
      ) : null}
    </a>
  );
}
