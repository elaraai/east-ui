/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

/**
 * ReactiveDatasetCache for managing e3 dataset caching and reactivity.
 *
 * @remarks
 * Combines TanStack Query for network operations with a local
 * subscription system for reactive updates in East UI components.
 *
 * This differs from raw `@elaraai/e3-api-client` dataset functions which
 * are for direct API calls without reactive binding or caching.
 *
 * Uses e3-api-client for all e3 API interactions.
 *
 * @packageDocumentation
 */

import { QueryClient, QueryObserver } from "@tanstack/react-query";
import { type ValueTypeOf, variant } from "@elaraai/east";
import {
    datasetGet,
    datasetSet,
    datasetList as e3DatasetList,
    datasetListAt,
    workspaceStatus,
    type DatasetStatusInfo,
} from "@elaraai/e3-api-client";
import type { TreePath } from "@elaraai/e3-types";
import { DatasetPathSegmentType, DatasetPathType } from "@elaraai/east-ui";

/**
 * Dataset path segment - derived from East type definition.
 */
export type DatasetPathSegment = ValueTypeOf<typeof DatasetPathSegmentType>;

/**
 * Dataset path - derived from East type definition.
 */
export type DatasetPath = ValueTypeOf<typeof DatasetPathType>;

/**
 * Configuration for the ReactiveDatasetCache.
 */
export interface ReactiveDatasetCacheConfig {
    /** Base URL of the e3 API server */
    apiUrl: string;
    /** Repository name (default: 'default') */
    repo?: string;
    /** Authentication token */
    token?: string;
    /** Default stale time in ms (default: 30000) */
    staleTime?: number;
}

/**
 * @deprecated Use `ReactiveDatasetCacheConfig` instead.
 */
export type DatasetStoreConfig = ReactiveDatasetCacheConfig;

/**
 * Interface for the ReactiveDatasetCache.
 */
export interface ReactiveDatasetCacheInterface {
    /** Read a cached dataset value synchronously */
    read(workspace: string, path: DatasetPath): Uint8Array | undefined;
    /** Check if a dataset is cached */
    has(workspace: string, path: DatasetPath): boolean;
    /** Write a dataset value (async - mutates remotely) */
    write(workspace: string, path: DatasetPath, value: Uint8Array): Promise<void>;
    /** Preload a dataset into cache */
    preload(workspace: string, path: DatasetPath): Promise<void>;
    /** List fields at a path */
    list(workspace: string, path: DatasetPath): Promise<string[]>;
    /** Set polling interval for a dataset */
    setRefetchInterval(workspace: string, path: DatasetPath, intervalMs: number): void;
    /** Subscribe to changes on a specific key */
    subscribe(key: string, callback: () => void): () => void;
    /** Subscribe to all changes */
    subscribe(callback: () => void): () => void;
    /** Get global snapshot version */
    getSnapshot(): number;
    /** Get version for a specific key */
    getKeyVersion(key: string): number;
    /** Set notification scheduler */
    setScheduler(scheduler: ((notify: () => void) => void) | undefined): void;
    /** Batch multiple operations */
    batch<T>(fn: () => T): T;
    /** Get the configuration */
    getConfig(): ReactiveDatasetCacheConfig;
    /** Clean up resources */
    destroy(): void;
}

/**
 * @deprecated Use `ReactiveDatasetCacheInterface` instead.
 */
export type DatasetStoreInterface = ReactiveDatasetCacheInterface;

/**
 * Convert a dataset path to a string key for caching.
 */
export function datasetPathToString(path: DatasetPath): string {
    return path.map(p => p.value).join(".");
}

/**
 * Create a cache key from workspace and path.
 */
export function datasetCacheKey(workspace: string, path: DatasetPath): string {
    const pathStr = datasetPathToString(path);
    return pathStr ? `${workspace}.${pathStr}` : workspace;
}

/**
 * Convert our DatasetPath to e3-api-client TreePath.
 */
function toTreePath(path: DatasetPath): TreePath {
    return path as TreePath;
}

