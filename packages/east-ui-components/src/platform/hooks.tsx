/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useCallback,
    useSyncExternalStore,
    type ReactNode,
} from "react";
import { State, type UIStoreInterface, UIComponentType } from "@elaraai/east-ui";
import { EastChakraComponent } from "../component.js";
import type { EastIR, ValueTypeOf } from "@elaraai/east";
import { OverlayImpl } from "../overlays/overlay-manager.js";
import { Alert, Box, Code, Text, Stack } from "@chakra-ui/react";

// Configure the singleton store to use queueMicrotask for deferred notifications.
// This avoids "setState during render" errors in React.
State.store.setScheduler((notify) => queueMicrotask(notify));

/**
 * React context for the UI store.
 */
const UIStoreContext = createContext<UIStoreInterface | null>(null);

/**
 * Props for the UIStoreProvider component.
 */
export interface UIStoreProviderProps {
    /**
     * Custom store instance. If not provided, uses State.store singleton.
     * Use PersistentUIStore for IndexedDB persistence.
     */
    store?: UIStoreInterface;
    /** Child components */
    children: ReactNode;
}

/**
 * Provides a UI store to the component tree.
 *
 * @remarks
 * By default uses the singleton `State.store` from east-ui.
 * For persistence, pass a `PersistentUIStore` instance.
 *
 * @example
 * ```tsx
 * import { UIStoreProvider } from "@elaraai/east-ui-components";
 *
 * // Use default singleton store
 * function App() {
 *     return (
 *         <UIStoreProvider>
 *             <MyComponent />
 *         </UIStoreProvider>
 *     );
 * }
 *
 * // With persistence
 * import { PersistentUIStore } from "@elaraai/east-ui-components";
 *
 * const persistentStore = new PersistentUIStore("my_app");
 * await persistentStore.hydrate();
 *
 * function App() {
 *     return (
 *         <UIStoreProvider store={persistentStore}>
 *             <MyComponent />
 *         </UIStoreProvider>
 *     );
 * }
 * ```
 */
export function UIStoreProvider({ store, children }: UIStoreProviderProps) {
    const storeInstance = store ?? State.store;

    // Expose store for debugging
    useEffect(() => {
        if (typeof window !== "undefined") {
            (window as unknown as Record<string, unknown>).__EAST_UI_STORE__ = storeInstance;
        }
        return () => {
            if (typeof window !== "undefined") {
                delete (window as unknown as Record<string, unknown>).__EAST_UI_STORE__;
            }
        };
    }, [storeInstance]);

    return (
        <UIStoreContext.Provider value={storeInstance}>
            {children}
        </UIStoreContext.Provider>
    );
}

/**
 * Hook to access the UI store from context.
 *
 * @returns The UIStore instance
 * @throws Error if used outside of a UIStoreProvider
 */
export function useUIStore(): UIStoreInterface {
    const store = useContext(UIStoreContext);
    if (!store) {
        throw new Error("useUIStore must be used within a UIStoreProvider");
    }
    return store;
}

/**
 * Hook to subscribe to store changes using React 18's useSyncExternalStore.
 *
 * @param store - The store to subscribe to
 * @returns The current snapshot version
 */
export function useUIStoreSubscription(store: UIStoreInterface): number {
    const subscribe = useCallback((cb: () => void) => store.subscribe(cb), [store]);
    const getSnapshot = useCallback(() => store.getSnapshot(), [store]);

    return useSyncExternalStore(subscribe, getSnapshot);
}

/**
 * Props for the EastComponent component.
 */
export interface EastComponentProps {
    /** The compiled East function that returns UI component data */
    render: () => ValueTypeOf<UIComponentType>;
}

/**
 * Renders an East UI component once without subscribing to state changes.
 *
 * @remarks
 * Pass a compiled East function that returns UIComponentType data.
 * This component renders once and does NOT re-render on state changes.
 * For reactive behavior, use `Reactive.Root` within your East function.
 *
 * @example
 * ```tsx
 * import { East, IntegerType, NullType, some } from "@elaraai/east";
 * import { State, Button, Reactive, UIComponentType } from "@elaraai/east-ui";
 * import { EastComponent, UIStoreProvider } from "@elaraai/east-ui-components";
 *
 * // Define an East function with reactive parts
 * const counter = East.function([], UIComponentType, $ => {
 *     // Wrap reactive parts in Reactive.Root
 *     return Reactive.Root($ => {
 *         const count = $(State.readTyped("counter", IntegerType)());
 *         return Button.Root(East.str`Count: ${count.unwrap("some")}`, {
 *             onClick: East.function([], NullType, $ => {
 *                 const current = $(State.readTyped("counter", IntegerType)());
 *                 $(State.writeTyped("counter", some(current.unwrap("some").add(1n)), IntegerType)());
 *             })
 *         });
 *     });
 * });
 *
 * // Compile with State.Implementation
 * const compiled = counter.toIR().compile(State.Implementation);
 *
 * function App() {
 *     return (
 *         <UIStoreProvider>
 *             <EastComponent render={compiled} />
 *         </UIStoreProvider>
 *     );
 * }
 * ```
 */
export function EastComponent({ render }: EastComponentProps) {
    // Render once - no state subscription
    // For reactivity, use Reactive.Root within the East function
    const result = useMemo(() => render(), [render]);

    if (result === undefined || result === null) {
        return null;
    }

    // Result should be UI component data - render it
    return <EastChakraComponent value={result} />;
}

