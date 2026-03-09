import { cn } from '@/shared/lib/shadcn';

export const StepDots = ({
  total,
  current,
}: {
  total: number;
  current: number;
}) => {
  return (
    <div className="flex items-center gap-1 mt-2.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-0.5 rounded-full transition-all duration-300',
            i < current
              ? 'bg-primary w-4'
              : i === current
                ? 'bg-primary/40 w-4'
                : 'bg-border w-2',
          )}
        />
      ))}
    </div>
  );
};
