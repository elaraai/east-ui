import { East, some } from "@elaraai/east";
import { Box, Text, UIComponentType, Grid, Style } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Box showcase - demonstrates container styling with flex layout options.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic box
        const basic = $.let(
            ShowcaseCard(
                "Basic Box",
                "Simple container with no styling",
                Box.Root([
                    Text.Root("Content inside a basic box"),
                ]),
                some(`Box.Root([Text.Root("Content inside a basic box")])`)
            )
        );

        // Styled container
        const styled = $.let(
            ShowcaseCard(
                "Styled Container",
                "Box with background, padding, and border radius",
                Box.Root([
                    Text.Root("Styled container content"),
                ], {
                    padding: "4",
                    background: "blue.50",
                    color: "blue.800",
                    borderRadius: "md",
                }),
                some(`
                    Box.Root([Text.Root("Styled container content")], {
                        padding: "4",
                        background: "blue.50",
                        color: "blue.800",
                        borderRadius: "md",
                    })
                `)
            )
        );

        // Flex row
        const flexRow = $.let(
            ShowcaseCard(
                "Flex Row",
                "Horizontal flex container with gap",
                Box.Root([
                    Text.Root("Item 1"),
                    Text.Root("Item 2"),
                    Text.Root("Item 3"),
                ], {
                    display: Style.Display("flex"),
                    flexDirection: Style.FlexDirection("row"),
                    justifyContent: Style.JustifyContent("space-between"),
                    alignItems: Style.AlignItems("center"),
                    gap: "4",
                    padding: "4",
                    background: "gray.100",
                    borderRadius: "md",
                }),
                some(`
                    Box.Root([
                        Text.Root("Item 1"),
                        Text.Root("Item 2"),
                        Text.Root("Item 3"),
                    ], {
                        display: Style.Display("flex"),
                        flexDirection: Style.FlexDirection("row"),
                        justifyContent: Style.JustifyContent("space-between"),
                        alignItems: Style.AlignItems("center"),
                        gap: "4",
                        padding: "4",
                        background: "gray.100",
                        borderRadius: "md",
                    })
                `)
            )
        );

        // Flex column
        const flexColumn = $.let(
            ShowcaseCard(
                "Flex Column",
                "Vertical flex container with items centered",
                Box.Root([
                    Text.Root("Top"),
                    Text.Root("Middle"),
                    Text.Root("Bottom"),
                ], {
                    display: Style.Display("flex"),
                    flexDirection: Style.FlexDirection("column"),
                    justifyContent: Style.JustifyContent("space-around"),
                    alignItems: Style.AlignItems("center"),
                    height: "150px",
                    padding: "4",
                    background: "purple.50",
                    color: "purple.800",
                    borderRadius: "lg",
                }),
                some(`
                    Box.Root([
                        Text.Root("Top"),
                        Text.Root("Middle"),
                        Text.Root("Bottom"),
                    ], {
                        display: Style.Display("flex"),
                        flexDirection: Style.FlexDirection("column"),
                        justifyContent: Style.JustifyContent("space-around"),
                        alignItems: Style.AlignItems("center"),
                        height: "150px",
                        padding: "4",
                        background: "purple.50",
                        color: "purple.800",
                        borderRadius: "lg",
                    })
                `)
            )
        );

        // Fixed dimensions
        const fixed = $.let(
            ShowcaseCard(
                "Fixed Dimensions",
                "Box with explicit width and height",
                Box.Root([
                    Text.Root("200x100 box"),
                ], {
                    display: Style.Display("flex"),
                    width: "200px",
                    height: "100px",
                    justifyContent: Style.JustifyContent("center"),
                    alignItems: Style.AlignItems("center"),
                    background: "teal.100",
                    color: "teal.800",
                    borderRadius: "sm",
                }),
                some(`
                    Box.Root([Text.Root("200x100 box")], {
                        width: "200px",
                        height: "100px",
                        justifyContent: Style.JustifyContent("center"),
                        alignItems: Style.AlignItems("center"),
                        background: "teal.100",
                        color: "teal.800",
                        borderRadius: "sm",
                    })
                `)
            )
        );

        // Nested boxes
        const nested = $.let(
            ShowcaseCard(
                "Nested Boxes",
                "Box containing another styled box",
                Box.Root([
                    Box.Root([
                        Text.Root("Inner box"),
                    ], {
                        padding: "2",
                        background: "blue.100",
                        borderRadius: "sm",
                    }),
                ], {
                    padding: "4",
                    background: "gray.100",
                    borderRadius: "md",
                }),
                some(`
                    Box.Root([
                        Box.Root([Text.Root("Inner box")], {
                            padding: "2",
                            background: "blue.100",
                            borderRadius: "sm",
                        }),
                    ], { 
                        padding: "4",
                        background: "gray.100",
                        borderRadius: "md",
                    })
                `)
            )
        );

        // All justify content options
        const justify = $.let(
            ShowcaseCard(
                "Justify Content",
                "Different justify-content values",
                Box.Root([
                    Box.Root([Text.Root("start")], {
                        display: Style.Display("flex"),
                        justifyContent: Style.JustifyContent("flex-start"),
                        padding: "2",
                        background: "green.100",
                        borderRadius: "sm",
                    }),
                    Box.Root([Text.Root("center")], {
                        display: Style.Display("flex"),
                        justifyContent: Style.JustifyContent("center"),
                        padding: "2",
                        background: "green.100",
                        borderRadius: "sm",
                    }),
                    Box.Root([Text.Root("end")], {
                        display: Style.Display("flex"),
                        justifyContent: Style.JustifyContent("flex-end"),
                        padding: "2",
                        background: "green.100",
                        borderRadius: "sm",
                    }),
                ], {
                    display: Style.Display("flex"),
                    flexDirection: Style.FlexDirection("column"),
                    gap: "2",
                }),
                some(`
                    Box.Root([
                        Box.Root([Text.Root("start")], {
                            display: Style.Display("flex"),
                            justifyContent: Style.JustifyContent("flex-start"),
                            padding: "2",
                            background: "green.100",
                            borderRadius: "sm",
                        }),
                        Box.Root([Text.Root("center")], {
                            display: Style.Display("flex"),
                            justifyContent: Style.JustifyContent("center"),
                            padding: "2",
                            background: "green.100",
                            borderRadius: "sm",
                        }),
                        Box.Root([Text.Root("end")], {
                            display: Style.Display("flex"),
                            justifyContent: Style.JustifyContent("flex-end"),
                            padding: "2",
                            background: "green.100",
                            borderRadius: "sm",
                        }),
                    ], {
                        display: Style.Display("flex"),
                        flexDirection: Style.FlexDirection("column"),
                        gap: "2",
                    }), 
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(styled),
                Grid.Item(flexRow, { colSpan: "2" }),
                Grid.Item(flexColumn),
                Grid.Item(fixed),
                Grid.Item(nested),
                Grid.Item(justify),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
