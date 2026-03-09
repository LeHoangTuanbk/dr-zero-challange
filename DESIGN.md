# Dr.Zero — Design Document

## 1. Mini-App Architecture

The core insight: every workflow step is a **mini-app** — a self-contained UI unit rendered in a canvas. Mini-apps are composable because they share a single contract:

```typescript
type MiniAppProps = {
  context: WorkflowContext; // task data + all previous step outputs
  onComplete: (output: StepOutput) => void;
  onBack: () => void;
  isReadOnly?: boolean;
};
```

Composability is achieved through three decoupled layers:

**Workflow config (JSON)** — defines step sequence and which mini-app key renders at each step. Adding a new workflow = one JSON file, zero component changes:

```json
{
  "id": "electricity-intake",
  "steps": [
    { "id": "upload", "miniApp": "ExtractionUpload" },
    { "id": "review", "miniApp": "ExtractionReview" }
  ]
}
```

**Mini-App Registry (JSON)** — `shared/config/mini-app-registry.json` maps string keys to feature + export name. The registry builds `React.lazy` components at module init. The canvas only ever receives a string key — it has zero knowledge of which component it will render.

**Feature Loaders** — webpack bundles each feature as a separate JS chunk. Adding a new feature = one line in the loader map + entries in the registry JSON.

```
Canvas → getMiniApp("ExtractionUpload")
       → React.lazy(FEATURE_LOADERS["extraction"])
       → component loaded on demand
```

**FSM branching** (Pattern A): each step config accepts a `skip` predicate evaluated at runtime against current context. Outlier anomalies get `chart → review → approve`; missing values skip the chart step. The workflow engine resolves the active step sequence on every transition — no conditional logic lives in components.

Each mini-app follows **Container/Presentational** split. Containers own state and data logic; views are pure render functions. The `withWorkflowStep` HOC wraps every container with an error boundary and loading skeleton.

---

## 2. Agent-to-UI Data Flow

In production, an AI backend emits events as tasks are processed. Proposed event shape:

```typescript
type AgentEvent = {
  type: 'task_queued' | 'step_ready' | 'extraction_result' | 'anomaly_detected';
  taskId: string;
  stepId?: string;
  payload: Record<string, unknown>; // typed per event type
  confidence?: number;
  timestamp: number;
};
```

**Transport**: Server-Sent Events (SSE) for agent → frontend push. Unidirectional, no WebSocket overhead, reconnects automatically. The workflow store subscribes to the stream and hydrates `stepOutputs` when results arrive.

Example flow for Pattern B:

1. Agent emits `task_queued { taskId: 'task-inp-001' }` → task appears in sidebar
2. User uploads file → frontend POSTs to `/api/extract`
3. Agent streams `extraction_result { fields: [...] }` → `ExtractionReview` reads from `context.stepOutputs['upload']`

`WorkflowContext.stepOutputs` is the **data contract boundary** — every step reads from and writes to it, regardless of whether data came from a real agent or mock. Swapping mock for real = changing one data source, not the component tree.

---

## 3. State and Transitions

Workflow state is a finite state machine per task, managed in Zustand:

```
           selectTask()
[idle] ──────────────────► [active]
                               │
                         completeStep() × N steps
                               │
                               ▼
                          [completed] ── isReadOnly=true, all steps show ✓
                               │
                         dismissTask()
                               ▼
                          [dismissed]
```

**StepOutputs as an append-only log**: each completed step writes to `stepOutputs[stepId]`. When the user navigates back (`goBack()`), the step re-mounts with its prior output already in context — edits are preserved across back/forward navigation.

**Active step resolution**: `getActiveSteps(config, context)` re-evaluates skip predicates on every transition. A step can become active or skipped mid-workflow based on data from a prior step, with no component changes needed.

---

## 4. Error Handling

**Component-level**: `withWorkflowStep` HOC wraps every mini-app in a React `ErrorBoundary`. Any render crash shows a localized recovery UI with retry — the rest of the app is unaffected.

**Partial operation failures** (Pattern C): the confirm step surfaces per-vendor send failures individually with retry buttons. The user sees exactly which emails failed — not a generic toast. Retry state is isolated per item.

**Extraction timeout** (Pattern B): the upload container tracks timers via `useRef`. If extraction exceeded a threshold, the phase would transition to `error`, surfacing a retry CTA. A real implementation catches the API promise rejection and sets `phase = 'error'` — the view already supports this state.

**Unknown workflow / mini-app**: the workflow engine throws on unknown workflow IDs; the canvas renders an inline error for unknown mini-app keys. Both are hard boundaries that prevent silent failures.

---

## With More Time

- **Real SSE integration**: replace mock narratives with a live `/api/agent-events` stream; the store interface is already shaped for it
- **Field mapping step** (Pattern B): after extraction, a drag-to-map UI where users confirm which extracted fields map to database columns
- **Registry from API**: `mini-app-registry.json` is already structured for remote fetch. `FEATURE_LOADERS` stays as a static allowlist (security boundary); only the JSON schema comes from a config service
- **Module Federation - Micro frontend**: each feature deployed as an independent remote — the registry's `feature` field would become a `remoteUrl`, enabling zero-downtime feature rollouts without a full frontend redeploy
