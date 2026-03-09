export * from './anomaly'
export * from './extraction'
export * from './supplier'

// Unified task queue — all 7 tasks in priority order
import { anomalyTasks } from './anomaly'
import { extractionTask } from './extraction'
import { supplierTask } from './supplier'

export type TaskCategory = 'anomaly' | 'extraction' | 'supplier'

export interface QueueTask {
  id: string
  category: TaskCategory
  priority: 'high' | 'medium' | 'low'
  title_ja: string
  facility_ja: string
  workflow: string
  severity?: 'high' | 'medium' | 'low'
}

export const taskQueue: QueueTask[] = [
  ...anomalyTasks.map((t) => ({
    id: t.id,
    category: 'anomaly' as TaskCategory,
    priority: t.priority,
    title_ja: t.title_ja,
    facility_ja: t.facility_ja,
    workflow: t.workflow,
    severity: t.severity,
  })),
  {
    id: extractionTask.id,
    category: 'extraction' as TaskCategory,
    priority: extractionTask.priority,
    title_ja: extractionTask.title_ja,
    facility_ja: extractionTask.facility_ja,
    workflow: extractionTask.workflow,
  },
  {
    id: supplierTask.id,
    category: 'supplier' as TaskCategory,
    priority: supplierTask.priority,
    title_ja: supplierTask.title_ja,
    facility_ja: supplierTask.campaign,
    workflow: supplierTask.workflow,
  },
]
