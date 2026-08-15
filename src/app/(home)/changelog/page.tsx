import type { Metadata } from "next";
import { formatDate } from "@/lib/format";
import { getReleases } from "@/lib/github";
import { markdownToHtml } from "@/lib/markdown";
import { stripVersionHeading } from "@/lib/release-notes";
import { repoLinks } from "@/lib/shared";

// Matches the GitHub data cache window in lib/github.ts.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Every DockRoute release, newest first — pulled straight from the repository's release notes.",
  alternates: {
    canonical: "/changelog",
  },
  openGraph: {
    url: "/changelog",
  },
};

export default async function ChangelogPage() {
  const releases = await getReleases(20);
  const entries = releases
    ? await Promise.all(
        releases.map(async (release, index) => ({
          release,
          html: await markdownToHtml(stripVersionHeading(release.body)),
          // Releases come back newest first, so the previous version is next.
          previousTag: releases[index + 1]?.tag ?? null,
        })),
      )
    : null;

  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-3xl px-6 py-16 md:py-20">
        <p className="font-mono text-sm font-medium tracking-wide text-teal-deep uppercase dark:text-teal">
          Changelog
        </p>
        <h1 className="mt-3 text-4xl font-extrabold">
          Every release, in order.
        </h1>
        <p className="mt-4 text-fd-muted-foreground">
          Versions are cut by CI on every merge to <code>main</code>, so this
          list mirrors the{" "}
          <a
            href={repoLinks.releases}
            className="font-medium text-teal-deep hover:underline dark:text-teal"
          >
            releases on GitHub
          </a>{" "}
          exactly.
        </p>

        {entries && entries.length > 0 ? (
          <ol className="mt-12">
            {entries.map(({ release, html, previousTag }, index) => {
              const date = formatDate(release.publishedAt);

              return (
                <li
                  key={release.tag}
                  className="relative border-l border-fd-border pb-10 pl-8 last:border-transparent last:pb-0"
                >
                  <span
                    aria-hidden
                    className="absolute top-1.5 -left-[7px] grid size-3.5 place-items-center rounded-full bg-coral"
                  >
                    <span className="size-1.5 rounded-full bg-offwhite" />
                  </span>

                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 className="font-mono text-xl font-semibold">
                      {release.tag}
                    </h2>
                    {date ? (
                      <time
                        dateTime={release.publishedAt}
                        title={date.absolute}
                        className="text-sm text-fd-muted-foreground"
                      >
                        {date.absolute}
                      </time>
                    ) : null}
                    {index === 0 ? (
                      <span className="rounded-full bg-teal/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-teal-deep uppercase dark:text-teal">
                        latest
                      </span>
                    ) : null}
                    {release.prerelease ? (
                      <span className="rounded-full bg-fd-muted px-2.5 py-0.5 font-mono text-[11px] font-medium text-fd-muted-foreground uppercase">
                        pre-release
                      </span>
                    ) : null}
                  </div>

                  {html ? (
                    <div
                      className="prose mt-4 [&_h2]:mt-4 [&_h2]:text-lg [&_h3]:text-base"
                      // biome-ignore lint/security/noDangerouslySetInnerHtml: release notes are authored by maintainers and rendered through remark-rehype without allowDangerousHtml, so raw HTML never reaches the page
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  ) : (
                    <p className="mt-4 text-sm text-fd-muted-foreground">
                      No notes were published for this release.
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                    <a
                      href={release.url}
                      className="text-teal-deep hover:underline dark:text-teal"
                    >
                      Release notes →
                    </a>
                    {previousTag ? (
                      <a
                        href={`${repoLinks.home}/compare/${previousTag}...${release.tag}`}
                        className="text-fd-muted-foreground hover:text-fd-foreground"
                      >
                        Compare with {previousTag} →
                      </a>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="mt-12 rounded-xl border border-fd-border bg-fd-card p-6">
            <p className="text-sm text-fd-muted-foreground">
              The release feed could not be reached. The full history is always
              available on GitHub.
            </p>
            <a
              href={repoLinks.releases}
              className="mt-4 inline-block font-semibold text-teal-deep hover:underline dark:text-teal"
            >
              Releases on GitHub →
            </a>
          </div>
        )}
      </section>
    </main>
  );
}
