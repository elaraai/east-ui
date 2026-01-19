/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

// Re-export test infrastructure from east-node-std
export { Assert, TestImpl } from "@elaraai/east-node-std";
import { describe, it } from "node:test";
import { East, NullType, type BlockBuilder } from "@elaraai/east";
import { TestImpl } from "@elaraai/east-node-std";
import { StateImpl } from "../src/platform/state-runtime.js";

/**
 * Creates a test platform that includes State platform functions.
 *
 * Use this for tests that need to use State.read/State.write.
 *
 * @returns A platform array for compiling East functions with State support
 */
export function createTestPlatform() {
    return [
        ...TestImpl,
        ...StateImpl,
    ];
}

/**
 * Custom describeEast that includes StateImpl for State platform functions.
 *
 * @param name - The test suite name
 * @param tests - Function that defines tests using the `test` callback
 */
export function describeEast(
    name: string,
    tests: (test: (name: string, body: ($: BlockBuilder<NullType>) => void) => void) => void
): void {
    const platform = createTestPlatform();

    describe(name, () => {
        // Create a test function that compiles and runs East code
        const testFn = (testName: string, body: ($: BlockBuilder<NullType>) => void) => {
            it(testName, () => {
                const fn = East.function([], NullType, body);
                const compiled = fn.toIR().compile(platform);
                compiled();
            });
        };

        tests(testFn);
    });
}
