import { East, some } from "@elaraai/east";
import { Chart, UIComponentType, Grid, Box } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Scatter Chart showcase - demonstrates scatter plot variants and configurations.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic scatter chart
        const basic = $.let(
            ShowcaseCard(
                "Basic Scatter Chart",
                "Temperature vs sales correlation",
                Box.Root([
                    Chart.Scatter(
                        [
                            { temp: 10, sales: 30 },
                            { temp: 15, sales: 50 },
                            { temp: 20, sales: 80 },
                            { temp: 25, sales: 95 },
                            { temp: 30, sales: 110 },
                        ],
                        { temp: { color: "teal.solid" } },
                        {
                            xDataKey: "temp",
                            yDataKey: "sales",
                            grid: Chart.Grid({ show: true }),
                        }
                    ),
                ], { height: "200px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Scatter(
                            [
                                { temp: 10, sales: 30 },
                                { temp: 15, sales: 50 },
                                { temp: 20, sales: 80 },
                                { temp: 25, sales: 95 },
                                { temp: 30, sales: 110 },
                            ],
                            { temp: { color: "teal.solid" } },
                            {
                                xDataKey: "temp",
                                yDataKey: "sales",
                                grid: Chart.Grid({ show: true }),
                            }
                        ),
                    ], { height: "200px", width: "100%" })
                `)
            )
        );

        // With axis labels
        const withLabels = $.let(
            ShowcaseCard(
                "With Axis Labels",
                "Labeled axes for clarity",
                Box.Root([
                    Chart.Scatter(
                        [
                            { temp: 10, sales: 30 },
                            { temp: 15, sales: 50 },
                            { temp: 20, sales: 80 },
                            { temp: 25, sales: 95 },
                            { temp: 30, sales: 110 },
                        ],
                        { temp: { color: "blue.solid" } },
                        {
                            xAxis: Chart.Axis({ dataKey: "temp", label: "Temperature" }),
                            yAxis: Chart.Axis({ dataKey: "sales", label: "Sales" }),
                            grid: Chart.Grid({ show: true }),
                            tooltip: Chart.Tooltip({ show: true }),
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Scatter(
                            [
                                { temp: 10, sales: 30 },
                                { temp: 15, sales: 50 },
                                { temp: 20, sales: 80 },
                                { temp: 25, sales: 95 },
                                { temp: 30, sales: 110 },
                            ],
                            { temp: { color: "blue.solid" } },
                            {
                                xAxis: Chart.Axis({ dataKey: "temp", label: "Temperature" }),
                                yAxis: Chart.Axis({ dataKey: "sales", label: "Sales" }),
                                grid: Chart.Grid({ show: true }),
                                tooltip: Chart.Tooltip({ show: true }),
                            }
                        ),
                    ], { height: "220px", width: "100%" })
                `)
            )
        );

        // With custom domain
        const customDomain = $.let(
            ShowcaseCard(
                "Custom Axis Domain",
                "Fixed axis range",
                Box.Root([
                    Chart.Scatter(
                        [
                            { x: 10, y: 30 },
                            { x: 20, y: 40 },
                            { x: 30, y: 60 },
                            { x: 40, y: 80 },
                        ],
                        { x: { color: "purple.solid" } },
                        {
                            xAxis: Chart.Axis({ domain: [0, 50] }),
                            yAxis: Chart.Axis({ domain: [0, 100] }),
                            grid: Chart.Grid({ show: true }),
                        }
                    ),
                ], { height: "200px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Scatter(
                            [
                                { x: 10, y: 30 },
                                { x: 20, y: 40 },
                                { x: 30, y: 60 },
                                { x: 40, y: 80 },
                            ],
                            { x: { color: "purple.solid" } },
                            {
                                xAxis: Chart.Axis({ domain: [0, 50] }),
                                yAxis: Chart.Axis({ domain: [0, 100] }),
                                grid: Chart.Grid({ show: true }),
                            }
                        ),
                    ], { height: "200px", width: "100%" })
                `)
            )
        );

        // With tooltip
        const withTooltip = $.let(
            ShowcaseCard(
                "With Tooltip",
                "Hover to see data values",
                Box.Root([
                    Chart.Scatter(
                        [
                            { hours: 2, score: 55 },
                            { hours: 4, score: 65 },
                            { hours: 6, score: 75 },
                            { hours: 8, score: 85 },
                            { hours: 10, score: 90 },
                        ],
                        { hours: { color: "green.solid", label: "Study Hours" } },
                        {
                            xDataKey: "hours",
                            yDataKey: "score",
                            tooltip: Chart.Tooltip({ show: true }),
                            grid: Chart.Grid({ show: true }),
                        }
                    ),
                ], { height: "200px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Scatter(
                            [
                                { hours: 2, score: 55 },
                                { hours: 4, score: 65 },
                                { hours: 6, score: 75 },
                                { hours: 8, score: 85 },
                                { hours: 10, score: 90 },
                            ],
                            { hours: { color: "green.solid", label: "Study Hours" } },
                            {
                                xDataKey: "hours",
                                yDataKey: "score",
                                tooltip: Chart.Tooltip({ show: true }),
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
                    Chart.ScatterMulti(
                        {
                            groupA: [
                                { x: 10n, value: 30n },
                                { x: 20n, value: 50n },
                                { x: 30n, value: 45n },
                                { x: 40n, value: 60n },
                            ],
                            groupB: [
                                { x: 15n, value: 25n },
                                { x: 35n, value: 55n },
                                { x: 45n, value: 70n },
                            ],
                        },
                        {
                            xDataKey: "x",
                            valueKey: "value",
                            series: {
                                groupA: { color: "purple.solid" },
                                groupB: { color: "teal.solid" },
                            },
                            tooltip: Chart.Tooltip({ show: true }),
                            legend: Chart.Legend({ show: true }),
                            grid: Chart.Grid({ show: true }),
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.ScatterMulti(
                            {
                                groupA: [
                                    { x: 10n, value: 30n },
                                    { x: 20n, value: 50n },
                                    { x: 30n, value: 45n },
                                    { x: 40n, value: 60n },
                                ],
                                groupB: [
                                    { x: 15n, value: 25n },
                                    // x: 25 is missing - sparse data!
                                    { x: 35n, value: 55n },
                                    { x: 45n, value: 70n },
                                ],
                            },
                            {
                                xDataKey: "x",
                                valueKey: "value",
                                series: {
                                    groupA: { color: "purple.solid" },
                                    groupB: { color: "teal.solid" },
                                },
                                tooltip: Chart.Tooltip({ show: true }),
                                legend: Chart.Legend({ show: true }),
                                grid: Chart.Grid({ show: true }),
                            }
                        ),
                    ], { height: "220px", width: "100%" })
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(withLabels),
                Grid.Item(customDomain),
                Grid.Item(withTooltip),
                Grid.Item(sparseMultiSeries),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
