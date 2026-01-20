# Dataset Platform Functions Design Document

## Overview

This document describes the design for new platform functions in `east-ui` that enable reading and writing datasets from/to e3. The implementation in `east-ui-components` will use React hooks with TanStack Query for data fetching and caching.

**Key Requirement:** Changes to dataset values must trigger re-renders in any reactive component that accessed the dataset, similar to how the existing `State` platform functions work.

## Background

### Existing State Platform Functions

The current `State` platform functions provide local state management:

```typescript
// In east-ui/src/platform/state.ts
export const state_read = East.genericPlatform("state_read", ["T"], [StringType], "T");
export const state_write = East.genericPlatform("state_write", ["T"], [StringType, "T"], NullType);
export const state_has = East.platform("state_has", [StringType], BooleanType);
```

Key characteristics:
- **Synchronous operations** - values stored in-memory `UIStore`
- **Dependency tracking** - `state_read` calls `trackKey()` during reactive render
- **Subscription-based reactivity** - `UIStore` notifies subscribers on write
- **BEAST2 encoding** - values encoded/decoded for storage

### e3 Dataset API

The `e3-api-client` provides these dataset functions:

```typescript
// Read dataset as BEAST2 bytes
datasetGet(url, repo, workspace, path: TreePath, options): Promise<Uint8Array>

// Write dataset from BEAST2 bytes
datasetSet(url, repo, workspace, path: TreePath, data: Uint8Array, options): Promise<void>

// List datasets
datasetList(url, repo, workspace, options): Promise<string[]>
datasetListAt(url, repo, workspace, path: TreePath, options): Promise<string[]>
datasetListRecursive(url, repo, workspace, path: TreePath, options): Promise<DatasetListItem[]>
```

### TanStack Query in Extension

The extension uses TanStack Query for e3 data fetching:

```typescript
// Example from useTaskOutput.ts
export function useTaskOutput(apiUrl: string, workspace: string | null, task: TaskStatusInfo | null) {
    return useQuery({
        queryKey: ['taskOutput', apiUrl, workspace, task?.name],
        queryFn: () => datasetGet(apiUrl, 'default', workspace!, pathParts, {}),
        enabled: !!apiUrl && !!workspace && !!task && isUpToDate,
    });
}
```

## Design Goals

1. **Reactive updates** - Components automatically re-render when datasets change
2. **Consistent API** - Similar patterns to existing `State` platform functions
3. **Caching** - Efficient data fetching with TanStack Query
4. **Type safety** - Generic platform functions preserve East types
5. **Error handling** - Graceful handling of network errors and missing datasets
6. **Polling support** - Optional automatic refetching for real-time updates

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         East Code                                │
│  const data = $.let(Dataset.read([MyType], "workspace", path))  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Platform Functions (east-ui)                  │
│  dataset_read, dataset_write, dataset_has, dataset_subscribe    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│             Platform Implementation (east-ui-components)         │
│  DatasetImpl using DatasetStore + TanStack Query                │
└─────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐
│      DatasetStore           │   │      TanStack Query         │
│  - Local cache (UIStore)    │   │  - Network fetching         │
│  - Subscription management  │   │  - Background refetching    │
│  - Dependency tracking      │   │  - Cache invalidation       │
└─────────────────────────────┘   └─────────────────────────────┘
                    │                       │
                    └───────────┬───────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      e3 API Server                               │
│                 datasetGet / datasetSet                          │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Read Flow:**
   ```
   East Code → dataset_read → DatasetStore.read()
   → Check local cache → If miss: TanStack Query fetch → e3 API
   → Decode BEAST2 → Return value → Track dependency
   ```

2. **Write Flow:**
   ```
   East Code → dataset_write → Encode BEAST2
   → TanStack Query mutation → e3 API → datasetSet
   → Invalidate query cache → Notify subscribers → Trigger re-renders
   ```

