/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useQuery } from '@tanstack/react-query';
import { taskLogs } from '@elaraai/e3-api-client';
import type { TaskStatusInfo } from '@elaraai/e3-api-client';

// Beast2 decoder has stack overflow with large strings, so fetch in chunks
const CHUNK_SIZE = 64 * 1024; // 64KB per chunk
const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB max total

async function fetchAllLogs(
    apiUrl: string,
    workspace: string,
    taskName: string,
    stream: 'stdout' | 'stderr'
): Promise<{ data: string; offset: bigint; size: bigint; totalSize: bigint; complete: boolean }> {
    try {
        let allData = '';
        let offset = 0;
        let totalSize = 0n;

        while (true) {
            const chunk = await taskLogs(apiUrl, 'default', workspace, taskName, {
                stream,
                offset,
                limit: CHUNK_SIZE,
            }, { token: null });

            allData += chunk.data;
            totalSize = chunk.totalSize;

            // Stop if complete or hit size limit
            if (chunk.complete || allData.length >= MAX_TOTAL_SIZE) {
                break;
            }

            offset += CHUNK_SIZE;
        }

        return {
            data: allData,
            offset: 0n,
            size: BigInt(allData.length),
            totalSize,
            complete: true,
        };
    } catch {
        // Return empty result on error
        return {
            data: '',
            offset: 0n,
            size: 0n,
            totalSize: 0n,
            complete: true,
        };
    }
}

export function useTaskLogs(
    apiUrl: string,
    workspace: string | null,
    task: TaskStatusInfo | null,
    stream: 'stdout' | 'stderr' = 'stdout'
) {
    // Only poll while task is actively running
    const isTaskRunning = task?.status.type === 'in-progress' || task?.status.type === 'stale-running';

    return useQuery({
        // Include task status in query key so we refetch when status changes
        queryKey: ['taskLogs', apiUrl, workspace, task?.name, task?.status.type, stream],
        queryFn: () => fetchAllLogs(apiUrl, workspace!, task!.name, stream),
        enabled: !!apiUrl && !!workspace && !!task,
        // Only refetch every second while task is running, otherwise stop polling
        refetchInterval: isTaskRunning ? 1000 : false,
    });
}
