/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

/**
 * Store implementations for East UI state management.
 *
 * @remarks
 * Provides both in-memory (UIStore) and persistent (PersistentUIStore) implementations
 * of the UIStoreInterface for reactive state management.
 *
 * @packageDocumentation
 */

import { BlobType, equalFor } from "@elaraai/east";
import type { PlatformFunction, EastIR } from "@elaraai/east/internal";

// =============================================================================
// Store Interface
// =============================================================================

/**
 * Store interface for UI state management.
 *
 * @remarks
 * State is stored as Beast2-encoded Uint8Array values, allowing any East type to be stored.
 * Provides reactive subscriptions, batching, and garbage collection.
 */
export interface UIStoreInterface {
    /** Read a Beast2-encoded value from the store */
    read(key: string): Uint8Array | undefined;
    /** Write a Beast2-encoded value to the store */
    write(key: string, value: Uint8Array | undefined): void;
    /** Check if a key exists in the store */
    has(key: string): boolean;
    /** Subscribe to all state changes, returns unsubscribe function */
    subscribe(callback: () => void): () => void;
    /** Subscribe to a specific key, returns unsubscribe function */
    subscribe(key: string, callback: () => void): () => void;
    /** Batch multiple writes together for single notification */
    batch<T>(fn: () => T): T;
    /** Mark a key as active during render (for garbage collection) */
    markActive(key: string): void;
    /** Called at start of render cycle */
    beginRender(): void;
    /** Called at end of render cycle - removes orphaned keys */
    endRender(): void;
    /** Get snapshot version for React's useSyncExternalStore */
    getSnapshot(): number;
    /** Get current state for debugging */
    getState(): Map<string, Uint8Array>;
    /** Set the notification scheduler (for deferred notifications in React) */
    setScheduler(scheduler: ((notify: () => void) => void) | undefined): void;
    /** Get version number for a specific key (for reactive component subscriptions) */
    getKeyVersion(key: string): number;
    /** Get all active keys (for debugging) */
    getActiveKeys?(): Set<string>;
}

/**
 * Options for creating a UIStore.
 */
export interface UIStoreOptions {
    /** Initial state as a Map of string keys to Beast2-encoded blobs */
    initialState?: Map<string, Uint8Array> | undefined;
    /**
     * Optional scheduler for deferred notifications.
     * If provided, flush notifications will be deferred using this function.
     * If not provided, notifications happen synchronously.
     *
     * For React, use queueMicrotask to avoid "setState during render" errors:
     * @example
     * ```ts
     * const store = new UIStore({
     *     scheduleNotify: (fn) => queueMicrotask(fn)
     * });
     * ```
     */
    scheduleNotify?: (notify: () => void) => void;
}

// =============================================================================
// In-Memory Store
// =============================================================================

/**
 * A registered function with its compiled form and last result.
 */
interface Registration {
    compiled: (state: Map<string, Uint8Array>) => unknown;
    lastResult: unknown;
}

const blobEqual = equalFor(BlobType)

/**
 * Reactive state store for East UI applications.
 *
 * @remarks
 * Combines state management, function registration, and React integration:
 * - State stored as Beast2-encoded blobs
 * - Batched writes for performance
 * - Key-specific and global subscriptions
 * - Garbage collection for orphaned keys
 * - Function registration with automatic re-execution
 *
 * @example
 * ```ts
 * import { UIStore } from "@elaraai/east-ui-components";
 * import { State } from "@elaraai/east-ui";
 * import { StateImpl } from "@elaraai/east-ui-components";
 *
 * // Use StateImpl for compilation
 * const compiled = counterFn.toIR().compile(StateImpl);
 *
 * // Or create a custom store for isolation
 * const store = new UIStore();
 * ```
 */
export class UIStore implements UIStoreInterface {
    private state: Map<string, Uint8Array>;
    private registrations: Map<string, Registration> = new Map();
    private keySubscribers: Map<string, Set<() => void>> = new Map();
    private globalSubscribers: Set<() => void> = new Set();
    private activeKeys: Set<string> = new Set();
    private previousActiveKeys: Set<string> = new Set();
    private version: number = 0;
    private batchDepth: number = 0;
    private changedKeys: Set<string> = new Set();
    private scheduleNotify?: ((notify: () => void) => void) | undefined;
    private keyVersions: Map<string, number> = new Map();

    constructor(options?: UIStoreOptions) {
        this.state = options?.initialState ?? new Map();
        this.scheduleNotify = options?.scheduleNotify;
    }

    read(key: string): Uint8Array | undefined {
        this.markActive(key);
        return this.state.get(key);
    }