3. **Reactivity Flow:**
   ```
   Reactive Component renders → enableTracking()
   → dataset_read tracks path → disableTracking()
   → Subscribe to tracked paths → On change: re-render
   ```

## Platform Function Definitions

### Location: `packages/east-ui/src/platform/dataset.ts`

```typescript
import { East, StringType, NullType, BooleanType, ArrayType } from '@elaraai/east';
import { TreePathType } from '@elaraai/e3-types';

/**
 * Read a dataset value from e3.
 *
 * @typeParam T - The East type of the dataset value
 * @param workspace - The workspace name
 * @param path - The dataset path (e.g., [variant('field', 'inputs'), variant('field', 'sales')])
 * @returns The decoded dataset value
 *
 * @remarks
 * - Tracks the dataset path for reactive updates
 * - Returns cached value if available
 * - Throws if dataset not found or fetch fails
 */
export const dataset_read = East.genericPlatform(
    "dataset_read",
    ["T"],
    [StringType, TreePathType],  // workspace, path
    "T"
);

/**
 * Write a value to a dataset in e3.
 *
 * @typeParam T - The East type of the value
 * @param workspace - The workspace name
 * @param path - The dataset path
 * @param value - The value to write
 * @returns Null
 *
 * @remarks
 * - Encodes value as BEAST2 and sends to e3
 * - Invalidates cached data and triggers re-renders
 * - Throws if write fails
 */
export const dataset_write = East.genericPlatform(
    "dataset_write",
    ["T"],
    [StringType, TreePathType, "T"],  // workspace, path, value
    NullType
);

/**
 * Check if a dataset exists and has a value.
 *
 * @param workspace - The workspace name
 * @param path - The dataset path
 * @returns True if the dataset exists and is assigned
 */
export const dataset_has = East.platform(
    "dataset_has",
    [StringType, TreePathType],  // workspace, path
    BooleanType
);

/**
 * List field names at a dataset path.
 *
 * @param workspace - The workspace name
 * @param path - The parent path (empty array for root)
 * @returns Array of field names
 */
export const dataset_list = East.platform(
    "dataset_list",
    [StringType, TreePathType],  // workspace, path
    ArrayType(StringType)
);

/**
 * Subscribe to dataset changes with polling.
 *
 * @param workspace - The workspace name
 * @param path - The dataset path
 * @param intervalMs - Polling interval in milliseconds
 * @returns Null (subscription is implicit)
 *
 * @remarks
 * - Enables automatic refetching at the specified interval
 * - Useful for datasets that may be updated by external processes
 */
export const dataset_subscribe = East.platform(
    "dataset_subscribe",
    [StringType, TreePathType, IntegerType],  // workspace, path, intervalMs
    NullType
);
```

### Export: `packages/east-ui/src/platform/index.ts`

```typescript
import {
    dataset_read,
    dataset_write,
    dataset_has,
    dataset_list,
    dataset_subscribe,
} from './dataset.js';

export const Dataset = {
    read: dataset_read,
    write: dataset_write,
    has: dataset_has,
    list: dataset_list,
    subscribe: dataset_subscribe,
} as const;

// Implementation reference for east-ui-components
export { DatasetImpl } from './dataset.js';
```

## Implementation

### Location: `packages/east-ui-components/src/platform/dataset-runtime.ts`

