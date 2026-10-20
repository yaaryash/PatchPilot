# PatchPilot

**AI-Powered Code Repair Platform**

PatchPilot is a developer-focused platform designed to help engineers investigate bugs, explore source code, generate proposed fixes, review code diffs, inspect test results, and manage repair workflows from one interface.

The goal is to build a reliable AI-assisted repair workflow that connects repository analysis, patch generation, automated testing, and human approval.

> **Current status:** PatchPilot currently includes a React + TypeScript frontend, an Express backend, GitHub OAuth authentication, authenticated repository listing, repository metadata and file-tree browsing, and source-code preview with syntax highlighting. AI-assisted bug analysis, patch generation, automated test execution, and actual code repair are still under development.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Project Goals](#project-goals)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
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
- Finding relevant source files in large repositories.
- Investigating code and tracing dependencies.
- Developing and reviewing code changes.
- Running tests and inspecting failures.
- Tracking repair progress.
- Deciding whether a proposed fix should be accepted or rejected.

PatchPilot aims to bring these activities into one workflow, with AI assistance and developer approval at appropriate stages.

## Project Goals

1. Provide a clear dashboard for repair activity.
2. Collect structured bug reports and reproduction steps.
3. Display repair progress through a status timeline.
4. Integrate GitHub authentication and repository access.
5. Make repository files easier to explore and inspect.
6. Present proposed file changes in a readable diff viewer.
7. Surface test results and diagnostic output.
8. Keep approval and cancellation decisions under developer control.
9. Introduce backend processing, AI-assisted patch generation, and automated testing incrementally.

---

## Features

### Feature 1A — Application Layout

- Sidebar navigation.
- Application header and workspace layout.
- Shared UI components.
- Dashboard, New Repair, Repositories, and History navigation.
- Repair details and settings pages.
- Consistent application styling.

**Status:** Implemented in the frontend.

### Feature 1B — Dashboard

- Total repairs statistic.
- Successful repairs statistic.
- Failed repairs statistic.
- Recent repair runs table.
- Repair status badges.
- Loading and empty-state UI.
- Development-only sample data.

**Status:** Implemented with mock data.

**Limitation:** Repair statistics and repair records are not yet backed by a persistent repair database.

### Feature 1C — New Repair Form

- Repository selection UI.
- Bug title and description fields.
- Reproduction steps.
- Input validation.
- Submission loading state.
- Demo success feedback.
- Form reset behavior.

**Status:** Frontend implementation.

**Limitation:** Submissions do not yet create persistent repair records or start a real repair job.

### Feature 1D — Repair Details

- Repair metadata and issue description.
- Expandable reproduction steps.
- Repair status timeline.
- Changed files list.
- Expandable unified diff viewer.
- Test results with expandable output.
- Approve Patch and Reject Patch controls.
- Cancel Repair control.
- Confirmation dialogs.
- Demo-state reset.

**Status:** Frontend implementation using illustrative repair data.

**Limitation:** Displayed diffs and test results are illustrative. Review actions do not apply code changes or execute real repair jobs.

### Feature 2A — GitHub Authentication

- GitHub OAuth login flow.
- OAuth callback handling.
- OAuth state verification.
- Server-side session management.
- HTTP-only session cookie.
- Current-user authentication endpoint.
- Logout endpoint.
- Protected application routes.
- Authentication loading and error states.

**Status:** Implemented for local development.

**Limitation:** Production deployment, session-store configuration, and additional security hardening remain future work.

### Feature 2B — Repository Integration

- Fetch repositories associated with the authenticated GitHub user.
- Search repositories by name.
- Filter repositories by programming language.
- Display repository descriptions and visibility.
- Display primary language and star counts.
- Open repositories on GitHub.
- View repository metadata.
- Display the default branch and last updated date.
- Retrieve the repository file tree.
- Show file and folder entries.

**Status:** Implemented for local development.

### Feature 2C — Source Code Viewer

- Fetch file contents through the backend.
- Display source code inside the application.
- Syntax highlighting using Prism.js.
- Support for common source formats, including TypeScript, TSX, JavaScript, JSX, JSON, CSS, HTML, and Markdown.
- Display file name, path, and size.
- Open the original file on GitHub.
- Loading and error states.
- Close the code viewer.
- Automatically scroll to the selected file preview.
- Folder navigation and breadcrumbs in the repository browser.

**Status:** Implemented locally; continue verifying edge cases and large-repository behavior.

**Limitation:** Source preview is read-only. Patch generation, editing, committing, and applying repository changes are not implemented.

### Planned Features

The following capabilities are planned and are not yet implemented as complete production functionality:

- AI-assisted bug investigation.
- Root-cause analysis.
- Context-aware source-code retrieval.
- AI-generated patch proposals.
- Real code diff generation.
- Automated test execution.
- Background repair jobs.
- Persistent repair history.
- Secure patch approval and application.
- Audit logging and monitoring.
- Production deployment.

---

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | UI components and application rendering |
| TypeScript | Static typing |
| Vite | Development server and production build |
| React Router | Client-side routing |
| Lucide React | Icons |
| CSS | Styling and responsive layouts |
| Prism.js | Source-code syntax highlighting |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express | HTTP API and routing |
| TypeScript | Backend type safety |
| express-session | Session management |
| CORS | Frontend-to-backend cross-origin requests |
| GitHub OAuth | User authentication |
| GitHub REST API | Repository metadata, file trees, and source contents |

### Planned Infrastructure

These are possible future additions, not claims about the current implementation.

| Technology | Potential purpose |
|---|---|
| PostgreSQL | Persistent application data |
| Redis | Caching and job coordination |
| BullMQ | Background job processing |
| Docker | Isolated test execution |
| AI model APIs | Bug analysis and patch generation |
| GitHub Pull Requests API | Proposed fixes and review workflows |

Infrastructure choices will be finalized as the architecture evolves.

---

## Architecture

### Current Architecture

```text
Browser
   |
   v
React + TypeScript + Vite
   |
   | HTTP requests with session cookies
   v
Express Backend
   |
   +---- GitHub OAuth
   |
   +---- Session Management
   |
   +---- Authentication API
   |
   +---- GitHub Repository API
              |
              +---- User Repositories
              |
              +---- Repository Metadata
              |
              +---- Repository File Tree
              |
              +---- Source File Contents
```

The frontend communicates with the Express backend. The backend handles the OAuth flow, maintains the authenticated session, and requests repository information from GitHub.

Repair records, proposed patches, and test results remain separate from this GitHub integration and are not yet powered by a complete repair-processing backend.

### Intended Future Architecture

```text
React Frontend
      |
      v
Backend API
      |
      +---- Authentication and Authorization
      |
      +---- Persistent Database
      |
      +---- Repair Job Queue
                  |
                  v
             Repair Worker
                  |
          +-------+--------+
          |                |
          v                v
    Repository         AI Analysis
     Checkout         and Patch Draft
          |                |
          +-------+--------+
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

This is a target architecture, not a completed production system. Repository execution and patch application will require sandboxing, access controls, validation, and resource limits.

---

## Project Structure

The project contains a React frontend and a separate Express backend.

```text
PatchPilot/
├── server/
│   ├── src/
│   │   └── index.ts
│   ├── .env                  # Local secrets; never commit
│   └── package.json
├── src/
│   ├── components/
│   │   ├── AppLayout.tsx
│   │   └── RequireAuth.tsx
│   ├── data/
│   │   ├── mockRepairs.ts
│   │   ├── mockRepositories.ts
│   │   └── github.ts
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── NewRepair.tsx
│   │   ├── Repositories.tsx
│   │   ├── RepositoryDetails.tsx
│   │   ├── RepositoryDetails.css
│   │   ├── History.tsx
│   │   ├── RepairDetails.tsx
│   │   ├── Settings.tsx
│   │   └── Login.tsx
│   ├── App.tsx
│   └── index.css
├── public/
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

The exact project structure may evolve as new features are added. Keep this section synchronized with the repository.

---

## Getting Started

### Prerequisites

- Node.js LTS.
- npm.
- Git.
- A GitHub account.
- A code editor such as Visual Studio Code.

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd PatchPilot
```

Replace the placeholder with the URL of your GitHub repository.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure GitHub OAuth

Create a GitHub OAuth App in your GitHub Developer Settings.

For local development, configure:

| Setting | Value |
|---|---|
| Homepage URL | `http://localhost:5173` |
| Authorization callback URL | `http://localhost:3000/auth/github/callback` |

The callback URL must match the one configured in the OAuth application.

### 4. Configure environment variables

Create `server/.env` with the required values:

```dotenv
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
SESSION_SECRET=replace_with_a_long_random_secret
FRONTEND_URL=http://localhost:5173
PORT=3000
```

Use your actual OAuth credentials and a strong, randomly generated session secret.

Do not commit `server/.env` or expose the client secret in frontend code.

See [Environment Variables](#environment-variables) for details.

### 5. Start the application

From the project root, run:

```bash
npm run dev
```

The root development script starts the frontend and backend using the configured npm scripts.

Open the frontend URL printed in the terminal. In the current local configuration, this is typically:

```text
http://localhost:5173
```

### 6. Sign in with GitHub

1. Open the application.
2. Navigate to the login page if prompted.
3. Select the GitHub login option.
4. Authorize the OAuth application.
5. Return to PatchPilot.
6. Open the Repositories page to view available repositories.

Repository visibility and access depend on the authenticated GitHub account and the permissions granted to the application.

### 7. Browse source code

1. Open Repositories.
2. Search for or select a repository.
3. Open its details page.
4. Browse the available files and folders.
5. Select a source file to preview its contents.
6. Use the GitHub link to open the original file.

### 8. Build the application

```bash
npm run build
```

This runs the configured TypeScript build checks and creates the frontend production bundle.

---

## Environment Variables

The backend uses environment variables for OAuth configuration and session security.

| Variable | Purpose |
|---|---|
| `GITHUB_CLIENT_ID` | GitHub OAuth application client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth application client secret |
| `SESSION_SECRET` | Secret used to sign session identifiers |
| `FRONTEND_URL` | Frontend origin used for redirects and CORS |
| `PORT` | Backend port, typically `3000` locally |

Keep secret values in local environment files or an appropriate secrets manager.

The frontend should never contain the GitHub OAuth client secret or a server-side access token.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the frontend and backend development processes |
| `npm run dev:frontend` | Starts the Vite frontend |
| `npm run dev:backend` | Starts the backend development process |
| `npm run build` | Runs TypeScript build checks and builds the frontend |
| `npm run preview` | Previews the frontend production build |

Available scripts depend on the root and backend `package.json` configurations.

---

## Development Data

The current application combines real GitHub integration with local mock data for repair-related screens.

### Live GitHub Data

The GitHub integration retrieves repository information and source contents through the backend.

Examples include:

- Authenticated user information.
- Repository names and descriptions.
- Repository visibility and default branch.
- Star counts and update timestamps.
- Repository file-tree entries.
- Source file contents.

### Mock Repair Data

Repair-related screens may use illustrative data for:

- Sample repair records.
- Example code diffs.
- Example test statuses and output.
- Local-only approval, rejection, cancellation, and reset states.

These examples are not verified production repair results.

Do not treat mock test results as proof that a proposed patch fixes a real issue.

---

## Roadmap

### Phase 1 — Frontend Foundation

- [x] Application layout and navigation
- [x] Dashboard UI
- [x] New Repair form UI
- [x] Repair Details UI
- [x] Repositories page
- [x] History page
- [x] Production build verification during development
- [ ] Automated frontend tests
- [ ] Comprehensive responsive and accessibility testing

### Phase 2 — Backend and Authentication

- [x] Express backend foundation
- [x] GitHub OAuth flow
- [x] Session-based authentication
- [x] Current-user endpoint
- [x] Logout endpoint
- [x] Protected frontend routes
- [ ] Persistent session store for production
- [ ] Additional authorization and integration tests
- [ ] Production deployment configuration

### Phase 3 — Repository Integration

- [x] Fetch authenticated user's repositories
- [x] Search and filter repositories
- [x] Fetch repository metadata
- [x] Retrieve repository file-tree entries
- [x] Retrieve source file contents
- [x] Preview source code with syntax highlighting
- [x] Open repository and file links on GitHub
- [x] Implement local folder navigation and breadcrumbs
- [ ] Improve large-repository tree handling
- [ ] Add automated integration tests
- [ ] Add more robust file-type and binary-file handling

### Phase 4 — Repair Job Processing

- [ ] Define repair job API contracts and data models
- [ ] Persist repair submissions
- [ ] Implement repair job lifecycle
- [ ] Add background job processing
- [ ] Add progress and failure reporting
- [ ] Implement cancellation of actual running jobs

### Phase 5 — AI-Assisted Repair

- [ ] Analyze bug reports
- [ ] Identify relevant source files
- [ ] Implement root-cause analysis
- [ ] Generate proposed patches
- [ ] Validate patch structure
- [ ] Display real diffs for review

### Phase 6 — Testing and Review

- [ ] Execute tests in an isolated environment
- [ ] Collect real test output
- [ ] Display passed, failed, and skipped tests
- [ ] Implement secure approval and rejection workflows
- [ ] Apply patches through controlled operations
- [ ] Add repair audit history

### Phase 7 — Production Readiness

- [ ] Production authentication and authorization hardening
- [ ] Secure session storage and cookie configuration
- [ ] Secrets management
- [ ] Rate limiting and resource limits
- [ ] Audit logging
- [ ] Monitoring and error reporting
- [ ] Deployment documentation
- [ ] Security and integration testing

Checkboxes should reflect verified implementation status rather than planned work.

---

## Testing and Verification

For local development:

1. Install dependencies using `npm install`.
2. Configure the GitHub OAuth application.
3. Set the required backend environment variables.
4. Start the application using `npm run dev`.
5. Sign in with GitHub.
6. Verify repository listing, search, and language filtering.
7. Open a repository and inspect its metadata and file tree.
8. Preview source files and verify syntax highlighting.
9. Test folder navigation and breadcrumbs.
10. Test logout and protected-route behavior.
11. Run `npm run build`.
12. Review changes before committing.

Automated unit, integration, and end-to-end tests should be added as the project evolves.

A successful production build verifies compilation and bundling; it does not, by itself, verify all runtime behavior.

---

## Security Considerations

Repository access and future code-repair workflows require careful security controls.

Important considerations include:

- Never commit OAuth secrets, passwords, session secrets, or access tokens.
- Keep secrets on the backend.
- Validate OAuth state during the authorization flow.
- Restrict CORS to trusted origins.
- Use secure cookie settings in production.
- Use an appropriate persistent session store in production.
- Enforce authorization for repository access and repair operations.
- Handle GitHub API errors and rate limits appropriately.
- Treat repository contents and generated patches as untrusted input.
- Never execute arbitrary repository code directly on the application server without isolation.
- Use sandboxed workers and resource limits for test execution.
- Validate generated patches before applying them.
- Keep an audit trail of approval and application decisions.
- Avoid treating AI-generated changes as automatically safe or correct.

The current local-development configuration is not a complete production security setup. Production deployment requires additional hardening and testing.

---

## Contributing

Contributions and improvements are welcome.

Suggested workflow:

1. Create a focused branch.
2. Implement one feature or fix at a time.
3. Update this README when functionality changes.
4. Run `npm run build`.
5. Test the relevant application flow.
6. Review staged changes before committing.
7. Push the branch and open a pull request when appropriate.

Use clear commit messages, for example:

```text
feat: integrate GitHub repository listing
feat: add repository source viewer
fix: improve repository file navigation
docs: update project README
```

Never include environment files, secrets, or unrelated generated artifacts in a commit.

---

## License

No license has been selected yet. Until a license is added, do not assume the project is licensed for unrestricted reuse.
