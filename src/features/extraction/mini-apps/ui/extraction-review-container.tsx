'use client';

import { useState } from 'react';
import { extractionResult } from '@shared/data/mock/extraction';
import type { ExtractionTask } from '@shared/data/mock/extraction';
import type { MiniAppProps, StepOutput } from '@shared/lib/workflow/types';
import { withWorkflowStep } from '@shared/ui/mini-app/with-workflow-step';
import { ExtractionReviewView } from './extraction-review-view';

const ExtractionReviewContainer = ({
  context,
  onComplete,
  onBack,
  isReadOnly,
}: MiniAppProps) => {
  const task = context.task as ExtractionTask;
  const uploadOutput = context.stepOutputs['upload'] as
    | { fileName?: string }
    | undefined;

  const [edits, setEdits] = useState<Record<string, string>>(() => {
    const prior = context.stepOutputs['review'] as
      | { edits?: Record<string, string> }
      | undefined;
    return prior?.edits ?? {};
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    const finalFields = extractionResult.map((f) => ({
      ...f,
      value: edits[f.field_key] ?? f.value,
    }));
    const output: StepOutput = {
      edits,
      finalFields,
      facility_ja: task.facility_ja,
      period: task.period,
      savedAt: Date.now(),
    };
    setTimeout(() => onComplete(output), 800);
  };

  return (
    <ExtractionReviewView
      fields={extractionResult}
      edits={edits}
      fileName={uploadOutput?.fileName ?? null}
      isSaved={isSaved}
      onEdit={(key, val) => setEdits((prev) => ({ ...prev, [key]: val }))}
      onSave={handleSave}
      onBack={onBack}
      isReadOnly={isReadOnly ?? false}
    />
  );
};

export const ExtractionReviewApp = withWorkflowStep(ExtractionReviewContainer, {
  skeleton: 'review',
});