```typescript
import { QueryClient, QueryObserver } from '@tanstack/react-query';
import { datasetGet, datasetSet, datasetListAt } from '@elaraai/e3-api-client';
import type { TreePath } from '@elaraai/e3-types';
import { encodeBeast2For, decodeBeast2For } from '@elaraai/east';
import type { EastTypeValue, PlatformFunction } from '@elaraai/east';
import { dataset_read, dataset_write, dataset_has, dataset_list, dataset_subscribe } from '@elaraai/east-ui';
import { getDatasetStore, trackDatasetPath } from './dataset-store.js';

/**
 * Create a stable query key for a dataset path.
 */
function datasetQueryKey(workspace: string, path: TreePath): readonly unknown[] {
    const pathStr = path.map(p => p.value).join('.');
    return ['dataset', workspace, pathStr] as const;
}

/**
 * Platform function implementations for dataset operations.
 */
export const DatasetImpl: PlatformFunction[] = [
    /**
     * dataset_read implementation.
     *
     * Reads a dataset value, tracking the access for reactivity.
     */
    dataset_read.implement((type: EastTypeValue) => (workspace: unknown, path: unknown) => {
        const ws = workspace as string;
        const treePath = path as TreePath;
        const store = getDatasetStore();

        // Track this path for reactive updates
        trackDatasetPath(ws, treePath);

        // Get cached value from store
        const cached = store.read(ws, treePath);
        if (cached === undefined) {
            throw new Error(`Dataset not loaded: ${ws}${pathToString(treePath)}`);
        }

        // Decode and return
        const decode = decodeBeast2For(type);
        return decode(cached);
    }),

    /**
     * dataset_write implementation.
     *
     * Writes a value to a dataset and triggers cache invalidation.
     */
    dataset_write.implement((type: EastTypeValue) => (workspace: unknown, path: unknown, value: unknown) => {
        const ws = workspace as string;
        const treePath = path as TreePath;
        const store = getDatasetStore();

        // Encode value
        const encode = encodeBeast2For(type);
        const encoded = encode(value);

        // Write to store (triggers mutation)
        store.write(ws, treePath, encoded);

        return null;
    }),

    /**
     * dataset_has implementation.
     */
    dataset_has.implement((workspace: unknown, path: unknown) => {
        const ws = workspace as string;
        const treePath = path as TreePath;
        const store = getDatasetStore();

        return store.has(ws, treePath);
    }),

    /**
     * dataset_list implementation.
     */
    dataset_list.implement((workspace: unknown, path: unknown) => {
        const ws = workspace as string;
        const treePath = path as TreePath;
        const store = getDatasetStore();

        return store.list(ws, treePath);
    }),

    /**
     * dataset_subscribe implementation.
     */
    dataset_subscribe.implement((workspace: unknown, path: unknown, intervalMs: unknown) => {
        const ws = workspace as string;
        const treePath = path as TreePath;
        const interval = Number(intervalMs);
        const store = getDatasetStore();

        store.setRefetchInterval(ws, treePath, interval);

        return null;
    }),
];
```

### DatasetStore: `packages/east-ui-components/src/platform/dataset-store.ts`

