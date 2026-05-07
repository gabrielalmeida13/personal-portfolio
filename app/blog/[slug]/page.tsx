import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import type { Options as PrettyCodeOptions } from "rehype-pretty-code";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { MDXComponents } from "@/components/blog/MDXComponents";
import { ViewCounter } from "@/components/blog/ViewCounter";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const prettyCodeOptions: PrettyCodeOptions = {
  theme: "github-dark",
  keepBackground: false,
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return {};

  return {
    title: `${post.frontmatter.title} - Gabriel Serens`,
    description: post.frontmatter.summary,
  };
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-24">
      {/* Back link */}
      <Link
        href="/blog"
        className="mb-12 inline-flex items-center gap-1.5 font-mono text-xs text-foreground-muted transition-colors hover:text-foreground"
      >
        &lt;- Back to blog
      </Link>

      {/* Post header */}
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-4">
          <span className="font-mono text-xs text-foreground-muted">
            {formatDate(post.frontmatter.date)}
          </span>
          <ViewCounter slug={slug} />
        </div>
        <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {post.frontmatter.title}
        </h1>
        {post.frontmatter.summary && (
          <p className="mt-3 text-base leading-relaxed text-foreground-muted">
            {post.frontmatter.summary}
          </p>
        )}
      </header>

      <hr className="mb-10 border-border" />

      {/* Post content */}
      <article className="prose-custom">
        <MDXRemote
          source={post.content}
          components={MDXComponents}
          options={{
            mdxOptions: {
              rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
            },
          }}
        />
      </article>
    </main>
  );
}
