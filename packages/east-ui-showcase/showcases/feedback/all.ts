/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { East, some } from "@elaraai/east";
import {
    UIComponentType,
    Grid,
    Stack,
    Alert,
    Progress,
} from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Feedback showcase - demonstrates Alert and Progress components.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Alert - Info
        const alertInfo = $.let(
            ShowcaseCard(
                "Info Alert",
                "Informational message",
                Alert.Root("info", {
                    title: "New update available",
                    description: "A new version of the application is ready to install.",
                }),
                some(`
                    Alert.Root("info", {
                        title: "New update available",
                        description: "A new version of the application is ready to install.",
                    })
                `)
            )
        );

        // Alert - Success
        const alertSuccess = $.let(
            ShowcaseCard(
                "Success Alert",
                "Confirmation message",
                Alert.Root("success", {
                    title: "Changes saved",
                    description: "Your settings have been updated successfully.",
                }),
                some(`
                    Alert.Root("success", {
                        title: "Changes saved",
                        description: "Your settings have been updated successfully.",
                    })
                `)
            )
        );

        // Alert - Warning
        const alertWarning = $.let(
            ShowcaseCard(
                "Warning Alert",
                "Warning message",
                Alert.Root("warning", {
                    title: "Session expiring",
                    description: "Your session will expire in 5 minutes.",
                }),
                some(`
                    Alert.Root("warning", {
                        title: "Session expiring",
                        description: "Your session will expire in 5 minutes.",
                    })
                `)
            )
        );

        // Alert - Error
        const alertError = $.let(
            ShowcaseCard(
                "Error Alert",
                "Error message",
                Alert.Root("error", {
                    title: "Connection failed",
                    description: "Unable to connect to the server. Please try again.",
                }),
                some(`
                    Alert.Root("error", {
                        title: "Connection failed",
                        description: "Unable to connect to the server. Please try again.",
                    })
                `)
            )
        );

        // Alert variants
        const alertVariants = $.let(
            ShowcaseCard(
                "Alert Variants",
                "Solid, subtle, and outline styles",
                Stack.VStack([
                    Alert.Root("info", { title: "Solid variant", variant: "solid" }),
                    Alert.Root("info", { title: "Subtle variant", variant: "subtle" }),
                    Alert.Root("info", { title: "Outline variant", variant: "outline" }),
                ], { gap: "3", align: "stretch", width: "100%" }),
                some(`
                    Stack.VStack([
                        Alert.Root("info", { title: "Solid variant", variant: "solid" }),
                        Alert.Root("info", { title: "Subtle variant", variant: "subtle" }),
                        Alert.Root("info", { title: "Outline variant", variant: "outline" }),
                    ], { gap: "3", align: "stretch", width: "100%" })
                `)
            )
        );

        // Alert - Title only
        const alertTitleOnly = $.let(
            ShowcaseCard(
                "Title Only Alert",
                "Simple alert without description",
                Stack.VStack([
                    Alert.Root("success", { title: "File uploaded successfully" }),
                    Alert.Root("error", { title: "Invalid email address" }),
                ], { gap: "3", align: "stretch", width: "100%" }),
                some(`
                    Stack.VStack([
                        Alert.Root("success", { title: "File uploaded successfully" }),
                        Alert.Root("error", { title: "Invalid email address" }),
                    ], { gap: "3", align: "stretch", width: "100%" })
                `)
            )
        );

        // Progress - Basic
        const progressBasic = $.let(
            ShowcaseCard(
                "Basic Progress",
                "Simple progress bar",
                Progress.Root(60.0),
                some(`Progress.Root(60.0)`)
            )
        );

        // Progress - With label
        const progressLabeled = $.let(
            ShowcaseCard(
                "Labeled Progress",
                "Progress with label and value text",
                Progress.Root(75.0, {
                    label: "Upload Progress",
                    valueText: "75%",
                }),
                some(`
                    Progress.Root(75.0, {
                        label: "Upload Progress",
                        valueText: "75%",
                    })
                `)
            )
        );

        // Progress - Colors
        const progressColors = $.let(
            ShowcaseCard(
                "Progress Colors",
                "Different color palettes",
                Stack.VStack([
                    Progress.Root(80.0, { colorPalette: "blue", label: "Blue" }),
                    Progress.Root(60.0, { colorPalette: "green", label: "Green" }),
                    Progress.Root(40.0, { colorPalette: "orange", label: "Orange" }),
                    Progress.Root(20.0, { colorPalette: "red", label: "Red" }),
                ], { gap: "4", align: "stretch", width: "100%" }),
                some(`
                    Stack.VStack([
                        Progress.Root(80.0, { colorPalette: "blue", label: "Blue" }),
                        Progress.Root(60.0, { colorPalette: "green", label: "Green" }),
                        Progress.Root(40.0, { colorPalette: "orange", label: "Orange" }),
                        Progress.Root(20.0, { colorPalette: "red", label: "Red" }),
                    ], { gap: "4", align: "stretch", width: "100%" })
                `)
            )
        );

        // Progress - Sizes
        const progressSizes = $.let(
            ShowcaseCard(
                "Progress Sizes",
                "Available sizes: xs, sm, md, lg",
                Stack.VStack([
                    Progress.Root(50.0, { size: "xs", colorPalette: "blue" }),
                    Progress.Root(50.0, { size: "sm", colorPalette: "blue" }),
                    Progress.Root(50.0, { size: "md", colorPalette: "blue" }),
                    Progress.Root(50.0, { size: "lg", colorPalette: "blue" }),
                ], { gap: "4", align: "stretch", width: "100%" }),
                some(`
                    Stack.VStack([
                        Progress.Root(50.0, { size: "xs", colorPalette: "blue" }),
                        Progress.Root(50.0, { size: "sm", colorPalette: "blue" }),
                        Progress.Root(50.0, { size: "md", colorPalette: "blue" }),
                        Progress.Root(50.0, { size: "lg", colorPalette: "blue" }),
                    ], { gap: "4", align: "stretch", width: "100%" })
                `)
            )
        );

        // Progress - Striped
        const progressStriped = $.let(
            ShowcaseCard(
                "Striped Progress",
                "Striped pattern for visual emphasis",
                Stack.VStack([
                    Progress.Root(65.0, { striped: true, colorPalette: "blue" }),
                    Progress.Root(45.0, { striped: true, animated: true, colorPalette: "green" }),
                ], { gap: "4", align: "stretch", width: "100%" }),
                some(`
                    Stack.VStack([
                        Progress.Root(65.0, { striped: true, colorPalette: "blue" }),
                        Progress.Root(45.0, { striped: true, animated: true, colorPalette: "green" }),
                    ], { gap: "4", align: "stretch", width: "100%" })
                `)
            )
        );

        // Progress - Custom range
        const progressRange = $.let(
            ShowcaseCard(
                "Custom Range",
                "Progress with custom min/max",
                Progress.Root(7.5, {
                    min: 0,
                    max: 10,
                    label: "Rating",
                    valueText: "7.5 / 10",
                    colorPalette: "purple",
                }),
                some(`
                    Progress.Root(7.5, {
                        min: 0,
                        max: 10,
                        label: "Rating",
                        valueText: "7.5 / 10",
                        colorPalette: "purple",
                    })
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(alertInfo),
                Grid.Item(alertSuccess),
                Grid.Item(alertWarning),
                Grid.Item(alertError),
                Grid.Item(alertVariants),
                Grid.Item(alertTitleOnly),
                Grid.Item(progressBasic),
                Grid.Item(progressLabeled),
                Grid.Item(progressColors),
                Grid.Item(progressSizes),
                Grid.Item(progressStriped),
                Grid.Item(progressRange),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