```typescript
import { QueryClient, QueryObserver } from '@tanstack/react-query';
import { datasetGet, datasetSet, datasetListAt } from '@elaraai/e3-api-client';
import type { TreePath } from '@elaraai/e3-types';
import { pathToString } from '@elaraai/e3-types';

/**
 * Configuration for the DatasetStore.
 */
export interface DatasetStoreConfig {
    /** Base URL of the e3 API server */
    apiUrl: string;
    /** Repository name (default: 'default') */
    repo?: string;
    /** Authentication token */
    token?: string;
    /** Default stale time in ms (default: 30000) */
    staleTime?: number;
    /** Default refetch interval in ms (default: undefined - no polling) */
    refetchInterval?: number;
}

/**
 * DatasetStore manages dataset caching and reactivity.
 *
 * Combines TanStack Query for network operations with a local
 * subscription system for reactive updates.
 */
export class DatasetStore {
    private queryClient: QueryClient;
    private config: Required<Omit<DatasetStoreConfig, 'token' | 'refetchInterval'>> & Pick<DatasetStoreConfig, 'token' | 'refetchInterval'>;

    // Local cache for synchronous access
    private cache: Map<string, Uint8Array> = new Map();

    // Subscription management
    private subscribers: Map<string, Set<() => void>> = new Map();
    private globalSubscribers: Set<() => void> = new Set();

    // Version tracking for useSyncExternalStore
    private version: number = 0;
    private keyVersions: Map<string, number> = new Map();

    // Refetch intervals per path
    private refetchIntervals: Map<string, number> = new Map();

    // Active query observers
    private observers: Map<string, QueryObserver> = new Map();

    // Batching
    private batchDepth: number = 0;
    private changedKeys: Set<string> = new Set();

    // Pending fetches for preloading
    private pendingFetches: Map<string, Promise<Uint8Array>> = new Map();

    // Scheduler for deferred notifications
    private scheduler: ((notify: () => void) => void) | undefined;

    constructor(queryClient: QueryClient, config: DatasetStoreConfig) {
        this.queryClient = queryClient;
        this.config = {
            apiUrl: config.apiUrl,
            repo: config.repo ?? 'default',
            token: config.token,
            staleTime: config.staleTime ?? 30000,
            refetchInterval: config.refetchInterval,
        };
    }

    /**
     * Create a cache key from workspace and path.
     */
    private cacheKey(workspace: string, path: TreePath): string {
        return `${workspace}:${pathToString(path)}`;
    }

    /**
     * Create a TanStack Query key.
     */
    private queryKey(workspace: string, path: TreePath): readonly unknown[] {
        return ['dataset', workspace, pathToString(path)] as const;
    }

    /**
     * Read a dataset value synchronously from cache.
     */
    read(workspace: string, path: TreePath): Uint8Array | undefined {
        const key = this.cacheKey(workspace, path);
        return this.cache.get(key);
    }

    /**
     * Check if a dataset is cached.
     */
    has(workspace: string, path: TreePath): boolean {
        const key = this.cacheKey(workspace, path);
        return this.cache.has(key);
    }

    /**
     * Write a dataset value (triggers mutation to e3).
     */
    async write(workspace: string, path: TreePath, value: Uint8Array): Promise<void> {
        const key = this.cacheKey(workspace, path);

        // Optimistic update
        const previous = this.cache.get(key);
        this.cache.set(key, value);
        this.notifyChange(key);

        try {
            // Send to e3
            await datasetSet(
                this.config.apiUrl,
                this.config.repo,
                workspace,
                path,
                value,
                { token: this.config.token }
            );

            // Invalidate query cache
            await this.queryClient.invalidateQueries({
                queryKey: this.queryKey(workspace, path),
            });
        } catch (error) {
            // Rollback on failure
            if (previous !== undefined) {
                this.cache.set(key, previous);
            } else {
                this.cache.delete(key);
            }
            this.notifyChange(key);
            throw error;
        }
    }

    /**
     * List fields at a path.
     */
    async list(workspace: string, path: TreePath): Promise<string[]> {
        return datasetListAt(
            this.config.apiUrl,
            this.config.repo,
            workspace,
            path,
            { token: this.config.token }
        );
    }

    /**
     * Preload a dataset into cache.
     */
    async preload(workspace: string, path: TreePath): Promise<void> {
        const key = this.cacheKey(workspace, path);

        // Check if already cached or loading
        if (this.cache.has(key)) return;
        if (this.pendingFetches.has(key)) {
            await this.pendingFetches.get(key);
            return;
        }

        // Start fetch
        const fetchPromise = this.fetchDataset(workspace, path);
        this.pendingFetches.set(key, fetchPromise);

        try {
            const data = await fetchPromise;
            this.cache.set(key, data);
            this.notifyChange(key);
        } finally {
            this.pendingFetches.delete(key);
        }
    }

    /**
     * Fetch a dataset from e3.
     */
    private async fetchDataset(workspace: string, path: TreePath): Promise<Uint8Array> {
        return this.queryClient.fetchQuery({
            queryKey: this.queryKey(workspace, path),
            queryFn: () => datasetGet(
                this.config.apiUrl,
                this.config.repo,
                workspace,
                path,
                { token: this.config.token }
            ),
            staleTime: this.config.staleTime,
        });
    }

    /**
     * Set refetch interval for a dataset.
     */
    setRefetchInterval(workspace: string, path: TreePath, intervalMs: number): void {
        const key = this.cacheKey(workspace, path);
        this.refetchIntervals.set(key, intervalMs);

        // Create or update query observer
        this.setupQueryObserver(workspace, path, intervalMs);
    }

    /**
     * Setup a query observer for automatic refetching.
     */
    private setupQueryObserver(workspace: string, path: TreePath, intervalMs: number): void {
        const key = this.cacheKey(workspace, path);

        // Remove existing observer
        const existing = this.observers.get(key);
        if (existing) {
            existing.destroy();
        }

        // Create new observer
        const observer = new QueryObserver(this.queryClient, {
            queryKey: this.queryKey(workspace, path),
            queryFn: () => datasetGet(
                this.config.apiUrl,
                this.config.repo,
                workspace,
                path,
                { token: this.config.token }
            ),
            refetchInterval: intervalMs,
            staleTime: 0, // Always consider stale for polling
        });

        // Subscribe to updates
        observer.subscribe((result) => {
            if (result.data) {
                const current = this.cache.get(key);
                if (!current || !this.bytesEqual(current, result.data)) {
                    this.cache.set(key, result.data);
                    this.notifyChange(key);
                }
            }
        });

        this.observers.set(key, observer);
    }

    /**
     * Compare two Uint8Arrays for equality.
     */
    private bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    // =========================================================================
    // Subscription API (mirrors UIStore for compatibility)
    // =========================================================================

    /**
     * Subscribe to changes on a specific key.
     */
    subscribe(key: string, callback: () => void): () => void;
    /**
     * Subscribe to all changes.
     */
    subscribe(callback: () => void): () => void;
    subscribe(keyOrCallback: string | (() => void), maybeCallback?: () => void): () => void {
        if (typeof keyOrCallback === 'function') {
            // Global subscription
            this.globalSubscribers.add(keyOrCallback);
            return () => this.globalSubscribers.delete(keyOrCallback);
        } else {
            // Key-specific subscription
            const key = keyOrCallback;
            const callback = maybeCallback!;
            let subs = this.subscribers.get(key);
            if (!subs) {
                subs = new Set();
                this.subscribers.set(key, subs);
            }
            subs.add(callback);
            return () => {
                subs!.delete(callback);
                if (subs!.size === 0) {
                    this.subscribers.delete(key);
                }
            };
        }
    }

    /**
     * Get global version for useSyncExternalStore.
     */
    getSnapshot(): number {
        return this.version;
    }

    /**
     * Get version for a specific key.
     */
    getKeyVersion(key: string): number {
        return this.keyVersions.get(key) ?? 0;
    }

    /**
     * Set scheduler for deferred notifications.
     */
    setScheduler(scheduler: ((notify: () => void) => void) | undefined): void {
        this.scheduler = scheduler;
    }

    /**
     * Batch multiple operations.
     */
    batch<T>(fn: () => T): T {
        this.batchDepth++;
        try {
            return fn();
        } finally {
            this.batchDepth--;
            if (this.batchDepth === 0) {
                this.flush();
            }
        }
    }

    /**
     * Notify subscribers of a change.
     */
    private notifyChange(key: string): void {
        // Increment key version
        const currentVersion = this.keyVersions.get(key) ?? 0;
        this.keyVersions.set(key, currentVersion + 1);

        this.changedKeys.add(key);

        if (this.batchDepth === 0) {
            this.flush();
        }
    }

    /**
     * Flush pending notifications.
     */
    private flush(): void {
        if (this.changedKeys.size === 0) return;

        const doFlush = () => {
            this.version++;

            // Notify key-specific subscribers
            for (const key of this.changedKeys) {
                const subs = this.subscribers.get(key);
                if (subs) {
                    for (const cb of subs) cb();
                }
            }

            // Notify global subscribers
            for (const cb of this.globalSubscribers) cb();

            this.changedKeys.clear();
        };

        if (this.scheduler) {
            this.scheduler(doFlush);
        } else {
            doFlush();
        }
    }

    /**
     * Cleanup resources.
     */
    destroy(): void {
        for (const observer of this.observers.values()) {
            observer.destroy();
        }
        this.observers.clear();
        this.subscribers.clear();
        this.globalSubscribers.clear();
        this.cache.clear();
    }
}

// =========================================================================
// Global Store Access (mirrors state-runtime.ts pattern)
// =========================================================================

let globalDatasetStore: DatasetStore | undefined;

export function setDatasetStore(store: DatasetStore): void {
    globalDatasetStore = store;
}

export function getDatasetStore(): DatasetStore {
    if (!globalDatasetStore) {
        throw new Error('DatasetStore not initialized. Wrap your app in DatasetStoreProvider.');
    }
    return globalDatasetStore;
}

// =========================================================================
// Dependency Tracking (mirrors state-runtime.ts pattern)
// =========================================================================

let datasetTrackingContext: Set<string> | null = null;

export function enableDatasetTracking(): Set<string> {
    datasetTrackingContext = new Set();
    return datasetTrackingContext;
}

export function disableDatasetTracking(): string[] {
    const keys = datasetTrackingContext ? [...datasetTrackingContext] : [];
    datasetTrackingContext = null;
    return keys;
}

export function trackDatasetPath(workspace: string, path: TreePath): void {
    if (datasetTrackingContext) {
        const key = `${workspace}:${pathToString(path)}`;
        datasetTrackingContext.add(key);
    }
}
```

