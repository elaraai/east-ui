import { East, some } from "@elaraai/east";
import { Mark, UIComponentType, Stack, Grid, Text } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Mark showcase - demonstrates inline text marking/highlighting.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic mark
        const basic = $.let(
            ShowcaseCard(
                "Basic Mark",
                "Simple text mark",
                Mark.Root("Important"),
                some(`Mark.Root("Important")`)
            )
        );

        // Subtle variant
        const subtle = $.let(
            ShowcaseCard(
                "Subtle Variant",
                "Soft background highlight",
                Mark.Root("Note", { variant: "subtle" }),
                some(`Mark.Root("Note", { variant: "subtle" })`)
            )
        );

        // Solid variant
        const solid = $.let(
            ShowcaseCard(
                "Solid Variant",
                "Strong background fill",
                Mark.Root("NEW", { variant: "solid" }),
                some(`Mark.Root("NEW", { variant: "solid" })`)
            )
        );

        // Text variant
        const textVariant = $.let(
            ShowcaseCard(
                "Text Variant",
                "Colored text only",
                Mark.Root("Updated", { variant: "text" }),
                some(`Mark.Root("Updated", { variant: "text" })`)
            )
        );

        // Plain variant
        const plain = $.let(
            ShowcaseCard(
                "Plain Variant",
                "Minimal styling",
                Mark.Root("Plain", { variant: "plain" }),
                some(`Mark.Root("Plain", { variant: "plain" })`)
            )
        );

        // Color palettes
        const colors = $.let(
            ShowcaseCard(
                "Color Palettes",
                "Different color schemes",
                Stack.HStack([
                    Mark.Root("Yellow", { variant: "subtle", colorPalette: "yellow" }),
                    Mark.Root("Green", { variant: "subtle", colorPalette: "green" }),
                    Mark.Root("Blue", { variant: "subtle", colorPalette: "blue" }),
                    Mark.Root("Red", { variant: "subtle", colorPalette: "red" }),
                    Mark.Root("Purple", { variant: "subtle", colorPalette: "purple" }),
                ], { gap: "3" }),
                some(`Mark.Root("Yellow", { variant: "subtle", colorPalette: "yellow" })`)
            )
        );

        // Solid colors
        const solidColors = $.let(
            ShowcaseCard(
                "Solid Colors",
                "Bold color variants",
                Stack.HStack([
                    Mark.Root("Success", { variant: "solid", colorPalette: "green" }),
                    Mark.Root("Warning", { variant: "solid", colorPalette: "orange" }),
                    Mark.Root("Error", { variant: "solid", colorPalette: "red" }),
                    Mark.Root("Info", { variant: "solid", colorPalette: "blue" }),
                ], { gap: "3" }),
                some(`Mark.Root("Success", { variant: "solid", colorPalette: "green" })`)
            )
        );

        // In context
        const inContext = $.let(
            ShowcaseCard(
                "In Context",
                "Mark within text flow",
                Stack.HStack([
                    Text.Root("This feature is "),
                    Mark.Root("deprecated", { variant: "subtle", colorPalette: "orange" }),
                    Text.Root(" and will be removed."),
                ], { gap: "1" }),
                some(`
                    Stack.HStack([
                        Text.Root("This feature is "),
                        Mark.Root("deprecated", { variant: "subtle", colorPalette: "orange" }),
                        Text.Root(" and will be removed."),
                    ], { gap: "1" })
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(subtle),
                Grid.Item(solid),
                Grid.Item(textVariant),
                Grid.Item(plain),
                Grid.Item(colors, { colSpan: "2" }),
                Grid.Item(solidColors, { colSpan: "2" }),
                Grid.Item(inContext, { colSpan: "2" }),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
