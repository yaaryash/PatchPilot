
import { NavLink, Outlet, useLocation } from "react-router-dom";
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
} from "lucide-react";

const navigation = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "New Repair", path: "/repair", icon: Plus },
  { label: "Repositories", path: "/repositories", icon: GitBranch },
  { label: "History", path: "/history", icon: Clock3 },
];

export default function AppLayout() {
  const location = useLocation();

  const pageTitle =
    navigation.find((item) => item.path === location.pathname)?.label ??
    "PatchPilot";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/" className="brand">
          <span className="brand-icon"><Wrench size={21} /></span>
          <span>Patch<span className="brand-accent">Pilot</span></span>
        </NavLink>

        <div className="workspace-label">WORKSPACE</div>
        <div className="workspace-card">
          <span className="workspace-avatar">P</span>
          <span><strong>Personal workspace</strong><small>Developer plan</small></span>
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
            <div><strong>Secure by design</strong><small>Repair workflows, safely</small></div>
          </div>
          <button className="nav-link settings-link" type="button">
            <Settings size={18} /> Settings
          </button>
          <div className="user-profile">
            <div className="user-avatar">D</div>
            <div><strong>Developer</strong><small>Local workspace</small></div>
            <Activity size={16} className="online-icon" />
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>Workspace</span><span>/</span><strong>{pageTitle}</strong>
          </div>
          <div className="topbar-right">
            <label className="search-box">
              <Search size={16} />
              <input aria-label="Search" placeholder="Search..." />
              <kbd>⌘ K</kbd>
            </label>
            <span className="status-dot" />
            <span className="system-status">System ready</span>
            <div className="user-avatar small-avatar">D</div>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
