/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

/**
 * East UI State Management Platform
 *
 * Provides reactive state management for East UI applications.
 * State is stored as Beast2-encoded blobs, allowing any East type to be stored.
 *
 * @packageDocumentation
 */

// Platform function signatures (re-exported from @elaraai/east-ui)
export { State, state_read, state_write, state_has } from "@elaraai/east-ui";

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

// React hooks and components
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
