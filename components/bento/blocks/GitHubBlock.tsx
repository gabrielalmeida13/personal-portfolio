import { Star, GitFork, ExternalLink } from "lucide-react";
import type { PinnedRepo } from "@/types";

type Props = { repos: PinnedRepo[] };

export function GitHubBlockCollapsed({ repos }: Props) {
  const totalStars = repos.reduce((s, r) => s + r.stargazerCount, 0);

  return (
    <div className="flex h-full flex-col justify-between p-6">
      <div>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-green-400">
          Open Source
        </p>
        <h3 className="font-sans text-lg font-bold leading-snug">
          GitHub
        </h3>
        <p className="mt-1 font-mono text-xs text-foreground-muted">
          {repos.length} pinned repos · {totalStars} stars
        </p>
      </div>
      <div className="flex flex-col gap-2 pt-3">
        {repos.slice(0, 2).map((r) => (
          <div key={r.name} className="flex items-center justify-between gap-2">
            <span className="truncate font-mono text-[10px] text-foreground">{r.name}</span>
            <span className="shrink-0 flex items-center gap-1 font-mono text-[10px] text-foreground-muted">
              <Star size={9} /> {r.stargazerCount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GitHubBlockExpanded({ repos, onClose }: Props & { onClose: () => void }) {
  return (
    <div className="p-8">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-green-400">
        Open Source · GitHub
      </p>
      <h2 className="font-sans text-3xl font-bold leading-tight tracking-tight">
        Pinned Repositories
      </h2>

      <hr className="my-6 border-border" />

      {repos.length === 0 ? (
        <p className="text-sm text-foreground-muted">
          No repos found. Add <code className="font-mono text-xs">GITHUB_TOKEN</code> and{" "}
          <code className="font-mono text-xs">GITHUB_USERNAME</code> to <code className="font-mono text-xs">.env.local</code>.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {repos.map((repo) => (
            <a
              key={repo.name}
              href={repo.homepageUrl ?? repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 rounded-xl border border-border/50 bg-background-secondary p-4 transition-colors hover:border-primary/30"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-sans text-sm font-semibold text-foreground">{repo.name}</span>
                <ExternalLink size={12} className="mt-0.5 shrink-0 text-foreground-muted opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              {repo.description && (
                <p className="line-clamp-2 text-xs leading-relaxed text-foreground-muted">
                  {repo.description}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-foreground-muted">
                {repo.primaryLanguage ? (
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: repo.primaryLanguage.color ?? "#6b7280" }}
                    />
                    {repo.primaryLanguage.name}
                  </span>
                ) : <span />}
                <span className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Star size={10} /> {repo.stargazerCount}</span>
                  <span className="flex items-center gap-1"><GitFork size={10} /> {repo.forkCount}</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
