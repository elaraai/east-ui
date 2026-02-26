/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from 'react';
import {
    Box,
    Text,
    Flex,
} from '@chakra-ui/react';
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
import { useInputDataPreview } from '../hooks/useInputDataPreview.js';
import { StatusDisplay } from './StatusDisplay.js';
import { EastValueViewer } from './EastValueViewer.js';
import { UIComponentType } from '@elaraai/east-ui';
import type { DatasetStatusInfo, RequestOptions } from '@elaraai/e3-api-client';
import { formatApiError, formatError } from '../errors.js';
import { ErrorBoundary } from './ErrorBoundary.js';

// Combined platform implementations for decoding Beast2 with Reactive components
const platformImplementations = [...StateImpl, ...DatasetImpl, ...OverlayImpl];

export interface InputPreviewProps {
    apiUrl: string;
    repo: string;
    workspace: string;
    path: string;
    inputInfo: DatasetStatusInfo | null;
    requestOptions?: RequestOptions;
}

/**
 * Renders a preview of an input dataset value.
 * Decodes Beast2 data and renders as an East UI component if possible,
 * otherwise displays the raw data using EastValueViewer.
 */
export const InputPreview = memo(function InputPreview({
    apiUrl,
    repo,
    workspace,
    path,
    inputInfo,
    requestOptions,
}: InputPreviewProps) {
    // Fetch input data with size-gated preview
    const { data: preview, isLoading, error } = useInputDataPreview(apiUrl, repo, workspace, inputInfo, requestOptions);

    // Extract raw bytes (if loaded)
    const output = useMemo(() =>
        preview?.value.type === 'some' ? preview.value.value : undefined,
        [preview]
    );

    // Decode the output, checking if it's a UIComponentType
    const decode = useMemo((): { type: 'none' } | { type: 'ui'; value: ValueTypeOf<UIComponentType> } | { type: 'ui-error'; error: Error } | { type: 'other' } => {
        if (!output) return { type: 'none' };
        try {
            const { type } = decodeBeast2(output);
            if (!isTypeValueEqual(type, toEastTypeValue(UIComponentType))) return { type: 'other' };
            try {
                const decoder = decodeBeast2For(UIComponentType, { platform: platformImplementations });
                return { type: 'ui', value: decoder(output) as ValueTypeOf<UIComponentType> };
            } catch (e) {
                return { type: 'ui-error', error: e instanceof Error ? e : new Error(String(e)) };
            }
        } catch {
            return { type: 'other' };
        }
    }, [output]);

    // Create store - recreate when decode changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const store = useMemo(() => createEastStore(), [decode]);

    // Get display name from path
    const displayName = path.replace(/^\.inputs\./, '');

    // Content panel
    const content = useMemo(() => {
        // Input not up-to-date - show status message
        if (inputInfo?.status.type !== 'up-to-date') {
            return (
                <StatusDisplay
                    variant="info"
                    title={`Input is ${inputInfo?.status.type ?? 'unknown'}`}
                    message="Set the input value to see output"
                />
            );
        }

        // Loading - show spinner
        if (isLoading) {
            return (
                <StatusDisplay
                    variant="loading"
                    title="Loading input..."
                />
            );
        }

        if (!preview) {
            return (
                <StatusDisplay
                    variant="info"
                    title={`No data available for input "${displayName}"`}
                />
            );
        }

        // Oversized — value not fetched
        if (preview.value.type === 'none') {
            const sizeBytes = Number(preview.size.type === 'some' ? preview.size.value : 0);
            return (
                <StatusDisplay
                    variant="warning"
                    title="Input too large to display"
                    message={`The input data is ${(sizeBytes / 1024 / 1024).toFixed(2)} MB, which exceeds the 10 MB display limit.`}
                />
            );
        }

        // UIComponent loaded - render it
        if (decode.type === 'ui') {
            return (
                <ErrorBoundary>
                    <Box height="100%" overflow="auto" p="4">
                        <EastChakraComponent value={decode.value} />
                    </Box>
                </ErrorBoundary>
            );
        }

        // UIComponent type but decode failed - show the error
        if (decode.type === 'ui-error') {
            return <StatusDisplay variant="error" title="Failed to render data" details={formatError(decode.error)} />;
        }

        // Not a UIComponent - output exists but couldn't decode as UIComponent
        // Render using the type-aware EastValueViewer
        if (output && decode.type === 'other') {
            // Check output size - if too large, show warning instead of rendering
            const MAX_RENDER_SIZE = 512 * 1024; // 512KB
            const outputSize = output instanceof Uint8Array ? output.length : 0;

            if (outputSize > MAX_RENDER_SIZE) {
                return (
                    <StatusDisplay
                        variant="warning"
                        title="Input too large to display"
                        message={`The input data is ${(outputSize / 1024 / 1024).toFixed(2)} MB, which exceeds the ${(MAX_RENDER_SIZE / 1024).toFixed(0)} KB display limit. Consider using a smaller dataset or accessing the data programmatically.`}
                    />
                );
            }

            try {
                const decoded = decodeBeast2(output);
                return (
                    <Box height="100%" overflow="auto" p="4">
                        <Text fontSize="xs" color="gray.500" mb={2}>Raw Data ({(outputSize / 1024).toFixed(1)} KB)</Text>
                        <EastValueViewer type={decoded.type} value={decoded.value} />
                    </Box>
                );
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : String(e);
                return <StatusDisplay variant="error" title="Failed to render data" details={errorMessage} />;
            }
        }

        // No output available
        return (
            <StatusDisplay
                variant="info"
                title={`No data available for input "${displayName}"`}
            />
        );
    }, [preview, decode, displayName, isLoading, output, inputInfo?.status.type]);

    // Error
    if (error) {
        const { message, details } = formatApiError(error);
        return <StatusDisplay variant="error" title="Failed to load input" message={message} details={details ?? ""} />;
    }

    // Render
    return (
        <EastStoreProvider store={store}>
            <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
                {/* Header */}
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
                        {displayName}
                    </Text>
                </Flex>

                {/* Content */}
                <Box flex={1} overflow="hidden" minHeight={0}>
                    {content}
                </Box>
            </Box>
        </EastStoreProvider>
    );
}, (prev, next) => {
    const prevHash = prev.inputInfo?.hash?.type === 'some' ? prev.inputInfo.hash.value : null;
    const nextHash = next.inputInfo?.hash?.type === 'some' ? next.inputInfo.hash.value : null;
    return prev.path === next.path && prev.workspace === next.workspace && prevHash === nextHash;
});
