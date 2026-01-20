/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

/**
 * Runtime implementations for Dataset platform functions.
 *
 * @remarks
 * This module contains all runtime implementations for dataset management:
 * - Platform function implementations (DatasetImpl)
 * - Singleton store management (getDatasetStore, initializeDatasetStore)
 * - Reactive dependency tracking (enableDatasetTracking, disableDatasetTracking, etc.)
 *
 * @packageDocumentation
 */

import {
    type EastTypeValue,
    encodeBeast2For,
    decodeBeast2For,
} from "@elaraai/east";
import { type PlatformFunction } from "@elaraai/east/internal";
import {
    use_dataset_get,
    use_dataset_set,
    use_dataset_has,
    use_dataset_list,
    use_dataset_subscribe,
} from "@elaraai/east-ui";
import {
    type DatasetStoreInterface,
    type DatasetPath,
    datasetCacheKey,
} from "./dataset-store.js";

// =============================================================================
// Singleton Store
// =============================================================================

let _datasetStore: DatasetStoreInterface | null = null;

/**
 * Returns the singleton DatasetStore instance used by Dataset platform functions.
 *
 * @returns The current `DatasetStoreInterface` instance
 * @throws Error if DatasetStore has not been initialized
 *
 * @remarks
 * Unlike the State store, the DatasetStore must be explicitly initialized
 * with configuration (API URL, auth token, etc.) before use.
 * Call `initializeDatasetStore()` or use `DatasetStoreProvider` in React.
 */
export function getDatasetStore(): DatasetStoreInterface {
    if (!_datasetStore) {
        throw new Error(
            "DatasetStore not initialized. " +
            "Use DatasetStoreProvider in React or call initializeDatasetStore() directly."
        );
    }
    return _datasetStore;
}

/**
 * Initializes or replaces the singleton DatasetStore.
 *
 * @param store - The DatasetStore instance to use for all Dataset operations
 *
 * @remarks
 * Call this before any Dataset operations.
 * In React applications, prefer using `DatasetStoreProvider` instead.
 */
export function initializeDatasetStore(store: DatasetStoreInterface): void {
    _datasetStore = store;
}

/**
 * Clears the singleton DatasetStore.
 *
 * @remarks
 * Used during cleanup, typically when the DatasetStoreProvider unmounts.
 */
export function clearDatasetStore(): void {
    _datasetStore = null;
}

// =============================================================================
// Reactive Dependency Tracking
// =============================================================================

/**
 * Tracking context for reactive dependency collection.
 * When set, dataset_read calls will record their keys here.
 */
let datasetTrackingContext: Set<string> | null = null;

/**
 * Enable dependency tracking for reactive components.
 *
 * @remarks
 * Call this before executing a reactive component's render function.
 * All subsequent `dataset_read` calls will record their keys to the tracking set.
 * Call {@link disableDatasetTracking} when done to get the collected keys.
 *
 * @returns The Set that will collect accessed keys
 */
export function enableDatasetTracking(): Set<string> {
    datasetTrackingContext = new Set();
    return datasetTrackingContext;
}

/**
 * Disable dependency tracking and return collected keys.
 *
 * @returns Array of dataset keys that were read during tracking
 */
export function disableDatasetTracking(): string[] {
    const keys = datasetTrackingContext ? [...datasetTrackingContext] : [];
    datasetTrackingContext = null;
    return keys;
}

/**
 * Check if dependency tracking is currently enabled.
 */
export function isDatasetTracking(): boolean {
    return datasetTrackingContext !== null;
}

/**
 * Record a dataset path access during dependency tracking.
 *
 * @param workspace - The workspace name
 * @param path - The dataset path
 */
export function trackDatasetPath(workspace: string, path: DatasetPath): void {
    if (datasetTrackingContext) {
        const key = datasetCacheKey(workspace, path);
        datasetTrackingContext.add(key);
    }
}

// =============================================================================
// Pending Writes Queue
// =============================================================================

/**
 * Queue for pending async writes.
 * Write operations are queued and executed asynchronously.
 */
const pendingWrites: Array<() => Promise<void>> = [];
let isProcessingWrites = false;

/**
 * Queue a write operation and process the queue.
 */
function queueWrite(writeFn: () => Promise<void>): void {
    pendingWrites.push(writeFn);
    processWriteQueue();
}

/**
 * Process the write queue asynchronously.
 */
