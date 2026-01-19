/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { test, describe, beforeEach } from "node:test";
import assert from "node:assert";
import { East, IntegerType, StringType, NullType, BlockBuilder } from "@elaraai/east";
import { createTestPlatform, Assert } from "../platforms.spec.js";
import { State } from "@elaraai/east-ui";
import { getStore } from "../../src/platform/state-runtime.js";

// createTestPlatform() already includes StateImpl
const platform = createTestPlatform();

/**
 * Defines and runs an East test with State platform.
 */
function testState(name: string, body: ($: BlockBuilder<NullType>) => void) {
    test(name, () => {
        const testFn = East.function([], NullType, body);
        const compiled = testFn.toIR().compile(platform);
        compiled();
    });
}


describe("State", () => {
    // Reset store before each test
    beforeEach(() => {
        // Clear the store by writing undefined to known keys
        const store = getStore();
        store.write("counter", undefined);
        store.write("name", undefined);
        store.write("test_key", undefined);
    });

    // =========================================================================
    // Basic Read/Write
    // =========================================================================

    testState("writes and reads integer value", $ => {
        // Write a value using the new generic API
        $(State.write([IntegerType], "counter", 42n));

        // Read it back - returns value directly, throws if missing
        const result = $.let(State.read([IntegerType], "counter"));
        $(Assert.equal(result, 42n));
    });

    testState("writes and reads string value", $ => {
        $(State.write([StringType], "name", "hello"));

        const result = $.let(State.read([StringType], "name"));
        $(Assert.equal(result, "hello"));
    });

    test("throws for missing key", () => {
        const testFn = East.function([], NullType, $ => {
            // Reading a non-existent key should throw
            $.let(State.read([IntegerType], "nonexistent"));
        });
        const compiled = testFn.toIR().compile(platform);
        // Use native Node.js assertion for runtime throws
        assert.throws(() => compiled(), /Key not found: nonexistent/);
    });

    // =========================================================================
    // Increment Pattern
    // =========================================================================

    testState("increments counter", $ => {
        // Initialize counter
        $(State.write([IntegerType], "counter", 0n));

        // Increment
        const count = $.let(State.read([IntegerType], "counter"));
        $(State.write([IntegerType], "counter", count.add(1n)));

        // Read back
        const result = $.let(State.read([IntegerType], "counter"));
        $(Assert.equal(result, 1n));
    });

    testState("increments counter multiple times", $ => {
        // Initialize
        $(State.write([IntegerType], "counter", 0n));

        // Increment 3 times
        $.for(East.Array.range(0n, 3n), ($, _item, _i) => {
            const count = $.let(State.read([IntegerType], "counter"));
            $(State.write([IntegerType], "counter", count.add(1n)));
        });

        // Read final value
        const result = $.let(State.read([IntegerType], "counter"));
        $(Assert.equal(result, 3n));
    });

    // =========================================================================
    // Overwrite
    // =========================================================================

    testState("overwrites existing value", $ => {
        // Write initial value
        $(State.write([IntegerType], "counter", 10n));

        // Overwrite with new value
        $(State.write([IntegerType], "counter", 20n));

        // Read back
        const result = $.let(State.read([IntegerType], "counter"));
        $(Assert.equal(result, 20n));
    });

    // =========================================================================
    // Multiple Keys
    // =========================================================================

    testState("handles multiple independent keys", $ => {
        // Write to different keys
        $(State.write([IntegerType], "counter", 100n));
        $(State.write([StringType], "name", "Alice"));

        // Read both back
        const count = $.let(State.read([IntegerType], "counter"));
        const name = $.let(State.read([StringType], "name"));

        $(Assert.equal(count, 100n));
        $(Assert.equal(name, "Alice"));
    });

    // =========================================================================
    // Cross-function persistence
    // =========================================================================

    testState("persists state across inner function calls", $ => {
        // Define inner functions
        const writeFn = East.function([], NullType, $ => {
            $(State.write([IntegerType], "counter", 42n));
        });

        const readFn = East.function([], IntegerType, $ => {
            return State.read([IntegerType], "counter");
        });

        // Call write, then read
        $(writeFn());
        const result = $.let(readFn());

        $(Assert.equal(result, 42n));
    });

    testState("accumulates across multiple inner function calls", $ => {
        const initFn = East.function([], NullType, $ => {
            $(State.write([IntegerType], "counter", 0n));
        });

        const incrementFn = East.function([], NullType, $ => {
            const count = $.let(State.read([IntegerType], "counter"));
            $(State.write([IntegerType], "counter", count.add(1n)));
        });

        $(initFn());
        $.for(East.Array.range(0n, 5n), ($, _item, _i) => {
            $(incrementFn());
        });

        const result = $.let(State.read([IntegerType], "counter"));
        $(Assert.equal(result, 5n));
    });

    // =========================================================================
    // State.has
    // =========================================================================

    testState("has returns false for missing key", $ => {
        const exists = $.let(State.has("nonexistent"));
        $(Assert.equal(exists, false));
    });

    testState("has returns true for existing key", $ => {
        $(State.write([IntegerType], "counter", 42n));
        const exists = $.let(State.has("counter"));
        $(Assert.equal(exists, true));
    });
});
