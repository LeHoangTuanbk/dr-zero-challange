import type { MiniAppComponent } from '@shared/lib/workflow/types'
import { AnomalyChartApp } from '@features/anomaly/mini-apps/anomaly-chart-app'
import { AnomalyReviewApp } from '@features/anomaly/mini-apps/anomaly-review-app'
import { AnomalyApproveApp } from '@features/anomaly/mini-apps/anomaly-approve-app'

/**
 * Global mini-app registry.
 * Maps `StepConfig.miniApp` string → React component.
 *
 * Adding a new workflow step = import component + add one entry here.
 * The Canvas widget resolves components dynamically — zero structural changes.
 */
export const MINI_APP_REGISTRY: Record<string, MiniAppComponent> = {
  AnomalyChart: AnomalyChartApp,
  AnomalyReview: AnomalyReviewApp,
  AnomalyApprove: AnomalyApproveApp,
  // ElectricityUpload: ElectricityUploadApp,   ← Pattern B
  // ExtractionReview: ExtractionReviewApp,
  // VendorStatus: VendorStatusApp,              ← Pattern C
  // EmailCompose: EmailComposeApp,
}

export function getMiniApp(key: string): MiniAppComponent | null {
  return MINI_APP_REGISTRY[key] ?? null
}
