import { East, some } from "@elaraai/east";
import { Flex, Text, UIComponentType, Grid } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Flex showcase - demonstrates flex container layouts with direction, wrap, and alignment.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic flex
        const basic = $.let(
            ShowcaseCard(
                "Basic Flex",
                "Simple flex container (row by default)",
                Flex.Root([
                    Text.Root("Item 1"),
                    Text.Root("Item 2"),
                    Text.Root("Item 3"),
                ], {
                    gap: "4",
                }),
                some(`Flex.Root([
    Text.Root("Item 1"),
    Text.Root("Item 2"),
    Text.Root("Item 3"),
], { gap: "4" })`)
            )
        );

        // Row with justify
        const rowJustify = $.let(
            ShowcaseCard(
                "Row with Space Between",
                "Horizontal flex with space-between justification",
                Flex.Root([
                    Text.Root("Left"),
                    Text.Root("Center"),
                    Text.Root("Right"),
                ], {
                    direction: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "4",
                    background: "blue.50",
                    borderRadius: "md",
                }),
                some(`Flex.Root([
    Text.Root("Left"),
    Text.Root("Center"),
    Text.Root("Right"),
], {
    direction: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "4",
    background: "blue.50",
    borderRadius: "md",
})`)
            )
        );

        // Column layout
        const column = $.let(
            ShowcaseCard(
                "Column Layout",
                "Vertical flex container with centered items",
                Flex.Root([
                    Text.Root("Top"),
                    Text.Root("Middle"),
                    Text.Root("Bottom"),
                ], {
                    direction: "column",
                    alignItems: "center",
                    gap: "2",
                    padding: "4",
                    background: "purple.50",
                    borderRadius: "md",
                }),
                some(`Flex.Root([
    Text.Root("Top"),
    Text.Root("Middle"),
    Text.Root("Bottom"),
], {
    direction: "column",
    alignItems: "center",
    gap: "2",
    padding: "4",
    background: "purple.50",
    borderRadius: "md",
})`)
            )
        );

        // Wrap example
        const wrap = $.let(
            ShowcaseCard(
                "Flex Wrap",
                "Items wrap to next line when container is too narrow",
                Flex.Root([
                    Text.Root("Item 1"),
                    Text.Root("Item 2"),
                    Text.Root("Item 3"),
                    Text.Root("Item 4"),
                    Text.Root("Item 5"),
                    Text.Root("Item 6"),
                ], {
                    wrap: "wrap",
                    gap: "2",
                    padding: "4",
                    background: "green.50",
                    borderRadius: "md",
                    width: "200px",
                }),
                some(`Flex.Root([
    Text.Root("Item 1"),
    Text.Root("Item 2"),
    Text.Root("Item 3"),
    Text.Root("Item 4"),
    Text.Root("Item 5"),
    Text.Root("Item 6"),
], {
    wrap: "wrap",
    gap: "2",
    padding: "4",
    background: "green.50",
    borderRadius: "md",
    width: "200px",
})`)
            )
        );

        // Center everything
        const centered = $.let(
            ShowcaseCard(
                "Centered Content",
                "Both horizontally and vertically centered",
                Flex.Root([
                    Text.Root("Centered!"),
                ], {
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100px",
                    background: "teal.100",
                    borderRadius: "md",
                }),
                some(`Flex.Root([
    Text.Root("Centered!"),
], {
    justifyContent: "center",
    alignItems: "center",
    height: "100px",
    background: "teal.100",
    borderRadius: "md",
})`)
            )
        );

        // Nested flex
        const nested = $.let(
            ShowcaseCard(
                "Nested Flex",
                "Flex containers inside flex containers",
                Flex.Root([
                    Flex.Root([
                        Text.Root("A"),
                        Text.Root("B"),
                    ], {
                        direction: "column",
                        gap: "1",
                        padding: "2",
                        background: "orange.100",
                        borderRadius: "sm",
                    }),
                    Flex.Root([
                        Text.Root("C"),
                        Text.Root("D"),
                    ], {
                        direction: "column",
                        gap: "1",
                        padding: "2",
                        background: "orange.100",
                        borderRadius: "sm",
                    }),
                ], {
                    direction: "row",
                    gap: "4",
                    padding: "4",
                    background: "gray.100",
                    borderRadius: "md",
                }),
                some(`Flex.Root([
    Flex.Root([Text.Root("A"), Text.Root("B")], {
        direction: "column",
        gap: "1",
        padding: "2",
        background: "orange.100",
        borderRadius: "sm",
    }),
    Flex.Root([Text.Root("C"), Text.Root("D")], {
        direction: "column",
        gap: "1",
        padding: "2",
        background: "orange.100",
        borderRadius: "sm",
    }),
], {
    direction: "row",
    gap: "4",
    padding: "4",
    background: "gray.100",
    borderRadius: "md",
})`)
            )
        );

        // All align items options
        const alignItems = $.let(
            ShowcaseCard(
                "Align Items",
                "Different alignItems values",
                Flex.Root([
                    Flex.Root([Text.Root("flex-start")], {
                        alignItems: "flex-start",
                        height: "60px",
                        padding: "2",
                        background: "pink.100",
                        borderRadius: "sm",
                    }),
                    Flex.Root([Text.Root("center")], {
                        alignItems: "center",
                        height: "60px",
                        padding: "2",
                        background: "pink.100",
                        borderRadius: "sm",
                    }),
                    Flex.Root([Text.Root("flex-end")], {
                        alignItems: "flex-end",
                        height: "60px",
                        padding: "2",
                        background: "pink.100",
                        borderRadius: "sm",
                    }),
                ], {
                    direction: "row",
                    gap: "2",
                }),
                some(`Flex.Root([
    Flex.Root([Text.Root("flex-start")], {
        alignItems: "flex-start",
        height: "60px",
        ...
    }),
    Flex.Root([Text.Root("center")], {
        alignItems: "center",
        height: "60px",
        ...
    }),
    Flex.Root([Text.Root("flex-end")], {
        alignItems: "flex-end",
        height: "60px",
        ...
    }),
], { direction: "row", gap: "2" })`)
            )
        );

        // Row reverse
        const reverse = $.let(
            ShowcaseCard(
                "Row Reverse",
                "Items displayed in reverse order",
                Flex.Root([
                    Text.Root("1"),
                    Text.Root("2"),
                    Text.Root("3"),
                ], {
                    direction: "row-reverse",
                    gap: "4",
                    padding: "4",
                    background: "cyan.50",
                    borderRadius: "md",
                }),
                some(`Flex.Root([
    Text.Root("1"),
    Text.Root("2"),
    Text.Root("3"),
], {
    direction: "row-reverse",
    gap: "4",
    padding: "4",
    background: "cyan.50",
    borderRadius: "md",
})`)
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(rowJustify),
                Grid.Item(column),
                Grid.Item(wrap),
                Grid.Item(centered),
                Grid.Item(nested),
                Grid.Item(alignItems, { colSpan: "2" }),
                Grid.Item(reverse),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
