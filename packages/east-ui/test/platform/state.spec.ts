/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { test, describe, beforeEach } from "node:test";
import { East, IntegerType, StringType, NullType, some, none, BlockBuilder } from "@elaraai/east";
import { createTestPlatform, assertEast } from "../platforms.spec.js";
import { State } from "../../src/index.js";

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

// Use the typed helpers from State namespace
const write_factory = State.writeTyped;
const read_factory = State.readTyped;


describe("State", () => {
    // Reset store before each test
    beforeEach(() => {
        // Clear the store by writing undefined to known keys
        State.store.write("counter", undefined);
        State.store.write("name", undefined);
        State.store.write("test_key", undefined);
    });

    // =========================================================================
    // Basic Read/Write
    // =========================================================================

    testState("writes and reads integer value", $ => {
        // Write a value
        const blob = East.Blob.encodeBeast(East.value(42n), "v2");
        $(State.write("counter", some(blob)));

        // Read it back
        const count = $.let(0n);
        $.match(State.read("counter"), {
            some: ($, v) => $.assign(count, v.decodeBeast(IntegerType, "v2")),
        });

        $(assertEast.equal(count, 42n));
    });


    testState("writes and reads integer value with wrapper", $ => {
        // Write a value
        $(write_factory("counter", some(42n), IntegerType)());

        // Read it back
        const count = $.let(read_factory("counter", IntegerType)());
        $(assertEast.equal(count.unwrap('some'), 42n));
    });

    testState("writes and reads string value", $ => {
        const blob = East.Blob.encodeBeast(East.value("hello"), "v2");
        $(State.write("name", some(blob)));

        const name = $.let("");
        $.match(State.read("name"), {
            some: ($, v) => $.assign(name, v.decodeBeast(StringType, "v2")),
        });

        $(assertEast.equal(name, "hello"));
    });

    testState("returns none for missing key", $ => {
        const found = $.let(false);
        $.match(State.read("nonexistent"), {
            some: ($, _v) => $.assign(found, true),
            none: ($) => $.assign(found, false),
        });

        $(assertEast.equal(found, false));
    });

    // =========================================================================
    // Increment Pattern
    // =========================================================================

    testState("increments counter", $ => {
        // Initialize counter
        const initBlob = East.Blob.encodeBeast(East.value(0n), "v2");
        $(State.write("counter", some(initBlob)));

        // Increment
        const count = $.let(0n);
        $.match(State.read("counter"), {
            some: ($, v) => $.assign(count, v.decodeBeast(IntegerType, "v2")),
        });
        const newBlob = East.Blob.encodeBeast(count.add(1n), "v2");
        $(State.write("counter", some(newBlob)));

        // Read back
        const result = $.let(0n);
        $.match(State.read("counter"), {
            some: ($, v) => $.assign(result, v.decodeBeast(IntegerType, "v2")),
        });

        $(assertEast.equal(result, 1n));
    });

    testState("increments counter multiple times", $ => {
        // Initialize
        const initBlob = East.Blob.encodeBeast(East.value(0n), "v2");
        $(State.write("counter", some(initBlob)));

        // Increment 3 times
        $.for(East.Array.range(0n, 3n), ($, _item, _i) => {
            const count = $.let(0n);
            $.match(State.read("counter"), {
                some: ($, v) => $.assign(count, v.decodeBeast(IntegerType, "v2")),
            });
            const newBlob = East.Blob.encodeBeast(count.add(1n), "v2");
            $(State.write("counter", some(newBlob)));
        });

        // Read final value
        const result = $.let(0n);
        $.match(State.read("counter"), {
            some: ($, v) => $.assign(result, v.decodeBeast(IntegerType, "v2")),
        });

        $(assertEast.equal(result, 3n));
    });

    // =========================================================================
    // Delete (write none)
    // =========================================================================

    testState("deletes key by writing none", $ => {
        // Write a value
        const blob = East.Blob.encodeBeast(East.value(42n), "v2");
        $(State.write("counter", some(blob)));

        // Verify it exists
        const existsBefore = $.let(false);
        $.match(State.read("counter"), {
            some: ($, _v) => $.assign(existsBefore, true),
        });
        $(assertEast.equal(existsBefore, true));

        // Delete by writing none
        $(State.write("counter", none));

        // Verify it's gone
        const existsAfter = $.let(false);
        $.match(State.read("counter"), {
            some: ($, _v) => $.assign(existsAfter, true),
            none: ($) => $.assign(existsAfter, false),
        });
        $(assertEast.equal(existsAfter, false));
    });

    // =========================================================================
    // Overwrite
    // =========================================================================

    testState("overwrites existing value", $ => {
        // Write initial value
        const blob1 = East.Blob.encodeBeast(East.value(10n), "v2");
        $(State.write("counter", some(blob1)));

        // Overwrite with new value
        const blob2 = East.Blob.encodeBeast(East.value(20n), "v2");
        $(State.write("counter", some(blob2)));

        // Read back
        const result = $.let(0n);
        $.match(State.read("counter"), {
            some: ($, v) => $.assign(result, v.decodeBeast(IntegerType, "v2")),
        });

        $(assertEast.equal(result, 20n));
    });

    // =========================================================================
    // Multiple Keys
    // =========================================================================

    testState("handles multiple independent keys", $ => {
        // Write to different keys
        const blob1 = East.Blob.encodeBeast(East.value(100n), "v2");
        $(State.write("counter", some(blob1)));

        const blob2 = East.Blob.encodeBeast(East.value("Alice"), "v2");
        $(State.write("name", some(blob2)));

        // Read both back
        const count = $.let(0n);
        $.match(State.read("counter"), {
            some: ($, v) => $.assign(count, v.decodeBeast(IntegerType, "v2")),
        });

        const name = $.let("");
        $.match(State.read("name"), {
            some: ($, v) => $.assign(name, v.decodeBeast(StringType, "v2")),
        });

        $(assertEast.equal(count, 100n));
        $(assertEast.equal(name, "Alice"));
    });

    // =========================================================================
    // Cross-function persistence
    // =========================================================================

    testState("persists state across inner function calls", $ => {
        // Define inner functions
        const writeFn = East.function([], NullType, $ => {
            const blob = East.Blob.encodeBeast(East.value(42n), "v2");
            $(State.write("counter", some(blob)));
        });

        const readFn = East.function([], IntegerType, $ => {
            const count = $.let(0n);
            $.match(State.read("counter"), {
                some: ($, v) => $.assign(count, v.decodeBeast(IntegerType, "v2")),
            });
            return count;
        });

        // Call write, then read
        $(writeFn());
        const result = $.let(readFn());

        $(assertEast.equal(result, 42n));
    });

    testState("accumulates across multiple inner function calls", $ => {
        const initFn = East.function([], NullType, $ => {
            const blob = East.Blob.encodeBeast(East.value(0n), "v2");
            $(State.write("counter", some(blob)));
        });

        const incrementFn = East.function([], NullType, $ => {
            const count = $.let(0n);
            $.match(State.read("counter"), {
                some: ($, v) => $.assign(count, v.decodeBeast(IntegerType, "v2")),
            });
            const newBlob = East.Blob.encodeBeast(count.add(1n), "v2");
            $(State.write("counter", some(newBlob)));
        });

        $(initFn());
        $.for(East.Array.range(0n, 5n), ($, _item, _i) => {
            $(incrementFn());
        });

        const result = $.let(0n);
        $.match(State.read("counter"), {
            some: ($, v) => $.assign(result, v.decodeBeast(IntegerType, "v2")),
        });

        $(assertEast.equal(result, 5n));
    });
});
