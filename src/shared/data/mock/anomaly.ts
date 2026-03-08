export type Severity = 'high' | 'medium' | 'low'
export type AnomalyType = 'outlier' | 'missing_value' | 'duplicate' | 'format_error'

export interface AnomalyTask {
  id: string
  type: 'review'
  priority: Severity
  title_ja: string
  title_en: string
  facility_ja: string
  facility_en: string
  field_ja: string
  field_en: string
  detected_value: string
  expected_value: string
  anomaly_type: AnomalyType
  anomaly_type_ja: string
  severity: Severity
  workflow: string
}

export interface AnomalyReviewField {
  field_ja: string
  field_en: string
  value: string
  confidence_pct: number
  editable: boolean
}

export interface FacilityAnomalyCount {
  facility_ja: string
  facility_en: string
  anomaly_count: number
}

// SHEET: anomaly_tasks
export const anomalyTasks: AnomalyTask[] = [
  {
    id: 'task-anm-001',
    type: 'review',
    priority: 'high',
    title_ja: '電力消費量の外れ値確認',
    title_en: 'Review Power Consumption Outlier',
    facility_ja: '名古屋工場',
    facility_en: 'Nagoya Factory',
    field_ja: '電力消費量',
    field_en: 'Power consumption',
    detected_value: '45,230 kWh',
    expected_value: '12,000-15,000 kWh',
    anomaly_type: 'outlier',
    anomaly_type_ja: '外れ値',
    severity: 'high',
    workflow: 'data-anomaly-review',
  },
  {
    id: 'task-anm-002',
    type: 'review',
    priority: 'high',
    title_ja: '燃料消費の外れ値確認',
    title_en: 'Review Fuel Consumption Outlier',
    facility_ja: '福岡倉庫',
    facility_en: 'Fukuoka Warehouse',
    field_ja: '燃料消費',
    field_en: 'Fuel consumption',
    detected_value: '8,500 L',
    expected_value: '2,000-3,000 L',
    anomaly_type: 'outlier',
    anomaly_type_ja: '外れ値',
    severity: 'high',
    workflow: 'data-anomaly-review',
  },
  {
    id: 'task-anm-003',
    type: 'review',
    priority: 'medium',
    title_ja: 'ガス使用量の欠損値確認',
    title_en: 'Review Missing Gas Usage',
    facility_ja: '大阪支社',
    facility_en: 'Osaka Branch',
    field_ja: 'ガス使用量',
    field_en: 'Gas usage',
    detected_value: '(missing)',
    expected_value: 'Required field',
    anomaly_type: 'missing_value',
    anomaly_type_ja: '欠損値',
    severity: 'medium',
    workflow: 'data-anomaly-review',
  },
  {
    id: 'task-anm-004',
    type: 'review',
    priority: 'low',
    title_ja: '水道料金の重複確認',
    title_en: 'Review Duplicate Water Bill',
    facility_ja: '本社ビル',
    facility_en: 'Headquarters',
    field_ja: '水道料金',
    field_en: 'Water bill',
    detected_value: '¥125,000',
    expected_value: 'No duplicates',
    anomaly_type: 'duplicate',
    anomaly_type_ja: '重複',
    severity: 'low',
    workflow: 'data-anomaly-review',
  },
  {
    id: 'task-anm-005',
    type: 'review',
    priority: 'low',
    title_ja: '契約番号の形式エラー確認',
    title_en: 'Review Contract Number Format',
    facility_ja: '札幌支社',
    facility_en: 'Sapporo Branch',
    field_ja: '契約番号',
    field_en: 'Contract number',
    detected_value: 'ABC-123',
    expected_value: 'XXX-XXXX format',
    anomaly_type: 'format_error',
    anomaly_type_ja: '形式エラー',
    severity: 'low',
    workflow: 'data-anomaly-review',
  },
]

// SHEET: anomaly_chart
export const anomalyChart: FacilityAnomalyCount[] = [
  { facility_ja: '名古屋工場', facility_en: 'Nagoya Factory', anomaly_count: 3 },
  { facility_ja: '福岡倉庫', facility_en: 'Fukuoka Warehouse', anomaly_count: 2 },
  { facility_ja: '大阪支社', facility_en: 'Osaka Branch', anomaly_count: 1 },
  { facility_ja: '本社ビル', facility_en: 'Headquarters', anomaly_count: 1 },
  { facility_ja: '札幌支社', facility_en: 'Sapporo Branch', anomaly_count: 1 },
]

