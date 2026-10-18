
export type RepairStatus = "Successful" | "Failed" | "Running";

export type RepairRun = {
  id: string;
  repository: string;
  issue: string;
  status: RepairStatus;
  createdAt: string;
  duration: string;
};

// DEVELOPMENT ONLY — fictional sample records.
// Replace with API data when the backend is implemented.
export const mockRepairRuns: RepairRun[] = [
  {
    id: "PR-1042",
    repository: "payment-service",
    issue: "Fix null pointer in payment handler",
    status: "Successful",
    createdAt: "Oct 18, 2026 · 10:42 AM",
    duration: "42 sec",
  },
  {
    id: "PR-1041",
    repository: "user-api",
    issue: "Resolve failing authentication test",
    status: "Failed",
    createdAt: "Oct 18, 2026 · 10:18 AM",
    duration: "1 min 12 sec",
  },
  {
    id: "PR-1040",
    repository: "inventory-service",
    issue: "Handle missing inventory records",
    status: "Successful",
    createdAt: "Oct 18, 2026 · 09:56 AM",
    duration: "36 sec",
  },
  {
    id: "PR-1039",
    repository: "notification-worker",
    issue: "Fix retry handling for failed jobs",
    status: "Running",
    createdAt: "Oct 18, 2026 · 09:51 AM",
    duration: "In progress",
  },
  {
    id: "PR-1038",
    repository: "order-service",
    issue: "Correct order status validation",
    status: "Successful",
    createdAt: "Oct 18, 2026 · 09:22 AM",
    duration: "51 sec",
  },
];
