import { CheckCircle2, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@shared/lib/shadcn';
import type { SendResult } from './supplier-confirm-view';

type Props = {
  results: SendResult[];
  retryingIds: Set<string>;
  onRetry: (supplierId: string) => void;
  isReadOnly: boolean;
};

export const ConfirmDonePhase = ({ results, retryingIds, onRetry, isReadOnly }: Props) => {
  const successCount = results.filter((r) => r.success).length;
  const failedCount = results.filter((r) => !r.success).length;
  const allDone = failedCount === 0;

  return (
    <>
      <div
        className={cn(
          'rounded-xl p-4 flex items-center gap-3',
          allDone
            ? 'bg-emerald-50 border border-emerald-200'
            : 'bg-amber-50 border border-amber-200',
        )}
      >
        {allDone ? (
          <CheckCircle2 className="size-6 text-emerald-500 shrink-0" />
        ) : (
          <AlertTriangle className="size-6 text-amber-500 shrink-0" />
        )}
        <div>
          <p className={cn('text-sm font-semibold', allDone ? 'text-emerald-700' : 'text-amber-700')}>
            {allDone
              ? `${successCount}件のメールを送信しました`
              : `${successCount}件送信完了、${failedCount}件送信失敗`}
          </p>
          {!allDone && (
            <p className="text-xs text-amber-600 mt-0.5">失敗した送信先にリトライできます</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {results.map((r) => {
          const isRetrying = retryingIds.has(r.supplierId);
          return (
            <div
              key={r.supplierId}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-3.5 py-2.5 transition-colors',
                r.success ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/30',
              )}
            >
              {r.success ? (
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="size-4 text-red-400 shrink-0" />
              )}
              <span className="flex-1 text-[12.5px] font-medium text-foreground">{r.name}</span>
              {!r.success && !isReadOnly && (
                <button
                  onClick={() => onRetry(r.supplierId)}
                  disabled={isRetrying}
                  className={cn(
                    'inline-flex items-center gap-1 text-[11px] font-semibold rounded-full px-2.5 py-1 transition-all',
                    isRetrying
                      ? 'text-muted-foreground bg-muted cursor-not-allowed'
                      : 'text-red-600 bg-red-50 ring-1 ring-red-200 hover:bg-red-100',
                  )}
                >
                  <RefreshCw className={cn('size-2.5', isRetrying && 'animate-spin')} />
                  {isRetrying ? '再送信中' : '再送信'}
                </button>
              )}
              {r.success && (
                <span className="text-[10px] text-emerald-600 font-medium">送信済み</span>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
