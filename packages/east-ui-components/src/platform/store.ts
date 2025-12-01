/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import type { PlatformFunction, EastIR } from "@elaraai/east/internal";
import { state_write, state_read } from "@elaraai/east-ui-platform";

/**
 * Options for creating an EastStore.
 */
export interface EastStoreOptions {
    /** Initial state as a Map of string keys to Beast2-encoded blobs */
    initialState?: Map<string, Uint8Array> | undefined;
}

/**
 * A registered function with its compiled form and last result.
 */
interface Registration {
    compiled: (state: Map<string, Uint8Array>) => any;
    lastResult: any;
}

/**
 * A reactive state store for East UI applications.
 *
 * State is stored as Beast2-encoded blobs, allowing any East type to be stored.
 * When state changes, registered functions are re-executed and subscribers notified.
 */
export class EastStore {
    private state: Map<string, Uint8Array>;
    private registrations: Map<string, Registration> = new Map();
    private keySubscribers: Map<string, Set<() => void>> = new Map();
    private globalSubscribers: Set<() => void> = new Set();
    private batchDepth: number = 0;
    private changedKeys: Set<string> = new Set();

    constructor(options?: EastStoreOptions) {
        this.state = options?.initialState ?? new Map();
    }

    /**
     * Register an East function for reactive execution.
     * The function will be compiled and executed immediately with current state.
     * When state changes, it will be re-executed automatically.
     *
     * @param id - Unique identifier for this registration
     * @param ir - The East IR to compile and register
     */
    register(id: string, ir: EastIR<[Map<string, Uint8Array>], any>): void {
        const shortId = id.slice(0, 16);

        console.time(`[EastStore] compile ${shortId}`);
        const compiled = ir.compile(this.createPlatform());
        console.timeEnd(`[EastStore] compile ${shortId}`);

        console.time(`[EastStore] execute ${shortId}`);
        const result = compiled(this.state);
        console.timeEnd(`[EastStore] execute ${shortId}`);

        this.registrations.set(id, { compiled, lastResult: result });
    }

    /**
     * Get the last result of a registered function.
     *
     * @param id - The registration identifier
     * @returns The last computed result, or undefined if not registered
     */
    getResult(id: string): any {
        return this.registrations.get(id)?.lastResult;
    }

    /**
     * Write a Beast2-encoded value to state.
     * Triggers re-execution of registered functions and notifies subscribers.
     *
     * @param key - The string key to write to
     * @param value - The Beast2-encoded blob value
     */
    write(key: string, value: Uint8Array): void {
        this.state.set(key, value);
        this.changedKeys.add(key);

        if (this.batchDepth === 0) {
            this.flush();
        }
    }

    /**
     * Read a Beast2-encoded value from state.
     * Returns an empty Uint8Array if the key doesn't exist.
     *
     * @param key - The string key to read from
     * @returns The Beast2-encoded blob value
     */
    read(key: string): Uint8Array {
        return this.state.get(key) ?? new Uint8Array();
    }

    /**
     * Get the current state as a Map.
     *
     * @returns The current state
     */
    getState(): Map<string, Uint8Array> {
        return this.state;
    }

    /**
     * Batch multiple writes together.
     * Re-execution and notifications happen only once at the end.
     *
     * @param fn - Function containing multiple write operations
     * @returns The return value of the function
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
     * Subscribe to all state changes.
     *
     * @param callback - Function to call when state changes
     * @returns Unsubscribe function
     */
    subscribe(callback: () => void): () => void;
    /**
     * Subscribe to changes for a specific key.
     *
     * @param key - The key to subscribe to
     * @param callback - Function to call when the key changes
     * @returns Unsubscribe function
     */
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

    /**
     * Create platform function implementations bound to this store.
     *
     * @returns Array of platform functions for use with ir.compile()
     */
    createPlatform(): PlatformFunction[] {
        return [
            state_write.implement((key, value) => {
                this.write(key, value);
            }),
            state_read.implement((key) => {
                return this.read(key);
            }),
        ];
    }

    /**
     * Flush pending changes: re-execute registered functions and notify subscribers.
     */
    private flush(): void {
        if (this.changedKeys.size === 0) return;

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
 * Create a new EastStore with optional initial state.
 *
 * @param initialState - Optional initial state as a plain object
 * @returns A new EastStore instance
 *
 * @example
 * ```ts
 * const store = createEastStore({
 *     count: encodeBeast2(0n),
 *     name: encodeBeast2("Alice"),
 * });
 * ```
 */
export function createEastStore(initialState?: Record<string, Uint8Array>): EastStore {
    return new EastStore({
        initialState: initialState ? new Map(Object.entries(initialState)) : undefined,
    });
}
