/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

/**
 * DatasetStore for managing e3 dataset caching and reactivity.
 *
 * @remarks
 * Combines TanStack Query for network operations with a local
 * subscription system for reactive updates in East UI components.
 *
 * Uses e3-api-client for all e3 API interactions.
 *
 * @packageDocumentation
 */

import { QueryClient, QueryObserver } from "@tanstack/react-query";
import { BlobType, equalFor, type ValueTypeOf } from "@elaraai/east";
import {
    datasetGet,
    datasetSet,
    datasetList as e3DatasetList,
    datasetListAt,
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
}

/**
 * Interface for the DatasetStore.
 */
export interface DatasetStoreInterface {
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
    getConfig(): DatasetStoreConfig;
    /** Clean up resources */
    destroy(): void;
}

const blobEqual = equalFor(BlobType);

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
 * DatasetStore manages dataset caching and reactivity.
 *
 * @remarks
 * Combines TanStack Query for network operations with a local
 * subscription system for reactive updates. Uses e3-api-client
 * for all e3 API interactions.
 */
export class DatasetStore implements DatasetStoreInterface {
    private queryClient: QueryClient;
    private config: {
        apiUrl: string;
        repo: string;
        token: string | undefined;
        staleTime: number;
    };

    // Local cache for synchronous access
    private cache: Map<string, Uint8Array> = new Map();

    // Subscription management
    private keySubscribers: Map<string, Set<() => void>> = new Map();
    private globalSubscribers: Set<() => void> = new Set();

    // Version tracking for useSyncExternalStore
    private version: number = 0;
    private keyVersions: Map<string, number> = new Map();

    // Active query observers for polling
    private observers: Map<string, QueryObserver<Uint8Array, Error>> = new Map();

    // Batching
    private batchDepth: number = 0;
    private changedKeys: Set<string> = new Set();

    // Pending fetches for deduplication
    private pendingFetches: Map<string, Promise<Uint8Array>> = new Map();

    // Scheduler for deferred notifications
    private scheduler: ((notify: () => void) => void) | undefined;
    private flushScheduled = false;

    constructor(queryClient: QueryClient, config: DatasetStoreConfig) {
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
    getConfig(): DatasetStoreConfig {
        const result: DatasetStoreConfig = {
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
        this.cache.set(key, value);
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
     */
    setRefetchInterval(workspace: string, path: DatasetPath, intervalMs: number): void {
        const key = datasetCacheKey(workspace, path);

        // Remove existing observer
        const existing = this.observers.get(key);
        if (existing) {
            existing.destroy();
        }

        // Create new observer with polling
        const observer = new QueryObserver<Uint8Array, Error>(this.queryClient, {
            queryKey: this.queryKey(workspace, path),
            queryFn: () => this.fetchDataset(workspace, path),
            refetchInterval: intervalMs,
            staleTime: 0, // Always consider stale for polling
        });

        // Subscribe to updates
        observer.subscribe((result) => {
            if (result.data) {
                const current = this.cache.get(key);
                if (!current || !blobEqual(current, result.data)) {
                    this.cache.set(key, result.data);
                    this.notifyChange(key);
                }
            }
        });

        this.observers.set(key, observer);
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
        for (const observer of this.observers.values()) {
            observer.destroy();
        }
        this.observers.clear();
        this.keySubscribers.clear();
        this.globalSubscribers.clear();
        this.cache.clear();
        this.pendingFetches.clear();
    }
}

/**
 * Create a new DatasetStore.
 */
export function createDatasetStore(queryClient: QueryClient, config: DatasetStoreConfig): DatasetStore {
    return new DatasetStore(queryClient, config);
}
