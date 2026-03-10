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

**Mini-App Registry (JSON)** — `shared/config/mini-app-registry.json` maps string keys to feature + export name. The registry builds `React.lazy` components at module init. The canvas only ever receives a string key — it has zero knowledge of which component it will render. Think of this as a graph of available nodes — the workflow config adds edges between them. In production, this JSON would be fetched from a config service per user rather than bundled at build time.

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

In this prototype, workflow configs are bundled at `src/shared/lib/workflow/configs`. In production, they would be fetched from a database per task and user — the canvas renders them identically either way.

**Feature Loaders** — webpack bundles each feature as a separate JS chunk. Adding a new feature = one line in the loader map + entries in the registry JSON.

```
Canvas → getMiniApp("ExtractionUpload")
       → React.lazy(FEATURE_LOADERS["extraction"])
       → component loaded on demand
```

**Finite State Machine (FSM) branching** (Pattern A): each step config accepts a `skip` predicate evaluated at runtime against current context. The workflow engine resolves the active step sequence on every transition — no conditional logic lives in components.

For example, two tasks share the same workflow config `data-anomaly-review`, but get different step sequences based on `anomaly_type`:

```
task-anm-001  anomaly_type = "outlier"
  → getActiveSteps() = [chart, review, approve]   // 3 steps — chart shown

task-anm-003  anomaly_type = "missing_value"
  → getActiveSteps() = [review, approve]           // 2 steps — chart skipped
```

The skip predicate is declared in the workflow JSON and resolved at runtime:

```json
{ "id": "chart", "miniApp": "AnomalyChart", "skip": "skip_if_not_outlier" }
```

```ts
// predicates.ts
skip_if_not_outlier: (ctx) => ctx.task.anomaly_type !== 'outlier';
```

Adding a new branch = one predicate function + one `"skip"` key in JSON. No component changes required.

Each mini-app follows **Container/Presentational** split. Containers own state and data logic; views are pure render functions. The `withWorkflowStep` HOC wraps every container with an error boundary and loading skeleton.

---

## 2. Agent-to-UI Data Flow

The current implementation ships with pre-authored workflow JSON files. The natural evolution is to have the AI agent **compose workflows on-demand** from the mini-app graph, then persist them per task.

**How it works:**

```
1. Backend AI detects an event
        ↓
2. Agent reads mini-app-registry.json
   → understands available capabilities via description, input, output, prev/next
        ↓
3. Agent selects and orders relevant mini-apps
   → produces a workflow config
        ↓
4. Workflow saved to DB (keyed by userId + taskId)
        ↓
5. Frontend fetches workflow when users open that task
   → renders exactly as if it were a static JSON file
```

**Concrete example — agent receives anomaly event:**

```json
// Event from backend anomaly detection service
{
  "type": "anomaly_detected",
  "taskId": "task-anm-009",
  "payload": {
    "facility_ja": "大阪支社",
    "anomaly_type": "outlier",
    "field": "電力使用量",
    "detected_value": 98400,
    "expected_range": "12000–15000"
  }
}
```

Agent reads the registry, finds mini-apps whose `description` and `input` match the event payload:

```
AnomalyChart  → input needs task.anomaly_type ✓, task.facility_ja ✓
AnomalyReview → input needs task.id ✓, task.anomaly_type ✓
AnomalyApprove→ input needs stepOutputs.review.decision ✓
```

Agent traverses `next` edges: `AnomalyChart → AnomalyReview → AnomalyApprove`, then emits:

```json
// Workflow saved to DB for this task + user
{
  "id": "task-anm-009-workflow",
  "title_ja": "電力消費量の外れ値確認",
  "steps": [
    { "id": "chart", "miniApp": "AnomalyChart", "title_ja": "異常分析" },
    { "id": "review", "miniApp": "AnomalyReview", "title_ja": "データ確認" },
    { "id": "approve", "miniApp": "AnomalyApprove", "title_ja": "承認" }
  ]
}
```

