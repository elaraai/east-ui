import { East, some } from "@elaraai/east";
import { Sparkline, UIComponentType, Stack, Text, Grid } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Sparkline showcase - demonstrates sparkline chart types, colors, and dimensions.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic line sparkline
        const basicLine = $.let(
            ShowcaseCard(
                "Line Sparkline",
                "Default line chart type",
                Sparkline.Root([1.0, 3.0, 2.0, 4.0, 3.5, 5.0, 4.2], {
                    type: "line",
                    color: "blue.500",
                    width: "150px",
                    height: "40px",
                }),
                some(`
                    Sparkline.Root([1.0, 3.0, 2.0, 4.0, 3.5, 5.0, 4.2], {
                        type: "line",
                        color: "blue.500",
                        width: "150px",
                        height: "40px",
                    })
                `)
            )
        );

        // Area sparkline
        const area = $.let(
            ShowcaseCard(
                "Area Sparkline",
                "Filled area chart type",
                Sparkline.Root([10.0, 20.0, 15.0, 25.0, 18.0, 30.0, 22.0], {
                    type: "area",
                    color: "green.500",
                    width: "150px",
                    height: "40px",
                }),
                some(`
                    Sparkline.Root([10.0, 20.0, 15.0, 25.0, 18.0, 30.0, 22.0], {
                        type: "area",
                        color: "green.500",
                        width: "150px",
                        height: "40px",
                    })
                `)
            )
        );

        // Color variations
        const colors = $.let(
            ShowcaseCard(
                "Color Variations",
                "Different color schemes",
                Stack.VStack([
                    Stack.HStack([
                        Sparkline.Root([1.0, 2.0, 1.5, 3.0, 2.5], {
                            type: "line",
                            color: "red.400",
                            width: "100px",
                            height: "32px",
                        }),
                        Text.Root("Red"),
                    ], { gap: "2", align: "center" }),
                    Stack.HStack([
                        Sparkline.Root([1.0, 2.0, 1.5, 3.0, 2.5], {
                            type: "line",
                            color: "teal.400",
                            width: "100px",
                            height: "32px",
                        }),
                        Text.Root("Teal"),
                    ], { gap: "2", align: "center" }),
                    Stack.HStack([
                        Sparkline.Root([1.0, 2.0, 1.5, 3.0, 2.5], {
                            type: "line",
                            color: "purple.400",
                            width: "100px",
                            height: "32px",
                        }),
                        Text.Root("Purple"),
                    ], { gap: "2", align: "center" }),
                ], { gap: "2" }),
                some(`
                    Stack.VStack([
                        Stack.HStack([
                            Sparkline.Root([1.0, 2.0, 1.5, 3.0, 2.5], {
                                type: "line",
                                color: "red.400",
                                width: "100px",
                                height: "32px",
                            }),
                            Text.Root("Red"),
                        ], { gap: "2", align: "center" }),
                        Stack.HStack([
                            Sparkline.Root([1.0, 2.0, 1.5, 3.0, 2.5], {
                                type: "line",
                                color: "teal.400",
                                width: "100px",
                                height: "32px",
                            }),
                            Text.Root("Teal"),
                        ], { gap: "2", align: "center" }),
                        Stack.HStack([
                            Sparkline.Root([1.0, 2.0, 1.5, 3.0, 2.5], {
                                type: "line",
                                color: "purple.400",
                                width: "100px",
                                height: "32px",
                            }),
                            Text.Root("Purple"),
                        ], { gap: "2", align: "center" }),
                    ], { gap: "2" })
                `)
            )
        );

        // Size variations
        const sizes = $.let(
            ShowcaseCard(
                "Size Variations",
                "Different dimensions",
                Stack.VStack([
                    Sparkline.Root([1.0, 2.0, 1.5, 3.0, 2.5], {
                        type: "line",
                        color: "blue.500",
                        width: "80px",
                        height: "24px",
                    }),
                    Sparkline.Root([1.0, 2.0, 1.5, 3.0, 2.5], {
                        type: "line",
                        color: "blue.500",
                        width: "120px",
                        height: "32px",
                    }),
                    Sparkline.Root([1.0, 2.0, 1.5, 3.0, 2.5], {
                        type: "line",
                        color: "blue.500",
                        width: "200px",
                        height: "48px",
                    }),
                ], { gap: "3", align: "stretch" }),
                some(`
                    Stack.VStack([
                        Sparkline.Root([1.0, 2.0, 1.5, 3.0, 2.5], {
                            type: "line",
                            color: "blue.500",
                            width: "80px",
                            height: "24px",
                        }),
                        Sparkline.Root([1.0, 2.0, 1.5, 3.0, 2.5], {
                            type: "line",
                            color: "blue.500",
                            width: "120px",
                            height: "32px",
                        }),
                        Sparkline.Root([1.0, 2.0, 1.5, 3.0, 2.5], {
                            type: "line",
                            color: "blue.500",
                            width: "200px",
                            height: "48px",
                        }),
                    ], { gap: "3", align: "stretch" })
                `)
            )
        );

        // Stock price sparkline
        const stock = $.let(
            ShowcaseCard(
                "Stock Price",
                "Uptrend stock visualization",
                Sparkline.Root(
                    [142.5, 143.2, 141.8, 144.0, 143.5, 145.2, 144.8, 146.0],
                    {
                        type: "area",
                        color: "green.500",
                        width: "150px",
                        height: "48px",
                    }
                ),
                some(`
                    Sparkline.Root(
                        [142.5, 143.2, 141.8, 144.0, 143.5, 145.2, 144.8, 146.0],
                        {
                            type: "area",
                            color: "green.500",
                            width: "150px",
                            height: "48px",
                        }
                    )
                `)
            )
        );

        // Dashboard metric
        const metric = $.let(
            ShowcaseCard(
                "Dashboard Metric",
                "Inline metric visualization",
                Stack.HStack([
                    Stack.VStack([
                        Text.Root("Revenue"),
                        Text.Root("$45,231", { fontWeight: "bold" }),
                    ], { gap: "1" }),
                    Sparkline.Root(
                        [100.0, 120.0, 115.0, 130.0, 125.0, 140.0, 155.0],
                        {
                            type: "area",
                            color: "teal.400",
                            width: "100px",
                            height: "40px",
                        }
                    ),
                ], { gap: "4", align: "center" }),
                some(`
                    Stack.HStack([
                        Stack.VStack([
                            Text.Root("Revenue"),
                            Text.Root("$45,231", { fontWeight: "bold" }),
                        ], { gap: "1" }),
                        Sparkline.Root(
                            [100.0, 120.0, 115.0, 130.0, 125.0, 140.0, 155.0],
                            {
                                type: "area",
                                color: "teal.400",
                                width: "100px",
                                height: "40px",
                            }
                        ),
                    ], { gap: "4", align: "center" })
                `)
            )
        );

        // Table cell sparkline
        const tableCell = $.let(
            ShowcaseCard(
                "Table Cell",
                "Compact sparkline for tables",
                Stack.HStack([
                    Text.Root("Product A"),
                    Sparkline.Root([10.0, 12.0, 8.0, 15.0, 11.0, 14.0], {
                        type: "line",
                        color: "gray.400",
                        width: "80px",
                        height: "24px",
                    }),
                    Text.Root("+14%", { color: "green.500" }),
                ], { gap: "4", align: "center" }),
                some(`
                    Stack.HStack([
                        Text.Root("Product A"),
                        Sparkline.Root([10.0, 12.0, 8.0, 15.0, 11.0, 14.0], {
                            type: "line",
                            color: "gray.400",
                            width: "80px",
                            height: "24px",
                        }),
                        Text.Root("+14%", { color: "green.500" }),
                    ], { gap: "4", align: "center" })
                `)
            )
        );

        // Downtrend
        const downtrend = $.let(
            ShowcaseCard(
                "Downtrend",
                "Declining metric visualization",
                Sparkline.Root(
                    [50.0, 48.0, 45.0, 42.0, 44.0, 40.0, 38.0],
                    {
                        type: "area",
                        color: "red.400",
                        width: "150px",
                        height: "48px",
                    }
                ),
                some(`
                    Sparkline.Root(
                        [50.0, 48.0, 45.0, 42.0, 44.0, 40.0, 38.0],
                        {
                            type: "area",
                            color: "red.400",
                            width: "150px",
                            height: "48px",
                        }
                    )
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(basicLine),
                Grid.Item(area),
                Grid.Item(colors),
                Grid.Item(sizes),
                Grid.Item(stock),
                Grid.Item(downtrend),
                Grid.Item(metric, { colSpan: "2" }),
                Grid.Item(tableCell, { colSpan: "2" }),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
