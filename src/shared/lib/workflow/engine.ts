import type { WorkflowConfig, WorkflowContext, StepConfig } from './types'

/**
 * Returns only the steps that should be shown for a given context.
 * This is the core of the branching logic — adding a new branch = adding a
 * `skip` predicate to a StepConfig, zero code changes required.
 */
export function getActiveSteps(
  config: WorkflowConfig,
  ctx: WorkflowContext,
): StepConfig[] {
  return config.steps.filter((step) => !step.skip?.(ctx))
}

export function getStepById(
  config: WorkflowConfig,
  ctx: WorkflowContext,
  stepId: string,
): StepConfig | null {
  return getActiveSteps(config, ctx).find((s) => s.id === stepId) ?? null
}

export function getActiveStepIndex(
  config: WorkflowConfig,
  ctx: WorkflowContext,
  stepId: string,
): number {
  return getActiveSteps(config, ctx).findIndex((s) => s.id === stepId)
}

export function getNextStepId(
  config: WorkflowConfig,
  ctx: WorkflowContext,
  currentStepId: string,
): string | null {
  const active = getActiveSteps(config, ctx)
  const idx = active.findIndex((s) => s.id === currentStepId)
  return active[idx + 1]?.id ?? null
}

export function getPrevStepId(
  config: WorkflowConfig,
  ctx: WorkflowContext,
  currentStepId: string,
): string | null {
  const active = getActiveSteps(config, ctx)
  const idx = active.findIndex((s) => s.id === currentStepId)
  return active[idx - 1]?.id ?? null
}

export function isLastStep(
  config: WorkflowConfig,
  ctx: WorkflowContext,
  currentStepId: string,
): boolean {
  return getNextStepId(config, ctx, currentStepId) === null
}

export function isFirstStep(
  config: WorkflowConfig,
  ctx: WorkflowContext,
  currentStepId: string,
): boolean {
  return getPrevStepId(config, ctx, currentStepId) === null
}
