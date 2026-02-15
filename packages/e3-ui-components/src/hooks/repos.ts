/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useQuery, useMutation, type UseMutationResult, type UseQueryResult } from '@tanstack/react-query';
import { repoList, repoStatus, repoGc, repoGcStart, repoGcStatus, repoCreate, repoRemove } from '@elaraai/e3-api-client';
import type { RequestOptions, GcRequest, GcResult, GcStartResult, GcStatusResult } from '@elaraai/e3-api-client';
import type { QueryOverrides } from './types.js';

export function useRepoList(url: string, requestOptions?: RequestOptions, queryOptions?: QueryOverrides) {
    return useQuery({
        queryKey: ['repoList', url],
        queryFn: () => repoList(url, requestOptions ?? { token: null }),
        enabled: true,
        ...queryOptions,
    });
}

export function useRepoStatus(url: string, repo: string, requestOptions?: RequestOptions, queryOptions?: QueryOverrides) {
    return useQuery({
        queryKey: ['repoStatus', url, repo],
        queryFn: () => repoStatus(url, repo, requestOptions ?? { token: null }),
        enabled: !!repo,
        ...queryOptions,
    });
}

export function useRepoGc(url: string, repo: string, requestOptions?: RequestOptions): UseMutationResult<GcResult, Error, GcRequest> {
    return useMutation<GcResult, Error, GcRequest>({
        mutationFn: (gcOptions) => repoGc(url, repo, gcOptions, requestOptions ?? { token: null }),
    });
}

export function useRepoGcStart(url: string, repo: string, requestOptions?: RequestOptions): UseMutationResult<GcStartResult, Error, GcRequest> {
    return useMutation<GcStartResult, Error, GcRequest>({
        mutationFn: (gcOptions) => repoGcStart(url, repo, gcOptions, requestOptions ?? { token: null }),
    });
}

export function useRepoGcStatus(url: string, repo: string, executionId: string, requestOptions?: RequestOptions, queryOptions?: QueryOverrides): UseQueryResult<GcStatusResult, Error> {
    return useQuery({
        queryKey: ['repoGcStatus', url, repo, executionId],
        queryFn: () => repoGcStatus(url, repo, executionId, requestOptions ?? { token: null }),
        enabled: !!repo && !!executionId,
        ...queryOptions,
    });
}

export function useRepoCreate(url: string, requestOptions?: RequestOptions) {
    return useMutation<string, Error, string>({
        mutationFn: (name) => repoCreate(url, name, requestOptions ?? { token: null }),
    });
}

export function useRepoRemove(url: string, requestOptions?: RequestOptions) {
    return useMutation<void, Error, string>({
        mutationFn: (name) => repoRemove(url, name, requestOptions ?? { token: null }),
    });
}
