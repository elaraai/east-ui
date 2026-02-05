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
import { useInputData } from '../hooks/useInputData';
import { StatusDisplay } from './StatusDisplay';
import { EastValueViewer } from './EastValueViewer';
import { UIComponentType } from '@elaraai/east-ui';
import type { DatasetStatusInfo } from '@elaraai/e3-api-client';

// Combined platform implementations for decoding Beast2 with Reactive components
const platformImplementations = [...StateImpl, ...DatasetImpl, ...OverlayImpl];

interface InputPreviewContentProps {
    apiUrl: string;
    workspace: string;
    path: string;
    inputInfo: DatasetStatusInfo | null;
}

/**
 * Inner component that renders the input preview content.
 */
const InputPreviewContent = memo(function InputPreviewContent({
    apiUrl,
    workspace,
    path,
    inputInfo,
}: InputPreviewContentProps) {
    // Fetch input data
    const { data: output, isLoading, error } = useInputData(apiUrl, workspace, inputInfo);

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
                console.log('[East] Input decoded as East IR with platform support');
                return value as ValueTypeOf<UIComponentType>;
            } else {
                console.warn('[East] Input is not of type UIComponentType, got:', type);
                return null;
            }
        } catch (e) {
            console.error('[East] Failed to decode input:', e);
            return null;
        }
    }, [output]);

    // Create store - recreate when IR changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const store = useMemo(() => createEastStore(), [ir]);

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
    }, [ir, displayName, isLoading, output, inputInfo?.status.type]);

    // Error
    if (error) {
        return <StatusDisplay variant="error" title="Failed to load input" details={error instanceof Error ? error.message : String(error)} />;
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

/**
 * Outer component that handles context and passes props to memoized inner component.
 */
export function InputPreview() {
    const { apiUrl, selection } = useE3Context();

    // Extract workspace and path from selection (only valid for input type)
    const workspace = selection.type === 'input' ? selection.workspace : null;
    const path = selection.type === 'input' ? selection.path : null;

    const { data: status } = useWorkspaceStatus(apiUrl, workspace);

    // Find the input info from datasets
    const inputInfo = useMemo(() => {
        if (!status || !path) return null;
        return status.datasets.find((d) => d.path === path) ?? null;
    }, [status, path]);

    // Only render for input selection
    if (selection.type !== 'input' || !workspace || !path) {
        return null;
    }

    return (
        <InputPreviewContent
            key={`${workspace}:${path}`}
            apiUrl={apiUrl}
            workspace={workspace}
            path={path}
            inputInfo={inputInfo}
        />
    );
}