async function processWriteQueue(): Promise<void> {
    if (isProcessingWrites) return;
    isProcessingWrites = true;

    while (pendingWrites.length > 0) {
        const writeFn = pendingWrites.shift()!;
        try {
            await writeFn();
        } catch (error) {
            console.error("Dataset write failed:", error);
        }
    }

    isProcessingWrites = false;
}

// =============================================================================
// Pending List Operations
// =============================================================================

/**
 * Cache for list results.
 */
const listCache: Map<string, string[]> = new Map();

// =============================================================================
// Platform Implementation
// =============================================================================

/**
 * Platform function implementations for Dataset operations.
 *
 * @remarks
 * Pass this array to `ir.compile()` to enable Dataset platform functions.
 * The implementations use the singleton store from `getDatasetStore()`.
 *
 * @example
 * ```ts
 * import { Dataset } from "@elaraai/east-ui";
 * import { DatasetImpl } from "@elaraai/east-ui-components";
 *
 * const fn = East.function([], BooleanType, $ => Dataset.has("ws", path));
 * const compiled = fn.toIR().compile(DatasetImpl);
 * ```
 */
export const DatasetImpl: PlatformFunction[] = [
    /**
     * use_dataset_get implementation.
     *
     * Reads a dataset value, tracking the access for reactivity.
     */
    use_dataset_get.implement((type: EastTypeValue) => (workspace: unknown, path: unknown) => {
        const ws = workspace as string;
        const datasetPath = path as DatasetPath;
        const store = getDatasetStore();

        // Track this path for reactive updates
        trackDatasetPath(ws, datasetPath);

        // Get cached value from store
        const cached = store.read(ws, datasetPath);
        if (cached === undefined) {
            const key = datasetCacheKey(ws, datasetPath);
            throw new Error(
                `Dataset not loaded: ${key}. ` +
                "Ensure the dataset is preloaded before rendering using usePreloadDatasets() or DatasetLoader."
            );
        }

        // Decode and return
        const decode = decodeBeast2For(type);
        return decode(cached);
    }),

    /**
     * use_dataset_set implementation.
     *
     * Writes a value to a dataset. The write is queued and executed asynchronously.
     */
    use_dataset_set.implement((type: EastTypeValue) => (workspace: unknown, path: unknown, value: unknown) => {
        const ws = workspace as string;
        const datasetPath = path as DatasetPath;
        const store = getDatasetStore();

        // Encode value
        const encode = encodeBeast2For(type);
        const encoded = encode(value);

        // Queue the async write
        queueWrite(() => store.write(ws, datasetPath, encoded));

        return null;
    }),

    /**
     * use_dataset_has implementation.
     */
    use_dataset_has.implement((workspace: unknown, path: unknown) => {
        const ws = workspace as string;
        const datasetPath = path as DatasetPath;
        const store = getDatasetStore();

        return store.has(ws, datasetPath);
    }),

    /**
     * use_dataset_list implementation.
     *
     * Returns cached list or throws if not preloaded.
     */
    use_dataset_list.implement((workspace: unknown, path: unknown) => {
        const ws = workspace as string;
        const datasetPath = path as DatasetPath;
        const key = datasetCacheKey(ws, datasetPath);

        // Check cache
        const cached = listCache.get(key);
        if (cached) {
            return cached;
        }

        // Not cached - throw error
        throw new Error(
            `Dataset list not loaded: ${key}. ` +
            "Ensure the dataset list is preloaded before rendering."
        );
    }),

    /**
     * use_dataset_subscribe implementation.
     *
     * Sets up polling for a dataset.
     */
    use_dataset_subscribe.implement((workspace: unknown, path: unknown, intervalMs: unknown) => {
        const ws = workspace as string;
        const datasetPath = path as DatasetPath;
        const interval = Number(intervalMs);
        const store = getDatasetStore();

        store.setRefetchInterval(ws, datasetPath, interval);

        return null;
    }),
];

// =============================================================================
// Helper Functions for Preloading Lists
// =============================================================================

/**
 * Preload a dataset list into cache.
 *
 * @param workspace - The workspace name
 * @param path - The dataset path
 */
export async function preloadDatasetList(workspace: string, path: DatasetPath): Promise<string[]> {
    const store = getDatasetStore();
    const key = datasetCacheKey(workspace, path);

    // Check cache
    const cached = listCache.get(key);
    if (cached) {
        return cached;
    }

    // Fetch and cache
    const result = await store.list(workspace, path);
    listCache.set(key, result);
    return result;
}

/**
 * Clear the list cache.
 */
export function clearDatasetListCache(): void {
    listCache.clear();
}
