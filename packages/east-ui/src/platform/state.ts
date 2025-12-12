/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

/**
 * State management platform functions for East UI.
 *
 * Provides reactive state operations for East UI programs.
 * State is stored as Beast2-encoded blobs, allowing any East type to be stored.
 *
 * @packageDocumentation
 */

import {
    East,
    StringType,
    BlobType,
    NullType,
    none,
    some,
    type SubtypeExprOrValue,
    type EastType,
    type CallableFunctionExpr,
    BooleanType,
} from "@elaraai/east";
import { type PlatformFunction, OptionType } from "@elaraai/east/internal";
import { UIStore } from "./store.js";

// =============================================================================
// Reactive Dependency Tracking
// =============================================================================

/**
 * Tracking context for reactive dependency collection.
 * When set, state_read calls will record their keys here.
 */
let trackingContext: Set<string> | null = null;

/**
 * Enable dependency tracking for reactive components.
 *
 * @remarks
 * Call this before executing a reactive component's render function.
 * All subsequent `state_read` calls will record their keys to the tracking set.
 * Call {@link disableTracking} when done to get the collected keys.
 *
 * @returns The Set that will collect accessed keys
 *
 * @example
 * ```ts
 * enableTracking();
 * try {
 *     const result = renderFn();
 *     const deps = disableTracking();
 *     // deps contains all state keys read during renderFn()
 * } catch (e) {
 *     disableTracking();
 *     throw e;
 * }
 * ```
 */
export function enableTracking(): Set<string> {
    trackingContext = new Set();
    return trackingContext;
}

/**
 * Disable dependency tracking and return collected keys.
 *
 * @remarks
 * Call this after executing a reactive component's render function.
 * Returns all keys that were accessed via `state_read` since {@link enableTracking} was called.
 *
 * @returns Array of state keys that were read during tracking
 */
export function disableTracking(): string[] {
    const keys = trackingContext ? [...trackingContext] : [];
    trackingContext = null;
    return keys;
}

/**
 * Check if dependency tracking is currently enabled.
 *
 * @returns True if tracking is active
 */
export function isTracking(): boolean {
    return trackingContext !== null;
}

/**
 * Record a key access during dependency tracking.
 *
 * @remarks
 * Called internally by the `state_read` implementation.
 * Only records if tracking is enabled via {@link enableTracking}.
 *
 * @param key - The state key being accessed
 */
export function trackKey(key: string): void {
    if (trackingContext) {
        trackingContext.add(key);
    }
}

// =============================================================================
// Platform Functions
// =============================================================================

/**
 * Platform function to write a Beast2-encoded value to the state store.
 *
 * @remarks
 * Writes a blob to state, or deletes the key if `none` is passed.
 * Triggers re-render in reactive contexts.
 *
 * @param key - The string key to write to
 * @param value - The Beast2-encoded blob value (some to write, none to delete)
 * @returns Null
 */
export const state_write = East.platform("state_write", [StringType, OptionType(BlobType)], NullType);

/**
 * Platform function to read a Beast2-encoded value from the state store.
 *
 * @remarks
 * Returns `some(blob)` if the key exists, `none` if not.
 * Use `.match()` to handle both cases.
 *
 * @param key - The string key to read from
 * @returns Option of Beast2-encoded blob (some if exists, none if not)
 */
export const state_read = East.platform("state_read", [StringType], OptionType(BlobType));

/**
 * Platform function to check if a key exists in the state store.
 *
 * @remarks
 * Returns true if the key exists, false otherwise.
 *
 * @param key - The string key to check
 * @returns Boolean indicating existence of the key
 */
export const state_has = East.platform("state_has", [StringType], BooleanType);



/**
 * Singleton UI store instance for state management.
 *
 * @remarks
 * This is the global store used by {@link StateImpl}. Access directly
 * for React integration, subscriptions, or debugging.
 */
export const store = new UIStore();

/**
 * Platform implementation for state management operations.
 *
 * @remarks
 * Provides the runtime implementations for state read/write operations
 * bound to the singleton {@link store}. Pass this to `ir.compile()` to enable
 * state functionality.
 */
export const StateImpl: PlatformFunction[] = [
    state_write.implement((key, value) => {
        if (value.type === 'none') {
            store.write(key, undefined);
        } else {
            store.write(key, value.value);
        }
    }),
    state_read.implement((key) => {
        // Track the key if in tracking mode (for reactive dependency collection)
        trackKey(key);

        const ret = store.read(key);
        if (ret === undefined) {
            return none;
        } else {
            return some(ret);
        }
    }),
    state_has.implement((key) => {
        return store.has(key);
    }),
];

