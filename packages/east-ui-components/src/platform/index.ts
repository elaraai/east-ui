/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

/**
 * East UI State Management Platform
 *
 * Provides reactive state management for East UI applications.
 * State is stored as Beast2-encoded blobs, allowing any East type to be stored.
 *
 * @packageDocumentation
 */

// Platform functions (re-exported from @elaraai/east-ui-platform)
export { State, state_write, state_read } from "@elaraai/east-ui-platform";

// Store
export { EastStore, createEastStore, type EastStoreOptions } from "./store.js";

// React hooks
export {
    EastStoreProvider,
    EastFunction,
    useEastStore,
    useEastState,
    useEastKey,
    useEastWrite,
    useEastBatch,
    type EastStoreProviderProps,
    type EastFunctionProps,
} from "./hooks.js";
