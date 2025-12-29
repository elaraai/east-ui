import { East, some } from "@elaraai/east";
import { Chart, UIComponentType, Grid, Box } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Composed Chart showcase - demonstrates combining multiple chart types.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic composed chart with bar and line
        const basic = $.let(
            ShowcaseCard(
                "Bar + Line Combo",
                "Revenue as bars, profit as line",
                Box.Root([
                    Chart.Composed(
                        [
                            { month: "Jan", revenue: 186n, profit: 80n },
                            { month: "Feb", revenue: 305n, profit: 120n },
                            { month: "Mar", revenue: 237n, profit: 95n },
                            { month: "Apr", revenue: 273n, profit: 150n },
                            { month: "May", revenue: 209n, profit: 110n },
                        ],
                        {
                            xAxis: { dataKey: "month" },
                            series: {
                                revenue: { type: "bar", color: "teal.solid" },
                                profit: { type: "line", color: "purple.solid", showDots: true },
                            },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    ),
                ], { height: "250px", width: "100%" }),
                some(`
                    Chart.Composed(
                        [
                            { month: "Jan", revenue: 186n, profit: 80n },
                            { month: "Feb", revenue: 305n, profit: 120n },
                            // ...
                        ],
                        {
                            xAxis: { dataKey: "month" },
                            series: {
                                revenue: { type: "bar", color: "teal.solid" },
                                profit: { type: "line", color: "purple.solid", showDots: true },
                            },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    )
                `)
            )
        );

        // All chart types combined
        const allTypes = $.let(
            ShowcaseCard(
                "All Chart Types",
                "Bar, Line, Area, and Scatter in one chart",
                Box.Root([
                    Chart.Composed(
                        [
                            { month: "Jan", bars: 186n, lines: 80n, areas: 150n, dots: 100n },
                            { month: "Feb", bars: 305n, lines: 120n, areas: 200n, dots: 150n },
                            { month: "Mar", bars: 237n, lines: 95n, areas: 180n, dots: 130n },
                            { month: "Apr", bars: 273n, lines: 150n, areas: 220n, dots: 160n },
                        ],
                        {
                            xAxis: { dataKey: "month" },
                            series: {
                                bars: { type: "bar", color: "teal.solid" },
                                areas: { type: "area", color: "blue.solid", fillOpacity: 0.3 },
                                lines: { type: "line", color: "purple.solid", showDots: true },
                                dots: { type: "scatter", color: "orange.solid" },
                            },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    ),
                ], { height: "250px", width: "100%" }),
                some(`
                    Chart.Composed(
                        [...data],
                        {
                            xAxis: { dataKey: "month" },
                            series: {
                                areas: { type: "area", color: "blue.solid", fillOpacity: 0.3 },
                                bars: { type: "bar", color: "teal.solid" },
                                lines: { type: "line", color: "purple.solid", showDots: true },
                                dots: { type: "scatter", color: "orange.solid" },
                            },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    )
                `)
            )
        );

        // Line with confidence band (area-range)
        const confidenceBand = $.let(
            ShowcaseCard(
                "Confidence Band",
                "Line with area-range for uncertainty bounds",
                Box.Root([
                    Chart.Composed(
                        [
                            { day: "Mon", value: 100n, low: 80n, high: 120n },
                            { day: "Tue", value: 150n, low: 130n, high: 170n },
                            { day: "Wed", value: 130n, low: 110n, high: 150n },
                            { day: "Thu", value: 180n, low: 160n, high: 200n },
                            { day: "Fri", value: 160n, low: 140n, high: 180n },
                        ],
                        {
                            xAxis: { dataKey: "day" },
                            series: {
                                confidence: { type: "area-range", lowKey: "low", highKey: "high", color: "blue.200", fillOpacity: 0.3 },
                                value: { type: "line", color: "blue.solid", strokeWidth: 2n, showDots: true },
                            },
                            grid: { show: true },
                            tooltip: { show: true },
                        }
                    ),
                ], { height: "250px", width: "100%" }),
                some(`
                    Chart.Composed(
                        [
                            { day: "Mon", value: 100n, low: 80n, high: 120n },
                            { day: "Tue", value: 150n, low: 130n, high: 170n },
                            // ...
                        ],
                        {
                            xAxis: { dataKey: "day" },
                            series: {
                                confidence: { type: "area-range", lowKey: "low", highKey: "high", color: "blue.200", fillOpacity: 0.3 },
                                value: { type: "line", color: "blue.solid", strokeWidth: 2n, showDots: true },
                            },
                            grid: { show: true },
                            tooltip: { show: true },
                        }
                    )
                `)
            )
        );

        // Stacked areas with line overlay
        const stackedAreas = $.let(
            ShowcaseCard(
                "Stacked Areas + Line",
                "Stacked area chart with trend line overlay",
                Box.Root([
                    Chart.Composed(
                        [
                            { month: "Jan", mobile: 50n, desktop: 100n, trend: 130n },
                            { month: "Feb", mobile: 70n, desktop: 120n, trend: 160n },
                            { month: "Mar", mobile: 60n, desktop: 110n, trend: 145n },
                            { month: "Apr", mobile: 90n, desktop: 140n, trend: 200n },
                        ],
                        {
                            xAxis: { dataKey: "month" },
                            series: {
                                mobile: { type: "area", color: "teal.solid", fillOpacity: 0.5, stackId: "traffic" },
                                desktop: { type: "area", color: "blue.solid", fillOpacity: 0.5, stackId: "traffic" },
                                trend: { type: "line", color: "red.solid", strokeWidth: 2n, strokeDasharray: "5 5", showDots: false },
                            },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    ),
                ], { height: "250px", width: "100%" }),
                some(`
                    Chart.Composed(
                        [...data],
                        {
                            xAxis: { dataKey: "month" },
                            series: {
                                mobile: { type: "area", color: "teal.solid", fillOpacity: 0.5, stackId: "traffic" },
                                desktop: { type: "area", color: "blue.solid", fillOpacity: 0.5, stackId: "traffic" },
                                trend: { type: "line", color: "red.solid", strokeDasharray: "5 5" },
                            },
                            grid: { show: true },
                            legend: { show: true },
                        }
                    )
                `)
            )
        );

        // Stacked bars with line
        const stackedBars = $.let(
            ShowcaseCard(
                "Stacked Bars + Line",
                "Stacked bar chart with cumulative line",
                Box.Root([
                    Chart.Composed(
                        [
                            { month: "Jan", productA: 100n, productB: 80n, total: 180n },
                            { month: "Feb", productA: 150n, productB: 100n, total: 250n },
                            { month: "Mar", productA: 120n, productB: 90n, total: 210n },
                            { month: "Apr", productA: 180n, productB: 120n, total: 300n },
                        ],
                        {
                            xAxis: { dataKey: "month" },
                            series: {
                                productA: { type: "bar", color: "teal.solid", stackId: "products" },
                                productB: { type: "bar", color: "purple.solid", stackId: "products" },
                                total: { type: "line", color: "orange.solid", strokeWidth: 3n, showDots: true },
                            },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    ),
                ], { height: "250px", width: "100%" }),
                some(`
                    Chart.Composed(
                        [...data],
                        {
                            xAxis: { dataKey: "month" },
                            series: {
                                productA: { type: "bar", color: "teal.solid", stackId: "products" },
                                productB: { type: "bar", color: "purple.solid", stackId: "products" },
                                total: { type: "line", color: "orange.solid", strokeWidth: 3n, showDots: true },
                            },
                            grid: { show: true },
                            legend: { show: true },
                        }
                    )
                `)
            )
        );

        // Multi-series with sparse data
        const sparseData = $.let(
            ShowcaseCard(
                "Sparse Multi-Series",
                "Different data points per series using ComposedMulti",
                Box.Root([
                    Chart.ComposedMulti(
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
                                revenue: { type: "bar", color: "teal.solid" },
                                profit: { type: "line", color: "purple.solid", showDots: true },
                            },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    ),
                ], { height: "250px", width: "100%" }),
                some(`
                    Chart.ComposedMulti(
                        {
                            revenue: [
                                { month: "Jan", value: 186n },
                                { month: "Feb", value: 305n },
                                // ...
                            ],
                            profit: [
                                { month: "Jan", value: 80n },
                                // Feb is missing - sparse data!
                                { month: "Mar", value: 120n },
                                // ...
                            ],
                        },
                        {
                            xAxis: { dataKey: "month" },
                            valueKey: "value",
                            series: {
                                revenue: { type: "bar", color: "teal.solid" },
                                profit: { type: "line", color: "purple.solid" },
                            },
                        }
                    )
                `)
            )
        );

        // Natural curve type
        const naturalCurve = $.let(
            ShowcaseCard(
                "Natural Curve",
                "Smooth natural interpolation for lines and areas",
                Box.Root([
                    Chart.Composed(
                        [
                            { month: "Jan", area: 100n, line: 80n },
                            { month: "Feb", area: 150n, line: 120n },
                            { month: "Mar", area: 120n, line: 95n },
                            { month: "Apr", area: 180n, line: 150n },
                            { month: "May", area: 140n, line: 110n },
                        ],
                        {
                            xAxis: { dataKey: "month" },
                            series: {
                                area: { type: "area", color: "teal.solid", fillOpacity: 0.3 },
                                line: { type: "line", color: "purple.solid", showDots: true },
                            },
                            curveType: "natural",
                            grid: { show: true },
                            tooltip: { show: true },
                        }
                    ),
                ], { height: "250px", width: "100%" }),
                some(`
                    Chart.Composed(
                        [...data],
                        {
                            xAxis: { dataKey: "month" },
                            series: {
                                area: { type: "area", color: "teal.solid", fillOpacity: 0.3 },
                                line: { type: "line", color: "purple.solid", showDots: true },
                            },
                            curveType: "natural",
                            grid: { show: true },
                        }
                    )
                `)
            )
        );

        // Dual Y-Axis (secondary axis on right)
        const dualYAxis = $.let(
            ShowcaseCard(
                "Dual Y-Axis",
                "Revenue bars (left) vs Growth rate line (right)",
                Box.Root([
                    Chart.Composed(
                        [
                            { month: "Jan", revenue: 186n, growthRate: 5n },
                            { month: "Feb", revenue: 305n, growthRate: 12n },
                            { month: "Mar", revenue: 237n, growthRate: -8n },
                            { month: "Apr", revenue: 273n, growthRate: 15n },
                            { month: "May", revenue: 350n, growthRate: 28n },
                        ],
                        {
                            xAxis: { dataKey: "month" },
                            yAxis: { label: "Revenue ($K)" },
                            yAxis2: { label: "Growth (%)" },
                            series: {
                                revenue: { type: "bar", color: "teal.solid", yAxisId: "left" },
                                growthRate: { type: "line", color: "purple.solid", yAxisId: "right", showDots: true, strokeWidth: 2n },
                            },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    ),
                ], { height: "250px", width: "100%" }),
                some(`
                    Chart.Composed(
                        [
                            { month: "Jan", revenue: 186n, growthRate: 5n },
                            { month: "Feb", revenue: 305n, growthRate: 12n },
                            // ...
                        ],
                        {
                            xAxis: { dataKey: "month" },
                            yAxis: { label: "Revenue ($K)" },
                            yAxis2: { label: "Growth (%)" },
                            series: {
                                revenue: { type: "bar", color: "teal.solid", yAxisId: "left" },
                                growthRate: { type: "line", color: "purple.solid", yAxisId: "right", showDots: true },
                            },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    )
                `)
            )
        );

        // With reference line
        const withReference = $.let(
            ShowcaseCard(
                "With Reference Line",
                "Target line across the chart",
                Box.Root([
                    Chart.Composed(
                        [
                            { month: "Jan", actual: 186n, forecast: 150n },
                            { month: "Feb", actual: 305n, forecast: 200n },
                            { month: "Mar", actual: 237n, forecast: 180n },
                            { month: "Apr", actual: 273n, forecast: 220n },
                        ],
                        {
                            xAxis: { dataKey: "month" },
                            series: {
                                actual: { type: "bar", color: "teal.solid" },
                                forecast: { type: "area", color: "gray.200", fillOpacity: 0.5 },
                            },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                            referenceLines: [
                                { y: 200, stroke: "red", strokeDasharray: "5 5", label: "Target" }
                            ],
                        }
                    ),
                ], { height: "250px", width: "100%" }),
                some(`
                    Chart.Composed(
                        [...data],
                        {
                            xAxis: { dataKey: "month" },
                            series: {
                                forecast: { type: "area", color: "gray.200", fillOpacity: 0.5 },
                                actual: { type: "bar", color: "teal.solid" },
                            },
                            referenceLines: [
                                { y: 200, stroke: "red", strokeDasharray: "5 5", label: "Target" }
                            ],
                        }
                    )
                `)
            )
        );

        // With brush for data zooming
        const withBrush = $.let(
            ShowcaseCard(
                "With Brush",
                "Drag to zoom/pan across data range",
                Box.Root([
                    Chart.Composed(
                        [
                            { month: "Jan", revenue: 186n, profit: 80n },
                            { month: "Feb", revenue: 305n, profit: 120n },
                            { month: "Mar", revenue: 237n, profit: 95n },
                            { month: "Apr", revenue: 273n, profit: 150n },
                            { month: "May", revenue: 209n, profit: 110n },
                            { month: "Jun", revenue: 314n, profit: 165n },
                            { month: "Jul", revenue: 256n, profit: 130n },
                            { month: "Aug", revenue: 289n, profit: 145n },
                            { month: "Sep", revenue: 321n, profit: 170n },
                            { month: "Oct", revenue: 278n, profit: 140n },
                            { month: "Nov", revenue: 342n, profit: 180n },
                            { month: "Dec", revenue: 398n, profit: 210n },
                        ],
                        {
                            xAxis: { dataKey: "month" },
                            series: {
                                revenue: { type: "bar", color: "teal.solid" },
                                profit: { type: "line", color: "purple.solid", showDots: true },
                            },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                            brush: { dataKey: "month", height: 30n },
                        }
                    ),
                ], { height: "320px", width: "100%" }),
                some(`
                    Chart.Composed(
                        [...monthlyData],
                        {
                            xAxis: { dataKey: "month" },
                            series: {
                                revenue: { type: "bar", color: "teal.solid" },
                                profit: { type: "line", color: "purple.solid", showDots: true },
                            },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                            brush: { dataKey: "month", height: 30n },
                        }
                    )
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(allTypes),
                Grid.Item(confidenceBand),
                Grid.Item(stackedAreas),
                Grid.Item(stackedBars),
                Grid.Item(sparseData),
                Grid.Item(naturalCurve),
                Grid.Item(dualYAxis),
                Grid.Item(withReference),
                Grid.Item(withBrush),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
