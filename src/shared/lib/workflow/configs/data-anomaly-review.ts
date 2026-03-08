import type { WorkflowConfig, WorkflowContext } from '../types'
import type { AnomalyTask } from '@shared/data/mock/anomaly'

/**
 * Anomaly review workflow.
 *
 * Branching rule:
 *   outlier        → chart → review → approve  (3 steps)
 *   missing_value  →         review → approve  (2 steps, no chart needed)
 *   duplicate      →         review → approve  (2 steps)
 *   format_error   →         review → approve  (2 steps)
 *
 * Adding a new anomaly type with different UX = add/modify one skip predicate.
 * Zero component changes required.
 */
export const dataAnomalyReviewConfig: WorkflowConfig = {
  id: 'data-anomaly-review',
  title_ja: '異常データレビュー',
  steps: [
    {
      id: 'chart',
      miniApp: 'AnomalyChart',
      title_ja: '異常分析',
      skip: (ctx: WorkflowContext) => {
        const task = ctx.task as AnomalyTask
        return task.anomaly_type !== 'outlier'
      },
    },
    {
      id: 'review',
      miniApp: 'AnomalyReview',
      title_ja: 'データ確認',
    },
    {
      id: 'approve',
      miniApp: 'AnomalyApprove',
      title_ja: '承認',
    },
  ],
}
