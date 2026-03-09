'use client';

import { createElement } from 'react';
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

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
      <div className="size-16 rounded-2xl bg-muted flex items-center justify-center">
        <span className="text-2xl">📋</span>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">
          タスクを選択してください
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          左のリストからタスクをクリックして開始
        </p>
      </div>
    </div>
  );
};

interface MiniAppHostProps extends MiniAppProps {
  miniAppKey: string;
}

function MiniAppHost({ miniAppKey, ...props }: MiniAppHostProps) {
  const App = getMiniApp(miniAppKey);
  if (!App) {
    return (
      <div className="p-6 text-sm text-red-500">
        Mini-app not found: {miniAppKey}
      </div>
    );
  }
  return createElement(App, props);
}

export function Canvas() {
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
  const completedStepIds = activeSteps.slice(0, currentIndex).map((s) => s.id);
  const isCompleted = state.status === 'completed';

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
          onBack={goBack}
          isReadOnly={isCompleted}
        />
      </div>
    </div>
  );
}
