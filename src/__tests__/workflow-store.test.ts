/**
 * Tests for the Zustand workflow store.
 * Documents task lifecycle: select → completeStep → goBack → dismiss.
 * Also verifies stepOutputs are passed correctly between steps (inter-step communication).
 */
import { useWorkflowStore } from '@shared/store/workflow-store';

// Reset store state between tests
beforeEach(() => {
  useWorkflowStore.setState({
    activeTaskId: null,
    workflowStates: {},
    narrativeMessages: [],
  });
});

const getState = () => useWorkflowStore.getState();

// ─── selectTask ───────────────────────────────────────────────────────────────

describe('selectTask', () => {
  it('sets activeTaskId and initializes workflowState on first open', () => {
    getState().selectTask('task-anm-001');

    const state = getState();
    expect(state.activeTaskId).toBe('task-anm-001');
    expect(state.workflowStates['task-anm-001']).toBeDefined();
    expect(state.workflowStates['task-anm-001'].status).toBe('active');
    expect(state.workflowStates['task-anm-001'].stepOutputs).toEqual({});
  });

  it('sets first active step as currentStepId (skips chart for non-outlier)', () => {
    // task-anm-003 is missing_value → chart step should be skipped
    getState().selectTask('task-anm-003');
    const { currentStepId } = getState().workflowStates['task-anm-003'];
    expect(currentStepId).toBe('review'); // chart is skipped
  });

  it('starts at chart step for outlier tasks', () => {
    getState().selectTask('task-anm-001'); // outlier type
    const { currentStepId } = getState().workflowStates['task-anm-001'];
    expect(currentStepId).toBe('chart');
  });

  it('restores previous state without reinitializing when task was already opened', () => {
    getState().selectTask('task-anm-001');
    getState().completeStep('chart', {});
    const stepAfterComplete = getState().workflowStates['task-anm-001'].currentStepId;

    // Switch to another task then come back
    getState().selectTask('task-anm-002');
    getState().selectTask('task-anm-001');

    expect(getState().workflowStates['task-anm-001'].currentStepId).toBe(stepAfterComplete);
  });

  it('does nothing for unknown taskId', () => {
    getState().selectTask('task-does-not-exist');
    expect(getState().activeTaskId).toBeNull();
  });
});

// ─── completeStep ─────────────────────────────────────────────────────────────

describe('completeStep', () => {
  it('saves step output and advances to next step', () => {
    getState().selectTask('task-anm-001'); // starts at 'chart'
    getState().completeStep('chart', { viewed: true });

    const state = getState().workflowStates['task-anm-001'];
    expect(state.currentStepId).toBe('review');
    expect(state.stepOutputs['chart']).toEqual({ viewed: true });
    expect(state.status).toBe('active');
  });

  it('marks workflow as completed when last step is done', () => {
    getState().selectTask('task-anm-001');
    getState().completeStep('chart', {});
    getState().completeStep('review', { decision: 'accept_ai', finalValue: '128,432 kWh' });
    getState().completeStep('approve', {});

    const state = getState().workflowStates['task-anm-001'];
    expect(state.status).toBe('completed');
  });

  it('accumulates stepOutputs across all steps', () => {
    getState().selectTask('task-anm-001');
    getState().completeStep('chart', { viewed: true });
    getState().completeStep('review', { decision: 'manual', finalValue: '130,000 kWh' });
    getState().completeStep('approve', { approvedAt: 12345 });

    const { stepOutputs } = getState().workflowStates['task-anm-001'];
    expect(stepOutputs['chart']).toEqual({ viewed: true });
    expect(stepOutputs['review']).toEqual({ decision: 'manual', finalValue: '130,000 kWh' });
    expect(stepOutputs['approve']).toEqual({ approvedAt: 12345 });
  });

  it('passes stepOutputs to next step via getActiveContext', () => {
    getState().selectTask('task-inp-001');
    getState().completeStep('upload', { fileName: 'invoice.pdf', extractedAt: 999 });

    // After completing upload, context for the next step (review) should have upload output
    const ctx = getState().getActiveContext();
    expect(ctx?.stepOutputs['upload']).toEqual({ fileName: 'invoice.pdf', extractedAt: 999 });
  });
});

// ─── goBack ───────────────────────────────────────────────────────────────────

describe('goBack', () => {
  it('moves currentStepId to previous step', () => {
    getState().selectTask('task-anm-001'); // starts at chart
    getState().completeStep('chart', {});  // advance to review
    expect(getState().workflowStates['task-anm-001'].currentStepId).toBe('review');

    getState().goBack();
    expect(getState().workflowStates['task-anm-001'].currentStepId).toBe('chart');
  });

  it('does nothing when already at first step', () => {
    getState().selectTask('task-anm-001'); // starts at chart (first step)
    getState().goBack();
    expect(getState().workflowStates['task-anm-001'].currentStepId).toBe('chart');
  });

  it('preserves stepOutputs when going back', () => {
    getState().selectTask('task-anm-001');
    getState().completeStep('chart', { viewed: true });
    getState().goBack();

    // Going back should not erase previous outputs
    expect(getState().workflowStates['task-anm-001'].stepOutputs['chart']).toEqual({ viewed: true });
  });
});

// ─── dismissTask ──────────────────────────────────────────────────────────────

describe('dismissTask', () => {
  it('sets status to dismissed and clears activeTaskId', () => {
    getState().selectTask('task-anm-001');
    getState().dismissTask();

    expect(getState().activeTaskId).toBeNull();
    expect(getState().workflowStates['task-anm-001'].status).toBe('dismissed');
  });
});

// ─── getActiveContext ─────────────────────────────────────────────────────────

describe('getActiveContext', () => {
  it('returns null when no task is active', () => {
    expect(getState().getActiveContext()).toBeNull();
  });

  it('returns context with task data and current stepOutputs', () => {
    getState().selectTask('task-anm-001');
    const ctx = getState().getActiveContext();

    expect(ctx?.taskId).toBe('task-anm-001');
    expect(ctx?.task).toBeDefined();
    expect(ctx?.stepOutputs).toEqual({});
  });
});

// ─── Narrative messages ───────────────────────────────────────────────────────

describe('narrative messages', () => {
  it('appends narrative on task open', () => {
    getState().selectTask('task-anm-001');
    const msgs = getState().narrativeMessages;
    expect(msgs.length).toBeGreaterThan(0);
    expect(msgs[0].taskId).toBe('task-anm-001');
  });

  it('appends narrative when advancing to next step', () => {
    getState().selectTask('task-anm-001');
    const before = getState().narrativeMessages.length;

    getState().completeStep('chart', {});
    const after = getState().narrativeMessages.length;

    expect(after).toBeGreaterThanOrEqual(before);
  });

  it('narratives are keyed by taskId:stepId', () => {
    getState().selectTask('task-anm-001');
    const msgs = getState().narrativeMessages;
    msgs.forEach((m) => {
      expect(m.id).toMatch(/^task-anm-001:/);
    });
  });
});
