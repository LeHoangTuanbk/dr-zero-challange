import type { ComponentType } from 'react';

export type WorkflowConfig = {
  id: string;
  title_ja: string;
  steps: StepConfig[];
};

export type StepConfig = {
  id: string;
  miniApp: string;
  title_ja: string;
  skip?: (ctx: WorkflowContext) => boolean;
};

export type RawStepConfig = Omit<StepConfig, 'skip'> & { skip?: string };
export type RawWorkflowConfig = Omit<WorkflowConfig, 'steps'> & {
  steps: RawStepConfig[];
};

export type WorkflowTask = { workflow: string };

export type WorkflowContext = {
  taskId: string;
  task: WorkflowTask | null;
  stepOutputs: Record<string, StepOutput>;
};

export type StepOutput = Record<string, unknown>;

export type MiniAppProps = {
  context: WorkflowContext;
  onComplete: (output: StepOutput) => void;
  onBack?: () => void;
  isReadOnly?: boolean;
};

export type MiniAppComponent = ComponentType<MiniAppProps>;

export type NarrativeMessage = {
  id: string;
  taskId: string;
  stepId: string;
  text: string;
  timestamp: number;
};

export type WorkflowStatus = 'idle' | 'active' | 'completed' | 'dismissed';

export type TaskWorkflowState = {
  currentStepId: string;
  stepOutputs: Record<string, StepOutput>;
  status: WorkflowStatus;
};
