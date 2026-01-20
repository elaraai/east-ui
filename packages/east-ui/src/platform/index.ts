/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

/**
 * Platform functions for East UI state and dataset management.
 *
 * @remarks
 * Contains platform function signatures only. For runtime implementations,
 * typed helpers, and store classes, import from `@elaraai/east-ui-components`.
 *
 * @packageDocumentation
 */

// Export state platform function signatures
export { state_read, state_write, state_has } from "./state.js";

// Export dataset platform function signatures and types
export {
    use_dataset_get,
    use_dataset_set,
    use_dataset_has,
    use_dataset_list,
    use_dataset_subscribe,
    DatasetPathSegmentType,
    DatasetPathType,
} from "./dataset.js";

// Import for grouped exports
import { state_read, state_write, state_has } from "./state.js";
import {
    use_dataset_get,
    use_dataset_set,
    use_dataset_has,
    use_dataset_list,
    use_dataset_subscribe,
} from "./dataset.js";

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

/**
 * Dataset platform functions for reading/writing e3 datasets.
 *
 * @remarks
 * Contains platform function signatures only. For implementations
 * and store access, import from `@elaraai/east-ui-components`.
 *
 * Datasets are reactive - changes trigger re-renders in `Reactive.Root` components
 * that read the dataset, similar to `State` platform functions.
 *
 * @example
 * ```ts
 * import { East, IntegerType, variant } from "@elaraai/east";
 * import { Dataset, Reactive, Text, UIComponentType } from "@elaraai/east-ui";
 * import { DatasetRuntime } from "@elaraai/east-ui-components";
 *
 * const app = East.function([], UIComponentType, $ => {
 *     return Reactive.Root($ => {
 *         const count = $.let(Dataset.get(
 *             [IntegerType],
 *             "production",
 *             [variant("field", "inputs"), variant("field", "count")]
 *         ));
 *         return Text.Root(East.str`Count: ${count}`);
 *     });
 * });
 *
 * const compiled = app.toIR().compile(DatasetRuntime.Implementation);
 * ```
 */
export const Dataset = {
    /**
     * Reads a typed value from an e3 dataset.
     * Tracks access for reactive updates within `Reactive.Root`.
     */
    get: use_dataset_get,
    /**
     * Writes a typed value to an e3 dataset.
     * Triggers re-renders in reactive components that read the dataset.
     */
    set: use_dataset_set,
    /**
     * Checks if a dataset exists and has a value.
     */
    has: use_dataset_has,
    /**
     * Lists field names at a dataset path.
     */
    list: use_dataset_list,
    /**
     * Subscribes to dataset changes with polling.
     * Useful for datasets updated by external processes.
     */
    subscribe: use_dataset_subscribe,
} as const;
