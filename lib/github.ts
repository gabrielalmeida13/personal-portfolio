import type { PinnedRepo } from "@/types";

const GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

const PINNED_REPOS_QUERY = `
  query PinnedRepos($login: String!) {
    user(login: $login) {
      pinnedItems(first: 6, types: [REPOSITORY]) {
        nodes {
          ... on Repository {
            name
            description
            url
            homepageUrl
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
          }
        }
      }
    }
  }
`;

type GraphQLResponse = {
  data?: {
    user?: {
      pinnedItems?: {
        nodes?: PinnedRepo[];
      };
    };
  };
  errors?: { message: string }[];
};

export async function fetchPinnedRepos(): Promise<PinnedRepo[]> {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;

  if (!token || !username) {
    return [];
  }

  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: PINNED_REPOS_QUERY,
      variables: { login: username },
    }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.error(`[github] API responded with status ${res.status}`);
    return [];
  }

  const json: GraphQLResponse = await res.json();

  if (json.errors?.length) {
    console.error("[github] GraphQL errors:", json.errors);
    return [];
  }

  return json.data?.user?.pinnedItems?.nodes ?? [];
}
