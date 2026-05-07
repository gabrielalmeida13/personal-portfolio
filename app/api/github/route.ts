import { NextResponse } from "next/server";
import { fetchPinnedRepos } from "@/lib/github";

export const revalidate = 3600;

export async function GET() {
  const repos = await fetchPinnedRepos();

  return NextResponse.json(
    { repos },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    }
  );
}
