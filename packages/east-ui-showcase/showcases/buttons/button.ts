import { East, some } from "@elaraai/east";
import { Button, IconButton, UIComponentType, Stack, Grid, Accordion } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Button showcase - demonstrates all button variants, colors, sizes, and states.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic button
        const basic = $.let(
            ShowcaseCard(
                "Basic Button",
                "Plain button with default styling",
                Button.Root("Click Me"),
                some(`Button.Root("Click Me")`)
            )
        );

        // Solid primary button
        const solidPrimary = $.let(
            ShowcaseCard(
                "Solid Primary",
                "Solid variant with blue color scheme",
                Button.Root("Primary Action", { variant: "solid", colorPalette: "blue", size: "md" }),
                some(`Button.Root("Primary Action", { variant: "solid", colorPalette: "blue", size: "md" })`)
            )
        );

        // Outline button
        const outline = $.let(
            ShowcaseCard(
                "Outline Button",
                "Outline variant with teal color scheme",
                Button.Root("Outline Style", { variant: "outline", colorPalette: "teal", size: "md" }),
                some(`Button.Root("Outline Style", { variant: "outline", colorPalette: "teal", size: "md" })`)
            )
        );

        // Ghost button
        const ghost = $.let(
            ShowcaseCard(
                "Ghost Button",
                "Ghost variant - transparent until hover",
                Button.Root("Ghost Button", { variant: "ghost", colorPalette: "purple", size: "md" }),
                some(`Button.Root("Ghost Button", { variant: "ghost", colorPalette: "purple", size: "md" })`)
            )
        );

        // Subtle button
        const subtle = $.let(
            ShowcaseCard(
                "Subtle Button",
                "Subtle variant with light background",
                Button.Root("Subtle Action", { variant: "subtle", colorPalette: "green", size: "md" }),
                some(`Button.Root("Subtle Action", { variant: "subtle", colorPalette: "green", size: "md" })`)
            )
        );

        // Size variations
        const sizes = $.let(
            ShowcaseCard(
                "Size Variations",
                "Available sizes: xs, sm, md, lg",
                Stack.HStack([
                    Button.Root("XS", { variant: "solid", colorPalette: "cyan", size: "xs" }),
                    Button.Root("SM", { variant: "solid", colorPalette: "cyan", size: "sm" }),
                    Button.Root("MD", { variant: "solid", colorPalette: "cyan", size: "md" }),
                    Button.Root("LG", { variant: "solid", colorPalette: "cyan", size: "lg" }),
                ], { gap: "3", align: "center" }),
                some(`
                    Stack.HStack([
                        Button.Root("XS", { variant: "solid", colorPalette: "cyan", size: "xs" }),
                        Button.Root("SM", { variant: "solid", colorPalette: "cyan", size: "sm" }),
                        Button.Root("MD", { variant: "solid", colorPalette: "cyan", size: "md" }),
                        Button.Root("LG", { variant: "solid", colorPalette: "cyan", size: "lg" }),
                    ], { gap: "3", align: "center" })
                `)
            )
        );

        // Loading button
        const loading = $.let(
            ShowcaseCard(
                "Loading State",
                "Button showing loading spinner",
                Button.Root("Processing...", { variant: "solid", colorPalette: "blue", size: "md", loading: true }),
                some(`Button.Root("Processing...", { variant: "solid", colorPalette: "blue", size: "md", loading: true })`)
            )
        );

        // Disabled button
        const disabled = $.let(
            ShowcaseCard(
                "Disabled State",
                "Button in disabled state",
                Button.Root("Disabled", { variant: "solid", colorPalette: "gray", size: "md", disabled: true }),
                some(`Button.Root("Disabled", { variant: "solid", colorPalette: "gray", size: "md", disabled: true })`)
            )
        );

        // Color palette showcase
        const colors = $.let(
            ShowcaseCard(
                "Color Palettes",
                "Available color schemes",
                Stack.HStack([
                    Button.Root("Red", { variant: "solid", colorPalette: "red", size: "sm" }),
                    Button.Root("Orange", { variant: "solid", colorPalette: "orange", size: "sm" }),
                    Button.Root("Yellow", { variant: "solid", colorPalette: "yellow", size: "sm" }),
                    Button.Root("Green", { variant: "solid", colorPalette: "green", size: "sm" }),
                    Button.Root("Teal", { variant: "solid", colorPalette: "teal", size: "sm" }),
                    Button.Root("Blue", { variant: "solid", colorPalette: "blue", size: "sm" }),
                    Button.Root("Purple", { variant: "solid", colorPalette: "purple", size: "sm" }),
                ], { gap: "2", wrap: "wrap" }),
                some(`
                    Stack.HStack([
                        Button.Root("Red", { variant: "solid", colorPalette: "red", size: "sm" }),
                        Button.Root("Orange", { variant: "solid", colorPalette: "orange", size: "sm" }),
                        Button.Root("Yellow", { variant: "solid", colorPalette: "yellow", size: "sm" }),
                        Button.Root("Green", { variant: "solid", colorPalette: "green", size: "sm" }),
                        Button.Root("Teal", { variant: "solid", colorPalette: "teal", size: "sm" }),
                        Button.Root("Blue", { variant: "solid", colorPalette: "blue", size: "sm" }),
                        Button.Root("Purple", { variant: "solid", colorPalette: "purple", size: "sm" }),
                    ], { gap: "2", wrap: "wrap" })
                `)
            )
        );

        // All variants comparison
        const variants = $.let(
            ShowcaseCard(
                "Variant Comparison",
                "All variants with the same color",
                Stack.HStack([
                    Button.Root("Solid", { variant: "solid", colorPalette: "blue", size: "sm" }),
                    Button.Root("Outline", { variant: "outline", colorPalette: "blue", size: "sm" }),
                    Button.Root("Ghost", { variant: "ghost", colorPalette: "blue", size: "sm" }),
                    Button.Root("Subtle", { variant: "subtle", colorPalette: "blue", size: "sm" }),
                ], { gap: "3", wrap: "wrap" }),
                some(`
                    Stack.HStack([
                        Button.Root("Solid", { variant: "solid", colorPalette: "blue", size: "sm" }),
                        Button.Root("Outline", { variant: "outline", colorPalette: "blue", size: "sm" }),
                        Button.Root("Ghost", { variant: "ghost", colorPalette: "blue", size: "sm" }),
                        Button.Root("Subtle", { variant: "subtle", colorPalette: "blue", size: "sm" }),
                    ], { gap: "3", wrap: "wrap" })
                `)
            )
        );

        // Basic icon button
        const iconBasic = $.let(
            ShowcaseCard(
                "Basic Icon Button",
                "Simple icon button with default styling",
                IconButton.Root("fas", "star"),
                some(`IconButton.Root("fas", "star")`)
            )
        );

        // Icon button variants
        const iconVariants = $.let(
            ShowcaseCard(
                "Icon Button Variants",
                "Different button variants with icons",
                Stack.HStack([
                    IconButton.Root("fas", "heart", { variant: "solid", colorPalette: "red" }),
                    IconButton.Root("fas", "bookmark", { variant: "outline", colorPalette: "blue" }),
                    IconButton.Root("fas", "gear", { variant: "ghost", colorPalette: "gray" }),
                    IconButton.Root("fas", "bell", { variant: "subtle", colorPalette: "purple" }),
                ], { gap: "3", align: "center" }),
                some(`
                    Stack.HStack([
                        IconButton.Root("fas", "heart", { variant: "solid", colorPalette: "red" }),
                        IconButton.Root("fas", "bookmark", { variant: "outline", colorPalette: "blue" }),
                        IconButton.Root("fas", "gear", { variant: "ghost", colorPalette: "gray" }),
                        IconButton.Root("fas", "bell", { variant: "subtle", colorPalette: "purple" }),
                    ], { gap: "3", align: "center" })
                `)
            )
        );

        // Icon button sizes
        const iconSizes = $.let(
            ShowcaseCard(
                "Icon Button Sizes",
                "Available sizes: xs, sm, md, lg",
                Stack.HStack([
                    IconButton.Root("fas", "plus", { variant: "solid", colorPalette: "teal", size: "xs" }),
                    IconButton.Root("fas", "plus", { variant: "solid", colorPalette: "teal", size: "sm" }),
                    IconButton.Root("fas", "plus", { variant: "solid", colorPalette: "teal", size: "md" }),
                    IconButton.Root("fas", "plus", { variant: "solid", colorPalette: "teal", size: "lg" }),
                ], { gap: "3", align: "center" }),
                some(`
                    Stack.HStack([
                        IconButton.Root("fas", "plus", { variant: "solid", colorPalette: "teal", size: "xs" }),
                        IconButton.Root("fas", "plus", { variant: "solid", colorPalette: "teal", size: "sm" }),
                        IconButton.Root("fas", "plus", { variant: "solid", colorPalette: "teal", size: "md" }),
                        IconButton.Root("fas", "plus", { variant: "solid", colorPalette: "teal", size: "lg" }),
                    ], { gap: "3", align: "center" })
                `)
            )
        );

        // Common icon button use cases
        const iconUseCases = $.let(
            ShowcaseCard(
                "Common Use Cases",
                "Typical icon button applications",
                Stack.HStack([
                    IconButton.Root("fas", "xmark", { variant: "ghost", colorPalette: "gray" }),
                    IconButton.Root("fas", "bars", { variant: "ghost", colorPalette: "gray" }),
                    IconButton.Root("fas", "magnifying-glass", { variant: "outline", colorPalette: "gray" }),
                    IconButton.Root("fas", "trash", { variant: "ghost", colorPalette: "red" }),
                    IconButton.Root("fas", "pen", { variant: "ghost", colorPalette: "blue" }),
                    IconButton.Root("fas", "ellipsis-vertical", { variant: "ghost", colorPalette: "gray" }),
                ], { gap: "2", align: "center" }),
                some(`
                    Stack.HStack([
                        IconButton.Root("fas", "xmark", { variant: "ghost", colorPalette: "gray" }),
                        IconButton.Root("fas", "bars", { variant: "ghost", colorPalette: "gray" }),
                        IconButton.Root("fas", "magnifying-glass", { variant: "outline", colorPalette: "gray" }),
                        IconButton.Root("fas", "trash", { variant: "ghost", colorPalette: "red" }),
                        IconButton.Root("fas", "pen", { variant: "ghost", colorPalette: "blue" }),
                        IconButton.Root("fas", "ellipsis-vertical", { variant: "ghost", colorPalette: "gray" }),
                    ], { gap: "2", align: "center" })
                `)
            )
        );

        // Icon button states
        const iconStates = $.let(
            ShowcaseCard(
                "Icon Button States",
                "Loading and disabled states",
                Stack.HStack([
                    IconButton.Root("fas", "rotate", { variant: "solid", colorPalette: "blue", loading: true }),
                    IconButton.Root("fas", "check", { variant: "solid", colorPalette: "green", disabled: true }),
                ], { gap: "3", align: "center" }),
                some(`
                    Stack.HStack([
                        IconButton.Root("fas", "rotate", { variant: "solid", colorPalette: "blue", loading: true }),
                        IconButton.Root("fas", "check", { variant: "solid", colorPalette: "green", disabled: true }),
                    ], { gap: "3", align: "center" })
                `)
            )
        );

        return Accordion.Root([
            Accordion.Item("button", "Button", [
                Grid.Root([
                    Grid.Item(basic),
                    Grid.Item(solidPrimary),
                    Grid.Item(outline),
                    Grid.Item(ghost),
                    Grid.Item(subtle),
                    Grid.Item(sizes, { colSpan: "2" }),
                    Grid.Item(loading),
                    Grid.Item(disabled),
                    Grid.Item(colors, { colSpan: "2" }),
                    Grid.Item(variants, { colSpan: "2" }),
                ], { templateColumns: "repeat(2, 1fr)", gap: "4" }),
            ]),
            Accordion.Item("icon-button", "Icon Button", [
                Grid.Root([
                    Grid.Item(iconBasic),
                    Grid.Item(iconVariants),
                    Grid.Item(iconSizes, { colSpan: "2" }),
                    Grid.Item(iconUseCases, { colSpan: "2" }),
                    Grid.Item(iconStates),
                ], { templateColumns: "repeat(2, 1fr)", gap: "4" }),
            ]),
        ], { multiple: true, collapsible: true });
    }
);
