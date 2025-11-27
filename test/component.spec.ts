/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { East, variant } from "@elaraai/east";
import { describeEast, assertEast } from "./platforms.spec.js";
import {
    Box,
    Stack,
    Text,
    Badge,
    Separator,
    Stat,
    Alert,
    Progress,
    Tag,
    UIComponentType,
} from "../src/index.js";

describeEast("UIComponentType - Nested Components", (test) => {
    test("creates nested dashboard layout", $ => {
        // Build a dashboard: Box > VStack > [header row, separator, stats row, content, tags]
        const dashboard = $.let(Box.Root(
            [
                Stack.VStack([
                    // Header row: HStack with title + badge
                    Stack.HStack(
                        [
                            Text.Root("Dashboard"),
                            Badge.Root("Live", { colorPalette: "green", variant: "solid" }),
                        ],
                        { gap: "2" }
                    ),

                    // Separator
                    Separator.Root(),

                    // Stats row: HStack with multiple stats
                    Stack.HStack(
                        [
                            Stat.Root("Revenue", "$45,231", { indicator: "up" }),
                            Stat.Root("Users", "1,234"),
                            Stat.Root("Orders", "156", { indicator: "down" }),
                        ],
                        { gap: "6" }
                    ),

                    // Content section: Box with alert and progress
                    Box.Root(
                        [
                            Alert.Root("info", { title: "Welcome back!" }),
                            Progress.Root(75.0, { colorPalette: "blue" })
                        ],
                        { padding: "4" }
                    ),

                    // Tags row
                    Stack.HStack(
                        [
                            Tag.Root("Analytics", { colorPalette: "blue" }),
                            Tag.Root("Reports", { colorPalette: "purple" }),
                            Tag.Root("Settings", { colorPalette: "gray" }),
                        ],
                        { gap: "2" }
                    ),

                ],
                    { gap: "4" }
                )
            ],
            { padding: "6", background: "white" }
        ), UIComponentType);

        // Build expected value using raw variant/struct literals
        const expected = $.let(East.value(variant("Box", {
            children: [
                variant("Stack", {
                    children: [
                        // Header HStack
                        variant("Stack", {
                            children: [
                                variant("Text", {
                                    value: "Dashboard",
                                    color: variant("none", null),
                                    background: variant("none", null),
                                    fontWeight: variant("none", null),
                                    fontStyle: variant("none", null),
                                    textTransform: variant("none", null),
                                    textAlign: variant("none", null),
                                    borderWidth: variant("none", null),
                                    borderStyle: variant("none", null),
                                    borderColor: variant("none", null),
                                }),
                                variant("Badge", {
                                    value: "Live",
                                    variant: variant("some", variant("solid", null)),
                                    colorPalette: variant("some", variant("green", null)),
                                    size: variant("none", null),
                                }),
                            ],
                            style: variant("some", {
                                direction: variant("some", variant("row", null)),
                                gap: variant("some", "2"),
                                align: variant("none", null),
                                justify: variant("none", null),
                                wrap: variant("none", null),
                                padding: variant("none", null),
                                margin: variant("none", null),
                                background: variant("none", null),
                                width: variant("none", null),
                                height: variant("none", null),
                            }),
                        }),
                        // Separator
                        variant("Separator", {
                            orientation: variant("none", null),
                            variant: variant("none", null),
                            size: variant("none", null),
                            color: variant("none", null),
                            label: variant("none", null),
                        }),
                        // Stats HStack
                        variant("Stack", {
                            children: [
                                variant("Stat", {
                                    label: "Revenue",
                                    value: "$45,231",
                                    helpText: variant("none", null),
                                    indicator: variant("some", variant("up", null)),
                                }),
                                variant("Stat", {
                                    label: "Users",
                                    value: "1,234",
                                    helpText: variant("none", null),
                                    indicator: variant("none", null),
                                }),
                                variant("Stat", {
                                    label: "Orders",
                                    value: "156",
                                    helpText: variant("none", null),
                                    indicator: variant("some", variant("down", null)),
                                }),
                            ],
                            style: variant("some", {
                                direction: variant("some", variant("row", null)),
                                gap: variant("some", "6"),
                                align: variant("none", null),
                                justify: variant("none", null),
                                wrap: variant("none", null),
                                padding: variant("none", null),
                                margin: variant("none", null),
                                background: variant("none", null),
                                width: variant("none", null),
                                height: variant("none", null),
                            }),
                        }),
                        // Content Box
                        variant("Box", {
                            children: [
                                variant("Alert", {
                                    status: variant("info", null),
                                    title: variant("some", "Welcome back!"),
                                    description: variant("none", null),
                                    variant: variant("none", null),
                                }),
                                variant("Progress", {
                                    value: 75.0,
                                    min: variant("none", null),
                                    max: variant("none", null),
                                    colorPalette: variant("some", variant("blue", null)),
                                    size: variant("none", null),
                                    variant: variant("none", null),
                                    striped: variant("none", null),
                                    animated: variant("none", null),
                                    label: variant("none", null),
                                    valueText: variant("none", null),
                                }),
                            ],
                            style: variant("some", {
                                display: variant("none", null),
                                width: variant("none", null),
                                height: variant("none", null),
                                padding: variant("some", "4"),
                                margin: variant("none", null),
                                background: variant("none", null),
                                color: variant("none", null),
                                borderRadius: variant("none", null),
                                flexDirection: variant("none", null),
                                justifyContent: variant("none", null),
                                alignItems: variant("none", null),
                                gap: variant("none", null),
                            }),
                        }),
                        // Tags HStack
                        variant("Stack", {
                            children: [
                                variant("Tag", {
                                    label: "Analytics",
                                    variant: variant("none", null),
                                    colorPalette: variant("some", variant("blue", null)),
                                    size: variant("none", null),
                                    closable: variant("none", null),
                                }),
                                variant("Tag", {
                                    label: "Reports",
                                    variant: variant("none", null),
                                    colorPalette: variant("some", variant("purple", null)),
                                    size: variant("none", null),
                                    closable: variant("none", null),
                                }),
                                variant("Tag", {
                                    label: "Settings",
                                    variant: variant("none", null),
                                    colorPalette: variant("some", variant("gray", null)),
                                    size: variant("none", null),
                                    closable: variant("none", null),
                                }),
                            ],
                            style: variant("some", {
                                direction: variant("some", variant("row", null)),
                                gap: variant("some", "2"),
                                align: variant("none", null),
                                justify: variant("none", null),
                                wrap: variant("none", null),
                                padding: variant("none", null),
                                margin: variant("none", null),
                                background: variant("none", null),
                                width: variant("none", null),
                                height: variant("none", null),
                            }),
                        }),
                    ],
                    style: variant("some", {
                        direction: variant("some", variant("column", null)),
                        gap: variant("some", "4"),
                        align: variant("none", null),
                        justify: variant("none", null),
                        wrap: variant("none", null),
                        padding: variant("none", null),
                        margin: variant("none", null),
                        background: variant("none", null),
                        width: variant("none", null),
                        height: variant("none", null),
                    }),
                }),
            ],
            style: variant("some", {
                display: variant("none", null),
                width: variant("none", null),
                height: variant("none", null),
                padding: variant("some", "6"),
                margin: variant("none", null),
                background: variant("some", "white"),
                color: variant("none", null),
                borderRadius: variant("none", null),
                flexDirection: variant("none", null),
                justifyContent: variant("none", null),
                alignItems: variant("none", null),
                gap: variant("none", null),
            }),
        }), UIComponentType));

        // Compare the entire structure
        $(assertEast.equal(dashboard, expected));
    });
});
