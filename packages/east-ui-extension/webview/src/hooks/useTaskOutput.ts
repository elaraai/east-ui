/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useQuery } from '@tanstack/react-query';
import { datasetGet } from '@elaraai/e3-api-client';
import type { TaskStatusInfo } from '@elaraai/e3-api-client';
import { variant } from '@elaraai/east';


export function useTaskOutput(
    apiUrl: string,
    workspace: string | null,
    task: TaskStatusInfo | null,
    outputHash: string | null = null
) {
    const isUpToDate = task?.status.type === 'up-to-date';

    return useQuery({
        // Include outputHash in key - when hash changes, data changed
        queryKey: ['taskOutput', apiUrl, workspace, task?.name, outputHash],
        queryFn: () => {
            const pathParts = task?.output?.split('.')?.map((value) => variant('field', value)) ?? [];
            return datasetGet(apiUrl, 'default', workspace!, pathParts, {});
        },
        enabled: !!apiUrl && !!workspace && !!task && isUpToDate,
    });
}
