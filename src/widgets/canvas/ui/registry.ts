import type { MiniAppComponent } from '@shared/lib/workflow/types';
import { AnomalyChartApp } from '@features/anomaly/mini-apps/';
import { AnomalyReviewApp } from '@features/anomaly/mini-apps';
import { AnomalyApproveApp } from '@features/anomaly/mini-apps';
import { SupplierStatusApp } from '@features/supplier/mini-apps';
import { SupplierComposeApp } from '@features/supplier/mini-apps';
import { SupplierConfirmApp } from '@features/supplier/mini-apps';
import { ExtractionUploadApp } from '@features/extraction/mini-apps';
import { ExtractionReviewApp } from '@features/extraction/mini-apps';

export const MINI_APP_REGISTRY: Record<string, MiniAppComponent> = {
  // Pattern A — Anomaly Detection
  AnomalyChart: AnomalyChartApp,
  AnomalyReview: AnomalyReviewApp,
  AnomalyApprove: AnomalyApproveApp,
  // Pattern B — Data Input
  ExtractionUpload: ExtractionUploadApp,
  ExtractionReview: ExtractionReviewApp,
  // Pattern C — Supplier Engagement
  SupplierStatus: SupplierStatusApp,
  SupplierCompose: SupplierComposeApp,
  SupplierConfirm: SupplierConfirmApp,
};

export function getMiniApp(key: string): MiniAppComponent | null {
  return MINI_APP_REGISTRY[key] ?? null;
}
