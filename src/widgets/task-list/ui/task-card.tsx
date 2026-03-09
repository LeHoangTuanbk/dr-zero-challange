'use client';

import { AlertTriangle, FileInput, Mail } from 'lucide-react';
import { cn } from '@shared/lib/shadcn';
import type { QueueTask, TaskCategory } from '@shared/data/mock';
import type { WorkflowStatus } from '@shared/lib/workflow/types';
import { SEVERITY_CONFIG } from '../const/severity-config';
import { StepDots } from './step-dots';

const CATEGORY_ICON: Record<TaskCategory, React.ElementType> = {
  anomaly: AlertTriangle,
  extraction: FileInput,
  supplier: Mail,
};

type TaskCardProps = {
  task: QueueTask;
  isActive: boolean;
  stepProgress?: { current: number; total: number };
  workflowStatus?: WorkflowStatus;
  onClick: () => void;
};

export function TaskCard({
  task,
  isActive,
  stepProgress,
  workflowStatus = 'idle',
  onClick,
}: TaskCardProps) {
  const severity = task.severity ?? task.priority;
  const severityConfig = SEVERITY_CONFIG[severity];
  const Icon = CATEGORY_ICON[task.category];

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-xl pl-3 pr-3.5 py-3 transition-all duration-150',
        'border border-border border-l-[3px]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        severityConfig.border,
        isActive
          ? 'bg-primary-50 border-primary/20 shadow-sm'
          : 'bg-card hover:bg-muted/60 hover:shadow-sm',
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5">
          <Icon
            className={cn(
              'size-3.5 shrink-0',
              isActive ? 'text-primary' : 'text-muted-foreground',
            )}
          />
          <span
            className={cn(
              'rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide',
              severityConfig.badge,
            )}
          >
            {severityConfig.label}
          </span>
        </div>
        {workflowStatus === 'completed' && (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-primary bg-primary-50 rounded-full px-2 py-0.5 ring-1 ring-primary/20">
            ✓ 完了
          </span>
        )}
      </div>

      <p
        className={cn(
          'text-[12.5px] font-semibold leading-snug',
          isActive ? 'text-foreground' : 'text-secondary-foreground',
        )}
      >
        {task.title_ja}
      </p>
      <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
        {task.facility_ja}
      </p>

      {stepProgress && workflowStatus === 'active' && (
        <StepDots total={stepProgress.total} current={stepProgress.current} />
      )}
    </button>
  );
}
