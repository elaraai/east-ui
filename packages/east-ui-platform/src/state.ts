/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { East, StringType, BlobType, NullType } from "@elaraai/east";
import type { PlatformFunctionDef } from "@elaraai/east/internal";

/**
 * Platform function to write a Beast2-encoded value to the state store.
 *
 * This is a platform function for the East language, enabling state management
 * in East UI applications. The implementation is provided by the React store
 * in `@elaraai/east-ui-components`.
 *
 * @param key - The string key to write to
 * @param value - The Beast2-encoded blob value
 * @returns Null
 *
 * @example
 * ```ts
 * const updateCount = East.function(
 *     [['state', DictType(StringType, BlobType)]],
 *     NullType,
 *     ($, state) => {
 *         const countBlob = state.get("count");
 *         const count = countBlob.decodeBeast(IntegerType);
 *         $(State.write("count", East.Blob.encodeBeast(count.add(1n))));
 *     }
 * );
 * ```
 */
export const state_write: PlatformFunctionDef<[typeof StringType, typeof BlobType], typeof NullType> =
    East.platform("state_write", [StringType, BlobType], NullType);

/**
 * Platform function to read a Beast2-encoded value from the state store.
 * Returns an empty blob if the key doesn't exist.
 *
 * This is a platform function for the East language, enabling state management
 * in East UI applications. The implementation is provided by the React store
 * in `@elaraai/east-ui-components`.
 *
 * @param key - The string key to read from
 * @returns The Beast2-encoded blob value
 *
 * @example
 * ```ts
 * const readCount = East.function([], IntegerType, ($) => {
 *     const blob = State.read("count");
 *     return blob.decodeBeast(IntegerType);
 * });
 * ```
 */
export const state_read: PlatformFunctionDef<[typeof StringType], typeof BlobType> =
    East.platform("state_read", [StringType], BlobType);

/**
 * Grouped state management platform functions.
 *
 * Provides reactive state operations for East UI programs.
 * The implementation is created by the EastStore in `@elaraai/east-ui-components`.
 *
 * @example
 * ```ts
 * import { East, DictType, StringType, BlobType, IntegerType } from "@elaraai/east";
 * import { State } from "@elaraai/east-ui-platform";
 * import { createEastStore } from "@elaraai/east-ui-components";
 *
 * const counter = East.function(
 *     [['state', DictType(StringType, BlobType)]],
 *     UIComponentType,
 *     ($, state) => {
 *         // Read current count
 *         const countBlob = state.get("count");
 *         const count = countBlob.decodeBeast(IntegerType);
 *
 *         // Write incremented count
 *         $(State.write("count", East.Blob.encodeBeast(count.add(1n))));
 *
 *         return Text.Root(East.str`Count: ${count}`);
 *     }
 * );
 *
 * // Create store and register function
 * const store = createEastStore();
 * store.register("counter", counter.toIR());
 * ```
 */
export const State = {
    /**
     * Writes a Beast2-encoded value to the state store.
     *
     * @param key - The string key to write to
     * @param value - The Beast2-encoded blob value
     * @returns Null
     */
    write: state_write,

    /**
     * Reads a Beast2-encoded value from the state store.
     * Returns an empty blob if the key doesn't exist.
     *
     * @param key - The string key to read from
     * @returns The Beast2-encoded blob value
     */
    read: state_read,
} as const;