### React Provider: `packages/east-ui-components/src/platform/dataset-hooks.tsx`

```typescript
import React, { createContext, useContext, useEffect, useCallback, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';
import { DatasetStore, DatasetStoreConfig, getDatasetStore, setDatasetStore } from './dataset-store.js';
import type { TreePath } from '@elaraai/e3-types';

// =========================================================================
// Context
// =========================================================================

const DatasetStoreContext = createContext<DatasetStore | undefined>(undefined);

export interface DatasetStoreProviderProps {
    children: React.ReactNode;
    config: DatasetStoreConfig;
    queryClient?: QueryClient;
}

/**
 * Provider for dataset operations.
 *
 * Sets up TanStack Query and DatasetStore for the component tree.
 */
export function DatasetStoreProvider({
    children,
    config,
    queryClient: externalQueryClient,
}: DatasetStoreProviderProps) {
    // Create or use provided QueryClient
    const queryClient = useMemo(
        () => externalQueryClient ?? new QueryClient({
            defaultOptions: {
                queries: {
                    retry: 2,
                    staleTime: config.staleTime ?? 30000,
                },
            },
        }),
        [externalQueryClient, config.staleTime]
    );

    // Create DatasetStore
    const store = useMemo(
        () => new DatasetStore(queryClient, config),
        [queryClient, config]
    );

    // Set global store reference
    useEffect(() => {
        setDatasetStore(store);

        // Configure deferred notifications
        store.setScheduler((notify) => queueMicrotask(notify));

        return () => {
            store.destroy();
        };
    }, [store]);

    return (
        <QueryClientProvider client={queryClient}>
            <DatasetStoreContext.Provider value={store}>
                {children}
            </DatasetStoreContext.Provider>
        </QueryClientProvider>
    );
}

// =========================================================================
// Hooks
// =========================================================================

/**
 * Get the DatasetStore from context.
 */
export function useDatasetStore(): DatasetStore {
    const store = useContext(DatasetStoreContext);
    if (!store) {
        throw new Error('useDatasetStore must be used within a DatasetStoreProvider');
    }
    return store;
}

/**
 * Subscribe to dataset store changes.
 */
export function useDatasetStoreSubscription(): number {
    const store = useDatasetStore();
    const subscribe = useCallback((cb: () => void) => store.subscribe(cb), [store]);
    const getSnapshot = useCallback(() => store.getSnapshot(), [store]);
    return useSyncExternalStore(subscribe, getSnapshot);
}

/**
 * Subscribe to a specific dataset key.
 */
export function useDatasetKey(workspace: string, path: TreePath): Uint8Array | undefined {
    const store = useDatasetStore();
    const key = `${workspace}:${path.map(p => p.value).join('.')}`;

    const subscribe = useCallback(
        (cb: () => void) => store.subscribe(key, cb),
        [store, key]
    );
    const getSnapshot = useCallback(
        () => store.read(workspace, path),
        [store, workspace, path]
    );

    return useSyncExternalStore(subscribe, getSnapshot);
}

/**
 * Preload datasets before rendering.
 */
export function usePreloadDatasets(
    datasets: Array<{ workspace: string; path: TreePath }>
): { loading: boolean; error: Error | null } {
    const store = useDatasetStore();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    useEffect(() => {
        let cancelled = false;

        Promise.all(
            datasets.map(({ workspace, path }) => store.preload(workspace, path))
        )
            .then(() => {
                if (!cancelled) setLoading(false);
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err);
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [store, datasets]);

    return { loading, error };
}
```

