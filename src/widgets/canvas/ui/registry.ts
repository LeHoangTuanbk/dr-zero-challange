import type { MiniAppComponent } from '@shared/lib/workflow/types';
import { AnomalyChartApp } from '@features/anomaly/mini-apps/anomaly-chart-app';
import { AnomalyReviewApp } from '@features/anomaly/mini-apps/anomaly-review-app';
import { AnomalyApproveApp } from '@features/anomaly/mini-apps/anomaly-approve-app';
import { SupplierStatusApp } from '@/features/supplier/mini-apps/ui/supplier-status-container';
import { SupplierComposeApp } from '@/features/supplier/mini-apps/ui/supplier-compose-container';
import { SupplierConfirmApp } from '@/features/supplier/mini-apps/ui/supplier-confirm-container';

export const MINI_APP_REGISTRY: Record<string, MiniAppComponent> = {
  // Pattern A — Anomaly Detection
  AnomalyChart: AnomalyChartApp,
  AnomalyReview: AnomalyReviewApp,
  AnomalyApprove: AnomalyApproveApp,
  // Pattern C — Supplier Engagement
  SupplierStatus: SupplierStatusApp,
  SupplierCompose: SupplierComposeApp,
  SupplierConfirm: SupplierConfirmApp,
  // Pattern B — Data Input (coming soon)
  // ElectricityUpload: ElectricityUploadApp,
  // ExtractionReview: ExtractionReviewApp,
};

export function getMiniApp(key: string): MiniAppComponent | null {
  return MINI_APP_REGISTRY[key] ?? null;
}
