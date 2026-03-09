'use client';

import { useState } from 'react';
import { anomalyReviewFields } from '@shared/data/mock/anomaly';
import type { AnomalyTask } from '@shared/data/mock/anomaly';
import type { MiniAppProps, StepOutput } from '@shared/lib/workflow/types';
import { withWorkflowStep } from '@shared/ui/mini-app/with-workflow-step';
import { AnomalyReviewView, type ReviewDecision } from './anomaly-review-view';

// ─── Mode config (logic lives in container) ───────────────────────────────────

function resolveModeConfig(task: AnomalyTask) {
  switch (task.anomaly_type) {
    case 'outlier':
      return {
        badge: {
          label: '外れ値',
          color: 'bg-red-100 text-red-700 ring-red-200',
        },
        description: `${task.field_ja}の値が通常範囲（${task.expected_value}）を大幅に逸脱しています。`,
        hint: 'AI推奨値を採用するか、手動で正しい値を入力してください。',
      };
    case 'missing_value':
      return {
        badge: {
          label: '欠損値',
          color: 'bg-amber-100 text-amber-700 ring-amber-200',
        },
        description: `${task.field_ja}の値が未入力です（必須フィールド）。`,
        hint: 'AIが類似月のデータから推奨値を算出しました。担当部門に確認の上、採用してください。',
      };
    case 'duplicate':
      return {
        badge: {
          label: '重複',
          color: 'bg-orange-100 text-orange-700 ring-orange-200',
        },
        description: `${task.field_ja}に重複エントリが検出されています。`,
        hint: '重複の原因を確認し、不要なエントリを削除してください。',
      };
    case 'format_error':
      return {
        badge: {
          label: '形式エラー',
          color: 'bg-yellow-100 text-yellow-700 ring-yellow-200',
        },
        description: `${task.field_ja}が規定フォーマット（${task.expected_value}）と一致しません。`,
        hint: 'AI推奨値を確認するか、正しいフォーマットで手動修正してください。',
      };
  }
}

// ─── Container ────────────────────────────────────────────────────────────────

function AnomalyReviewContainer({
  context,
  onComplete,
  onBack,
  isReadOnly,
}: MiniAppProps) {
  const task = context.task as AnomalyTask;
  const fields = anomalyReviewFields[task.id] ?? [];

  // Hydrate edits from prior step output if user navigates back
  const [edits, setEdits] = useState<Record<string, string>>(() => {
    const prior = context.stepOutputs['review'] as
      | { edits?: Record<string, string> }
      | undefined;
    return prior?.edits ?? {};
  });

  const mode = resolveModeConfig(task);
  const lowConfidenceCount = fields.filter((f) => f.confidence_pct < 80).length;
  const hasAiSuggestion = fields.some((f) => f.field_ja === 'AI推奨値');
  const hasEdits = Object.keys(edits).length > 0;

  const handleDecide = (decision: ReviewDecision) => {
    const aiField = fields.find((f) => f.field_ja === 'AI推奨値');
    const detectedField = fields.find((f) => f.field_ja === '検出値');

    const finalValue =
      decision === 'accept_ai'
        ? (aiField?.value ?? '')
        : decision === 'manual'
          ? (edits[detectedField?.field_ja ?? ''] ?? detectedField?.value ?? '')
          : task.detected_value;

    const output: StepOutput = {
      decision,
      edits,
      finalValue,
      originalValue: detectedField?.value ?? task.detected_value,
      aiSuggestedValue: aiField?.value ?? null,
      field_ja: task.field_ja,
      facility_ja: task.facility_ja,
    };

    onComplete(output);
  };

  return (
    <AnomalyReviewView
      task={task}
      fields={fields}
      edits={edits}
      lowConfidenceCount={lowConfidenceCount}
      hasAiSuggestion={hasAiSuggestion}
      hasEdits={hasEdits}
      modeDescription={mode.description}
      modeHint={mode.hint}
      modeBadge={mode.badge}
      onEdit={(fieldJa, val) =>
        setEdits((prev) => ({ ...prev, [fieldJa]: val }))
      }
      onDecide={handleDecide}
      onBack={onBack}
      isReadOnly={isReadOnly ?? false}
    />
  );
}

export const AnomalyReviewApp = withWorkflowStep(AnomalyReviewContainer, {
  skeleton: 'review',
});
