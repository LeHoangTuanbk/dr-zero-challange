import type { ComponentType } from 'react'

// ─── Workflow Config (pure data — no UI logic) ───────────────────────────────

export interface WorkflowConfig {
  id: string
  title_ja: string
  steps: StepConfig[]
}

export interface StepConfig {
  id: string
  miniApp: string       // key in MiniAppRegistry
  title_ja: string
  /** Return true to skip this step based on runtime context */
  skip?: (ctx: WorkflowContext) => boolean
}

// ─── Runtime Context ──────────────────────────────────────────────────────────

/** Accumulated state that flows through every step in the workflow */
export interface WorkflowContext {
  taskId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  task: any                              // raw task payload from queue
  stepOutputs: Record<string, StepOutput>
}

export type StepOutput = Record<string, unknown>

// ─── Mini-App Contract ────────────────────────────────────────────────────────

/** Every mini-app receives this unified interface */
export interface MiniAppProps {
  context: WorkflowContext
  onComplete: (output: StepOutput) => void
  onBack: () => void
  isReadOnly?: boolean     // true when reviewing a completed step
}

export type MiniAppComponent = ComponentType<MiniAppProps>

// ─── Chat Narrative ──────────────────────────────────────────────────────────

export interface NarrativeMessage {
  id: string
  taskId: string
  stepId: string
  text: string
  timestamp: number
}

// ─── Workflow Instance State (per task) ──────────────────────────────────────

export type WorkflowStatus = 'idle' | 'active' | 'completed' | 'dismissed'

export interface TaskWorkflowState {
  currentStepId: string
  stepOutputs: Record<string, StepOutput>
  status: WorkflowStatus
}
