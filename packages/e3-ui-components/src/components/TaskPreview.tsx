/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useState, useEffect } from 'react';
import {
    Box,
    Text,
    Flex,
    SegmentGroup,
    useTabs,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { VirtualizedLogViewer } from './VirtualizedLogViewer.js';
import { EastValueViewer } from './EastValueViewer.js';
import {
    decodeBeast2,
    decodeBeast2For,
    isTypeValueEqual,
    toEastTypeValue,
    type ValueTypeOf,
} from '@elaraai/east';
import {
    EastStoreProvider,
    createEastStore,
    EastChakraComponent,
    StateImpl,
    DatasetImpl,
    OverlayImpl,
} from '@elaraai/east-ui-components';
import { useTaskOutput } from '../hooks/useTaskOutput.js';
import { useTaskLogs as useTaskLogsHook } from '../hooks/useTaskLogsHook.js';
import { StatusDisplay } from './StatusDisplay.js';
import { UIComponentType } from '@elaraai/east-ui';
import type { TaskStatusInfo, RequestOptions } from '@elaraai/e3-api-client';

// Combined platform implementations for decoding Beast2 with Reactive components
const platformImplementations = [...StateImpl, ...DatasetImpl, ...OverlayImpl];

type ViewMode = 'output' | 'logs';

export interface TaskPreviewProps {
    apiUrl: string;
    repo: string;
    workspace: string;
    task: string;
    taskInfo: TaskStatusInfo | null;
    outputHash: string | null;
    requestOptions?: RequestOptions;
}

/**
 * Renders a preview of a task's output and logs.
 * Decodes Beast2 data and renders as an East UI component if possible,
 * with a virtualized log viewer for stdout/stderr.
 */
export const TaskPreview = memo(function TaskPreview({
    apiUrl,
    repo,
    workspace,
    task,
    taskInfo,
    outputHash,
    requestOptions,
}: TaskPreviewProps) {
    // Fetch task output - pass outputHash so query refetches when data changes
    const { data: output, isLoading, error } = useTaskOutput(apiUrl, repo, workspace, taskInfo, outputHash, requestOptions);

    // Fetch task logs (stdout and stderr)
    const { data: stdout } = useTaskLogsHook(apiUrl, repo, workspace, taskInfo, 'stdout', requestOptions);
    const { data: stderr } = useTaskLogsHook(apiUrl, repo, workspace, taskInfo, 'stderr', requestOptions);

    // Decode the output as IR
    const ir = useMemo(() => {
        if (!output) return null;
        try {
            // First check the type without platform (to see if it's UIComponentType)
            const { type } = decodeBeast2(output);
            if (isTypeValueEqual(type, toEastTypeValue(UIComponentType))) {
                // Decode with platform implementations for Reactive components
                const decoder = decodeBeast2For(UIComponentType, { platform: platformImplementations });
                const value = decoder(output);
                return value as ValueTypeOf<UIComponentType>;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }, [output]);

    // Create store - recreate when IR changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const store = useMemo(() => createEastStore(), [ir]);

    // Log content for stdout and stderr
    const stdoutContent = useMemo(() => stdout?.data ?? '', [stdout?.data]);
    const stderrContent = useMemo(() => stderr?.data ?? '', [stderr?.data]);

    // Tabs for stdout/stderr
    const tabs = useTabs({
        defaultValue: 'stdout',
    });

    // View mode state
    const [viewMode, setViewMode] = useState<ViewMode | null>(null);

    // Set initial view mode once data loads
    useEffect(() => {
        if (isLoading && stdout?.data === undefined && stderr?.data === undefined) return;
        setViewMode(prev => {
            if (prev !== null) return prev;
            // Default to logs if no UI component, otherwise output
            return ir === null ? 'logs' : 'output';
        });
    }, [isLoading, stdout?.data, stderr?.data, ir, taskInfo?.status.type]);

    // Output panel content
    const outputPanel = useMemo(() => {
        // Task not up-to-date - show status message
        if (taskInfo?.status.type !== 'up-to-date') {
            return (
                <StatusDisplay
                    variant="info"
                    title={`Task is ${taskInfo?.status.type ?? 'unknown'}`}
                    message="Run the task to see output"
                />
            );
        }

        // Loading - show spinner
        if (isLoading) {
            return (
                <StatusDisplay
                    variant="loading"
                    title="Loading output..."
                />
            );
        }

        // UIComponent loaded - render it
        if (ir !== null) {
            return (
                <Box height="100%" overflow="auto" p="4">
                    <EastChakraComponent value={ir} />
                </Box>
            );
        }

        // Not a UIComponent - output exists but couldn't decode as UIComponent
        // Render using the type-aware EastValueViewer
        if (output && ir === null) {
            // Check output size - if too large, show warning instead of rendering
            // const MAX_RENDER_SIZE = 512 * 1024 * 10; // 512KB
            // const outputSize = output instanceof Uint8Array ? output.length : 0;

            // if (outputSize > MAX_RENDER_SIZE) {
            //     return (
            //         <StatusDisplay
            //             variant="warning"
            //             title="Output too large to display"
            //             message={`The task output is ${(outputSize / 1024 / 1024).toFixed(2)} MB, which exceeds the ${(MAX_RENDER_SIZE / 1024).toFixed(0)} KB display limit. Consider using a smaller dataset or accessing the output programmatically.`}
            //         />
            //     );
            // }

            try {
                const decoded = decodeBeast2(output);
                // return (
                //     <Box height="100%" overflow="auto" p="4">
                //         <Text fontSize="xs" color="gray.500" mb={2}>Raw Output ({(outputSize / 1024).toFixed(1)} KB)</Text>
                //         <EastValueViewer type={decoded.type} value={decoded.value} />
                //     </Box>
                // );
                return (
                    <Box height="100%" overflow="auto" p="4">
                        <EastValueViewer type={decoded.type} value={decoded.value} />
                    </Box>
                );
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : String(e);
                return <StatusDisplay variant="error" title="Failed to render output" details={errorMessage} />;
            }
        }

        // No output available
        return (
            <StatusDisplay
                variant="info"
                title={`No output available for task "${task}"`}
            />
        );
    }, [ir, task, isLoading, output, taskInfo?.status.type]);

    // Get active tab content
    const activeLogContent = useMemo(() => tabs.value === 'stderr' ? stderrContent : stdoutContent, [tabs.value, stderrContent, stdoutContent]);

    // Logs panel content - using virtualized viewer for performance
    const logsPanel = useMemo(() => {
        return (
            <VirtualizedLogViewer
                content={activeLogContent}
                tabs={tabs}
            />
        );
    }, [activeLogContent, tabs]);

    // Loading - show while we don't have view mode yet
    if (viewMode === null) {
        return (
            <StatusDisplay
                variant="loading"
                title="Loading task..."
            />
        );
    }

    // Error
    if (error) {
        return <StatusDisplay variant="error" title="Failed to load task output" details={error instanceof Error ? error.message : String(error)} />;
    }

    // Render the view
    return (
        <EastStoreProvider store={store}>
            <Box height="100%" display="flex" flexDirection="column" overflow="hidden">
                {/* Toolbar with view toggle */}
                <Flex
                    px={4}
                    py={2}
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    bg="white"
                    align="center"
                    justify="space-between"
                    flexShrink={0}
                >
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                        {task}
                    </Text>
                    <SegmentGroup.Root
                        size="xs"
                        value={viewMode}
                        onValueChange={(details) => setViewMode(details.value as ViewMode)}
                    >
                        <SegmentGroup.Indicator />
                        <SegmentGroup.Item value="output" title="Output">
                            <SegmentGroup.ItemText>
                                <FontAwesomeIcon icon={faCode} />
                            </SegmentGroup.ItemText>
                            <SegmentGroup.ItemHiddenInput />
                        </SegmentGroup.Item>
                        <SegmentGroup.Item value="logs" title="Logs">
                            <SegmentGroup.ItemText>
                                <FontAwesomeIcon icon={faTerminal} />
                            </SegmentGroup.ItemText>
                            <SegmentGroup.ItemHiddenInput />
                        </SegmentGroup.Item>
                    </SegmentGroup.Root>
                </Flex>

                {/* Panel content */}
                <Box flex={1} overflow="hidden" minHeight={0}>
                    {viewMode === 'output' ? outputPanel : logsPanel}
                </Box>
            </Box>
        </EastStoreProvider>
    );
}, (prev, next) => prev.task === next.task && prev.repo === next.repo && prev.workspace === next.workspace && prev.outputHash === next.outputHash && prev.taskInfo?.status.type === next.taskInfo?.status.type);
