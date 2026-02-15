/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useQuery, useMutation, type UseMutationResult, type UseQueryResult } from '@tanstack/react-query';
import type { QueryOverrides } from './types.js';
import { dataflowExecute, dataflowExecuteLaunch, dataflowGraph, dataflowExecutePoll, dataflowCancel, taskLogs } from '@elaraai/e3-api-client';
import type { RequestOptions, DataflowOptions, DataflowPollOptions, ExecutionStateOptions, LogOptions, DataflowResult, DataflowExecutionState } from '@elaraai/e3-api-client';

export function useDataflowExecute(url: string, repo: string, workspace: string | null, requestOptions?: RequestOptions): UseMutationResult<DataflowResult, Error, { dataflowOptions?: DataflowOptions; pollOptions?: DataflowPollOptions }> {
    return useMutation<DataflowResult, Error, { dataflowOptions?: DataflowOptions; pollOptions?: DataflowPollOptions }>({
        mutationFn: ({ dataflowOptions, pollOptions } = {}) =>
            dataflowExecute(url, repo, workspace!, dataflowOptions, requestOptions ?? { token: null }, pollOptions),
    });
}

export function useDataflowStart(url: string, repo: string, workspace: string | null, requestOptions?: RequestOptions) {
    return useMutation<void, Error, DataflowOptions | undefined>({
        mutationFn: (dataflowOptions) =>
            dataflowExecuteLaunch(url, repo, workspace!, dataflowOptions, requestOptions ?? { token: null }),
    });
}

export function useDataflowGraph(url: string, repo: string, workspace: string | null, requestOptions?: RequestOptions, queryOptions?: QueryOverrides) {
    return useQuery({
        queryKey: ['dataflowGraph', url, repo, workspace],
        queryFn: () => dataflowGraph(url, repo, workspace!, requestOptions ?? { token: null }),
        enabled: !!repo && !!workspace,
        ...queryOptions,
    });
}

export function useDataflowExecution(url: string, repo: string, workspace: string | null, stateOptions?: ExecutionStateOptions, requestOptions?: RequestOptions, queryOptions?: QueryOverrides): UseQueryResult<DataflowExecutionState, Error> {
    return useQuery({
        queryKey: ['dataflowExecution', url, repo, workspace, stateOptions],
        queryFn: () => dataflowExecutePoll(url, repo, workspace!, stateOptions, requestOptions ?? { token: null }),
        enabled: !!repo && !!workspace,
        ...queryOptions,
    });
}

export function useDataflowCancel(url: string, repo: string, workspace: string | null, requestOptions?: RequestOptions) {
    return useMutation<void, Error, void>({
        mutationFn: () => dataflowCancel(url, repo, workspace!, requestOptions ?? { token: null }),
    });
}

export function useTaskLogs(url: string, repo: string, workspace: string | null, task: string | null, logOptions?: LogOptions, requestOptions?: RequestOptions, queryOptions?: QueryOverrides) {
    return useQuery({
        queryKey: ['taskLogs', url, repo, workspace, task, logOptions],
        queryFn: () => taskLogs(url, repo, workspace!, task!, logOptions, requestOptions ?? { token: null }),
        enabled: !!repo && !!workspace && !!task,
        ...queryOptions,
    });
}
