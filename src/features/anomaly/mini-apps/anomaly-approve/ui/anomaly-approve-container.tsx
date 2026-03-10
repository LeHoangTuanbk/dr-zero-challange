'use client';

import { useState } from 'react';
import type { AnomalyTask } from '@shared/data/mock/anomaly';
import type { MiniAppProps } from '@shared/lib/workflow/types';
import { withWorkflowStep } from '@shared/ui/mini-app/with-workflow-step';
import { AnomalyApproveView } from './anomaly-approve-view';

type ReviewOutput = {
  decision: string;
  finalValue: string;
  originalValue: string;
  aiSuggestedValue: string | null;
  field_ja: string;
  facility_ja: string;
};

type SubmitState = 'idle' | 'submitting' | 'done';

const AnomalyApproveContainer = ({
  context,
  onComplete,
  onBack,
  isReadOnly,
}: MiniAppProps) => {
  const task = context.task as AnomalyTask;
  const reviewOutput = context.stepOutputs['review'] as unknown as
    | ReviewOutput
    | undefined;

  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const decision = reviewOutput?.decision ?? 'dismiss';
  const fromValue = reviewOutput?.originalValue ?? task.detected_value;
  const toValue = reviewOutput?.finalValue ?? '—';

  const handleApprove = () => {
    setSubmitState('submitting');
    setTimeout(() => {
      setSubmitState('done');
      onComplete({ approved: true, finalValue: toValue, decision });
    }, 800);
  };

  return (
    <AnomalyApproveView
      task={task}
      decision={decision}
      fromValue={fromValue}
      toValue={toValue}
      isSubmitting={submitState === 'submitting'}
      isDone={submitState === 'done'}
      isReadOnly={isReadOnly ?? false}
      onApprove={handleApprove}
      onBack={onBack ?? (() => {})}
    />
  );
};

export const AnomalyApproveApp = withWorkflowStep(AnomalyApproveContainer, {
  skeleton: 'approve',
});