### Integration with Reactive Components

The reactive component implementation in `east-ui-components/src/reactive/index.tsx` needs to be extended to support dataset tracking:

```typescript
// In EastReactiveComponent
export function EastReactiveComponent({ value }: { value: ReactiveValue }) {
    const store = getStore();
    const datasetStore = getDatasetStore();

    // Track both state and dataset dependencies
    const stateDepsRef = useRef<string[]>([]);
    const datasetDepsRef = useRef<string[]>([]);

    const executeWithTracking = useCallback(() => {
        // Enable tracking for both state and datasets
        enableTracking();  // State tracking
        enableDatasetTracking();  // Dataset tracking

        try {
            const result = value.render();
            stateDepsRef.current = disableTracking();
            datasetDepsRef.current = disableDatasetTracking();
            return result;
        } catch (e) {
            disableTracking();
            disableDatasetTracking();
            throw e;
        }
    }, [value]);

    // Subscribe to both state and dataset changes
    const subscribe = useCallback((cb: () => void) => {
        const stateUnsubs = stateDepsRef.current.map(key => store.subscribe(key, cb));
        const datasetUnsubs = datasetDepsRef.current.map(key => datasetStore.subscribe(key, cb));
        return () => {
            stateUnsubs.forEach(fn => fn());
            datasetUnsubs.forEach(fn => fn());
        };
    }, [store, datasetStore]);

    // Combine snapshots
    const getSnapshot = useCallback(() => {
        const stateSnapshot = stateDepsRef.current
            .map(k => `s:${k}:${store.getKeyVersion(k)}`)
            .join(",");
        const datasetSnapshot = datasetDepsRef.current
            .map(k => `d:${k}:${datasetStore.getKeyVersion(k)}`)
            .join(",");
        return `${stateSnapshot}|${datasetSnapshot}`;
    }, [store, datasetStore]);

    const snapshot = useSyncExternalStore(subscribe, getSnapshot);
    const result = useMemo(() => executeWithTracking(), [executeWithTracking, snapshot]);

    return <EastChakraComponent value={result} />;
}
```

