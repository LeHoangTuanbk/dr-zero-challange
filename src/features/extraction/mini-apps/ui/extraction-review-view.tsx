'use client';

import { AlertTriangle, CheckCircle2, Pencil, Save } from 'lucide-react';
import { cn } from '@shared/lib/shadcn';
import type { ExtractionField } from '@shared/data/mock/extraction';

export type ExtractionReviewViewProps = {
  fields: ExtractionField[];
  edits: Record<string, string>;
  fileName: string | null;
  isSaved: boolean;
  onEdit: (key: string, val: string) => void;
  onSave: () => void;
  onBack: () => void;
  isReadOnly: boolean;
};

const ConfidenceBadge = ({ pct }: { pct: number }) => {
  const isLow = pct < 80;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1',
        isLow
          ? 'bg-red-50 text-red-600 ring-red-200'
          : 'bg-emerald-50 text-emerald-700 ring-emerald-200',
      )}
    >
      {isLow ? (
        <AlertTriangle className="size-2.5" />
      ) : (
        <CheckCircle2 className="size-2.5" />
      )}
      {pct}%
    </span>
  );
};

const FieldRow = ({
  field,
  value,
  onChange,
  isReadOnly,
}: {
  field: ExtractionField;
  value: string;
  onChange: (val: string) => void;
  isReadOnly: boolean;
}) => {
  const isLow = field.confidence_pct < 80;
  const canEdit = field.editable && !isReadOnly;

  return (
    <div
      className={cn(
        'grid grid-cols-[1fr_2fr_auto] items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors',
        isLow && 'border-red-200 bg-red-50/40',
      )}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] font-semibold text-muted-foreground">
          {field.field_ja}
        </span>
        <span className="text-[10px] text-muted-foreground/60">{field.field_en}</span>
      </div>

      <div className="flex items-center gap-2">
        {canEdit ? (
          <div className="relative flex-1">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={cn(
                'w-full rounded-md border px-3 py-1.5 pr-8 text-sm font-medium outline-none transition-colors',
                'border-border bg-card text-foreground',
                'focus:border-primary focus:ring-1 focus:ring-primary/30',
                isLow && 'border-red-300 bg-red-50 text-red-800',
              )}
            />
            <Pencil className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground/50" />
          </div>
        ) : (
          <span className="text-sm font-medium text-foreground">{value}</span>
        )}
      </div>

      <ConfidenceBadge pct={field.confidence_pct} />
    </div>
  );
};

export const ExtractionReviewView = ({
  fields,
  edits,
  fileName,
  isSaved,
  onEdit,
  onSave,
  onBack,
  isReadOnly,
}: ExtractionReviewViewProps) => {
  const lowCount = fields.filter((f) => f.confidence_pct < 80).length;

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            AI 抽出結果 · {fileName ?? '明細書'}
          </p>
          <h2 className="text-lg font-semibold text-foreground">データ確認・編集</h2>
        </div>
        {lowCount > 0 && !isSaved && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
            <AlertTriangle className="size-3" />
            {lowCount}件 要確認
          </span>
        )}
        {isSaved && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
            <CheckCircle2 className="size-3" />
            保存済み
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {fields.map((field) => (
          <FieldRow
            key={field.field_key}
            field={field}
            value={edits[field.field_key] ?? field.value}
            onChange={(val) => onEdit(field.field_key, val)}
            isReadOnly={isReadOnly || isSaved}
          />
        ))}
      </div>

      {!isReadOnly && !isSaved && (
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onBack}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← 戻る
          </button>
          <button
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            <Save className="size-4" />
            保存して完了
          </button>
        </div>
      )}
    </div>
  );
};
