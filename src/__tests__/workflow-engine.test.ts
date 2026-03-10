/**
 * Tests for the FSM workflow engine (pure functions).
 * These tests document how step branching, navigation, and skip predicates work.
 */
import {
  getActiveSteps,
  getNextStepId,
  getPrevStepId,
  isLastStep,
  isFirstStep,
} from '@shared/lib/workflow/engine';
import type {
  WorkflowConfig,
  WorkflowContext,
} from '@shared/lib/workflow/types';

const makeCtx = (
  taskId = 'task-001',
  task: Record<string, unknown> = { workflow: 'test' },
  stepOutputs: Record<string, Record<string, unknown>> = {},
): WorkflowContext => ({
  taskId,
  task: task as WorkflowContext['task'],
  stepOutputs,
});

const LINEAR_WORKFLOW: WorkflowConfig = {
  id: 'linear',
  title_ja: '線形ワークフロー',
  steps: [
    { id: 'step-a', miniApp: 'AppA', title_ja: 'ステップA' },
    { id: 'step-b', miniApp: 'AppB', title_ja: 'ステップB' },
    { id: 'step-c', miniApp: 'AppC', title_ja: 'ステップC' },
  ],
};

// Simulates anomaly workflow: step-chart is skipped if anomaly_type !== 'outlier'
const BRANCHING_WORKFLOW: WorkflowConfig = {
  id: 'branching',
  title_ja: '分岐ワークフロー',
  steps: [
    {
      id: 'chart',
      miniApp: 'AnomalyChart',
      title_ja: '異常分析',
      skip: (ctx) =>
        (ctx.task as unknown as { anomaly_type: string }).anomaly_type !==
        'outlier',
    },
    { id: 'review', miniApp: 'AnomalyReview', title_ja: 'データ確認' },
    { id: 'approve', miniApp: 'AnomalyApprove', title_ja: '承認' },
  ],
};

// ─── getActiveSteps ───────────────────────────────────────────────────────────

describe('getActiveSteps', () => {
  it('returns all steps when no skip predicates', () => {
    const steps = getActiveSteps(LINEAR_WORKFLOW, makeCtx());
    expect(steps.map((s) => s.id)).toEqual(['step-a', 'step-b', 'step-c']);
  });

  it('includes chart step when anomaly_type is outlier', () => {
    const ctx = makeCtx('t1', {
      workflow: 'branching',
      anomaly_type: 'outlier',
    });
    const steps = getActiveSteps(BRANCHING_WORKFLOW, ctx);
    expect(steps.map((s) => s.id)).toEqual(['chart', 'review', 'approve']);
  });

  it('skips chart step when anomaly_type is missing_value', () => {
    const ctx = makeCtx('t1', {
      workflow: 'branching',
      anomaly_type: 'missing_value',
    });
    const steps = getActiveSteps(BRANCHING_WORKFLOW, ctx);
    expect(steps.map((s) => s.id)).toEqual(['review', 'approve']);
  });

  it('skips chart step when anomaly_type is duplicate', () => {
    const ctx = makeCtx('t1', {
      workflow: 'branching',
      anomaly_type: 'duplicate',
    });
    const steps = getActiveSteps(BRANCHING_WORKFLOW, ctx);
    expect(steps.map((s) => s.id)).toEqual(['review', 'approve']);
  });
});

// ─── getNextStepId ────────────────────────────────────────────────────────────

describe('getNextStepId', () => {
  it('returns next step id in linear workflow', () => {
    expect(getNextStepId(LINEAR_WORKFLOW, makeCtx(), 'step-a')).toBe('step-b');
    expect(getNextStepId(LINEAR_WORKFLOW, makeCtx(), 'step-b')).toBe('step-c');
  });

  it('returns null at the last step', () => {
    expect(getNextStepId(LINEAR_WORKFLOW, makeCtx(), 'step-c')).toBeNull();
  });

  it('skips over chart and returns review when chart is skipped', () => {
    // When outlier: chart → review → approve
    const ctx = makeCtx('t1', {
      workflow: 'branching',
      anomaly_type: 'outlier',
    });
    expect(getNextStepId(BRANCHING_WORKFLOW, ctx, 'chart')).toBe('review');
  });

  it('returns approve after review when chart was skipped (missing_value)', () => {
    // When missing_value: review → approve (chart doesn't exist in active steps)
    const ctx = makeCtx('t1', {
      workflow: 'branching',
      anomaly_type: 'missing_value',
    });
    expect(getNextStepId(BRANCHING_WORKFLOW, ctx, 'review')).toBe('approve');
  });
});

// ─── getPrevStepId ────────────────────────────────────────────────────────────

describe('getPrevStepId', () => {
  it('returns previous step id', () => {
    expect(getPrevStepId(LINEAR_WORKFLOW, makeCtx(), 'step-b')).toBe('step-a');
    expect(getPrevStepId(LINEAR_WORKFLOW, makeCtx(), 'step-c')).toBe('step-b');
  });

  it('returns null at the first step', () => {
    expect(getPrevStepId(LINEAR_WORKFLOW, makeCtx(), 'step-a')).toBeNull();
  });

  it('goBack from review goes to chart when outlier', () => {
    const ctx = makeCtx('t1', {
      workflow: 'branching',
      anomaly_type: 'outlier',
    });
    expect(getPrevStepId(BRANCHING_WORKFLOW, ctx, 'review')).toBe('chart');
  });

  it('goBack from review returns null when chart is skipped (non-outlier)', () => {
    // review is now the first step — no previous
    const ctx = makeCtx('t1', {
      workflow: 'branching',
      anomaly_type: 'duplicate',
    });
    expect(getPrevStepId(BRANCHING_WORKFLOW, ctx, 'review')).toBeNull();
  });
});

// ─── isLastStep / isFirstStep ─────────────────────────────────────────────────

describe('isLastStep', () => {
  it('returns true only for the final step', () => {
    expect(isLastStep(LINEAR_WORKFLOW, makeCtx(), 'step-a')).toBe(false);
    expect(isLastStep(LINEAR_WORKFLOW, makeCtx(), 'step-b')).toBe(false);
    expect(isLastStep(LINEAR_WORKFLOW, makeCtx(), 'step-c')).toBe(true);
  });
});

describe('isFirstStep', () => {
  it('returns true only for the first step', () => {
    expect(isFirstStep(LINEAR_WORKFLOW, makeCtx(), 'step-a')).toBe(true);
    expect(isFirstStep(LINEAR_WORKFLOW, makeCtx(), 'step-b')).toBe(false);
  });

  it('review is the first step when chart is skipped', () => {
    const ctx = makeCtx('t1', {
      workflow: 'branching',
      anomaly_type: 'format_error',
    });
    expect(isFirstStep(BRANCHING_WORKFLOW, ctx, 'review')).toBe(true);
  });
});
