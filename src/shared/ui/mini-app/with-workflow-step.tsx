'use client';

import { type ComponentType } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { AlertCircle } from 'lucide-react';
import type { MiniAppProps } from '@shared/lib/workflow/types';
import {
  MiniAppSkeleton,
  type MiniAppSkeletonVariant,
} from './mini-app-skeleton';

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
      <AlertCircle className="size-8 text-red-400" />
      <p className="text-sm font-medium text-slate-700">
        表示エラーが発生しました
      </p>
      <p className="text-xs text-slate-400">{(error as Error).message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-2 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
      >
        再試行
      </button>
    </div>
  );
};

type WithWorkflowStepOptions = {
  skeleton?: MiniAppSkeletonVariant;
};

export const withWorkflowStep = <P extends MiniAppProps>(
  Component: ComponentType<P>,
  options: WithWorkflowStepOptions = {},
) => {
  const WorkflowStepWrapper = (props: P) => {
    if (!props.context?.taskId) {
      return <MiniAppSkeleton variant={options.skeleton} />;
    }

    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  WorkflowStepWrapper.displayName = `WithWorkflowStep(${
    Component.displayName ?? Component.name ?? 'Component'
  })`;

  return WorkflowStepWrapper;
};
