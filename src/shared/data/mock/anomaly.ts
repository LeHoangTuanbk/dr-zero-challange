export type Severity = 'high' | 'medium' | 'low';
export type AnomalyType =
  | 'outlier'
  | 'missing_value'
  | 'duplicate'
  | 'format_error';

export type AnomalyTask = {
  id: string;
  type: 'review';
  priority: Severity;
  title_ja: string;
  title_en: string;
  facility_ja: string;
  facility_en: string;
  field_ja: string;
  field_en: string;
  detected_value: string;
  expected_value: string;
  anomaly_type: AnomalyType;
  anomaly_type_ja: string;
  severity: Severity;
  workflow: string;
};

export type AnomalyReviewField = {
  field_ja: string;
  field_en: string;
  value: string;
  confidence_pct: number;
  editable: boolean;
};

export type FacilityAnomalyCount = {
  facility_ja: string;
  facility_en: string;
  anomaly_count: number;
};

import rawTasks from './anomaly-tasks.json';
import rawChart from './anomaly-chart.json';
import rawReviewFields from './anomaly-review-fields.json';

export const anomalyTasks: AnomalyTask[] = rawTasks as AnomalyTask[];

export const anomalyChart: FacilityAnomalyCount[] = rawChart.facilities;
export const anomalyChartInsights: string[] = rawChart.insights;

export const anomalyReviewFields: Record<string, AnomalyReviewField[]> =
  rawReviewFields as Record<string, AnomalyReviewField[]>;
