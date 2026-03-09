/**
 * AI chat narratives for supplier engagement workflow.
 * Keyed by taskId:stepId — same pattern as anomaly-narratives.ts
 * SHEET: vendor_task = supplier_task, the same meaning
 */
export const supplierNarratives: Record<string, string> = {
  'task-vnd-001:opened':
    'Scope 3 Q4データ収集キャンペーンの回答状況を確認します。25社中18社が回答済み（回答率72%）ですが、目標の90%には届いていません。7社からの回答が未完了です。',
  'task-vnd-001:status':
    '鈴木化学工業と東海運輸の2社が提出期限を超過しています。残り14日で残り7社からの回答が必要です。期限超過の2社を含む未回答サプライヤーへのリマインドメール送信を推奨します。',
  'task-vnd-001:compose':
    '各サプライヤーに最適化されたリマインドメールを準備しました。期限超過の2社は優先送信対象として自動選択済みです。各社名でパーソナライズされたメールをプレビューで確認できます。',
  'task-vnd-001:confirm':
    '選択した7社へリマインドメールを送信します。各メールはサプライヤー名で個別にパーソナライズ済みです。送信後、回答状況はリアルタイムで更新されます。',
};
