import { East, some, StringType, NullType } from "@elaraai/east";
import { Tabs, UIComponentType, Grid, Text, Box, Stack, State, Reactive, Badge } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Tabs showcase - demonstrates tabbed content panels.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic tabs
        const basic = $.let(
            ShowcaseCard(
                "Basic Tabs",
                "Simple tabbed interface",
                Box.Root([
                    Tabs.Root([
                        Tabs.Item("overview", "Overview", [
                            Box.Root([Text.Root("Welcome to the overview tab. This is the default content panel.")], { padding: "4" }),
                        ]),
                        Tabs.Item("features", "Features", [
                            Box.Root([Text.Root("Explore our features in this panel.")], { padding: "4" }),
                        ]),
                        Tabs.Item("pricing", "Pricing", [
                            Box.Root([Text.Root("View pricing information here.")], { padding: "4" }),
                        ]),
                    ], {
                        defaultValue: "overview",
                    }),
                ], { width: "100%" }),
                some(`
                    Box.Root([
                        Tabs.Root([
                            Tabs.Item("overview", "Overview", [
                                Box.Root([Text.Root("Welcome to the overview tab.")], { padding: "4" }),
                            ]),
                            Tabs.Item("features", "Features", [
                                Box.Root([Text.Root("Explore our features in this panel.")], { padding: "4" }),
                            ]),
                            Tabs.Item("pricing", "Pricing", [
                                Box.Root([Text.Root("View pricing information here.")], { padding: "4" }),
                            ]),
                        ], {
                            defaultValue: "overview",
                        }),
                    ], { width: "100%" })
                `)
            )
        );

        // Line variant
        const line = $.let(
            ShowcaseCard(
                "Line Variant",
                "Underline indicator style",
                Box.Root([
                    Tabs.Root([
                        Tabs.Item("tab1", "Account", [
                            Box.Root([Text.Root("Manage your account settings and preferences.")], { padding: "4" }),
                        ]),
                        Tabs.Item("tab2", "Security", [
                            Box.Root([Text.Root("Configure security options and two-factor authentication.")], { padding: "4" }),
                        ]),
                        Tabs.Item("tab3", "Billing", [
                            Box.Root([Text.Root("View billing history and update payment methods.")], { padding: "4" }),
                        ]),
                    ], {
                        variant: "line",
                        defaultValue: "tab1",
                    }),
                ], { width: "100%" }),
                some(`
                    Box.Root([
                        Tabs.Root([
                            Tabs.Item("tab1", "Account", [
                                Box.Root([Text.Root("Manage your account settings and preferences.")], { padding: "4" }),
                            ]),
                            Tabs.Item("tab2", "Security", [
                                Box.Root([Text.Root("Configure security options.")], { padding: "4" }),
                            ]),
                            Tabs.Item("tab3", "Billing", [
                                Box.Root([Text.Root("View billing history.")], { padding: "4" }),
                            ]),
                        ], {
                            variant: "line",
                            defaultValue: "tab1",
                        }),
                    ], { width: "100%" })
                `)
            )
        );

        // Enclosed variant
        const enclosed = $.let(
            ShowcaseCard(
                "Enclosed Variant",
                "Bordered tab container",
                Box.Root([
                    Tabs.Root([
                        Tabs.Item("general", "General", [
                            Box.Root([Text.Root("General application settings.")], { padding: "4" }),
                        ]),
                        Tabs.Item("advanced", "Advanced", [
                            Box.Root([Text.Root("Advanced configuration options.")], { padding: "4" }),
                        ]),
                    ], {
                        variant: "enclosed",
                        defaultValue: "general",
                    }),
                ], { width: "100%" }),
                some(`
                    Box.Root([
                        Tabs.Root([
                            Tabs.Item("general", "General", [
                                Box.Root([Text.Root("General application settings.")], { padding: "4" }),
                            ]),
                            Tabs.Item("advanced", "Advanced", [
                                Box.Root([Text.Root("Advanced configuration options.")], { padding: "4" }),
                            ]),
                        ], {
                            variant: "enclosed",
                            defaultValue: "general",
                        }),
                    ], { width: "100%" })
                `)
            )
        );

        // Outline variant
        const outline = $.let(
            ShowcaseCard(
                "Outline Variant",
                "Outlined tab buttons",
                Box.Root([
                    Tabs.Root([
                        Tabs.Item("all", "All Items", [
                            Box.Root([Text.Root("Showing all items in the list.")], { padding: "4" }),
                        ]),
                        Tabs.Item("active", "Active", [
                            Box.Root([Text.Root("Showing only active items.")], { padding: "4" }),
                        ]),
                        Tabs.Item("archived", "Archived", [
                            Box.Root([Text.Root("Showing archived items.")], { padding: "4" }),
                        ]),
                    ], {
                        variant: "outline",
                        defaultValue: "all",
                    }),
                ], { width: "100%" }),
                some(`
                    Box.Root([
                        Tabs.Root([
                            Tabs.Item("all", "All Items", [
                                Box.Root([Text.Root("Showing all items in the list.")], { padding: "4" }),
                            ]),
                            Tabs.Item("active", "Active", [
                                Box.Root([Text.Root("Showing only active items.")], { padding: "4" }),
                            ]),
                            Tabs.Item("archived", "Archived", [
                                Box.Root([Text.Root("Showing archived items.")], { padding: "4" }),
                            ]),
                        ], {
                            variant: "outline",
                            defaultValue: "all",
                        }),
                    ], { width: "100%" })
                `)
            )
        );

        // Subtle variant
        const subtle = $.let(
            ShowcaseCard(
                "Subtle Variant",
                "Light background on selected",
                Box.Root([
                    Tabs.Root([
                        Tabs.Item("home", "Home", [
                            Box.Root([Text.Root("Welcome to the home tab.")], { padding: "4" }),
                        ]),
                        Tabs.Item("profile", "Profile", [
                            Box.Root([Text.Root("Your profile information.")], { padding: "4" }),
                        ]),
                        Tabs.Item("settings", "Settings", [
                            Box.Root([Text.Root("Application settings.")], { padding: "4" }),
                        ]),
                    ], {
                        variant: "subtle",
                        defaultValue: "home",
                    }),
                ], { width: "100%" }),
                some(`
                    Box.Root([
                        Tabs.Root([
                            Tabs.Item("home", "Home", [
                                Box.Root([Text.Root("Welcome to the home tab.")], { padding: "4" }),
                            ]),
                            Tabs.Item("profile", "Profile", [
                                Box.Root([Text.Root("Your profile information.")], { padding: "4" }),
                            ]),
                            Tabs.Item("settings", "Settings", [
                                Box.Root([Text.Root("Application settings.")], { padding: "4" }),
                            ]),
                        ], {
                            variant: "subtle",
                            defaultValue: "home",
                        }),
                    ], { width: "100%" })
                `)
            )
        );

        // Fitted tabs
        const fitted = $.let(
            ShowcaseCard(
                "Fitted Tabs",
                "Equal width tabs",
                Box.Root([
                    Tabs.Root([
                        Tabs.Item("day", "Day", [
                            Box.Root([Text.Root("Daily view of your calendar.")], { padding: "4" }),
                        ]),
                        Tabs.Item("week", "Week", [
                            Box.Root([Text.Root("Weekly view of your calendar.")], { padding: "4" }),
                        ]),
                        Tabs.Item("month", "Month", [
                            Box.Root([Text.Root("Monthly view of your calendar.")], { padding: "4" }),
                        ]),
                    ], {
                        variant: "line",
                        fitted: true,
                        defaultValue: "week",
                    }),
                ], { width: "100%" }),
                some(`
                    Box.Root([
                        Tabs.Root([
                            Tabs.Item("day", "Day", [
                                Box.Root([Text.Root("Daily view of your calendar.")], { padding: "4" }),
                            ]),
                            Tabs.Item("week", "Week", [
                                Box.Root([Text.Root("Weekly view of your calendar.")], { padding: "4" }),
                            ]),
                            Tabs.Item("month", "Month", [
                                Box.Root([Text.Root("Monthly view of your calendar.")], { padding: "4" }),
                            ]),
                        ], {
                            variant: "line",
                            fitted: true,
                            defaultValue: "week",
                        }),
                    ], { width: "100%" })
                `)
            )
        );

        // Different sizes
        const sizes = $.let(
            ShowcaseCard(
                "Tab Sizes",
                "Small, medium, and large",
                Stack.VStack([
                    Tabs.Root([
                        Tabs.Item("sm1", "Small", [Box.Root([Text.Root("Small size tabs")], { padding: "4" })]),
                        Tabs.Item("sm2", "Tabs", [Box.Root([Text.Root("Content")], { padding: "4" })]),
                    ], { size: "sm", defaultValue: "sm1", variant: "line" }),
                    Tabs.Root([
                        Tabs.Item("md1", "Medium", [Box.Root([Text.Root("Medium size tabs")], { padding: "4" })]),
                        Tabs.Item("md2", "Tabs", [Box.Root([Text.Root("Content")], { padding: "4" })]),
                    ], { size: "md", defaultValue: "md1", variant: "line" }),
                    Tabs.Root([
                        Tabs.Item("lg1", "Large", [Box.Root([Text.Root("Large size tabs")], { padding: "4" })]),
                        Tabs.Item("lg2", "Tabs", [Box.Root([Text.Root("Content")], { padding: "4" })]),
                    ], { size: "lg", defaultValue: "lg1", variant: "line" }),
                ], { gap: "4", align: "stretch", width: "100%" }),
                some(`
                    Stack.VStack([
                        Tabs.Root([
                            Tabs.Item("sm1", "Small", [Box.Root([Text.Root("Small size tabs")], { padding: "4" })]),
                            Tabs.Item("sm2", "Tabs", [Box.Root([Text.Root("Content")], { padding: "4" })]),
                        ], { size: "sm", defaultValue: "sm1", variant: "line" }),
                        Tabs.Root([
                            Tabs.Item("md1", "Medium", [Box.Root([Text.Root("Medium size tabs")], { padding: "4" })]),
                            Tabs.Item("md2", "Tabs", [Box.Root([Text.Root("Content")], { padding: "4" })]),
                        ], { size: "md", defaultValue: "md1", variant: "line" }),
                        Tabs.Root([
                            Tabs.Item("lg1", "Large", [Box.Root([Text.Root("Large size tabs")], { padding: "4" })]),
                            Tabs.Item("lg2", "Tabs", [Box.Root([Text.Root("Content")], { padding: "4" })]),
                        ], { size: "lg", defaultValue: "lg1", variant: "line" }),
                    ], { gap: "4", align: "stretch", width: "100%" })
                `)
            )
        );

        // With disabled tab
        const withDisabled = $.let(
            ShowcaseCard(
                "Disabled Tab",
                "One tab is disabled",
                Box.Root([
                    Tabs.Root([
                        Tabs.Item("enabled1", "Enabled", [
                            Box.Root([Text.Root("This tab is enabled.")], { padding: "4" }),
                        ]),
                        Tabs.Item("disabled", "Disabled", [
                            Box.Root([Text.Root("This content is not accessible.")], { padding: "4" }),
                        ], { disabled: true }),
                        Tabs.Item("enabled2", "Also Enabled", [
                            Box.Root([Text.Root("This tab is also enabled.")], { padding: "4" }),
                        ]),
                    ], {
                        variant: "line",
                        defaultValue: "enabled1",
                    }),
                ], { width: "100%" }),
                some(`
                    Box.Root([
                        Tabs.Root([
                            Tabs.Item("enabled1", "Enabled", [
                                Box.Root([Text.Root("This tab is enabled.")], { padding: "4" }),
                            ]),
                            Tabs.Item("disabled", "Disabled", [
                                Box.Root([Text.Root("This content is not accessible.")], { padding: "4" }),
                            ], { disabled: true }),
                            Tabs.Item("enabled2", "Also Enabled", [
                                Box.Root([Text.Root("This tab is also enabled.")], { padding: "4" }),
                            ]),
                        ], {
                            variant: "line",
                            defaultValue: "enabled1",
                        }),
                    ], { width: "100%" })
                `)
            )
        );

        // =====================================================================
        // INTERACTIVE EXAMPLES - Demonstrate callbacks with Reactive.Root
        // =====================================================================

        // Initialize state for interactive examples
        $.if(State.has("tabs_selected").not(), $ => {
            $(State.write([StringType], "tabs_selected", "tab1"));
        });

        // Interactive Tabs with onValueChange
        const interactiveTabs = $.let(
            ShowcaseCard(
                "Interactive Tabs",
                "Click tabs to see onValueChange callback",
                Reactive.Root(East.function([], UIComponentType, $ => {
                    const selected = $.let(State.read([StringType], "tabs_selected"));

                    const onValueChange = East.function(
                        [StringType],
                        NullType,
                        ($, newValue) => {
                            $(State.write([StringType], "tabs_selected", newValue));
                        }
                    );

                    return Stack.VStack([
                        Box.Root([
                            Tabs.Root([
                                Tabs.Item("tab1", "Dashboard", [
                                    Box.Root([Text.Root("Dashboard content - view your metrics here.")], { padding: "4" }),
                                ]),
                                Tabs.Item("tab2", "Analytics", [
                                    Box.Root([Text.Root("Analytics content - detailed reports and charts.")], { padding: "4" }),
                                ]),
                                Tabs.Item("tab3", "Settings", [
                                    Box.Root([Text.Root("Settings content - configure your preferences.")], { padding: "4" }),
                                ]),
                            ], {
                                variant: "line",
                                defaultValue: "tab1",
                                onValueChange,
                            }),
                        ], { width: "100%" }),
                        Badge.Root(
                            East.str`Selected tab: ${selected}`,
                            { colorPalette: "blue", variant: "solid" }
                        ),
                    ], { gap: "3", align: "stretch" });
                })),
                some(`
                    Reactive.Root(East.function([], UIComponentType, $ => {
                        const selected = $.let(State.read([StringType], "tabs_selected"));

                        const onValueChange = East.function(
                            [StringType],
                            NullType,
                            ($, newValue) => {
                                $(State.write([StringType], "tabs_selected", newValue));
                            }
                        );

                        return Stack.VStack([
                            Box.Root([
                                Tabs.Root([
                                    Tabs.Item("tab1", "Dashboard", [
                                        Box.Root([Text.Root("Dashboard content - view your metrics here.")], { padding: "4" }),
                                    ]),
                                    Tabs.Item("tab2", "Analytics", [
                                        Box.Root([Text.Root("Analytics content - detailed reports and charts.")], { padding: "4" }),
                                    ]),
                                    Tabs.Item("tab3", "Settings", [
                                        Box.Root([Text.Root("Settings content - configure your preferences.")], { padding: "4" }),
                                    ]),
                                ], {
                                    variant: "line",
                                    defaultValue: "tab1",
                                    onValueChange,
                                }),
                            ], { width: "100%" }),
                            Badge.Root(
                                East.str\`Selected tab: \${selected}\`,
                                { colorPalette: "blue", variant: "solid" }
                            ),
                        ], { gap: "3", align: "stretch" });
                    }))
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(line),
                Grid.Item(enclosed),
                Grid.Item(outline),
                Grid.Item(subtle),
                Grid.Item(fitted),
                Grid.Item(sizes, { colSpan: "2" }),
                Grid.Item(withDisabled),
                Grid.Item(interactiveTabs),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
