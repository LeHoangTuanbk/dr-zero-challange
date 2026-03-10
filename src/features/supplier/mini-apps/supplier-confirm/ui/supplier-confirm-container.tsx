'use client';

import { useState } from 'react';
import { supplierList } from '@shared/data/mock/supplier';
import type { MiniAppProps, StepOutput } from '@shared/lib/workflow/types';
import { withWorkflowStep } from '@shared/ui/mini-app/with-workflow-step';
import { SupplierConfirmView } from './supplier-confirm-view';
import type {
  SendPhase,
  SendResult,
  SelectedSupplier,
} from './supplier-confirm-view';

// Simulated failures for overdue suppliers (鈴木化学工業 S003, 東海運輸 S005)
const SIMULATED_FAIL_IDS = new Set(['V003', 'V005']);

const SupplierConfirmContainer = ({
  context,
  onComplete,
  onBack,
  isReadOnly,
}: MiniAppProps) => {
  const composeOutput = context.stepOutputs['compose'] as
    | { selectedSupplierIds?: string[] }
    | undefined;
  const selectedSupplierIds =
    composeOutput?.selectedSupplierIds ?? supplierList.map((s) => s.id);

  const selectedSuppliers: SelectedSupplier[] = selectedSupplierIds
    .map((id) => {
      const s = supplierList.find((x) => x.id === id);
      return s
        ? { id: s.id, name: s.name, isOverdue: s.status === 'overdue' }
        : null;
    })
    .filter((s): s is SelectedSupplier => s !== null);

  const [phase, setPhase] = useState<SendPhase>('idle');
  const [results, setResults] = useState<SendResult[]>([]);
  const [retryingIds, setRetryingIds] = useState<Set<string>>(new Set());

  const handleSend = () => {
    setPhase('sending');
    setTimeout(() => {
      setResults(
        selectedSuppliers.map((s) => ({
          supplierId: s.id,
          name: s.name,
          success: !SIMULATED_FAIL_IDS.has(s.id),
        })),
      );
      setPhase('done');
    }, 2000);
  };

  const handleRetry = (supplierId: string) => {
    setRetryingIds((prev) => new Set([...prev, supplierId]));
    setTimeout(() => {
      setResults((prev) =>
        prev.map((r) =>
          r.supplierId === supplierId ? { ...r, success: true } : r,
        ),
      );
      setRetryingIds((prev) => {
        const n = new Set(prev);
        n.delete(supplierId);
        return n;
      });
    }, 1500);
  };

  const handleComplete = () => {
    const output: StepOutput = {
      sent: results.filter((r) => r.success).map((r) => r.supplierId),
      failed: results.filter((r) => !r.success).map((r) => r.supplierId),
      timestamp: Date.now(),
    };
    onComplete(output);
  };

  return (
    <SupplierConfirmView
      selectedSuppliers={selectedSuppliers}
      phase={phase}
      results={results}
      retryingIds={retryingIds}
      onSend={handleSend}
      onRetry={handleRetry}
      onComplete={handleComplete}
      onBack={onBack ?? (() => {})}
      isReadOnly={isReadOnly ?? false}
    />
  );
};

export const SupplierConfirmApp = withWorkflowStep(SupplierConfirmContainer, {
  skeleton: 'approve',
});
