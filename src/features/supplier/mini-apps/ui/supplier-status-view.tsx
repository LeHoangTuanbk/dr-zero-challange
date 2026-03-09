'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, AlertCircle, Clock, CheckCircle2, Lightbulb } from 'lucide-react'
import { supplierChart, supplierChartInsights } from '@shared/data/mock/supplier'
import type { SupplierTask, Supplier } from '@shared/data/mock/supplier'
import { cn } from '@shared/lib/shadcn'

// ─── Types ────────────────────────────────────────────────────────────────────

export type SupplierStatusViewProps = {
  task: SupplierTask
  suppliers: Supplier[]
  onNext: () => void
  isReadOnly: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CHART_COLORS = ['#22c55e', '#f59e0b', '#ef4444']

const STATUS_CONFIG = {
  responded: { label: '回答済み', icon: CheckCircle2, className: 'text-emerald-600 bg-emerald-50 ring-emerald-200', dot: 'bg-emerald-500' },
  pending:   { label: '未回答',   icon: Clock,        className: 'text-amber-600 bg-amber-50 ring-amber-200',   dot: 'bg-amber-400'  },
  overdue:   { label: '期限超過', icon: AlertCircle,  className: 'text-red-600 bg-red-50 ring-red-200',         dot: 'bg-red-500'    },
} as const

// ─── Sub-components ───────────────────────────────────────────────────────────

const SupplierRow = ({ supplier }: { supplier: Supplier }) => {
  const cfg = STATUS_CONFIG[supplier.status]
  const Icon = cfg.icon
  return (
    <div className={cn(
      'flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-border',
      supplier.status === 'overdue' && 'border-red-200 bg-red-50/40',
    )}>
      <div className="flex items-center gap-2.5">
        <div className={cn('size-1.5 rounded-full shrink-0', cfg.dot)} />
        <span className="text-[13px] font-medium text-foreground">{supplier.name}</span>
      </div>
      <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1', cfg.className)}>
        <Icon className="size-2.5" />
        {cfg.label}
      </span>
    </div>
  )
}

// ─── View ─────────────────────────────────────────────────────────────────────

export const SupplierStatusView = ({ task, suppliers, onNext, isReadOnly }: SupplierStatusViewProps) => {
  const responseRate = Math.round((task.responded / task.total_suppliers) * 100)

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {task.campaign}
          </p>
          <h2 className="text-lg font-semibold text-foreground">サプライヤー回答状況</h2>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
          <Clock className="size-3" />
          残り{task.deadline_days_from_now}日
        </span>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: '回答済み', value: task.responded,  color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-200' },
          { label: '未回答',   value: task.pending,    color: 'text-amber-600',   bg: 'bg-amber-50',   ring: 'ring-amber-200'  },
          { label: '期限超過', value: task.overdue,    color: 'text-red-600',     bg: 'bg-red-50',     ring: 'ring-red-200'    },
        ].map(({ label, value, color, bg, ring }) => (
          <div key={label} className={cn('rounded-xl p-3 text-center ring-1', bg, ring)}>
            <p className={cn('text-2xl font-bold', color)}>{value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Donut chart + response rate */}
      <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-6">
        <div className="h-36 w-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={supplierChart}
                dataKey="count"
                nameKey="status_ja"
                cx="50%" cy="50%"
                innerRadius={40} outerRadius={60}
                paddingAngle={3} strokeWidth={0}
              >
                {supplierChart.map((entry, i) => (
                  <Cell key={entry.status_en} fill={CHART_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                formatter={(val) => [`${val} 社`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-foreground">{responseRate}%</span>
            <span className="text-sm text-muted-foreground">回答率</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${responseRate}%` }} />
          </div>
          <p className="text-xs text-muted-foreground">目標: 90%（残り{task.total_suppliers - task.responded}社）</p>
          <div className="flex flex-col gap-1 mt-1">
            {supplierChart.map((entry, i) => (
              <div key={entry.status_en} className="flex items-center gap-1.5 text-xs text-secondary-foreground">
                <div className="size-2 rounded-full shrink-0" style={{ background: CHART_COLORS[i] }} />
                {entry.status_ja}: {entry.count}社
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI insights */}
      <div className="rounded-xl border border-border bg-background p-4">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="size-4 text-amber-500" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">AI インサイト</span>
        </div>
        <ul className="space-y-1.5">
          {supplierChartInsights.map((text, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-secondary-foreground">
              <span className="mt-1.5 size-1.5 rounded-full bg-primary/40 shrink-0" />
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* Supplier list */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="size-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            未回答サプライヤー ({suppliers.length}社)
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          {suppliers.map((s) => <SupplierRow key={s.id} supplier={s} />)}
        </div>
      </div>

      {!isReadOnly && (
        <div className="flex justify-end">
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-150"
          >
            リマインドメール作成へ <span className="opacity-50">→</span>
          </button>
        </div>
      )}
    </div>
  )
}
