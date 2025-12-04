import { East, some } from "@elaraai/east";
import { List, UIComponentType, Grid } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * List showcase - demonstrates ordered and unordered lists.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic unordered list
        const unordered = $.let(
            ShowcaseCard(
                "Unordered List",
                "Bulleted list",
                List.Root(["First item", "Second item", "Third item"], {
                    variant: "unordered",
                }),
                some(`
                    List.Root(["First item", "Second item", "Third item"], {
                        variant: "unordered",
                    })
                `)
            )
        );

        // Ordered list
        const ordered = $.let(
            ShowcaseCard(
                "Ordered List",
                "Numbered list",
                List.Root(["Step one", "Step two", "Step three"], {
                    variant: "ordered",
                }),
                some(`
                    List.Root(["Step one", "Step two", "Step three"], {
                        variant: "ordered",
                    })
                `)
            )
        );

        // With gap
        const withGap = $.let(
            ShowcaseCard(
                "Custom Gap",
                "Increased spacing between items",
                List.Root(["Item A", "Item B", "Item C"], {
                    variant: "unordered",
                    gap: "4",
                }),
                some(`
                    List.Root(["Item A", "Item B", "Item C"], {
                        variant: "unordered",
                        gap: "4",
                    })
                `)
            )
        );

        // Colored markers
        const colored = $.let(
            ShowcaseCard(
                "Colored Markers",
                "Blue list markers",
                List.Root(["Blue item one", "Blue item two", "Blue item three"], {
                    variant: "unordered",
                    colorPalette: "blue",
                }),
                some(`
                    List.Root(["Blue item one", "Blue item two", "Blue item three"], {
                        variant: "unordered",
                        colorPalette: "blue",
                    })
                `)
            )
        );

        // Green markers
        const green = $.let(
            ShowcaseCard(
                "Green Markers",
                "Green numbered list",
                List.Root(["Complete task A", "Complete task B", "Complete task C"], {
                    variant: "ordered",
                    colorPalette: "green",
                }),
                some(`
                    List.Root(["Complete task A", "Complete task B", "Complete task C"], {
                        variant: "ordered",
                        colorPalette: "green",
                    })
                `)
            )
        );

        // Feature list
        const features = $.let(
            ShowcaseCard(
                "Feature List",
                "Product features example",
                List.Root([
                    "Fast performance",
                    "Type-safe development",
                    "Easy to use API",
                    "Comprehensive documentation",
                ], {
                    variant: "unordered",
                    gap: "2",
                    colorPalette: "teal",
                }),
                some(`
                    List.Root([
                        "Fast performance",
                        "Type-safe development",
                        "Easy to use API",
                        "Comprehensive documentation",
                    ], {
                        variant: "unordered",
                        gap: "2",
                        colorPalette: "teal",
                    })
                `)
            )
        );

        // Steps list
        const steps = $.let(
            ShowcaseCard(
                "Steps List",
                "Installation steps",
                List.Root([
                    "Install dependencies",
                    "Configure environment",
                    "Run the application",
                    "Verify installation",
                ], {
                    variant: "ordered",
                    gap: "3",
                }),
                some(`
                    List.Root([
                        "Install dependencies",
                        "Configure environment",
                        "Run the application",
                        "Verify installation",
                    ], {
                        variant: "ordered",
                        gap: "3",
                    })
                `)
            )
        );

        // Empty list
        const empty = $.let(
            ShowcaseCard(
                "Empty List",
                "List with no items",
                List.Root([]),
                some(`List.Root([])`)
            )
        );

        return Grid.Root(
            [
                Grid.Item(unordered),
                Grid.Item(ordered),
                Grid.Item(withGap),
                Grid.Item(colored),
                Grid.Item(green),
                Grid.Item(empty),
                Grid.Item(features),
                Grid.Item(steps),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
