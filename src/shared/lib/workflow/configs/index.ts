import type { WorkflowConfig, RawWorkflowConfig } from '../types';
import { PREDICATES } from './predicates';
import dataAnomalyReview from './data-anomaly-review.json';
import supplierEngagementFollowup from './supplier-engagement-followup.json';
import electricityIntake from './electricity-intake.json';

function hydrate(raw: RawWorkflowConfig): WorkflowConfig {
  return {
    ...raw,
    steps: raw.steps.map((step) => ({
      ...step,
      skip: step.skip ? PREDICATES[step.skip] : undefined,
    })),
  };
}

export const WORKFLOW_CONFIGS: Record<string, WorkflowConfig> = {
  'data-anomaly-review': hydrate(dataAnomalyReview),
  'supplier-engagement-followup': hydrate(supplierEngagementFollowup),
  'electricity-intake': hydrate(electricityIntake),
};

export const getWorkflowConfig = (id: string): WorkflowConfig => {
  const config = WORKFLOW_CONFIGS[id];
  if (!config) throw new Error(`Unknown workflow: "${id}"`);
  return config;
};
