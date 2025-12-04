import { East, some } from "@elaraai/east";
import { Code, UIComponentType, Stack, Grid } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Code showcase - demonstrates inline code styles and variants.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic code
        const basic = $.let(
            ShowcaseCard(
                "Basic Code",
                "Plain inline code snippet",
                Code.Root("const x = 1"),
                some(`Code.Root("const x = 1")`)
            )
        );

        // Subtle variant
        const subtle = $.let(
            ShowcaseCard(
                "Subtle Variant",
                "Code with subtle background",
                Code.Root("npm install", { variant: "subtle" }),
                some(`Code.Root("npm install", { variant: "subtle" })`)
            )
        );

        // Surface variant
        const surface = $.let(
            ShowcaseCard(
                "Surface Variant",
                "Code with surface styling",
                Code.Root("npm run build", { variant: "surface" }),
                some(`Code.Root("npm run build", { variant: "surface" })`)
            )
        );

        // Outline variant
        const outline = $.let(
            ShowcaseCard(
                "Outline Variant",
                "Code with outline border",
                Code.Root("npm test", { variant: "outline" }),
                some(`Code.Root("npm test", { variant: "outline" })`)
            )
        );

        // Sizes
        const sizes = $.let(
            ShowcaseCard(
                "Sizes",
                "Different code sizes",
                Stack.HStack([
                    Code.Root("xs", { size: "xs" }),
                    Code.Root("sm", { size: "sm" }),
                    Code.Root("md", { size: "md" }),
                    Code.Root("lg", { size: "lg" }),
                ], { gap: "4" }),
                some(`
                    Stack.HStack([
                        Code.Root("xs", { size: "xs" }),
                        Code.Root("sm", { size: "sm" }),
                        Code.Root("md", { size: "md" }),
                        Code.Root("lg", { size: "lg" }),
                    ], { gap: "4" })
                `)
            )
        );

        // Color palettes
        const colors = $.let(
            ShowcaseCard(
                "Color Palettes",
                "Code with different color schemes",
                Stack.HStack([
                    Code.Root("gray", { variant: "subtle", colorPalette: "gray" }),
                    Code.Root("blue", { variant: "subtle", colorPalette: "blue" }),
                    Code.Root("green", { variant: "subtle", colorPalette: "green" }),
                    Code.Root("red", { variant: "subtle", colorPalette: "red" }),
                ], { gap: "3" }),
                some(`
                    Stack.HStack([
                        Code.Root("gray", { variant: "subtle", colorPalette: "gray" }),
                        Code.Root("blue", { variant: "subtle", colorPalette: "blue" }),
                        Code.Root("green", { variant: "subtle", colorPalette: "green" }),
                        Code.Root("red", { variant: "subtle", colorPalette: "red" }),
                    ], { gap: "3" })
                `)
            )
        );

        // Combined styles
        const combined = $.let(
            ShowcaseCard(
                "Combined Styles",
                "Code with multiple style options",
                Code.Root("console.log('Hello')", {
                    variant: "surface",
                    colorPalette: "purple",
                    size: "md",
                }),
                some(`
                    Code.Root("console.log('Hello')", {
                        variant: "surface",
                        colorPalette: "purple",
                        size: "md",
                    })
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(subtle),
                Grid.Item(surface),
                Grid.Item(outline),
                Grid.Item(sizes, { colSpan: "2" }),
                Grid.Item(colors, { colSpan: "2" }),
                Grid.Item(combined),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
