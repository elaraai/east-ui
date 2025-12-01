import { East } from "@elaraai/east";
import { Stack, Text, UIComponentType, Grid, Style } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Stack showcase - demonstrates Stack, HStack, and VStack components.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic VStack
        const basicVStack = $.let(
            ShowcaseCard(
                "Basic VStack",
                "Vertical stack with gap",
                Stack.VStack([
                    Text.Root("First item"),
                    Text.Root("Second item"),
                    Text.Root("Third item"),
                ], { gap: "3" })
            )
        );

        // Basic HStack
        const basicHStack = $.let(
            ShowcaseCard(
                "Basic HStack",
                "Horizontal stack with gap",
                Stack.HStack([
                    Text.Root("Left"),
                    Text.Root("Center"),
                    Text.Root("Right"),
                ], { gap: "4" })
            )
        );

        // HStack with justify
        const justifiedHStack = $.let(
            ShowcaseCard(
                "Justified HStack",
                "Items spread across container",
                Stack.HStack([
                    Text.Root("Start"),
                    Text.Root("End"),
                ], {
                    gap: "4",
                    justify: Style.JustifyContent("space-between"),
                    padding: "4",
                    background: "gray.100",
                    width: "100%",
                })
            )
        );

        // Centered stack
        const centered = $.let(
            ShowcaseCard(
                "Centered Stack",
                "Items centered horizontally and vertically",
                Stack.VStack([
                    Text.Root("Centered content"),
                    Text.Root("Also centered"),
                ], {
                    gap: "2",
                    align: Style.AlignItems("center"),
                    justify: Style.JustifyContent("center"),
                    padding: "6",
                    background: "blue.50",
                    height: "120px",
                })
            )
        );

        // Wrapping stack
        const wrapping = $.let(
            ShowcaseCard(
                "Wrapping Stack",
                "Items wrap to next line when needed",
                Stack.HStack([
                    Text.Root("Tag 1"),
                    Text.Root("Tag 2"),
                    Text.Root("Tag 3"),
                    Text.Root("Tag 4"),
                    Text.Root("Tag 5"),
                ], {
                    gap: "2",
                    wrap: Style.FlexWrap("wrap"),
                    padding: "3",
                    background: "orange.50",
                    width: "200px",
                })
            )
        );

        // Stretched items
        const stretched = $.let(
            ShowcaseCard(
                "Stretched Items",
                "Items stretched to fill container width",
                Stack.VStack([
                    Text.Root("Full width item 1"),
                    Text.Root("Full width item 2"),
                ], {
                    gap: "3",
                    align: Style.AlignItems("stretch"),
                    padding: "4",
                    background: "green.50",
                })
            )
        );

        // Nested stacks
        const nested = $.let(
            ShowcaseCard(
                "Nested Stacks",
                "VStack containing HStack",
                Stack.VStack([
                    Stack.HStack([
                        Text.Root("Inner 1"),
                        Text.Root("Inner 2"),
                    ], { gap: "2" }),
                    Text.Root("Outer Item"),
                ], {
                    gap: "4",
                    padding: "4",
                    background: "gray.100",
                })
            )
        );

        // Navigation bar layout
        const navbar = $.let(
            ShowcaseCard(
                "Navigation Bar",
                "Typical nav layout with HStack",
                Stack.HStack([
                    Text.Root("Logo"),
                    Stack.HStack([
                        Text.Root("Home"),
                        Text.Root("About"),
                        Text.Root("Contact"),
                    ], { gap: "4" }),
                ], {
                    gap: "4",
                    justify: Style.JustifyContent("space-between"),
                    align: Style.AlignItems("center"),
                    padding: "4",
                    background: "white",
                    width: "100%",
                })
            )
        );

        return Grid.Root(
            [
                Grid.Item(basicVStack),
                Grid.Item(basicHStack),
                Grid.Item(justifiedHStack, { colSpan: "2" }),
                Grid.Item(centered),
                Grid.Item(wrapping),
                Grid.Item(stretched),
                Grid.Item(nested),
                Grid.Item(navbar, { colSpan: "2" }),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
