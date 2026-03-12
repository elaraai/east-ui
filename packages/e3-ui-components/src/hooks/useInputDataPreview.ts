/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { QueryOverrides, DatasetPreview } from './types.js';
import { datasetGetStatus, datasetGet } from '@elaraai/e3-api-client';
import type { RequestOptions } from '@elaraai/e3-api-client';
import { variant, some, none } from '@elaraai/east';

const MAX_DOWNLOAD_SIZE = 10 * 1024 * 1024; // 10MB

export function useInputDataPreview(
    apiUrl: string,
    repo: string,
    workspace: string | null,
    path: string | null,
    requestOptions?: RequestOptions,
    queryOptions?: QueryOverrides
) {
    const pathParts = useMemo(() =>
        path?.split('.').filter(Boolean).map((v) => variant('field', v)) ?? [],
        [path]
    );

    // Step 1: lightweight status (type, size, hash) — polls to detect changes
    const status = useQuery({
        queryKey: ['inputDataStatus', apiUrl, repo, workspace, path],
        queryFn: () => datasetGetStatus(apiUrl, repo, workspace!, pathParts, requestOptions ?? { token: null }),
        enabled: !!workspace && !!path,
        refetchInterval: 1000,
        ...queryOptions,
    });

    const hash = useMemo(() => status.data?.hash?.type === 'some' ? status.data.hash.value : null, [status.data]);
    const hasData = useMemo(() => status.data?.refType === 'value' && hash !== null, [status.data, hash]);
    const size = useMemo(() => status.data?.size?.type === 'some' ? status.data.size.value : null, [status.data]);
    const isOversized = useMemo(() => size !== null && size > MAX_DOWNLOAD_SIZE, [size]);

    // Step 2: full data — only when status shows data exists and not oversized
    const data = useQuery({
        queryKey: ['inputData', apiUrl, repo, workspace, path, hash],
        queryFn: () => datasetGet(apiUrl, repo, workspace!, pathParts, requestOptions ?? { token: null }),
        enabled: hasData && !isOversized,
        ...queryOptions,
    });

    // Combine into DatasetPreview
    const preview: DatasetPreview | undefined = useMemo(() => {
        if (!status.data) return undefined;
        return {
            path: status.data.path,
            type: status.data.type,
            refType: status.data.refType,
            hash: status.data.hash,
            size: status.data.size,
            value: data.data ? some(data.data.data) : none,
        };
    }, [status.data, data.data]);

    return {
        data: preview,
        isLoading: status.isLoading || (status.isSuccess && hasData && !isOversized && data.isLoading),
        error: status.error ?? data.error ?? null,
    };
}
