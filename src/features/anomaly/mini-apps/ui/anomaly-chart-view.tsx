'use client';

import { Lightbulb, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type {
  AnomalyTask,
  FacilityAnomalyCount,
} from '@shared/data/mock/anomaly';
import { cn } from '@shared/lib/shadcn';

export type AnomalyChartViewProps = {
  task: AnomalyTask;
  chartData: FacilityAnomalyCount[];
  insights: string[];
  facilityCount: number;
  onNext: () => void;
  isReadOnly: boolean;
};

const BAR_COLOR_ACTIVE = '#5a864d';
const BAR_COLOR_DEFAULT = '#dde6d8';

export const AnomalyChartView = ({
  task,
  chartData,
  insights,
  facilityCount,
  onNext,
  isReadOnly,
}: AnomalyChartViewProps) => (
  <div className="flex flex-col gap-5 p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          異常分析 — {task.facility_ja}
        </p>
        <h2 className="text-lg font-semibold text-foreground">
          拠点別異常件数
        </h2>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-primary/30">
        <TrendingUp className="size-3" />
        外れ値検出
      </span>
    </div>

    <div className="rounded-xl border border-border bg-card p-4 h-52">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
          barSize={36}
        >
          <XAxis
            dataKey="facility_ja"
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 12,
            }}
            formatter={(val) => [`${val} 件`, '異常件数']}
          />
          <Bar dataKey="anomaly_count" radius={[4, 4, 0, 0]}>
            {chartData.map((entry) => (
              <Cell
                key={entry.facility_ja}
                fill={
                  entry.facility_ja === task.facility_ja
                    ? BAR_COLOR_ACTIVE
                    : BAR_COLOR_DEFAULT
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="rounded-lg border border-primary/20 bg-primary-50 px-4 py-2.5 flex items-center gap-3">
      <div className="size-2 rounded-full bg-primary shrink-0" />
      <p className="text-sm text-foreground">
        <span className="font-semibold">{task.facility_ja}</span> で{' '}
        {facilityCount} 件の異常が検出されています
      </p>
    </div>

    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="size-4 text-amber-500" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          AI インサイト
        </span>
      </div>
      <ul className="space-y-2">
        {insights.map((text, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-secondary-foreground"
          >
            <span className="mt-1.5 size-1.5 rounded-full bg-primary/40 shrink-0" />
            {text}
          </li>
        ))}
      </ul>
    </div>

    {!isReadOnly && (
      <div className="flex justify-end">
        <button
          onClick={onNext}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5',
            'text-sm font-medium text-white shadow-sm',
            'hover:bg-primary/90 active:scale-[0.98] transition-all duration-150',
          )}
        >
          データ確認へ <span className="opacity-50">→</span>
        </button>
      </div>
    )}
  </div>
);
