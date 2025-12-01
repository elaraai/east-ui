import { East } from "@elaraai/east";
import { Separator, Text, UIComponentType, Stack, Grid, Box } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Separator showcase - demonstrates separator orientations, variants, sizes, and labels.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic horizontal separator
        const horizontal = $.let(
            ShowcaseCard(
                "Horizontal Separator",
                "Default horizontal divider",
                Stack.VStack([
                    Text.Root("Content above"),
                    Separator.Root({ orientation: "horizontal" }),
                    Text.Root("Content below"),
                ], { gap: "3", width: "100%" })
            )
        );

        // Vertical separator
        const vertical = $.let(
            ShowcaseCard(
                "Vertical Separator",
                "Vertical divider between content",
                Stack.HStack([
                    Text.Root("Left"),
                    Box.Root([
                        Separator.Root({ orientation: "vertical" }),
                    ], { height: "40px" }),
                    Text.Root("Right"),
                ], { gap: "4", align: "center" })
            )
        );

        // Solid variant
        const solid = $.let(
            ShowcaseCard(
                "Solid Variant",
                "Solid line separator",
                Stack.VStack([
                    Text.Root("Above"),
                    Separator.Root({ variant: "solid" }),
                    Text.Root("Below"),
                ], { gap: "3", width: "100%" })
            )
        );

        // Dashed variant
        const dashed = $.let(
            ShowcaseCard(
                "Dashed Variant",
                "Dashed line separator",
                Stack.VStack([
                    Text.Root("Above"),
                    Separator.Root({ variant: "dashed" }),
                    Text.Root("Below"),
                ], { gap: "3", width: "100%" })
            )
        );

        // Dotted variant
        const dotted = $.let(
            ShowcaseCard(
                "Dotted Variant",
                "Dotted line separator",
                Stack.VStack([
                    Text.Root("Above"),
                    Separator.Root({ variant: "dotted" }),
                    Text.Root("Below"),
                ], { gap: "3", width: "100%" })
            )
        );

        // Size variations
        const sizes = $.let(
            ShowcaseCard(
                "Size Variations",
                "Small, medium, and large sizes",
                Stack.VStack([
                    Stack.HStack([Text.Root("Small:"), Separator.Root({ size: "sm" })], { gap: "2", width: "100%" }),
                    Stack.HStack([Text.Root("Medium:"), Separator.Root({ size: "md" })], { gap: "2", width: "100%" }),
                    Stack.HStack([Text.Root("Large:"), Separator.Root({ size: "lg" })], { gap: "2", width: "100%" }),
                ], { gap: "3", width: "100%" })
            )
        );

        // With label
        const labeled = $.let(
            ShowcaseCard(
                "Labeled Separator",
                "Separator with centered label",
                Stack.VStack([
                    Text.Root("Sign in with email"),
                    Separator.Root({ label: "OR" }),
                    Text.Root("Continue with social"),
                ], { gap: "3", width: "100%" })
            )
        );

        // Colored separator
        const colored = $.let(
            ShowcaseCard(
                "Colored Separator",
                "Custom color separators",
                Stack.VStack([
                    Separator.Root({ color: "blue.400" }),
                    Separator.Root({ color: "green.400" }),
                    Separator.Root({ color: "red.400" }),
                ], { gap: "4", width: "100%" })
            )
        );

        // Form section divider
        const formDivider = $.let(
            ShowcaseCard(
                "Form Section Divider",
                "Labeled divider for form sections",
                Stack.VStack([
                    Text.Root("Personal Information"),
                    Separator.Root({
                        label: "Contact Details",
                        color: "gray.400",
                    }),
                    Text.Root("Email and Phone fields..."),
                ], { gap: "3", width: "100%" })
            )
        );

        return Grid.Root(
            [
                Grid.Item(horizontal),
                Grid.Item(vertical),
                Grid.Item(solid),
                Grid.Item(dashed),
                Grid.Item(dotted),
                Grid.Item(sizes),
                Grid.Item(labeled),
                Grid.Item(colored),
                Grid.Item(formDivider, { colSpan: "2" }),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
