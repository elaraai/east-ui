/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

/**
 * Runtime implementations for ReactiveDataset platform functions.
 *
 * @remarks
 * This module contains all runtime implementations for reactive dataset management:
 * - Platform function implementations (ReactiveDatasetPlatform)
 * - Singleton cache management (getReactiveDatasetCache, initializeReactiveDatasetCache)
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
    reactive_dataset_get,
    reactive_dataset_set,
    reactive_dataset_has,
    reactive_dataset_list,
    reactive_dataset_subscribe,
} from "@elaraai/east-ui";
import {
    type ReactiveDatasetCacheInterface,
    type DatasetPath,
    datasetCacheKey,
} from "./dataset-store.js";

// =============================================================================
// Singleton Cache
// =============================================================================

let _reactiveDatasetCache: ReactiveDatasetCacheInterface | null = null;

/**
 * Returns the singleton ReactiveDatasetCache instance used by ReactiveDataset platform functions.
 *
 * @returns The current `ReactiveDatasetCacheInterface` instance
 * @throws Error if ReactiveDatasetCache has not been initialized
 *
 * @remarks
 * Unlike the State store, the ReactiveDatasetCache must be explicitly initialized
 * with configuration (API URL, auth token, etc.) before use.
 * Call `initializeReactiveDatasetCache()` or use `ReactiveDatasetProvider` in React.
 */
export function getReactiveDatasetCache(): ReactiveDatasetCacheInterface {
    if (!_reactiveDatasetCache) {
        throw new Error(
            "ReactiveDatasetCache not initialized. " +
            "Use ReactiveDatasetProvider in React or call initializeReactiveDatasetCache() directly."
        );
    }
    return _reactiveDatasetCache;
}

/**
 * @deprecated Use `getReactiveDatasetCache` instead.
 */
export const getDatasetStore = getReactiveDatasetCache;

/**
 * Initializes or replaces the singleton ReactiveDatasetCache.
 *
 * @param cache - The ReactiveDatasetCache instance to use for all ReactiveDataset operations
 *
 * @remarks
 * Call this before any ReactiveDataset operations.
 * In React applications, prefer using `ReactiveDatasetProvider` instead.
 */
export function initializeReactiveDatasetCache(cache: ReactiveDatasetCacheInterface): void {
    _reactiveDatasetCache = cache;
}

/**
 * @deprecated Use `initializeReactiveDatasetCache` instead.
 */
export const initializeDatasetStore = initializeReactiveDatasetCache;

/**
 * Clears the singleton ReactiveDatasetCache.
 *
 * @remarks
 * Used during cleanup, typically when the ReactiveDatasetProvider unmounts.
 */
export function clearReactiveDatasetCache(): void {
    _reactiveDatasetCache = null;
}

/**
 * @deprecated Use `clearReactiveDatasetCache` instead.
 */
export const clearDatasetStore = clearReactiveDatasetCache;

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
 * Platform function implementations for ReactiveDataset operations.
 *
 * @remarks
 * Pass this array to `ir.compile()` to enable ReactiveDataset platform functions.
 * The implementations use the singleton cache from `getReactiveDatasetCache()`.
 *
 * @example
 * ```ts
 * import { ReactiveDataset } from "@elaraai/east-ui";
 * import { ReactiveDatasetPlatform } from "@elaraai/east-ui-components";
 *
 * const fn = East.function([], BooleanType, $ => ReactiveDataset.has("ws", path));
 * const compiled = fn.toIR().compile(ReactiveDatasetPlatform);
 * ```
 */
export const ReactiveDatasetPlatform: PlatformFunction[] = [
    /**
     * reactive_dataset_get implementation.
     *
     * Reads a dataset value, tracking the access for reactivity.
     */
    reactive_dataset_get.implement((type: EastTypeValue) => (workspace: unknown, path: unknown) => {
        const ws = workspace as string;
        const datasetPath = path as DatasetPath;
        const cache = getReactiveDatasetCache();

        // Track this path for reactive updates
        trackDatasetPath(ws, datasetPath);

        // Get cached value from cache
        const cached = cache.read(ws, datasetPath);
        if (cached === undefined) {
            const key = datasetCacheKey(ws, datasetPath);
            throw new Error(
                `Dataset not loaded: ${key}. ` +
                "Ensure the dataset is preloaded before rendering using usePreloadReactiveDatasets() or ReactiveDatasetLoader."
            );
        }

        // Decode and return
        const decode = decodeBeast2For(type);
        return decode(cached);
    }),

    /**
     * reactive_dataset_set implementation.
     *
     * Writes a value to a dataset. The write is queued and executed asynchronously.
     */
    reactive_dataset_set.implement((type: EastTypeValue) => (workspace: unknown, path: unknown, value: unknown) => {
        const ws = workspace as string;
        const datasetPath = path as DatasetPath;
        const cache = getReactiveDatasetCache();

        // Encode value
        const encode = encodeBeast2For(type);
        const encoded = encode(value);

        // Queue the async write
        queueWrite(() => cache.write(ws, datasetPath, encoded));

        return null;
    }),

    /**
     * reactive_dataset_has implementation.
     */
    reactive_dataset_has.implement((workspace: unknown, path: unknown) => {
        const ws = workspace as string;
        const datasetPath = path as DatasetPath;
        const cache = getReactiveDatasetCache();

        return cache.has(ws, datasetPath);
    }),

    /**
     * reactive_dataset_list implementation.
     *
     * Returns cached list or throws if not preloaded.
     */
    reactive_dataset_list.implement((workspace: unknown, path: unknown) => {
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
     * reactive_dataset_subscribe implementation.
     *
     * Sets up polling for a dataset.
     */
    reactive_dataset_subscribe.implement((workspace: unknown, path: unknown, intervalMs: unknown) => {
        const ws = workspace as string;
        const datasetPath = path as DatasetPath;
        const interval = Number(intervalMs);
        const cache = getReactiveDatasetCache();

        cache.setRefetchInterval(ws, datasetPath, interval);

        return null;
    }),
];

/**
 * @deprecated Use `ReactiveDatasetPlatform` instead.
 */
export const DatasetImpl = ReactiveDatasetPlatform;

// =============================================================================
// Helper Functions for Preloading Lists
// =============================================================================

/**
 * Preload a reactive dataset list into cache.
 *
 * @param workspace - The workspace name
 * @param path - The dataset path
 */
export async function preloadReactiveDatasetList(workspace: string, path: DatasetPath): Promise<string[]> {
    const cache = getReactiveDatasetCache();
    const key = datasetCacheKey(workspace, path);

    // Check cache
    const cached = listCache.get(key);
    if (cached) {
        return cached;
    }

    // Fetch and cache
    const result = await cache.list(workspace, path);
    listCache.set(key, result);
    return result;
}

/**
 * @deprecated Use `preloadReactiveDatasetList` instead.
 */
export const preloadDatasetList = preloadReactiveDatasetList;

/**
 * Clear the reactive dataset list cache.
 */
export function clearReactiveDatasetListCache(): void {
    listCache.clear();
}

/**
 * @deprecated Use `clearReactiveDatasetListCache` instead.
 */
export const clearDatasetListCache = clearReactiveDatasetListCache;
