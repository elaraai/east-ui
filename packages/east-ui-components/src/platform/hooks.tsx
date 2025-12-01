/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    type ReactNode,
} from "react";
import { IRType, BlobType, encodeBeast2For, printFor, type EastIR } from "@elaraai/east";
import { EastStore } from "./store.js";
import { EastChakraComponent } from "../component.js";

// Encoder for IR values - used to create content-based hash
const encodeIR = encodeBeast2For(IRType);
// Printer for blobs - used as the hash key
const printBlob = printFor(BlobType);

/**
 * React context for the EastStore.
 */
const EastStoreContext = createContext<EastStore | null>(null);

/**
 * Props for the EastStoreProvider component.
 */
export interface EastStoreProviderProps {
    /** The EastStore instance to provide */
    store: EastStore;
    /** Child components */
    children: ReactNode;
}

/**
 * Provides an EastStore to the component tree.
 *
 * @example
 * ```tsx
 * const store = createEastStore();
 * store.register("dashboard", dashboardFn.toIR());
 *
 * function App() {
 *     return (
 *         <EastStoreProvider store={store}>
 *             <EastFunction id="dashboard" />
 *         </EastStoreProvider>
 *     );
 * }
 * ```
 */
export function EastStoreProvider({ store, children }: EastStoreProviderProps) {
    return (
        <EastStoreContext.Provider value={store}>
            {children}
        </EastStoreContext.Provider>
    );
}

/**
 * Hook to access the EastStore from context.
 *
 * @returns The EastStore instance
 * @throws Error if used outside of an EastStoreProvider
 */
export function useEastStore(): EastStore {
    const store = useContext(EastStoreContext);
    if (!store) {
        throw new Error("useEastStore must be used within an EastStoreProvider");
    }
    return store;
}

/**
 * Props for the EastFunction component.
 */
export interface EastFunctionProps {
    /** The East IR to compile and render */
    ir: EastIR<[Map<string, Uint8Array>], any>;
}

/**
 * Renders an East function that takes state and returns a UI component.
 * Automatically registers the function and re-renders when state changes.
 *
 * The function is identified by a content-based hash of its IR,
 * so the same function can be used in multiple places without
 * manual ID management.
 *
 * @example
 * ```tsx
 * const counter = East.function(
 *     [DictType(StringType, BlobType)],
 *     UIComponentType,
 *     ($, state) => {
 *         const count = state.get("count").decodeBeast(IntegerType, "v2");
 *         return Text.Root(East.str`Count: ${count}`);
 *     }
 * );
 *
 * // Use directly - no manual registration needed
 * <EastFunction ir={counter.toIR()} />
 * ```
 */
export function EastFunction({ ir }: EastFunctionProps) {
    const store = useEastStore();
    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    // Create a content-based hash of the IR for registration
    const id = useMemo(() => {
        const encoded = encodeIR(ir.ir);
        return printBlob(encoded);
    }, [ir]);

    // Register the function if not already registered
    useMemo(() => {
        if (store.getResult(id) === undefined) {
            store.register(id, ir);
        }
    }, [store, id, ir]);

    useEffect(() => {
        return store.subscribe(forceUpdate);
    }, [store]);

    const result = store.getResult(id);

    if (result === undefined) {
        return null;
    }

    // Result should be a UI component value - render it
    return <EastChakraComponent value={result} />;
}

/**
 * Hook to subscribe to all state changes and get the current state.
 *
 * @returns The current state as a Map
 *
 * @example
 * ```tsx
 * function StateDebugger() {
 *     const state = useEastState();
 *     return <pre>{JSON.stringify([...state.entries()], null, 2)}</pre>;
 * }
 * ```
 */
export function useEastState(): Map<string, Uint8Array> {
    const store = useEastStore();
    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    useEffect(() => {
        return store.subscribe(forceUpdate);
    }, [store]);

    return store.getState();
}

/**
 * Hook to subscribe to a specific key and get its value.
 *
 * @param key - The key to subscribe to
 * @returns The Beast2-encoded blob value, or undefined if not set
 *
 * @example
 * ```tsx
 * function CountDisplay() {
 *     const countBlob = useEastKey("count");
 *     // Decode the blob in your component or pass to East code
 *     return <div>Count blob: {countBlob?.length ?? 0} bytes</div>;
 * }
 * ```
 */
export function useEastKey(key: string): Uint8Array | undefined {
    const store = useEastStore();
    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    useEffect(() => {
        return store.subscribe(key, forceUpdate);
    }, [store, key]);

    const value = store.read(key);
    return value.length > 0 ? value : undefined;
}

/**
 * Hook to get a function to write to the store from React code.
 *
 * @returns A write function
 *
 * @example
 * ```tsx
 * function ResetButton() {
 *     const write = useEastWrite();
 *     const handleReset = () => {
 *         write("count", encodeBeast2(0n));
 *     };
 *     return <button onClick={handleReset}>Reset</button>;
 * }
 * ```
 */
export function useEastWrite(): (key: string, value: Uint8Array) => void {
    const store = useEastStore();
    return (key: string, value: Uint8Array) => store.write(key, value);
}

/**
 * Hook to get a batch function for grouping multiple writes.
 *
 * @returns A batch function
 *
 * @example
 * ```tsx
 * function MultiUpdate() {
 *     const batch = useEastBatch();
 *     const write = useEastWrite();
 *
 *     const handleUpdate = () => {
 *         batch(() => {
 *             write("a", encodeBeast2(1n));
 *             write("b", encodeBeast2(2n));
 *             write("c", encodeBeast2(3n));
 *         });
 *         // All writes processed, single re-render
 *     };
 *
 *     return <button onClick={handleUpdate}>Update All</button>;
 * }
 * ```
 */
export function useEastBatch(): <T>(fn: () => T) => T {
    const store = useEastStore();
    return <T,>(fn: () => T) => store.batch(fn);
}
