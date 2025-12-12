/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { East, some, BooleanType, IntegerType, NullType } from "@elaraai/east";
import {
    UIComponentType,
    Grid,
    Stack,
    Text,
    Button,
    Icon,
    Tooltip,
    Menu,
    Popover,
    HoverCard,
    Dialog,
    Drawer,
    ToggleTip,
    Card,
    Avatar,
    Badge,
    Chart,
    State,
    Reactive,
} from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Overlays showcase - demonstrates Tooltip, Menu, Popover, HoverCard, Dialog, Drawer, and ToggleTip components.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Tooltip - Basic
        const tooltipBasic = $.let(
            ShowcaseCard(
                "Basic Tooltip",
                "Simple tooltip on hover",
                Tooltip.Root(
                    Button.Root("Hover me"),
                    "This is a tooltip"
                ),
                some(`
                    Tooltip.Root(
                        Button.Root("Hover me"),
                        "This is a tooltip"
                    )
                `)
            )
        );

        // Tooltip - With Arrow
        const tooltipArrow = $.let(
            ShowcaseCard(
                "Tooltip with Arrow",
                "Tooltip with pointing arrow",
                Tooltip.Root(
                    Button.Root("With Arrow", { variant: "solid", colorPalette: "blue" }),
                    "This tooltip has an arrow",
                    { hasArrow: true }
                ),
                some(`
                    Tooltip.Root(
                        Button.Root("With Arrow", { variant: "solid", colorPalette: "blue" }),
                        "This tooltip has an arrow",
                        { hasArrow: true }
                    )
                `)
            )
        );

        // Menu - Basic
        const menuBasic = $.let(
            ShowcaseCard(
                "Basic Menu",
                "Simple dropdown menu",
                Menu.Root(
                    Button.Root("Open Menu"),
                    [
                        Menu.Item("view", "View"),
                        Menu.Item("edit", "Edit"),
                        Menu.Separator(),
                        Menu.Item("delete", "Delete"),
                    ]
                ),
                some(`
                    Menu.Root(
                        Button.Root("Open Menu"),
                        [
                            Menu.Item("view", "View"),
                            Menu.Item("edit", "Edit"),
                            Menu.Separator(),
                            Menu.Item("delete", "Delete"),
                        ]
                    )
                `)
            )
        );

        // Menu - With Disabled Items
        const menuDisabled = $.let(
            ShowcaseCard(
                "Menu with Disabled Items",
                "Some items are disabled",
                Menu.Root(
                    Button.Root("Options", { variant: "outline" }),
                    [
                        Menu.Item("new", "New File"),
                        Menu.Item("save", "Save", true),
                        Menu.Separator(),
                        Menu.Item("close", "Close"),
                    ]
                ),
                some(`
                    Menu.Root(
                        Button.Root("Options", { variant: "outline" }),
                        [
                            Menu.Item("new", "New File"),
                            Menu.Item("save", "Save", true),
                            Menu.Separator(),
                            Menu.Item("close", "Close"),
                        ]
                    )
                `)
            )
        );

        // Popover - Basic
        const popoverBasic = $.let(
            ShowcaseCard(
                "Basic Popover",
                "Click-triggered floating panel",
                Popover.Root(
                    Button.Root("Open Popover"),
                    [Text.Root("This is the popover content. You can put any UI components here.")],
                    { title: "Popover Title", description: "A helpful description" }
                ),
                some(`
                    Popover.Root(
                        Button.Root("Open Popover"),
                        [Text.Root("Popover content here.")],
                        { title: "Popover Title", description: "A helpful description" }
                    )
                `)
            )
        );

        // Popover - With Chart
        const popoverChart = $.let(
            ShowcaseCard(
                "Popover with Chart",
                "Rich content with area chart",
                Popover.Root(
                    Button.Root("View Stats", { variant: "solid", colorPalette: "blue" }),
                    [
                        Chart.Area(
                            [
                                { day: "Mon", value: 120 },
                                { day: "Tue", value: 150 },
                                { day: "Wed", value: 180 },
                                { day: "Thu", value: 140 },
                                { day: "Fri", value: 200 },
                            ],
                            {
                                value: { color: "blue.solid", },
                            },
                            {
                                xAxis: Chart.Axis({ dataKey: "day", }),
                                fillOpacity: 0.3,
                                margin: Chart.Margin({ top: 30n, right: 0n, bottom: 0n, left: -20n }),
                            }
                        ),
                    ],
                    { hasArrow: true, title: "Weekly Sales" }
                ),
                some(`
                    Popover.Root(
                        Button.Root("View Stats", { variant: "solid", colorPalette: "blue" }),
                        [Chart.Area(data, series, { xAxis: Chart.Axis({ dataKey: "day" }) })],
                        { hasArrow: true, title: "Weekly Sales" }
                    )
                `)
            )
        );

        // HoverCard - User Profile
        const hoverCardProfile = $.let(
            ShowcaseCard(
                "HoverCard - User Profile",
                "Rich preview on hover",
                HoverCard.Root(
                    Text.Root("@johndoe", { color: "blue.500", fontWeight: "medium" }),
                    [
                        Stack.HStack([
                            Avatar.Root({ name: "John Doe", size: "lg" }),
                            Stack.VStack([
                                Text.Root("John Doe", { fontWeight: "semibold" }),
                                Text.Root("Software Engineer", { fontSize: "sm", color: "gray.500" }),
                                Stack.HStack([
                                    Badge.Root("Pro", { colorPalette: "purple", variant: "solid" }),
                                    Badge.Root("Verified", { colorPalette: "green", variant: "subtle" }),
                                ], { gap: "1" }),
                            ], { gap: "1", align: 'flex-start' }),
                        ], { gap: "3" }),
                    ],
                    { placement: "bottom", openDelay: 200n }
                ),
                some(`
                    HoverCard.Root(
                        Text.Root("@johndoe", { color: "blue.500", fontWeight: "medium" }),
                        [
                            Stack.HStack([
                                Avatar.Root({ name: "John Doe", size: "lg" }),
                                Stack.VStack([
                                    Text.Root("John Doe", { fontWeight: "semibold" }),
                                    Text.Root("Software Engineer", { fontSize: "sm" }),
                                ], { gap: "1", align: 'flex-start' }),
                            ], { gap: "3" }),
                        ],
                        { placement: "bottom", openDelay: 200n }
                    )
                `)
            )
        );

        // HoverCard - Link Preview
        const hoverCardLink = $.let(
            ShowcaseCard(
                "HoverCard - Link Preview",
                "Preview content on hover",
                HoverCard.Root(
                    Button.Root("View Documentation", { variant: "ghost", colorPalette: "blue" }),
                    [
                        Stack.VStack([
                            Text.Root("East UI Documentation", { fontWeight: "semibold" }),
                            Text.Root("Complete guide to building UIs with East UI components. Learn about layout, forms, charts, and more.", { fontSize: "sm", color: "gray.600" }),
                        ], { gap: "2", padding: "2" }),
                    ],
                    { hasArrow: true }
                ),
                some(`
                    HoverCard.Root(
                        Button.Root("View Documentation", { variant: "ghost", colorPalette: "blue" }),
                        [
                            Stack.VStack([
                                Text.Root("East UI Documentation", { fontWeight: "semibold" }),
                                Text.Root("Guide to building UIs.", { fontSize: "sm" }),
                            ], { gap: "2", padding: "2" }),
                        ],
                        { hasArrow: true }
                    )
                `)
            )
        );

        // Dialog - Basic
        const dialogBasic = $.let(
            ShowcaseCard(
                "Basic Dialog",
                "Modal overlay dialog",
                Dialog.Root(
                    Button.Root("Open Dialog"),
                    [
                        Text.Root("This is a dialog. It appears as a modal overlay and captures focus."),
                        Stack.HStack([
                            Button.Root("Cancel", { variant: "outline" }),
                            Button.Root("Confirm", { variant: "solid", colorPalette: "blue" }),
                        ], { gap: "2", justify: "flex-end" }),
                    ],
                    { title: "Confirm Action", description: "Are you sure you want to proceed?" }
                ),
                some(`
                    Dialog.Root(
                        Button.Root("Open Dialog"),
                        [
                            Text.Root("Dialog content here."),
                            Stack.HStack([
                                Button.Root("Cancel", { variant: "outline" }),
                                Button.Root("Confirm", { variant: "solid", colorPalette: "blue" }),
                            ], { gap: "2", justify: "flex-end" }),
                        ],
                        { title: "Confirm Action", description: "Are you sure?" }
                    )
                `)
            )
        );

        // Dialog - Large
        const dialogLarge = $.let(
            ShowcaseCard(
                "Large Dialog",
                "Dialog with more content",
                Dialog.Root(
                    Button.Root("Open Settings", { variant: "outline" }),
                    [
                        Stack.VStack([
                            Text.Root("Configure your preferences below. Changes will be saved automatically."),
                            Card.Root([
                                Text.Root("Notification settings, privacy options, and more would go here."),
                            ], { variant: "outline" }),
                        ], { gap: "4" }),
                    ],
                    { title: "Settings", size: "lg" }
                ),
                some(`
                    Dialog.Root(
                        Button.Root("Open Settings", { variant: "outline" }),
                        [
                            Stack.VStack([
                                Text.Root("Configure your preferences."),
                                Card.Root([Text.Root("Settings content.")], { variant: "outline" }),
                            ], { gap: "4" }),
                        ],
                        { title: "Settings", size: "lg" }
                    )
                `)
            )
        );

        // Drawer - Right
        const drawerRight = $.let(
            ShowcaseCard(
                "Drawer - Right Side",
                "Slide-in panel from right",
                Drawer.Root(
                    Button.Root("Open Drawer"),
                    [
                        Stack.VStack([
                            Text.Root("This is a drawer panel that slides in from the side."),
                            Text.Root("Great for navigation, settings, or detailed content.", { color: "gray.500" }),
                        ], { gap: "4" }),
                    ],
                    { title: "Drawer Title", description: "Slide-in panel", placement: "end", size: "md" }
                ),
                some(`
                    Drawer.Root(
                        Button.Root("Open Drawer"),
                        [
                            Stack.VStack([
                                Text.Root("Drawer content here."),
                            ], { gap: "4" }),
                        ],
                        { title: "Drawer Title", placement: "end", size: "md" }
                    )
                `)
            )
        );

        // Drawer - Left
        const drawerLeft = $.let(
            ShowcaseCard(
                "Drawer - Left Side",
                "Slide-in panel from left",
                Drawer.Root(
                    Button.Root("Open Navigation", { variant: "outline" }),
                    [
                        Stack.VStack([
                            Button.Root("Dashboard", { variant: "ghost", size: "sm" }),
                            Button.Root("Projects", { variant: "ghost", size: "sm" }),
                            Button.Root("Team", { variant: "ghost", size: "sm" }),
                            Button.Root("Settings", { variant: "ghost", size: "sm" }),
                        ], { gap: "1", align: "stretch" }),
                    ],
                    { title: "Navigation", placement: "start" }
                ),
                some(`
                    Drawer.Root(
                        Button.Root("Open Navigation", { variant: "outline" }),
                        [
                            Stack.VStack([
                                Button.Root("Dashboard", { variant: "ghost", size: "sm" }),
                                Button.Root("Projects", { variant: "ghost", size: "sm" }),
                            ], { gap: "1", align: "stretch" }),
                        ],
                        { title: "Navigation", placement: "start" }
                    )
                `)
            )
        );

        // ToggleTip - Basic
        const toggleTipBasic = $.let(
            ShowcaseCard(
                "ToggleTip",
                "Click-activated tooltip (accessible)",
                Stack.HStack([
                    Text.Root("What is this?"),
                    ToggleTip.Root(
                        Icon.Root("fas", "question-circle", { size: "sm", color: "gray.500" }),
                        "ToggleTip is an accessible alternative to hover tooltips. Click to toggle!",
                        { placement: "top", hasArrow: true }
                    ),
                ], { gap: "2", align: "center" }),
                some(`
                    Stack.HStack([
                        Text.Root("What is this?"),
                        ToggleTip.Root(
                            Icon.Root("fas", "question-circle", { size: "sm", color: "gray.500" }),
                            "ToggleTip is an accessible alternative to hover tooltips.",
                            { placement: "top", hasArrow: true }
                        ),
                    ], { gap: "2", align: "center" })
                `)
            )
        );

        // ToggleTip - Info
        const toggleTipInfo = $.let(
            ShowcaseCard(
                "ToggleTip - Info Button",
                "Help button with toggle tip",
                ToggleTip.Root(
                    Button.Root("?", { variant: "outline", size: "sm" }),
                    "Click the info button for help. This is useful for touch and keyboard users.",
                    { placement: "bottom" }
                ),
                some(`
                    ToggleTip.Root(
                        Button.Root("?", { variant: "outline", size: "sm" }),
                        "Click the info button for help.",
                        { placement: "bottom" }
                    )
                `)
            )
        );

        // =====================================================================
        // INTERACTIVE EXAMPLES - Demonstrate callbacks with Reactive.Root
        // =====================================================================

        // Initialize state for interactive examples
        $(State.initTyped("dialog_open_count", 0n, IntegerType)());
        $(State.initTyped("dialog_close_count", 0n, IntegerType)());
        $(State.initTyped("drawer_open_count", 0n, IntegerType)());

        // Interactive Dialog with onOpenChange
        const interactiveDialog = $.let(
            ShowcaseCard(
                "Interactive Dialog",
                "Dialog with onOpenChange callback",
                Reactive.Root($ => {

                    const onOpenChange = East.function(
                        [BooleanType],
                        NullType,
                        ($, isOpen) => {
                            const openCount = $.let(State.readTyped("dialog_open_count", IntegerType)());
                            const closeCount = $.let(State.readTyped("dialog_close_count", IntegerType)());

                            $.if(isOpen, $ => $(State.writeTyped("dialog_open_count", some(openCount.unwrap('some').add(1n)), IntegerType)())
                            ).else($ => $(State.writeTyped("dialog_close_count", some(closeCount.unwrap('some').add(1n)), IntegerType)()))
                        }
                    );

                    const openCount = $.let(State.readTyped("dialog_open_count", IntegerType)());
                    const closeCount = $.let(State.readTyped("dialog_close_count", IntegerType)());


                    return Stack.VStack([
                        Dialog.Root(
                            Button.Root("Open Dialog"),
                            [
                                Text.Root("This dialog tracks when it's opened and closed."),
                                Stack.HStack([
                                    Button.Root("Got it!", { variant: "solid", colorPalette: "blue" }),
                                ], { gap: "2", justify: "flex-end" }),
                            ],
                            { title: "Interactive Dialog", onOpenChange }
                        ),
                        Stack.HStack([
                            Badge.Root(East.str`Opened: ${openCount.unwrap('some')}`, { colorPalette: "green", variant: "solid" }),
                            Badge.Root(East.str`Closed: ${closeCount.unwrap('some')}`, { colorPalette: "red", variant: "solid" }),
                        ], { gap: "2" }),
                    ], { gap: "3", align: "flex-start" });
                }),
                some(`Reactive.Root($ => {
    const openCount = $.let(State.readTyped("dialog_open_count", IntegerType)());
    const onOpenChange = East.function([BooleanType], NullType, ($, isOpen) => {
        // Track open/close events
    });
    return Dialog.Root(Button.Root("Open"), [...content], { onOpenChange });
})`)
            )
        );

        // Interactive Drawer with onOpenChange
        const interactiveDrawer = $.let(
            ShowcaseCard(
                "Interactive Drawer",
                "Drawer with onOpenChange callback",
                Reactive.Root($ => {
                    const onOpenChange = $.let(East.function(
                        [BooleanType],
                        NullType,
                        ($, isOpen) => {
                                                const openCount = $.let(State.readTyped("drawer_open_count", IntegerType)());
                            $.if(isOpen, $ => $(State.writeTyped("drawer_open_count", some(openCount.unwrap('some').add(1n)), IntegerType)()))
                        }
                    ));
                    const openCount = $.let(State.readTyped("drawer_open_count", IntegerType)());
                    return Stack.VStack([
                        Drawer.Root(
                            Button.Root("Open Drawer"),
                            [
                                Stack.VStack([
                                    Text.Root("This drawer counts how many times it's been opened."),
                                    Badge.Root(East.str`Times opened: ${openCount.unwrap('some')}`, { colorPalette: "purple", size: "lg" }),
                                ], { gap: "4" }),
                            ],
                            { title: "Interactive Drawer", placement: "end", onOpenChange }
                        ),
                        Badge.Root(East.str`Drawer opened: ${openCount.unwrap('some')} times`, { colorPalette: "purple", variant: "solid" }),
                    ], { gap: "3", align: "flex-start" });
                }),
                some(`Reactive.Root($ => {
    const openCount = $.let(State.readTyped("drawer_open_count", IntegerType)());
    const onOpenChange = East.function([BooleanType], NullType, ($, isOpen) => {
        // Track open events
    });
    return Drawer.Root(Button.Root("Open"), [...content], { onOpenChange });
})`)
            )
        );

        return Grid.Root(
            [
                // Tooltips
                Grid.Item(tooltipBasic),
                Grid.Item(tooltipArrow),
                // Menus
                Grid.Item(menuBasic),
                Grid.Item(menuDisabled),
                // Popovers
                Grid.Item(popoverBasic),
                Grid.Item(popoverChart),
                // HoverCards
                Grid.Item(hoverCardProfile),
                Grid.Item(hoverCardLink),
                // Dialogs
                Grid.Item(dialogBasic),
                Grid.Item(dialogLarge),
                // Drawers
                Grid.Item(drawerRight),
                Grid.Item(drawerLeft),
                // ToggleTips
                Grid.Item(toggleTipBasic),
                Grid.Item(toggleTipInfo),
                // Interactive examples
                Grid.Item(interactiveDialog),
                Grid.Item(interactiveDrawer),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
