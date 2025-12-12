/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

/**
 * Platform functions for East UI state management.
 *
 * Provides reactive state operations for East UI programs.
 * State is stored as Beast2-encoded blobs, allowing any East type to be stored.
 *
 * @packageDocumentation
 */

// Export platform functions and implementation
export { state_read, state_write, state_has, state_read_typed, state_write_typed, state_init_typed, store, StateImpl } from "./state.js";

// Export tracking functions for reactive components
export { enableTracking, disableTracking, isTracking, trackKey } from "./state.js";

// Export store types
export { UIStore, type UIStoreInterface, type UIStoreOptions, createUIStore } from "./store.js";

// Import for grouped exports
import { state_read, state_write, state_has, state_read_typed, state_write_typed, state_init_typed, store, StateImpl } from "./state.js";

/**
 * State management platform functions for East UI.
 *
 * @remarks
 * Use `State.read(key)` and `State.write(key, value)` for reactive state operations.
 * Pass `State.Implementation` to `ir.compile()` to enable state functionality.
 *
 * @example
 * ```ts
 * import { East, IntegerType, NullType, some } from "@elaraai/east";
 * import { State, UIComponentType, Button } from "@elaraai/east-ui";
 *
 * const counter = East.function([], UIComponentType, $ => {
 *     const count = $.let(0n);
 *     $.match($(State.read("counter")), {
 *         some: ($, v) => $.assign(count, v.decodeBeast(IntegerType, "v2")),
 *     });
 *
 *     return Button.Root(East.str`Count: ${count}`, {
 *         onClick: East.function([], NullType, $ => {
 *             const count = $.let(0n);
 *             $.match($(State.read("counter")), {
 *                 some: ($, v) => $.assign(count, v.decodeBeast(IntegerType, "v2")),
 *             });
 *             const newBlob = East.Blob.encodeBeast(count.add(1n), "v2");
 *             $(State.write("counter", some(newBlob)));
 *         })
 *     });
 * });
 *
 * const compiled = counter.toIR().compile(State.Implementation);
 * const ui = compiled();
 * ```
 */
