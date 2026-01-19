/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

/**
 * Runtime implementations for State platform functions.
 *
 * @remarks
 * This module contains all runtime implementations for state management:
 * - Platform function implementations (StateImpl)
 * - Singleton store management (getStore, initializeStore)
 * - Reactive dependency tracking (enableTracking, disableTracking, etc.)
 *
 * @packageDocumentation
 */

import {
    type EastTypeValue,
    encodeBeast2For,
    decodeBeast2For,
} from "@elaraai/east";
import { type PlatformFunction } from "@elaraai/east/internal";
import { state_read, state_write, state_has } from "@elaraai/east-ui";
import { UIStore, type UIStoreInterface } from "./store.js";

// =============================================================================
// Singleton Store
// =============================================================================

let _store: UIStoreInterface | null = null;

/**
 * Returns the singleton store instance used by State platform functions.
 *
 * @returns The current `UIStoreInterface` instance
 *
 * @remarks
 * Auto-creates a default `UIStore` if none has been initialized.
 * Call `initializeStore()` before this to use a custom store implementation.
 */
export function getStore(): UIStoreInterface {
    if (!_store) {
        // Auto-create default store for convenience
        _store = new UIStore();
    }
    return _store;
}

/**
 * Initializes or replaces the singleton store used by State platform functions.
 *
 * @param store - The store instance to use for all State operations
 *
 * @remarks
 * Call this before any State operations to use a custom store implementation
 * such as `PersistentUIStore` or a custom `UIStoreInterface` implementation.
 */
export function initializeStore(store: UIStoreInterface): void {
    _store = store;
}

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
// Platform Implementation
// =============================================================================

/**
 * Platform function implementations for State operations.
 *
 * @remarks
 * Pass this array to `ir.compile()` to enable `State.read`, `State.write`, and `State.has`
 * platform functions. The implementations use the singleton store from `getStore()`.
 *
 * @example
 * ```ts
 * import { State } from "@elaraai/east-ui";
 * import { StateImpl } from "@elaraai/east-ui-components";
 *
 * const fn = East.function([], BooleanType, $ => State.has("myKey"));
 * const compiled = fn.toIR().compile(StateImpl);
 * const exists = compiled(); // false (key doesn't exist yet)
 * ```
 */
export const StateImpl: PlatformFunction[] = [
    state_write.implement((type: EastTypeValue) => (key: unknown, value: unknown) => {
        // return (fn as (v: unknown) => unknown)(value);
        const encode = encodeBeast2For(type)
        getStore().write(key as string, encode(value));
        return null
    }),
    state_read.implement((type: EastTypeValue) => (key: unknown) => {
        trackKey(key as string)
        // return (fn as (v: unknown) => unknown)(value);
        const decode = decodeBeast2For(type)
        const ret = getStore().read(key as string);
        if (ret === undefined) {
            throw new Error(`Key not found: ${key as string}`);
        }
        return decode(ret);
    }),
    state_has.implement((key) => {
        return getStore().has(key);
    }),
];