## 3. State and Transitions

In frontend, workflow state is a per-task finite state machine stored in Zustand. Each task gets an independent entry in `workflowStates`, keyed by `taskId`:

```typescript
workflowStates: {
  'task-anm-001': {
    currentStepId: 'approve',
    status: 'active',
    stepOutputs: {
      chart:  {},
      review: { decision: 'accept_ai', finalValue: '128,432 kWh' },
    },
  },
  'task-inp-001': {
    currentStepId: 'review',
    status: 'completed',
    stepOutputs: {
      upload: { fileName: 'invoice_oct.pdf', extractedAt: 1709123456 },
      review: { edits: {}, finalFields: [...], savedAt: 1709123999 },
    },
  },
}
```

**Task lifecycle**:

```
           selectTask()
[idle] ──────────────────► [active]
                            │     │
              completeStep()│     │dismissTask()
                 × N steps  │     │
                            ▼     ▼
                       [completed] [dismissed]
                            │
                     isReadOnly=true
                     all steps show ✓
```

**`selectTask(taskId)`** — two branches:

- First open → resolves workflow config, evaluates skip predicates, initializes state at first active step
- Already opened → restores existing state; user continues exactly where they left off

**`completeStep(stepId, output)`**:

1. Writes `output` into `stepOutputs[stepId]` (append-only — prior steps are never mutated)
2. Re-evaluates `getNextStepId()` against updated context
3. If next step exists → `currentStepId = nextStepId`
4. If last step → `status = 'completed'`, `isReadOnly = true`

**`goBack()`** — sets `currentStepId` to previous active step. Prior `stepOutputs` are preserved, so the mini-app re-mounts with its last edited state intact. No data is lost on back navigation.

**`stepOutputs` as inter-step data contract**: each mini-app reads from `context.stepOutputs[priorStepId]` and writes via `onComplete(output)`. This is the only communication channel between steps — no shared component state, no prop drilling:

```
ExtractionUpload  onComplete({ fileName, extractedAt })
                       │
                       ▼  stored in stepOutputs['upload']
                       │
ExtractionReview  context.stepOutputs['upload'].fileName
                  → displays "AI 抽出結果 · invoice_oct.pdf"
```

**Active step resolution**: `getActiveSteps(config, context)` re-evaluates skip predicates on every transition. A step can become active or skipped mid-workflow based on data from a prior step, with no component changes needed. With a real database, `stepOutputs` could be hydrated from persisted task results on load — resuming mid-workflow across sessions without data loss.

---

## 4. Error Handling

**Component-level**: `withWorkflowStep` HOC wraps every mini-app in a React `ErrorBoundary`. Any render crash shows a localized recovery UI with retry — the rest of the app is unaffected.

**Partial operation failures** (Pattern C): the confirm step surfaces per-vendor send failures individually with retry buttons. The user sees exactly which emails failed. Retry state is isolated per item.

**Extraction timeout** (Pattern B): the upload container tracks timers via `useRef`. If extraction exceeded a threshold, the phase would transition to `error`, surfacing a retry CTA. A real implementation catches the API promise rejection and sets `phase = 'error'` — the view already supports this state.

**Unknown workflow / mini-app**: the workflow engine throws on unknown workflow IDs; the canvas renders an inline error for unknown mini-app keys. Both are hard boundaries that prevent silent failures.

---

## 5. With More Time

- **Registry from API**: `mini-app-registry.json` is already structured for remote fetch. `FEATURE_LOADERS` stays as a static allowlist (security boundary); only the JSON schema comes from a config service
- **Module Federation - Micro frontend**: each feature deployed as an independent remote — the registry's `feature` field would become a `remoteUrl`, enabling zero-downtime feature rollouts without a full frontend redeploy
- **Two-way AI chat**: the current chat panel is one-way (AI narrates per step). Using LLM, it becomes a real conversational assistant — the system prompt carries full task context (`taskId`, current step,...), so the user can ask any questions and get support from AI.
