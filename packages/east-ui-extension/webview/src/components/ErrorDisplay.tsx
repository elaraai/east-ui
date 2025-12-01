/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { Box, Text, Code } from '@chakra-ui/react';

interface ErrorDisplayProps {
    message: string;
}

export function ErrorDisplay({ message }: ErrorDisplayProps) {
    return (
        <Box p={6} bg="red.50" minH="calc(100vh - 48px)">
            <Text fontSize="lg" fontWeight="bold" color="red.600" mb={4}>
                Failed to render component
            </Text>
            <Code
                display="block"
                whiteSpace="pre-wrap"
                p={4}
                bg="red.100"
                color="red.800"
                borderRadius="md"
                fontSize="sm"
            >
                {message}
            </Code>
        </Box>
    );
}
