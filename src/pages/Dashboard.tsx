import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  GitBranch,
  History,
  RefreshCw,
  Wrench,
  XCircle,
} from "lucide-react";

import { Badge, Button, Card, LoadingState } from "../components/ui";
import {
  mockRepairRuns,
  type RepairRun,
  type RepairStatus,
} from "../data/mockRepairs";
import { useUserProfile } from "../hooks/useUserProfile";

type DashboardMode = "data" | "loading" | "empty";

function StatusBadge({ status }: { status: RepairStatus }) {
  const tone =
    status === "Successful"
      ? "success"
      : status === "Failed"
        ? "warning"
        : "neutral";

  return <Badge tone={tone}>{status}</Badge>;
}

function RepairTable({ runs }: { runs: RepairRun[] }) {
  return (
    <div className="table-wrapper">
      <table className="repair-table">
        <thead>
          <tr>
            <th>Repair</th>
            <th>Repository / Issue</th>
            <th>Status</th>
            <th>Created</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {runs.map((run) => (
            <tr key={run.id}>
              <td>
                <span className="repair-id">{run.id}</span>
              </td>

              <td>
                <div className="repository-name">
                  <GitBranch size={14} />
                  <span>{run.repository}</span>
                </div>
                <div className="issue-description">{run.issue}</div>
              </td>

              <td>
                <StatusBadge status={run.status} />
              </td>

              <td className="table-muted">{run.createdAt}</td>

              <td className="table-muted">{run.duration}</td>

              <td>
                <Link to={`/repairs/${run.id}`} className="text-link">
                  View details <ArrowRight size={14} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard() {
  // Preview UI states before backend integration.
  const [mode, setMode] = useState<DashboardMode>("data");
  const profile = useUserProfile();

  const runs = mode === "empty" ? [] : mockRepairRuns;

  const total = runs.length;

  const successful = runs.filter((run) => run.status === "Successful").length;

  const failed = runs.filter((run) => run.status === "Failed").length;

  const stats = [
    {
      label: "Total repairs",
      value: total,
      icon: Wrench,
      description: "Repair runs in this sample",
      className: "stat-purple",
    },
    {
      label: "Successful repairs",
      value: successful,
      icon: CheckCircle2,
      description: "Completed successfully",
      className: "stat-green",
    },
    {
      label: "Failed repairs",
      value: failed,
      icon: XCircle,
      description: "Unsuccessful attempts",
      className: "stat-red",
    },
  ];

  return (
    <>
      <div className="page-heading dashboard-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Good to see you, {profile.displayName || "Developer"}.</h1>
          <p className="muted">
            Monitor repair activity and inspect recent repair runs.
          </p>
        </div>

        <Link to="/repair">
          <Button>
            <Wrench size={16} />
            New repair
          </Button>
        </Link>
      </div>

      <div className="development-banner">
        <span className="development-dot" />
        <strong>DEVELOPMENT ONLY</strong>
        <span>Sample data — not connected to a backend.</span>
      </div>

      <div className="stats-grid">
        {stats.map(({ label, value, icon: Icon, description, className }) => (
          <Card key={label} className={`stat-card ${className}`}>
            <div className="stat-top">
              <span>{label}</span>
              <Icon size={19} />
            </div>

            <strong className="stat-value">{value}</strong>

            <span className="muted stat-caption">{description}</span>
          </Card>
        ))}
      </div>

      <section className="recent-section">
        <div className="section-heading recent-heading">
          <div>
            <h2>Recent repair runs</h2>
            <p className="muted">
              Latest sample runs from the development dataset.
            </p>
          </div>

          <div className="preview-controls">
            <Button
              variant="secondary"
              onClick={() => setMode("data")}
              disabled={mode === "data"}
            >
              <RefreshCw size={14} />
              Sample data
            </Button>

            <Button
              variant="secondary"
              onClick={() => setMode("loading")}
              disabled={mode === "loading"}
            >
              Preview loading
            </Button>

            <Button
              variant="secondary"
              onClick={() => setMode("empty")}
              disabled={mode === "empty"}
            >
              Preview empty
            </Button>
          </div>
        </div>

        <Card className="table-card">
          {mode === "loading" ? (
            <LoadingState label="Loading repair runs..." />
          ) : runs.length === 0 ? (
            <div className="table-empty-state">
              <span className="empty-icon">
                <History size={24} />
              </span>

              <h3>No repair runs yet</h3>

              <p className="muted">
                When repair runs become available, they will appear here.
              </p>

              <Link to="/repair">
                <Button variant="secondary">
                  Prepare a repair <ArrowRight size={15} />
                </Button>
              </Link>
            </div>
          ) : (
            <RepairTable runs={runs} />
          )}
        </Card>

        <div className="dashboard-footer">
          <span>
            <Clock3 size={14} />
            Showing {runs.length} sample records
          </span>

          <Link to="/history" className="text-link">
            View history <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
