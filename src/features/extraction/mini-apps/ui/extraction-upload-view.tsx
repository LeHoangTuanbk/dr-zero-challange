'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, Loader2, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@shared/lib/shadcn';

export type UploadPhase = 'idle' | 'uploading' | 'extracting' | 'done' | 'error';

export type ExtractionUploadViewProps = {
  phase: UploadPhase;
  fileName: string | null;
  progress: number;
  onFileDrop: (file: File) => void;
  onRetry: () => void;
};

const PHASE_LABEL: Record<UploadPhase, string> = {
  idle: '',
  uploading: 'アップロード中...',
  extracting: 'AIがデータを抽出中...',
  done: '抽出完了',
  error: 'エラーが発生しました',
};

export const ExtractionUploadView = ({
  phase,
  fileName,
  progress,
  onFileDrop,
  onRetry,
}: ExtractionUploadViewProps) => {
  const onDrop = useCallback(
    (files: File[]) => {
      if (files[0]) onFileDrop(files[0]);
    },
    [onFileDrop],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
    disabled: phase !== 'idle',
  });

  const isProcessing = phase === 'uploading' || phase === 'extracting';
  const isError = phase === 'error';

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          Scope 2 · 本社ビル · 2024年10月
        </p>
        <h2 className="text-lg font-semibold text-foreground">
          電気料金明細書のアップロード
        </h2>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          'relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-8 py-14 transition-all duration-200 cursor-pointer select-none',
          isDragActive
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50',
          phase !== 'idle' && phase !== 'error' && 'pointer-events-none',
        isError && 'border-red-300 bg-red-50/30',
        )}
      >
        <input {...getInputProps()} />

        {phase === 'idle' && (
          <>
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
              <UploadCloud className="size-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                {isDragActive ? 'ここにドロップ' : 'ファイルをドラッグ＆ドロップ'}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                またはクリックして選択 · PDF / Excel / 画像
              </p>
            </div>
          </>
        )}

        {isProcessing && (
          <>
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
              <Loader2 className="size-8 text-primary animate-spin" />
            </div>
            <div className="flex flex-col items-center gap-2 w-full max-w-xs">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
                  {fileName}
                </span>
              </div>
              <p className="text-xs font-medium text-primary">
                {PHASE_LABEL[phase]}
              </p>
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </>
        )}

        {phase === 'done' && (
          <>
            <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-50">
              <CheckCircle2 className="size-8 text-emerald-600" />
            </div>
            <p className="text-sm font-semibold text-emerald-700">
              {PHASE_LABEL.done} — 次のステップへ移行中...
            </p>
          </>
        )}

        {isError && (
          <>
            <div className="flex size-16 items-center justify-center rounded-2xl bg-red-50">
              <AlertTriangle className="size-8 text-red-500" />
            </div>
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm font-semibold text-red-700">
                AI抽出がタイムアウトしました
              </p>
              <p className="text-xs text-muted-foreground text-center max-w-xs">
                サーバーの応答がありませんでした。再試行するか、別のファイルをアップロードしてください。
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); onRetry(); }}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 active:scale-[0.98] transition-all"
              >
                <RefreshCw className="size-3.5" />
                再試行
              </button>
            </div>
          </>
        )}
      </div>

      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-2">
          対応フォーマット
        </p>
        <div className="flex flex-wrap gap-2">
          {['PDF 明細書', 'Excel (.xlsx)', 'スキャン画像 (JPG/PNG)'].map((f) => (
            <span
              key={f}
              className="rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-secondary-foreground"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
