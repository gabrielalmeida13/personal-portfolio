import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPost, BlogFrontmatter, BlogPostWithContent } from "@/types";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

function parseFrontmatter(raw: matter.GrayMatterFile<string>): BlogFrontmatter {
  return {
    title: String(raw.data.title ?? "Untitled"),
    date: String(raw.data.date ?? ""),
    summary: String(raw.data.summary ?? ""),
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"));

  const posts: BlogPost[] = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = matter(fs.readFileSync(path.join(BLOG_DIR, filename), "utf8"));
    return { slug, frontmatter: parseFrontmatter(raw) };
  });

  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPostWithContent | null {
  const filepath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filepath)) return null;

  const raw = matter(fs.readFileSync(filepath, "utf8"));

  return {
    slug,
    frontmatter: parseFrontmatter(raw),
    content: raw.content,
  };
}
