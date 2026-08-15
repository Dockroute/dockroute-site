import Link from "next/link";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import { getLatestRelease } from "@/lib/github";
import { releaseExcerpt } from "@/lib/release-notes";

/** The current version, when it shipped, and the two ways to read about it. */
export async function LatestReleaseCard({ className }: { className?: string }) {
  const release = await getLatestRelease();
  if (!release) return null;

  const date = formatDate(release.publishedAt);
  const excerpt = releaseExcerpt(release.body);

  return (
    <div
      className={cn(
        "rounded-xl border border-fd-border bg-fd-card p-6",
        className,
      )}
    >
      <p className="font-mono text-xs font-medium tracking-wide text-coral uppercase">
        Latest release
      </p>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="font-mono text-2xl font-semibold">{release.tag}</p>
        {date ? (
          <time
            dateTime={release.publishedAt}
            title={date.absolute}
            className="text-sm text-fd-muted-foreground"
          >
            released {date.relative}
          </time>
        ) : null}
      </div>
      {excerpt ? (
        <p className="mt-3 text-sm leading-relaxed text-fd-muted-foreground">
          {excerpt}
        </p>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
        <a
          href={release.url}
          className="text-teal-deep hover:underline dark:text-teal"
        >
          Release notes →
        </a>
        <Link
          href="/changelog"
          className="text-teal-deep hover:underline dark:text-teal"
        >
          Full changelog →
        </Link>
      </div>
    </div>
  );
}
