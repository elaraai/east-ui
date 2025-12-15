/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useQuery } from '@tanstack/react-query';
import { taskLogs } from '@elaraai/e3-api-client';
import type { TaskStatusInfo } from '@elaraai/e3-api-client';

export function useTaskLogs(
    apiUrl: string,
    workspace: string | null,
    task: TaskStatusInfo | null,
    stream: 'stdout' | 'stderr' = 'stdout'
) {
    return useQuery({
        queryKey: ['taskLogs', apiUrl, workspace, task?.name, stream],
        queryFn: () => {
            return taskLogs(apiUrl, workspace!, task!.name, {
                stream,
                offset: 0,
                limit: 100000,
            });
        },
        enabled: !!apiUrl && !!workspace && !!task,
        refetchInterval: 1000,
    });
}
