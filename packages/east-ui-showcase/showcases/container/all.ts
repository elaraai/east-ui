/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { East, some } from "@elaraai/east";
import {
    UIComponentType,
    Grid,
    Stack,
    Card,
    Text,
    Button,
    Badge,
    Heading,
} from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Container showcase - demonstrates Card component.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Card - Basic
        const cardBasic = $.let(
            ShowcaseCard(
                "Basic Card",
                "Simple card container",
                Card.Root([
                    Text.Root("This is a basic card with some content."),
                ]),
                some(`
                    Card.Root([
                        Text.Root("This is a basic card with some content."),
                    ])
                `)
            )
        );

        // Card - With Header
        const cardHeader = $.let(
            ShowcaseCard(
                "Card with Header",
                "Card with header component",
                Card.Root([
                    Text.Root("Card content goes here. This card has a heading in the header."),
                ], {
                    header: Heading.Root("Card Title"),
                }),
                some(`
                    Card.Root([
                        Text.Root("Card content goes here."),
                    ], {
                        header: Heading.Root("Card Title"),
                    })
                `)
            )
        );

        // Card - With Header and Description
        const cardHeaderDesc = $.let(
            ShowcaseCard(
                "Header with Description",
                "Full header with title and description",
                Card.Root([
                    Text.Root("The main content area of the card."),
                ], {
                    header: Stack.VStack([
                        Heading.Root("Featured Article", { size: "md" }),
                        Text.Root("A brief summary of what this card contains", { color: "fg.muted" }),
                    ], { gap: "1", align: 'flex-start' }),
                }),
                some(`
                    Card.Root([
                        Text.Root("The main content area of the card."),
                    ], {
                        header: Stack.VStack([
                            Heading.Root("Featured Article", { size: "md" }),
                            Text.Root("A brief summary...", { color: "fg.muted" }),
                        ], { gap: "1", align: "start" }),
                    })
                `)
            )
        );

        // Card - With Footer
        const cardFooter = $.let(
            ShowcaseCard(
                "Card with Footer",
                "Card with action buttons in footer",
                Card.Root([
                    Text.Root("This card has action buttons placed in the footer area."),
                ], {
                    header: Heading.Root("Actions Card"),
                    footer: Stack.HStack([
                        Button.Root("Cancel", { variant: "outline", size: "sm" }),
                        Button.Root("Save", { variant: "solid", colorPalette: "blue", size: "sm" }),
                    ], { gap: "2" }),
                }),
                some(`
                    Card.Root([
                        Text.Root("This card has action buttons in the footer."),
                    ], {
                        header: Heading.Root("Actions Card"),
                        footer: Stack.HStack([
                            Button.Root("Cancel", { variant: "outline", size: "sm" }),
                            Button.Root("Save", { variant: "solid", colorPalette: "blue", size: "sm" }),
                        ], { gap: "2" }),
                    })
                `)
            )
        );

        // Card - Elevated Variant
        const cardElevated = $.let(
            ShowcaseCard(
                "Elevated Card",
                "Card with shadow elevation",
                Card.Root([
                    Text.Root("This card has a shadow effect for visual depth."),
                ], {
                    header: Heading.Root("Elevated Style"),
                    footer: Button.Root("Learn More", { variant: "solid", colorPalette: "blue", size: "sm" }),
                    variant: "elevated",
                }),
                some(`
                    Card.Root([
                        Text.Root("This card has a shadow effect."),
                    ], {
                        header: Heading.Root("Elevated Style"),
                        footer: Button.Root("Learn More", { ... }),
                        variant: "elevated",
                    })
                `)
            )
        );

        // Card - Outline Variant
        const cardOutline = $.let(
            ShowcaseCard(
                "Outline Card",
                "Card with border outline",
                Card.Root([
                    Text.Root("A card with a visible border outline."),
                ], {
                    header: Heading.Root("Outline Style"),
                    variant: "outline",
                }),
                some(`
                    Card.Root([
                        Text.Root("A card with a visible border outline."),
                    ], {
                        header: Heading.Root("Outline Style"),
                        variant: "outline",
                    })
                `)
            )
        );

        // Card - Subtle Variant
        const cardSubtle = $.let(
            ShowcaseCard(
                "Subtle Card",
                "Card with subtle background",
                Card.Root([
                    Text.Root("A card with a subtle background color."),
                ], {
                    header: Heading.Root("Subtle Style"),
                    variant: "subtle",
                }),
                some(`
                    Card.Root([
                        Text.Root("A card with a subtle background color."),
                    ], {
                        header: Heading.Root("Subtle Style"),
                        variant: "subtle",
                    })
                `)
            )
        );

        // Card - With Dimensions
        const cardDimensions = $.let(
            ShowcaseCard(
                "Card with Dimensions",
                "Fixed height and min/max constraints",
                Card.Root([
                    Text.Root("This card has a fixed height of 200px and will scroll if content overflows."),
                    Text.Root("The dimension properties allow precise control over card sizing."),
                ], {
                    header: Heading.Root("Sized Card"),
                    height: "200px",
                    overflow: "auto",
                    variant: "outline",
                }),
                some(`
                    Card.Root([
                        Text.Root("This card has a fixed height..."),
                    ], {
                        header: Heading.Root("Sized Card"),
                        height: "200px",
                        overflow: "auto",
                        variant: "outline",
                    })
                `)
            )
        );

        // Card - Flexible
        const cardFlexible = $.let(
            ShowcaseCard(
                "Flexible Card",
                "Card that grows with flex",
                Stack.HStack([
                    Card.Root([
                        Text.Root("This card uses flex: 1 to fill available space."),
                    ], {
                        header: Heading.Root("Flex Card 1"),
                        flex: "1",
                        variant: "outline",
                    }),
                    Card.Root([
                        Text.Root("Both cards share the space equally."),
                    ], {
                        header: Heading.Root("Flex Card 2"),
                        flex: "1",
                        variant: "outline",
                    }),
                ], { gap: "4", width: "100%" }),
                some(`
                    Stack.HStack([
                        Card.Root([...], {
                            header: Heading.Root("Flex Card 1"),
                            flex: "1",
                            variant: "outline",
                        }),
                        Card.Root([...], {
                            header: Heading.Root("Flex Card 2"),
                            flex: "1",
                            variant: "outline",
                        }),
                    ], { gap: "4", width: "100%" })
                `)
            )
        );

        // Card - With Multiple Children
        const cardMultiple = $.let(
            ShowcaseCard(
                "Rich Content Card",
                "Card with multiple child components",
                Card.Root([
                    Stack.HStack([
                        Badge.Root("New", { colorPalette: "green", variant: "solid" }),
                        Badge.Root("Featured", { colorPalette: "purple", variant: "solid" }),
                    ], { gap: "2" }),
                    Text.Root("This card demonstrates how multiple components can be nested inside a card body."),
                ], {
                    header: Stack.VStack([
                        Heading.Root("Action Required", { size: "md" }),
                        Text.Root("Please review and respond", { color: "fg.muted" }),
                    ], { gap: "1", align: 'flex-start' }),
                    footer: Stack.HStack([
                        Button.Root("Accept", { variant: "solid", colorPalette: "green", size: "sm" }),
                        Button.Root("Decline", { variant: "outline", colorPalette: "red", size: "sm" }),
                    ], { gap: "2" }),
                    variant: "elevated",
                }),
                some(`
                    Card.Root([
                        Stack.HStack([
                            Badge.Root("New", { colorPalette: "green" }),
                            Badge.Root("Featured", { colorPalette: "purple" }),
                        ], { gap: "2" }),
                        Text.Root("Card content with multiple components."),
                    ], {
                        header: Stack.VStack([
                            Heading.Root("Action Required"),
                            Text.Root("Please review and respond"),
                        ]),
                        footer: Stack.HStack([
                            Button.Root("Accept", { ... }),
                            Button.Root("Decline", { ... }),
                        ]),
                        variant: "elevated",
                    })
                `)
            )
        );

        // Card - Sizes
        const cardSizes = $.let(
            ShowcaseCard(
                "Card Sizes",
                "Available sizes: sm, md, lg",
                Stack.VStack([
                    Card.Root([Text.Root("Small card")], { header: Heading.Root("Small", { size: "sm" }), size: "sm", variant: "outline" }),
                    Card.Root([Text.Root("Medium card")], { header: Heading.Root("Medium", { size: "md" }), size: "md", variant: "outline" }),
                    Card.Root([Text.Root("Large card")], { header: Heading.Root("Large", { size: "lg" }), size: "lg", variant: "outline" }),
                ], { gap: "4", align: "stretch", width: "100%" }),
                some(`
                    Stack.VStack([
                        Card.Root([...], { header: Heading.Root("Small"), size: "sm" }),
                        Card.Root([...], { header: Heading.Root("Medium"), size: "md" }),
                        Card.Root([...], { header: Heading.Root("Large"), size: "lg" }),
                    ], { gap: "4", align: "stretch", width: "100%" })
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(cardBasic),
                Grid.Item(cardHeader),
                Grid.Item(cardHeaderDesc),
                Grid.Item(cardFooter),
                Grid.Item(cardElevated),
                Grid.Item(cardOutline),
                Grid.Item(cardSubtle),
                Grid.Item(cardDimensions),
                Grid.Item(cardFlexible, { colSpan: "2" }),
                Grid.Item(cardMultiple, { colSpan: "2" }),
                Grid.Item(cardSizes, { colSpan: "2" }),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
