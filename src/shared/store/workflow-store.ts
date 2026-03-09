'use client';

import { create } from 'zustand';
import {
  taskQueue,
  anomalyTasks,
  extractionTask,
  supplierTask,
} from '@shared/data/mock';
import type { QueueTask } from '@shared/data/mock';
import { anomalyNarratives } from '@shared/data/mock/anomaly-narratives';
import { supplierNarratives } from '@shared/data/mock/supplier-narratives';
import type {
  TaskWorkflowState,
  NarrativeMessage,
  StepOutput,
  WorkflowContext,
} from '@shared/lib/workflow/types';
import {
  getActiveSteps,
  getNextStepId,
  getPrevStepId,
  isLastStep,
} from '@shared/lib/workflow/engine';
import { getWorkflowConfig } from '@shared/lib/workflow/configs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveRawTask(taskId: string): any {
  return (
    anomalyTasks.find((t) => t.id === taskId) ??
    (extractionTask.id === taskId ? extractionTask : null) ??
    (supplierTask.id === taskId ? supplierTask : null)
  );
}

function buildContext(
  taskId: string,
  stepOutputs: Record<string, StepOutput>,
): WorkflowContext {
  return { taskId, task: resolveRawTask(taskId), stepOutputs };
}

// Narratives keyed by taskId:stepId — injected from mock, swappable with real API
const NARRATIVES: Record<string, string> = {
  ...anomalyNarratives,
  ...supplierNarratives,
};

function pickNarrative(taskId: string, stepId: string): string | null {
  return NARRATIVES[`${taskId}:${stepId}`] ?? null;
}

function makeNarrativeMsg(
  taskId: string,
  stepId: string,
  text: string,
): NarrativeMessage {
  return {
    id: `${taskId}:${stepId}:${Date.now()}`,
    taskId,
    stepId,
    text,
    timestamp: Date.now(),
  };
}

// ─── Store interface ──────────────────────────────────────────────────────────

type WorkflowStore = {
  tasks: QueueTask[];
  activeTaskId: string | null;
  workflowStates: Record<string, TaskWorkflowState>;
  narrativeMessages: NarrativeMessage[];

  selectTask: (taskId: string) => void;
  completeStep: (stepId: string, output: StepOutput) => void;
  goBack: () => void;
  dismissTask: () => void;

  // Derived — called from components to avoid re-computing in render
  getActiveContext: () => WorkflowContext | null;
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  tasks: taskQueue,
  activeTaskId: null,
  workflowStates: {},
  narrativeMessages: [],

  selectTask: (taskId) => {
    const { workflowStates, narrativeMessages } = get();
    const rawTask = resolveRawTask(taskId);
    if (!rawTask) return;

    if (!workflowStates[taskId]) {
      const config = getWorkflowConfig(rawTask.workflow);
      const ctx = buildContext(taskId, {});
      const firstStep = getActiveSteps(config, ctx)[0];
      if (!firstStep) return;

      const msgs: NarrativeMessage[] = [];
      const opened = pickNarrative(taskId, 'opened');
      if (opened) msgs.push(makeNarrativeMsg(taskId, 'opened', opened));
      const stepMsg = pickNarrative(taskId, firstStep.id);
      if (stepMsg) msgs.push(makeNarrativeMsg(taskId, firstStep.id, stepMsg));

      set({
        activeTaskId: taskId,
        workflowStates: {
          ...workflowStates,
          [taskId]: {
            currentStepId: firstStep.id,
            stepOutputs: {},
            status: 'active',
          },
        },
        narrativeMessages: [...narrativeMessages, ...msgs],
      });
    } else {
      set({ activeTaskId: taskId });
    }
  },

  completeStep: (stepId, output) => {
    const { activeTaskId, workflowStates, narrativeMessages } = get();
    if (!activeTaskId) return;
    const state = workflowStates[activeTaskId];
    const rawTask = resolveRawTask(activeTaskId);
    if (!state || !rawTask) return;

    const updatedOutputs = { ...state.stepOutputs, [stepId]: output };
    const config = getWorkflowConfig(rawTask.workflow);
    const ctx = buildContext(activeTaskId, updatedOutputs);

    const finished = isLastStep(config, ctx, stepId);
    const nextId = finished ? null : getNextStepId(config, ctx, stepId);

    const msgs: NarrativeMessage[] = [];
    if (nextId) {
      const text = pickNarrative(activeTaskId, nextId);
      if (text) msgs.push(makeNarrativeMsg(activeTaskId, nextId, text));
    }

    set({
      workflowStates: {
        ...workflowStates,
        [activeTaskId]: {
          ...state,
          currentStepId: nextId ?? stepId,
          stepOutputs: updatedOutputs,
          status: finished ? 'completed' : 'active',
        },
      },
      narrativeMessages: [...narrativeMessages, ...msgs],
    });
  },

  goBack: () => {
    const { activeTaskId, workflowStates } = get();
    if (!activeTaskId) return;
    const state = workflowStates[activeTaskId];
    const rawTask = resolveRawTask(activeTaskId);
    if (!state || !rawTask) return;

    const config = getWorkflowConfig(rawTask.workflow);
    const ctx = buildContext(activeTaskId, state.stepOutputs);
    const prevId = getPrevStepId(config, ctx, state.currentStepId);
    if (!prevId) return;

    set({
      workflowStates: {
        ...workflowStates,
        [activeTaskId]: { ...state, currentStepId: prevId, status: 'active' },
      },
    });
  },

  dismissTask: () => {
    const { activeTaskId, workflowStates } = get();
    if (!activeTaskId) return;
    const state = workflowStates[activeTaskId];
    if (!state) return;
    set({
      workflowStates: {
        ...workflowStates,
        [activeTaskId]: { ...state, status: 'dismissed' },
      },
      activeTaskId: null,
    });
  },

  getActiveContext: () => {
    const { activeTaskId, workflowStates } = get();
    if (!activeTaskId) return null;
    const state = workflowStates[activeTaskId];
    if (!state) return null;
    return buildContext(activeTaskId, state.stepOutputs);
  },
}));