## Usage Examples

### Basic Read

```typescript
import { East, IntegerType } from '@elaraai/east';
import { Dataset, Reactive, UIComponentType } from '@elaraai/east-ui';
import { variant } from '@elaraai/east';

const salesDashboard = East.function([], UIComponentType, $ => {
    // Read a dataset value
    const sales = $.let(Dataset.read(
        [IntegerType],
        "production",
        [variant('field', 'reports'), variant('field', 'sales')]
    ));

    return Reactive.Root($ => {
        const currentSales = $.let(Dataset.read(
            [IntegerType],
            "production",
            [variant('field', 'reports'), variant('field', 'sales')]
        ));

        return Text.Root(East.str`Total Sales: ${currentSales}`);
    });
});
```

### Write with Reactive Update

```typescript
const counterApp = East.function([], UIComponentType, $ => {
    const incrementFn = East.function([], NullType, $ => {
        const current = $.let(Dataset.read(
            [IntegerType],
            "workspace",
            [variant('field', 'counter')]
        ));

        $(Dataset.write(
            [IntegerType],
            "workspace",
            [variant('field', 'counter')],
            current.add(1n)
        ));
    });

    return Reactive.Root($ => {
        const count = $.let(Dataset.read(
            [IntegerType],
            "workspace",
            [variant('field', 'counter')]
        ));

        return Button.Root(East.str`Count: ${count}`, {
            onClick: incrementFn
        });
    });
});
```

