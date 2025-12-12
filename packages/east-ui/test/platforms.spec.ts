/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */
import assert from "node:assert/strict";
import { test, describe } from "node:test";
import { East, Expr, get_location, NullType, StringType, BlockBuilder, type SubtypeExprOrValue, type ExprType, type EastType } from "@elaraai/east";
import { StateImpl } from "../src/platform/state.js";

const { str } = East;

/**
 * Platform function that indicates a test assertion passed.
 *
 * This is used by East test code to signal successful assertions.
 * When running in Node.js, this does nothing. Other platforms may log or track passes.
 */
const testPass = East.platform("testPass", [], NullType);

/**
 * Platform function that indicates a test assertion failed.
 *
 * This is used by East test code to signal failed assertions.
 * When running in Node.js, this throws an assertion error.
 *
 * @param message - The error message describing the assertion failure
 */
const testFail = East.platform("testFail", [StringType], NullType);

/**
 * Creates a test platform that uses Node.js assertions.
 *
 * @returns A platform array for compiling East functions
 */
export function createTestPlatform() {
    return [
        testPass.implement(() => { }), // Assertion passed - do nothing
        testFail.implement((message: string) => {
            // Assertion failed - throw to fail the test
            assert.fail(message);
        }),
        ...StateImpl,
    ];
}

const platform = createTestPlatform();

/**
 * Defines and runs an East test.
 *
 * Wraps the body in an East function, compiles it, and runs it as a Node.js test.
 * The test function can be exported as IR for cross-platform testing.
 *
 * @param name - The name of the test case
 * @param body - A function that builds the test logic using the block builder
 */
export function testEast(name: string, body: ($: BlockBuilder<NullType>) => void) {
    test(name, () => {
        const testFn = East.function([], NullType, body);
        const ir = testFn.toIR();
        const compiled = ir.compile(platform);
        compiled();
    });
}


/**
 * Wrapper around Node.js `describe` that also exports test IR for cross-platform testing.
 *
 * This function behaves exactly like Node.js `describe` - it runs all the tests normally.
 * Additionally, it creates a single East function that runs all tests in sequence,
 * making it easy to export the entire test suite for running in other East implementations.
 *
 * @param suiteName - The name of the test suite
 * @param builder - A function that receives a `test` function for defining tests
 *
 * @example
 * ```ts
 * // Use exactly like describe()
 * describeEast("Array tests", (test) => {
 *   test("addition", $ => {
 *     $(assert.equal(East.value(1n).add(1n), 2n));
 *   });
 *   test("subtraction", $ => {
 *     $(assert.equal(East.value(2n).subtract(1n), 1n));
 *   });
 * });
 * ```
 */
export function describeEast(
    suiteName: string,
    builder: (test: (name: string, body: ($: BlockBuilder<NullType>) => void) => void) => void
) {
    const tests: Array<{ name: string, body: ($: BlockBuilder<NullType>) => void }> = [];

    // Collect all test names and bodies
    builder((name: string, body: ($: BlockBuilder<NullType>) => void) => {
        tests.push({ name, body });
    });
    // Run the describe block normally using Node.js describe
    describe(suiteName, () => {
        for (const { name, body } of tests) {
            testEast(name, body);
        }
    });
}

/**
 * East assertion functions that match Node.js assert API naming.
 *
 * These functions generate East expressions that perform runtime assertions
 * using platform functions, enabling testing of East code.
 */

/**
 * East assertion functions that match Node.js assert API naming.
 *
 * These functions generate East expressions that perform runtime assertions
 * using platform functions, enabling testing of East code.
 */
