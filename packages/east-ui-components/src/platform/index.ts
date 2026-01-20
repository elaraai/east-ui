/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

/**
 * East UI Platform Functions
 *
 * Provides reactive state and dataset management for East UI applications.
 * State is stored as Beast2-encoded blobs, allowing any East type to be stored.
 * Datasets enable reading and writing e3 datasets with reactive updates.
 *
 * @packageDocumentation
 */

// Platform function signatures (re-exported from @elaraai/east-ui)
export {
    // State
    State,
    state_read,
    state_write,
    state_has,
    // Dataset
    Dataset,
    use_dataset_get,
    use_dataset_set,
    use_dataset_has,
    use_dataset_list,
    use_dataset_subscribe,
    DatasetPathSegmentType,
    DatasetPathType,
} from "@elaraai/east-ui";

// Store types and classes
export {
    UIStore,
    createUIStore,
    createUIStore as createEastStore, // Legacy alias
    type UIStoreInterface,
    type UIStoreOptions,
    PersistentUIStore,
    createPersistentUIStore,
} from "./store.js";

// State runtime implementations
export {
    StateImpl,
    getStore,
    initializeStore,
    // Internal tracking functions (used by reactive components)
    enableTracking,
    disableTracking,
    isTracking,
    trackKey,
} from "./state-runtime.js";

// Dataset store types and classes
export {
    DatasetStore,
    createDatasetStore,
    type DatasetStoreInterface,
    type DatasetStoreConfig,
    type DatasetPath,
    type DatasetPathSegment,
    datasetCacheKey,
    datasetPathToString,
} from "./dataset-store.js";

// Dataset runtime implementations
export {
    DatasetImpl,
    getDatasetStore,
    initializeDatasetStore,
    clearDatasetStore,
    // Internal tracking functions (used by reactive components)
    enableDatasetTracking,
    disableDatasetTracking,
    isDatasetTracking,
    trackDatasetPath,
    // Helper functions
    preloadDatasetList,
    clearDatasetListCache,
} from "./dataset-runtime.js";

// Dataset React hooks and components
export {
    // Provider
    DatasetStoreProvider,
    type DatasetStoreProviderProps,

    // Hooks
    useDatasetStore,
    useDatasetStoreSubscription,
    useDatasetKey,
    usePreloadDatasets,
    type DatasetToPreload,
    type PreloadDatasetsResult,
    useDatasetWrite,
    useDatasetHas,

    // Components
    DatasetLoader,
    type DatasetLoaderProps,
} from "./dataset-hooks.js";

// React hooks and components for State
export {
    // Provider
    UIStoreProvider,
    type UIStoreProviderProps,

    // Hooks
    useUIStore,
    useUIStoreSubscription,
    useUIState,
    useUIKey,
    useUIWrite,
    useUIBatch,

    // Components
    EastComponent,
    type EastComponentProps,
    EastFunction,
    type EastFunctionProps,

    // Legacy aliases
    EastStoreProvider,
    useEastStore,
    useEastState,
    useEastKey,
    useEastWrite,
    useEastBatch,
} from "./hooks.js";

// =============================================================================
// StateRuntime Namespace
// =============================================================================

import {
    StateImpl,
    getStore,
    initializeStore,
} from "./state-runtime.js";

/**
 * Runtime implementations for State platform functions.
 *
 * @remarks
 * Provides platform implementations and store access.
 * Use `StateRuntime.Implementation` with `ir.compile()` to enable State operations.
 *
 * @example
 * ```ts
 * import { East, NullType, IntegerType } from "@elaraai/east";
 * import { State } from "@elaraai/east-ui";
 * import { StateRuntime } from "@elaraai/east-ui-components";
 *
 * const fn = East.function([], NullType, $ => {
 *     $(State.write([IntegerType], "counter", 42n));
 * });
 *
 * const compiled = fn.toIR().compile(StateRuntime.Implementation);
 * compiled();
 * ```
 */
export const StateRuntime = {
    /**
     * Platform function implementations for State operations.
     * Pass to `ir.compile()` to enable `State.read`, `State.write`, and `State.has`.
     */
    Implementation: StateImpl,
    /**
     * Returns the singleton store instance.
     * Auto-creates a default `UIStore` if none has been initialized.
     */
    getStore,
    /**
     * Initializes or replaces the singleton store instance.
     * Call before any State operations to use a custom store implementation.
     */
    initializeStore,
} as const;

// =============================================================================
// DatasetRuntime Namespace
// =============================================================================

import {
    DatasetImpl,
    getDatasetStore,
    initializeDatasetStore,
} from "./dataset-runtime.js";

/**
 * Runtime implementations for Dataset platform functions.
 *
 * @remarks
 * Provides platform implementations and store access for e3 datasets.
 * Use `DatasetRuntime.Implementation` with `ir.compile()` to enable Dataset operations.
 *
 * Datasets are reactive - changes trigger re-renders in `Reactive.Root` components
 * that read the dataset, similar to `State` platform functions.
 *
 * @example
 * ```ts
 * import { East, IntegerType, variant } from "@elaraai/east";
 * import { Dataset, Reactive, Text, UIComponentType } from "@elaraai/east-ui";
 * import { DatasetRuntime, StateRuntime } from "@elaraai/east-ui-components";
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
 * // Compile with both State and Dataset implementations
 * const compiled = app.toIR().compile([
 *     ...StateRuntime.Implementation,
 *     ...DatasetRuntime.Implementation,
 * ]);
 * ```
 */
export const DatasetRuntime = {
    /**
     * Platform function implementations for Dataset operations.
     * Pass to `ir.compile()` to enable `Dataset.read`, `Dataset.write`, etc.
     */
    Implementation: DatasetImpl,
    /**
     * Returns the singleton DatasetStore instance.
     * Throws if not initialized - must use DatasetStoreProvider or initializeDatasetStore().
     */
    getStore: getDatasetStore,
    /**
     * Initializes or replaces the singleton DatasetStore instance.
     * In React, prefer using DatasetStoreProvider instead.
     */
    initializeStore: initializeDatasetStore,
} as const;
