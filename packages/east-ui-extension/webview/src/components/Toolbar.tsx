/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { Flex, Text, Badge, IconButton } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { ElaraLogo } from './ElaraLogo';
import { useE3Context } from '../context/E3Context';

export function Toolbar() {
    const { repoPath, selectedWorkspace, selectedTask, toggleSidebar } = useE3Context();

    // Get just the repo name from the full path
    const repoName = repoPath.split('/').pop() ?? repoPath;

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
                <IconButton
                    aria-label="Toggle sidebar"
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                >
                    <FontAwesomeIcon icon={faBars} />
                </IconButton>
                <ElaraLogo variant="collapsed" height="24px" />
                <Text fontSize="sm" fontWeight="medium" color="black">
                    East UI Preview
                </Text>
            </Flex>

            <Flex align="center" gap={3}>
                <Text fontSize="xs" color="gray.600" title={repoPath}>
                    {repoName}
                </Text>
                <Badge colorPalette="green" variant="subtle" fontSize="xs">
                    Connected
                </Badge>
                {selectedWorkspace && (
                    <Badge colorPalette="blue" variant="subtle" fontSize="xs">
                        {selectedWorkspace}
                        {selectedTask && ` / ${selectedTask}`}
                    </Badge>
                )}
            </Flex>
        </Flex>
    );
}
