'use client';

import { Check } from 'lucide-react';
import { cn } from '@shared/lib/shadcn';
import type { StepConfig } from '@shared/lib/workflow/types';

type StepStatus = 'done' | 'active' | 'pending';

const StepPill = ({
  step,
  index,
  status,
  onClick,
}: {
  step: StepConfig;
  index: number;
  status: StepStatus;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={status === 'done' && onClick ? onClick : undefined}
      disabled={status !== 'done'}
      className={cn(
        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200',
        status === 'done' &&
          'bg-primary text-primary-foreground hover:bg-primary-700 cursor-pointer',
        status === 'active' &&
          'bg-primary-50 text-primary ring-1 ring-primary/40',
        status === 'pending' && 'bg-muted text-muted-foreground cursor-default',
      )}
    >
      <span
        className={cn(
          'flex size-4 items-center justify-center rounded-full text-[9px] font-bold',
          status === 'done' && 'bg-primary-foreground/20',
          status === 'active' && 'bg-primary text-primary-foreground',
          status === 'pending' && 'bg-border text-muted-foreground',
        )}
      >
        {status === 'done' ? <Check className="size-2.5" /> : index + 1}
      </span>
      {step.title_ja}
    </button>
  );
};

type WorkflowProgressProps = {
  steps: StepConfig[];
  currentStepId: string;
  completedStepIds: string[];
  onReviewStep?: (stepId: string) => void;
};

export function WorkflowProgress({
  steps,
  currentStepId,
  completedStepIds,
  onReviewStep,
}: WorkflowProgressProps) {
  const getStatus = (stepId: string): StepStatus => {
    if (completedStepIds.includes(stepId)) return 'done';
    if (stepId === currentStepId) return 'active';
    return 'pending';
  };

  return (
    <div className="flex items-center gap-1.5">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center gap-1.5">
          <StepPill
            step={step}
            index={i}
            status={getStatus(step.id)}
            onClick={onReviewStep ? () => onReviewStep(step.id) : undefined}
          />
          {i < steps.length - 1 && (
            <div
              className={cn(
                'h-px w-5 transition-colors duration-300',
                completedStepIds.includes(step.id)
                  ? 'bg-primary/40'
                  : 'bg-border',
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
