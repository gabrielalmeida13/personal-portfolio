import { fetchPinnedRepos } from "@/lib/github";
import { BentoGrid } from "@/components/bento/BentoGrid";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const repos = await fetchPinnedRepos();
  return <BentoGrid repos={repos} />;
}