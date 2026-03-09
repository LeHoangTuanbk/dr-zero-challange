'use client';

import {
  Component,
  type ComponentType,
  type ReactNode,
  type ErrorInfo,
} from 'react';
import { AlertCircle } from 'lucide-react';
import type { MiniAppProps } from '@shared/lib/workflow/types';
import {
  MiniAppSkeleton,
  type MiniAppSkeletonVariant,
} from './mini-app-skeleton';

type ErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

class MiniAppErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(err: Error): ErrorBoundaryState {
    return { hasError: true, message: err.message };
  }

  override componentDidCatch(err: Error, info: ErrorInfo) {
    console.error('[MiniApp Error]', err, info);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
          <AlertCircle className="size-8 text-red-400" />
          <p className="text-sm font-medium text-slate-700">
            表示エラーが発生しました
          </p>
          <p className="text-xs text-slate-400">{this.state.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, message: '' })}
            className="mt-2 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
          >
            再試行
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

type WithWorkflowStepOptions = {
  skeleton?: MiniAppSkeletonVariant;
};

export function withWorkflowStep<P extends MiniAppProps>(
  Component: ComponentType<P>,
  options: WithWorkflowStepOptions = {},
) {
  function WorkflowStepWrapper(props: P) {
    if (!props.context?.taskId) {
      return <MiniAppSkeleton variant={options.skeleton} />;
    }

    return (
      <MiniAppErrorBoundary>
        <Component {...props} />
      </MiniAppErrorBoundary>
    );
  }

  WorkflowStepWrapper.displayName = `WithWorkflowStep(${
    Component.displayName ?? Component.name ?? 'Component'
  })`;

  return WorkflowStepWrapper;
}
