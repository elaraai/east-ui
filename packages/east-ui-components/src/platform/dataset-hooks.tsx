/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

/**
 * React hooks and provider for ReactiveDataset platform functions.
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
    ReactiveDatasetCache,
    type ReactiveDatasetCacheInterface,
    type ReactiveDatasetCacheConfig,
    type DatasetPath,
    datasetCacheKey,
} from "./dataset-store.js";
import {
    initializeReactiveDatasetCache,
    clearReactiveDatasetCache,
} from "./dataset-runtime.js";

// =============================================================================
// Context
// =============================================================================

const ReactiveDatasetCacheContext = createContext<ReactiveDatasetCacheInterface | null>(null);

/**
 * Props for the ReactiveDatasetProvider component.
 */
export interface ReactiveDatasetProviderProps {
    /** Child components */
    children: ReactNode;
    /** Configuration for the reactive dataset cache */
    config: ReactiveDatasetCacheConfig;
    /** Optional external QueryClient (if not provided, one will be created) */
    queryClient?: QueryClient;
}

/**
 * @deprecated Use `ReactiveDatasetProviderProps` instead.
 */
export type DatasetStoreProviderProps = ReactiveDatasetProviderProps;

/**
 * Provides a ReactiveDatasetCache to the component tree.
 *
 * @remarks
 * Sets up TanStack Query and ReactiveDatasetCache for reactive dataset operations.
 * Also configures the cache's scheduler to use `queueMicrotask` for deferred
 * notifications, avoiding "setState during render" errors in React.
 *
 * @example
 * ```tsx
 * import { ReactiveDatasetProvider } from "@elaraai/east-ui-components";
 *
 * function App() {
 *     return (
 *         <ReactiveDatasetProvider config={{ apiUrl: "http://localhost:3000", token: "..." }}>
 *             <MyComponent />
 *         </ReactiveDatasetProvider>
 *     );
 * }
 * ```
 */
export function ReactiveDatasetProvider({
    children,
    config,
    queryClient: externalQueryClient,
}: ReactiveDatasetProviderProps) {
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

    // Create ReactiveDatasetCache
    const cache = useMemo(
        () => new ReactiveDatasetCache(queryClient, config),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [queryClient, config.apiUrl, config.repo, config.token, config.staleTime]
    );

    // Set global cache reference and configure scheduler
    useEffect(() => {
        initializeReactiveDatasetCache(cache);

        // Configure deferred notifications
        cache.setScheduler((notify) => queueMicrotask(notify));

        return () => {
            cache.destroy();
            clearReactiveDatasetCache();
        };
    }, [cache]);

    // Expose cache for debugging
    useEffect(() => {
        if (typeof window !== "undefined") {
            (window as unknown as Record<string, unknown>).__EAST_REACTIVE_DATASET_CACHE__ = cache;
        }
        return () => {
            if (typeof window !== "undefined") {
                delete (window as unknown as Record<string, unknown>).__EAST_REACTIVE_DATASET_CACHE__;
            }
        };
    }, [cache]);

    return (
        <QueryClientProvider client={queryClient}>
            <ReactiveDatasetCacheContext.Provider value={cache}>
                {children}
            </ReactiveDatasetCacheContext.Provider>
        </QueryClientProvider>
    );
}

/**
 * @deprecated Use `ReactiveDatasetProvider` instead.
 */
export const DatasetStoreProvider = ReactiveDatasetProvider;

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to access the ReactiveDatasetCache from context.
 *
 * @returns The ReactiveDatasetCache instance
 * @throws Error if used outside of a ReactiveDatasetProvider
 */
export function useReactiveDatasetCache(): ReactiveDatasetCacheInterface {
    const cache = useContext(ReactiveDatasetCacheContext);
    if (!cache) {
        throw new Error("useReactiveDatasetCache must be used within a ReactiveDatasetProvider");
    }
    return cache;
}

/**
 * @deprecated Use `useReactiveDatasetCache` instead.
 */
export const useDatasetStore = useReactiveDatasetCache;

/**
 * Hook to subscribe to reactive dataset cache changes using React 18's useSyncExternalStore.
 *
 * @returns The current snapshot version
 */
export function useReactiveDatasetCacheSubscription(): number {
    const cache = useReactiveDatasetCache();
    const subscribe = useCallback((cb: () => void) => cache.subscribe(cb), [cache]);
    const getSnapshot = useCallback(() => cache.getSnapshot(), [cache]);

    return useSyncExternalStore(subscribe, getSnapshot);
}

/**
 * @deprecated Use `useReactiveDatasetCacheSubscription` instead.
 */
export const useDatasetStoreSubscription = useReactiveDatasetCacheSubscription;

/**
 * Hook to subscribe to a specific reactive dataset key.
 *
 * @param workspace - The workspace name
 * @param path - The dataset path
 * @returns The cached value, or undefined if not loaded
 */
export function useReactiveDatasetKey(workspace: string, path: DatasetPath): Uint8Array | undefined {
    const cache = useReactiveDatasetCache();
    const key = datasetCacheKey(workspace, path);

    const subscribe = useCallback(
        (cb: () => void) => cache.subscribe(key, cb),
        [cache, key]
    );
    const getSnapshot = useCallback(
        () => cache.read(workspace, path),
        [cache, workspace, path]
    );

    return useSyncExternalStore(subscribe, getSnapshot);
}

