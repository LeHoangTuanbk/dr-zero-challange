'use client';

import { CheckSquare, Square, Eye, Mail, Users } from 'lucide-react';
import type { Supplier } from '@shared/data/mock/supplier';
import { cn } from '@shared/lib/shadcn';

export type SupplierComposeViewProps = {
  suppliers: Supplier[];
  selectedIds: Set<string>;
  previewSupplierId: string | null;
  previewSubject: string;
  previewBody: string;
  previewName: string;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  onPreview: (id: string) => void;
  onNext: (selectedIds: string[]) => void;
  onBack: () => void;
  isReadOnly: boolean;
};

const STATUS_LABEL: Record<Supplier['status'], string> = {
  overdue: '期限超過',
  pending: '未回答',
  responded: '回答済み',
};

export const SupplierComposeView = ({
  suppliers,
  selectedIds,
  previewSupplierId,
  previewSubject,
  previewBody,
  previewName,
  onToggle,
  onToggleAll,
  onPreview,
  onNext,
  onBack,
  isReadOnly,
}: SupplierComposeViewProps) => {
  const allSelected = selectedIds.size === suppliers.length;

  return (
    <div className="flex flex-col gap-5 p-6">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          リマインドメール
        </p>
        <h2 className="text-lg font-semibold text-foreground">
          送信先とメール内容の確認
        </h2>
      </div>

      <div className="grid grid-cols-[1fr_1.2fr] gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <Users className="size-3.5" />
              送信先 ({selectedIds.size}/{suppliers.length})
            </div>
            {!isReadOnly && (
              <button
                onClick={onToggleAll}
                className="text-[10px] font-medium text-primary hover:underline"
              >
                {allSelected ? '選択解除' : '全選択'}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            {suppliers.map((supplier) => {
              const isSelected = selectedIds.has(supplier.id);
              const isOverdue = supplier.status === 'overdue';
              const isPreviewing = previewSupplierId === supplier.id;

              return (
                <div
                  key={supplier.id}
                  role="checkbox"
                  aria-checked={isSelected}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-all duration-150',
                    isReadOnly
                      ? 'cursor-default'
                      : 'cursor-pointer select-none',
                    isSelected &&
                      isPreviewing &&
                      'border-primary/40 bg-primary-50',
                    isSelected &&
                      !isPreviewing &&
                      'border-primary/30 bg-primary-50/50',
                    !isSelected && isPreviewing && 'border-border bg-muted/40',
                    !isSelected &&
                      !isPreviewing &&
                      'border-border bg-card hover:bg-muted/50',
                    isOverdue && !isSelected && 'border-red-200',
                  )}
                  onClick={() => {
                    if (!isReadOnly) onToggle(supplier.id);
                    onPreview(supplier.id);
                  }}
                >
                  {!isReadOnly && (
                    <span className="shrink-0 text-primary pointer-events-none">
                      {isSelected ? (
                        <CheckSquare className="size-4" />
                      ) : (
                        <Square className="size-4 text-border" />
                      )}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-foreground truncate">
                      {supplier.name}
                    </p>
                    <p
                      className={cn(
                        'text-[10px] font-semibold',
                        isOverdue ? 'text-red-500' : 'text-muted-foreground',
                      )}
                    >
                      {STATUS_LABEL[supplier.status]}
                    </p>
                  </div>
                  {isPreviewing && (
                    <Eye className="size-3 text-primary shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <Mail className="size-3.5" />
            プレビュー — {previewName}
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 flex flex-col gap-2.5 text-[12px]">
            <div className="pb-2 border-b border-border">
              <p className="text-[10px] text-muted-foreground mb-0.5 font-medium">
                件名
              </p>
              <p className="font-semibold text-foreground">{previewSubject}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">
                本文
              </p>
              <pre className="whitespace-pre-wrap font-sans leading-relaxed text-secondary-foreground text-[11.5px] max-h-52 overflow-y-auto">
                {previewBody}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {!isReadOnly && (
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onBack}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← 戻る
          </button>
          <button
            onClick={() => onNext([...selectedIds])}
            disabled={selectedIds.size === 0}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm transition-all duration-150',
              selectedIds.size > 0
                ? 'bg-primary text-white hover:bg-primary/90 active:scale-[0.98]'
                : 'bg-muted text-muted-foreground cursor-not-allowed',
            )}
          >
            {selectedIds.size}社に送信確認へ{' '}
            <span className="opacity-50">→</span>
          </button>
        </div>
      )}
    </div>
  );
};
