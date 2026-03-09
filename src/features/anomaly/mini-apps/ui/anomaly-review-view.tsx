'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Pencil, X, Check } from 'lucide-react';
import type {
  AnomalyTask,
  AnomalyReviewField,
} from '@shared/data/mock/anomaly';
import { cn } from '@shared/lib/shadcn';

export type ReviewDecision = 'accept_ai' | 'manual' | 'dismiss';

export type AnomalyReviewViewProps = {
  task: AnomalyTask;
  fields: AnomalyReviewField[];
  edits: Record<string, string>;
  lowConfidenceCount: number;
  hasAiSuggestion: boolean;
  hasEdits: boolean;
  modeDescription: string;
  modeHint: string;
  modeBadge: { label: string; color: string };
  onEdit: (fieldJa: string, value: string) => void;
  onDecide: (decision: ReviewDecision) => void;
  onBack: () => void;
  isReadOnly: boolean;
};

const ConfidenceBadge = ({ pct }: { pct: number }) => {
  const isLow = pct < 80;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
        isLow
          ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
          : 'bg-green-50 text-green-700 ring-1 ring-green-200',
      )}
    >
      {isLow ? (
        <AlertTriangle className="size-3" />
      ) : (
        <CheckCircle2 className="size-3" />
      )}
      {pct}%
    </span>
  );
};

type FieldRowProps = {
  field: AnomalyReviewField;
  editedValue: string | undefined;
  onEdit: (val: string) => void;
  isReadOnly: boolean;
};

const FieldRow = ({
  field,
  editedValue,
  onEdit,
  isReadOnly,
}: FieldRowProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(editedValue ?? field.value);
  const display = editedValue ?? field.value;
  const isModified = editedValue !== undefined && editedValue !== field.value;

  const commit = () => {
    onEdit(draft);
    setEditing(false);
  };

  return (
    <tr
      className={cn(
        'border-b border-slate-100 last:border-0',
        field.confidence_pct < 80 && 'bg-red-50/30',
      )}
    >
      <td className="py-3 pl-4 pr-3 text-sm font-medium text-slate-700 whitespace-nowrap w-36">
        {field.field_ja}
      </td>
      <td className="py-3 px-3 text-sm text-slate-900 w-full">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commit();
                if (e.key === 'Escape') setEditing(false);
              }}
              className="flex-1 rounded-md border border-primary/60 px-2 py-1 text-sm outline-none ring-2 ring-primary/30"
            />
            <button
              onClick={commit}
              className="text-green-600 hover:text-green-700"
            >
              <Check className="size-4" />
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <span
            className={cn(
              isModified && 'text-secondary-foreground font-medium',
            )}
          >
            {display}
            {isModified && (
              <span className="ml-2 text-xs text-slate-400 line-through">
                {field.value}
              </span>
            )}
          </span>
        )}
      </td>
      <td className="py-3 px-3 whitespace-nowrap">
        {isModified ? (
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-200">
            手動
          </span>
        ) : (
          <ConfidenceBadge pct={field.confidence_pct} />
        )}
      </td>
      <td className="py-3 pr-4 w-8">
        {field.editable && !isReadOnly && !editing && (
          <button
            onClick={() => {
              setDraft(display);
              setEditing(true);
            }}
            className="text-slate-300 hover:text-primary transition-colors"
          >
            <Pencil className="size-3.5" />
          </button>
        )}
      </td>
    </tr>
  );
};

export const AnomalyReviewView = ({
  task,
  fields,
  edits,
  lowConfidenceCount,
  hasAiSuggestion,
  hasEdits,
  modeDescription,
  modeHint,
  modeBadge,
  onEdit,
  onDecide,
  onBack,
  isReadOnly,
}: AnomalyReviewViewProps) => {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1',
              modeBadge.color,
            )}
          >
            {modeBadge.label}
          </span>
          <span className="text-xs text-slate-400">{task.facility_ja}</span>
        </div>
        <h2 className="text-base font-semibold text-slate-900">
          {task.title_ja}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{modeDescription}</p>
      </div>

      {lowConfidenceCount > 0 && (
        <div className="flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5">
          <AlertTriangle className="size-4 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-800">
            <span className="font-semibold">{lowConfidenceCount}件</span>
            の低信頼度フィールドを確認してください
          </p>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="py-2.5 pl-4 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                フィールド
              </th>
              <th className="py-2.5 px-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                値
              </th>
              <th className="py-2.5 px-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                信頼度
              </th>
              <th className="py-2.5 pr-4" />
            </tr>
          </thead>
          <tbody>
            {fields.map((field) => (
              <FieldRow
                key={field.field_ja}
                field={field}
                editedValue={edits[field.field_ja]}
                onEdit={(val) => onEdit(field.field_ja, val)}
                isReadOnly={isReadOnly}
              />
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400 italic">{modeHint}</p>

      {!isReadOnly && (
        <div className="sticky bottom-0 bg-card border-t border-border -mx-6 px-6 py-3 flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← 戻る
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDecide('dismiss')}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              却下
            </button>
            {hasEdits && (
              <button
                onClick={() => onDecide('manual')}
                className="rounded-lg border border-primary/40 bg-primary-50 px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-primary-100 transition-colors"
              >
                手動修正で承認へ
              </button>
            )}
            {hasAiSuggestion && (
              <button
                onClick={() => onDecide('accept_ai')}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-700 active:scale-[0.98] transition-all"
              >
                AI推奨値で承認へ →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