    write(key: string, value: Uint8Array | undefined): void {
        // Check if value actually changed to avoid infinite loops
        const existing = this.state.get(key);
        const isEqual = value === undefined
            ? existing === undefined
            : existing !== undefined && blobEqual(existing, value);


        if (isEqual) return; // No change, skip update

        if (value === undefined) {
            this.state.delete(key);
        } else {
            this.state.set(key, value);
        }
        this.changedKeys.add(key);

        // Increment key version for reactive subscriptions
        const currentVersion = this.keyVersions.get(key) ?? 0;
        this.keyVersions.set(key, currentVersion + 1);

        if (this.batchDepth === 0) {
            this.flush();
        }
    }

    has(key: string): boolean {
        return this.state.has(key);
    }

    subscribe(callback: () => void): () => void;
    subscribe(key: string, callback: () => void): () => void;
    subscribe(keyOrCallback: string | (() => void), callback?: () => void): () => void {
        if (typeof keyOrCallback === "function") {
            // Global subscription
            this.globalSubscribers.add(keyOrCallback);
            return () => this.globalSubscribers.delete(keyOrCallback);
        } else {
            // Key-specific subscription
            const key = keyOrCallback;
            const cb = callback!;
            let subs = this.keySubscribers.get(key);
            if (!subs) {
                subs = new Set();
                this.keySubscribers.set(key, subs);
            }
            subs.add(cb);
            return () => {
                subs!.delete(cb);
                if (subs!.size === 0) {
                    this.keySubscribers.delete(key);
                }
            };
        }
    }

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

    markActive(key: string): void {
        this.activeKeys.add(key);
    }

    beginRender(): void {
        this.previousActiveKeys = this.activeKeys;
        this.activeKeys = new Set();
    }

    endRender(): void {
        for (const key of this.previousActiveKeys) {
            if (!this.activeKeys.has(key)) {
                this.state.delete(key);
            }
        }
    }

    getSnapshot(): number {
        return this.version;
    }

    getState(): Map<string, Uint8Array> {
        return new Map(this.state);
    }

    /**
     * Register an East function for reactive execution.
     *
     * @remarks
     * The function will be compiled and executed immediately with current state.
     * When state changes, it will be re-executed automatically.
     *
     * @param id - Unique identifier for this registration
     * @param ir - The East IR to compile and register
     * @param platform - Platform functions to use for compilation
     */
    register(id: string, ir: EastIR<[Map<string, Uint8Array>], unknown>, platform: PlatformFunction[]): void {
        const compiled = ir.compile(platform);
        const result = compiled(this.state);
        this.registrations.set(id, { compiled, lastResult: result });
    }

    /**
     * Get the last result of a registered function.
     *
     * @param id - The registration identifier
     * @returns The last computed result, or undefined if not registered
     */
    getResult(id: string): unknown {
        return this.registrations.get(id)?.lastResult;
    }

    /**
     * Get all active keys (for debugging).
     */
    getActiveKeys(): Set<string> {
        return new Set(this.activeKeys);
    }

    /**
     * Set the notification scheduler.
     * Call this to enable deferred notifications (e.g., for React integration).
     *
     * @param scheduler - Function to schedule deferred notifications, or undefined for synchronous
     */
    setScheduler(scheduler: ((notify: () => void) => void) | undefined): void {
        this.scheduleNotify = scheduler;
    }

    /**
     * Get version number for a specific key.
     *
     * @remarks
     * Used by reactive components to create a snapshot that only changes
     * when their specific dependencies change, enabling selective re-rendering.
     *
     * @param key - The state key to get the version for
     * @returns The version number (increments on each write), or 0 if never written
     */
    getKeyVersion(key: string): number {
        return this.keyVersions.get(key) ?? 0;
    }

    private flushScheduled = false;

