/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import { East, IntegerType, StringType, NullType, encodeBeast2For, variant } from "@elaraai/east";
import { TestImpl, Assert } from "@elaraai/east-node-std";
import { Dataset, DatasetPathType, DatasetPathSegmentType } from "@elaraai/east-ui";
import {
    DatasetImpl,
    initializeDatasetStore,
    clearDatasetStore,
    type DatasetStoreInterface,
    type DatasetPath,
    type DatasetStoreConfig,
    datasetCacheKey,
} from "../../src/platform/index.js";

/**
 * Mock DatasetStore for testing.
 * Stores data in memory without network calls.
 */
class MockDatasetStore implements DatasetStoreInterface {
    private cache: Map<string, Uint8Array> = new Map();
    private keyVersions: Map<string, number> = new Map();
    private version: number = 0;
    private subscribers: Set<() => void> = new Set();
    private keySubscribers: Map<string, Set<() => void>> = new Map();
    private config: DatasetStoreConfig;

    constructor(config: DatasetStoreConfig = { apiUrl: "http://mock" }) {
        this.config = config;
    }

    read(workspace: string, path: DatasetPath): Uint8Array | undefined {
        const key = datasetCacheKey(workspace, path);
        return this.cache.get(key);
    }

    has(workspace: string, path: DatasetPath): boolean {
        const key = datasetCacheKey(workspace, path);
        return this.cache.has(key);
    }

    async write(workspace: string, path: DatasetPath, value: Uint8Array): Promise<void> {
        const key = datasetCacheKey(workspace, path);
        this.cache.set(key, value);
        this.notifyChange(key);
    }

    async preload(_workspace: string, _path: DatasetPath): Promise<void> {
        // No-op in mock - data must be set directly
    }

    async list(_workspace: string, _path: DatasetPath): Promise<string[]> {
        // Return empty array in mock
        return [];
    }

    setRefetchInterval(_workspace: string, _path: DatasetPath, _intervalMs: number): void {
        // No-op in mock
    }

