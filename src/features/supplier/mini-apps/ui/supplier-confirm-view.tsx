'use client';

import { CheckCircle2, Send } from 'lucide-react';
import { ConfirmIdlePhase } from './confirm-idle-phase';
import { ConfirmSendingPhase } from './confirm-sending-phase';
import { ConfirmDonePhase } from './confirm-done-phase';

export type SendPhase = 'idle' | 'sending' | 'done';

export type SendResult = {
  supplierId: string;
  name: string;
  success: boolean;
};

export type SelectedSupplier = {
  id: string;
  name: string;
  isOverdue: boolean;
};

export type SupplierConfirmViewProps = {
  selectedSuppliers: SelectedSupplier[];
  phase: SendPhase;
  results: SendResult[];
  retryingIds: Set<string>;
  onSend: () => void;
  onRetry: (supplierId: string) => void;
  onComplete: () => void;
  onBack?: () => void;
  isReadOnly: boolean;
};

const PHASE_TITLE: Record<SendPhase, string> = {
  idle: '',
  sending: 'メール送信中...',
  done: '送信結果',
};

export const SupplierConfirmView = ({
  selectedSuppliers,
  phase,
  results,
  retryingIds,
  onSend,
  onRetry,
  onComplete,
  onBack,
  isReadOnly,
}: SupplierConfirmViewProps) => {
  const allDone = phase === 'done' && results.every((r) => r.success);

  return (
    <div className="flex flex-col gap-5 p-6">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          送信確認
        </p>
        <h2 className="text-lg font-semibold text-foreground">
          {phase === 'idle'
            ? `${selectedSuppliers.length}社にリマインドメールを送信`
            : phase === 'done' && allDone
              ? '送信完了'
              : PHASE_TITLE[phase]}
        </h2>
      </div>

      {phase === 'idle' && <ConfirmIdlePhase selectedSuppliers={selectedSuppliers} />}
      {phase === 'sending' && <ConfirmSendingPhase selectedSuppliers={selectedSuppliers} />}
      {phase === 'done' && (
        <ConfirmDonePhase
          results={results}
          retryingIds={retryingIds}
          onRetry={onRetry}
          isReadOnly={isReadOnly}
        />
      )}

      {!isReadOnly && phase !== 'sending' && (
        <div className="sticky bottom-0 bg-card border-t border-border -mx-6 px-6 py-3 flex items-center justify-between gap-3">
          {phase === 'idle' ? (
            <>
              {onBack && (
                <button
                  onClick={onBack}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← 戻る
                </button>
              )}
              <button
                onClick={onSend}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-150"
              >
                <Send className="size-3.5" />
                {selectedSuppliers.length}件のメールを送信
              </button>
            </>
          ) : (
            <div className="flex justify-end w-full">
              <button
                onClick={onComplete}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-150"
              >
                <CheckCircle2 className="size-4" />
                完了
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
