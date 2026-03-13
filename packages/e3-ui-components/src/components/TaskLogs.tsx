/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from 'react';
import { useTabs } from '@chakra-ui/react';
import { VirtualizedLogViewer } from './VirtualizedLogViewer.js';
import { useTaskLogs as useTaskLogsHook } from '../hooks/useTaskLogsHook.js';
import type { RequestOptions } from '@elaraai/e3-api-client';

export interface TaskLogsProps {
    apiUrl: string;
    repo: string;
    workspace: string;
    task: string;
    requestOptions?: RequestOptions;
}

/**
 * Renders a virtualized log viewer for a task's stdout/stderr.
 */
export const TaskLogs = memo(function TaskLogs({
    apiUrl,
    repo,
    workspace,
    task,
    requestOptions,
}: TaskLogsProps) {
    const { data: stdout } = useTaskLogsHook(apiUrl, repo, workspace, task, 'stdout', requestOptions);
    const { data: stderr } = useTaskLogsHook(apiUrl, repo, workspace, task, 'stderr', requestOptions);

    const stdoutContent = useMemo(() => stdout?.data ?? '', [stdout?.data]);
    const stderrContent = useMemo(() => stderr?.data ?? '', [stderr?.data]);

    const tabs = useTabs({
        defaultValue: 'stdout',
    });

    const activeLogContent = useMemo(
        () => (tabs.value === 'stderr' ? stderrContent : stdoutContent),
        [tabs.value, stderrContent, stdoutContent],
    );

    return (
        <VirtualizedLogViewer
            content={activeLogContent}
            tabs={tabs}
        />
    );
});