/**
 * Props for the EastFunction component.
 */
export interface EastFunctionProps {
    /**
     * The IR (intermediate representation) from calling `.toIR()` on an East function.
     */
    ir: EastIR<[], UIComponentType>;
}

/**
 * Renders a compiled East function that returns a UI component.
 *
 * @remarks
 * This component takes an IR (intermediate representation) from an East function,
 * compiles it with the State.Implementation platform, and renders the result.
 * The compilation happens once on mount.
 *
 * This component renders once and does NOT re-render on state changes.
 * For reactive behavior, use `Reactive.Root` within your East function.
 *
 * @example
 * ```tsx
 * import { East } from "@elaraai/east";
 * import { EastFunction } from "@elaraai/east-ui-components";
 * import { Button, Reactive, UIComponentType } from "@elaraai/east-ui";
 *
 * // Define the UI function with reactive parts
 * const myUI = East.function([], UIComponentType, $ => {
 *     return Reactive.Root($ => {
 *         return Button.Root("Click me");
 *     });
 * });
 *
 * // Pre-compile IR at module load time for performance
 * const myUIIR = myUI.toIR();
 *
 * function App() {
 *     return <EastFunction ir={myUIIR} />;
 * }
 * ```
 */
export function EastFunction({ ir }: EastFunctionProps) {
    // Compile IR with State.Implementation and OverlayImpl once on mount, with error handling
    const result = useMemo(() => {
        try {
            return { compiled: ir.compile([...State.Implementation, ...OverlayImpl]), error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            const errorStack = err instanceof Error ? err.stack : undefined;
            return { compiled: null, error: { message: errorMessage, stack: errorStack } };
        }
    }, [ir]);

    // Show error alert if compilation failed
    if (result.error) {
        return (
            <Alert.Root status="error">
                <Alert.Indicator />
                <Stack gap="2" flex="1">
                    <Alert.Title>East Compilation Error</Alert.Title>
                    <Alert.Description>
                        <Box>
                            <Text fontWeight="medium">{result.error.message}</Text>
                            {result.error.stack && (
                                <Code
                                    display="block"
                                    whiteSpace="pre-wrap"
                                    fontSize="xs"
                                    mt="2"
                                    p="2"
                                    bg="red.50"
                                    _dark={{ bg: "red.900" }}
                                    borderRadius="md"
                                    maxHeight="200px"
                                    overflow="auto"
                                >
                                    {result.error.stack}
                                </Code>
                            )}
                        </Box>
                    </Alert.Description>
                </Stack>
            </Alert.Root>
        );
    }

    return <EastComponent render={result.compiled!} />;
}

/**
 * Hook to subscribe to all state changes and get the current state.
 *
 * @returns The current state as a Map
 *
 * @example
 * ```tsx
 * function StateDebugger() {
 *     const state = useUIState();
 *     return <pre>{JSON.stringify([...state.entries()], null, 2)}</pre>;
 * }
 * ```
 */
export function useUIState(): Map<string, Uint8Array> {
    const store = useUIStore();
    useUIStoreSubscription(store);
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
 *     const countBlob = useUIKey("count");
 *     // Decode the blob in your component or pass to East code
 *     return <div>Count blob: {countBlob?.length ?? 0} bytes</div>;
 * }
 * ```
 */
export function useUIKey(key: string): Uint8Array | undefined {
    const store = useUIStore();

    const subscribe = useCallback(
        (cb: () => void) => store.subscribe(key, cb),
        [store, key]
    );
    const getSnapshot = useCallback(() => store.read(key), [store, key]);

    return useSyncExternalStore(subscribe, getSnapshot);
}

/**
 * Hook to get a function to write to the store from React code.
 *
 * @returns A write function
 *
 * @example
 * ```tsx
 * import { encodeBeast2For } from "@elaraai/east/internal";
 * import { IntegerType } from "@elaraai/east";
 *
 * function ResetButton() {
 *     const write = useUIWrite();
 *     const handleReset = () => {
 *         write("count", encodeBeast2For(IntegerType)(0n));
 *     };
 *     return <button onClick={handleReset}>Reset</button>;
 * }
 * ```
 */
export function useUIWrite(): (key: string, value: Uint8Array | undefined) => void {
    const store = useUIStore();
    return useCallback(
        (key: string, value: Uint8Array | undefined) => store.write(key, value),
        [store]
    );
}

/**
 * Hook to get a batch function for grouping multiple writes.
 *
 * @returns A batch function
 *
 * @example
 * ```tsx
 * function MultiUpdate() {
 *     const batch = useUIBatch();
 *     const write = useUIWrite();
 *
 *     const handleUpdate = () => {
 *         batch(() => {
 *             write("a", encodeBeast2For(IntegerType)(1n));
 *             write("b", encodeBeast2For(IntegerType)(2n));
 *             write("c", encodeBeast2For(IntegerType)(3n));
 *         });
 *         // All writes processed, single re-render
 *     };
 *
 *     return <button onClick={handleUpdate}>Update All</button>;
 * }
 * ```
 */
export function useUIBatch(): <T>(fn: () => T) => T {
    const store = useUIStore();
    return useCallback(<T,>(fn: () => T) => store.batch(fn), [store]);
}

// Legacy aliases for backwards compatibility
export { UIStoreProvider as EastStoreProvider };
export { useUIStore as useEastStore };
export { useUIState as useEastState };
export { useUIKey as useEastKey };
export { useUIWrite as useEastWrite };
export { useUIBatch as useEastBatch };
