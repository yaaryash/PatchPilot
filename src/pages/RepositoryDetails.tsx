
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  File,
  Folder,
  GitBranch,
  LockKeyhole,
  RefreshCw,
  Star,
  Globe,
  X,
  ChevronRight,
  Home,
} from "lucide-react";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markdown";

import { Badge, Button, Card } from "../components/ui";
import {
  getGithubFileContent,
  getGithubRepositoryDetails,
  type GithubFileContent,
  type RepositoryDetailsData,
} from "../data/github";

import "./RepositoryDetails.css";

export default function RepositoryDetails() {
  const { owner = "", repo = "" } = useParams();

  const [details, setDetails] =
    useState<RepositoryDetailsData | null>(null);
  const [selectedFile, setSelectedFile] =
    useState<GithubFileContent | null>(null);
  const [currentFolder, setCurrentFolder] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState("");

  const codeViewerRef = useRef<HTMLElement | null>(null);

  async function loadDetails() {
    setLoading(true);
    setError("");

    try {
      const result = await getGithubRepositoryDetails(owner, repo);
      setDetails(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load repository details.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function openFile(path: string) {
    setFileLoading(true);
    setFileError("");
    setSelectedFile(null);

    try {
      const result = await getGithubFileContent(owner, repo, path);
      setSelectedFile(result);
    } catch (err) {
      setFileError(
        err instanceof Error
          ? err.message
          : "Could not load file content.",
      );
    } finally {
      setFileLoading(false);
    }
  }

  function openFolder(path: string) {
    setCurrentFolder(path);
    setSelectedFile(null);
    setFileError("");
  }

  function goBackFolder() {
    if (!currentFolder) return;

    const parts = currentFolder.split("/");
    parts.pop();
    setCurrentFolder(parts.join("/"));
    setSelectedFile(null);
    setFileError("");
  }

  function getLanguage(path: string): string {
    const extension = path.split(".").pop()?.toLowerCase();

    const languages: Record<string, string> = {
      ts: "typescript",
      tsx: "tsx",
      js: "javascript",
      jsx: "jsx",
      json: "json",
      css: "css",
      html: "markup",
      xml: "markup",
      md: "markdown",
      py: "python",
      yml: "yaml",
      yaml: "yaml",
      sh: "bash",
    };

    return languages[extension ?? ""] ?? "plaintext";
  }

  function highlightCode(content: string, path: string): string {
    const language = getLanguage(path);
    const grammar = Prism.languages[language];

    if (!grammar) {
      return Prism.util.encode(content) as unknown as string;
    }

    return Prism.highlight(content, grammar, language);
  }

  useEffect(() => {
    void loadDetails();
  }, [owner, repo]);

  useEffect(() => {
    if (selectedFile && !fileLoading) {
      codeViewerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedFile, fileLoading]);

  if (loading) {
    return (
      <Card className="repository-detail-state">
        <RefreshCw size={24} />
        <h2>Loading repository...</h2>
        <p className="muted">
          Fetching repository metadata and file tree.
        </p>
      </Card>
    );
  }

  if (error || !details) {
    return (
      <Card className="repository-detail-state">
        <h2>Could not load repository</h2>
        <p className="muted">
          {error || "Repository details are unavailable."}
        </p>

        <div className="repository-detail-actions">
          <Button
            variant="secondary"
            onClick={() => void loadDetails()}
          >
            <RefreshCw size={16} />
            Retry
          </Button>

          <Link
            to="/repositories"
            className="repository-back-link"
          >
            Back to repositories
          </Link>
        </div>
      </Card>
    );
  }

  const { repository, files, tree_truncated } = details;

  const visibleFiles = files.filter((item) => {
    if (!currentFolder) {
      return !item.path.includes("/");
    }

    const prefix = `${currentFolder}/`;

    if (!item.path.startsWith(prefix)) {
      return false;
    }

    const remainingPath = item.path.slice(prefix.length);

    return remainingPath.length > 0 && !remainingPath.includes("/");
  });

  const breadcrumbs = currentFolder
    ? currentFolder.split("/")
    : [];

  return (
    <div className="repository-details-page">
      <Link
        to="/repositories"
        className="repository-back-link"
      >
        <ArrowLeft size={16} />
        All repositories
      </Link>

      <div className="page-heading repository-detail-heading">
        <div>
          <p className="eyebrow">GITHUB REPOSITORY</p>
          <h1>{repository.name}</h1>
          <p className="muted">{repository.full_name}</p>
        </div>

        <a
          className="repository-external-link"
          href={repository.html_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={16} />
          Open on GitHub
        </a>
      </div>

      <Card className="repository-overview">
        <div className="repository-detail-badges">
          <Badge tone={repository.private ? "neutral" : "success"}>
            {repository.private ? (
              <>
                <LockKeyhole size={13} /> Private
              </>
            ) : (
              <>
                <Globe size={13} /> Public
              </>
            )}
          </Badge>

          <Badge>
            <GitBranch size={13} />
            {repository.default_branch}
          </Badge>
        </div>

        <p className="repository-detail-description">
          {repository.description || "No description provided."}
        </p>

        <div className="repository-overview-meta">
          <span>
            <Star size={16} />
            {repository.stars} stars
          </span>

          <span>
            <GitBranch size={16} />
            {repository.default_branch}
          </span>

          <span>
            Updated{" "}
            {new Date(repository.updated_at).toLocaleDateString()}
          </span>
        </div>
      </Card>

      <div className="repository-breadcrumbs">
        <button
          type="button"
          className="repository-breadcrumb"
          onClick={() => openFolder("")}
        >
          <Home size={15} />
          Root
        </button>

        {breadcrumbs.map((part, index) => {
          const path = breadcrumbs.slice(0, index + 1).join("/");

          return (
            <span
              className="repository-breadcrumb-item"
              key={path}
            >
              <ChevronRight size={14} />

              <button
                type="button"
                className="repository-breadcrumb"
                onClick={() => openFolder(path)}
              >
                {part}
              </button>
            </span>
          );
        })}

        {currentFolder && (
          <Button
            variant="secondary"
            onClick={goBackFolder}
          >
            <ArrowLeft size={15} />
            Back
          </Button>
        )}
      </div>

      <div className="repository-tree-heading">
        <div>
          <h2>Files and folders</h2>
          <p className="muted">
            {visibleFiles.length} entries in{" "}
            {currentFolder || "repository root"}
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => void loadDetails()}
          disabled={loading}
        >
          <RefreshCw size={15} />
          Refresh
        </Button>
      </div>

      {tree_truncated && (
        <p className="repository-tree-warning" role="status">
          GitHub truncated this file tree because the repository is
          large. Some entries may be missing.
        </p>
      )}

      {visibleFiles.length === 0 ? (
        <Card className="repository-detail-state">
          <Folder size={24} />
          <h2>No files in this folder</h2>
          <p className="muted">
            This folder may be empty or its contents were not returned
            by GitHub.
          </p>
        </Card>
      ) : (
        <Card className="repository-file-list">
          {visibleFiles.map((item) => (
            <div
              className={`repository-file-row ${
                item.type === "tree"
                  ? "repository-file-row-clickable"
                  : item.type === "blob"
                    ? "repository-file-row-clickable"
                    : ""
              }`}
              key={item.path}
              onClick={() => {
                if (item.type === "tree") {
                  openFolder(item.path);
                } else if (item.type === "blob") {
                  void openFile(item.path);
                }
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") {
                  return;
                }

                if (item.type === "tree") {
                  event.preventDefault();
                  openFolder(item.path);
                } else if (item.type === "blob") {
                  event.preventDefault();
                  void openFile(item.path);
                }
              }}
              role={
                item.type === "blob" || item.type === "tree"
                  ? "button"
                  : undefined
              }
              tabIndex={
                item.type === "blob" || item.type === "tree"
                  ? 0
                  : undefined
              }
            >
              <span className="repository-file-icon">
                {item.type === "tree" ? (
                  <Folder size={17} />
                ) : (
                  <File size={17} />
                )}
              </span>

              <span className="repository-file-path">
                {item.path.split("/").pop()}
              </span>

              <span className="repository-file-type">
                {item.type === "tree"
                  ? "Folder"
                  : item.type === "commit"
                    ? "Submodule"
                    : "File"}
              </span>

              {item.size !== null && item.type === "blob" && (
                <span className="repository-file-size">
                  {item.size.toLocaleString()} B
                </span>
              )}
            </div>
          ))}
        </Card>
      )}

      {fileLoading && (
        <Card className="repository-code-state">
          <RefreshCw size={20} />
          <p>Loading source code...</p>
        </Card>
      )}

      {fileError && (
        <Card className="repository-code-state">
          <p role="alert">{fileError}</p>
        </Card>
      )}

      {selectedFile && !fileLoading && (
        <section
          className="repository-code-panel"
          ref={codeViewerRef}
        >
          <div className="repository-code-header">
            <div>
              <h2>{selectedFile.name}</h2>
              <p className="muted">{selectedFile.path}</p>
            </div>

            <div className="repository-code-actions">
              <a
                className="repository-external-link"
                href={selectedFile.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={15} />
                View on GitHub
              </a>

              <Button
                variant="secondary"
                onClick={() => setSelectedFile(null)}
              >
                <X size={15} />
                Close
              </Button>
            </div>
          </div>

          <div className="repository-code-meta">
            {selectedFile.size.toLocaleString()} bytes
            {" · "}
            {getLanguage(selectedFile.path)}
          </div>

          <pre className="repository-code-block">
            <code
              className={`language-${getLanguage(selectedFile.path)}`}
              dangerouslySetInnerHTML={{
                __html: highlightCode(
                  selectedFile.content,
                  selectedFile.path,
                ),
              }}
            />
          </pre>
        </section>
      )}
    </div>
  );
}
