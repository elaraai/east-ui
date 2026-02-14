/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useQuery, useMutation, type UseMutationResult, type UseQueryResult } from '@tanstack/react-query';
import type { QueryOverrides } from './types.js';
import { workspaceList, workspaceCreate, workspaceGet, workspaceStatus, workspaceRemove, workspaceDeploy, workspaceExport } from '@elaraai/e3-api-client';
import type { RequestOptions, WorkspaceInfo, WorkspaceStatusResult } from '@elaraai/e3-api-client';

export function useWorkspaceList(url: string, repo: string, requestOptions?: RequestOptions, queryOptions?: QueryOverrides): UseQueryResult<WorkspaceInfo[], Error> {
    return useQuery({
        queryKey: ['workspaceList', url, repo],
        queryFn: () => workspaceList(url, repo, requestOptions ?? { token: null }),
        enabled: !!url && !!repo,
        ...queryOptions,
    });
}

export function useWorkspaceCreate(url: string, repo: string, requestOptions?: RequestOptions): UseMutationResult<WorkspaceInfo, Error, string> {
    return useMutation<WorkspaceInfo, Error, string>({
        mutationFn: (name) => workspaceCreate(url, repo, name, requestOptions ?? { token: null }),
    });
}

export function useWorkspaceGet(url: string, repo: string, name: string | null, requestOptions?: RequestOptions, queryOptions?: QueryOverrides) {
    return useQuery({
        queryKey: ['workspaceGet', url, repo, name],
        queryFn: () => workspaceGet(url, repo, name!, requestOptions ?? { token: null }),
        enabled: !!url && !!repo && !!name,
        ...queryOptions,
    });
}

export function useWorkspaceStatus(url: string, repo: string, name: string | null, requestOptions?: RequestOptions, queryOptions?: QueryOverrides): UseQueryResult<WorkspaceStatusResult, Error> {
    return useQuery({
        queryKey: ['workspaceStatus', url, repo, name],
        queryFn: () => workspaceStatus(url, repo, name!, requestOptions ?? { token: null }),
        enabled: !!url && !!repo && !!name,
        ...queryOptions,
    });
}

export function useWorkspaceRemove(url: string, repo: string, requestOptions?: RequestOptions) {
    return useMutation<void, Error, string>({
        mutationFn: (name) => workspaceRemove(url, repo, name, requestOptions ?? { token: null }),
    });
}

export function useWorkspaceDeploy(url: string, repo: string, requestOptions?: RequestOptions) {
    return useMutation<void, Error, { name: string; packageRef: string }>({
        mutationFn: ({ name, packageRef }) => workspaceDeploy(url, repo, name, packageRef, requestOptions ?? { token: null }),
    });
}

export function useWorkspaceExport(url: string, repo: string, name: string | null, requestOptions?: RequestOptions, queryOptions?: QueryOverrides) {
    return useQuery({
        queryKey: ['workspaceExport', url, repo, name],
        queryFn: () => workspaceExport(url, repo, name!, requestOptions ?? { token: null }),
        enabled: !!url && !!repo && !!name,
        ...queryOptions,
    });
}
