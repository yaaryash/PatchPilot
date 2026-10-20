import { useEffect, useMemo, useState } from "react";
import {
  GitBranch,
  Search,
  Code2,
  FolderGit2,
  Star,
  RefreshCw,
  LockKeyhole,
  Globe,
} from "lucide-react";

import "./Repositories.css";
import { Card, Button, Badge } from "../components/ui";
import { getGithubRepositories, type GithubRepository } from "../data/github";
import { Link } from "react-router-dom";

export default function Repositories() {
  const [repositories, setRepositories] = useState<GithubRepository[]>([]);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRepositories() {
    setLoading(true);
    setError("");

    try {
      const data = await getGithubRepositories();
      setRepositories(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load GitHub repositories.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRepositories();
  }, []);

  const languages = useMemo(
    () => [
      "All",
      ...new Set(
        repositories
          .map((repo) => repo.language)
          .filter((value): value is string => Boolean(value)),
      ),
    ],
    [repositories],
  );

  const filteredRepositories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return repositories.filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(query) ||
        repo.full_name.toLowerCase().includes(query) ||
        (repo.description ?? "").toLowerCase().includes(query);

      const matchesLanguage = language === "All" || repo.language === language;

      return matchesSearch && matchesLanguage;
    });
  }, [repositories, search, language]);

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR CODEBASES</p>
          <h1>Repositories</h1>
          <p className="muted">Browse and manage your GitHub repositories.</p>
        </div>

        <Button
          variant="secondary"
          onClick={() => void loadRepositories()}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>

      <div className="development-banner">
        <span className="development-dot" />
        <strong>GITHUB CONNECTED</strong>
        <span>
          Repository data is fetched from your authenticated GitHub account.
        </span>
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
            disabled={loading || Boolean(error)}
          />
        </label>

        <label className="repository-filter">
          <span className="muted">Language</span>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            aria-label="Filter by language"
            disabled={loading || Boolean(error)}
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
          <h2>GitHub repositories</h2>
          <p className="muted">
            {loading
              ? "Loading repositories..."
              : error
                ? "Repositories could not be loaded"
                : `${filteredRepositories.length} of ${repositories.length} repositories`}
          </p>
        </div>

        <Badge>{repositories.length} repositories</Badge>
      </div>

      {loading ? (
        <Card className="repository-empty">
          <RefreshCw size={25} />
          <h2>Loading repositories</h2>
          <p className="muted">
            Fetching repositories from GitHub. Please wait.
          </p>
        </Card>
      ) : error ? (
        <Card className="repository-empty">
          <span className="empty-icon">
            <FolderGit2 size={25} />
          </span>
          <h2>Could not load repositories</h2>
          <p className="muted">{error}</p>
          <Button onClick={() => void loadRepositories()}>
            <RefreshCw size={16} />
            Try again
          </Button>
        </Card>
      ) : filteredRepositories.length === 0 ? (
        <Card className="repository-empty">
          <span className="empty-icon">
            <FolderGit2 size={25} />
          </span>
          <h2>
            {repositories.length === 0
              ? "No repositories found"
              : "No matching repositories"}
          </h2>
          <p className="muted">
            {repositories.length === 0
              ? "No repositories were returned by GitHub for this account."
              : "Try another search term or language filter."}
          </p>
          {repositories.length === 0 && (
            <Button variant="secondary" onClick={() => void loadRepositories()}>
              <RefreshCw size={16} />
              Refresh
            </Button>
          )}
        </Card>
      ) : (
        <div className="repository-grid">
          {filteredRepositories.map((repo) => (
            <Card key={repo.id} className="repository-card">
              <div className="repository-card-top">
                <span className="repository-icon">
                  <GitBranch size={22} />
                </span>

                <Badge tone={repo.private ? "neutral" : "success"}>
                  {repo.private ? (
                    <>
                      <LockKeyhole size={12} /> Private
                    </>
                  ) : (
                    <>
                      <Globe size={12} /> Public
                    </>
                  )}
                </Badge>
              </div>

              <div className="repository-card-title">
                <h3>{repo.name}</h3>
                <p className="muted">{repo.full_name}</p>
              </div>

              <p className="muted repository-description">
                {repo.description || "No description provided."}
              </p>

              <div className="repository-meta">
                <span>
                  <Code2 size={15} />
                  {repo.language || "Unknown"}
                </span>

                <span>
                  <Star size={15} />
                  {repo.stars}
                </span>
              </div>

              <div className="repository-card-footer">
                <span className="repository-demo-note">
                  Updated {new Date(repo.updated_at).toLocaleDateString()}
                </span>

                <Link
                  className="repository-external-link"
                  to={`/repositories/${encodeURIComponent(repo.full_name.split("/")[0])}/${encodeURIComponent(repo.name)}`}
                >
                  <FolderGit2 size={15} />
                  View details
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
