/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from 'react';
import {
    Box,
    Text,
    Spinner,
    VStack,
    Flex,
} from '@chakra-ui/react';
import {
    decodeBeast2,
    isTypeValueEqual,
    toEastTypeValue,
    ValueTypeOf,
} from '@elaraai/east';
import {
    EastStoreProvider,
    createEastStore,
    EastChakraComponent,
} from '@elaraai/east-ui-components';
import { useE3Context } from '../context/E3Context';
import { useWorkspaceStatus } from '../hooks/useE3Data';
import { useInputData } from '../hooks/useInputData';
import { ErrorDisplay } from './ErrorDisplay';
import { UIComponentType } from '@elaraai/east-ui';
import type { DatasetStatusInfo } from '@elaraai/e3-api-client';

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
            const decoded = decodeBeast2(output);
            if (isTypeValueEqual(decoded.type, toEastTypeValue(UIComponentType))) {
                console.log('[East] Input decoded as East IR');
                return decoded.value as ValueTypeOf<UIComponentType>;
            } else {
                console.warn('[East] Input is not of type UIComponentType, got:', decoded.type);
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
                <Box height="100%" display="flex" alignItems="center" justifyContent="center">
                    <VStack gap={2}>
                        <Text color="gray.500">
                            Input is {inputInfo?.status.type ?? 'unknown'}
                        </Text>
                        <Text color="gray.400" fontSize="sm">
                            Set the input value to see output
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
                        <Text color="gray.500" fontSize="sm">Loading input...</Text>
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
        if (output && ir === null) {
            return (
                <Box height="100%" display="flex" alignItems="center" justifyContent="center">
                    <Text color="gray.500">
                        Input is not a UIComponent
                    </Text>
                </Box>
            );
        }

        // No output available
        return (
            <Box height="100%" display="flex" alignItems="center" justifyContent="center">
                <Text color="gray.500">
                    No data available for input "{displayName}"
                </Text>
            </Box>
        );
    }, [ir, displayName, isLoading, output, inputInfo?.status.type]);

    // Error
    if (error) {
        return <ErrorDisplay message={error instanceof Error ? error.message : String(error)} />;
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
}, (prev, next) => prev.path === next.path && prev.workspace === next.workspace);

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
