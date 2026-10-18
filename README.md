
# PatchPilot

**AI-Powered Code Repair Platform**

PatchPilot is a developer-focused platform designed to help engineers investigate bugs, generate proposed code fixes, review code diffs, inspect test results, and manage repair workflows from one interface.

The long-term goal is to build a reliable AI-assisted repair workflow that connects repository analysis, patch generation, automated testing, and human approval.

> **Current status:** Frontend prototype in development. Repair records, code diffs, test results, and review actions currently use mock data. No real code repair or repository modification is performed.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Project Goals](#project-goals)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Development Data](#development-data)
- [Roadmap](#roadmap)
- [Testing and Verification](#testing-and-verification)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)

---

## Problem Statement

Debugging software can involve many disconnected activities:

- Reproducing bugs and understanding their root causes.
- Finding the relevant source files.
- Developing and reviewing code changes.
- Running tests and inspecting failures.
- Tracking repair progress.
- Deciding whether a proposed fix should be accepted or rejected.

PatchPilot aims to bring these activities into one workflow, with AI assistance and developer approval at appropriate stages.

## Project Goals

1. Provide a clear dashboard for repair activity.
2. Collect structured bug reports and reproduction steps.
3. Display repair progress through a status timeline.
4. Present proposed file changes in a readable diff viewer.
5. Surface test results and diagnostic output.
6. Keep approval and cancellation decisions under developer control.
7. Introduce backend processing, repository integration, and AI-assisted patch generation incrementally.

---

## Features

### Feature 1A — Application Layout

- Sidebar navigation.
- Top navigation and workspace header.
- Shared UI components.
- Dashboard, New Repair, Repositories, and History navigation.
- Consistent application styling.

**Status:** Initial implementation added; verify shared components and responsive behavior.

### Feature 1B — Dashboard

- Total repairs statistic.
- Successful repairs statistic.
- Failed repairs statistic.
- Recent repair runs table.
- Repair status badges.
- Loading-state preview.
- Empty-state preview.
- Development-only sample data.

**Status:** Implemented with mock data; verify the latest build.

### Feature 1C — New Repair Form

- Repository selection.
- Bug title.
- Bug description.
- Reproduction steps.
- Input validation.
- Submission loading state.
- Demo success feedback.
- Form reset behavior.

**Status:** Frontend implementation added; verify form validation and interactions.

**Limitation:** Submissions are not saved to a backend and do not start a real repair job.

### Feature 1D — Repair Details

- Repair metadata and issue description.
- Expandable reproduction steps.
- Repair status timeline.
- Changed files list.
- Expandable unified diff viewer.
- Test results with expandable output.
- Approve Patch control.
- Reject Patch control.
- Cancel Repair control.
- Confirmation dialogs.
- Demo-state reset.
- Responsive layout.

**Status:** UI renders locally; complete the interaction checks and production build verification.

**Limitation:** The displayed diff and test results are illustrative. Approval, rejection, cancellation, and reset only change local UI state.

### Planned Features

The following capabilities are planned and are not represented as completed functionality:

- Repository connection and management.
- Searchable and filterable repository listings.
- Repair history with status filters.
- Backend API and persistent database.
- Background repair jobs.
- AI-assisted bug analysis and patch generation.
- Real test execution and result collection.
- Git provider integration.
- Secure patch approval and application.
- Logging, monitoring, and audit history.

---

## Technology Stack

### Current Frontend

| Technology | Purpose |
|---|---|
| React | UI components |
| TypeScript | Static typing |
| Vite | Development server and build tooling |
| React Router | Client-side navigation |
| Lucide React | Icons |
| CSS | Styling and responsive layouts |

### Potential Future Backend

These are planned technology options, not currently integrated dependencies.

| Technology | Potential purpose |
|---|---|
| Node.js | Backend runtime |
| Express | HTTP API |
| PostgreSQL | Persistent application data |
| Redis | Caching and coordination |
| BullMQ | Background job processing |
| Kafka | Event streaming if scale and architecture justify it |
| Docker | Isolated execution environments |
| Git provider APIs | Repository access and pull request workflows |
| AI model APIs | Bug analysis and patch generation |

Backend technology choices will be finalized when the backend architecture is implemented.

---

## Architecture

### Current Architecture

The current prototype is a client-side React application.

```text
Browser
   |
   v
React + TypeScript
   |
   +-- Application Layout
   +-- Dashboard
   +-- New Repair Form
   +-- Repair Details
   +-- Repositories (UI)
   +-- History (UI)
   |
   v
Local Mock Data
```

No production backend, persistent storage, real test runner, or repository execution engine is connected.

### Intended Future Architecture

```text
React Frontend
      |
      v
Backend API
      |
      +---- Authentication and Authorization
      |
      +---- PostgreSQL
      |
      +---- Redis / Job Queue
                   |
                   v
             Repair Worker
                   |
          +--------+--------+
          |                 |
          v                 v
     Repository        AI Analysis
      Checkout        and Patch Draft
          |                 |
          +--------+--------+
                   |
                   v
             Test Execution
                   |
                   v
          Human Review and Approval
                   |
                   v
          Controlled Patch Application
```

This is a target architecture, not an implemented production system. Repository execution and patch application will require appropriate isolation, access controls, and validation.

---

## Project Structure

The frontend is organized by pages, shared components, and development data.

```text
PatchPilot/
├── public/
├── src/
│   ├── components/
│   │   ├── AppLayout.tsx
│   │   └── ui.tsx
│   ├── data/
│   │   ├── mockRepairs.ts
│   │   ├── mockRepositories.ts
│   │   └── mockRepairDetails.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── NewRepair.tsx
│   │   ├── RepairDetails.tsx
│   │   ├── RepairDetails.css
│   │   ├── Repositories.tsx
│   │   └── History.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
└── README.md
```

The exact files may differ as development progresses. Keep this section synchronized with the actual repository.

---

## Getting Started

### Prerequisites

- Node.js LTS.
- npm.
- Git.
- A code editor such as Visual Studio Code.

### 1. Clone the repository

After the project has been pushed to GitHub:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd PatchPilot
```

Replace the placeholder with your actual repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL printed in the terminal, typically:

```text
http://localhost:5173
```

### 4. Build the application

```bash
npm run build
```

### 5. Preview the production build

```bash
npm run preview
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the local development server |
| `npm run build` | Runs TypeScript build checks and creates a production bundle |
| `npm run preview` | Serves the production build locally |

Available scripts depend on the project's `package.json`.

---

## Development Data

The current prototype uses local mock data to demonstrate the UI before backend integration.

Examples include:

- Sample repair records.
- Example repository names.
- Illustrative file changes and code diffs.
- Example test statuses and output.
- Local-only approval, rejection, cancellation, and reset states.

These examples are not verified production repair results.

Do not use the mock test results to conclude that a proposed patch fixes a real issue. No actual repository changes are made by the current UI.

---

## Roadmap

### Phase 1 — Frontend Foundation

- [x] Application layout and navigation
- [x] Dashboard UI
- [x] New Repair form UI
- [x] Repair Details UI
- [ ] Verify all interactions and responsive behavior
- [ ] Verify a successful production build
- [ ] Repositories page implementation and verification
- [ ] History page implementation and verification

### Phase 2 — Backend Foundation

- [ ] Define API contracts and data models
- [ ] Implement backend application
- [ ] Add persistent database storage
- [ ] Validate and persist repair submissions
- [ ] Add API error handling

### Phase 3 — Repair Job Processing

- [ ] Create repair job lifecycle
- [ ] Implement job status transitions
- [ ] Add background job processing
- [ ] Add progress and failure reporting
- [ ] Implement cancellation of actual running jobs

### Phase 4 — Repository Integration

- [ ] Secure repository connection
- [ ] Fetch repository metadata
- [ ] Retrieve source code safely
- [ ] Track changed files
- [ ] Integrate version-control workflows

### Phase 5 — AI-Assisted Repair

- [ ] Analyze bug reports
- [ ] Inspect relevant source files
- [ ] Generate proposed patches
- [ ] Validate patch structure
- [ ] Display real diffs for review

### Phase 6 — Testing and Review

- [ ] Execute tests in an isolated environment
- [ ] Collect real test output
- [ ] Display passed, failed, and skipped tests
- [ ] Add secure approval and rejection workflows
- [ ] Apply patches only through controlled operations

### Phase 7 — Production Readiness

- [ ] Authentication and authorization
- [ ] Secrets management
- [ ] Audit logging
- [ ] Rate limiting and resource limits
- [ ] Monitoring and error reporting
- [ ] Deployment and operational documentation

Checkboxes should be updated as features are actually implemented and verified.

---

## Testing and Verification

For the current frontend prototype:

1. Install dependencies using `npm install`.
2. Start the application using `npm run dev`.
3. Visit the Dashboard and navigate to each page.
4. Check New Repair form validation and loading feedback.
5. Open a repair details page.
6. Expand reproduction steps, file diffs, and test output.
7. Test the review-action confirmation dialogs.
8. Check the layout at desktop and mobile widths.
9. Run `npm run build`.
10. Fix errors before committing changes.

Automated unit tests, integration tests, and end-to-end tests should be added as the project evolves.

---

## Security Considerations

A future production version must treat repository code and generated patches as untrusted input.

Important considerations include:

- Never expose API keys, passwords, or access tokens in frontend code.
- Keep secrets in environment variables or an appropriate secret manager.
- Never execute arbitrary repository code directly on the application server without isolation.
- Use sandboxed workers and resource limits for test execution.
- Require authorization for repository access and patch operations.
- Validate generated patches before applying them.
- Keep an audit trail of approval and application decisions.
- Avoid treating AI-generated changes as automatically safe or correct.

The current frontend prototype does not implement these production security controls.

---

## Contributing

Contributions and improvements are welcome.

Suggested workflow:

1. Create a focused branch.
2. Implement one feature at a time.
3. Update this README when functionality changes.
4. Run `npm run build`.
5. Review the changes before committing.
6. Push the branch and open a pull request when appropriate.

Use clear commit messages, for example:

```text
feat: add repair details page
fix: resolve repair details route
docs: update project README
```

---

## License

No license has been selected yet. Until a license is added, do not assume the project is licensed for unrestricted reuse.
