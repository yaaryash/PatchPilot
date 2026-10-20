
export type GithubRepository = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  private: boolean;
  language: string | null;
  stars: number;
  updated_at: string;
};

export type RepositoryFile = {
  path: string;
  type: "blob" | "tree" | "commit";
  size: number | null;
};

export type RepositoryDetailsData = {
  repository: GithubRepository & {
    default_branch: string;
  };
  files: RepositoryFile[];
  tree_truncated: boolean;
};

const API_BASE_URL = "http://localhost:3000";

export async function getGithubRepositories(): Promise<GithubRepository[]> {
  const response = await fetch(`${API_BASE_URL}/api/github/repos`, {
    credentials: "include",
  });

  if (response.status === 401) {
    throw new Error("Your GitHub session has expired. Please log in again.");
  }

  if (!response.ok) {
    throw new Error("Could not load GitHub repositories. Please try again.");
  }

  const data = (await response.json()) as {
    repositories: GithubRepository[];
  };

  return data.repositories;
}

export async function getGithubRepositoryDetails(
  owner: string,
  repo: string,
): Promise<RepositoryDetailsData> {
  const response = await fetch(
    `${API_BASE_URL}/api/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
    { credentials: "include" },
  );

  if (response.status === 401) {
    throw new Error("Your GitHub session has expired. Please log in again.");
  }

  const data = (await response.json()) as
    | RepositoryDetailsData
    | { message?: string };

  if (!response.ok) {
    throw new Error(
      "message" in data && data.message
        ? data.message
        : "Could not load repository details.",
    );
  }

  return data as RepositoryDetailsData;
}

export type GithubFileContent = {
  name: string;
  path: string;
  size: number;
  content: string;
  html_url: string;
};

export async function getGithubFileContent(
  owner: string,
  repo: string,
  path: string,
): Promise<GithubFileContent> {
  const params = new URLSearchParams({ path });

  const response = await fetch(
    `http://localhost:3000/api/github/repos/${encodeURIComponent(
      owner,
    )}/${encodeURIComponent(repo)}/content?${params.toString()}`,
    {
      credentials: "include",
    },
  );

  const data = (await response.json()) as
    | GithubFileContent
    | { message?: string };

  if (!response.ok) {
    throw new Error(
      "message" in data && data.message
        ? data.message
        : "Could not load file content.",
    );
  }

  return data as GithubFileContent;
}