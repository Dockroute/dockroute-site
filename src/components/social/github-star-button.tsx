import { Star } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatCount } from "@/lib/format";
import { getRepoStats } from "@/lib/github";
import { repoLinks } from "@/lib/shared";

type Variant = "nav" | "surface" | "onNavy";

const shell: Record<Variant, string> = {
  nav: "gap-1.5 rounded-md border border-fd-border px-2.5 py-1 text-sm font-medium hover:bg-fd-accent",
  surface:
    "gap-2 rounded-lg border border-fd-border bg-fd-card px-5 py-2.5 font-semibold hover:bg-fd-accent",
  onNavy:
    "gap-2 rounded-lg border border-[#294d67] px-5 py-2.5 font-semibold text-offwhite hover:bg-[#163b5c]",
};

const rule: Record<Variant, string> = {
  nav: "border-fd-border",
  surface: "border-fd-border",
  onNavy: "border-[#294d67]",
};

/**
 * GitHub has no URL that stars a repo in one click, so this links to the repo
 * like every other project site does. The count is the point: it is social
 * proof, and it renders as a plain button when the API is unavailable.
 */
export async function GitHubStarButton({
  variant = "surface",
  label = "Star on GitHub",
  className,
}: {
  variant?: Variant;
  label?: string;
  className?: string;
}) {
  const stats = await getRepoStats();

  return (
    <a
      href={repoLinks.home}
      className={cn(
        "inline-flex items-center transition-colors",
        shell[variant],
        className,
      )}
    >
      <Star aria-hidden className={variant === "nav" ? "size-4" : "size-4.5"} />
      {label}
      {stats ? (
        <span
          className={cn(
            "ml-1 border-l pl-2 font-mono tabular-nums",
            rule[variant],
          )}
        >
          {formatCount(stats.stars)}
          <span className="sr-only"> stars on GitHub</span>
        </span>
      ) : null}
    </a>
  );
}
