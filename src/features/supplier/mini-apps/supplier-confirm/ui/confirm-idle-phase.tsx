import { Send, AlertTriangle } from 'lucide-react';
import { personalizeEmail } from '@shared/data/mock/supplier';
import { cn } from '@shared/lib/shadcn';
import type { SelectedSupplier } from './supplier-confirm-view';

export const ConfirmIdlePhase = ({
  selectedSuppliers,
}: {
  selectedSuppliers: SelectedSupplier[];
}) => (
  <>
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        送信対象 ({selectedSuppliers.length}社)
      </p>
      <div className="flex flex-col gap-1.5">
        {selectedSuppliers.map(({ id, name, isOverdue }) => {
          const email = personalizeEmail(name);
          return (
            <div
              key={id}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-3.5 py-2.5',
                isOverdue ? 'border-red-200 bg-red-50/30' : 'border-border',
              )}
            >
              <Send
                className={cn(
                  'size-3.5 shrink-0',
                  isOverdue ? 'text-red-400' : 'text-muted-foreground',
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-semibold text-foreground">{name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{email.subject}</p>
              </div>
              {isOverdue && (
                <span className="text-[10px] font-bold text-red-500 bg-red-50 ring-1 ring-red-200 rounded-full px-2 py-0.5">
                  期限超過
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>

    <div className="rounded-lg border border-primary/20 bg-primary-50 px-4 py-3 flex items-start gap-3">
      <AlertTriangle className="size-4 text-primary shrink-0 mt-0.5" />
      <p className="text-sm text-foreground">
        各メールはサプライヤー名でパーソナライズされています。送信後の取り消しはできません。
      </p>
    </div>
  </>
);
