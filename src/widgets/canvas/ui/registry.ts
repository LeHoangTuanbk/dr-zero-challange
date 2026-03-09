import type { MiniAppComponent } from '@shared/lib/workflow/types';
import { AnomalyChartApp } from '@features/anomaly/mini-apps/';
import { AnomalyReviewApp } from '@features/anomaly/mini-apps';
import { AnomalyApproveApp } from '@features/anomaly/mini-apps';
import { SupplierStatusApp } from '@features/supplier/mini-apps';
import { SupplierComposeApp } from '@features/supplier/mini-apps';
import { SupplierConfirmApp } from '@features/supplier/mini-apps';

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
