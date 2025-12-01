import { East } from "@elaraai/east";
import { Grid, Text, UIComponentType, Style, Box } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Grid showcase - demonstrates CSS Grid layout with various configurations.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic 3-column grid
        const basic3Col = $.let(
            ShowcaseCard(
                "Basic 3-Column Grid",
                "Equal-width columns with gap",
                Grid.Root([
                    Grid.Item(Box.Root([Text.Root("1")], { padding: "2", background: "blue.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("2")], { padding: "2", background: "blue.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("3")], { padding: "2", background: "blue.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("4")], { padding: "2", background: "blue.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("5")], { padding: "2", background: "blue.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("6")], { padding: "2", background: "blue.100", borderRadius: "sm" })),
                ], {
                    templateColumns: "repeat(3, 1fr)",
                    gap: "3",
                })
            )
        );

        // Column span
        const colSpan = $.let(
            ShowcaseCard(
                "Column Span",
                "Item spanning multiple columns",
                Grid.Root([
                    Grid.Item(Box.Root([Text.Root("Spans 2 columns")], { padding: "2", background: "green.100", borderRadius: "sm" }), { colSpan: "2" }),
                    Grid.Item(Box.Root([Text.Root("One")], { padding: "2", background: "green.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("Two")], { padding: "2", background: "green.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("Three")], { padding: "2", background: "green.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("Four")], { padding: "2", background: "green.100", borderRadius: "sm" })),
                ], {
                    templateColumns: "repeat(3, 1fr)",
                    gap: "3",
                })
            )
        );

        // Different gaps
        const gaps = $.let(
            ShowcaseCard(
                "Different Gaps",
                "Separate column and row gaps",
                Grid.Root([
                    Grid.Item(Box.Root([Text.Root("A")], { padding: "2", background: "purple.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("B")], { padding: "2", background: "purple.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("C")], { padding: "2", background: "purple.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("D")], { padding: "2", background: "purple.100", borderRadius: "sm" })),
                ], {
                    templateColumns: "repeat(2, 1fr)",
                    columnGap: "8",
                    rowGap: "2",
                })
            )
        );

        // Fixed column widths
        const fixedWidths = $.let(
            ShowcaseCard(
                "Fixed Column Widths",
                "Columns with specific pixel widths",
                Grid.Root([
                    Grid.Item(Box.Root([Text.Root("100px")], { padding: "2", background: "orange.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("200px")], { padding: "2", background: "orange.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("100px")], { padding: "2", background: "orange.100", borderRadius: "sm" })),
                ], {
                    templateColumns: "100px 200px 100px",
                    gap: "4",
                })
            )
        );

        // Centered items
        const centered = $.let(
            ShowcaseCard(
                "Centered Items",
                "Content centered in cells",
                Grid.Root([
                    Grid.Item(Box.Root([Text.Root("1")], { padding: "2", background: "teal.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("2")], { padding: "2", background: "teal.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("3")], { padding: "2", background: "teal.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("4")], { padding: "2", background: "teal.100", borderRadius: "sm" })),
                ], {
                    templateColumns: "repeat(2, 100px)",
                    templateRows: "repeat(2, 60px)",
                    gap: "4",
                    justifyItems: Style.JustifyContent("center"),
                    alignItems: Style.AlignItems("center"),
                })
            )
        );

        // Auto-fit responsive
        const responsive = $.let(
            ShowcaseCard(
                "Responsive Grid",
                "Auto-fit with minmax",
                Grid.Root([
                    Grid.Item(Box.Root([Text.Root("Item 1")], { padding: "3", background: "cyan.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("Item 2")], { padding: "3", background: "cyan.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("Item 3")], { padding: "3", background: "cyan.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("Item 4")], { padding: "3", background: "cyan.100", borderRadius: "sm" })),
                ], {
                    templateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
                    gap: "3",
                })
            )
        );

        // Dense packing
        const dense = $.let(
            ShowcaseCard(
                "Dense Packing",
                "Auto-flow with dense algorithm",
                Grid.Root([
                    Grid.Item(Box.Root([Text.Root("Wide")], { padding: "2", background: "pink.100", borderRadius: "sm" }), { colSpan: "2" }),
                    Grid.Item(Box.Root([Text.Root("A")], { padding: "2", background: "pink.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("B")], { padding: "2", background: "pink.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("C")], { padding: "2", background: "pink.100", borderRadius: "sm" })),
                ], {
                    templateColumns: "repeat(3, 1fr)",
                    gap: "2",
                    autoFlow: "row dense",
                })
            )
        );

        // Full width span
        const fullWidth = $.let(
            ShowcaseCard(
                "Full Width Header",
                "Header spanning all columns",
                Grid.Root([
                    Grid.Item(Box.Root([Text.Root("Full Width Header")], { padding: "3", background: "gray.200", borderRadius: "sm" }), { colSpan: "3" }),
                    Grid.Item(Box.Root([Text.Root("Col 1")], { padding: "2", background: "gray.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("Col 2")], { padding: "2", background: "gray.100", borderRadius: "sm" })),
                    Grid.Item(Box.Root([Text.Root("Col 3")], { padding: "2", background: "gray.100", borderRadius: "sm" })),
                ], {
                    templateColumns: "repeat(3, 1fr)",
                    gap: "3",
                })
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic3Col),
                Grid.Item(colSpan),
                Grid.Item(gaps),
                Grid.Item(fixedWidths),
                Grid.Item(centered),
                Grid.Item(responsive),
                Grid.Item(dense),
                Grid.Item(fullWidth),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