/**
 * ReactiveDatasetCache manages dataset caching and reactivity.
 *
 * @remarks
 * Combines TanStack Query for network operations with a local
 * subscription system for reactive updates. Uses e3-api-client
 * for all e3 API interactions.
 *
 * This differs from raw `@elaraai/e3-api-client` dataset functions which
 * are for direct API calls without reactive binding or caching.
 */
export class ReactiveDatasetCache implements ReactiveDatasetCacheInterface {
    private queryClient: QueryClient;
    private config: {
        apiUrl: string;
        repo: string;
        token: string | undefined;
        staleTime: number;
    };

    // Local cache for synchronous access
    private cache: Map<string, Uint8Array> = new Map();

    // Hash tracking for efficient change detection
    // Maps cache key -> last known e3 content hash
    private knownHashes: Map<string, string | null> = new Map();

    // Subscription management
    private keySubscribers: Map<string, Set<() => void>> = new Map();
    private globalSubscribers: Set<() => void> = new Set();

    // Version tracking for useSyncExternalStore
    private version: number = 0;
    private keyVersions: Map<string, number> = new Map();

    // Workspace status polling - groups subscriptions by workspace for efficiency
    // Maps workspace -> { intervalMs, paths, intervalId }
    private workspacePollers: Map<string, {
        intervalMs: number;
        paths: Set<string>; // Set of path strings being watched
        intervalId: ReturnType<typeof setInterval> | null;
    }> = new Map();

    // Batching
    private batchDepth: number = 0;
    private changedKeys: Set<string> = new Set();

    // Pending fetches for deduplication
    private pendingFetches: Map<string, Promise<Uint8Array>> = new Map();

    // Scheduler for deferred notifications
    private scheduler: ((notify: () => void) => void) | undefined;
    private flushScheduled = false;

    constructor(queryClient: QueryClient, config: ReactiveDatasetCacheConfig) {
        this.queryClient = queryClient;
        this.config = {
            apiUrl: config.apiUrl,
            repo: config.repo ?? "default",
            token: config.token,
            staleTime: config.staleTime ?? 30000,
        };
    }

    /**
     * Get the configuration.
     */
    getConfig(): ReactiveDatasetCacheConfig {
        const result: ReactiveDatasetCacheConfig = {
            apiUrl: this.config.apiUrl,
            repo: this.config.repo,
            staleTime: this.config.staleTime,
        };
        if (this.config.token !== undefined) {
            result.token = this.config.token;
        }
        return result;
    }

    /**
     * Create a TanStack Query key.
     */
    private queryKey(workspace: string, path: DatasetPath): readonly unknown[] {
        return ["dataset", workspace, datasetPathToString(path)] as const;
    }

    /**
     * Get request options for e3-api-client.
     */
    private getRequestOptions(): { token: string | null } {
        return { token: this.config.token ?? null };
    }

    /**
     * Read a dataset value synchronously from cache.
     */
    read(workspace: string, path: DatasetPath): Uint8Array | undefined {
        const key = datasetCacheKey(workspace, path);
        return this.cache.get(key);
    }

    /**
     * Check if a dataset is cached.
     */
    has(workspace: string, path: DatasetPath): boolean {
        const key = datasetCacheKey(workspace, path);
        return this.cache.has(key);
    }

    /**
     * Write a dataset value (async - mutates remotely).
     */
    async write(workspace: string, path: DatasetPath, value: Uint8Array): Promise<void> {
        const key = datasetCacheKey(workspace, path);

        // Optimistic update
        const previous = this.cache.get(key);
        const previousHash = this.knownHashes.get(key);
        this.cache.set(key, value);
        // Mark hash as unknown until we get confirmation
        this.knownHashes.delete(key);
        this.notifyChange(key);

        try {
            // Send to e3 using e3-api-client
            await datasetSet(
                this.config.apiUrl,
                this.config.repo,
                workspace,
                toTreePath(path),
                value,
                this.getRequestOptions()
            );

            // Invalidate query cache
            await this.queryClient.invalidateQueries({
                queryKey: this.queryKey(workspace, path),
            });

            // Trigger a poll to get the new hash
            const poller = this.workspacePollers.get(workspace);
            if (poller) {
                this.pollWorkspaceStatus(workspace);
            }
        } catch (error) {
            // Rollback on failure
            if (previous !== undefined) {
                this.cache.set(key, previous);
                if (previousHash !== undefined) {
                    this.knownHashes.set(key, previousHash);
                }
            } else {
                this.cache.delete(key);
                this.knownHashes.delete(key);
            }
            this.notifyChange(key);
            throw error;
        }
    }

