/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useState } from 'react';
import {
    Box,
    Text,
    Flex,
    SegmentGroup,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { TaskLogs } from './TaskLogs.js';
import { TaskUI } from './TaskUI.js';
import type { RequestOptions } from '@elaraai/e3-api-client';

type ViewMode = 'output' | 'logs';

export interface TaskPreviewProps {
    apiUrl: string;
    repo: string;
    workspace: string;
    task: string;
    output: string;
    requestOptions?: RequestOptions;
}

/**
 * Renders a preview of a task's output and logs.
 * Composes TaskUI/TaskValue for output and TaskLogs for stdout/stderr.
 */
export const TaskPreview = memo(function TaskPreview({
    apiUrl,
    repo,
    workspace,
    task,
    output,
    requestOptions,
}: TaskPreviewProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('output');

    return (
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
                {viewMode === 'output' ? (
                    <TaskUI
                        apiUrl={apiUrl}
                        repo={repo}
                        workspace={workspace}
                        task={task}
                        output={output}
                        {...(requestOptions != null && { requestOptions })}
                    />
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
}, (prev, next) => prev.task === next.task && prev.repo === next.repo && prev.workspace === next.workspace && prev.output === next.output);
