
# PatchPilot

AI-powered code repair platform built with a modern TypeScript stack.

## Current Status

**Feature 1A — Application Layout:** Initial implementation.

> This is the frontend foundation. Repository integration, AI repair execution, backend APIs, and persistent data are not implemented yet.

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Lucide React
- Custom CSS design system

## Features

### Frontend Foundation 

- [x] Application shell with sidebar and top navigation
- [x] Dashboard page
- [x] New Repair page
- [x] Repositories page
- [x] Repair History page
- [x] Shared Button, Card, Badge, Dialog, and LoadingState components
- [x] Responsive layout for desktop and mobile
- [ ] Automated tests and manual verification
- [ ] Backend integration

Checkboxes above describe the intended implementation. Mark them complete only after the relevant files exist and verification passes.

## Getting Started

### Prerequisites

- Node.js (current supported LTS release recommended)
- npm
- VS Code

### Installation

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```text
PatchPilot/
├── src/
│   ├── components/
│   │   ├── AppLayout.tsx
│   │   └── ui.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── NewRepair.tsx
│   │   ├── Repositories.tsx
│   │   └── History.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
└── README.md
```

## Roadmap

1. Frontend Foundation
2. Backend API Foundation
3. Database and Infrastructure
4. AI Repair Engine
5. Secure Code Execution
6. Testing, Observability, and Deployment

## Development Convention

After every feature:

1. Implement the feature.
2. Run the application and relevant tests.
3. Fix regressions.
4. Update this README to reflect verified changes.
5. Commit the completed feature.