/**
 * @deprecated Use `useReactiveDatasetKey` instead.
 */
export const useDatasetKey = useReactiveDatasetKey;

/**
 * Reactive dataset to preload.
 */
export interface ReactiveDatasetToPreload {
    workspace: string;
    path: DatasetPath;
}

/**
 * @deprecated Use `ReactiveDatasetToPreload` instead.
 */
export type DatasetToPreload = ReactiveDatasetToPreload;

/**
 * Result of usePreloadReactiveDatasets hook.
 */
export interface PreloadReactiveDatasetsResult {
    /** True while preloading */
    loading: boolean;
    /** Error if preloading failed */
    error: Error | null;
    /** Reload all datasets */
    reload: () => void;
}

/**
 * @deprecated Use `PreloadReactiveDatasetsResult` instead.
 */
export type PreloadDatasetsResult = PreloadReactiveDatasetsResult;

/**
 * Hook to preload reactive datasets before rendering.
 *
 * @param datasets - Array of datasets to preload
 * @returns Loading state and error
 *
 * @example
 * ```tsx
 * import { variant } from "@elaraai/east";
 *
 * function MyComponent() {
 *     const { loading, error } = usePreloadReactiveDatasets([
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
export function usePreloadReactiveDatasets(datasets: ReactiveDatasetToPreload[]): PreloadReactiveDatasetsResult {
    const cache = useReactiveDatasetCache();
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
            datasets.map(({ workspace, path }) => cache.preload(workspace, path))
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
    }, [cache, datasetsKey, reloadTrigger]);

    const reload = useCallback(() => {
        setReloadTrigger(t => t + 1);
    }, []);

    return { loading, error, reload };
}

/**
 * @deprecated Use `usePreloadReactiveDatasets` instead.
 */
export const usePreloadDatasets = usePreloadReactiveDatasets;

/**
 * Props for the ReactiveDatasetLoader component.
 */
export interface ReactiveDatasetLoaderProps {
    /** Datasets to preload */
    datasets: ReactiveDatasetToPreload[];
    /** Children to render when loaded */
    children: ReactNode;
    /** Loading fallback */
    fallback?: ReactNode;
    /** Error render function */
    onError?: (error: Error, reload: () => void) => ReactNode;
}

/**
 * @deprecated Use `ReactiveDatasetLoaderProps` instead.
 */
export type DatasetLoaderProps = ReactiveDatasetLoaderProps;

/**
 * Component that preloads reactive datasets before rendering children.
 *
 * @example
 * ```tsx
 * import { variant } from "@elaraai/east";
 *
 * function App() {
 *     return (
 *         <ReactiveDatasetProvider config={{ apiUrl: "..." }}>
 *             <ReactiveDatasetLoader
 *                 datasets={[
 *                     { workspace: "production", path: [variant("field", "config")] }
 *                 ]}
 *                 fallback={<Spinner />}
 *                 onError={(err, reload) => <ErrorWithRetry error={err} onRetry={reload} />}
 *             >
 *                 <EastComponent render={myApp} />
 *             </ReactiveDatasetLoader>
 *         </ReactiveDatasetProvider>
 *     );
 * }
 * ```
 */
export function ReactiveDatasetLoader({
    datasets,
    children,
    fallback = null,
    onError,
}: ReactiveDatasetLoaderProps) {
    const { loading, error, reload } = usePreloadReactiveDatasets(datasets);

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
 * @deprecated Use `ReactiveDatasetLoader` instead.
 */
export const DatasetLoader = ReactiveDatasetLoader;

/**
 * Hook to write to a reactive dataset from React code.
 *
 * @returns A function to write to a dataset
 *
 * @example
 * ```tsx
 * import { encodeBeast2For, IntegerType, variant } from "@elaraai/east";
 *
 * function UpdateButton() {
 *     const writeDataset = useReactiveDatasetWrite();
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
export function useReactiveDatasetWrite(): (
    workspace: string,
    path: DatasetPath,
    value: Uint8Array
) => Promise<void> {
    const cache = useReactiveDatasetCache();
    return useCallback(
        (workspace: string, path: DatasetPath, value: Uint8Array) =>
            cache.write(workspace, path, value),
        [cache]
    );
}

/**
 * @deprecated Use `useReactiveDatasetWrite` instead.
 */
export const useDatasetWrite = useReactiveDatasetWrite;

/**
 * Hook to check if a reactive dataset is cached.
 *
 * @param workspace - The workspace name
 * @param path - The dataset path
 * @returns True if the dataset is cached
 */
export function useReactiveDatasetHas(workspace: string, path: DatasetPath): boolean {
    const cache = useReactiveDatasetCache();
    const key = datasetCacheKey(workspace, path);

    const subscribe = useCallback(
        (cb: () => void) => cache.subscribe(key, cb),
        [cache, key]
    );
    const getSnapshot = useCallback(
        () => cache.has(workspace, path),
        [cache, workspace, path]
    );

    return useSyncExternalStore(subscribe, getSnapshot);
}

/**
 * @deprecated Use `useReactiveDatasetHas` instead.
 */
export const useDatasetHas = useReactiveDatasetHas;
