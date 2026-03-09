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

export const supplierTask: SupplierTask = {
  id: 'task-vnd-001',
  type: 'engagement',
  priority: 'medium',
  title_ja: 'サプライヤー回答状況確認',
  title_en: 'Check Supplier Feedback Status',
  campaign: 'Scope 3 Q4 データ収集',
  total_suppliers: 25,
  responded: 18,
  pending: 7,
  overdue: 2,
  deadline_days_from_now: 14,
  workflow: 'supplier-engagement-followup',
};

export const supplierList: Supplier[] = [
  {
    id: 'V001',
    name: '株式会社山田製作所',
    status: 'pending',
    last_reminder: '2024-11-01',
  },
  {
    id: 'V002',
    name: 'ABCロジスティクス',
    status: 'pending',
    last_reminder: '2024-11-05',
  },
  {
    id: 'V003',
    name: '鈴木化学工業',
    status: 'overdue',
    last_reminder: '2024-10-25',
  },
  {
    id: 'V004',
    name: 'グローバル包装',
    status: 'pending',
    last_reminder: null,
  },
  {
    id: 'V005',
    name: '東海運輸',
    status: 'overdue',
    last_reminder: '2024-10-20',
  },
  {
    id: 'V006',
    name: 'ニッポン部品',
    status: 'pending',
    last_reminder: '2024-11-08',
  },
  {
    id: 'V007',
    name: '関西エネルギー',
    status: 'pending',
    last_reminder: null,
  },
];

export const supplierChart: SupplierChartEntry[] = [
  {
    status_ja: '回答済み',
    status_en: 'Responded',
    count: 18,
    color: '#22c55e',
  },
  { status_ja: '未回答', status_en: 'Pending', count: 5, color: '#f59e0b' },
  { status_ja: '期限超過', status_en: 'Overdue', count: 2, color: '#ef4444' },
];

export const supplierChartInsights: string[] = [
  '回答率72%（目標90%）',
  '2社が期限を超過しています',
  '残り14日で7社からの回答が必要',
];

export const emailTemplate = {
  subject: '【リマインド】Scope 3データ提出のお願い',
  body: (supplierName: string) => `${supplierName} ご担当者様
いつもお世話になっております。

環境マネジメント部の佐藤です。

先日ご依頼いたしましたScope 3排出量算定用データのご提出について、
期限が近づいておりますのでリマインドをお送りしております。

【提出期限】2024年11月30日
【提出方法】添付のExcelテンプレートにご記入の上、本メールへ返信

ご不明な点がございましたら、お気軽にお問い合わせください。

何卒よろしくお願いいたします。`,
};

export function personalizeEmail(supplierName: string): {
  subject: string;
  body: string;
} {
  return {
    subject: emailTemplate.subject,
    body: emailTemplate.body(supplierName),
  };
}
