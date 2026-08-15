import { CircleDot, GitFork, Scale, Star } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatCount } from "@/lib/format";
import { getRepoStats } from "@/lib/github";
import { repoLinks } from "@/lib/shared";

function plural(count: number, one: string, many: string) {
  return count === 1 ? one : many;
}

/** Live repository numbers as four linked tiles. Renders nothing without data. */
export async function RepoStats({ className }: { className?: string }) {
  const stats = await getRepoStats();
  if (!stats) return null;

  const tiles = [
    {
      icon: Star,
      value: formatCount(stats.stars),
      label: plural(stats.stars, "star", "stars"),
      href: repoLinks.stars,
    },
    {
      icon: GitFork,
      value: formatCount(stats.forks),
      label: plural(stats.forks, "fork", "forks"),
      href: repoLinks.forks,
    },
    {
      icon: CircleDot,
      value: formatCount(stats.openIssues),
      label: plural(stats.openIssues, "open issue", "open issues"),
      href: repoLinks.issues,
    },
    {
      icon: Scale,
      value: stats.license ?? "MIT",
      label: "license",
      href: repoLinks.license,
    },
  ];

  return (
    <div
      className={cn(
        "not-prose grid grid-cols-2 gap-3 sm:grid-cols-4",
        className,
      )}
    >
      {tiles.map((tile) => (
        <a
          key={tile.label}
          href={tile.href}
          className="rounded-xl border border-fd-border bg-fd-card p-4 transition-colors hover:border-teal hover:bg-fd-accent"
        >
          <tile.icon
            aria-hidden
            className="size-4 text-teal-deep dark:text-teal"
          />
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">
            {tile.value}
          </p>
          <p className="font-mono text-[11px] tracking-wide text-fd-muted-foreground uppercase">
            {tile.label}
          </p>
        </a>
      ))}
    </div>
  );
}