### Polling for External Updates

```typescript
const liveDataView = East.function([], UIComponentType, $ => {
    // Subscribe to updates every 5 seconds
    $(Dataset.subscribe(
        "production",
        [variant('field', 'live'), variant('field', 'metrics')],
        5000n
    ));

    return Reactive.Root($ => {
        const metrics = $.let(Dataset.read(
            [MetricsType],
            "production",
            [variant('field', 'live'), variant('field', 'metrics')]
        ));

        return MetricsChart.Root(metrics);
    });
});
```

### Preloading in React

```typescript
function App() {
    const { loading, error } = usePreloadDatasets([
        { workspace: 'production', path: [variant('field', 'config')] },
        { workspace: 'production', path: [variant('field', 'data')] },
    ]);

    if (loading) return <Spinner />;
    if (error) return <ErrorMessage error={error} />;

    return <EastComponent render={myApp} />;
}
```

## Error Handling

### Missing Dataset

```typescript
// Dataset.read throws if dataset not preloaded
try {
    const value = Dataset.read([MyType], "workspace", path);
} catch (e) {
    // Error: Dataset not loaded: workspace.path.to.dataset
}
```

### Network Errors

```typescript
// Dataset.write throws on network failure
try {
    Dataset.write([MyType], "workspace", path, value);
} catch (e) {
    // Error: Failed to set dataset: 500 Internal Server Error
}
```

### Handling in East Code

```typescript
// Use dataset_has to check before reading
const hasData = $.let(Dataset.has("workspace", path));
const data = $.if(hasData,
    Dataset.read([MyType], "workspace", path),
    defaultValue
);
```

## File Structure

```
packages/
├── east-ui/
│   └── src/
│       └── platform/
│           ├── dataset.ts          # Platform function definitions
│           └── index.ts            # Export Dataset namespace
│
└── east-ui-components/
    └── src/
        ├── platform/
        │   ├── dataset-runtime.ts  # Platform implementations
        │   ├── dataset-store.ts    # DatasetStore class
        │   └── dataset-hooks.tsx   # React hooks and provider
        │
        └── reactive/
            └── index.tsx           # Updated for dataset tracking
```

## Migration Path

1. Add new platform functions without changing existing code
2. Update reactive component to support dataset tracking
3. Add DatasetStoreProvider alongside existing UIStoreProvider
4. Gradually adopt Dataset functions in East code

## Testing Strategy

1. **Unit tests** for DatasetStore operations
2. **Integration tests** with mock e3 API
3. **React testing** with mock providers
4. **E2E tests** with actual e3 server

## Future Enhancements

1. **Optimistic UI** - Show pending writes immediately
2. **Offline support** - Cache writes when offline
3. **Batch fetching** - Fetch multiple datasets in one request
4. **Selective invalidation** - Invalidate only affected queries
5. **WebSocket subscriptions** - Real-time updates without polling
