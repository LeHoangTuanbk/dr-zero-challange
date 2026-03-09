'use client';

import { supplierList } from '@shared/data/mock/supplier';
import type { SupplierTask } from '@shared/data/mock/supplier';
import type { MiniAppProps } from '@shared/lib/workflow/types';
import { withWorkflowStep } from '@shared/ui/mini-app/with-workflow-step';
import { SupplierStatusView } from './supplier-status-view';

// ─── Container ────────────────────────────────────────────────────────────────

const SupplierStatusContainer = ({
  context,
  onComplete,
  isReadOnly,
}: MiniAppProps) => {
  const task = context.task as SupplierTask;
  return (
    <SupplierStatusView
      task={task}
      suppliers={supplierList}
      onNext={() => onComplete({ acknowledged: true })}
      isReadOnly={isReadOnly ?? false}
    />
  );
};

export const SupplierStatusApp = withWorkflowStep(SupplierStatusContainer, {
  skeleton: 'chart',
});
