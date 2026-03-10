export type SupplierStatus = 'pending' | 'overdue' | 'responded';

export type SupplierTask = {
  id: string;
  type: 'engagement';
  priority: 'high' | 'medium' | 'low';
  title_ja: string;
  title_en: string;
  campaign: string;
  total_suppliers: number;
  responded: number;
  pending: number;
  overdue: number;
  deadline_days_from_now: number;
  workflow: string;
};

export type Supplier = {
  id: string;
  name: string;
  status: SupplierStatus;
  last_reminder: string | null;
};

export type SupplierChartEntry = {
  status_ja: string;
  status_en: string;
  count: number;
  color: string;
};

import raw from './supplier-data.json';

export const supplierTask: SupplierTask = raw.task as SupplierTask;
export const supplierList: Supplier[] = raw.suppliers as Supplier[];
export const supplierChart: SupplierChartEntry[] = raw.chart;
export const supplierChartInsights: string[] = raw.insights;

export function personalizeEmail(supplierName: string): {
  subject: string;
  body: string;
} {
  return {
    subject: raw.emailTemplate.subject,
    body: `${supplierName} ${raw.emailTemplate.bodyPrefix}`,
  };
}