// SHEET: anomaly_chart_insights
export const anomalyChartInsights: string[] = [
  '名古屋工場で最も多くの異常が検出されています',
  '外れ値タイプの異常が全体の40%を占めています',
  '高優先度の異常が2件、対応が必要です',
]

// SHEET: anomaly_review_fields — keyed by task id for easy lookup
export const anomalyReviewFields: Record<string, AnomalyReviewField[]> = {
  'task-anm-001': [
    { field_ja: '施設', field_en: 'Facility', value: '名古屋工場', confidence_pct: 100, editable: false },
    { field_ja: '項目', field_en: 'Field', value: '電力消費量', confidence_pct: 100, editable: false },
    { field_ja: '元の値', field_en: 'Original value', value: '125,847 kWh', confidence_pct: 100, editable: false },
    { field_ja: '検出値', field_en: 'Detected value', value: '553,726 kWh', confidence_pct: 45, editable: true },
    { field_ja: 'AI推奨値', field_en: 'AI suggested value', value: '128,432 kWh', confidence_pct: 92, editable: true },
    { field_ja: '異常理由', field_en: 'Anomaly reason', value: '入力桁ミス（10倍）の可能性', confidence_pct: 88, editable: false },
  ],
  'task-anm-002': [
    { field_ja: '施設', field_en: 'Facility', value: '福岡倉庫', confidence_pct: 100, editable: false },
    { field_ja: '項目', field_en: 'Field', value: '燃料消費', confidence_pct: 100, editable: false },
    { field_ja: '元の値', field_en: 'Original value', value: '2,450 L', confidence_pct: 100, editable: false },
    { field_ja: '検出値', field_en: 'Detected value', value: '8,500 L', confidence_pct: 52, editable: true },
    { field_ja: 'AI推奨値', field_en: 'AI suggested value', value: '2,510 L', confidence_pct: 89, editable: true },
    { field_ja: '異常理由', field_en: 'Anomaly reason', value: '計測センサー誤作動の可能性', confidence_pct: 81, editable: false },
  ],
  'task-anm-003': [
    { field_ja: '施設', field_en: 'Facility', value: '大阪支社', confidence_pct: 100, editable: false },
    { field_ja: '項目', field_en: 'Field', value: 'ガス使用量', confidence_pct: 100, editable: false },
    { field_ja: '元の値', field_en: 'Original value', value: '(missing)', confidence_pct: 100, editable: false },
    { field_ja: 'AI推奨値', field_en: 'AI suggested value', value: '3,200 m³', confidence_pct: 74, editable: true },
    { field_ja: '欠損理由', field_en: 'Missing reason', value: '前月比データ未送信', confidence_pct: 91, editable: false },
  ],
  'task-anm-004': [
    { field_ja: '施設', field_en: 'Facility', value: '本社ビル', confidence_pct: 100, editable: false },
    { field_ja: '項目', field_en: 'Field', value: '水道料金', confidence_pct: 100, editable: false },
    { field_ja: '重複件数', field_en: 'Duplicate count', value: '2件', confidence_pct: 97, editable: false },
    { field_ja: '請求金額', field_en: 'Billed amount', value: '¥125,000', confidence_pct: 100, editable: false },
    { field_ja: '重複理由', field_en: 'Duplicate reason', value: '同一請求書の二重登録', confidence_pct: 95, editable: false },
  ],
  'task-anm-005': [
    { field_ja: '施設', field_en: 'Facility', value: '札幌支社', confidence_pct: 100, editable: false },
    { field_ja: '項目', field_en: 'Field', value: '契約番号', confidence_pct: 100, editable: false },
    { field_ja: '検出値', field_en: 'Detected value', value: 'ABC-123', confidence_pct: 100, editable: true },
    { field_ja: '期待フォーマット', field_en: 'Expected format', value: 'XXX-XXXX', confidence_pct: 100, editable: false },
    { field_ja: 'AI推奨値', field_en: 'AI suggested value', value: 'ABC-0123', confidence_pct: 83, editable: true },
  ],
}
