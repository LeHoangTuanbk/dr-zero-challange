import type { WorkflowContext } from '../types';
import type { AnomalyTask } from '@shared/data/mock/anomaly';

/**
 * Named predicate registry for workflow step skip conditions.
 * JSON configs reference predicates by key — adding a new branching rule
 * = one entry here, no component changes.
 */
export const PREDICATES: Record<string, (ctx: WorkflowContext) => boolean> = {
  skip_if_not_outlier: (ctx) =>
    (ctx.task as AnomalyTask).anomaly_type !== 'outlier',
};
