'use client';

import { Bone } from './bone';

const ChartSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <Bone className="h-3 w-24" />
          <Bone className="h-5 w-48" />
        </div>
        <Bone className="h-6 w-24 rounded-full" />
      </div>
      <div className="flex-1 rounded-xl border border-slate-100 p-4 flex items-end gap-3">
        {[40, 70, 30, 25, 20].map((h, i) => (
          <Bone
            key={i}
            className="flex-1 rounded-t-md"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="rounded-xl border border-slate-100 p-4 flex flex-col gap-2">
        <Bone className="h-3 w-20" />
        {[1, 2, 3].map((i) => (
          <Bone key={i} className="h-3 w-full" />
        ))}
      </div>
    </div>
  );
};

const ReviewSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 p-6 h-full">
      <div className="flex flex-col gap-2">
        <Bone className="h-3 w-32" />
        <Bone className="h-5 w-64" />
        <Bone className="h-4 w-80 mt-1" />
      </div>
      <Bone className="h-10 w-full rounded-lg" />
      <div className="flex-1 rounded-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 p-3 flex gap-4">
          {[32, 48, 16].map((w, i) => (
            <Bone key={i} className="h-3" style={{ width: `${w}%` }} />
          ))}
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex gap-4 px-4 py-3.5 border-b border-slate-50 last:border-0"
          >
            <Bone className="h-3 w-1/4" />
            <Bone className="h-3 flex-1" />
            <Bone className="h-5 w-12 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

const ApproveSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <div className="flex flex-col gap-2">
        <Bone className="h-3 w-40" />
        <Bone className="h-5 w-52" />
      </div>
      <div className="rounded-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 p-3">
          <Bone className="h-3 w-24" />
        </div>
        <div className="grid grid-cols-3 p-5 gap-4">
          <div className="flex flex-col gap-2">
            <Bone className="h-3 w-12" />
            <Bone className="h-7 w-28" />
          </div>
          <div className="flex items-center justify-center">
            <Bone className="h-5 w-5 rounded-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Bone className="h-3 w-12" />
            <Bone className="h-7 w-28" />
          </div>
        </div>
      </div>
      <Bone className="h-12 w-full rounded-lg" />
      <div className="flex-1" />
      <div className="flex justify-between items-center">
        <Bone className="h-4 w-16" />
        <Bone className="h-10 w-28 rounded-lg" />
      </div>
    </div>
  );
};

export type MiniAppSkeletonVariant = 'chart' | 'review' | 'approve' | 'default';

type MiniAppSkeletonProps = {
  variant?: MiniAppSkeletonVariant;
};

export const MiniAppSkeleton = ({
  variant = 'default',
}: MiniAppSkeletonProps) => {
  if (variant === 'chart') return <ChartSkeleton />;
  if (variant === 'review') return <ReviewSkeleton />;
  if (variant === 'approve') return <ApproveSkeleton />;

  return (
    <div className="flex flex-col gap-4 p-6">
      <Bone className="h-5 w-48" />
      <Bone className="h-40 w-full rounded-xl" />
      <Bone className="h-24 w-full rounded-xl" />
    </div>
  );
};
