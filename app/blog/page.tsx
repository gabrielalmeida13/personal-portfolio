import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog - Gabriel Serens",
  description: "Writing on software engineering, systems design, and developer tooling.",
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto max-w-3xl px-4 py-24">
      <header className="mb-16">
        <p className="mb-2 font-mono text-xs tracking-widest uppercase text-primary">
          Blog
        </p>
        <h1 className="font-sans text-3xl font-bold tracking-tight sm:text-4xl">
          Writing
        </h1>
        <p className="mt-3 text-base text-foreground-muted">
          Thoughts on software engineering, systems design, and developer tooling.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-sm text-foreground-muted">No posts published yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-1 py-6 hover:no-underline"
              >
                <span className="font-mono text-xs text-foreground-muted">
                  {formatDate(post.frontmatter.date)}
                </span>
                <span className="font-sans text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                  {post.frontmatter.title}
                </span>
                <span className="text-sm leading-relaxed text-foreground-muted">
                  {post.frontmatter.summary}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
