export * from './anomaly'
export * from './extraction'
export * from './vendor'

// Unified task queue — all 7 tasks in priority order
import { anomalyTasks } from './anomaly'
import { extractionTask } from './extraction'
import { vendorTask } from './vendor'

export type TaskCategory = 'anomaly' | 'extraction' | 'vendor'

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
    id: vendorTask.id,
    category: 'vendor' as TaskCategory,
    priority: vendorTask.priority,
    title_ja: vendorTask.title_ja,
    facility_ja: vendorTask.campaign,
    workflow: vendorTask.workflow,
  },
]
