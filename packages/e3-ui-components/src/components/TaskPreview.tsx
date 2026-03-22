/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useEffect, useRef } from 'react';
import { usePersistedState } from '@elaraai/east-ui-components';
import {
    Box,
    Text,
    Flex,
    SegmentGroup,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { TaskLogs } from './TaskLogs.js';
import { DatasetContent } from './DatasetRenderer.js';
import { useDatasetPreview, useDatasetDownload } from '../hooks/useDatasetPreview.js';
import type { RequestOptions } from '@elaraai/e3-api-client';

type ViewMode = 'output' | 'logs';

interface TaskPreviewPersistedState {
    viewMode: ViewMode;
}

export interface TaskPreviewProps {
    apiUrl: string;
    repo: string;
    workspace: string;
    task: string;
    output: string;
    requestOptions?: RequestOptions;
    /** Storage key for persisting view mode in localStorage. Defaults to task name. */
    storageKey?: string;
}

export const TaskPreview = memo(function TaskPreview({
    apiUrl,
    repo,
    workspace,
    task,
    output,
    requestOptions,
    storageKey,
}: TaskPreviewProps) {
    const preview = useDatasetPreview(apiUrl, repo, workspace, output, {
        ...(requestOptions != null && { requestOptions }),
    });
    const download = useDatasetDownload(apiUrl, repo, workspace, output, requestOptions);

    const { state: persistedState, setState: setPersistedState } = usePersistedState<TaskPreviewPersistedState>(
        storageKey ?? task,
        { viewMode: 'output' },
    );
    const viewMode = persistedState.viewMode;
    const setViewMode = (mode: ViewMode) => setPersistedState(prev => ({ ...prev, viewMode: mode }));

    // Auto-select tab on first data load: UI → output, non-UI → logs
    const hasAutoSelected = useRef(false);
    useEffect(() => {
        if (hasAutoSelected.current) return;
        if (preview.state === 'ui') {
            hasAutoSelected.current = true;
            setViewMode('output');
        } else if (preview.state === 'value' || preview.state === 'oversized' || preview.state === 'error') {
            hasAutoSelected.current = true;
            setViewMode('logs');
        }
    }, [preview.state]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Box height="100%" display="flex" flexDirection="column" overflow="hidden">
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
            <Box flex={1} overflow="hidden" minHeight={0}>
                {viewMode === 'output' ? (
                    <Box height="100%" overflow="hidden" minHeight={0}>
                        <DatasetContent preview={preview} download={download} datasetPath={output} />
                    </Box>
                ) : (
                    <TaskLogs
                        apiUrl={apiUrl}
                        repo={repo}
                        workspace={workspace}
                        task={task}
                        {...(requestOptions != null && { requestOptions })}
                    />
                )}
            </Box>
        </Box>
    );
}, (prev, next) => prev.task === next.task && prev.repo === next.repo && prev.workspace === next.workspace && prev.output === next.output && prev.storageKey === next.storageKey);
