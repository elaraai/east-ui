/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { QueryOverrides, DatasetPreview } from './types.js';
import { datasetGetStatus, datasetGet } from '@elaraai/e3-api-client';
import type { TaskStatusInfo, RequestOptions } from '@elaraai/e3-api-client';
import { variant } from '@elaraai/east';

const MAX_DOWNLOAD_SIZE = 10 * 1024 * 1024; // 10MB

export function useTaskOutputPreview(
    apiUrl: string,
    repo: string,
    workspace: string | null,
    task: TaskStatusInfo | null,
    outputHash: string | null = null,
    requestOptions?: RequestOptions,
    queryOptions?: QueryOverrides
) {
    const isUpToDate = task?.status.type === 'up-to-date';
    const pathParts = useMemo(() =>
        task?.output?.split('.').map((v) => variant('field', v)) ?? [],
        [task?.output]
    );

    // Step 1: lightweight status (type, size, hash)
    const status = useQuery({
        queryKey: ['taskOutputStatus', apiUrl, repo, workspace, task?.name, outputHash],
        queryFn: () => datasetGetStatus(apiUrl, repo, workspace!, pathParts, requestOptions ?? { token: null }),
        enabled: !!workspace && !!task && isUpToDate,
        ...queryOptions,
    });

    const size = status.data?.size?.type === 'some' ? status.data.size.value : null;
    const isOversized = size !== null && size > MAX_DOWNLOAD_SIZE;

    // Step 2: full data — only when status loaded and not oversized
    const data = useQuery({
        queryKey: ['taskOutput', apiUrl, repo, workspace, task?.name, outputHash],
        queryFn: () => datasetGet(apiUrl, repo, workspace!, pathParts, requestOptions ?? { token: null }),
        enabled: !!status.data && !isOversized,
        ...queryOptions,
    });

    // Combine into DatasetPreview
    const preview = useMemo((): DatasetPreview | undefined => {
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
