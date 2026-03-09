"use client";

import { useWorkflowStore } from "@shared/store/workflow-store";
import { getWorkflowConfig } from "@shared/lib/workflow/configs";
import {
  getActiveSteps,
  getActiveStepIndex,
} from "@shared/lib/workflow/engine";
import { anomalyTasks } from "@shared/data/mock/anomaly";
import { extractionTask } from "@shared/data/mock/extraction";
import { supplierTask } from "@shared/data/mock/supplier";
import { TaskCard } from "./task-card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveRawTask(taskId: string): any {
  return (
    anomalyTasks.find((t) => t.id === taskId) ??
    (extractionTask.id === taskId ? extractionTask : null) ??
    (supplierTask.id === taskId ? supplierTask : null)
  );
}

export function TaskList() {
  const { tasks, activeTaskId, workflowStates, selectTask } =
    useWorkflowStore();

  return (
    <aside className="flex flex-col h-full bg-card border-r border-border">
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <div className="size-2 rounded-full bg-primary" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
            Dr.Zero
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          {tasks.length}件のタスク
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-2">
        {tasks.map((task) => {
          const state = workflowStates[task.id];
          const isActive = task.id === activeTaskId;

          let stepProgress: { current: number; total: number } | undefined;
          if (state?.status === "active") {
            try {
              const config = getWorkflowConfig(task.workflow);
              const rawTask = resolveRawTask(task.id);
              const ctx = {
                taskId: task.id,
                task: rawTask,
                stepOutputs: state.stepOutputs,
              };
              const activeSteps = getActiveSteps(config, ctx);
              const currentIdx = getActiveStepIndex(
                config,
                ctx,
                state.currentStepId,
              );
              stepProgress = { current: currentIdx, total: activeSteps.length };
            } catch {
              // workflow not yet registered
            }
          }

          return (
            <TaskCard
              key={task.id}
              task={task}
              isActive={isActive}
              stepProgress={stepProgress}
              workflowStatus={state?.status ?? "idle"}
              onClick={() => selectTask(task.id)}
            />
          );
        })}
      </div>
    </aside>
  );
}
