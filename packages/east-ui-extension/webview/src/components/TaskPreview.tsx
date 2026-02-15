/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo } from 'react';
import { useE3Context } from '../context/E3Context';
import { useWorkspaceStatus, TaskPreview as TaskPreviewInner, StatusDisplay } from '@elaraai/e3-ui-components';
import { InputPreview } from './InputPreview';

/**
 * Outer component that handles context and passes props to the reusable TaskPreview.
 * Forces clean re-render when task changes via the key prop.
 */
export function TaskPreview() {
    const { apiUrl, selection } = useE3Context();
    const selectedWorkspace = selection.type !== 'none' ? selection.workspace : null;
    const selectedTask = selection.type === 'task' ? selection.task : null;

    const { data: status } = useWorkspaceStatus(apiUrl, 'default', selectedWorkspace, undefined, {
        refetchInterval: 1000,
        staleTime: 0,
        gcTime: 0,
        structuralSharing: false,
    });

    // Find the selected task info
    const taskInfo = useMemo(() => {
        if (!status || !selectedTask) return null;
        return status.tasks.find((t) => t.name === selectedTask) ?? null;
    }, [status, selectedTask]);

    // Find the output dataset's hash - this changes when task output changes
    const outputHash = useMemo(() => {
        if (!status || !taskInfo?.output) return null;
        const outputDataset = status.datasets.find((d) => d.path === taskInfo.output);
        return outputDataset?.hash?.type === 'some' ? outputDataset.hash.value : null;
    }, [status, taskInfo?.output]);

    // Input selected - render InputPreview
    if (selection.type === 'input') {
        return <InputPreview />;
    }

    // No task selected
    if (!selectedWorkspace || !selectedTask) {
        return (
            <StatusDisplay
                variant="info"
                title="Select a task to preview"
                message="Choose a workspace and task from the tree on the left"
            />
        );
    }

    return (
        <TaskPreviewInner
            key={`${selectedWorkspace}:${selectedTask}`}
            apiUrl={apiUrl}
            repo="default"
            workspace={selectedWorkspace}
            task={selectedTask}
            taskInfo={taskInfo}
            outputHash={outputHash}
        />
    );
}
