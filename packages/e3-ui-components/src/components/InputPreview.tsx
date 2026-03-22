/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo } from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import type { RequestOptions } from '@elaraai/e3-api-client';
import { DatasetRenderer } from './DatasetRenderer.js';

export interface InputPreviewProps {
    apiUrl: string;
    repo: string;
    workspace: string;
    path: string;
    requestOptions?: RequestOptions;
}

export const InputPreview = memo(function InputPreview({
    apiUrl,
    repo,
    workspace,
    path,
    requestOptions,
}: InputPreviewProps) {
    const displayName = path.replace(/^\.inputs\./, '');

    return (
        <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
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
            <Box flex={1} overflow="hidden" minHeight={0}>
                <DatasetRenderer
                    apiUrl={apiUrl}
                    repo={repo}
                    workspace={workspace}
                    datasetPath={path}
                    {...(requestOptions != null && { requestOptions })}
                />
            </Box>
        </Box>
    );
}, (prev, next) => prev.path === next.path && prev.workspace === next.workspace);
