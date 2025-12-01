/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { Flex, Text, Badge } from '@chakra-ui/react';
import { ElaraLogo } from './ElaraLogo';

interface ToolbarProps {
    filename: string;
    isWatching: boolean;
    hasError: boolean;
}

export function Toolbar({ filename, isWatching, hasError }: ToolbarProps) {
    return (
        <Flex
            as="header"
            align="center"
            justify="space-between"
            px={4}
            py={2}
            bg="white"
            color="black"
            borderBottom="1px solid"
            borderColor="gray.200"
        >
            <Flex align="center" gap={3}>
                <ElaraLogo variant="collapsed" height="24px" />
                <Text fontSize="sm" fontWeight="medium" color="black">
                    East UI Preview
                </Text>
            </Flex>

            <Flex align="center" gap={3}>
                <Text fontSize="xs" color="gray.600">
                    {filename}
                </Text>
                {isWatching && (
                    <Badge
                        colorPalette={hasError ? "red" : "green"}
                        variant="subtle"
                        fontSize="xs"
                    >
                        {hasError ? "Error" : "Watching"}
                    </Badge>
                )}
            </Flex>
        </Flex>
    );
}
