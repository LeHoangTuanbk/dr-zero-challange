import { cn } from '@/shared/lib/shadcn';
import type { CSSProperties } from 'react';

export const Bone = ({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-100', className)}
      style={style}
    />
  );
};