    private flush(): void {
        if (this.changedKeys.size === 0) return;

        if (this.scheduleNotify) {
            // Defer notifications to avoid "setState during render" errors
            if (!this.flushScheduled) {
                this.flushScheduled = true;
                this.scheduleNotify(() => this.doFlush());
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

        // Re-execute all registered functions
        for (const [, reg] of this.registrations) {
            reg.lastResult = reg.compiled(this.state);
        }

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
}

/**
 * Create a new UIStore with optional initial state.
 *
 * @param initialState - Optional initial state as a plain object
 * @returns A new UIStore instance
 *
 * @example
 * ```ts
 * import { createUIStore } from "@elaraai/east-ui-components";
 * import { encodeBeast2For } from "@elaraai/east/internal";
 * import { IntegerType, StringType } from "@elaraai/east";
 *
 * const store = createUIStore({
 *     count: encodeBeast2For(IntegerType)(0n),
 *     name: encodeBeast2For(StringType)("Alice"),
 * });
 * ```
 */
export function createUIStore(initialState?: Record<string, Uint8Array>): UIStore {
    return new UIStore({
        initialState: initialState ? new Map(Object.entries(initialState)) : undefined,
    });
}

// =============================================================================
// Persistent Store
// =============================================================================

/**
 * Persistent store with IndexedDB backing.
 *
 * @remarks
 * Extends UIStore with IndexedDB persistence.
 * Writes are batched and flushed asynchronously to reduce I/O.
 *
 * @example
 * ```ts
 * import { PersistentUIStore } from "@elaraai/east-ui-components";
 *
 * const store = new PersistentUIStore("my_app");
 * await store.hydrate();
 * // Now store is ready to use
 * ```
 */
export class PersistentUIStore implements UIStoreInterface {
    private inner: UIStore;
    private dbName: string;
    private storeName: string = "ui_state";
    private db: IDBDatabase | null = null;
    private pendingWrites: Map<string, Uint8Array | undefined> = new Map();
    private flushScheduled: boolean = false;

    constructor(dbName: string = "east_ui", options?: UIStoreOptions) {
        this.dbName = dbName;
        this.inner = new UIStore(options);
    }

    /**
     * Initialize and hydrate from IndexedDB.
     *
     * @remarks
     * Must be called before using the store to load persisted state.
     */
    async hydrate(): Promise<void> {
        this.db = await this.openDatabase();
        const entries = await this.loadAll();
        for (const [key, value] of entries) {
            this.inner.write(key, value);
        }
    }

    read(key: string): Uint8Array | undefined {
        return this.inner.read(key);
    }

    write(key: string, value: Uint8Array | undefined): void {
        this.inner.write(key, value);
        this.pendingWrites.set(key, value);
        this.scheduleFlush();
    }

    has(key: string): boolean {
        return this.inner.has(key);
    }

    subscribe(callback: () => void): () => void;
    subscribe(key: string, callback: () => void): () => void;
    subscribe(keyOrCallback: string | (() => void), callback?: () => void): () => void {
        if (typeof keyOrCallback === "function") {
            return this.inner.subscribe(keyOrCallback);
        }
        return this.inner.subscribe(keyOrCallback, callback!);
    }

    batch<T>(fn: () => T): T {
        return this.inner.batch(fn);
    }

    markActive(key: string): void {
        this.inner.markActive(key);
    }

    beginRender(): void {
        this.inner.beginRender();
    }

    endRender(): void {
        this.inner.endRender();
        // Also delete orphaned keys from IndexedDB
        for (const key of this.inner.getActiveKeys()) {
            if (!this.inner.has(key)) {
                this.deleteFromDb(key);
            }
        }
    }

    getSnapshot(): number {
        return this.inner.getSnapshot();
    }

    getState(): Map<string, Uint8Array> {
        return this.inner.getState();
    }

    setScheduler(scheduler: ((notify: () => void) => void) | undefined): void {
        this.inner.setScheduler(scheduler);
    }

    getKeyVersion(key: string): number {
        return this.inner.getKeyVersion(key);
    }

    getActiveKeys(): Set<string> {
        return this.inner.getActiveKeys();
    }

    private scheduleFlush(): void {
        if (this.flushScheduled) return;
        this.flushScheduled = true;
        setTimeout(() => this.flushToDb(), 100);
    }

    private async flushToDb(): Promise<void> {
        this.flushScheduled = false;
        if (!this.db || this.pendingWrites.size === 0) return;

        const writes = new Map(this.pendingWrites);
        this.pendingWrites.clear();

        const tx = this.db.transaction(this.storeName, "readwrite");
        const store = tx.objectStore(this.storeName);

        for (const [key, value] of writes) {
            if (value === undefined) {
                store.delete(key);
            } else {
                store.put(value, key);
            }
        }

        await new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    private async deleteFromDb(key: string): Promise<void> {
        if (!this.db) return;

        const tx = this.db.transaction(this.storeName, "readwrite");
        const store = tx.objectStore(this.storeName);
        store.delete(key);

        await new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    private openDatabase(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
        });
    }

    private async loadAll(): Promise<[string, Uint8Array][]> {
        if (!this.db) return [];

        const tx = this.db.transaction(this.storeName, "readonly");
        const store = tx.objectStore(this.storeName);

        return new Promise((resolve, reject) => {
            const entries: [string, Uint8Array][] = [];
            const request = store.openCursor();

            request.onerror = () => reject(request.error);
            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result;
                if (cursor) {
                    entries.push([cursor.key as string, cursor.value]);
                    cursor.continue();
                } else {
                    resolve(entries);
                }
            };
        });
    }
}

/**
 * Create a persistent UIStore with IndexedDB backing.
 *
 * @param dbName - Database name for IndexedDB
 * @param initialState - Optional initial state
 * @returns A new PersistentUIStore instance (must call hydrate() before use)
 */
export function createPersistentUIStore(
    dbName: string = "east_ui",
    initialState?: Record<string, Uint8Array>
): PersistentUIStore {
    return new PersistentUIStore(dbName, {
        initialState: initialState ? new Map(Object.entries(initialState)) : undefined,
    });
}
