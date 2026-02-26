/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useQuery, useMutation, type UseQueryResult } from '@tanstack/react-query';
import type { QueryOverrides } from './types.js';
import { datasetList, datasetListAt, datasetListRecursive, datasetListRecursivePaths, datasetListWithStatus, datasetGet, datasetGetStatus, datasetSet } from '@elaraai/e3-api-client';
import type { RequestOptions, ListEntry, DatasetStatusDetail } from '@elaraai/e3-api-client';
import type { TreePath } from '@elaraai/e3-types';

export function useDatasetList(url: string, repo: string, workspace: string | null, requestOptions?: RequestOptions, queryOptions?: QueryOverrides) {
    return useQuery({
        queryKey: ['datasetList', url, repo, workspace],
        queryFn: () => datasetList(url, repo, workspace!, requestOptions ?? { token: null }),
        enabled: !!repo && !!workspace,
        ...queryOptions,
    });
}

export function useDatasetListAt(url: string, repo: string, workspace: string | null, path: TreePath, requestOptions?: RequestOptions, queryOptions?: QueryOverrides) {
    return useQuery({
        queryKey: ['datasetListAt', url, repo, workspace, path],
        queryFn: () => datasetListAt(url, repo, workspace!, path, requestOptions ?? { token: null }),
        enabled: !!repo && !!workspace,
        ...queryOptions,
    });
}

export function useDatasetListRecursive(url: string, repo: string, workspace: string | null, path: TreePath, requestOptions?: RequestOptions, queryOptions?: QueryOverrides): UseQueryResult<ListEntry[], Error> {
    return useQuery({
        queryKey: ['datasetListRecursive', url, repo, workspace, path],
        queryFn: () => datasetListRecursive(url, repo, workspace!, path, requestOptions ?? { token: null }),
        enabled: !!repo && !!workspace,
        ...queryOptions,
    });
}

export function useDatasetListRecursivePaths(url: string, repo: string, workspace: string | null, path: TreePath, requestOptions?: RequestOptions, queryOptions?: QueryOverrides) {
    return useQuery({
        queryKey: ['datasetListRecursivePaths', url, repo, workspace, path],
        queryFn: () => datasetListRecursivePaths(url, repo, workspace!, path, requestOptions ?? { token: null }),
        enabled: !!repo && !!workspace,
        ...queryOptions,
    });
}

export function useDatasetListWithStatus(url: string, repo: string, workspace: string | null, path: TreePath, requestOptions?: RequestOptions, queryOptions?: QueryOverrides): UseQueryResult<ListEntry[], Error> {
    return useQuery({
        queryKey: ['datasetListWithStatus', url, repo, workspace, path],
        queryFn: () => datasetListWithStatus(url, repo, workspace!, path, requestOptions ?? { token: null }),
        enabled: !!repo && !!workspace,
        ...queryOptions,
    });
}

export function useDatasetGetStatus(url: string, repo: string, workspace: string | null, path: TreePath, requestOptions?: RequestOptions, queryOptions?: QueryOverrides): UseQueryResult<DatasetStatusDetail, Error> {
    return useQuery({
        queryKey: ['datasetGetStatus', url, repo, workspace, path],
        queryFn: () => datasetGetStatus(url, repo, workspace!, path, requestOptions ?? { token: null }),
        enabled: !!repo && !!workspace,
        ...queryOptions,
    });
}

export function useDatasetGet(url: string, repo: string, workspace: string | null, path: TreePath, requestOptions?: RequestOptions, queryOptions?: QueryOverrides) {
    return useQuery({
        queryKey: ['datasetGet', url, repo, workspace, path],
        queryFn: () => datasetGet(url, repo, workspace!, path, requestOptions ?? { token: null }),
        enabled: !!repo && !!workspace,
        ...queryOptions,
    });
}

export function useDatasetSet(url: string, repo: string, workspace: string | null, requestOptions?: RequestOptions) {
    return useMutation<void, Error, { path: TreePath; data: Uint8Array }>({
        mutationFn: ({ path, data }) => datasetSet(url, repo, workspace!, path, data, requestOptions ?? { token: null }),
    });
}
