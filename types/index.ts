export type PinnedRepoLanguage = {
  name: string;
  color: string | null;
};

export type PinnedRepo = {
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: PinnedRepoLanguage | null;
};

export type GitHubApiResponse = {
  repos: PinnedRepo[];
};

export type BlogFrontmatter = {
  title: string;
  date: string;
  summary: string;
};

export type BlogPost = {
  slug: string;
  frontmatter: BlogFrontmatter;
};

export type BlogPostWithContent = BlogPost & {
  content: string;
};

export type NowPlayingData = {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumArt: string | null;
  songUrl: string;
} | null;
