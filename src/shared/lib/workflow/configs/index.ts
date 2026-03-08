import type { WorkflowConfig } from '../types'
import { dataAnomalyReviewConfig } from './data-anomaly-review'

/**
 * Global workflow registry.
 * Adding a new workflow = import config + add one entry here.
 */
export const WORKFLOW_CONFIGS: Record<string, WorkflowConfig> = {
  'data-anomaly-review': dataAnomalyReviewConfig,
  // 'electricity-intake': electricityIntakeConfig,      ← Pattern B (coming soon)
  // 'vendor-engagement-followup': vendorEngagementConfig, ← Pattern C (coming soon)
}

export function getWorkflowConfig(id: string): WorkflowConfig {
  const config = WORKFLOW_CONFIGS[id]
  if (!config) throw new Error(`Unknown workflow: "${id}"`)
  return config
}
