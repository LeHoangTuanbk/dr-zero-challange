# Dr.Zero — AI-Powered Decarbonization Platform

**Live demo:** [VERCEL_URL]

---

## Overview

A working prototype of Dr.Zero's agentic UI — a task-driven interface where AI orchestrates workflows for corporate decarbonization data management. Three workflow patterns are implemented across 8 mini-apps.

---

## Run Locally

**Prerequisites:** Node.js 18+, pnpm

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables required — all data is mocked.

---

## Tech Stack

| Concern      | Choice                      | Why                                              |
| ------------ | --------------------------- | ------------------------------------------------ |
| Framework    | Next.js 15 (App Router)     | SSR + client components, ideal for Vercel deploy |
| Language     | TypeScript                  | Required for typed mini-app contracts            |
| Styling      | Tailwind CSS                | Utility-first, consistent design tokens          |
| State        | Zustand                     | Minimal boilerplate for FSM workflow state       |
| Charts       | Recharts (via shadcn/ui)    | Composable, works with Tailwind tokens           |
| File upload  | react-dropzone              | Headless, accessible drag-and-drop               |
| Architecture | FSD (Feature-Sliced Design) | Clear ownership boundaries per feature           |
| Pattern      | Configuration-Driven UI     | Workflows and mini-apps defined in JSON — new workflow = one config file, zero component changes |

---

## Architecture Highlights

**Configuration-Driven UI (CDUI):** workflows and mini-apps are defined in JSON. Adding a new workflow = one JSON file. Adding a mini-app = one entry in `shared/config/mini-app-registry.json`.

**FSM Workflow Engine:** each task runs as a finite state machine (`idle → active → completed → dismissed`). Steps are resolved dynamically — skip predicates in the config enable branching without touching components.

**Lazy-Loaded Mini-App Registry:** `mini-app-registry.json` maps string keys to feature chunks. The canvas resolves components via `React.lazy` at runtime — it has zero static knowledge of which component it will render.

**Container / Presentational split:** every mini-app is two files — `*-container.tsx` owns state and logic, `*-view.tsx` is a pure render function.

---

## Assumptions & Deviations

- **No real backend.** AI extraction, anomaly detection, and email sending are all simulated with realistic delays and partial-failure states.
- **Pattern B approval step omitted.** The assignment suggests `upload → extract → review → approve → save`. The review step itself acts as the approval — saving is the final commit action. A separate approve mini-app would add no UX value in this prototype.
- **Supplier terminology.** The mock data uses "vendor" but "supplier" is the correct Scope 3 domain term. All code uses `supplier`.
- **Japanese UI labels.** All primary labels are in Japanese per spec. English subtitles are included for secondary fields.

---

## Project Structure

```
src/
├── app/                               # Next.js App Router
├── features/
│   ├── anomaly/mini-apps/             # Pattern A — 3 mini-apps
│   ├── extraction/mini-apps/          # Pattern B — 2 mini-apps
│   └── supplier/mini-apps/            # Pattern C — 3 mini-apps
├── shared/
│   ├── config/mini-app-registry.json  # CDUI registry (source of truth)
│   ├── data/mock/                     # Typed mock data (all 8 sheets)
│   ├── lib/workflow/                  # FSM engine + workflow configs
│   └── store/workflow-store.ts        # Zustand global state
└── widgets/
    ├── canvas/                        # Mini-app renderer
    ├── task-list/                     # Sidebar task queue
    └── chat-panel/                    # AI narrative panel
```

See [DESIGN.md](./DESIGN.md) for architecture decisions and agent integration proposal.
