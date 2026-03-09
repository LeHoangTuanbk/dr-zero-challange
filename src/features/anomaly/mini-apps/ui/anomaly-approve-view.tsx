'use client'

import { CheckCircle2, ArrowRight, RotateCcw, XCircle, Sparkles } from 'lucide-react'
import type { AnomalyTask } from '@shared/data/mock/anomaly'
import { cn } from '@shared/lib/shadcn'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AnomalyApproveViewProps = {
  task: AnomalyTask
  decision: string
  fromValue: string
  toValue: string
  isSubmitting: boolean
  isDone: boolean
  isReadOnly: boolean
  onApprove: () => void
  onBack: () => void
}

// ─── View ─────────────────────────────────────────────────────────────────────

export const AnomalyApproveView = ({
  task,
  decision,
  fromValue,
  toValue,
  isSubmitting,
  isDone,
  isReadOnly,
  onApprove,
  onBack,
}: AnomalyApproveViewProps) => {
  const isDismiss = decision === 'dismiss'
  const isAcceptAI = decision === 'accept_ai'

  if (isDone) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="size-8 text-emerald-600" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground">承認完了</h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-xs">
            {task.facility_ja}の{task.field_ja}が正常に更新されました。
            変更はScope 1排出量レポートに反映されます。
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-8 py-4 text-center">
          <p className="text-xs text-emerald-600 mb-1 font-medium uppercase tracking-wide">修正後の値</p>
          <p className="text-2xl font-bold text-emerald-800">{toValue}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 p-6 h-full">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          {task.facility_ja} / {task.field_ja}
        </p>
        <h2 className="text-lg font-semibold text-foreground">修正内容の確認</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          以下の修正を承認するとデータベースに反映されます。
        </p>
      </div>

      {/* Diff card */}
      {!isDismiss && (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border bg-muted/50 px-4 py-2.5 flex items-center gap-2">
            {isAcceptAI ? (
              <>
                <Sparkles className="size-3.5 text-primary" />
                <span className="text-xs font-medium text-secondary-foreground">AI推奨値を採用</span>
              </>
            ) : (
              <>
                <span className="size-1.5 rounded-full bg-amber-500" />
                <span className="text-xs font-medium text-amber-700">手動修正</span>
              </>
            )}
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center">
            <div className="p-5">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">修正前</p>
              <p className="text-lg font-semibold text-red-500 line-through decoration-red-300">{fromValue}</p>
            </div>
            <div className="flex items-center justify-center px-3">
              <ArrowRight className="size-5 text-border" />
            </div>
            <div className="p-5">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">修正後</p>
              <p className="text-lg font-bold text-emerald-700">{toValue}</p>
            </div>
          </div>
        </div>
      )}

      {isDismiss && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="size-4 text-orange-500" />
            <p className="text-sm font-semibold text-orange-800">この異常を却下します</p>
          </div>
          <p className="text-sm text-orange-700">
            却下すると現在の値が維持されます。後から再検討することも可能です。
          </p>
        </div>
      )}

      <div className="rounded-lg border border-border bg-muted/40 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-secondary-foreground">影響範囲：</span>{' '}
          {task.facility_ja}の2024年10月{task.field_ja}レコード。変更はScope 1排出量の月次集計に即時反映されます。
        </p>
      </div>

      <div className="flex-1" />

      {!isReadOnly && (
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="size-3.5" /> 編集に戻る
          </button>
          <button
            onClick={onApprove}
            disabled={isSubmitting}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-sm',
              'active:scale-[0.98] transition-all duration-150',
              isDismiss ? 'bg-slate-600 hover:bg-slate-700' : 'bg-primary hover:bg-primary/90',
              isSubmitting && 'opacity-70 cursor-not-allowed',
            )}
          >
            {isSubmitting ? (
              <>
                <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                処理中...
              </>
            ) : isDismiss ? (
              '却下を確定する'
            ) : (
              <>
                <CheckCircle2 className="size-4" /> 承認する
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
