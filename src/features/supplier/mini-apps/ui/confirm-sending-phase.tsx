import { Loader2 } from 'lucide-react';
import type { SelectedSupplier } from './supplier-confirm-view';

export const ConfirmSendingPhase = ({
  selectedSuppliers,
}: {
  selectedSuppliers: SelectedSupplier[];
}) => (
  <div className="flex flex-col items-center justify-center py-12 gap-4">
    <Loader2 className="size-10 text-primary animate-spin" />
    <p className="text-sm text-muted-foreground">メールを送信しています...</p>
    <div className="flex flex-col gap-1.5 w-full max-w-xs items-center">
      {selectedSuppliers.map(({ id, name }) => (
        <div key={id} className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3 animate-spin shrink-0" />
          {name}
        </div>
      ))}
    </div>
  </div>
);
