
export type Repository = {
  id: string;
  name: string;
  branch: string;
  language: string;
};

// DEVELOPMENT ONLY — fictional repositories.
// Replace with repository API data when backend integration is ready.
export const mockRepositories: Repository[] = [
  {
    id: "repo-1",
    name: "payment-service",
    branch: "main",
    language: "TypeScript",
  },
  {
    id: "repo-2",
    name: "user-api",
    branch: "main",
    language: "Node.js",
  },
  {
    id: "repo-3",
    name: "inventory-service",
    branch: "develop",
    language: "Python",
  },
];
