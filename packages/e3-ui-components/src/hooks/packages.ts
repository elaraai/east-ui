/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useQuery, useMutation, type UseQueryResult } from '@tanstack/react-query';
import type { QueryOverrides } from './types.js';
import { packageList, packageGet, packageImport, packageExport, packageRemove } from '@elaraai/e3-api-client';
import type { RequestOptions, PackageImportResult } from '@elaraai/e3-api-client';
import type { PackageObject } from '@elaraai/e3-types';

export function usePackageList(url: string, repo: string, requestOptions?: RequestOptions, queryOptions?: QueryOverrides) {
    return useQuery({
        queryKey: ['packageList', url, repo],
        queryFn: () => packageList(url, repo, requestOptions ?? { token: null }),
        enabled: !!repo,
        ...queryOptions,
    });
}

export function usePackageGet(url: string, repo: string, name: string, version: string, requestOptions?: RequestOptions, queryOptions?: QueryOverrides): UseQueryResult<PackageObject, Error> {
    return useQuery({
        queryKey: ['packageGet', url, repo, name, version],
        queryFn: () => packageGet(url, repo, name, version, requestOptions ?? { token: null }),
        enabled: !!repo && !!name && !!version,
        ...queryOptions,
    });
}

export function usePackageImport(url: string, repo: string, requestOptions?: RequestOptions) {
    return useMutation<PackageImportResult, Error, Uint8Array>({
        mutationFn: (archive) => packageImport(url, repo, archive, requestOptions ?? { token: null }),
    });
}

export function usePackageExport(url: string, repo: string, name: string, version: string, requestOptions?: RequestOptions, queryOptions?: QueryOverrides) {
    return useQuery({
        queryKey: ['packageExport', url, repo, name, version],
        queryFn: () => packageExport(url, repo, name, version, requestOptions ?? { token: null }),
        enabled: !!repo && !!name && !!version,
        ...queryOptions,
    });
}

export function usePackageRemove(url: string, repo: string, requestOptions?: RequestOptions) {
    return useMutation<void, Error, { name: string; version: string }>({
        mutationFn: ({ name, version }) => packageRemove(url, repo, name, version, requestOptions ?? { token: null }),
    });
}
