/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useRef, useMemo, useSyncExternalStore, useCallback } from "react";
import type { ValueTypeOf } from "@elaraai/east";
import type { UIComponentType } from "@elaraai/east-ui";
import { EastChakraComponent } from "../component.js";
import { enableTracking, disableTracking, getStore } from "../platform/state-runtime.js";
import {
    enableDatasetTracking,
    disableDatasetTracking,
    getDatasetStore,
} from "../platform/dataset-runtime.js";

/**
 * Value type for ReactiveComponent variant.
 */
export interface ReactiveValue {
    render: () => ValueTypeOf<typeof UIComponentType>;
}

/**
 * Try to get the dataset store, returning null if not initialized.
 */
function tryGetDatasetStore() {
    try {
        return getDatasetStore();
    } catch {
        return null;
    }
}

/**
 * Renders a reactive component that re-renders independently when its dependencies change.
 *
 * @remarks
 * This component executes the render function with dependency tracking enabled.
 * It subscribes only to the state and dataset keys that were accessed during rendering,
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
    const stateStore = getStore();
    const datasetStore = tryGetDatasetStore();

    // Track dependencies across renders
    const stateDepsRef = useRef<string[]>([]);
    const datasetDepsRef = useRef<string[]>([]);

    // Execute render with dependency tracking for both state and datasets
    const executeWithTracking = useCallback(() => {
        // Enable tracking for state
        enableTracking();
        // Enable tracking for datasets (only if dataset store is available)
        if (datasetStore) {
            enableDatasetTracking();
        }

        try {
            const result = value.render();
            stateDepsRef.current = disableTracking();
            datasetDepsRef.current = datasetStore ? disableDatasetTracking() : [];
            return result;
        } catch (e) {
            disableTracking();
            if (datasetStore) {
                disableDatasetTracking();
            }
            throw e;
        }
    }, [value, datasetStore]);

    // Subscribe to the keys we depend on (both state and datasets)
    const subscribe = useCallback((cb: () => void) => {
        // Subscribe to state dependencies
        const stateUnsubs = stateDepsRef.current.map(key => stateStore.subscribe(key, cb));

        // Subscribe to dataset dependencies (if dataset store is available)
        const datasetUnsubs = datasetStore
            ? datasetDepsRef.current.map(key => datasetStore.subscribe(key, cb))
            : [];

        return () => {
            stateUnsubs.forEach(fn => fn());
            datasetUnsubs.forEach(fn => fn());
        };
    }, [stateStore, datasetStore]);

    // Snapshot based on our dependencies' versions (both state and datasets)
    const getSnapshot = useCallback(() => {
        const stateSnapshot = stateDepsRef.current
            .map(k => `s:${k}:${stateStore.getKeyVersion(k)}`)
            .join(",");

        const datasetSnapshot = datasetStore
            ? datasetDepsRef.current
                .map(k => `d:${k}:${datasetStore.getKeyVersion(k)}`)
                .join(",")
            : "";

        return `${stateSnapshot}|${datasetSnapshot}`;
    }, [stateStore, datasetStore]);

    // Subscribe and get snapshot
    const snapshot = useSyncExternalStore(subscribe, getSnapshot);

    // Execute render function with tracking
    // snapshot is intentionally included to trigger re-renders when dependencies change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const result = useMemo(() => executeWithTracking(), [executeWithTracking, snapshot]);

    if (result === undefined || result === null) {
        return null;
    }

    return <EastChakraComponent value={result} />;
}
