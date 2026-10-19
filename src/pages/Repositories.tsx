
import { useMemo, useState } from "react";
import {
  GitBranch,
  Plus,
  Search,
  Code2,
  X,
  Trash2,
  ExternalLink,
  CheckCircle2,
  FolderGit2,
} from "lucide-react";
import "./Repositories.css";
import { Card, Button, Badge } from "../components/ui";

type Repository = {
  id: string;
  name: string;
  owner: string;
  language: string;
  branch: string;
  connected: boolean;
};

const initialRepositories: Repository[] = [
  {
    id: "repo-1",
    name: "payment-service",
    owner: "demo-workspace",
    language: "TypeScript",
    branch: "main",
    connected: true,
  },
  {
    id: "repo-2",
    name: "user-dashboard",
    owner: "demo-workspace",
    language: "JavaScript",
    branch: "main",
    connected: true,
  },
  {
    id: "repo-3",
    name: "ml-pipeline",
    owner: "demo-workspace",
    language: "Python",
    branch: "develop",
    connected: false,
  },
];

export default function Repositories() {
  const [repositories, setRepositories] =
    useState<Repository[]>(initialRepositories);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [formError, setFormError] = useState("");

  const languages = [
    "All",
    ...new Set(repositories.map((repo) => repo.language)),
  ];

  const filteredRepositories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return repositories.filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(query) ||
        repo.owner.toLowerCase().includes(query);

      const matchesLanguage =
        language === "All" || repo.language === language;

      return matchesSearch && matchesLanguage;
    });
  }, [repositories, search, language]);

  function handleConnectRepository() {
    const value = repoUrl.trim().replace(/\/+$/, "");
    const match = value.match(
      /^(?:https?:\/\/)?github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/i
    );

    if (!match) {
      setFormError(
        "Enter a valid GitHub URL, e.g. https://github.com/owner/repository"
      );
      return;
    }

    const owner = match[1];
    const name = match[2];

    const alreadyExists = repositories.some(
      (repo) =>
        repo.owner.toLowerCase() === owner.toLowerCase() &&
        repo.name.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) {
      setFormError("This repository is already in the list.");
      return;
    }

    setRepositories((current) => [
      ...current,
      {
        id: `${owner}-${name}-${Date.now()}`,
        owner,
        name,
        language: "Unknown",
        branch: "main",
        connected: false,
      },
    ]);

    setRepoUrl("");
    setFormError("");
    setIsModalOpen(false);
    setSearch("");
    setLanguage("All");
  }

  function handleRemoveRepository(id: string) {
    const confirmed = window.confirm(
      "Remove this repository from the demo list?"
    );

    if (confirmed) {
      setRepositories((current) =>
        current.filter((repo) => repo.id !== id)
      );
    }
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR CODEBASES</p>
          <h1>Repositories</h1>
          <p className="muted">
            Manage codebases for your repair workflows.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={17} />
          Connect repository
        </Button>
      </div>

      <div className="development-banner">
        <span className="development-dot" />
        <strong>DEMO MODE</strong>
        <span>Repositories are stored in temporary UI state only.</span>
      </div>

      <div className="repository-toolbar">
        <label className="repository-search">
          <Search size={17} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search repositories..."
            aria-label="Search repositories"
          />
        </label>

        <label className="repository-filter">
          <span className="muted">Language</span>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            aria-label="Filter by language"
          >
            {languages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="repository-results-heading">
        <div>
          <h2>Connected codebases</h2>
          <p className="muted">
            {filteredRepositories.length} of {repositories.length} repositories
          </p>
        </div>
        <Badge>{repositories.length} repositories</Badge>
      </div>

      {filteredRepositories.length === 0 ? (
        <Card className="repository-empty">
          <span className="empty-icon">
            <FolderGit2 size={25} />
          </span>
          <h2>
            {repositories.length === 0
              ? "No repositories yet"
              : "No matching repositories"}
          </h2>
          <p className="muted">
            {repositories.length === 0
              ? "Connect a GitHub repository to add it to this demo list."
              : "Try another search term or language filter."}
          </p>
          {repositories.length === 0 && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={16} />
              Connect repository
            </Button>
          )}
        </Card>
      ) : (
        <div className="repository-grid">
          {filteredRepositories.map((repo) => (
            <Card key={repo.id} className="repository-card">
              <div className="repository-card-top">
                <span className="repository-icon">
                  <GitBranch  size={22} />
                </span>
                <Badge tone={repo.connected ? "success" : "neutral"}>
                  {repo.connected ? "Connected (demo)" : "Not connected"}
                </Badge>
              </div>

              <div className="repository-card-title">
                <h3>{repo.name}</h3>
                <p className="muted">{repo.owner}</p>
              </div>

              <div className="repository-meta">
                <span>
                  <Code2 size={15} />
                  {repo.language}
                </span>
                <span>
                  <GitBranch size={15} />
                  {repo.branch}
                </span>
              </div>

              <div className="repository-card-footer">
                <span className="repository-demo-note">
                  <CheckCircle2 size={14} />
                  Demo repository
                </span>
                <Button
                  variant="secondary"
                  onClick={() => handleRemoveRepository(repo.id)}
                  aria-label={`Remove ${repo.name}`}
                >
                  <Trash2 size={15} />
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div
          className="repository-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsModalOpen(false);
              setFormError("");
            }
          }}
        >
          <section
            className="repository-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="connect-repository-title"
          >
            <div className="repository-modal-heading">
              <div>
                <p className="eyebrow">GITHUB</p>
                <h2 id="connect-repository-title">Connect repository</h2>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => {
                  setIsModalOpen(false);
                  setFormError("");
                }}
                aria-label="Close dialog"
              >
                <X size={19} />
              </button>
            </div>

            <p className="muted">
              Add a public GitHub repository URL to the local demo list.
              This does not authorize GitHub access.
            </p>

            <label className="repository-url-label" htmlFor="repository-url">
              GitHub repository URL
            </label>
            <input
              id="repository-url"
              className="repository-url-input"
              value={repoUrl}
              onChange={(event) => {
                setRepoUrl(event.target.value);
                setFormError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleConnectRepository();
                }
              }}
              placeholder="https://github.com/owner/repository"
              autoFocus
            />

            {formError && (
              <p className="repository-form-error" role="alert">
                {formError}
              </p>
            )}

            <div className="repository-modal-actions">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setRepoUrl("");
                  setFormError("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleConnectRepository}>
                <Plus size={16} />
                Add to demo
                <ExternalLink size={14} />
              </Button>
            </div>

            <p className="repository-modal-footnote">
              Demo only · No repository files are fetched or changed.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
