'use client'

import { CheckCircle2, XCircle, Loader2, RefreshCw, Send, AlertTriangle } from 'lucide-react'
import { personalizeEmail } from '@shared/data/mock/supplier'
import { cn } from '@shared/lib/shadcn'

// ─── Types ────────────────────────────────────────────────────────────────────

export type SendPhase = 'idle' | 'sending' | 'done'

export type SendResult = {
  supplierId: string
  name: string
  success: boolean
}

export type SelectedSupplier = {
  id: string
  name: string
  isOverdue: boolean
}

export type SupplierConfirmViewProps = {
  selectedSuppliers: SelectedSupplier[]
  phase: SendPhase
  results: SendResult[]
  retryingIds: Set<string>
  onSend: () => void
  onRetry: (supplierId: string) => void
  onComplete: () => void
  onBack: () => void
  isReadOnly: boolean
}

// ─── View ─────────────────────────────────────────────────────────────────────

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
  const successCount = results.filter((r) => r.success).length
  const failedResults = results.filter((r) => !r.success)
  const allDone = phase === 'done' && failedResults.length === 0

  return (
    <div className="flex flex-col gap-5 p-6">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          送信確認
        </p>
        <h2 className="text-lg font-semibold text-foreground">
          {phase === 'idle' && `${selectedSuppliers.length}社にリマインドメールを送信`}
          {phase === 'sending' && 'メール送信中...'}
          {phase === 'done' && (allDone ? '送信完了' : '送信結果')}
        </h2>
      </div>

      {phase === 'idle' && (
        <>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              送信対象 ({selectedSuppliers.length}社)
            </p>
            <div className="flex flex-col gap-1.5">
              {selectedSuppliers.map(({ id, name, isOverdue }) => {
                const email = personalizeEmail(name)
                return (
                  <div
                    key={id}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border px-3.5 py-2.5',
                      isOverdue ? 'border-red-200 bg-red-50/30' : 'border-border',
                    )}
                  >
                    <Send className={cn('size-3.5 shrink-0', isOverdue ? 'text-red-400' : 'text-muted-foreground')} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-semibold text-foreground">{name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{email.subject}</p>
                    </div>
                    {isOverdue && (
                      <span className="text-[10px] font-bold text-red-500 bg-red-50 ring-1 ring-red-200 rounded-full px-2 py-0.5">
                        期限超過
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary-50 px-4 py-3 flex items-start gap-3">
            <AlertTriangle className="size-4 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              各メールはサプライヤー名でパーソナライズされています。送信後の取り消しはできません。
            </p>
          </div>

          {!isReadOnly && (
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← 戻る
              </button>
              <button
                onClick={onSend}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-150"
              >
                <Send className="size-3.5" />
                {selectedSuppliers.length}件のメールを送信
              </button>
            </div>
          )}
        </>
      )}

      {phase === 'sending' && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader2 className="size-10 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">メールを送信しています...</p>
          <div className="flex flex-col gap-1.5 w-full max-w-xs">
            {selectedSuppliers.map(({ id, name }) => (
              <div key={id} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3 animate-spin shrink-0" />
                {name}
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <>
          <div className={cn(
            'rounded-xl p-4 flex items-center gap-3',
            allDone ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200',
          )}>
            {allDone
              ? <CheckCircle2 className="size-6 text-emerald-500 shrink-0" />
              : <AlertTriangle className="size-6 text-amber-500 shrink-0" />
            }
            <div>
              <p className={cn('text-sm font-semibold', allDone ? 'text-emerald-700' : 'text-amber-700')}>
                {allDone
                  ? `${successCount}件のメールを送信しました`
                  : `${successCount}件送信完了、${failedResults.length}件送信失敗`
                }
              </p>
              {!allDone && (
                <p className="text-xs text-amber-600 mt-0.5">失敗した送信先にリトライできます</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {results.map((r) => {
              const isRetrying = retryingIds.has(r.supplierId)
              return (
                <div
                  key={r.supplierId}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border px-3.5 py-2.5 transition-colors',
                    r.success ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/30',
                  )}
                >
                  {r.success
                    ? <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    : <XCircle className="size-4 text-red-400 shrink-0" />
                  }
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
              )
            })}
          </div>

          {!isReadOnly && (
            <div className="flex justify-end pt-1">
              <button
                onClick={onComplete}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-150"
              >
                <CheckCircle2 className="size-4" />
                完了
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
