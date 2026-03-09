'use client';

import { anomalyChart, anomalyChartInsights } from '@shared/data/mock/anomaly';
import type { AnomalyTask } from '@shared/data/mock/anomaly';
import type { MiniAppProps } from '@shared/lib/workflow/types';
import { withWorkflowStep } from '@shared/ui/mini-app/with-workflow-step';
import { AnomalyChartView } from './anomaly-chart-view';

// ─── Container ────────────────────────────────────────────────────────────────

const AnomalyChartContainer = ({
  context,
  onComplete,
  isReadOnly,
}: MiniAppProps) => {
  const task = context.task as AnomalyTask;
  const facilityCount =
    anomalyChart.find((d) => d.facility_ja === task.facility_ja)
      ?.anomaly_count ?? 1;

  return (
    <AnomalyChartView
      task={task}
      chartData={anomalyChart}
      insights={anomalyChartInsights}
      facilityCount={facilityCount}
      onNext={() => onComplete({ viewed: true })}
      isReadOnly={isReadOnly ?? false}
    />
  );
};

export const AnomalyChartApp = withWorkflowStep(AnomalyChartContainer, {
  skeleton: 'chart',
});
