/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { East, some, variant } from "@elaraai/east";
import {
    UIComponentType,
    Grid,
    Stack,
    Badge,
    Tag,
    Avatar,
    Stat,
    Icon,
    Accordion,
    Style,
    Text,
    HoverCard,
    Highlight,
} from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Display showcase - demonstrates Badge, Tag, Avatar, Stat, and Icon components.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Badge - Basic
        const badgeBasic = $.let(
            ShowcaseCard(
                "Badge",
                "Status labels and counts",
                Stack.HStack([
                    Badge.Root("New"),
                    Badge.Root("Beta", { colorPalette: "purple" }),
                    Badge.Root("Pro", { colorPalette: "blue" }),
                ], { gap: "2" }),
                some(`
                    Stack.HStack([
                        Badge.Root("New"),
                        Badge.Root("Beta", { colorPalette: "purple" }),
                        Badge.Root("Pro", { colorPalette: "blue" }),
                    ], { gap: "2" })
                `)
            )
        );

        // Badge - Variants
        const badgeVariants = $.let(
            ShowcaseCard(
                "Badge Variants",
                "Solid, subtle, and outline",
                Stack.HStack([
                    Badge.Root("Solid", { variant: "solid", colorPalette: "green" }),
                    Badge.Root("Subtle", { variant: "subtle", colorPalette: "green" }),
                    Badge.Root("Outline", { variant: "outline", colorPalette: "green" }),
                ], { gap: "2" }),
                some(`
                    Stack.HStack([
                        Badge.Root("Solid", { variant: "solid", colorPalette: "green" }),
                        Badge.Root("Subtle", { variant: "subtle", colorPalette: "green" }),
                        Badge.Root("Outline", { variant: "outline", colorPalette: "green" }),
                    ], { gap: "2" })
                `)
            )
        );

        // Badge - Colors
        const badgeColors = $.let(
            ShowcaseCard(
                "Badge Colors",
                "Various color palettes",
                Stack.HStack([
                    Badge.Root("Red", { colorPalette: "red", variant: "solid" }),
                    Badge.Root("Orange", { colorPalette: "orange", variant: "solid" }),
                    Badge.Root("Yellow", { colorPalette: "yellow", variant: "solid" }),
                    Badge.Root("Green", { colorPalette: "green", variant: "solid" }),
                    Badge.Root("Blue", { colorPalette: "blue", variant: "solid" }),
                    Badge.Root("Purple", { colorPalette: "purple", variant: "solid" }),
                ], { gap: "2", wrap: "wrap" }),
                some(`
                    Stack.HStack([
                        Badge.Root("Red", { colorPalette: "red", variant: "solid" }),
                        Badge.Root("Orange", { colorPalette: "orange", variant: "solid" }),
                        Badge.Root("Yellow", { colorPalette: "yellow", variant: "solid" }),
                        Badge.Root("Green", { colorPalette: "green", variant: "solid" }),
                        Badge.Root("Blue", { colorPalette: "blue", variant: "solid" }),
                        Badge.Root("Purple", { colorPalette: "purple", variant: "solid" }),
                    ], { gap: "2", wrap: "wrap" })
                `)
            )
        );

        // Badge - Opacity & Custom Colors
        const badgeCustom = $.let(
            ShowcaseCard(
                "Badge Custom Styling",
                "Opacity and custom colors",
                Stack.VStack([
                    Stack.HStack([
                        Badge.Root("100%", { colorPalette: "blue", variant: "solid" }),
                        Badge.Root("75%", { colorPalette: "blue", variant: "solid", opacity: 0.75 }),
                        Badge.Root("50%", { colorPalette: "blue", variant: "solid", opacity: 0.5 }),
                        Badge.Root("25%", { colorPalette: "blue", variant: "solid", opacity: 0.25 }),
                    ], { gap: "2" }),
                    Stack.HStack([
                        Badge.Root("Custom BG", { background: "#ff6b6b", color: "white" }),
                        Badge.Root("Gradient", { background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)", color: "white" }),
                        Badge.Root("Dark", { background: "#1a1a2e", color: "#eee" }),
                    ], { gap: "2" }),
                ], { gap: "3", align: "flex-start" }),
                some(`
                    Stack.VStack([
                        // Opacity levels
                        Stack.HStack([
                            Badge.Root("100%", { colorPalette: "blue", variant: "solid" }),
                            Badge.Root("75%", { colorPalette: "blue", variant: "solid", opacity: 0.75 }),
                            Badge.Root("50%", { colorPalette: "blue", variant: "solid", opacity: 0.5 }),
                            Badge.Root("25%", { colorPalette: "blue", variant: "solid", opacity: 0.25 }),
                        ], { gap: "2" }),
                        // Custom colors
                        Stack.HStack([
                            Badge.Root("Custom BG", { background: "#ff6b6b", color: "white" }),
                            Badge.Root("Gradient", { background: "linear-gradient(...)", color: "white" }),
                            Badge.Root("Dark", { background: "#1a1a2e", color: "#eee" }),
                        ], { gap: "2" }),
                    ])
                `)
            )
        );

        // Tag - Basic
        const tagBasic = $.let(
            ShowcaseCard(
                "Tag",
                "Categorization labels",
                Stack.HStack([
                    Tag.Root("React"),
                    Tag.Root("TypeScript", { colorPalette: "blue" }),
                    Tag.Root("Chakra UI", { colorPalette: "teal" }),
                ], { gap: "2" }),
                some(`
                    Stack.HStack([
                        Tag.Root("React"),
                        Tag.Root("TypeScript", { colorPalette: "blue" }),
                        Tag.Root("Chakra UI", { colorPalette: "teal" }),
                    ], { gap: "2" })
                `)
            )
        );

        // Tag - Closable
        const tagClosable = $.let(
            ShowcaseCard(
                "Closable Tags",
                "Tags with close button",
                Stack.HStack([
                    Tag.Root("Removable", { closable: true, colorPalette: "red" }),
                    Tag.Root("Delete me", { closable: true, colorPalette: "orange" }),
                    Tag.Root("Click X", { closable: true, colorPalette: "blue" }),
                ], { gap: "2" }),
                some(`
                    Stack.HStack([
                        Tag.Root("Removable", { closable: true, colorPalette: "red" }),
                        Tag.Root("Delete me", { closable: true, colorPalette: "orange" }),
                        Tag.Root("Click X", { closable: true, colorPalette: "blue" }),
                    ], { gap: "2" })
                `)
            )
        );

        // Tag - Variants
        const tagVariants = $.let(
            ShowcaseCard(
                "Tag Variants",
                "Solid, subtle, and outline",
                Stack.HStack([
                    Tag.Root("Solid", { variant: "solid", colorPalette: "cyan" }),
                    Tag.Root("Subtle", { variant: "subtle", colorPalette: "cyan" }),
                    Tag.Root("Outline", { variant: "outline", colorPalette: "cyan" }),
                ], { gap: "2" }),
                some(`
                    Stack.HStack([
                        Tag.Root("Solid", { variant: "solid", colorPalette: "cyan" }),
                        Tag.Root("Subtle", { variant: "subtle", colorPalette: "cyan" }),
                        Tag.Root("Outline", { variant: "outline", colorPalette: "cyan" }),
                    ], { gap: "2" })
                `)
            )
        );

        // Tag - Opacity & Custom Colors
        const tagCustom = $.let(
            ShowcaseCard(
                "Tag Custom Styling",
                "Opacity and custom colors",
                Stack.VStack([
                    Stack.HStack([
                        Tag.Root("100%", { colorPalette: "green", variant: "solid" }),
                        Tag.Root("75%", { colorPalette: "green", variant: "solid", opacity: 0.75 }),
                        Tag.Root("50%", { colorPalette: "green", variant: "solid", opacity: 0.5 }),
                        Tag.Root("25%", { colorPalette: "green", variant: "solid", opacity: 0.25 }),
                    ], { gap: "2" }),
                    Stack.HStack([
                        Tag.Root("Custom", { background: "#e74c3c", color: "white" }),
                        Tag.Root("Brand", { background: "#3498db", color: "white" }),
                        Tag.Root("Dark Mode", { background: "#2c3e50", color: "#ecf0f1" }),
                    ], { gap: "2" }),
                ], { gap: "3", align: "flex-start" }),
                some(`
                    Stack.VStack([
                        // Opacity levels
                        Stack.HStack([
                            Tag.Root("100%", { colorPalette: "green", variant: "solid" }),
                            Tag.Root("75%", { colorPalette: "green", variant: "solid", opacity: 0.75 }),
                            Tag.Root("50%", { colorPalette: "green", variant: "solid", opacity: 0.5 }),
                            Tag.Root("25%", { colorPalette: "green", variant: "solid", opacity: 0.25 }),
                        ], { gap: "2" }),
                        // Custom colors
                        Stack.HStack([
                            Tag.Root("Custom", { background: "#e74c3c", color: "white" }),
                            Tag.Root("Brand", { background: "#3498db", color: "white" }),
                            Tag.Root("Dark Mode", { background: "#2c3e50", color: "#ecf0f1" }),
                        ], { gap: "2" }),
                    ])
                `)
            )
        );

        // Tag - Dynamic variant (testing ifElse)
        const tagDynamic = $.let(
            ShowcaseCard(
                "Tag Dynamic Variant",
                "Variant changing based on condition",
                Stack.VStack([
                    // Test with literal true/false conditions
                    Stack.HStack([
                        Tag.Root("True -> solid", {
                            variant: East.value(true).ifElse(
                                () => variant("solid", null),
                                () => variant("outline", null)
                            ),
                            colorPalette: "blue",
                        }),
                        Tag.Root("False -> outline", {
                            variant: East.value(false).ifElse(
                                () => variant("solid", null),
                                () => variant("outline", null)
                            ),
                            colorPalette: "blue",
                        }),
                    ], { gap: "2" }),
                    // Test with Style helper
                    Stack.HStack([
                        Tag.Root("Style.StyleVariant solid", {
                            variant: Style.StyleVariant("solid"),
                            colorPalette: "green",
                        }),
                        Tag.Root("Style.StyleVariant outline", {
                            variant: Style.StyleVariant("outline"),
                            colorPalette: "green",
                        }),
                    ], { gap: "2" }),
                ], { gap: "3", align: "flex-start" }),
                some(`
                    // Dynamic variant using ifElse
                    Tag.Root("True -> solid", {
                        variant: East.value(true).ifElse(
                            $ => variant("solid", null),
                            $ => variant("outline", null)
                        ),
                        colorPalette: "blue",
                    })
                `)
            )
        );

        // Avatar - Basic
        const avatarBasic = $.let(
            ShowcaseCard(
                "Avatar",
                "User profile images",
                Stack.HStack([
                    Avatar.Root({ name: "John Doe" }),
                    Avatar.Root({ name: "Jane Smith", colorPalette: "blue" }),
                    Avatar.Root({ name: "Bob Wilson", colorPalette: "green" }),
                ], { gap: "3" }),
                some(`
                    Stack.HStack([
                        Avatar.Root({ name: "John Doe" }),
                        Avatar.Root({ name: "Jane Smith", colorPalette: "blue" }),
                        Avatar.Root({ name: "Bob Wilson", colorPalette: "green" }),
                    ], { gap: "3" })
                `)
            )
        );

        // Avatar - Sizes
        const avatarSizes = $.let(
            ShowcaseCard(
                "Avatar Sizes",
                "Available sizes: xs, sm, md, lg",
                Stack.HStack([
                    Avatar.Root({ name: "XS", size: "xs", colorPalette: "purple" }),
                    Avatar.Root({ name: "SM", size: "sm", colorPalette: "purple" }),
                    Avatar.Root({ name: "MD", size: "md", colorPalette: "purple" }),
                    Avatar.Root({ name: "LG", size: "lg", colorPalette: "purple" }),
                ], { gap: "3", align: "center" }),
                some(`
                    Stack.HStack([
                        Avatar.Root({ name: "XS", size: "xs", colorPalette: "purple" }),
                        Avatar.Root({ name: "SM", size: "sm", colorPalette: "purple" }),
                        Avatar.Root({ name: "MD", size: "md", colorPalette: "purple" }),
                        Avatar.Root({ name: "LG", size: "lg", colorPalette: "purple" }),
                    ], { gap: "3", align: "center" })
                `)
            )
        );

        // Avatar - Colors
        const avatarColors = $.let(
            ShowcaseCard(
                "Avatar Colors",
                "Various color palettes",
                Stack.HStack([
                    Avatar.Root({ name: "Red User", colorPalette: "red" }),
                    Avatar.Root({ name: "Orange User", colorPalette: "orange" }),
                    Avatar.Root({ name: "Yellow User", colorPalette: "yellow" }),
                    Avatar.Root({ name: "Green User", colorPalette: "green" }),
                    Avatar.Root({ name: "Blue User", colorPalette: "blue" }),
                    Avatar.Root({ name: "Purple User", colorPalette: "purple" }),
                ], { gap: "2" }),
                some(`
                    Stack.HStack([
                        Avatar.Root({ name: "Red User", colorPalette: "red" }),
                        Avatar.Root({ name: "Orange User", colorPalette: "orange" }),
                        Avatar.Root({ name: "Yellow User", colorPalette: "yellow" }),
                        Avatar.Root({ name: "Green User", colorPalette: "green" }),
                        Avatar.Root({ name: "Blue User", colorPalette: "blue" }),
                        Avatar.Root({ name: "Purple User", colorPalette: "purple" }),
                    ], { gap: "2" })
                `)
            )
        );

        // Stat - Basic
        const statBasic = $.let(
            ShowcaseCard(
                "Stat",
                "Key metrics display",
                Stack.HStack([
                    Stat.Root("Revenue", Text.Root("$45,231")),
                    Stat.Root("Users", Text.Root("1,234")),
                    Stat.Root("Orders", Text.Root("567")),
                ], { gap: "8" }),
                some(`
                    Stack.HStack([
                        Stat.Root("Revenue", Text.Root("$45,231")),
                        Stat.Root("Users", Text.Root("1,234")),
                        Stat.Root("Orders", Text.Root("567")),
                    ], { gap: "8" })
                `)
            )
        );

        // Stat - With help text
        const statHelpText = $.let(
            ShowcaseCard(
                "Stat with Help Text",
                "Additional context",
                Stack.HStack([
                    Stat.Root("Total Sales", Text.Root("$12,345"), { helpText: "Last 30 days" }),
                    Stat.Root("New Users", Text.Root("89"), { helpText: "This week" }),
                ], { gap: "8" }),
                some(`
                    Stack.HStack([
                        Stat.Root("Total Sales", Text.Root("$12,345"), { helpText: "Last 30 days" }),
                        Stat.Root("New Users", Text.Root("89"), { helpText: "This week" }),
                    ], { gap: "8" })
                `)
            )
        );

        // Stat - With indicators
        const statIndicators = $.let(
            ShowcaseCard(
                "Stat with Indicators",
                "Trend direction",
                Stack.HStack([
                    Stat.Root("Growth", Text.Root("+23.36%"), { helpText: "vs last month", indicator: "up" }),
                    Stat.Root("Bounce Rate", Text.Root("-12.5%"), { helpText: "vs yesterday", indicator: "down" }),
                ], { gap: "8" }),
                some(`
                    Stack.HStack([
                        Stat.Root("Growth", Text.Root("+23.36%"), { helpText: "vs last month", indicator: "up" }),
                        Stat.Root("Bounce Rate", Text.Root("-12.5%"), { helpText: "vs yesterday", indicator: "down" }),
                    ], { gap: "8" })
                `)
            )
        );

        // Stat - Rich values
        const statRichValues = $.let(
            ShowcaseCard(
                "Stat with Rich Values",
                "Values can be any UI component — badges, hover cards, highlighted text",
                Stack.HStack([
                    Stat.Root("Status", Badge.Root("Operational", { variant: "solid", colorPalette: "green" })),
                    Stat.Root("Owner", HoverCard.Root(
                        Text.Root("@jane", { color: "blue.500" }),
                        [
                            Stack.VStack([
                                Text.Root("Jane Smith", { fontWeight: "bold" }),
                                Text.Root("Senior Engineer — Platform Team", { fontSize: "sm" }),
                            ], { gap: "1" }),
                        ],
                    )),
                    Stat.Root("Query", Highlight.Root("SELECT * FROM users", ["SELECT", "FROM"])),
                ], { gap: "8" }),
                some(`
                    Stack.HStack([
                        Stat.Root("Status", Badge.Root("Operational", { variant: "solid", colorPalette: "green" })),
                        Stat.Root("Owner", HoverCard.Root(
                            Text.Root("@jane", { color: "blue.500" }),
                            [
                                Stack.VStack([
                                    Text.Root("Jane Smith", { fontWeight: "bold" }),
                                    Text.Root("Senior Engineer — Platform Team", { fontSize: "sm" }),
                                ], { gap: "1" }),
                            ],
                        )),
                        Stat.Root("Query", Highlight.Root("SELECT * FROM users", ["SELECT", "FROM"])),
                    ], { gap: "8" })
                `)
            )
        );

        // Icon - Basic
        const iconBasic = $.let(
            ShowcaseCard(
                "Icon",
                "Font Awesome icons",
                Stack.HStack([
                    Icon.Root('fas', "house"),
                    Icon.Root('fas', "user"),
                    Icon.Root('fas', "gear"),
                    Icon.Root('fas', "bell"),
                    Icon.Root('fas', "heart"),
                    Icon.Root('fas', "star"),
                ], { gap: "4" }),
                some(`
                    Stack.HStack([
                        Icon.Root('fas', "house"),
                        Icon.Root('fas', "user"),
                        Icon.Root('fas', "gear"),
                        Icon.Root('fas', "bell"),
                        Icon.Root('fas', "heart"),
                        Icon.Root('fas', "star"),
                    ], { gap: "4" })
                `)
            )
        );

        // Icon - Styles
        const iconStyles = $.let(
            ShowcaseCard(
                "Icon Styles",
                "Solid, regular, and brands",
                Stack.HStack([
                    Icon.Root('far', "bookmark"),
                    Icon.Root('fas', "bookmark"),
                    Icon.Root('fab', "github"),
                    Icon.Root('fab', "twitter"),
                    Icon.Root('fab', "react"),
                ], { gap: "4" }),
                some(`
                    Stack.HStack([
                        Icon.Root('far', "bookmark"),
                        Icon.Root('fas', "bookmark"),
                        Icon.Root('fab', "github"),
                        Icon.Root('fab', "twitter"),
                        Icon.Root('fab', "react"),
                    ], { gap: "4" })
                `)
            )
        );

        return Accordion.Root([
            Accordion.Item("badge", "Badge", [
                Grid.Root([
                    Grid.Item(badgeBasic),
                    Grid.Item(badgeVariants),
                    Grid.Item(badgeColors),
                    Grid.Item(badgeCustom),
                ], { templateColumns: "repeat(2, 1fr)", gap: "4" }),
            ]),
            Accordion.Item("tag", "Tag", [
                Grid.Root([
                    Grid.Item(tagBasic),
                    Grid.Item(tagClosable),
                    Grid.Item(tagVariants),
                    Grid.Item(tagCustom),
                    Grid.Item(tagDynamic, { colSpan: "2" }),
                ], { templateColumns: "repeat(2, 1fr)", gap: "4" }),
            ]),
            Accordion.Item("avatar", "Avatar", [
                Grid.Root([
                    Grid.Item(avatarBasic),
                    Grid.Item(avatarSizes),
                    Grid.Item(avatarColors, { colSpan: "2" }),
                ], { templateColumns: "repeat(2, 1fr)", gap: "4" }),
            ]),
            Accordion.Item("stat", "Stat", [
                Grid.Root([
                    Grid.Item(statBasic),
                    Grid.Item(statHelpText),
                    Grid.Item(statIndicators, { colSpan: "2" }),
                    Grid.Item(statRichValues, { colSpan: "2" }),
                ], { templateColumns: "repeat(2, 1fr)", gap: "4" }),
            ]),
            Accordion.Item("icon", "Icon", [
                Grid.Root([
                    Grid.Item(iconBasic),
                    Grid.Item(iconStyles),
                ], { templateColumns: "repeat(2, 1fr)", gap: "4" }),
            ]),
        ], { multiple: true, collapsible: true });
    }
);
