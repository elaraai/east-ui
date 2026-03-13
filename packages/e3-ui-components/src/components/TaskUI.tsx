/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import {
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
import { useTaskOutputPreview } from '../hooks/useTaskOutputPreview.js';
import { StatusDisplay } from './StatusDisplay.js';
import { TaskValue } from './TaskValue.js';
import { UIComponentType } from '@elaraai/east-ui';
import type { RequestOptions } from '@elaraai/e3-api-client';

const platformImplementations = [...StateImpl, ...DatasetImpl, ...OverlayImpl];

export interface TaskUIProps {
    apiUrl: string;
    repo: string;
    workspace: string;
    task: string;
    output: string;
    requestOptions?: RequestOptions;
}

type UIPreviewState =
    | { status: 'loading' }
    | { status: 'no-data' }
    | { status: 'oversized'; sizeBytes: number }
    | { status: 'ui'; ir: ValueTypeOf<UIComponentType> }
    | { status: 'not-ui' }
    | { status: 'decode-error'; error: string };

/**
 * Renders a task's output as an East UI component.
 * Decodes Beast2 data and renders it using EastChakraComponent.
 */
export const TaskUI = memo(function TaskUI({
    apiUrl,
    repo,
    workspace,
    task,
    output,
    requestOptions,
}: TaskUIProps) {
    const { data: preview, isLoading, error } = useTaskOutputPreview(apiUrl, repo, workspace, output, requestOptions);

    const previewState = useMemo<UIPreviewState>(() => {
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

        const totalStart = performance.now();
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
        const buildDecoderMs = performance.now() - totalStart;

        let isUI = false;
        try {
            isUI = isTypeValueEqual(preview.type, toEastTypeValue(UIComponentType));
        } catch {
            // Not a UI component
        }

        if (!isUI) {
            return { status: 'not-ui' };
        }

        try {
            const decodeStart = performance.now();
            const ir = decoder(rawOutput) as ValueTypeOf<UIComponentType>;
            const decodeMs = performance.now() - decodeStart;

            const totalMs = performance.now() - totalStart;
            console.log(`[east-ui] decodeBeast2 total: ${totalMs.toFixed(1)}ms`);
            console.log(`  buildDecoder: ${buildDecoderMs.toFixed(1)}ms, decode: ${decodeMs.toFixed(1)}ms`);
            console.log(`  payload size: ${(rawOutput.length / 1024).toFixed(1)} KB`);

            return { status: 'ui', ir };
        } catch (e) {
            return {
                status: 'decode-error',
                error: e instanceof Error ? e.message : String(e),
            };
        }
    }, [preview, isLoading]);

    const store = useMemo(() => createEastStore(), []);

    if (error) {
        return <StatusDisplay variant="error" title="Failed to load task output" details={error instanceof Error ? error.message : String(error)} />;
    }

    const content = (() => {
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
            case 'ui':
                return (
                    <Box height="100%" overflow="auto" p="4">
                        <EastChakraComponent value={previewState.ir} />
                    </Box>
                );
            case 'not-ui':
                return (
                    <TaskValue
                        apiUrl={apiUrl}
                        repo={repo}
                        workspace={workspace}
                        task={task}
                        output={output}
                        {...(requestOptions != null && { requestOptions })}
                    />
                );
            case 'decode-error':
                return <StatusDisplay variant="error" title="Failed to render output" details={previewState.error} />;
        }
    })();

    return (
        <EastStoreProvider store={store}>
            {content}
        </EastStoreProvider>
    );
});