/**
 * Creates a typed state write function for a given key and type.
 *
 * @remarks
 * Returns an East function that writes a typed value to state. The value is
 * automatically Beast2-encoded before storage. Pass `some(value)` to write
 * or `none` to delete the key.
 *
 * @typeParam T - The East type of the value to write
 * @param key - The string key to write to
 * @param value - The value wrapped in an option (some to write, none to delete)
 * @param type - The East type descriptor for the value
 * @returns A callable East function that performs the write
 *
 * @example
 * ```ts
 * import { East, IntegerType, NullType, some } from "@elaraai/east";
 * import { State, UIComponentType } from "@elaraai/east-ui";
 *
 * const counter = East.function([], UIComponentType, $ => {
 *     // Write 42 to "counter" key
 *     $(State.writeTyped("counter", some(42n), IntegerType)());
 *
 *     // Delete the key
 *     $(State.writeTyped("counter", none, IntegerType)());
 * });
 * ```
 */
export const state_write_typed = <T extends EastType>(
    key: SubtypeExprOrValue<StringType>,
    value: SubtypeExprOrValue<OptionType<T>>,
    type: T
): CallableFunctionExpr<[], NullType> => {
    return East.function([], NullType, $ => {
        const key_expr = East.value(key);
        const value_expr = East.value(value, OptionType(type));
        $.match(value_expr, {
            some: ($, v) => {
                $(state_write(key_expr, some(East.Blob.encodeBeast(v, "v2"))));
            },
            none: ($) => {
                $(state_write(key_expr, none));
            }
        });
        return null;
    });
};

/**
 * Creates a typed state read function for a given key and type.
 *
 * @remarks
 * Returns an East function that reads a typed value from state. The value is
 * automatically Beast2-decoded after retrieval. Returns `some(value)` if the
 * key exists, `none` if not.
 *
 * @typeParam T - The East type of the value to read
 * @param key - The string key to read from
 * @param type - The East type descriptor for the value
 * @returns A callable East function that returns an option of the typed value
 *
 * @example
 * ```ts
 * import { East, IntegerType, NullType } from "@elaraai/east";
 * import { State, UIComponentType, Text } from "@elaraai/east-ui";
 *
 * const display = East.function([], UIComponentType, $ => {
 *     // Read typed value from state
 *     const count = $.let(State.readTyped("counter", IntegerType)());
 *
 *     // Use the value (unwrap if you know it exists)
 *     return Text.Root(East.str`Count: ${count.unwrap("some")}`);
 * });
 * ```
 */
export const state_read_typed = <T extends EastType>(
    key: SubtypeExprOrValue<StringType>,
    type: T
): CallableFunctionExpr<[], OptionType<T>> => {
    return East.function([], OptionType(type), $ => {
        const key_expr = East.value(key);
        const ret = $.let(none, OptionType(type));
        $.match(state_read(key_expr), {
            some: ($, v) => {
                $.assign(
                    ret,
                    East.value(
                        some(v.decodeBeast(type, "v2")) as unknown as any,
                        OptionType(type)
                    ) as unknown as any
                );
            },
        });
        return ret as any;
    });
};



/**
 * Creates a typed state initialization function that only writes if the key doesn't exist.
 *
 * @remarks
 * Returns an East function that initializes a state key with a default value.
 * The write only occurs if the key is not already set, preventing overwrites
 * on re-renders. Use this for setting up initial state in components.
 *
 * @typeParam T - The East type of the value to initialize
 * @param key - The string key to initialize
 * @param value - The default value to write (not wrapped in option)
 * @param type - The East type descriptor for the value
 * @returns A callable East function that performs the conditional initialization
 *
 * @example
 * ```ts
 * import { East, IntegerType } from "@elaraai/east";
 * import { State, UIComponentType, Button } from "@elaraai/east-ui";
 *
 * const counter = East.function([], UIComponentType, $ => {
 *     // Initialize to 0 only if not already set
 *     $(State.initTyped("counter", 0n, IntegerType)());
 *
 *     // Read and display
 *     const count = $.let(State.readTyped("counter", IntegerType)());
 *     // ...
 * });
 * ```
 */
export const state_init_typed = <T extends EastType>(
    key: SubtypeExprOrValue<StringType>,
    value: SubtypeExprOrValue<T>,
    type: T
): CallableFunctionExpr<[], NullType> => {
    return East.function([], NullType, $ => {
        const key_expr = East.value(key);
        const value_expr = East.value(value, type);
        $.match(state_read(key_expr), {
            none: ($) => {
                $(state_write(key_expr, some(East.Blob.encodeBeast(value_expr, "v2"))));
            },
        });
        return null;
    });
};