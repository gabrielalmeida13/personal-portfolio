import { fetchPinnedRepos } from "@/lib/github";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";

export async function Projects() {
  const repos = await fetchPinnedRepos();
  return <ProjectsGrid repos={repos} />;
}
