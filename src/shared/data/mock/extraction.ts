export interface ExtractionTask {
  id: string
  type: 'file_upload'
  priority: 'high' | 'medium' | 'low'
  title_ja: string
  title_en: string
  facility_ja: string
  facility_en: string
  data_type: string
  period: string
  workflow: string
}

export interface ExtractionField {
  field_key: string
  field_ja: string
  field_en: string
  value: string
  confidence_pct: number
  editable: boolean
}

// SHEET: extraction_task
export const extractionTask: ExtractionTask = {
  id: 'task-inp-001',
  type: 'file_upload',
  priority: 'medium',
  title_ja: 'Scope 2 電力データ入力',
  title_en: 'Input Scope 2 Electricity Data',
  facility_ja: '本社ビル',
  facility_en: 'Headquarters',
  data_type: 'Scope 2',
  period: '2024年10月',
  workflow: 'electricity-intake',
}

// SHEET: extraction_result
export const extractionResult: ExtractionField[] = [
  { field_key: 'period', field_ja: '対象期間', field_en: 'Billing period', value: '2024年9月1日〜9月30日', confidence_pct: 98, editable: false },
  { field_key: 'customer', field_ja: '契約名義', field_en: 'Contract holder', value: '株式会社サンプル製造', confidence_pct: 95, editable: true },
  { field_key: 'supply_point', field_ja: '供給地点特定番号', field_en: 'Supply point ID', value: '0000-0000-0000-0000-0001', confidence_pct: 72, editable: true },
  { field_key: 'usage', field_ja: '使用量', field_en: 'Usage', value: '125,847 kWh', confidence_pct: 99, editable: true },
  { field_key: 'amount', field_ja: '請求金額', field_en: 'Amount', value: '¥3,456,789', confidence_pct: 97, editable: false },
  { field_key: 'power_company', field_ja: '電力会社', field_en: 'Power company', value: '東京電力エナジーパートナー', confidence_pct: 99, editable: false },
  { field_key: 'contract_type', field_ja: '契約種別', field_en: 'Contract type', value: '高圧電力B', confidence_pct: 94, editable: true },
]
