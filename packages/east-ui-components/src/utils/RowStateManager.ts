/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

export type RowStatus = 'unloaded' | 'loading' | 'loaded' | 'error';
export type RowKey = string | number | bigint;

export interface RowState {
    status: RowStatus;
    loadStartTime?: number;
    error?: Error;
}

/**
 * Manages row loading states for virtualized tables.
 * Tracks which rows are visible, loading, or loaded to enable
 * smooth skeleton/loading indicators during fast scrolling.
 */
export class RowStateManager {
    private rowStates: Map<RowKey, RowState>;
    private loadedRows: Set<RowKey>;
    private loadingTimeouts: Map<RowKey, ReturnType<typeof setTimeout>>;
    private maxCacheSize: number;
    private listeners: Set<() => void> = new Set();

    constructor(maxCacheSize = 1000) {
        this.rowStates = new Map();
        this.loadedRows = new Set();
        this.loadingTimeouts = new Map();
        this.maxCacheSize = maxCacheSize;
    }

    /** Subscribe to state changes */
    subscribe(listener: () => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener());
    }

    getRowState(key: RowKey): RowState {
        return this.rowStates.get(key) || { status: 'unloaded' };
    }

    /** Check if a row has been loaded before (synchronous check) */
    isRowLoaded(key: RowKey): boolean {
        return this.loadedRows.has(key);
    }

    markRowsLoading(keys: RowKey[]): void {
        const now = Date.now();
        keys.forEach(key => {
            this.clearTimeout(key);
            this.rowStates.set(key, {
                status: 'loading',
                loadStartTime: now
            });
        });
        this.cleanup();
        this.notifyListeners();
    }

    private clearTimeout(key: RowKey): void {
        const timeout = this.loadingTimeouts.get(key);
        if (timeout) {
            clearTimeout(timeout);
            this.loadingTimeouts.delete(key);
        }
    }

    markRowsLoaded(keys: RowKey[]): void {
        keys.forEach(key => {
            this.clearTimeout(key);
            this.rowStates.set(key, { status: 'loaded' });
            this.loadedRows.add(key);
        });
        this.notifyListeners();
    }

    markRowsError(keys: RowKey[], error: Error): void {
        keys.forEach(key => {
            this.clearTimeout(key);
            this.rowStates.set(key, { status: 'error', error });
        });
        this.notifyListeners();
    }

    markRowsUnloaded(keys: RowKey[]): void {
        keys.forEach(key => {
            this.clearTimeout(key);
            this.rowStates.delete(key);
            this.loadedRows.delete(key);
        });
        this.notifyListeners();
    }

    /** Schedule a row to transition to loaded state after delay */
    scheduleLoaded(key: RowKey, delay = 300): void {
        this.clearTimeout(key);
        const timeout = setTimeout(() => {
            this.markRowsLoaded([key]);
        }, delay);
        this.loadingTimeouts.set(key, timeout);
    }

    /** Clean up old entries to prevent memory leaks */
    cleanup(): void {
        if (this.rowStates.size > this.maxCacheSize) {
            const entriesToRemove = this.rowStates.size - this.maxCacheSize;
            const iterator = this.rowStates.keys();
            for (let i = 0; i < entriesToRemove; i++) {
                const key = iterator.next().value;
                if (key !== undefined) {
                    this.rowStates.delete(key);
                    this.loadedRows.delete(key);
                }
            }
        }
    }

    clear(): void {
        this.loadingTimeouts.forEach(timeout => clearTimeout(timeout));
        this.loadingTimeouts.clear();
        this.rowStates.clear();
        this.loadedRows.clear();
        this.notifyListeners();
    }

    getStates(): Map<RowKey, RowState> {
        return new Map(this.rowStates);
    }
}
