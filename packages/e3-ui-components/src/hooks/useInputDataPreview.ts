/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { QueryOverrides, DatasetPreview } from './types.js';
import { datasetGetStatus, datasetGet } from '@elaraai/e3-api-client';
import type { DatasetStatusInfo, RequestOptions } from '@elaraai/e3-api-client';
import { variant } from '@elaraai/east';

const MAX_DOWNLOAD_SIZE = 10 * 1024 * 1024; // 10MB

export function useInputDataPreview(
    apiUrl: string,
    repo: string,
    workspace: string | null,
    inputInfo: DatasetStatusInfo | null,
    requestOptions?: RequestOptions,
    queryOptions?: QueryOverrides
) {
    const isUpToDate = inputInfo?.status.type === 'up-to-date';
    const hash = inputInfo?.hash?.type === 'some' ? inputInfo.hash.value : null;
    const pathParts = useMemo(() =>
        inputInfo?.path?.split('.').filter(Boolean).map((v) => variant('field', v)) ?? [],
        [inputInfo?.path]
    );

    // Step 1: lightweight status (type, size, hash)
    const status = useQuery({
        queryKey: ['inputDataStatus', apiUrl, repo, workspace, inputInfo?.path, hash],
        queryFn: () => datasetGetStatus(apiUrl, repo, workspace!, pathParts, requestOptions ?? { token: null }),
        enabled: !!workspace && !!inputInfo && isUpToDate,
        ...queryOptions,
    });

    const size = status.data?.size?.type === 'some' ? status.data.size.value : null;
    const isOversized = size !== null && size > MAX_DOWNLOAD_SIZE;

    // Step 2: full data — only when status loaded and not oversized
    const data = useQuery({
        queryKey: ['inputData', apiUrl, repo, workspace, inputInfo?.path, hash],
        queryFn: () => datasetGet(apiUrl, repo, workspace!, pathParts, requestOptions ?? { token: null }),
        enabled: !!status.data && !isOversized,
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
            value: data.data ? { type: 'some' as const, value: data.data } : { type: 'none' as const },
        };
    }, [status.data, data.data]);

    return {
        data: preview,
        isLoading: status.isLoading || (status.isSuccess && !isOversized && data.isLoading),
        error: status.error ?? data.error ?? null,
    };
}
