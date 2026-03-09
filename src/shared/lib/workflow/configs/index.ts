import type { WorkflowConfig } from '../types'
import { dataAnomalyReviewConfig } from './data-anomaly-review'
import { supplierEngagementFollowupConfig } from './supplier-engagement-followup'
import { electricityIntakeConfig } from './electricity-intake'

/**
 * Global workflow registry.
 * Adding a new workflow = import config + add one entry here.
 */
export const WORKFLOW_CONFIGS: Record<string, WorkflowConfig> = {
  'data-anomaly-review': dataAnomalyReviewConfig,
  'supplier-engagement-followup': supplierEngagementFollowupConfig,
  'electricity-intake': electricityIntakeConfig,
}

export function getWorkflowConfig(id: string): WorkflowConfig {
  const config = WORKFLOW_CONFIGS[id]
  if (!config) throw new Error(`Unknown workflow: "${id}"`)
  return config
}
