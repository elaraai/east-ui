/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useState, useEffect } from 'react';
import {
    Box,
    Text,
    Spinner,
    VStack,
    Flex,
    SegmentGroup,
    Splitter,
    CodeBlock,
    IconButton,
    Tabs,
    useTabs,
    Center,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getShikiHighlighter } from '../shiki';
import { faCode, faColumns, faTerminal, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import {
    decodeBeast2,
    decodeBeast2For,
    isTypeValueEqual,
    toEastTypeValue,
    toJSONFor,
    ValueTypeOf,
} from '@elaraai/east';
import {
    EastStoreProvider,
    createEastStore,
    EastChakraComponent,
    StateImpl,
    DatasetImpl,
    OverlayImpl,
} from '@elaraai/east-ui-components';
import { useE3Context } from '../context/E3Context';
import { useWorkspaceStatus } from '../hooks/useE3Data';
import { useTaskOutput } from '../hooks/useTaskOutput';
import { useTaskLogs } from '../hooks/useTaskLogs';
import { ErrorDisplay } from './ErrorDisplay';
import { InputPreview } from './InputPreview';
import { UIComponentType } from '@elaraai/east-ui';
import type { TaskStatusInfo } from '@elaraai/e3-api-client';

// Combined platform implementations for decoding Beast2 with Reactive components
const platformImplementations = [...StateImpl, ...DatasetImpl, ...OverlayImpl];

// Hook to load shiki and track ready state
function useShikiReady() {
    const [ready, setReady] = useState(false);
    console.log('[East] useShikiReady: Hook called, ready:', ready);

    useEffect(() => {
        console.log('[East] useShikiReady: useEffect running');
        let cancelled = false;
        getShikiHighlighter()
            .then(() => {
                console.log('[East] useShikiReady: Promise resolved, cancelled:', cancelled);
                if (!cancelled) {
                    setReady(true);
                }
            })
            .catch(err => {
                console.error('[East] useShikiReady: Error:', err);
            });
        return () => {
            console.log('[East] useShikiReady: Cleanup');
            cancelled = true;
        };
    }, []);

    return ready;
}

type ViewMode = 'function' | 'both' | 'logs';

interface TaskPreviewContentProps {
    apiUrl: string;
    workspace: string;
    task: string;
    taskInfo: TaskStatusInfo | null;
    outputHash: string | null;
}


// Combined view state
interface ViewState {
    mode: ViewMode | null;
    prevMode: ViewMode | null;
    sizes: [number, number] | null;
}

// Helper to get sizes for a mode
function getSizesForMode(mode: ViewMode): [number, number] {
    switch (mode) {
        case 'function': return [100, 0];
        case 'logs': return [0, 100];
        default: return [60, 40];
    }
}

/**
 * Inner component that renders the task preview content.
 * Memoized based on task name to force clean re-render on task change.
 */
const TaskPreviewContent = memo(function TaskPreviewContent({
    apiUrl,
    workspace,
    task,
    taskInfo,
    outputHash,
}: TaskPreviewContentProps) {
    // Fetch task output - pass outputHash so query refetches when data changes
    const { data: output, isLoading, error } = useTaskOutput(apiUrl, workspace, taskInfo, outputHash);

    // Fetch task logs (stdout and stderr)
    const { data: stdout } = useTaskLogs(apiUrl, workspace, taskInfo, 'stdout');
    const { data: stderr } = useTaskLogs(apiUrl, workspace, taskInfo, 'stderr');

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
                console.log('[East] Task output decoded as East IR with platform support');
                return value as ValueTypeOf<UIComponentType>;
            } else {
                console.warn('[East] Task output is not of type UIComponentType, got:', type);
                return null;
            }
        } catch (e) {
            console.error('[East] Failed to decode task output:', e);
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


    const [viewState, setViewState] = useState<ViewState>({
        mode: null,
        prevMode: null,
        sizes: null,
    });

    // Set initial view mode once data loads
    useEffect(() => {
        if (isLoading && stdout?.data === undefined && stderr?.data === undefined) return;
        setViewState(prev => {
            if (prev.mode !== null) return prev;
            const mode: ViewMode = ir === null ? 'logs' : 'function';
            const sizes = getSizesForMode(mode);
            return { mode, prevMode: mode, sizes };
        });
    }, [isLoading, stdout?.data, stderr?.data, ir, taskInfo?.status.type]);


    // Handler for view mode change
    const handleViewModeChange = (mode: ViewMode) => {
        setViewState(prev => ({
            ...prev,
            mode,
            prevMode: prev.mode,
            sizes: getSizesForMode(mode),
        }));
    };

    // Function panel content
    const functionPanel = useMemo(() => {
        // Task not up-to-date - show status message
        if (taskInfo?.status.type !== 'up-to-date') {
            return (
                <Box height="100%" display="flex" alignItems="center" justifyContent="center">
                    <VStack gap={2}>
                        <Text color="gray.500">
                            Task is {taskInfo?.status.type ?? 'unknown'}
                        </Text>
                        <Text color="gray.400" fontSize="sm">
                            Run the task to see output
                        </Text>
                    </VStack>
                </Box>
            );
        }

        // Loading - show spinner
        if (isLoading) {
            return (
                <Box height="100%" display="flex" alignItems="center" justifyContent="center">
                    <VStack gap={2}>
                        <Spinner size="md" />
                        <Text color="gray.500" fontSize="sm">Loading component...</Text>
                    </VStack>
                </Box>
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
        // Use printFor to show the raw value as a string
        if (output && ir === null) {
            try {
                const decoded = decodeBeast2(output);
                const toJSON = toJSONFor(decoded.type);
                const printed = JSON.stringify(toJSON(decoded.value), null, 2);
                return (
                    <Box height="100%" overflow="auto" p="4">
                        <CodeBlock.Root code={printed} language="text">
                            <CodeBlock.Header>
                                <Text fontSize="xs" color="gray.500">Raw Output</Text>
                            </CodeBlock.Header>
                            <CodeBlock.Content>
                                <CodeBlock.Code>
                                    <CodeBlock.CodeText />
                                </CodeBlock.Code>
                            </CodeBlock.Content>
                        </CodeBlock.Root>
                    </Box>
                );
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : String(e);
                return (
                    <Box height="100%" overflow="auto" p="4">
                        <CodeBlock.Root code={errorMessage} language="text">
                            <CodeBlock.Header>
                                <Text fontSize="xs">Decode Error</Text>
                                <CodeBlock.CopyTrigger asChild>
                                    <IconButton variant="ghost" size="xs">
                                        <CodeBlock.CopyIndicator copied={<FontAwesomeIcon icon={faCheck} />}>
                                            <FontAwesomeIcon icon={faCopy} />
                                        </CodeBlock.CopyIndicator>
                                    </IconButton>
                                </CodeBlock.CopyTrigger>
                            </CodeBlock.Header>
                            <CodeBlock.Content>
                                <CodeBlock.Code>
                                    <CodeBlock.CodeText />
                                </CodeBlock.Code>
                            </CodeBlock.Content>
                        </CodeBlock.Root>
                    </Box>
                );
            }
        }

        // No output available
        return (
            <Box height="100%" display="flex" alignItems="center" justifyContent="center">
                <Text color="gray.500">
                    No output available for task "{task}"
                </Text>
            </Box>
        );
    }, [ir, task, isLoading, output, taskInfo?.status.type]);

    // Get active tab content
    const activeLogContent = useMemo(() => tabs.value === 'stderr' ? stderrContent : stdoutContent, [tabs.value, stderrContent, stdoutContent]);

    // Track highlighter ready state
    const shikiReady = useShikiReady();
    console.log('[East] TaskPreview: shikiReady:', shikiReady, 'contentLen:', activeLogContent.length);

    // Logs panel content - wait for Shiki to be ready
    const logsPanel = useMemo(() => {
        if (!shikiReady) {
            return (
                <Box height="100%" display="flex" alignItems="center" justifyContent="center">
                    <VStack gap={2}>
                        <Spinner size="md" />
                        <Text color="gray.500" fontSize="sm">Loading syntax highlighter...</Text>
                    </VStack>
                </Box>
            );
        }

        return (
            <Box position="relative" height="100%" width="100%">
                <Box position="absolute" inset="0" overflow="hidden">
                    <Tabs.RootProvider value={tabs} size="sm" variant="line" height={"100%"}>
                        <Box
                            height="100%"
                            display="flex"
                            flexDirection="column"
                            p="4"
                        >
                            <CodeBlock.Root
                                code={activeLogContent}
                                language="bash"
                                flex="1"
                                minHeight="0"
                                display="flex"
                                flexDirection="column"
                            >
                                <CodeBlock.Header flexShrink={0}>
                                    <Tabs.List>
                                        <Tabs.Trigger value="stdout">stdout</Tabs.Trigger>
                                        <Tabs.Trigger value="stderr">stderr</Tabs.Trigger>
                                    </Tabs.List>
                                    <CodeBlock.CopyTrigger asChild>
                                        <IconButton variant="ghost" size="xs">
                                            <CodeBlock.CopyIndicator copied={<FontAwesomeIcon icon={faCheck} />}>
                                                <FontAwesomeIcon icon={faCopy} />
                                            </CodeBlock.CopyIndicator>
                                        </IconButton>
                                    </CodeBlock.CopyTrigger>
                                </CodeBlock.Header>
                                <CodeBlock.Content
                                    flex="1"
                                    minHeight="0"
                                    overflow="auto"
                                >
                                    <CodeBlock.Code>
                                        <CodeBlock.CodeText />
                                    </CodeBlock.Code>
                                </CodeBlock.Content>
                            </CodeBlock.Root>
                        </Box>
                    </Tabs.RootProvider>
                </Box>
            </Box>
        );
    }, [activeLogContent, tabs, shikiReady]);

    // Loading - show while we don't have panel sizes yet
    if (viewState.sizes === null) {
        return (
            <Box
                flex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <VStack gap={2}>
                    <Spinner size="lg" />
                    <Center color="gray.500"><Text>Loading task output...</Text></Center>
                </VStack>
            </Box>
        );
    }

    // Error
    if (error) {
        return <ErrorDisplay message={error instanceof Error ? error.message : String(error)} />;
    }

    // Render the split view
    return (
        <EastStoreProvider store={store}>
            <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
                {/* Toolbar with view toggle */}
                <Flex
                    px={4}
                    py={2}
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    bg="white"
                    align="center"
                    justify="space-between"
                >
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                        {task}
                    </Text>
                    <SegmentGroup.Root
                        size="xs"
                        value={viewState.mode}
                        onValueChange={(details) => handleViewModeChange(details.value as ViewMode)}
                    >
                        <SegmentGroup.Indicator />
                        <SegmentGroup.Item value="function" title="Function">
                            <SegmentGroup.ItemText>
                                <FontAwesomeIcon icon={faCode} />
                            </SegmentGroup.ItemText>
                            <SegmentGroup.ItemHiddenInput />
                        </SegmentGroup.Item>
                        <SegmentGroup.Item value="both" title="Both">
                            <SegmentGroup.ItemText>
                                <FontAwesomeIcon icon={faColumns} />
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
                    <Splitter.Root
                        defaultSize={viewState.sizes!}
                        panels={[
                            { id: 'function', minSize: 0 },
                            { id: 'logs', minSize: 0 },
                        ]}
                        height="100%"
                    >
                        <Splitter.Context>
                            {(splitter) => {
                                // Only update sizes when mode actually changes
                                if (viewState.prevMode !== viewState.mode) {
                                    splitter.setSizes(viewState.sizes!);
                                }

                                return (
                                    <>
                                        <Splitter.Panel id="function" height="100%">
                                            {functionPanel}
                                        </Splitter.Panel>

                                        <Splitter.ResizeTrigger
                                            id="function:logs"
                                            disabled={viewState.mode !== 'both'}
                                            display={viewState.mode === 'both' ? 'flex' : 'none'}
                                        />

                                        <Splitter.Panel id="logs" height="100%">
                                            {logsPanel}
                                        </Splitter.Panel>
                                    </>
                                );
                            }}
                        </Splitter.Context>
                    </Splitter.Root>
                </Box>
            </Box>
        </EastStoreProvider>
    );
}, (prev, next) => prev.task === next.task && prev.workspace === next.workspace && prev.outputHash === next.outputHash);

/**
 * Outer component that handles context and passes props to memoized inner component.
 * Forces clean re-render when task changes via the memo comparison.
 */
export function TaskPreview() {
    const { apiUrl, selection } = useE3Context();
    const selectedWorkspace = selection.type !== 'none' ? selection.workspace : null;
    const selectedTask = selection.type === 'task' ? selection.task : null;

    const { data: status } = useWorkspaceStatus(apiUrl, selectedWorkspace);

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
            <Box
                flex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="gray.50"
            >
                <VStack gap={2}>
                    <Text color="gray.500" fontSize="lg">
                        Select a task to preview
                    </Text>
                    <Text color="gray.400" fontSize="sm">
                        Choose a workspace and task from the tree on the left
                    </Text>
                </VStack>
            </Box>
        );
    }

    return (
        <TaskPreviewContent
            key={`${selectedWorkspace}:${selectedTask}`}
            apiUrl={apiUrl}
            workspace={selectedWorkspace}
            task={selectedTask}
            taskInfo={taskInfo}
            outputHash={outputHash}
        />
    );
}
