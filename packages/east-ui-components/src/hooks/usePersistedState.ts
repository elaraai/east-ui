/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import useLocalStorageState from "use-local-storage-state";

export interface PersistedStateResult<T> {
    state: T;
    setState: (updater: T | ((prev: T) => T)) => void;
    removeState: () => void;
    isPersistent: boolean;
}

/**
 * Hook that provides persisted state via localStorage.
 * Designed for consolidated state objects — one localStorage key per component instance.
 */
export function usePersistedState<T>(
    storageKey: string,
    defaultValue: T,
): PersistedStateResult<T> {
    const [state, setState, { removeItem, isPersistent }] = useLocalStorageState<T>(storageKey, {
        defaultValue,
    });

    return { state, setState, removeState: removeItem, isPersistent };
}