export const assertEast = {
    /**
     * Asserts that two values are the same reference (meaning if one is mutated, the other reflects the change - and they are always equal).
     *
     * @typeParam E - The type of the actual expression
     * @param actual - The actual value to test
     * @param expected - The expected value to compare against
     * @returns An East expression that performs the equality check
     */
    is<E extends EastType>(actual: Expr<E>, expected: SubtypeExprOrValue<NoInfer<E>>): ExprType<NullType> {
        const location = get_location(2);
        const expected_expr = Expr.from(expected, Expr.type(actual));
        return Expr.tryCatch(
            Expr.block($ => {
                const act = $.let(actual);
                const exp = $.let(expected_expr);
                return East.is(act as any, exp as any).ifElse(
                    _$ => testPass(),
                    _$ => testFail(str`Expected ${act} to equal ${exp} (${East.value(`${location.filename} ${location.line}:${location.column}`)})`)
                );
            }),
            (_$, message, stack) => testFail(East.String.printError(message, stack))
        );
    },

    /**
     * Asserts that two values are equal.
     *
     * @typeParam E - The type of the actual expression
     * @param actual - The actual value to test
     * @param expected - The expected value to compare against
     * @returns An East expression that performs the equality check
     */
    equal<E extends EastType>(actual: Expr<E>, expected: SubtypeExprOrValue<NoInfer<E>>): ExprType<NullType> {
        const location = get_location(2);
        const expected_expr = Expr.from(expected, Expr.type(actual));
        return Expr.tryCatch(
            Expr.block($ => {
                const act = $.let(actual);
                const exp = $.let(expected_expr);
                return East.equal(act as any, exp as any).ifElse(
                    _$ => testPass(),
                    _$ => testFail(str`Expected ${act} to equal ${exp} (${East.value(`${location.filename} ${location.line}:${location.column}`)})`)
                );
            }),
            (_$, message, stack) => testFail(East.String.printError(message, stack))
        );
    },

    /**
     * Asserts that two values are not equal.
     *
     * @typeParam E - The type of the actual expression
     * @param actual - The actual value to test
     * @param expected - The value that should not be equal
     * @returns An East expression that performs the inequality check
     */
    notEqual<E extends EastType>(actual: Expr<E>, expected: SubtypeExprOrValue<NoInfer<E>>): ExprType<NullType> {
        const location = get_location(2);
        const expected_expr = Expr.from(expected, Expr.type(actual));
        return Expr.tryCatch(
            Expr.block($ => {
                const act = $.let(actual);
                const exp = $.let(expected_expr);
                return East.notEqual(act as any, exp as any).ifElse(
                    _$ => testPass(),
                    _$ => testFail(str`Expected ${act} to not equal ${exp} (${East.value(`${location.filename} ${location.line}:${location.column}`)})`)
                );
            }),
            (_$, message, stack) => testFail(East.String.printError(message, stack))
        );
    },

    /**
     * Asserts that actual is less than expected.
     *
     * @typeParam E - The type of the actual expression
     * @param actual - The actual value to test
     * @param expected - The value that actual should be less than
     * @returns An East expression that performs the less-than check
     */
    less<E extends EastType>(actual: Expr<E>, expected: SubtypeExprOrValue<NoInfer<E>>): ExprType<NullType>{
        const location = get_location(2);
        const expected_expr = Expr.from(expected, Expr.type(actual));
        return Expr.tryCatch(
            Expr.block($ => {
                const act = $.let(actual);
                const exp = $.let(expected_expr);
                return East.less(act as any, exp as any).ifElse(
                    _$ => testPass(),
                    _$ => testFail(str`Expected ${act} to be less than ${exp} (${`${location.filename} ${location.line}:${location.column}`})`)
                );
            }),
            (_$, message, stack) => testFail(East.String.printError(message, stack))
        );
    },

    /**
     * Asserts that actual is less than or equal to expected.
     *
     * @typeParam E - The type of the actual expression
     * @param actual - The actual value to test
     * @param expected - The value that actual should be less than or equal to
     * @returns An East expression that performs the less-than-or-equal check
     */
    lessEqual<E extends EastType>(actual: Expr<E>, expected: SubtypeExprOrValue<NoInfer<E>>): ExprType<NullType> {
        const location = get_location(2);
        const expected_expr = Expr.from(expected, Expr.type(actual));
        return Expr.tryCatch(
            Expr.block($ => {
                const act = $.let(actual);
                const exp = $.let(expected_expr);
                return East.lessEqual(act as any, exp as any).ifElse(
                    _$ => testPass(),
                    _$ => testFail(str`Expected ${act} to be less than or equal to ${exp} (${`${location.filename} ${location.line}:${location.column}`})`)
                );
            }),
            (_$, message, stack) => testFail(East.String.printError(message, stack))
        );
    },

    /**
     * Asserts that actual is greater than expected.
     *
     * @typeParam E - The type of the actual expression
     * @param actual - The actual value to test
     * @param expected - The value that actual should be greater than
     * @returns An East expression that performs the greater-than check
     */
    greater<E extends EastType>(actual: Expr<E>, expected: SubtypeExprOrValue<NoInfer<E>>): ExprType<NullType> {
        const location = get_location(2);
        const expected_expr = Expr.from(expected, Expr.type(actual));
        return Expr.tryCatch(
            Expr.block($ => {
                const act = $.let(actual);
                const exp = $.let(expected_expr);
                return East.greater(act as any, exp as any).ifElse(
                    _$ => testPass(),
                    _$ => testFail(str`Expected ${act} to be greater than ${exp} (${`${location.filename} ${location.line}:${location.column}`})`)
                );
            }),
            (_$, message, stack) => testFail(East.String.printError(message, stack))
        );
    },

    /**
     * Asserts that actual is greater than or equal to expected.
     *
     * @typeParam E - The type of the actual expression
     * @param actual - The actual value to test
     * @param expected - The value that actual should be greater than or equal to
     * @returns An East expression that performs the greater-than-or-equal check
     */
    greaterEqual<E extends EastType>(actual: Expr<E>, expected: SubtypeExprOrValue<NoInfer<E>>): ExprType<NullType> {
        const location = get_location(2);
        const expected_expr = Expr.from(expected, Expr.type(actual));
        return Expr.tryCatch(
            Expr.block($ => {
                const act = $.let(actual);
                const exp = $.let(expected_expr);
                return East.greaterEqual(act as any, exp as any).ifElse(
                    _$ => testPass(),
                    _$ => testFail(str`Expected ${act} to be greater than or equal to ${exp} (${`${location.filename} ${location.line}:${location.column}`})`)
                );
            }),
            (_$, message, stack) => testFail(East.String.printError(message, stack))
        );
    },

    /**
     * Asserts that actual is between min and max (inclusive).
     *
     * @typeParam E - The type of the actual expression
     * @param actual - The actual value to test
     * @param min - The minimum value (inclusive)
     * @param max - The maximum value (inclusive)
     * @returns An East expression that performs the range check
     */
    between<E extends EastType>(actual: Expr<E>, min: SubtypeExprOrValue<NoInfer<E>>, max: SubtypeExprOrValue<NoInfer<E>>): ExprType<NullType> {
        const location = get_location(2);
        const min_expr = Expr.from(min, Expr.type(actual));
        const max_expr = Expr.from(max, Expr.type(actual));
        return Expr.tryCatch(
            East.greaterEqual(actual, min_expr as any).ifElse(
                _$ => East.lessEqual(actual, max_expr as any).ifElse(
                    _$ => testPass(),
                    _$ => testFail(str`Expected ${actual} to be less than or equal to ${max_expr} (${`${location.filename} ${location.line}:${location.column}`})`)
                ),
                _$ => testFail(str`Expected ${actual} to be greater than or equal to ${min_expr}`)
            ),
            (_$, message, stack) => testFail(East.String.printError(message, stack))
        );
    },

    /**
     * Asserts that an expression throws an error.
     *
     * @param fn - The expression that should throw an error when evaluated
     * @param pattern - Optional regex pattern to match against the error message
     * @returns An East expression that verifies an error is thrown
     */
    throws(fn: Expr<any>, pattern?: RegExp): ExprType<NullType> {
        const location = get_location(2);
        return Expr.tryCatch(
            Expr.block($ => {
                const result = $.let(fn);
                $(testFail(str`Expected error, got ${result} (${East.value(`${location.filename} ${location.line}:${location.column}`)})`));
                return null;
            }),
            ($, message, stack) => {
                if (pattern) {
                    // Validate error message matches the pattern
                    return message.contains(pattern).ifElse(
                        _$ => testPass(),
                        _$ => testFail(str`Expected error message to match ${East.value(pattern.source)}, but got: ${East.String.printError(message, stack)}`)
                    );
                } else {
                    // Just verify it threw
                    return testPass();
                }
            }
        );
    },
};

