import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  Clock3,
  GitBranch,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Wrench,
  X,
  ArrowUpRight,
  LogOut,
} from "lucide-react";

import { mockRepairRuns } from "../data/mockRepairs";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAuth } from "../hooks/useAuth";
import "./AppLayout.css";

const navigation = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "New Repair", path: "/repair", icon: Plus },
  { label: "Repositories", path: "/repositories", icon: GitBranch },
  { label: "History", path: "/history", icon: Clock3 },
];

type SearchResult = {
  id: string;
  title: string;
  description: string;
  category: string;
  path: string;
};

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = useUserProfile();
  const { user, loading, signOut } = useAuth();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const displayName =
    user?.name || user?.login || profile.displayName || "Developer";

  const avatarLetter = displayName.trim().charAt(0).toUpperCase() || "D";
  const pageTitle =
    navigation.find((item) => item.path === location.pathname)?.label ??
    (location.pathname.startsWith("/repairs/")
      ? "Repair Details"
      : location.pathname.startsWith("/settings")
        ? "Settings"
        : "PatchPilot");

  const results = useMemo<SearchResult[]>(() => {
    const pages: SearchResult[] = navigation.map((item) => ({
      id: `page-${item.path}`,
      title: item.label,
      description: `Open ${item.label}`,
      category: "Page",
      path: item.path,
    }));

    const repairs: SearchResult[] = mockRepairRuns.map((run) => ({
      id: run.id,
      title: `${run.id} — ${run.issue}`,
      description: `${run.repository} · ${run.status}`,
      category: "Repair",
      path: `/repairs/${run.id}`,
    }));

    const allResults = [...pages, ...repairs];
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return allResults.slice(0, 8);
    }

    return allResults
      .filter((result) =>
        `${result.title} ${result.description} ${result.category}`
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .slice(0, 10);
  }, [query]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const isSearchShortcut =
        (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";

      if (isSearchShortcut) {
        event.preventDefault();
        setSearchOpen((open) => !open);
        setQuery("");
        setActiveIndex(0);
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    }

    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  useEffect(() => {
    setSearchOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, [location.pathname]);

  useEffect(() => {
    if (activeIndex >= results.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, results.length]);

  function openResult(result: SearchResult) {
    setSearchOpen(false);
    setQuery("");
    setActiveIndex(0);
    navigate(result.path);
  }

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((index) =>
        results.length === 0 ? 0 : (index + 1) % results.length,
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((index) =>
        results.length === 0
          ? 0
          : (index - 1 + results.length) % results.length,
      );
    }

    if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      openResult(results[activeIndex]);
    }
  }

  function openSearch() {
    setQuery("");
    setActiveIndex(0);
    setSearchOpen(true);
  }
  async function handleLogout() {
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      window.alert("Logout failed. Please try again.");
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/" className="brand">
          <span className="brand-icon">
            <Wrench size={21} />
          </span>

          <span>
            Patch<span className="brand-accent">Pilot</span>
          </span>
        </NavLink>

        <div className="workspace-label">WORKSPACE</div>

        <div className="workspace-card">
          <span className="workspace-avatar">P</span>

          <span>
            <strong>Personal workspace</strong>
            <small>Developer plan</small>
          </span>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>

              {label === "New Repair" && <span className="nav-plus">↗</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="security-note">
            <ShieldCheck size={18} />

            <div>
              <strong>Secure by design</strong>
              <small>Repair workflows, safely</small>
            </div>
          </div>

          <button
            className={`nav-link settings-link ${
              location.pathname.startsWith("/settings") ? "active" : ""
            }`}
            type="button"
            onClick={() => navigate("/settings")}
          >
            <Settings size={18} />
            Settings
          </button>

          <div className="user-profile">
            {user?.avatar_url ? (
              <img
                className="user-avatar"
                src={user.avatar_url}
                alt={`${displayName}'s GitHub avatar`}
              />
            ) : (
              <div className="user-avatar">{avatarLetter}</div>
            )}

            <div>
              <strong>{displayName}</strong>
              <small>{user ? `@${user.login}` : "Local workspace"}</small>
            </div>

            <Activity size={16} className="online-icon" />
          </div>
          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
            disabled={loading || !user}
            title={user ? "Sign out of GitHub" : "Login to GitHub first"}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>Workspace</span>
            <span>/</span>
            <strong>{pageTitle}</strong>
          </div>

          <div className="topbar-right">
            <button
              className="search-box"
              type="button"
              onClick={openSearch}
              aria-label="Open global search"
            >
              <Search size={16} />
              <span>Search...</span>
              <kbd>Ctrl K</kbd>
            </button>

            <span className="status-dot" />
            <span className="system-status">System ready</span>

            {user?.avatar_url ? (
              <img
                className="user-avatar small-avatar"
                src={user.avatar_url}
                alt={`${displayName}'s GitHub avatar`}
                title={displayName}
              />
            ) : (
              <div
                className="user-avatar small-avatar"
                aria-label={`Profile: ${displayName}`}
                title={displayName}
              >
                {avatarLetter}
              </div>
            )}
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>

      {searchOpen && (
        <div
          className="global-search-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSearchOpen(false);
            }
          }}
        >
          <section
            className="global-search-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Global search"
          >
            <div className="global-search-input-row">
              <Search size={19} />

              <input
                autoFocus
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search pages, repairs, issues..."
                aria-label="Search pages and repairs"
              />

              <button
                type="button"
                className="global-search-close"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>

            <div className="global-search-caption">
              {query ? "SEARCH RESULTS" : "QUICK NAVIGATION"}
            </div>

            <div className="global-search-results">
              {results.length > 0 ? (
                results.map((result, index) => (
                  <button
                    type="button"
                    key={result.id}
                    className={`global-search-result ${
                      index === activeIndex ? "active" : ""
                    }`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => openResult(result)}
                  >
                    <span className="global-search-result-icon">
                      {result.category === "Repair" ? (
                        <Wrench size={17} />
                      ) : (
                        <ArrowUpRight size={17} />
                      )}
                    </span>

                    <span className="global-search-result-text">
                      <strong>{result.title}</strong>
                      <small>{result.description}</small>
                    </span>

                    <span className="global-search-category">
                      {result.category}
                    </span>
                  </button>
                ))
              ) : (
                <div className="global-search-empty">
                  <Search size={22} />
                  <strong>No results found</strong>
                  <span>Try a repair ID, issue title, or page name.</span>
                </div>
              )}
            </div>

            <footer className="global-search-footer">
              <span>
                <kbd>↑</kbd> <kbd>↓</kbd> Navigate
              </span>
              <span>
                <kbd>Enter</kbd> Open
              </span>
              <span>
                <kbd>Esc</kbd> Close
              </span>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
