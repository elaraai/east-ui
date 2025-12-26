import { East, some } from "@elaraai/east";
import { Chart, UIComponentType, Grid, Box } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Line Chart showcase - demonstrates line chart variants and configurations.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic line chart
        const basic = $.let(
            ShowcaseCard(
                "Basic Line Chart",
                "Single series line chart",
                Box.Root([
                    Chart.Line(
                        [
                            { month: "January", sale: 10 },
                            { month: "February", sale: 95 },
                            { month: "March", sale: 87 },
                            { month: "April", sale: 120 },
                            { month: "May", sale: 150 },
                        ],
                        { sale: { color: "teal.solid" } },
                        {
                            xAxis: { dataKey: "month" },
                            grid: Chart.Grid({ show: true }),
                            tooltip: Chart.Tooltip({ show: true }),
                        }
                    ),
                ], { height: "200px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Line(
                            [
                                { month: "January", sale: 10 },
                                { month: "February", sale: 95 },
                                { month: "March", sale: 87 },
                                { month: "April", sale: 120 },
                                { month: "May", sale: 150 },
                            ],
                            { sale: { color: "teal.solid" } },
                            {
                                xAxis: { dataKey: "month" },
                                grid: Chart.Grid({ show: true }),
                                tooltip: Chart.Tooltip({ show: true }),
                            }
                        ),
                    ], { height: "200px", width: "100%" })
                `)
            )
        );

        // Multi-series line chart
        const multiSeries = $.let(
            ShowcaseCard(
                "Multi-Series Line",
                "Multiple data series",
                Box.Root([
                    Chart.Line(
                        [
                            { month: "January", mac: 10, linux: 120 },
                            { month: "February", mac: 95, linux: 110 },
                            { month: "March", mac: 87, linux: 125 },
                            { month: "April", mac: 110, linux: 100 },
                        ],
                        {
                            mac: { color: "purple.solid" },
                            linux: { color: "blue.solid" },
                        },
                        {
                            xAxis: { dataKey: "month" },
                            grid: Chart.Grid({ show: true }),
                            tooltip: Chart.Tooltip({ show: true }),
                            legend: Chart.Legend({ show: true }),
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Line(
                            [
                                { month: "January", mac: 10, linux: 120 },
                                { month: "February", mac: 95, linux: 110 },
                                { month: "March", mac: 87, linux: 125 },
                                { month: "April", mac: 110, linux: 100 },
                            ],
                            {
                                mac: { color: "purple.solid" },
                                linux: { color: "blue.solid" },
                            },
                            {
                                xAxis: { dataKey: "month" },
                                grid: Chart.Grid({ show: true }),
                                tooltip: Chart.Tooltip({ show: true }),
                                legend: Chart.Legend({ show: true }),
                            }
                        ),
                    ], { height: "220px", width: "100%" })
                `)
            )
        );

        // Natural curve
        const natural = $.let(
            ShowcaseCard(
                "Natural Curve",
                "Smooth natural interpolation",
                Box.Root([
                    Chart.Line(
                        [
                            { month: "Jan", sales: 100 },
                            { month: "Feb", sales: 150 },
                            { month: "Mar", sales: 120 },
                            { month: "Apr", sales: 180 },
                            { month: "May", sales: 140 },
                        ],
                        { sales: { color: "green.solid" } },
                        {
                            xAxis: { dataKey: "month" },
                            curveType: "natural",
                            grid: Chart.Grid({ show: true }),
                        }
                    ),
                ], { height: "200px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Line(
                            [
                                { month: "Jan", sales: 100 },
                                { month: "Feb", sales: 150 },
                                { month: "Mar", sales: 120 },
                                { month: "Apr", sales: 180 },
                                { month: "May", sales: 140 },
                            ],
                            { sales: { color: "green.solid" } },
                            {
                                xAxis: { dataKey: "month" },
                                curveType: "natural",
                                grid: Chart.Grid({ show: true }),
                            }
                        ),
                    ], { height: "200px", width: "100%" })
                `)
            )
        );

        // Step curve
        const step = $.let(
            ShowcaseCard(
                "Step Curve",
                "Stepped line interpolation",
                Box.Root([
                    Chart.Line(
                        [
                            { month: "Jan", price: 100 },
                            { month: "Feb", price: 120 },
                            { month: "Mar", price: 115 },
                            { month: "Apr", price: 140 },
                            { month: "May", price: 135 },
                        ],
                        { price: { color: "orange.solid" } },
                        {
                            xAxis: { dataKey: "month" },
                            curveType: "step",
                            grid: Chart.Grid({ show: true }),
                        }
                    ),
                ], { height: "200px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Line(
                            [
                                { month: "Jan", price: 100 },
                                { month: "Feb", price: 120 },
                                { month: "Mar", price: 115 },
                                { month: "Apr", price: 140 },
                                { month: "May", price: 135 },
                            ],
                            { price: { color: "orange.solid" } },
                            {
                                xAxis: { dataKey: "month" },
                                curveType: "step",
                                grid: Chart.Grid({ show: true }),
                            }
                        ),
                    ], { height: "200px", width: "100%" })
                `)
            )
        );

        // Without dots
        const noDots = $.let(
            ShowcaseCard(
                "Without Dots",
                "Clean line without data points",
                Box.Root([
                    Chart.Line(
                        [
                            { month: "Jan", revenue: 186 },
                            { month: "Feb", revenue: 305 },
                            { month: "Mar", revenue: 237 },
                            { month: "Apr", revenue: 273 },
                            { month: "May", revenue: 209 },
                        ],
                        { revenue: { color: "teal.solid" } },
                        {
                            xAxis: { dataKey: "month" },
                            showDots: false,
                            strokeWidth: 2n,
                            grid: Chart.Grid({ show: true }),
                        }
                    ),
                ], { height: "200px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Line(
                            [
                                { month: "Jan", revenue: 186 },
                                { month: "Feb", revenue: 305 },
                                { month: "Mar", revenue: 237 },
                                { month: "Apr", revenue: 273 },
                                { month: "May", revenue: 209 },
                            ],
                            { revenue: { color: "teal.solid" } },
                            {
                                xAxis: { dataKey: "month" },
                                showDots: false,
                                strokeWidth: 2n,
                                grid: Chart.Grid({ show: true }),
                            }
                        ),
                    ], { height: "200px", width: "100%" })
                `)
            )
        );

        // Custom stroke width
        const thickLine = $.let(
            ShowcaseCard(
                "Custom Stroke Width",
                "Thicker line for emphasis",
                Box.Root([
                    Chart.Line(
                        [
                            { month: "Jan", value: 50 },
                            { month: "Feb", value: 80 },
                            { month: "Mar", value: 65 },
                            { month: "Apr", value: 95 },
                        ],
                        { value: { color: "pink.solid" } },
                        {
                            xAxis: { dataKey: "month" },
                            strokeWidth: 4n,
                            showDots: true,
                            grid: Chart.Grid({ show: true }),
                        }
                    ),
                ], { height: "200px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Line(
                            [
                                { month: "Jan", value: 50 },
                                { month: "Feb", value: 80 },
                                { month: "Mar", value: 65 },
                                { month: "Apr", value: 95 },
                            ],
                            { value: { color: "pink.solid" } },
                            {
                                xAxis: { dataKey: "month" },
                                strokeWidth: 4n,
                                showDots: true,
                                grid: Chart.Grid({ show: true }),
                            }
                        ),
                    ], { height: "200px", width: "100%" })
                `)
            )
        );

        // Multi-series sparse data (record form)
        const sparseMultiSeries = $.let(
            ShowcaseCard(
                "Sparse Multi-Series",
                "Separate arrays for each series (avoids null values)",
                Box.Root([
                    Chart.LineMulti(
                        {
                            revenue: [
                                { month: "Jan", value: 186n },
                                { month: "Feb", value: 305n },
                                { month: "Mar", value: 237n },
                                { month: "Apr", value: 273n },
                            ],
                            profit: [
                                { month: "Jan", value: 80n },
                                { month: "Mar", value: 120n },
                                { month: "Apr", value: 150n },
                            ],
                        },
                        {
                            xAxis: { dataKey: "month" },
                            valueKey: "value",
                            series: {
                                revenue: { color: "teal.solid" },
                                profit: { color: "purple.solid" },
                            },
                            grid: Chart.Grid({ show: true }),
                            tooltip: Chart.Tooltip({ show: true }),
                            legend: Chart.Legend({ show: true }),
                            connectNulls: false,
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.LineMulti(
                            {
                                revenue: [
                                    { month: "Jan", value: 186n },
                                    { month: "Feb", value: 305n },
                                    { month: "Mar", value: 237n },
                                    { month: "Apr", value: 273n },
                                ],
                                profit: [
                                    { month: "Jan", value: 80n },
                                    // Feb is missing - sparse data!
                                    { month: "Mar", value: 120n },
                                    { month: "Apr", value: 150n },
                                ],
                            },
                            {
                                xAxis: { dataKey: "month" },
                                valueKey: "value",
                                series: {
                                    revenue: { color: "teal.solid" },
                                    profit: { color: "purple.solid" },
                                },
                                grid: Chart.Grid({ show: true }),
                                tooltip: Chart.Tooltip({ show: true }),
                                legend: Chart.Legend({ show: true }),
                            }
                        ),
                    ], { height: "220px", width: "100%" })
                `)
            )
        );

        // Per-series styling (strokeWidth, strokeDasharray, showDots, showLine)
        const perSeriesStyling = $.let(
            ShowcaseCard(
                "Per-Series Styling",
                "Different strokeWidth, dashed lines, dots per series",
                Box.Root([
                    Chart.Line(
                        [
                            { month: "Jan", actual: 100, target: 120, forecast: 110 },
                            { month: "Feb", actual: 150, target: 130, forecast: 140 },
                            { month: "Mar", actual: 130, target: 140, forecast: 145 },
                            { month: "Apr", actual: 180, target: 150, forecast: 160 },
                            { month: "May", actual: 160, target: 160, forecast: 170 },
                        ],
                        {
                            actual: {
                                color: "teal.solid",
                                strokeWidth: 3n,
                                showDots: true,
                            },
                            target: {
                                color: "red.solid",
                                strokeWidth: 2n,
                                strokeDasharray: "5 5",
                                showDots: false,
                            },
                            forecast: {
                                color: "purple.solid",
                                strokeWidth: 1n,
                                strokeDasharray: "2 2",
                                showDots: false,
                            },
                        },
                        {
                            xAxis: { dataKey: "month" },
                            grid: Chart.Grid({ show: true }),
                            tooltip: Chart.Tooltip({ show: true }),
                            legend: Chart.Legend({ show: true }),
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Line(
                            [
                                { month: "Jan", actual: 100, target: 120, forecast: 110 },
                                { month: "Feb", actual: 150, target: 130, forecast: 140 },
                                { month: "Mar", actual: 130, target: 140, forecast: 145 },
                                { month: "Apr", actual: 180, target: 150, forecast: 160 },
                                { month: "May", actual: 160, target: 160, forecast: 170 },
                            ],
                            {
                                actual: {
                                    color: "teal.solid",
                                    strokeWidth: 3n,
                                    showDots: true,
                                },
                                target: {
                                    color: "red.solid",
                                    strokeWidth: 2n,
                                    strokeDasharray: "5 5",
                                    showDots: false,
                                },
                                forecast: {
                                    color: "purple.solid",
                                    strokeWidth: 1n,
                                    strokeDasharray: "2 2",
                                    showDots: false,
                                },
                            },
                            {
                                xAxis: { dataKey: "month" },
                                grid: Chart.Grid({ show: true }),
                                tooltip: Chart.Tooltip({ show: true }),
                                legend: Chart.Legend({ show: true }),
                            }
                        ),
                    ], { height: "220px", width: "100%" })
                `)
            )
        );

        // Dots only (no lines)
        const dotsOnly = $.let(
            ShowcaseCard(
                "Dots Only (Scatter)",
                "Hide lines per series for scatter-like appearance",
                Box.Root([
                    Chart.Line(
                        [
                            { month: "Jan", revenue: 186, profit: 80 },
                            { month: "Feb", revenue: 305, profit: 120 },
                            { month: "Mar", revenue: 237, profit: 95 },
                            { month: "Apr", revenue: 273, profit: 150 },
                            { month: "May", revenue: 209, profit: 110 },
                        ],
                        {
                            revenue: {
                                color: "teal.solid",
                                showLine: false,
                                showDots: true,
                            },
                            profit: {
                                color: "orange.solid",
                                showLine: true,
                                showDots: true,
                                strokeWidth: 2n,
                            },
                        },
                        {
                            xAxis: { dataKey: "month" },
                            grid: Chart.Grid({ show: true }),
                            tooltip: Chart.Tooltip({ show: true }),
                            legend: Chart.Legend({ show: true }),
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Line(
                            [
                                { month: "Jan", revenue: 186, profit: 80 },
                                { month: "Feb", revenue: 305, profit: 120 },
                                { month: "Mar", revenue: 237, profit: 95 },
                                { month: "Apr", revenue: 273, profit: 150 },
                                { month: "May", revenue: 209, profit: 110 },
                            ],
                            {
                                revenue: {
                                    color: "teal.solid",
                                    showLine: false,  // Dots only
                                    showDots: true,
                                },
                                profit: {
                                    color: "orange.solid",
                                    showLine: true,
                                    showDots: true,
                                    strokeWidth: 2n,
                                },
                            },
                            {
                                xAxis: { dataKey: "month" },
                                grid: Chart.Grid({ show: true }),
                                tooltip: Chart.Tooltip({ show: true }),
                                legend: Chart.Legend({ show: true }),
                            }
                        ),
                    ], { height: "220px", width: "100%" })
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(multiSeries),
                Grid.Item(natural),
                Grid.Item(step),
                Grid.Item(noDots),
                Grid.Item(thickLine),
                Grid.Item(sparseMultiSeries),
                Grid.Item(perSeriesStyling),
                Grid.Item(dotsOnly),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
