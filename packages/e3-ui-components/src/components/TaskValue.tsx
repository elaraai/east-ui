/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { EastValueViewer } from './EastValueViewer.js';
import {
    decodeBeast2For,
} from '@elaraai/east';
import { useTaskOutputPreview } from '../hooks/useTaskOutputPreview.js';
import { StatusDisplay } from './StatusDisplay.js';
import type { RequestOptions } from '@elaraai/e3-api-client';

// Combined platform implementations for decoding Beast2
import {
    StateImpl,
    DatasetImpl,
    OverlayImpl,
} from '@elaraai/east-ui-components';

const platformImplementations = [...StateImpl, ...DatasetImpl, ...OverlayImpl];

export interface TaskValueProps {
    apiUrl: string;
    repo: string;
    workspace: string;
    task: string;
    output: string;
    requestOptions?: RequestOptions;
}

// Discriminated union for value-only preview states
type ValuePreviewState =
    | { status: 'loading' }
    | { status: 'no-data' }
    | { status: 'oversized'; sizeBytes: number }
    | { status: 'value'; rawOutput: Uint8Array; decoder: (data: Uint8Array) => any }
    | { status: 'decode-error'; error: string };

/**
 * Renders a preview of a task's non-UI output value.
 * Decodes Beast2 data and displays it using EastValueViewer.
 */
export const TaskValue = memo(function TaskValue({
    apiUrl,
    repo,
    workspace,
    output,
    requestOptions,
}: TaskValueProps) {
    const { data: preview, isLoading, error } = useTaskOutputPreview(apiUrl, repo, workspace, output, requestOptions);

    const previewState = useMemo<ValuePreviewState>(() => {
        if (!preview || isLoading) return { status: 'loading' };

        const hasData = preview.refType === 'value' && preview.hash?.type === 'some';
        if (!hasData) return { status: 'no-data' };

        if (preview.value.type === 'none') {
            return {
                status: 'oversized',
                sizeBytes: Number(preview.size.type === 'some' ? preview.size.value : 0),
            };
        }

        const rawOutput = preview.value.value;

        let decoder: (data: Uint8Array) => any;
        try {
            decoder = decodeBeast2For(preview.type, {
                platform: platformImplementations,
                skipTypeCheck: true,
            });
        } catch (e) {
            return {
                status: 'decode-error',
                error: e instanceof Error ? e.message : String(e),
            };
        }

        return { status: 'value', rawOutput, decoder };
    }, [preview, isLoading]);

    if (error) {
        return <StatusDisplay variant="error" title="Failed to load task output" details={error instanceof Error ? error.message : String(error)} />;
    }

    switch (previewState.status) {
        case 'loading':
            return <StatusDisplay variant="loading" title="Loading output..." />;
        case 'no-data':
            return <StatusDisplay variant="info" title="No output available" message="Run the task to see output" />;
        case 'oversized':
            return (
                <StatusDisplay
                    variant="warning"
                    title="Output too large to display"
                    message={`The task output is ${(previewState.sizeBytes / 1024 / 1024).toFixed(2)} MB, which exceeds the 10 MB display limit.`}
                />
            );
        case 'decode-error':
            return <StatusDisplay variant="error" title="Failed to render output" details={previewState.error} />;
        case 'value':
            try {
                const decoded = previewState.decoder(previewState.rawOutput);
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
});
