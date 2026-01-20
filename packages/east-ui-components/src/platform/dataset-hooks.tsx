/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

/**
 * React hooks and provider for Dataset platform functions.
 *
 * @packageDocumentation
 */

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useCallback,
    useState,
    useSyncExternalStore,
    type ReactNode,
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    DatasetStore,
    type DatasetStoreInterface,
    type DatasetStoreConfig,
    type DatasetPath,
    datasetCacheKey,
} from "./dataset-store.js";
import {
    initializeDatasetStore,
    clearDatasetStore,
} from "./dataset-runtime.js";

// =============================================================================
// Context
// =============================================================================

const DatasetStoreContext = createContext<DatasetStoreInterface | null>(null);

/**
 * Props for the DatasetStoreProvider component.
 */
export interface DatasetStoreProviderProps {
    /** Child components */
    children: ReactNode;
    /** Configuration for the dataset store */
    config: DatasetStoreConfig;
    /** Optional external QueryClient (if not provided, one will be created) */
    queryClient?: QueryClient;
}

/**
 * Provides a DatasetStore to the component tree.
 *
 * @remarks
 * Sets up TanStack Query and DatasetStore for dataset operations.
 * Also configures the store's scheduler to use `queueMicrotask` for deferred
 * notifications, avoiding "setState during render" errors in React.
 *
 * @example
 * ```tsx
 * import { DatasetStoreProvider } from "@elaraai/east-ui-components";
 *
 * function App() {
 *     return (
 *         <DatasetStoreProvider config={{ apiUrl: "http://localhost:3000", token: "..." }}>
 *             <MyComponent />
 *         </DatasetStoreProvider>
 *     );
 * }
 * ```
 */
export function DatasetStoreProvider({
    children,
    config,
    queryClient: externalQueryClient,
}: DatasetStoreProviderProps) {
    // Create or use provided QueryClient
    const queryClient = useMemo(
        () =>
            externalQueryClient ??
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: 2,
                        staleTime: config.staleTime ?? 30000,
                    },
                },
            }),
        [externalQueryClient, config.staleTime]
    );

    // Create DatasetStore
    const store = useMemo(
        () => new DatasetStore(queryClient, config),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [queryClient, config.apiUrl, config.repo, config.token, config.staleTime]
    );

    // Set global store reference and configure scheduler
    useEffect(() => {
        initializeDatasetStore(store);

        // Configure deferred notifications
        store.setScheduler((notify) => queueMicrotask(notify));

        return () => {
            store.destroy();
            clearDatasetStore();
        };
    }, [store]);

    // Expose store for debugging
    useEffect(() => {
        if (typeof window !== "undefined") {
            (window as unknown as Record<string, unknown>).__EAST_DATASET_STORE__ = store;
        }
        return () => {
            if (typeof window !== "undefined") {
                delete (window as unknown as Record<string, unknown>).__EAST_DATASET_STORE__;
            }
        };
    }, [store]);

    return (
        <QueryClientProvider client={queryClient}>
            <DatasetStoreContext.Provider value={store}>
                {children}
            </DatasetStoreContext.Provider>
        </QueryClientProvider>
    );
}

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to access the DatasetStore from context.
 *
 * @returns The DatasetStore instance
 * @throws Error if used outside of a DatasetStoreProvider
 */
export function useDatasetStore(): DatasetStoreInterface {
    const store = useContext(DatasetStoreContext);
    if (!store) {
        throw new Error("useDatasetStore must be used within a DatasetStoreProvider");
    }
    return store;
}

/**
 * Hook to subscribe to dataset store changes using React 18's useSyncExternalStore.
 *
 * @returns The current snapshot version
 */
export function useDatasetStoreSubscription(): number {
    const store = useDatasetStore();
    const subscribe = useCallback((cb: () => void) => store.subscribe(cb), [store]);
    const getSnapshot = useCallback(() => store.getSnapshot(), [store]);

    return useSyncExternalStore(subscribe, getSnapshot);
}

/**
 * Hook to subscribe to a specific dataset key.
 *
 * @param workspace - The workspace name
 * @param path - The dataset path
 * @returns The cached value, or undefined if not loaded
 */
export function useDatasetKey(workspace: string, path: DatasetPath): Uint8Array | undefined {
    const store = useDatasetStore();
    const key = datasetCacheKey(workspace, path);

    const subscribe = useCallback(
        (cb: () => void) => store.subscribe(key, cb),
        [store, key]
    );
    const getSnapshot = useCallback(
        () => store.read(workspace, path),
        [store, workspace, path]
    );

    return useSyncExternalStore(subscribe, getSnapshot);
}

/**
 * Dataset to preload.
 */
export interface DatasetToPreload {
    workspace: string;
    path: DatasetPath;
}

/**
 * Result of usePreloadDatasets hook.
 */
