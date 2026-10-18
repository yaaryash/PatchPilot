
# PatchPilot

**An AI-powered code repair platform designed to investigate bugs, generate patches, and validate fixes.**

PatchPilot aims to help developers move from bug reports to validated code fixes through an AI-assisted repair workflow. The platform is being developed with a modern frontend foundation and a planned backend architecture for repository analysis, repair orchestration, and isolated code execution.

> **Project status:** Active development. The frontend foundation and dashboard/new-repair interfaces are being built incrementally. Backend integration and real repair execution are not implemented yet.

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Goals](#goals)
- [Current Features](#current-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Development-Only Data](#development-only-data)
- [Feature Roadmap](#feature-roadmap)
- [Testing and Verification](#testing-and-verification)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Software bugs can take significant time to investigate, reproduce, debug, and fix. PatchPilot is intended to streamline this process by providing a structured workflow for reporting issues, analyzing repositories, generating candidate patches, and validating potential fixes.

The long-term vision is to build a reliable AI-assisted code repair system with:

- Structured bug reports and reproduction steps
- Repository-aware code analysis
- AI-assisted patch generation
- Automated validation and test execution
- Isolated execution environments
- Repair history and execution status tracking
- Background job processing and observable workflows

PatchPilot is being developed incrementally. The current application is primarily a frontend prototype.

## Problem Statement

Developers frequently spend time identifying the source of a bug, understanding the affected code, reproducing the failure, and validating a fix.

PatchPilot aims to provide a unified workflow for these activities while keeping developers informed about repair progress and validation results.

## Goals

1. Provide an intuitive interface for creating repair tasks.
2. Organize repositories and repair history in one workspace.
3. Design a backend capable of orchestrating repair workflows.
4. Integrate AI models for code investigation and patch generation.
5. Validate generated patches using automated tests.
6. Execute untrusted code in appropriately isolated environments.
7. Maintain traceable repair results and execution logs.

---

## Current Features

### Feature 1A — Application Layout

The frontend foundation includes the following intended components:

- Sidebar navigation
- Top navigation bar
- Dashboard page
- New Repair page
- Repositories page
- History page
- Shared UI primitives for buttons, cards, badges, dialogs, and loading states
- Responsive layout styles

**Verification:** The initial production build succeeded and the Dashboard was visually inspected. The remaining pages and shared component behaviors should be tested independently.

### Feature 1B — Dashboard UI

The Dashboard is designed to display an overview of repair activity.

- Total repairs
- Successful repairs
- Failed repairs
- Recent repair runs table
- Repair status badges
- Loading state
- Empty state
- Responsive table layout
- Explicit development-only sample-data notice

The statistics are calculated from a local mock dataset while backend integration is pending.

### Feature 1C — New Repair Page

The New Repair interface is designed to collect the information required to report a bug.

- Repository selector
- Bug title
- Bug description
- Reproduction steps
- Required-field validation
- Input length validation
- Inline validation messages
- Submission loading state
- Duplicate-submit prevention during loading
- Reset form action
- Demo submission feedback

**Important:** The submission workflow is simulated. It does not execute a real repair or persist a repair task.

### Upcoming Frontend Features

- Repository management interface
- Repair history interface improvements
- Shared component preview and interaction tests
- Better loading, error, and empty states
- API integration

Feature completion is recorded only after the implementation has been tested.

---

## Technology Stack

### Current Frontend

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| TypeScript | Static typing |
| Vite | Development server and production bundler |
| React Router | Client-side page navigation |
| Lucide React | Icons |
| CSS | Styling, layout, and responsive behavior |

### Planned Backend and Infrastructure

The following technologies are candidates for future implementation. They are not claimed to be integrated into the current application.

| Technology | Intended purpose |
|---|---|
| Node.js | Backend runtime |
| Express | HTTP API |
| PostgreSQL | Persistent application data |
| Redis | Caching and job coordination |
| BullMQ | Background job processing |
| Kafka | Event streaming if justified by workflow requirements |
| AI model APIs | Code analysis and patch generation |
| Docker | Reproducible environments and execution isolation |
| GitHub integration | Repository access and source-control workflows |

The final backend stack and architecture will be documented as the implementation evolves.

---

## Architecture

### Current Architecture

The current frontend is a client-side React application.

```text
Browser
   |
   v
React + TypeScript
   |
   +-- Application Layout
   |      +-- Sidebar
   |      +-- Top Navigation
   |
   +-- Dashboard
   |      +-- Repair Statistics
   |      +-- Recent Repair Runs
   |
   +-- New Repair
   |      +-- Repository Selection
   |      +-- Bug Details
   |      +-- Input Validation
   |
   +-- Repositories
   |
   +-- History
   |
   +-- Local Development Mock Data
```

### Planned Repair Workflow

```text
Bug Report
    |
    v
Repository Selection
    |
    v
Repair API
    |
    v
Background Job Queue
    |
    v
Repository Analysis
    |
    v
AI-Assisted Patch Generation
    |
    v
Isolated Patch Validation
    |
    +----> Tests Passed
    |
    +----> Tests Failed
    |
    v
Repair Result and History
```

This diagram represents the intended workflow, not an already operational backend.

---

## Project Structure

The frontend structure is being organized as follows:

```text
PatchPilot/
├── public/
├── src/
│   ├── components/
│   │   ├── AppLayout.tsx
│   │   └── ui.tsx
│   ├── data/
│   │   ├── mockRepairs.ts
│   │   └── mockRepositories.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── NewRepair.tsx
│   │   ├── Repositories.tsx
│   │   └── History.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

This is the intended structure. File names may differ slightly depending on the actual local project.

---

## Getting Started

### Prerequisites

Install the following tools:

- Node.js with npm
- Visual Studio Code
- Git
- A GitHub account for remote repository hosting

### 1. Clone the Repository

Replace the placeholder with the actual repository URL.

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd PatchPilot
```

If the project already exists locally, open the existing `PatchPilot` folder instead.

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

Open the local URL printed by Vite in the terminal. It is commonly `http://localhost:5173`.

### 4. Create a Production Build

```bash
npm run build
```

### 5. Preview the Production Build

```bash
npm run preview
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm install` | Install project dependencies |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Run TypeScript project checks and create a production build |
| `npm run preview` | Preview the production build locally |

The exact available scripts are defined in `package.json`.

---

## Development-Only Data

The current UI uses fictional sample data to demonstrate how the application will look before backend integration.

Relevant files may include:

- `src/data/mockRepairs.ts`
- `src/data/mockRepositories.ts`

These records are for local development and interface testing only.

They do not represent:

- Actual connected repositories
- Real repair executions
- Real AI-generated patches
- Verified test results
- Persisted production data

Dashboard statistics are derived from the sample records. New Repair submissions are simulated and are not saved to a database.

When the backend is introduced, the UI will be connected to real API responses and the mock data will be replaced or isolated to development and test environments.

---

## Feature Roadmap

### Phase 1 — Frontend Foundation

- [x] Initialize React, TypeScript, and Vite
- [x] Add client-side routing
- [x] Create the initial application layout
- [x] Create the initial Dashboard UI
- [x] Add local sample repair records
- [x] Create the initial New Repair form
- [ ] Verify all pages and shared components
- [ ] Complete frontend interaction tests
- [ ] Finalize responsive design and accessibility checks

### Phase 2 — Repository Management

- [ ] Repository listing and empty states
- [ ] Repository connection workflow
- [ ] Repository metadata
- [ ] Repository validation and access errors

### Phase 3 — Backend Foundation

- [ ] Establish backend project structure
- [ ] Define API contracts and request validation
- [ ] Add persistent database models
- [ ] Add error handling and structured logging
- [ ] Connect frontend forms to backend APIs

### Phase 4 — Repair Orchestration

- [ ] Create persistent repair tasks
- [ ] Implement repair status transitions
- [ ] Add background job processing
- [ ] Track job progress and failures
- [ ] Persist repair history

### Phase 5 — AI Repair Engine

- [ ] Repository inspection
- [ ] Relevant code and test discovery
- [ ] AI-assisted bug analysis
- [ ] Candidate patch generation
- [ ] Patch review and validation

### Phase 6 — Secure Execution and Validation

- [ ] Isolated code execution
- [ ] Resource and execution limits
- [ ] Automated test execution
- [ ] Patch validation reports
- [ ] Safe handling of untrusted repositories and generated code

### Phase 7 — Production Readiness

- [ ] Automated unit and integration tests
- [ ] End-to-end testing
- [ ] Observability and metrics
- [ ] CI/CD pipeline
- [ ] Deployment configuration
- [ ] Security review and documentation

The roadmap is a development plan; unchecked items are not implemented features.

---

## Testing and Verification

After implementing a feature, run:

```bash
npm run build
```

For UI changes, also start the development server:

```bash
npm run dev
```

Manually verify:

- Page navigation
- Form validation
- Loading and empty states
- Error and success feedback
- Responsive behavior
- Browser console errors

Automated tests should be added as the application grows. A successful production build alone does not prove that every interaction works correctly.

---

## Security Considerations

PatchPilot is intended to process source code and eventually execute validation tasks. Security must be considered from the beginning.

Planned safeguards include:

- Never commit API keys, passwords, or access tokens.
- Keep secrets in environment variables and exclude local `.env` files from Git.
- Validate incoming API requests.
- Apply authentication and authorization when backend access is implemented.
- Use least-privilege repository permissions.
- Run untrusted code in appropriately isolated environments.
- Apply resource limits and execution timeouts.
- Avoid exposing secrets to AI prompts, logs, or generated output.
- Validate patches and test results before presenting them as successful.

These are design goals, not a claim that the safeguards have already been implemented.

---

## Contributing

PatchPilot is being developed incrementally.

For each feature:

1. Inspect the existing project structure and dependencies.
2. Implement the feature without unnecessarily breaking existing functionality.
3. Run the relevant build and tests.
4. Fix regressions.
5. Update this README to reflect the actual implementation.
6. Commit the completed changes with a descriptive Git commit message.

Example:

```bash
git add .
git commit -m "feat: add dashboard repair metrics"
git push
```

Review staged files before committing. Never commit secrets, `node_modules/`, or generated build artifacts.

---

## License

No license has been selected yet. Add a license file before distributing the project under an explicit open-source license.
