'use client';

import { useState } from 'react';
import { supplierList, personalizeEmail } from '@shared/data/mock/supplier';
import type { MiniAppProps } from '@shared/lib/workflow/types';
import { withWorkflowStep } from '@shared/ui/mini-app/with-workflow-step';
import { SupplierComposeView } from './supplier-compose-view';

const SupplierComposeContainer = ({
  context,
  onComplete,
  onBack,
  isReadOnly,
}: MiniAppProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    const prior = context.stepOutputs['compose'] as
      | { selectedSupplierIds?: string[] }
      | undefined;
    if (prior?.selectedSupplierIds) return new Set(prior.selectedSupplierIds);
    return new Set(
      supplierList.filter((s) => s.status === 'overdue').map((s) => s.id),
    );
  });

  const [previewSupplierId, setPreviewSupplierId] = useState<string | null>(
    supplierList.find((s) => s.status === 'overdue')?.id ??
      supplierList[0]?.id ??
      null,
  );

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleAll = () => {
    setSelectedIds(
      selectedIds.size === supplierList.length
        ? new Set()
        : new Set(supplierList.map((s) => s.id)),
    );
  };

  const previewSupplier =
    supplierList.find((s) => s.id === previewSupplierId) ?? supplierList[0];
  const previewEmail = previewSupplier
    ? personalizeEmail(previewSupplier.name)
    : { subject: '', body: '' };

  return (
    <SupplierComposeView
      suppliers={supplierList}
      selectedIds={selectedIds}
      previewSupplierId={previewSupplierId}
      previewSubject={previewEmail.subject}
      previewBody={previewEmail.body}
      previewName={previewSupplier?.name ?? ''}
      onToggle={handleToggle}
      onToggleAll={handleToggleAll}
      onPreview={setPreviewSupplierId}
      onNext={(ids) => onComplete({ selectedSupplierIds: ids })}
      onBack={onBack ?? (() => {})}
      isReadOnly={isReadOnly ?? false}
    />
  );
};

export const SupplierComposeApp = withWorkflowStep(SupplierComposeContainer, {
  skeleton: 'review',
});
