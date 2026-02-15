/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { QueryOverrides } from './types.js';
import { taskList, taskGet, taskExecutionList } from '@elaraai/e3-api-client';
import type { RequestOptions, TaskDetails, ExecutionListItem } from '@elaraai/e3-api-client';

export function useTaskList(url: string, repo: string, workspace: string | null, requestOptions?: RequestOptions, queryOptions?: QueryOverrides) {
    return useQuery({
        queryKey: ['taskList', url, repo, workspace],
        queryFn: () => taskList(url, repo, workspace!, requestOptions ?? { token: null }),
        enabled: !!url && !!repo && !!workspace,
        ...queryOptions,
    });
}

export function useTaskGet(url: string, repo: string, workspace: string | null, name: string | null, requestOptions?: RequestOptions, queryOptions?: QueryOverrides): UseQueryResult<TaskDetails, Error> {
    return useQuery({
        queryKey: ['taskGet', url, repo, workspace, name],
        queryFn: () => taskGet(url, repo, workspace!, name!, requestOptions ?? { token: null }),
        enabled: !!url && !!repo && !!workspace && !!name,
        ...queryOptions,
    });
}

export function useTaskExecutionList(url: string, repo: string, workspace: string | null, taskName: string | null, requestOptions?: RequestOptions, queryOptions?: QueryOverrides): UseQueryResult<ExecutionListItem[], Error> {
    return useQuery({
        queryKey: ['taskExecutionList', url, repo, workspace, taskName],
        queryFn: () => taskExecutionList(url, repo, workspace!, taskName!, requestOptions ?? { token: null }),
        enabled: !!url && !!repo && !!workspace && !!taskName,
        ...queryOptions,
    });
}
