import { East } from "@elaraai/east";
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
                            xAxis: Chart.Axis({ dataKey: "month" }),
                            grid: Chart.Grid({ show: true }),
                            tooltip: Chart.Tooltip({ show: true }),
                        }
                    ),
                ], { height: "200px", width: "100%" })
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
                            xAxis: Chart.Axis({ dataKey: "month" }),
                            grid: Chart.Grid({ show: true }),
                            tooltip: Chart.Tooltip({ show: true }),
                            legend: Chart.Legend({ show: true }),
                        }
                    ),
                ], { height: "220px", width: "100%" })
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
                            xAxis: Chart.Axis({ dataKey: "month" }),
                            curveType: "natural",
                            grid: Chart.Grid({ show: true }),
                        }
                    ),
                ], { height: "200px", width: "100%" })
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
                            xAxis: Chart.Axis({ dataKey: "month" }),
                            curveType: "step",
                            grid: Chart.Grid({ show: true }),
                        }
                    ),
                ], { height: "200px", width: "100%" })
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
                            xAxis: Chart.Axis({ dataKey: "month" }),
                            showDots: false,
                            strokeWidth: 2n,
                            grid: Chart.Grid({ show: true }),
                        }
                    ),
                ], { height: "200px", width: "100%" })
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
                            xAxis: Chart.Axis({ dataKey: "month" }),
                            strokeWidth: 4n,
                            showDots: true,
                            grid: Chart.Grid({ show: true }),
                        }
                    ),
                ], { height: "200px", width: "100%" })
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
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
