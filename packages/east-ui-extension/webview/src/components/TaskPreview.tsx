/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo } from 'react';
import { useE3Context } from '../context/E3Context';
import { TaskPreview as TaskPreviewInner, StatusDisplay, useTaskGet } from '@elaraai/e3-ui-components';
import { InputPreview } from './InputPreview';

/**
 * Outer component that handles context and passes props to the reusable TaskPreview.
 * Forces clean re-render when task changes via the key prop.
 */
export function TaskPreview() {
    const { apiUrl, selection } = useE3Context();
    const selectedWorkspace = selection.type !== 'none' ? selection.workspace : null;
    const selectedTask = selection.type === 'task' ? selection.task : null;

    const { data: taskDetails } = useTaskGet(apiUrl, 'default', selectedWorkspace, selectedTask, undefined, {
        staleTime: 0,
        gcTime: 0,
    });

    // Convert TreePath to dot-path string
    const outputPath = useMemo(() => {
        if (!taskDetails) return null;
        return taskDetails.output.map(s => '.' + s.value).join('');
    }, [taskDetails]);

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

    // Task details not loaded yet
    if (!outputPath) {
        return (
            <StatusDisplay
                variant="loading"
                title="Loading task..."
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
            output={outputPath}
        />
    );
}
