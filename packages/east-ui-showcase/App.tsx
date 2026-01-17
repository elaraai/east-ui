/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    Box,
    Container,
    Flex,
    Tabs,
    Text,
} from "@chakra-ui/react";
import { UIStoreProvider, State, OverlayManagerProvider } from "@elaraai/east-ui-components";
import { ElaraLogo } from "./components/ElaraLogo";
import {
    OverviewPage,
    TypographyPage,
    ButtonsPage,
    FormsPage,
    FeedbackPage,
    DisplayPage,
    ChartsPage,
    LayoutPage,
    DisclosurePage,
    CollectionsPage,
    PlatformPage,
    ReactivePage,
    ContainerPage,
    OverlaysPage,
} from "./pages";

// Use State.store singleton - same store that State.Implementation writes to
const store = State.store;

const tabs = [
    { key: "overview", label: "Overview" },
    { key: "typography", label: "Typography" },
    { key: "buttons", label: "Buttons" },
    { key: "forms", label: "Forms" },
    { key: "feedback", label: "Feedback" },
    { key: "display", label: "Display" },
    { key: "layout", label: "Layout" },
    { key: "container", label: "Container" },
    { key: "overlays", label: "Overlays" },
    { key: "disclosure", label: "Disclosure" },
    { key: "collections", label: "Collections" },
    { key: "charts", label: "Charts" },
    { key: "platform", label: "Platform" },
    { key: "reactive", label: "Reactive" },
];

export function App() {
    return (
        <UIStoreProvider store={store}>
            <OverlayManagerProvider>
            <Box bg="gray.50" _dark={{ bg: "gray.900" }} minH="100vh">
                {/* Header */}
                <Box
                    bg="white"
                    _dark={{ bg: "gray.800" }}
                    borderBottomWidth="1px"
                    borderColor="gray.200"
                    py={4}
                >
                        <Container maxW="container.xl">
                            <Flex align="center" gap={3}>
                                <ElaraLogo height="28px" />
                                <Text fontSize="lg" fontWeight="semibold">
                                    East UI <Text as="span" color="gray.500" fontWeight="normal">Showcase</Text>
                                </Text>
                            </Flex>
                        </Container>
                </Box>

                {/* Tabs */}
                <Container maxW="container.xl" py={6}>
                    <Tabs.Root defaultValue="overview" variant="enclosed" lazyMount={true}>
                        <Tabs.List>
                            {tabs.map((tab) => (
                                <Tabs.Trigger key={tab.key} value={tab.key}>
                                    {tab.label}
                                </Tabs.Trigger>
                            ))}
                        </Tabs.List>

                        <Box pt={6}>
                            <Tabs.Content value="overview">
                                <OverviewPage />
                            </Tabs.Content>
                            <Tabs.Content value="typography">
                                <TypographyPage />
                            </Tabs.Content>
                            <Tabs.Content value="buttons">
                                <ButtonsPage />
                            </Tabs.Content>
                            <Tabs.Content value="forms">
                                <FormsPage />
                            </Tabs.Content>
                            <Tabs.Content value="feedback">
                                <FeedbackPage />
                            </Tabs.Content>
                            <Tabs.Content value="display">
                                <DisplayPage />
                            </Tabs.Content>
                            <Tabs.Content value="layout">
                                <LayoutPage />
                            </Tabs.Content>
                            <Tabs.Content value="container">
                                <ContainerPage />
                            </Tabs.Content>
                            <Tabs.Content value="overlays">
                                <OverlaysPage />
                            </Tabs.Content>
                            <Tabs.Content value="disclosure">
                                <DisclosurePage />
                            </Tabs.Content>
                            <Tabs.Content value="collections">
                                <CollectionsPage />
                            </Tabs.Content>
                            <Tabs.Content value="charts">
                                <ChartsPage />
                            </Tabs.Content>
                            <Tabs.Content value="platform">
                                <PlatformPage />
                            </Tabs.Content>
                            <Tabs.Content value="reactive">
                                <ReactivePage />
                            </Tabs.Content>
                        </Box>
                    </Tabs.Root>
                </Container>
            </Box>
            </OverlayManagerProvider>
        </UIStoreProvider>
    );
}
