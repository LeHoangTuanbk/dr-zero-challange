export type ExtractionTask = {
  id: string;
  type: 'file_upload';
  priority: 'high' | 'medium' | 'low';
  title_ja: string;
  title_en: string;
  facility_ja: string;
  facility_en: string;
  data_type: string;
  period: string;
  workflow: string;
};

export type ExtractionField = {
  field_key: string;
  field_ja: string;
  field_en: string;
  value: string;
  confidence_pct: number;
  editable: boolean;
};

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
};

import rawExtractionResult from './extraction-result.json';

export const extractionResult: ExtractionField[] = rawExtractionResult;
