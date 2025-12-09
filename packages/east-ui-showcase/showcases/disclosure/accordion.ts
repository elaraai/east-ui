import { East, some, StringType, NullType, ArrayType } from "@elaraai/east";
import { Accordion, UIComponentType, Grid, Text, Box, Stack, State, Reactive, Badge } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Accordion showcase - demonstrates collapsible content panels.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic accordion
        const basic = $.let(
            ShowcaseCard(
                "Basic Accordion",
                "Simple collapsible sections",
                Box.Root([
                    Accordion.Root([
                        Accordion.Item("item-1", "What is East UI?", [
                            Box.Root([Text.Root("East UI is a typed UI component library for building data-driven applications.")], { padding: "4" }),
                        ]),
                        Accordion.Item("item-2", "How do I install it?", [
                            Box.Root([Text.Root("Run npm install @elaraai/east-ui to add it to your project.")], { padding: "4" }),
                        ]),
                        Accordion.Item("item-3", "Is it open source?", [
                            Box.Root([Text.Root("Yes, East UI is available under the AGPL-3.0 license.")], { padding: "4" }),
                        ]),
                    ]),
                ], { width: "100%" }),
                some(`
                    Box.Root([
                        Accordion.Root([
                            Accordion.Item("item-1", "What is East UI?", [
                                Box.Root([Text.Root("East UI is a typed UI component library for building data-driven applications.")], { padding: "4" }),
                            ]),
                            Accordion.Item("item-2", "How do I install it?", [
                                Box.Root([Text.Root("Run npm install @elaraai/east-ui to add it to your project.")], { padding: "4" }),
                            ]),
                            Accordion.Item("item-3", "Is it open source?", [
                                Box.Root([Text.Root("Yes, East UI is available under the AGPL-3.0 license.")], { padding: "4" }),
                            ]),
                        ]),
                    ], { width: "100%" })
                `)
            )
        );

        // Multiple panels open
        const multiple = $.let(
            ShowcaseCard(
                "Multiple Panels",
                "Allow multiple sections open at once",
                Box.Root([
                    Accordion.Root([
                        Accordion.Item("section-1", "Section 1", [
                            Box.Root([Text.Root("Content for the first section. This panel can stay open while others are opened.")], { padding: "4" }),
                        ]),
                        Accordion.Item("section-2", "Section 2", [
                            Box.Root([Text.Root("Content for the second section. Multiple panels can be expanded simultaneously.")], { padding: "4" }),
                        ]),
                        Accordion.Item("section-3", "Section 3", [
                            Box.Root([Text.Root("Content for the third section.")], { padding: "4" }),
                        ]),
                    ], {
                        multiple: true,
                    }),
                ], { width: "100%" }),
                some(`
                    Box.Root([
                        Accordion.Root([
                            Accordion.Item("section-1", "Section 1", [
                                Box.Root([Text.Root("Content for the first section.")], { padding: "4" }),
                            ]),
                            Accordion.Item("section-2", "Section 2", [
                                Box.Root([Text.Root("Content for the second section.")], { padding: "4" }),
                            ]),
                            Accordion.Item("section-3", "Section 3", [
                                Box.Root([Text.Root("Content for the third section.")], { padding: "4" }),
                            ]),
                        ], {
                            multiple: true,
                        }),
                    ], { width: "100%" })
                `)
            )
        );

        // Collapsible (all can be closed)
        const collapsible = $.let(
            ShowcaseCard(
                "Collapsible",
                "All panels can be collapsed",
                Box.Root([
                    Accordion.Root([
                        Accordion.Item("a", "Panel A", [
                            Box.Root([Text.Root("This accordion allows all panels to be collapsed.")], { padding: "4" }),
                        ]),
                        Accordion.Item("b", "Panel B", [
                            Box.Root([Text.Root("Click an open panel's trigger to collapse it.")], { padding: "4" }),
                        ]),
                    ], {
                        collapsible: true,
                    }),
                ], { width: "100%" }),
                some(`
                    Box.Root([
                        Accordion.Root([
                            Accordion.Item("a", "Panel A", [
                                Box.Root([Text.Root("This accordion allows all panels to be collapsed.")], { padding: "4" }),
                            ]),
                            Accordion.Item("b", "Panel B", [
                                Box.Root([Text.Root("Click an open panel's trigger to collapse it.")], { padding: "4" }),
                            ]),
                        ], {
                            collapsible: true,
                        }),
                    ], { width: "100%" })
                `)
            )
        );

        // Enclosed variant
        const enclosed = $.let(
            ShowcaseCard(
                "Enclosed Variant",
                "Bordered accordion style",
                Box.Root([
                    Accordion.Root([
                        Accordion.Item("profile", "Profile Settings", [
                            Box.Root([Text.Root("Manage your profile information and preferences.")], { padding: "4" }),
                        ]),
                        Accordion.Item("security", "Security", [
                            Box.Root([Text.Root("Configure password, two-factor authentication, and security options.")], { padding: "4" }),
                        ]),
                        Accordion.Item("notifications", "Notifications", [
                            Box.Root([Text.Root("Control email and push notification preferences.")], { padding: "4" }),
                        ]),
                    ], {
                        variant: "enclosed",
                        collapsible: true,
                    }),
                ], { width: "100%" }),
                some(`
                    Box.Root([
                        Accordion.Root([
                            Accordion.Item("profile", "Profile Settings", [
                                Box.Root([Text.Root("Manage your profile information and preferences.")], { padding: "4" }),
                            ]),
                            Accordion.Item("security", "Security", [
                                Box.Root([Text.Root("Configure password, two-factor authentication, and security options.")], { padding: "4" }),
                            ]),
                            Accordion.Item("notifications", "Notifications", [
                                Box.Root([Text.Root("Control email and push notification preferences.")], { padding: "4" }),
                            ]),
                        ], {
                            variant: "enclosed",
                            collapsible: true,
                        }),
                    ], { width: "100%" })
                `)
            )
        );

        // Subtle variant
        const subtle = $.let(
            ShowcaseCard(
                "Subtle Variant",
                "Light background styling",
                Box.Root([
                    Accordion.Root([
                        Accordion.Item("faq-1", "How do I reset my password?", [
                            Box.Root([Text.Root("Click on 'Forgot Password' on the login page and follow the instructions sent to your email.")], { padding: "4" }),
                        ]),
                        Accordion.Item("faq-2", "Can I change my username?", [
                            Box.Root([Text.Root("Yes, go to Settings > Profile > Edit Username.")], { padding: "4" }),
                        ]),
                    ], {
                        variant: "subtle",
                        collapsible: true,
                    }),
                ], { width: "100%" }),
                some(`
                    Box.Root([
                        Accordion.Root([
                            Accordion.Item("faq-1", "How do I reset my password?", [
                                Box.Root([Text.Root("Click on 'Forgot Password' on the login page.")], { padding: "4" }),
                            ]),
                            Accordion.Item("faq-2", "Can I change my username?", [
                                Box.Root([Text.Root("Yes, go to Settings > Profile > Edit Username.")], { padding: "4" }),
                            ]),
                        ], {
                            variant: "subtle",
                            collapsible: true,
                        }),
                    ], { width: "100%" })
                `)
            )
        );

        // Plain variant
        const plain = $.let(
            ShowcaseCard(
                "Plain Variant",
                "No visible borders",
                Box.Root([
                    Accordion.Root([
                        Accordion.Item("topic-1", "Getting Started", [
                            Box.Root([Text.Root("Learn the basics of using our platform.")], { padding: "4" }),
                        ]),
                        Accordion.Item("topic-2", "Advanced Features", [
                            Box.Root([Text.Root("Explore powerful features for advanced users.")], { padding: "4" }),
                        ]),
                    ], {
                        variant: "plain",
                        collapsible: true,
                    }),
                ], { width: "100%" }),
                some(`
                    Box.Root([
                        Accordion.Root([
                            Accordion.Item("topic-1", "Getting Started", [
                                Box.Root([Text.Root("Learn the basics of using our platform.")], { padding: "4" }),
                            ]),
                            Accordion.Item("topic-2", "Advanced Features", [
                                Box.Root([Text.Root("Explore powerful features for advanced users.")], { padding: "4" }),
                            ]),
                        ], {
                            variant: "plain",
                            collapsible: true,
                        }),
                    ], { width: "100%" })
                `)
            )
        );

        // =====================================================================
        // INTERACTIVE EXAMPLES - Demonstrate callbacks with Reactive.Root
        // =====================================================================

        // Initialize state for interactive examples
        $(State.initTyped("accordion_expanded", [] as string[], ArrayType(StringType))());

        // Interactive Accordion with onValueChange
        const interactiveAccordion = $.let(
            ShowcaseCard(
                "Interactive Accordion",
                "Expand/collapse to see onValueChange callback",
                Reactive.Root($ => {
                    const expanded = $.let(State.readTyped("accordion_expanded", ArrayType(StringType))());

                    const onValueChange = East.function(
                        [ArrayType(StringType)],
                        NullType,
                        ($, newValue) => {
                            $(State.writeTyped("accordion_expanded", some(newValue), ArrayType(StringType))());
                        }
                    );

                    return Stack.VStack([
                        Box.Root([
                            Accordion.Root([
                                Accordion.Item("intro", "Introduction", [
                                    Box.Root([Text.Root("Welcome! This is the introduction section.")], { padding: "4" }),
                                ]),
                                Accordion.Item("features", "Features", [
                                    Box.Root([Text.Root("Explore the amazing features available.")], { padding: "4" }),
                                ]),
                                Accordion.Item("help", "Help & Support", [
                                    Box.Root([Text.Root("Get help and support for any issues.")], { padding: "4" }),
                                ]),
                            ], {
                                multiple: true,
                                collapsible: true,
                                variant: "enclosed",
                                onValueChange,
                            }),
                        ], { width: "100%" }),
                        Badge.Root(
                            East.str`Expanded: ${expanded.unwrap('some').size()}`,
                            { colorPalette: "green", variant: "solid" }
                        ),
                        Text.Root(East.str`Sections expanded: ${expanded.unwrap('some').size()}`),
                    ], { gap: "3", align: "stretch" });
                }),
                some(`
                    Reactive.Root($ => {
                        const expanded = $.let(State.readTyped("accordion_expanded", ArrayType(StringType))());

                        const onValueChange = East.function(
                            [ArrayType(StringType)],
                            NullType,
                            ($, newValue) => {
                                $(State.writeTyped("accordion_expanded", some(newValue), ArrayType(StringType))());
                            }
                        );

                        return Stack.VStack([
                            Box.Root([
                                Accordion.Root([
                                    Accordion.Item("intro", "Introduction", [
                                        Box.Root([Text.Root("Welcome! This is the introduction section.")], { padding: "4" }),
                                    ]),
                                    Accordion.Item("features", "Features", [
                                        Box.Root([Text.Root("Explore the amazing features available.")], { padding: "4" }),
                                    ]),
                                    Accordion.Item("help", "Help & Support", [
                                        Box.Root([Text.Root("Get help and support for any issues.")], { padding: "4" }),
                                    ]),
                                ], {
                                    multiple: true,
                                    collapsible: true,
                                    variant: "enclosed",
                                    onValueChange,
                                }),
                            ], { width: "100%" }),
                            Badge.Root(
                                East.str\`Expanded: \${expanded.unwrap('some').size()}\`,
                                { colorPalette: "green", variant: "solid" }
                            ),
                            Text.Root(East.str\`Sections expanded: \${expanded.unwrap('some').size()}\`),
                        ], { gap: "3", align: "stretch" });
                    })
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(multiple),
                Grid.Item(collapsible),
                Grid.Item(enclosed),
                Grid.Item(subtle),
                Grid.Item(plain),
                Grid.Item(interactiveAccordion, { colSpan: "2" }),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