    subscribe(callback: () => void): () => void;
    subscribe(key: string, callback: () => void): () => void;
    subscribe(keyOrCallback: string | (() => void), maybeCallback?: () => void): () => void {
        if (typeof keyOrCallback === "function") {
            this.subscribers.add(keyOrCallback);
            return () => this.subscribers.delete(keyOrCallback);
        } else {
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

    getSnapshot(): number {
        return this.version;
    }

    getKeyVersion(key: string): number {
        return this.keyVersions.get(key) ?? 0;
    }

    setScheduler(_scheduler: ((notify: () => void) => void) | undefined): void {
        // No-op in mock
    }

    batch<T>(fn: () => T): T {
        return fn();
    }

    getConfig(): DatasetStoreConfig {
        return { ...this.config };
    }

    destroy(): void {
        this.cache.clear();
        this.subscribers.clear();
        this.keySubscribers.clear();
    }

    // Test helper: directly set data in cache
    setData(workspace: string, path: DatasetPath, data: Uint8Array): void {
        const key = datasetCacheKey(workspace, path);
        this.cache.set(key, data);
    }

    // Test helper: clear all data
    clear(): void {
        this.cache.clear();
    }

    private notifyChange(key: string): void {
        const currentVersion = this.keyVersions.get(key) ?? 0;
        this.keyVersions.set(key, currentVersion + 1);
        this.version++;

        const subs = this.keySubscribers.get(key);
        if (subs) {
            for (const cb of subs) cb();
        }
        for (const cb of this.subscribers) cb();
    }
}

/**
 * Create a test platform that includes Dataset platform functions.
 */
function createDatasetTestPlatform() {
    return [
        ...TestImpl,
        ...DatasetImpl,
    ];
}

/**
 * Helper to create a dataset path from field names.
 */
function makePath(...fields: string[]): DatasetPath {
    return fields.map(f => ({ type: "field" as const, value: f }));
}

/**
 * Helper to create a dataset path value for East functions.
 */
function makePathValue(...fields: string[]) {
    return fields.map(f => variant("field", f));
}

describe("Dataset Platform Functions", () => {
    let mockStore: MockDatasetStore;
    const platform = createDatasetTestPlatform();

    beforeEach(() => {
        mockStore = new MockDatasetStore();
        initializeDatasetStore(mockStore);
    });

    afterEach(() => {
        clearDatasetStore();
    });

    // =========================================================================
    // Dataset.get (read)
    // =========================================================================

    describe("Dataset.get", () => {
        test("reads integer value from cache", () => {
            // Preload data into mock store
            const path = makePath("inputs", "count");
            const encode = encodeBeast2For(IntegerType);
            mockStore.setData("production", path, encode(42n));

            // Create function that takes workspace and path as parameters
            const testFn = East.function(
                [StringType, DatasetPathType],
                NullType,
                ($, workspace, pathParam) => {
                    const value = $.let(Dataset.get([IntegerType], workspace, pathParam));
                    $(Assert.equal(value, 42n));
                }
            );

            const compiled = testFn.toIR().compile(platform);
            compiled("production", makePathValue("inputs", "count"));
        });

        test("reads string value from cache", () => {
            const path = makePath("config", "name");
            const encode = encodeBeast2For(StringType);
            mockStore.setData("production", path, encode("test-value"));

            const testFn = East.function(
                [StringType, DatasetPathType],
                NullType,
                ($, workspace, pathParam) => {
                    const value = $.let(Dataset.get([StringType], workspace, pathParam));
                    $(Assert.equal(value, "test-value"));
                }
            );

            const compiled = testFn.toIR().compile(platform);
            compiled("production", makePathValue("config", "name"));
        });

        test("throws for missing dataset", () => {
            const testFn = East.function(
                [StringType, DatasetPathType],
                NullType,
                ($, workspace, pathParam) => {
                    $.let(Dataset.get([IntegerType], workspace, pathParam));
                }
            );
            const compiled = testFn.toIR().compile(platform);
            assert.throws(
                () => compiled("production", makePathValue("nonexistent")),
                /Dataset not loaded/
            );
        });
    });

    // =========================================================================
    // Dataset.has
    // =========================================================================

    describe("Dataset.has", () => {
        test("returns false for missing dataset", () => {
            const testFn = East.function(
                [StringType, DatasetPathType],
                NullType,
                ($, workspace, pathParam) => {
                    const exists = $.let(Dataset.has(workspace, pathParam));
                    $(Assert.equal(exists, false));
                }
            );

            const compiled = testFn.toIR().compile(platform);
            compiled("production", makePathValue("nonexistent"));
        });

        test("returns true for existing dataset", () => {
            const path = makePath("inputs", "count");
            const encode = encodeBeast2For(IntegerType);
            mockStore.setData("production", path, encode(42n));

            const testFn = East.function(
                [StringType, DatasetPathType],
                NullType,
                ($, workspace, pathParam) => {
                    const exists = $.let(Dataset.has(workspace, pathParam));
                    $(Assert.equal(exists, true));
                }
            );

            const compiled = testFn.toIR().compile(platform);
            compiled("production", makePathValue("inputs", "count"));
        });
    });

    // =========================================================================
    // Dataset.set (write)
    // =========================================================================

    describe("Dataset.set", () => {
        test("writes integer value to store", async () => {
            const testFn = East.function(
                [StringType, DatasetPathType, IntegerType],
                NullType,
                ($, workspace, pathParam, value) => {
                    $(Dataset.set([IntegerType], workspace, pathParam, value));
                }
            );

            const compiled = testFn.toIR().compile(platform);
            compiled("production", makePathValue("outputs", "result"), 100n);

            // Wait for async write to complete
            await new Promise(resolve => setTimeout(resolve, 10));

            // Verify data was written
            const path = makePath("outputs", "result");
            assert.strictEqual(mockStore.has("production", path), true);
        });

        test("writes string value to store", async () => {
            const testFn = East.function(
                [StringType, DatasetPathType, StringType],
                NullType,
                ($, workspace, pathParam, value) => {
                    $(Dataset.set([StringType], workspace, pathParam, value));
                }
            );

            const compiled = testFn.toIR().compile(platform);
            compiled("production", makePathValue("config", "status"), "completed");

            // Wait for async write to complete
            await new Promise(resolve => setTimeout(resolve, 10));

            // Verify data was written
            const path = makePath("config", "status");
            assert.strictEqual(mockStore.has("production", path), true);
        });
    });

    // =========================================================================
    // Dataset.subscribe
    // =========================================================================

    describe("Dataset.subscribe", () => {
        test("does not throw when called", () => {
            const testFn = East.function(
                [StringType, DatasetPathType, IntegerType],
                NullType,
                ($, workspace, pathParam, intervalMs) => {
                    $(Dataset.subscribe(workspace, pathParam, intervalMs));
                }
            );

            const compiled = testFn.toIR().compile(platform);
            // Should not throw
            compiled("production", makePathValue("inputs"), 1000n);
        });
    });

    // =========================================================================
    // Integration: Read after Write
    // =========================================================================

    describe("Integration", () => {
        test("can read value after writing it", async () => {
            // Write a value
            const writeFn = East.function(
                [StringType, DatasetPathType, IntegerType],
                NullType,
                ($, workspace, pathParam, value) => {
                    $(Dataset.set([IntegerType], workspace, pathParam, value));
                }
            );

            const writeCompiled = writeFn.toIR().compile(platform);
            writeCompiled("workspace", makePathValue("test", "value"), 999n);

            // Wait for async write to complete
            await new Promise(resolve => setTimeout(resolve, 10));

            // Read it back
            const readFn = East.function(
                [StringType, DatasetPathType],
                NullType,
                ($, workspace, pathParam) => {
                    const value = $.let(Dataset.get([IntegerType], workspace, pathParam));
                    $(Assert.equal(value, 999n));
                }
            );

            const readCompiled = readFn.toIR().compile(platform);
            readCompiled("workspace", makePathValue("test", "value"));
        });
    });
});
