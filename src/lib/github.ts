import { gitConfig } from "./shared";

/**
 * Live repository facts (stars, forks, releases) for the site's social layer.
 *
 * Every function here returns `null` instead of throwing. These calls run
 * during `next build` — in CI and inside the Docker image build — so a rate
 * limit, a network hiccup or an offline build must degrade to "no number
 * shown", never to a failed build. Callers render a fallback for `null`.
 */

const apiBase = process.env.GITHUB_API_BASE ?? "https://api.github.com";
const repo = `${gitConfig.user}/${gitConfig.repo}`;

/**
 * These numbers move slowly, and an hour of staleness is invisible to a
 * reader. It also keeps us at a handful of requests per hour against the
 * anonymous limit of 60/hour per IP.
 */
export const githubRevalidate = 3600;

async function api<T>(path: string): Promise<T | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    // GitHub rejects requests without a User-Agent.
    "User-Agent": `${gitConfig.repo}-site`,
  };
  // Optional: lifts the rate limit to 5000/hour. Runtime env only — never a
  // build arg, or the token would be baked into the published image.
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`${apiBase}${path}`, {
      headers,
      signal: AbortSignal.timeout(5000),
      next: { revalidate: githubRevalidate },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export type RepoStats = {
  stars: number;
  forks: number;
  openIssues: number;
  license: string | null;
};

type RepoPayload = {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  license: { spdx_id: string | null } | null;
};

export async function getRepoStats(): Promise<RepoStats | null> {
  const [repoData, issueSearch] = await Promise.all([
    api<RepoPayload>(`/repos/${repo}`),
    // `open_issues_count` on the repo endpoint counts pull requests as issues;
    // search is the only endpoint that reports issues alone.
    api<{ total_count: number }>(
      `/search/issues?q=${encodeURIComponent(
        `repo:${repo} is:issue is:open`,
      )}&per_page=1&advanced_search=true`,
    ),
  ]);
  if (!repoData) return null;

  return {
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    openIssues: issueSearch?.total_count ?? repoData.open_issues_count,
    license: repoData.license?.spdx_id ?? null,
  };
}

export type Release = {
  tag: string;
  name: string;
  url: string;
  publishedAt: string;
  body: string;
  prerelease: boolean;
};

type ReleasePayload = {
  tag_name: string;
  name: string | null;
  html_url: string;
  published_at: string | null;
  body: string | null;
  prerelease: boolean;
  draft: boolean;
};

function toRelease(payload: ReleasePayload): Release {
  return {
    tag: payload.tag_name,
    name: payload.name || payload.tag_name,
    url: payload.html_url,
    publishedAt: payload.published_at ?? "",
    body: payload.body ?? "",
    prerelease: payload.prerelease,
  };
}

/** The newest published release. Drafts and prereleases are excluded by the API. */
export async function getLatestRelease(): Promise<Release | null> {
  const payload = await api<ReleasePayload>(`/repos/${repo}/releases/latest`);
  return payload ? toRelease(payload) : null;
}

export async function getReleases(limit = 10): Promise<Release[] | null> {
  const payload = await api<ReleasePayload[]>(
    `/repos/${repo}/releases?per_page=${limit}`,
  );
  if (!payload) return null;
  return payload.filter((release) => !release.draft).map(toRelease);
}
