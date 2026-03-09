import type { WorkflowConfig } from '../types';

export const supplierEngagementFollowupConfig: WorkflowConfig = {
  id: 'supplier-engagement-followup',
  title_ja: 'サプライヤーエンゲージメント',
  steps: [
    {
      id: 'status',
      miniApp: 'SupplierStatus',
      title_ja: '回答状況',
    },
    {
      id: 'compose',
      miniApp: 'SupplierCompose',
      title_ja: 'メール作成',
    },
    {
      id: 'confirm',
      miniApp: 'SupplierConfirm',
      title_ja: '送信確認',
    },
  ],
};
