/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

// Re-export UIStore and related types from east-ui
export {
    UIStore,
    createUIStore,
    type UIStoreInterface,
    type UIStoreOptions,
} from "@elaraai/east-ui";

// Import for use in PersistentUIStore
import { UIStore, type UIStoreInterface, type UIStoreOptions } from "@elaraai/east-ui";

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
