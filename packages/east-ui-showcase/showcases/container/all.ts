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

        // Card - With Title
        const cardTitle = $.let(
            ShowcaseCard(
                "Card with Title",
                "Card with header section",
                Card.Root([
                    Text.Root("Card content goes here. This card has a title in the header."),
                ], {
                    title: "Card Title",
                }),
                some(`
                    Card.Root([
                        Text.Root("Card content goes here."),
                    ], {
                        title: "Card Title",
                    })
                `)
            )
        );

        // Card - With Title and Description
        const cardTitleDesc = $.let(
            ShowcaseCard(
                "Title and Description",
                "Full header with description",
                Card.Root([
                    Text.Root("The main content area of the card."),
                ], {
                    title: "Featured Article",
                    description: "A brief summary of what this card contains",
                }),
                some(`
                    Card.Root([
                        Text.Root("The main content area of the card."),
                    ], {
                        title: "Featured Article",
                        description: "A brief summary of what this card contains",
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
                    Button.Root("Learn More", { variant: "solid", colorPalette: "blue", size: "sm" }),
                ], {
                    title: "Elevated Style",
                    variant: "elevated",
                }),
                some(`
                    Card.Root([
                        Text.Root("This card has a shadow effect."),
                        Button.Root("Learn More", { variant: "solid", colorPalette: "blue", size: "sm" }),
                    ], {
                        title: "Elevated Style",
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
                    title: "Outline Style",
                    variant: "outline",
                }),
                some(`
                    Card.Root([
                        Text.Root("A card with a visible border outline."),
                    ], {
                        title: "Outline Style",
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
                    title: "Subtle Style",
                    variant: "subtle",
                }),
                some(`
                    Card.Root([
                        Text.Root("A card with a subtle background color."),
                    ], {
                        title: "Subtle Style",
                        variant: "subtle",
                    })
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
                    Stack.HStack([
                        Button.Root("Accept", { variant: "solid", colorPalette: "green", size: "sm" }),
                        Button.Root("Decline", { variant: "outline", colorPalette: "red", size: "sm" }),
                    ], { gap: "2" }),
                ], {
                    title: "Action Required",
                    description: "Please review and respond",
                    variant: "elevated",
                }),
                some(`
                    Card.Root([
                        Stack.HStack([
                            Badge.Root("New", { colorPalette: "green", variant: "solid" }),
                            Badge.Root("Featured", { colorPalette: "purple", variant: "solid" }),
                        ], { gap: "2" }),
                        Text.Root("Card content with multiple components."),
                        Stack.HStack([
                            Button.Root("Accept", { variant: "solid", colorPalette: "green", size: "sm" }),
                            Button.Root("Decline", { variant: "outline", colorPalette: "red", size: "sm" }),
                        ], { gap: "2" }),
                    ], {
                        title: "Action Required",
                        description: "Please review and respond",
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
                    Card.Root([Text.Root("Small card")], { title: "Small", size: "sm", variant: "outline" }),
                    Card.Root([Text.Root("Medium card")], { title: "Medium", size: "md", variant: "outline" }),
                    Card.Root([Text.Root("Large card")], { title: "Large", size: "lg", variant: "outline" }),
                ], { gap: "4", align: "stretch", width: "100%" }),
                some(`
                    Stack.VStack([
                        Card.Root([Text.Root("Small card")], { title: "Small", size: "sm", variant: "outline" }),
                        Card.Root([Text.Root("Medium card")], { title: "Medium", size: "md", variant: "outline" }),
                        Card.Root([Text.Root("Large card")], { title: "Large", size: "lg", variant: "outline" }),
                    ], { gap: "4", align: "stretch", width: "100%" })
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(cardBasic),
                Grid.Item(cardTitle),
                Grid.Item(cardTitleDesc),
                Grid.Item(cardElevated),
                Grid.Item(cardOutline),
                Grid.Item(cardSubtle),
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
