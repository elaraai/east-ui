import { East, some } from "@elaraai/east";
import { Heading, UIComponentType, Stack, Grid, Style } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Heading showcase - demonstrates heading sizes and semantic levels.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic heading
        const basic = $.let(
            ShowcaseCard(
                "Basic Heading",
                "Simple heading with no styling",
                Heading.Root("Hello World"),
                some(`Heading.Root("Hello World")`)
            )
        );

        // Standard sizes
        const standardSizes = $.let(
            ShowcaseCard(
                "Standard Sizes",
                "xs through xl",
                Stack.VStack([
                    Heading.Root("Extra Small (xs)", { size: "xs" }),
                    Heading.Root("Small (sm)", { size: "sm" }),
                    Heading.Root("Medium (md)", { size: "md" }),
                    Heading.Root("Large (lg)", { size: "lg" }),
                    Heading.Root("Extra Large (xl)", { size: "xl" }),
                ], { gap: "2", align: "flex-start" }),
                some(`
                    Stack.VStack([
                        Heading.Root("Extra Small (xs)", { size: "xs" }),
                        Heading.Root("Small (sm)", { size: "sm" }),
                        Heading.Root("Medium (md)", { size: "md" }),
                        Heading.Root("Large (lg)", { size: "lg" }),
                        Heading.Root("Extra Large (xl)", { size: "xl" }),
                    ], { gap: "2", align: "flex-start" }),    
                `)
            )
        );

        // Extended sizes
        const extendedSizes = $.let(
            ShowcaseCard(
                "Extended Sizes",
                "2xl through 6xl for typography",
                Stack.VStack([
                    Heading.Root("2XL Heading", { size: "2xl" }),
                    Heading.Root("3XL Heading", { size: "3xl" }),
                    Heading.Root("4XL Heading", { size: "4xl" }),
                ], { gap: "2", align: "flex-start" }),
                some(`
                    Stack.VStack([
                        Heading.Root("2XL Heading", { size: "2xl" }),
                        Heading.Root("3XL Heading", { size: "3xl" }),
                        Heading.Root("4XL Heading", { size: "4xl" }),
                    ], { gap: "2", align: "flex-start" }),  
                `)
            )
        );

        // Semantic levels
        const semanticLevels = $.let(
            ShowcaseCard(
                "Semantic Levels",
                "HTML heading elements h1-h6",
                Stack.VStack([
                    Heading.Root("H1 - Main Title", { as: "h1", size: "2xl" }),
                    Heading.Root("H2 - Section", { as: "h2", size: "xl" }),
                    Heading.Root("H3 - Subsection", { as: "h3", size: "lg" }),
                    Heading.Root("H4 - Minor", { as: "h4", size: "md" }),
                ], { gap: "2", align: "flex-start" }),
                some(`
                    Stack.VStack([
                        Heading.Root("H1 - Main Title", { as: "h1", size: "2xl" }),
                        Heading.Root("H2 - Section", { as: "h2", size: "xl" }),
                        Heading.Root("H3 - Subsection", { as: "h3", size: "lg" }),
                        Heading.Root("H4 - Minor", { as: "h4", size: "md" }),
                    ], { gap: "2", align: "flex-start" }),
                `)
            )
        );

        // Colored headings
        const colored = $.let(
            ShowcaseCard(
                "Colored Headings",
                "Headings with different colors",
                Stack.VStack([
                    Heading.Root("Blue Heading", { size: "lg", color: "blue.600" }),
                    Heading.Root("Green Heading", { size: "lg", color: "green.600" }),
                    Heading.Root("Purple Heading", { size: "lg", color: "purple.600" }),
                ], { gap: "2", align: "flex-start" }),
                some(`
                    Stack.VStack([
                        Heading.Root("Blue Heading", { size: "lg", color: "blue.600" }),
                        Heading.Root("Green Heading", { size: "lg", color: "green.600" }),
                        Heading.Root("Purple Heading", { size: "lg", color: "purple.600" }),
                    ], { gap: "2", align: "flex-start" }),
                `)
            )
        );

        // Text alignment
        const alignment = $.let(
            ShowcaseCard(
                "Text Alignment",
                "Left, center, and right aligned",
                Stack.VStack([
                    Heading.Root("Left Aligned", { size: "md", textAlign: Style.TextAlign("left") }),
                    Heading.Root("Center Aligned", { size: "md", textAlign: Style.TextAlign("center") }),
                    Heading.Root("Right Aligned", { size: "md", textAlign: Style.TextAlign("right") }),
                ], { gap: "2", align: "stretch" }),
                some(`
                    Stack.VStack([
                        Heading.Root("Left Aligned", { size: "md", textAlign: Style.TextAlign("left") }),
                        Heading.Root("Center Aligned", { size: "md", textAlign: Style.TextAlign("center") }),
                        Heading.Root("Right Aligned", { size: "md", textAlign: Style.TextAlign("right") }),
                    ], { gap: "2", align: "stretch" }),  
                `)
            )
        );

        // Combined styles
        const combined = $.let(
            ShowcaseCard(
                "Combined Styles",
                "Page title with all options",
                Heading.Root("Welcome to East UI", {
                    size: "3xl",
                    as: "h1",
                    color: "gray.800",
                    textAlign: Style.TextAlign("center"),
                }),
                some(`
                    Heading.Root("Welcome to East UI", {
                        size: "3xl",
                        as: "h1",
                        color: "gray.800",
                        textAlign: Style.TextAlign("center"),
                    })
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(standardSizes),
                Grid.Item(extendedSizes),
                Grid.Item(semanticLevels),
                Grid.Item(colored),
                Grid.Item(alignment),
                Grid.Item(combined, { colSpan: "2" }),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
