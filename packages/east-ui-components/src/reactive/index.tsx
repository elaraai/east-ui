/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useRef, useMemo, useSyncExternalStore, useCallback } from "react";
import { State, enableTracking, disableTracking } from "@elaraai/east-ui";
import type { ValueTypeOf } from "@elaraai/east";
import type { UIComponentType } from "@elaraai/east-ui";
import { EastChakraComponent } from "../component.js";

/**
 * Value type for ReactiveComponent variant.
 */
export interface ReactiveValue {
    render: () => ValueTypeOf<typeof UIComponentType>;
}

/**
 * Renders a reactive component that re-renders independently when its dependencies change.
 *
 * @remarks
 * This component executes the render function with dependency tracking enabled.
 * It subscribes only to the state keys that were accessed during rendering,
 * enabling selective re-rendering when those specific keys change.
 *
 * The render function must be a "free function" with no captures from parent
 * East scope - this is validated at build time by `Reactive.Root`.
 *
 * @param value - The ReactiveComponent value containing the render function
 * @returns The rendered child component
 *
 * @example
 * ```tsx
 * // In East code:
 * Reactive.Root($ => {
 *     const count = $(State.readTyped("counter", IntegerType)());
 *     return Text.Root(East.str`Count: ${count.unwrap("some")}`);
 * })
 *
 * // Renders as:
 * <EastReactiveComponent value={{ render: compiledRenderFn }} />
 * ```
 */
export function EastReactiveComponent({ value }: { value: ReactiveValue }) {
    const store = State.store;

    // Track dependencies across renders
    const depsRef = useRef<string[]>([]);

    // Execute render with dependency tracking
    const executeWithTracking = useCallback(() => {
        enableTracking();
        try {
            const result = value.render();
            depsRef.current = disableTracking();
            return result;
        } catch (e) {
            disableTracking();
            throw e;
        }
    }, [value.render]);

    // Subscribe to the keys we depend on
    const subscribe = useCallback((cb: () => void) => {
        // Subscribe to all current dependencies
        const unsubs = depsRef.current.map(key => store.subscribe(key, cb));
        return () => unsubs.forEach(fn => fn());
    }, [store]);

    // Snapshot based on our dependencies' versions
    const getSnapshot = useCallback(() => {
        return depsRef.current
            .map(k => `${k}:${store.getKeyVersion(k)}`)
            .join(",");
    }, [store]);

    // Subscribe and get snapshot
    const snapshot = useSyncExternalStore(subscribe, getSnapshot);

    // Execute render function with tracking
    // Re-runs when snapshot changes (i.e., when dependencies change)
    const result = useMemo(() => executeWithTracking(), [executeWithTracking, snapshot]);

    if (result === undefined || result === null) {
        return null;
    }

    return <EastChakraComponent value={result} />;
}
