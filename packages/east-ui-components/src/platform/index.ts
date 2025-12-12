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

// Platform (re-exported from @elaraai/east-ui)
export { State } from "@elaraai/east-ui";

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
