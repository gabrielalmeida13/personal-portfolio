"use client";

import { motion } from "framer-motion";
import { Star, GitFork, ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";
import type { PinnedRepo } from "@/types";

type Props = {
  repos: PinnedRepo[];
};

function EmptyState() {
  return (
    <p className="text-sm text-foreground-muted">
      No projects to display. Add a{" "}
      <code className="font-mono text-xs">GITHUB_TOKEN</code> and{" "}
      <code className="font-mono text-xs">GITHUB_USERNAME</code> to{" "}
      <code className="font-mono text-xs">.env.local</code> to load pinned
      repos.
    </p>
  );
}

type CardProps = {
  repo: PinnedRepo;
};

function ProjectCard({ repo }: CardProps) {
  return (
    <motion.a
      href={repo.homepageUrl ?? repo.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${repo.name}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "group flex flex-col gap-4 rounded-lg border border-border bg-card p-6",
        "hover:border-primary/60 hover:shadow-[0_0_24px_rgba(59,130,246,0.08)]",
        "transition-colors duration-200"
      )}
    >
      {/* Name + external link icon */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-sans text-base font-semibold leading-snug text-foreground">
          {repo.name}
        </h3>
        <ExternalLink
          size={14}
          className="mt-0.5 shrink-0 text-foreground-muted opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        />
      </div>

      {/* Description */}
      <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-foreground-muted">
        {repo.description ?? "No description provided."}
      </p>

      {/* Footer: language + stats */}
      <div className="flex items-center justify-between gap-3 text-xs text-foreground-muted">
        {repo.primaryLanguage ? (
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: repo.primaryLanguage.color ?? "#6b7280" }}
            />
            {repo.primaryLanguage.name}
          </span>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Star size={12} />
            {repo.stargazerCount}
          </span>
          <span className="flex items-center gap-1">
            <GitFork size={12} />
            {repo.forkCount}
          </span>
        </div>
      </div>
    </motion.a>
  );
}

export function ProjectsGrid({ repos }: Props) {
  const sectionRef = useScrollReveal<HTMLElement>({
    selector: "[data-reveal]",
    stagger: 0.1,
    start: "top 82%",
  });

  return (
    <section id="projects" ref={sectionRef} className="py-24">
      <div className="mx-auto max-w-6xl px-4">

        {/* --- Header --- */}
        <div data-reveal className="mb-16">
          <p className="mb-2 font-mono text-xs tracking-widest uppercase text-primary">
            Projects
          </p>
          <h2 className="font-sans text-3xl font-bold tracking-tight sm:text-4xl">
            What I have built
          </h2>
        </div>

        {/* --- Grid or empty state --- */}
        {repos.length === 0 ? (
          <div data-reveal>
            <EmptyState />
          </div>
        ) : (
          <div
            data-reveal
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {repos.map((repo) => (
              <ProjectCard key={repo.name} repo={repo} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
