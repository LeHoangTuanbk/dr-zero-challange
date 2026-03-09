'use client';

import { lazy } from 'react';
import type { MiniAppComponent } from '@shared/lib/workflow/types';
import registryConfig from '@shared/config/mini-app-registry.json';

// Feature chunk loaders — webpack bundles each feature as a separate JS chunk.
// Adding a new feature = one entry here + entries in mini-app-registry.json.
const FEATURE_LOADERS: Record<
  string,
  () => Promise<Record<string, MiniAppComponent>>
> = {
  anomaly: () => import('@features/anomaly/mini-apps'),
  extraction: () => import('@features/extraction/mini-apps'),
  supplier: () => import('@features/supplier/mini-apps'),
};

type RegistryEntry = {
  feature: string;
  export: string;
  title: string;
  pattern: string;
};

const isRegistryEntry = (v: unknown): v is RegistryEntry =>
  typeof v === 'object' && v !== null && 'feature' in v && 'export' in v;

const MINI_APP_REGISTRY: Record<string, MiniAppComponent> = Object.fromEntries(
  Object.entries(registryConfig)
    .filter(([, v]) => isRegistryEntry(v))
    .map(([key, entry]) => {
      const { feature, export: exportName } = entry as RegistryEntry;
      return [
        key,
        lazy(() =>
          FEATURE_LOADERS[feature]().then((mod) => ({
            default: mod[exportName],
          })),
        ) as unknown as MiniAppComponent,
      ];
    }),
);

export const getMiniApp = (key: string): MiniAppComponent | null =>
  MINI_APP_REGISTRY[key] ?? null;
