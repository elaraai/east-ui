/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { East, variant, some, NullType, StringType } from "@elaraai/east";
import {
    UIComponentType,
    Grid,
    Stack,
    Text,
    Breadcrumb,
    Accordion,
    State,
    Reactive,
} from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Navigation showcase - demonstrates Breadcrumb component.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Breadcrumb - Plain variant
        const breadcrumbPlain = $.let(
            ShowcaseCard(
                "Plain Breadcrumb",
                "Default plain variant with chevron separators",
                Breadcrumb.Root([
                    { label: "Home", current: variant("none", null), onClick: variant("none", null) },
                    { label: "Components", current: variant("none", null), onClick: variant("none", null) },
                    { label: "Breadcrumb", current: variant("some", true), onClick: variant("none", null) },
                ], {
                    variant: "plain",
                }),
                some(`
                    Breadcrumb.Root([
                        { label: "Home", current: variant("none", null), onClick: variant("none", null) },
                        { label: "Components", current: variant("none", null), onClick: variant("none", null) },
                        { label: "Breadcrumb", current: variant("some", true), onClick: variant("none", null) },
                    ], { variant: "plain" })
                `)
            )
        );

        // Breadcrumb - Underline variant
        const breadcrumbUnderline = $.let(
            ShowcaseCard(
                "Underline Breadcrumb",
                "Underline variant with color palette",
                Breadcrumb.Root([
                    { label: "Docs", current: variant("none", null), onClick: variant("none", null) },
                    { label: "Components", current: variant("none", null), onClick: variant("none", null) },
                    { label: "Props", current: variant("some", true), onClick: variant("none", null) },
                ], {
                    variant: "underline",
                    colorPalette: "blue",
                }),
                some(`
                    Breadcrumb.Root([
                        { label: "Docs", ... },
                        { label: "Components", ... },
                        { label: "Props", current: variant("some", true), ... },
                    ], { variant: "underline", colorPalette: "blue" })
                `)
            )
        );

        // Breadcrumb - Sizes
        const breadcrumbSizes = $.let(
            ShowcaseCard(
                "Breadcrumb Sizes",
                "Available sizes: sm, md, lg",
                Stack.VStack([
                    Breadcrumb.Root([
                        { label: "Home", current: variant("none", null), onClick: variant("none", null) },
                        { label: "Products", current: variant("none", null), onClick: variant("none", null) },
                        { label: "Item", current: variant("some", true), onClick: variant("none", null) },
                    ], { size: "sm" }),
                    Breadcrumb.Root([
                        { label: "Home", current: variant("none", null), onClick: variant("none", null) },
                        { label: "Products", current: variant("none", null), onClick: variant("none", null) },
                        { label: "Item", current: variant("some", true), onClick: variant("none", null) },
                    ], { size: "md" }),
                    Breadcrumb.Root([
                        { label: "Home", current: variant("none", null), onClick: variant("none", null) },
                        { label: "Products", current: variant("none", null), onClick: variant("none", null) },
                        { label: "Item", current: variant("some", true), onClick: variant("none", null) },
                    ], { size: "lg" }),
                ], { gap: "4", align: "flex-start" }),
                some(`
                    Breadcrumb.Root([...], { size: "sm" })
                    Breadcrumb.Root([...], { size: "md" })
                    Breadcrumb.Root([...], { size: "lg" })
                `)
            )
        );

        // Breadcrumb - Color palettes
        const breadcrumbColors = $.let(
            ShowcaseCard(
                "Color Palettes",
                "Underline variant with different color palettes",
                Stack.VStack([
                    Breadcrumb.Root([
                        { label: "Home", current: variant("none", null), onClick: variant("none", null) },
                        { label: "Blue", current: variant("some", true), onClick: variant("none", null) },
                    ], { variant: "underline", colorPalette: "blue" }),
                    Breadcrumb.Root([
                        { label: "Home", current: variant("none", null), onClick: variant("none", null) },
                        { label: "Teal", current: variant("some", true), onClick: variant("none", null) },
                    ], { variant: "underline", colorPalette: "teal" }),
                    Breadcrumb.Root([
                        { label: "Home", current: variant("none", null), onClick: variant("none", null) },
                        { label: "Purple", current: variant("some", true), onClick: variant("none", null) },
                    ], { variant: "underline", colorPalette: "purple" }),
                ], { gap: "4", align: "flex-start" }),
                some(`
                    Breadcrumb.Root([...], { variant: "underline", colorPalette: "blue" })
                    Breadcrumb.Root([...], { variant: "underline", colorPalette: "teal" })
                    Breadcrumb.Root([...], { variant: "underline", colorPalette: "purple" })
                `)
            )
        );

        // Breadcrumb - Interactive with onClick and Reactive
        $.if(State.has("breadcrumb_page").not(), $ => {
            $(State.write([StringType], "breadcrumb_page", "Home"));
        });

        const navigateTo = (page: string) => East.function([], NullType, $ => {
            $(State.write([StringType], "breadcrumb_page", page));
            return null;
        });

        const breadcrumbInteractive = $.let(
            ShowcaseCard(
                "Interactive Breadcrumb",
                "Click items to navigate - uses Reactive.Root to display current page",
                Stack.VStack([
                    Breadcrumb.Root([
                        { label: "Home", current: variant("none", null), onClick: variant("some", navigateTo("Home")) },
                        { label: "Products", current: variant("none", null), onClick: variant("some", navigateTo("Products")) },
                        { label: "Widgets", current: variant("none", null), onClick: variant("some", navigateTo("Widgets")) },
                        { label: "Details", current: variant("some", true), onClick: variant("none", null) },
                    ], { variant: "underline", colorPalette: "blue" }),
                    Reactive.Root(East.function([], UIComponentType, $ => {
                        const page = $.let(State.read([StringType], "breadcrumb_page"));
                        return Text.Root(East.str`Current page: ${page}`, { fontWeight: "bold" });
                    })),
                ], { gap: "4", align: "flex-start" }),
                some(`
                    const navigateTo = (page: string) => East.function([], NullType, $ => {
                        $(State.write([StringType], "breadcrumb_page", page));
                        return $.return(null);
                    });

                    Breadcrumb.Root([
                        { label: "Home", ..., onClick: variant("some", navigateTo("Home")) },
                        { label: "Products", ..., onClick: variant("some", navigateTo("Products")) },
                        { label: "Details", current: variant("some", true), ... },
                    ], { variant: "underline", colorPalette: "blue" })

                    Reactive.Root(East.function([], UIComponentType, $ => {
                        const page = $.let(State.read([StringType], "breadcrumb_page"));
                        return Text.Root(East.concat("Current page: ", page));
                    }))
                `)
            )
        );

        return Accordion.Root([
            Accordion.Item("breadcrumb", "Breadcrumb", [
                Grid.Root([
                    Grid.Item(breadcrumbPlain),
                    Grid.Item(breadcrumbUnderline),
                    Grid.Item(breadcrumbSizes),
                    Grid.Item(breadcrumbColors),
                    Grid.Item(breadcrumbInteractive, { colSpan: "2" }),
                ], { templateColumns: "repeat(2, 1fr)", gap: "4" }),
            ]),
        ], { multiple: true, collapsible: true });
    }
);
