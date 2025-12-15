/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useQuery } from '@tanstack/react-query';
import { workspaceList, workspaceStatus } from '@elaraai/e3-api-client';

export function useWorkspaces(apiUrl: string) {
    return useQuery({
        queryKey: ['workspaces', apiUrl],
        queryFn: () => workspaceList(apiUrl),
        enabled: !!apiUrl,
        refetchInterval: 5000,
    });
}

export function useWorkspaceStatus(apiUrl: string, workspace: string | null) {
    return useQuery({
        queryKey: ['workspaceStatus', apiUrl, workspace],
        queryFn: async () => {
            console.log('[East] useWorkspaceStatus: Fetching status for', workspace);
            const result = await workspaceStatus(apiUrl, workspace!);
            console.log('[East] useWorkspaceStatus: Got', result.tasks?.length, 'tasks, statuses:', result.tasks?.map(t => `${t.name}:${t.status.type}`).join(', '));
            return result;
        },
        enabled: !!apiUrl && !!workspace,
        refetchInterval: 1000,
        staleTime: 0, // Always consider data stale
        gcTime: 0, // Don't cache
        structuralSharing: false, // Don't reuse old data structure
    });
}