    /**
     * Preload a dataset into cache.
     */
    async preload(workspace: string, path: DatasetPath): Promise<void> {
        const key = datasetCacheKey(workspace, path);

        // Check if already cached
        if (this.cache.has(key)) return;

        // Check if already loading
        const pending = this.pendingFetches.get(key);
        if (pending) {
            await pending;
            return;
        }

        // Start fetch
        const fetchPromise = this.fetchDataset(workspace, path);
        this.pendingFetches.set(key, fetchPromise);

        try {
            const data = await fetchPromise;
            // Only update if not already set (another fetch might have completed)
            if (!this.cache.has(key)) {
                this.cache.set(key, data);
                this.notifyChange(key);
            }
        } finally {
            this.pendingFetches.delete(key);
        }
    }

    /**
     * Fetch a dataset from e3 using e3-api-client.
     */
    private async fetchDataset(workspace: string, path: DatasetPath): Promise<Uint8Array> {
        return datasetGet(
            this.config.apiUrl,
            this.config.repo,
            workspace,
            toTreePath(path),
            this.getRequestOptions()
        );
    }

    /**
     * List fields at a path using e3-api-client.
     */
    async list(workspace: string, path: DatasetPath): Promise<string[]> {
        if (path.length === 0) {
            // Root listing
            return e3DatasetList(
                this.config.apiUrl,
                this.config.repo,
                workspace,
                this.getRequestOptions()
            );
        } else {
            // List at path
            return datasetListAt(
                this.config.apiUrl,
                this.config.repo,
                workspace,
                toTreePath(path),
                this.getRequestOptions()
            );
        }
    }

    /**
     * Set refetch interval for a dataset (polling).
     *
     * @remarks
     * Uses hash-based change detection for efficiency:
     * 1. Polls workspaceStatus to get dataset hashes (lightweight)
     * 2. Compares hashes to detect changes
     * 3. Only fetches full content when hash changes
     *
     * Multiple subscriptions to the same workspace share a single poller.
     */
    setRefetchInterval(workspace: string, path: DatasetPath, intervalMs: number): void {
        const pathStr = datasetPathToString(path);

        // Get or create workspace poller
        let poller = this.workspacePollers.get(workspace);

        if (poller) {
            // Add this path to the existing poller
            poller.paths.add(pathStr);

            // If the new interval is shorter, restart with shorter interval
            if (intervalMs < poller.intervalMs) {
                if (poller.intervalId) {
                    clearInterval(poller.intervalId);
                }
                poller.intervalMs = intervalMs;
                poller.intervalId = setInterval(
                    () => this.pollWorkspaceStatus(workspace),
                    intervalMs
                );
            }
        } else {
            // Create new poller for this workspace
            poller = {
                intervalMs,
                paths: new Set([pathStr]),
                intervalId: setInterval(
                    () => this.pollWorkspaceStatus(workspace),
                    intervalMs
                ),
            };
            this.workspacePollers.set(workspace, poller);

            // Do an immediate poll
            this.pollWorkspaceStatus(workspace);
        }
    }

