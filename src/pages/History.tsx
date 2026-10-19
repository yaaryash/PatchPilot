
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  History as HistoryIcon,
  ArrowUpRight,
} from "lucide-react";
import { Card, Badge } from "../components/ui";
import "./History.css";

type RepairStatus = "Completed" | "Failed" | "Running" | "Rejected";

type RepairRun = {
  id: string;
  repository: string;
  issue: string;
  status: RepairStatus;
  date: string;
  duration: string;
};

const repairRuns: RepairRun[] = [
  {
    id: "PR-1042",
    repository: "patchpilot/frontend",
    issue: "Fix login form validation",
    status: "Completed",
    date: "2026-10-18 14:32",
    duration: "2m 14s",
  },
  {
    id: "PR-1041",
    repository: "patchpilot/api",
    issue: "Handle missing user profile",
    status: "Failed",
    date: "2026-10-17 11:20",
    duration: "1m 08s",
  },
  {
    id: "PR-1040",
    repository: "patchpilot/frontend",
    issue: "Fix dashboard loading state",
    status: "Completed",
    date: "2026-10-16 16:45",
    duration: "3m 02s",
  },
  {
    id: "PR-1039",
    repository: "patchpilot/api",
    issue: "Add request timeout handling",
    status: "Rejected",
    date: "2026-10-15 09:15",
    duration: "48s",
  },
  {
    id: "PR-1038",
    repository: "patchpilot/worker",
    issue: "Investigate background job failure",
    status: "Running",
    date: "2026-10-14 13:05",
    duration: "In progress",
  },
];

export default function History() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [repositoryFilter, setRepositoryFilter] = useState("All");

  const repositories = useMemo(
    () => [...new Set(repairRuns.map((run) => run.repository))],
    []
  );

  const filteredRuns = useMemo(() => {
    const query = search.trim().toLowerCase();

    return repairRuns.filter((run) => {
      const matchesSearch =
        run.id.toLowerCase().includes(query) ||
        run.repository.toLowerCase().includes(query) ||
        run.issue.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || run.status === statusFilter;

      const matchesRepository =
        repositoryFilter === "All" ||
        run.repository === repositoryFilter;

      return matchesSearch && matchesStatus && matchesRepository;
    });
  }, [search, statusFilter, repositoryFilter]);

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">ACTIVITY LOG</p>
          <h1>Repair history</h1>
          <p className="muted">
            Review previous repair runs and their outcomes.
          </p>
        </div>
        <Badge>{repairRuns.length} runs</Badge>
      </div>

      <Card className="history-toolbar">
        <div className="history-search">
          <Search size={18} />
          <input
            aria-label="Search repair history"
            placeholder="Search repair ID, issue, or repository..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="All">All statuses</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
          <option value="Running">Running</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          aria-label="Filter by repository"
          value={repositoryFilter}
          onChange={(event) => setRepositoryFilter(event.target.value)}
        >
          <option value="All">All repositories</option>
          {repositories.map((repository) => (
            <option key={repository} value={repository}>
              {repository}
            </option>
          ))}
        </select>
      </Card>

      <div className="history-results">
        <span className="muted">
          Showing {filteredRuns.length} of {repairRuns.length} repair runs
        </span>
      </div>

      {filteredRuns.length > 0 ? (
        <Card className="history-table-card">
          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Repair</th>
                  <th>Repository</th>
                  <th>Issue</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Duration</th>
                  <th aria-label="Open details" />
                </tr>
              </thead>
              <tbody>
                {filteredRuns.map((run) => (
                  <tr
                    key={run.id}
                    className="history-row"
                    tabIndex={0}
                    onClick={() => navigate(`/repairs/${run.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        navigate(`/repairs/${run.id}`);
                      }
                    }}
                  >
                    <td>
                      <strong>{run.id}</strong>
                    </td>
                    <td>{run.repository}</td>
                    <td>{run.issue}</td>
                    <td>
                      <span
                        className={`history-status history-status-${run.status.toLowerCase()}`}
                      >
                        <span className="history-status-dot" />
                        {run.status}
                      </span>
                    </td>
                    <td>{run.date}</td>
                    <td>{run.duration}</td>
                    <td>
                      <ArrowUpRight size={17} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="empty-state">
          <span className="empty-icon">
            {search || statusFilter !== "All" || repositoryFilter !== "All" ? (
              <Search size={25} />
            ) : (
              <HistoryIcon size={25} />
            )}
          </span>
          <h2>No matching repair runs</h2>
          <p className="muted">
            Try changing your search or filters to find a repair run.
          </p>
        </Card>
      )}
    </>
  );
}
