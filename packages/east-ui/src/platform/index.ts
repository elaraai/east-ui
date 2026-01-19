/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

/**
 * Platform functions for East UI state management.
 *
 * @remarks
 * Contains platform function signatures only. For runtime implementations,
 * typed helpers, and store classes, import from `@elaraai/east-ui-components`.
 *
 * @packageDocumentation
 */

// Export platform function signatures
export { state_read, state_write, state_has } from "./state.js";

// Import for grouped exports
import { state_read, state_write, state_has } from "./state.js";

/**
 * State management platform functions for East UI.
 *
 * @remarks
 * Contains platform function signatures only. For implementations,
 * typed helpers, and store access, import from `@elaraai/east-ui-components`.
 *
 * @example
 * ```ts
 * import { East, NullType } from "@elaraai/east";
 * import { State } from "@elaraai/east-ui";
 * import { StateRuntime } from "@elaraai/east-ui-components";
 *
 * const fn = East.function([], NullType, $ => {
 *     $(State.read("key"));
 * });
 *
 * const compiled = fn.toIR().compile(StateRuntime.Implementation);
 * ```
 */
export const State = {
    /**
     * Reads a value from state storage.
     * Returns `none` if key not found, `some(blob)` if found.
     */
    read: state_read,
    /**
     * Writes a value to state storage.
     * Pass `none` as value to delete the key.
     */
    write: state_write,
    /**
     * Checks if a key exists in state storage.
     * Returns boolean indicating existence.
     */
    has: state_has,
} as const;
