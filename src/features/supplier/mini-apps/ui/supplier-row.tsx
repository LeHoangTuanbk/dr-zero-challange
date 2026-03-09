'use client';

import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import type { Supplier } from '@shared/data/mock/supplier';
import { cn } from '@shared/lib/shadcn';

const STATUS_CONFIG = {
  responded: {
    label: '回答済み',
    icon: CheckCircle2,
    className: 'text-emerald-600 bg-emerald-50 ring-emerald-200',
    dot: 'bg-emerald-500',
  },
  pending: {
    label: '未回答',
    icon: Clock,
    className: 'text-amber-600 bg-amber-50 ring-amber-200',
    dot: 'bg-amber-400',
  },
  overdue: {
    label: '期限超過',
    icon: AlertCircle,
    className: 'text-red-600 bg-red-50 ring-red-200',
    dot: 'bg-red-500',
  },
} as const;

export const SupplierRow = ({ supplier }: { supplier: Supplier }) => {
  const cfg = STATUS_CONFIG[supplier.status];
  const Icon = cfg.icon;
  return (
    <div
      className={cn(
        'flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-border',
        supplier.status === 'overdue' && 'border-red-200 bg-red-50/40',
      )}
    >
      <div className="flex items-center gap-2.5">
        <div className={cn('size-1.5 rounded-full shrink-0', cfg.dot)} />
        <span className="text-[13px] font-medium text-foreground">
          {supplier.name}
        </span>
      </div>
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1',
          cfg.className,
        )}
      >
        <Icon className="size-2.5" />
        {cfg.label}
      </span>
    </div>
  );
};
