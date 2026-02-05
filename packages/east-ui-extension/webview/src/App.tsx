/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { ChakraProvider, defaultSystem, Box, Flex } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OverlayManagerProvider } from '@elaraai/east-ui-components';
import { E3Provider, useE3Context } from './context/E3Context';
import { Toolbar } from './components/Toolbar';
import { WorkspaceTree } from './components/WorkspaceTree';
import { TaskPreview } from './components/TaskPreview';
import { StatusDisplay } from './components/StatusDisplay';

declare global {
    interface Window {
        __E3_API_URL__: string;
        __E3_REPO_PATH__: string;
    }
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 30_000, // 30 seconds
        },
    },
});

function AppContent() {
    const { sidebarVisible } = useE3Context();

    return (
        <Flex direction="column" height="100vh">
            <Toolbar />
            <Flex flex={1} overflow="hidden">
                {/* Sidebar with workspace tree */}
                {sidebarVisible && (
                    <Box
                        width="250px"
                        flexShrink={0}
                        borderRight="1px solid"
                        borderColor="gray.200"
                        bg="white"
                        overflowY="auto"
                    >
                        <WorkspaceTree />
                    </Box>
                )}

                {/* Main content area */}
                <Box flex={1} minWidth={0} height="100%" overflow="hidden">
                    <TaskPreview />
                </Box>
            </Flex>
        </Flex>
    );
}

export function App() {
    const apiUrl = window.__E3_API_URL__;
    const repoPath = window.__E3_REPO_PATH__;

    // Validate configuration
    if (!apiUrl || !repoPath) {
        return (
            <ChakraProvider value={defaultSystem}>
                <StatusDisplay variant="error" title="Configuration Error" details="Missing configuration: API URL or repository path not provided" />
            </ChakraProvider>
        );
    }

    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider value={defaultSystem}>
                <OverlayManagerProvider>
                    <E3Provider apiUrl={apiUrl} repoPath={repoPath}>
                        <AppContent />
                    </E3Provider>
                </OverlayManagerProvider>
            </ChakraProvider>
        </QueryClientProvider>
    );
}
