'use client';

import { createElement, Suspense } from 'react';
import { useWorkflowStore } from '@shared/store/workflow-store';
import { getWorkflowConfig } from '@shared/lib/workflow/configs';
import {
  getActiveSteps,
  getActiveStepIndex,
} from '@shared/lib/workflow/engine';
import { getMiniApp } from './registry';
import { WorkflowProgress } from './workflow-progress';
import { MiniAppSkeleton } from '@shared/ui/mini-app/mini-app-skeleton';
import type { MiniAppProps } from '@shared/lib/workflow/types';
import { EmptyState } from './empty-state';

type MiniAppHostProps = MiniAppProps & {
  miniAppKey: string;
};

const MiniAppHost = ({ miniAppKey, ...props }: MiniAppHostProps) => {
  const App = getMiniApp(miniAppKey);
  if (!App) {
    return (
      <div className="p-6 text-sm text-red-500">
        Mini-app not found: {miniAppKey}
      </div>
    );
  }
  return (
    <Suspense fallback={<MiniAppSkeleton />}>
      {createElement(App, props)}
    </Suspense>
  );
};

export const Canvas = () => {
  const {
    activeTaskId,
    workflowStates,
    completeStep,
    goBack,
    getActiveContext,
  } = useWorkflowStore();

  if (!activeTaskId) return <EmptyState />;

  const state = workflowStates[activeTaskId];
  if (!state) return <EmptyState />;

  const resolvedCtx = getActiveContext();
  if (!resolvedCtx?.task) return <MiniAppSkeleton />;

  const config = getWorkflowConfig(resolvedCtx.task.workflow);
  const activeSteps = getActiveSteps(config, resolvedCtx);
  const currentStep = activeSteps.find((s) => s.id === state.currentStepId);

  if (!currentStep) return <EmptyState />;

  const currentIndex = getActiveStepIndex(
    config,
    resolvedCtx,
    state.currentStepId,
  );
  const isCompleted = state.status === 'completed';
  const completedStepIds = isCompleted
    ? activeSteps.map((s) => s.id)
    : activeSteps.slice(0, currentIndex).map((s) => s.id);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-card shrink-0">
        <WorkflowProgress
          steps={activeSteps}
          currentStepId={state.currentStepId}
          completedStepIds={completedStepIds}
        />
        <span className="text-xs text-muted-foreground">
          {currentIndex + 1} / {activeSteps.length}
        </span>
      </div>

      <div
        key={`${activeTaskId}:${state.currentStepId}`}
        className="flex-1 overflow-y-auto animate-in slide-in-from-right-3 duration-250"
      >
        <MiniAppHost
          miniAppKey={currentStep.miniApp}
          context={resolvedCtx}
          onComplete={(output) => completeStep(currentStep.id, output)}
          onBack={currentIndex > 0 ? goBack : undefined}
          isReadOnly={isCompleted}
        />
      </div>
    </div>
  );
};