export const State = {
    /**
     * Reads a Beast2-encoded blob from the state store.
     *
     * @remarks
     * Returns `some(blob)` if the key exists, `none` if not.
     * Use `$.match()` to handle both cases and decode with `.decodeBeast()`.
     *
     * @example
     * ```ts
     * import { East, IntegerType } from "@elaraai/east";
     * import { State } from "@elaraai/east-ui";
     *
     * const readCounter = East.function([], IntegerType, $ => {
     *     const count = $.let(0n);
     *     $.match($(State.read("counter")), {
     *         some: ($, v) => $.assign(count, v.decodeBeast(IntegerType, "v2")),
     *     });
     *     return count;
     * });
     * ```
     */
    read: state_read,

    /**
     * Writes a Beast2-encoded blob to the state store.
     *
     * @remarks
     * Pass `some(blob)` to write a value, or `none` to delete the key.
     * Use `East.Blob.encodeBeast(value, "v2")` to encode values.
     *
     * @example
     * ```ts
     * import { East, NullType, some } from "@elaraai/east";
     * import { State } from "@elaraai/east-ui";
     *
     * const writeCounter = East.function([], NullType, $ => {
     *     const blob = East.Blob.encodeBeast(East.value(42n), "v2");
     *     $(State.write("counter", some(blob)));
     * });
     * ```
     */
    write: state_write,

    /**
     * Platform implementation for state management operations.
     *
     * @remarks
     * Pass this to `ir.compile()` to enable state functionality.
     * Bound to the singleton {@link State.store}.
     *
     * @example
     * ```ts
     * import { East, NullType } from "@elaraai/east";
     * import { State } from "@elaraai/east-ui";
     *
     * const myFunction = East.function([], NullType, $ => {
     *     // Use State.read and State.write here
     * });
     *
     * const compiled = myFunction.toIR().compile(State.Implementation);
     * compiled();
     * ```
     */
    Implementation: StateImpl,

    /**
     * Singleton UI store instance.
     *
     * @remarks
     * Access directly for React integration, subscriptions, or debugging.
     * This is the backing store for {@link State.Implementation}.
     */
    store: store,

    /**
     * Creates a typed state read function that handles Beast2 encoding automatically.
     *
     * @remarks
     * Returns an East function that reads and decodes a typed value from state.
     * Returns `some(value)` if the key exists, `none` if not. This is a convenience
     * wrapper around {@link State.read} that handles Beast2 decoding.
     *
     * **Important:** The returned function must be invoked with `()` inside `$()`:
     * ```ts
     * const value = $(State.readTyped("key", IntegerType)());  // Note: () inside $()
     * ```
     *
     * @example
     * ```ts
     * import { East, IntegerType } from "@elaraai/east";
     * import { State, UIComponentType, Text } from "@elaraai/east-ui";
     *
     * const display = East.function([], UIComponentType, $ => {
     *     // Read typed value - returns Option<Integer>
     *     const count = $(State.readTyped("counter", IntegerType)());
     *
     *     // Unwrap if you know it exists
     *     return Text.Root(East.str`Count: ${count.unwrap("some")}`);
     * });
     * ```
     */
    readTyped: state_read_typed,

    /**
     * Creates a typed state write function that handles Beast2 encoding automatically.
     *
     * @remarks
     * Returns an East function that encodes and writes a typed value to state.
     * Pass `some(value)` to write or `none` to delete. This is a convenience
     * wrapper around {@link State.write} that handles Beast2 encoding.
     *
     * **Important:** The returned function must be invoked with `()` inside `$()`:
     * ```ts
     * $(State.writeTyped("key", some(42n), IntegerType)());  // Note: () inside $()
     * ```
     *
     * @example
     * ```ts
     * import { East, IntegerType, NullType, some, none } from "@elaraai/east";
     * import { State } from "@elaraai/east-ui";
     *
     * const writer = East.function([], NullType, $ => {
     *     // Write a typed value
     *     $(State.writeTyped("counter", some(42n), IntegerType)());
     *
     *     // Delete the key
     *     $(State.writeTyped("counter", none, IntegerType)());
     * });
     * ```
     */
    writeTyped: state_write_typed,

    /**
     * Checks if a key exists in the state store.
     *
     * @remarks
     * Returns a boolean indicating whether the key is set.
     * Useful for conditional logic based on state existence.
     *
     * @example
     * ```ts
     * import { East, NullType } from "@elaraai/east";
     * import { State } from "@elaraai/east-ui";
     *
     * const checker = East.function([], NullType, $ => {
     *     $.if($(State.has("counter")), $ => {
     *         // Key exists, do something
     *     });
     * });
     * ```
     */
    has: state_has,

    /**
     * Creates a typed state initialization function that only writes if the key doesn't exist.
     *
     * @remarks
     * Returns an East function that initializes a state key with a default value.
     * The write only occurs if the key is not already set, preventing overwrites
     * on re-renders. Use this for setting up initial state in components.
     *
     * **Important:** The returned function must be invoked with `()` inside `$()`:
     * ```ts
     * $(State.initTyped("key", 0n, IntegerType)());  // Note: () inside $()
     * ```
     *
     * @example
     * ```ts
     * import { East, IntegerType } from "@elaraai/east";
     * import { State, UIComponentType, Text } from "@elaraai/east-ui";
     *
     * const counter = East.function([], UIComponentType, $ => {
     *     // Initialize to 0 only if not already set (safe for re-renders)
     *     $(State.initTyped("counter", 0n, IntegerType)());
     *
     *     // Read and display
     *     const count = $(State.readTyped("counter", IntegerType)());
     *     return Text.Root(East.str`Count: ${count.unwrap("some")}`);
     * });
     * ```
     */
    initTyped: state_init_typed,
} as const;
