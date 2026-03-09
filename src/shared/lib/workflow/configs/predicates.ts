import type { WorkflowContext } from '../types';
import type { AnomalyTask } from '@shared/data/mock/anomaly';

export const PREDICATES: Record<string, (ctx: WorkflowContext) => boolean> = {
  skip_if_not_outlier: (ctx) =>
    (ctx.task as AnomalyTask).anomaly_type !== 'outlier',
};
