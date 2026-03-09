export const SEVERITY_CONFIG = {
  high: {
    label: '高',
    badge: 'bg-red-50 text-red-600 ring-1 ring-red-200',
    border: 'border-l-red-400',
    dot: 'bg-red-400',
  },
  medium: {
    label: '中',
    badge: 'bg-amber-50 text-amber-600 ring-1 ring-amber-200',
    border: 'border-l-amber-400',
    dot: 'bg-amber-400',
  },
  low: {
    label: '低',
    badge: 'bg-muted text-muted-foreground',
    border: 'border-l-border',
    dot: 'bg-border',
  },
} as const;