export interface PreloadDatasetsResult {
    /** True while preloading */
    loading: boolean;
    /** Error if preloading failed */
    error: Error | null;
    /** Reload all datasets */
    reload: () => void;
}

/**
 * Hook to preload datasets before rendering.
 *
 * @param datasets - Array of datasets to preload
 * @returns Loading state and error
 *
 * @example
 * ```tsx
 * import { variant } from "@elaraai/east";
 *
 * function MyComponent() {
 *     const { loading, error } = usePreloadDatasets([
 *         { workspace: "production", path: [variant("field", "inputs"), variant("field", "config")] },
 *         { workspace: "production", path: [variant("field", "data")] },
 *     ]);
 *
 *     if (loading) return <Spinner />;
 *     if (error) return <ErrorMessage error={error} />;
 *
 *     return <EastComponent render={myApp} />;
 * }
 * ```
 */
export function usePreloadDatasets(datasets: DatasetToPreload[]): PreloadDatasetsResult {
    const store = useDatasetStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    // Create stable key for the datasets array
    const datasetsKey = useMemo(
        () => datasets.map(d => datasetCacheKey(d.workspace, d.path)).join("|"),
        [datasets]
    );

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        Promise.all(
            datasets.map(({ workspace, path }) => store.preload(workspace, path))
        )
            .then(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err instanceof Error ? err : new Error(String(err)));
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store, datasetsKey, reloadTrigger]);

    const reload = useCallback(() => {
        setReloadTrigger(t => t + 1);
    }, []);

    return { loading, error, reload };
}

/**
 * Props for the DatasetLoader component.
 */
export interface DatasetLoaderProps {
    /** Datasets to preload */
    datasets: DatasetToPreload[];
    /** Children to render when loaded */
    children: ReactNode;
    /** Loading fallback */
    fallback?: ReactNode;
    /** Error render function */
    onError?: (error: Error, reload: () => void) => ReactNode;
}

/**
 * Component that preloads datasets before rendering children.
 *
 * @example
 * ```tsx
 * import { variant } from "@elaraai/east";
 *
 * function App() {
 *     return (
 *         <DatasetStoreProvider config={{ apiUrl: "..." }}>
 *             <DatasetLoader
 *                 datasets={[
 *                     { workspace: "production", path: [variant("field", "config")] }
 *                 ]}
 *                 fallback={<Spinner />}
 *                 onError={(err, reload) => <ErrorWithRetry error={err} onRetry={reload} />}
 *             >
 *                 <EastComponent render={myApp} />
 *             </DatasetLoader>
 *         </DatasetStoreProvider>
 *     );
 * }
 * ```
 */
export function DatasetLoader({
    datasets,
    children,
    fallback = null,
    onError,
}: DatasetLoaderProps) {
    const { loading, error, reload } = usePreloadDatasets(datasets);

    if (loading) {
        return <>{fallback}</>;
    }

    if (error) {
        if (onError) {
            return <>{onError(error, reload)}</>;
        }
        // Default error display
        return (
            <div style={{ color: "red", padding: "16px" }}>
                <strong>Failed to load datasets:</strong> {error.message}
                <button onClick={reload} style={{ marginLeft: "8px" }}>
                    Retry
                </button>
            </div>
        );
    }

    return <>{children}</>;
}

/**
 * Hook to write to a dataset from React code.
 *
 * @returns A function to write to a dataset
 *
 * @example
 * ```tsx
 * import { encodeBeast2For, IntegerType, variant } from "@elaraai/east";
 *
 * function UpdateButton() {
 *     const writeDataset = useDatasetWrite();
 *
 *     const handleUpdate = async () => {
 *         await writeDataset(
 *             "production",
 *             [variant("field", "inputs"), variant("field", "count")],
 *             encodeBeast2For(IntegerType)(42n)
 *         );
 *     };
 *
 *     return <button onClick={handleUpdate}>Update</button>;
 * }
 * ```
 */
export function useDatasetWrite(): (
    workspace: string,
    path: DatasetPath,
    value: Uint8Array
) => Promise<void> {
    const store = useDatasetStore();
    return useCallback(
        (workspace: string, path: DatasetPath, value: Uint8Array) =>
            store.write(workspace, path, value),
        [store]
    );
}

/**
 * Hook to check if a dataset is cached.
 *
 * @param workspace - The workspace name
 * @param path - The dataset path
 * @returns True if the dataset is cached
 */
export function useDatasetHas(workspace: string, path: DatasetPath): boolean {
    const store = useDatasetStore();
    const key = datasetCacheKey(workspace, path);

    const subscribe = useCallback(
        (cb: () => void) => store.subscribe(key, cb),
        [store, key]
    );
    const getSnapshot = useCallback(
        () => store.has(workspace, path),
        [store, workspace, path]
    );

    return useSyncExternalStore(subscribe, getSnapshot);
}