    /**
     * Poll workspace status and check for hash changes.
     */
    private async pollWorkspaceStatus(workspace: string): Promise<void> {
        const poller = this.workspacePollers.get(workspace);
        if (!poller || poller.paths.size === 0) return;

        try {
            const status = await workspaceStatus(
                this.config.apiUrl,
                this.config.repo,
                workspace,
                this.getRequestOptions()
            );

            // Check each watched path for hash changes
            for (const pathStr of poller.paths) {
                const e3Path = pathStr ? `.${pathStr}` : ""; // e3 uses leading dot
                const datasetInfo = status.datasets.find(
                    (d: DatasetStatusInfo) => d.path === e3Path
                );

                const key = pathStr ? `${workspace}.${pathStr}` : workspace;
                // Extract hash from East Option type
                const currentHash = datasetInfo?.hash?.type === "some"
                    ? datasetInfo.hash.value
                    : null;
                const knownHash = this.knownHashes.get(key);

                // Check if hash changed (or if we don't have data yet)
                if (currentHash !== knownHash || !this.cache.has(key)) {
                    // Hash changed - fetch the new data
                    if (currentHash !== null) {
                        // Dataset has a value - fetch it
                        const path = this.stringToPath(pathStr);
                        try {
                            const data = await this.fetchDataset(workspace, path);
                            this.cache.set(key, data);
                            this.knownHashes.set(key, currentHash);
                            this.notifyChange(key);
                        } catch (error) {
                            console.error(`Failed to fetch dataset ${key}:`, error);
                        }
                    } else {
                        // Dataset is unset - clear from cache
                        if (this.cache.has(key)) {
                            this.cache.delete(key);
                            this.knownHashes.set(key, null);
                            this.notifyChange(key);
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`Failed to poll workspace status for ${workspace}:`, error);
        }
    }

    /**
     * Convert a path string back to DatasetPath.
     */
    private stringToPath(pathStr: string): DatasetPath {
        if (!pathStr) return [];
        return pathStr.split(".").map(field => variant("field", field));
    }

    // =========================================================================
    // Subscription API (mirrors UIStore for compatibility)
    // =========================================================================

    /**
     * Subscribe to changes on a specific key or all changes.
     */
    subscribe(callback: () => void): () => void;
    subscribe(key: string, callback: () => void): () => void;
    subscribe(keyOrCallback: string | (() => void), maybeCallback?: () => void): () => void {
        if (typeof keyOrCallback === "function") {
            // Global subscription
            this.globalSubscribers.add(keyOrCallback);
            return () => this.globalSubscribers.delete(keyOrCallback);
        } else {
            // Key-specific subscription
            const key = keyOrCallback;
            const callback = maybeCallback!;
            let subs = this.keySubscribers.get(key);
            if (!subs) {
                subs = new Set();
                this.keySubscribers.set(key, subs);
            }
            subs.add(callback);
            return () => {
                subs!.delete(callback);
                if (subs!.size === 0) {
                    this.keySubscribers.delete(key);
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

        if (this.scheduler) {
            // Defer notifications to avoid "setState during render" errors
            if (!this.flushScheduled) {
                this.flushScheduled = true;
                this.scheduler(() => this.doFlush());
            }
        } else {
            // Synchronous flush (no scheduler provided)
            this.doFlush();
        }
    }

    private doFlush(): void {
        this.flushScheduled = false;
        if (this.changedKeys.size === 0) return;

        // Increment version so useSyncExternalStore triggers re-render
        this.version++;

        // Notify key-specific subscribers
        for (const key of this.changedKeys) {
            const subs = this.keySubscribers.get(key);
            if (subs) {
                for (const cb of subs) cb();
            }
        }

        // Notify global subscribers
        for (const cb of this.globalSubscribers) cb();

        this.changedKeys.clear();
    }

    /**
     * Cleanup resources.
     */
    destroy(): void {
        // Clear workspace pollers
        for (const poller of this.workspacePollers.values()) {
            if (poller.intervalId) {
                clearInterval(poller.intervalId);
            }
        }
        this.workspacePollers.clear();

        this.keySubscribers.clear();
        this.globalSubscribers.clear();
        this.cache.clear();
        this.knownHashes.clear();
        this.pendingFetches.clear();
    }
}

/**
 * Create a new ReactiveDatasetCache.
 */
export function createReactiveDatasetCache(queryClient: QueryClient, config: ReactiveDatasetCacheConfig): ReactiveDatasetCache {
    return new ReactiveDatasetCache(queryClient, config);
}

/**
 * @deprecated Use `ReactiveDatasetCache` instead.
 */
export const DatasetStore = ReactiveDatasetCache;

/**
 * @deprecated Use `createReactiveDatasetCache` instead.
 */
export const createDatasetStore = createReactiveDatasetCache;
