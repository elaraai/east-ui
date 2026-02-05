/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { Box, Text, VStack, Spinner, Code } from '@chakra-ui/react';

type StatusVariant = 'error' | 'warning' | 'info' | 'loading';

interface StatusDisplayProps {
    variant: StatusVariant;
    title: string;
    message?: string;
    /** Optional code/details block to show below the message */
    details?: string;
}

const variantStyles: Record<StatusVariant, {
    bg: string;
    titleColor: string;
    messageColor: string;
    detailsBg: string;
    detailsColor: string;
}> = {
    error: {
        bg: 'red.50',
        titleColor: 'red.600',
        messageColor: 'red.500',
        detailsBg: 'red.100',
        detailsColor: 'red.800',
    },
    warning: {
        bg: 'yellow.50',
        titleColor: 'yellow.700',
        messageColor: 'yellow.600',
        detailsBg: 'yellow.100',
        detailsColor: 'yellow.800',
    },
    info: {
        bg: 'gray.50',
        titleColor: 'gray.500',
        messageColor: 'gray.400',
        detailsBg: 'gray.100',
        detailsColor: 'gray.700',
    },
    loading: {
        bg: 'gray.50',
        titleColor: 'gray.500',
        messageColor: 'gray.400',
        detailsBg: 'gray.100',
        detailsColor: 'gray.700',
    },
};

/**
 * Reusable component for displaying status messages (errors, warnings, info, loading).
 * Use this instead of ad-hoc Box/VStack combinations for consistent styling.
 */
export function StatusDisplay({ variant, title, message, details }: StatusDisplayProps) {
    const styles = variantStyles[variant];

    // Centered layout for info and loading states
    if (variant === 'info' || variant === 'loading') {
        return (
            <Box
                height="100%"
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg={styles.bg}
            >
                <VStack gap={2}>
                    {variant === 'loading' && <Spinner size="md" />}
                    <Text color={styles.titleColor} fontSize={variant === 'loading' ? 'sm' : 'lg'}>
                        {title}
                    </Text>
                    {message && (
                        <Text color={styles.messageColor} fontSize="sm">
                            {message}
                        </Text>
                    )}
                    {details && (
                        <Code
                            display="block"
                            whiteSpace="pre-wrap"
                            p={4}
                            bg={styles.detailsBg}
                            color={styles.detailsColor}
                            borderRadius="md"
                            fontSize="sm"
                            mt={2}
                        >
                            {details}
                        </Code>
                    )}
                </VStack>
            </Box>
        );
    }

    // Block layout for error and warning states
    return (
        <Box p={6} bg={styles.bg} height="100%" width="100%">
            <Text fontSize="lg" fontWeight="bold" color={styles.titleColor} mb={4}>
                {title}
            </Text>
            {message && (
                <Text color={styles.messageColor} mb={details ? 4 : 0}>
                    {message}
                </Text>
            )}
            {details && (
                <Code
                    display="block"
                    whiteSpace="pre-wrap"
                    p={4}
                    bg={styles.detailsBg}
                    color={styles.detailsColor}
                    borderRadius="md"
                    fontSize="sm"
                >
                    {details}
                </Code>
            )}
        </Box>
    );
}
