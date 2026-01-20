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
    // ReactiveDataset
    ReactiveDataset,
    Dataset, // deprecated alias
    reactive_dataset_get,
    reactive_dataset_set,
    reactive_dataset_has,
    reactive_dataset_list,
    reactive_dataset_subscribe,
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

// ReactiveDataset cache types and classes
export {
    ReactiveDatasetCache,
    createReactiveDatasetCache,
    type ReactiveDatasetCacheInterface,
    type ReactiveDatasetCacheConfig,
    // Deprecated aliases
    DatasetStore,
    createDatasetStore,
    type DatasetStoreInterface,
    type DatasetStoreConfig,
    // Shared types
    type DatasetPath,
    type DatasetPathSegment,
    datasetCacheKey,
    datasetPathToString,
} from "./dataset-store.js";

// ReactiveDataset runtime implementations
export {
    ReactiveDatasetPlatform,
    getReactiveDatasetCache,
    initializeReactiveDatasetCache,
    clearReactiveDatasetCache,
    // Deprecated aliases
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
    preloadReactiveDatasetList,
    clearReactiveDatasetListCache,
    // Deprecated aliases
    preloadDatasetList,
    clearDatasetListCache,
} from "./dataset-runtime.js";

// ReactiveDataset React hooks and components
export {
    // Provider
    ReactiveDatasetProvider,
    type ReactiveDatasetProviderProps,
    // Deprecated aliases
    DatasetStoreProvider,
    type DatasetStoreProviderProps,

    // Hooks
    useReactiveDatasetCache,
    useReactiveDatasetCacheSubscription,
    useReactiveDatasetKey,
    usePreloadReactiveDatasets,
    type ReactiveDatasetToPreload,
    type PreloadReactiveDatasetsResult,
    useReactiveDatasetWrite,
    useReactiveDatasetHas,
    // Deprecated aliases
    useDatasetStore,
    useDatasetStoreSubscription,
    useDatasetKey,
    usePreloadDatasets,
    type DatasetToPreload,
    type PreloadDatasetsResult,
    useDatasetWrite,
    useDatasetHas,

    // Components
    ReactiveDatasetLoader,
    type ReactiveDatasetLoaderProps,
    // Deprecated aliases
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
// ReactiveDatasetRuntime Namespace
// =============================================================================

import {
    ReactiveDatasetPlatform,
    getReactiveDatasetCache,
    initializeReactiveDatasetCache,
} from "./dataset-runtime.js";

/**
 * Runtime implementations for ReactiveDataset platform functions.
 *
 * @remarks
 * Provides platform implementations and cache access for reactive e3 datasets.
 * Use `ReactiveDatasetRuntime.Implementation` with `ir.compile()` to enable
 * ReactiveDataset operations.
 *
 * ReactiveDataset enables reactive data binding to e3 datasets. Changes trigger
 * re-renders in `Reactive.Root` components that read the dataset, similar to
 * `State` platform functions.
 *
 * This differs from the raw `@elaraai/e3-api-client` dataset functions which
 * are for direct API calls without reactive binding or caching.
 *
 * @example
 * ```ts
 * import { East, IntegerType, variant } from "@elaraai/east";
 * import { ReactiveDataset, Reactive, Text, UIComponentType } from "@elaraai/east-ui";
 * import { ReactiveDatasetRuntime, StateRuntime } from "@elaraai/east-ui-components";
 *
 * const app = East.function([], UIComponentType, $ => {
 *     return Reactive.Root($ => {
 *         const count = $.let(ReactiveDataset.get(
 *             [IntegerType],
 *             "production",
 *             [variant("field", "inputs"), variant("field", "count")]
 *         ));
 *         return Text.Root(East.str`Count: ${count}`);
 *     });
 * });
 *
 * // Compile with both State and ReactiveDataset implementations
 * const compiled = app.toIR().compile([
 *     ...StateRuntime.Implementation,
 *     ...ReactiveDatasetRuntime.Implementation,
 * ]);
 * ```
 */
export const ReactiveDatasetRuntime = {
    /**
     * Platform function implementations for ReactiveDataset operations.
     * Pass to `ir.compile()` to enable `ReactiveDataset.get`, `ReactiveDataset.set`, etc.
     */
    Implementation: ReactiveDatasetPlatform,
    /**
     * Returns the singleton ReactiveDatasetCache instance.
     * Throws if not initialized - must use ReactiveDatasetProvider or initializeReactiveDatasetCache().
     */
    getCache: getReactiveDatasetCache,
    /**
     * Initializes or replaces the singleton ReactiveDatasetCache instance.
     * In React, prefer using ReactiveDatasetProvider instead.
     */
    initializeCache: initializeReactiveDatasetCache,
} as const;

/**
 * @deprecated Use `ReactiveDatasetRuntime` instead.
 */
export const DatasetRuntime = ReactiveDatasetRuntime;
