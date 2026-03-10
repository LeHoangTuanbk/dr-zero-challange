# Dr.Zero — AI-Powered Decarbonization Platform

**Live demo:** [VERCEL_URL](https://dr-zero-challange.vercel.app/)
**Video demo:** [VIDEO DEMO](https://drive.google.com/file/d/1oat4mzLwh538f8iq4_YAksmHi56geW5H/view?usp=sharing)

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

```bash
pnpm test          # run tests + coverage report
pnpm test:watch    # watch mode
```

---

## Tech Stack

| Concern      | Choice                      | Why                                                                                                                            |
| ------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Framework    | Next.js 16 (App Router)     |                                                                                                                                |
| Language     | TypeScript                  | Required for typed mini-app contracts                                                                                          |
| Styling      | Tailwind CSS                |                                                                                                                                |
| State        | Zustand                     | Minimal boilerplate for FSM workflow state                                                                                     |
| Charts       | Recharts (via shadcn/ui)    | Composable, works with Tailwind tokens                                                                                         |
| File upload  | react-dropzone              | drag-and-drop                                                                                                                  |
| Architecture | FSD (Feature-Sliced Design) | Clear ownership boundaries per feature                                                                                         |
| Pattern      | Configuration-Driven UI     | Workflows and mini-apps defined in JSON — new workflow = one config file, zero component changes => Align with Agent Driven UI |

---

## Architecture Highlights

**Configuration-Driven UI (CDUI):** workflows and mini-apps are defined in JSON. Adding a new workflow = one JSON file under `shared/lib/workflow/configs/`. Each workflow config declares its own step sequence, mini-app keys, and skip predicates — fully isolated, no component changes required. Adding a new mini-app = one entry in `shared/config/mini-app-registry.json`.

**FSM Workflow Engine:** each task runs as a finite state machine (`idle → active → completed → dismissed`). Steps are resolved dynamically — skip predicates in the config enable branching without touching components.

**Lazy-Loaded Mini-App Registry:** `mini-app-registry.json` maps string keys to feature chunks. The canvas resolves components via `React.lazy` at runtime — it has zero static knowledge of which component it will render.

**Container / Presentational split:** every mini-app is two files — `*-container.tsx` owns state and logic, `*-view.tsx` is a pure render function.

---

## Assumptions & Deviations

- **No real backend.** AI extraction, anomaly detection, and email sending are all simulated with realistic delays and partial-failure states.
- **Pattern B approval step omitted.** The assignment suggests `upload → extract → review → approve → save`. The review step itself acts as the approval — saving is the final commit action. A separate approve mini-app would add no UX value in this prototype.

---

## Project Structure

```
src/
├── app/                               # Next.js App Router
├── __tests__/
│   ├── workflow-engine.test.ts        # Pure FSM engine — branching, navigation, skip predicates
│   └── workflow-store.test.ts         # Zustand store — task lifecycle, inter-step data passing
├── features/
│   ├── anomaly/mini-apps/             # Pattern A — 3 mini-apps
│   ├── extraction/mini-apps/          # Pattern B — 2 mini-apps
│   └── supplier/mini-apps/            # Pattern C — 3 mini-apps
├── shared/
│   ├── config/mini-app-registry.json  # CDUI registry (source of truth)
│   ├── data/mock/                     # Typed mock data
│   ├── lib/workflow/                  # FSM engine + workflow configs
│   └── store/workflow-store.ts        # Zustand global state
└── widgets/
    ├── canvas/                        # Mini-app renderer
    ├── task-list/                     # Sidebar task queue
    └── chat-panel/                    # AI narrative panel
```

See [DESIGN.md](./DESIGN.md) for architecture decisions and agent integration proposal.
