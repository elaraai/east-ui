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
                            xAxis: { dataKey: "temp" },
                            yAxis: { dataKey: "sales" },
                            grid: { show: true },
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
                                xAxis: { dataKey: "temp" },
                                yAxis: { dataKey: "sales" },
                                grid: { show: true },
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
                            xAxis: { dataKey: "temp", label: "Temperature" },
                            yAxis: { dataKey: "sales", label: "Sales" },
                            grid: { show: true },
                            tooltip: { show: true },
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
                                xAxis: { dataKey: "temp", label: "Temperature" },
                                yAxis: { dataKey: "sales", label: "Sales" },
                                grid: { show: true },
                                tooltip: { show: true },
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
                            xAxis: { dataKey: "x", domain: [0, 50] },
                            yAxis: { dataKey: "y", domain: [0, 100] },
                            grid: { show: true },
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
                                xAxis: { dataKey: "x" },
                                yAxis: { dataKey: "y" },
                                xAxis: { domain: [0, 50] },
                                yAxis: { domain: [0, 100] },
                                grid: { show: true },
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
                            xAxis: { dataKey: "hours" },
                            yAxis: { dataKey: "score" },
                            tooltip: { show: true },
                            grid: { show: true },
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
                                xAxis: { dataKey: "hours" },
                                yAxis: { dataKey: "score" },
                                tooltip: { show: true },
                                grid: { show: true },
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
                            xAxis: { dataKey: "x" },
                            valueKey: "value",
                            series: {
                                groupA: { color: "purple.solid" },
                                groupB: { color: "teal.solid" },
                            },
                            tooltip: { show: true },
                            legend: { show: true },
                            grid: { show: true },
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
                                xAxis: { dataKey: "x" },
                                valueKey: "value",
                                series: {
                                    groupA: { color: "purple.solid" },
                                    groupB: { color: "teal.solid" },
                                },
                                tooltip: { show: true },
                                legend: { show: true },
                                grid: { show: true },
                            }
                        ),
                    ], { height: "220px", width: "100%" })
                `)
            )
        );

        // With legend (multiple series)
        const withLegend = $.let(
            ShowcaseCard(
                "With Legend",
                "Multiple series with legend",
                Box.Root([
                    Chart.Scatter(
                        [
                            { temp: 10, sales: 30, traffic: 50 },
                            { temp: 15, sales: 50, traffic: 70 },
                            { temp: 20, sales: 80, traffic: 90 },
                            { temp: 25, sales: 95, traffic: 85 },
                            { temp: 30, sales: 110, traffic: 100 },
                        ],
                        {
                            sales: { color: "teal.solid", label: "Sales" },
                            traffic: { color: "purple.solid", label: "Traffic" },
                        },
                        {
                            xAxis: { dataKey: "temp", label: "Temperature" },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    ),
                ], { height: "240px", width: "100%" }),
                some(`
                    Chart.Scatter(
                        [...data],
                        {
                            sales: { color: "teal.solid", label: "Sales" },
                            traffic: { color: "purple.solid", label: "Traffic" },
                        },
                        {
                            xAxis: { dataKey: "temp", label: "Temperature" },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    )
                `)
            )
        );

        // Reference lines (quadrant dividers)
        const withReferenceLines = $.let(
            ShowcaseCard(
                "Reference Lines",
                "Quadrant dividers at x=50 and y=50",
                Box.Root([
                    Chart.Scatter(
                        [
                            { x: 20, y: 30 },
                            { x: 40, y: 70 },
                            { x: 60, y: 45 },
                            { x: 80, y: 85 },
                            { x: 30, y: 55 },
                            { x: 70, y: 35 },
                        ],
                        ["y"],
                        {
                            xAxis: { dataKey: "x" },
                            yAxis: { dataKey: "y" },
                            grid: { show: true },
                            tooltip: { show: true },
                            referenceLines: [
                                { x: 50, stroke: "gray", strokeDasharray: "3 3" },
                                { y: 50, stroke: "gray", strokeDasharray: "3 3" }
                            ],
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.Scatter(
                        [...data],
                        ["y"],
                        {
                            xAxis: { dataKey: "x" },
                            yAxis: { dataKey: "y" },
                            grid: { show: true },
                            referenceLines: [
                                { x: 50, stroke: "gray", strokeDasharray: "3 3" },
                                { y: 50, stroke: "gray", strokeDasharray: "3 3" }
                            ],
                        }
                    )
                `)
            )
        );

        // Reference area (highlight region)
        const withReferenceArea = $.let(
            ShowcaseCard(
                "Reference Area",
                "Highlight optimal region",
                Box.Root([
                    Chart.Scatter(
                        [
                            { x: 20, y: 30 },
                            { x: 40, y: 70 },
                            { x: 60, y: 45 },
                            { x: 80, y: 85 },
                            { x: 55, y: 65 },
                            { x: 70, y: 75 },
                        ],
                        ["y"],
                        {
                            xAxis: { dataKey: "x" },
                            yAxis: { dataKey: "y" },
                            grid: { show: true },
                            tooltip: { show: true },
                            referenceAreas: [
                                { x1: 50, x2: 80, y1: 60, y2: 90, fill: "green", fillOpacity: 0.15, label: "Optimal", labelPosition: "insideTopRight" }
                            ],
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.Scatter(
                        [...data],
                        ["y"],
                        {
                            xAxis: { dataKey: "x" },
                            yAxis: { dataKey: "y" },
                            grid: { show: true },
                            referenceAreas: [
                                { x1: 50, x2: 80, y1: 60, y2: 90, fill: "green", fillOpacity: 0.15, label: "Optimal", labelPosition: "insideTopRight" }
                            ],
                        }
                    )
                `)
            )
        );

        // Dual Y-Axis (secondary axis on right)
        const dualYAxis = $.let(
            ShowcaseCard(
                "Dual Y-Axis",
                "Price (left) vs Volume (right) correlation",
                Box.Root([
                    Chart.Scatter(
                        [
                            { day: 1, price: 100, volume: 5000 },
                            { day: 2, price: 105, volume: 7500 },
                            { day: 3, price: 102, volume: 4200 },
                            { day: 4, price: 110, volume: 9000 },
                            { day: 5, price: 108, volume: 6800 },
                        ],
                        {
                            price: { color: "teal.solid", label: "Price", yAxisId: "left" },
                            volume: { color: "purple.solid", label: "Volume", yAxisId: "right" },
                        },
                        {
                            xAxis: { dataKey: "day", label: "Day" },
                            yAxis: { label: "Price ($)" },
                            yAxis2: { label: "Volume" },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    ),
                ], { height: "250px", width: "100%" }),
                some(`
                    Chart.Scatter(
                        [
                            { day: 1, price: 100, volume: 5000 },
                            { day: 2, price: 105, volume: 7500 },
                            // ...
                        ],
                        {
                            price: { color: "teal.solid", yAxisId: "left" },
                            volume: { color: "purple.solid", yAxisId: "right" },
                        },
                        {
                            xAxis: { dataKey: "day", label: "Day" },
                            yAxis: { label: "Price ($)" },
                            yAxis2: { label: "Volume" },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    )
                `)
            )
        );

        // Reference dot (highlight outlier)
        const withReferenceDot = $.let(
            ShowcaseCard(
                "Reference Dot",
                "Highlight an outlier point",
                Box.Root([
                    Chart.Scatter(
                        [
                            { x: 20, y: 30 },
                            { x: 40, y: 45 },
                            { x: 60, y: 50 },
                            { x: 80, y: 55 },
                            { x: 50, y: 95 },
                        ],
                        ["y"],
                        {
                            xAxis: { dataKey: "x" },
                            yAxis: { dataKey: "y" },
                            grid: { show: true },
                            tooltip: { show: true },
                            referenceDots: [
                                { x: 50, y: 95, fill: "red", r: 10n, stroke: "darkred", strokeWidth: 2n, label: "Outlier", labelPosition: "top" }
                            ],
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.Scatter(
                        [...data],
                        ["y"],
                        {
                            xAxis: { dataKey: "x" },
                            yAxis: { dataKey: "y" },
                            grid: { show: true },
                            referenceDots: [
                                { x: 50, y: 95, fill: "red", r: 10n, stroke: "darkred", strokeWidth: 2n, label: "Outlier", labelPosition: "top" }
                            ],
                        }
                    )
                `)
            )
        );

        // Pivot data format with pivotColors
        const pivotWithColors = $.let(
            ShowcaseCard(
                "Pivot with Colors",
                "Long-format data with explicit pivotColors mapping",
                Box.Root([
                    Chart.Scatter(
                        [
                            { x: 10, region: "North", value: 30 },
                            { x: 10, region: "South", value: 25 },
                            { x: 20, region: "North", value: 50 },
                            { x: 20, region: "South", value: 40 },
                            { x: 30, region: "North", value: 70 },
                            { x: 30, region: "South", value: 55 },
                        ],
                        {
                            value: {
                                color: "blue.500",
                                pivotColors: new Map([
                                    ["North", "blue.700"],
                                    ["South", "teal.500"],
                                ]),
                            },
                        },
                        {
                            xAxis: { dataKey: "x" },
                            pivotKey: "region",
                            valueKey: "value",
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.Scatter(
                        [
                            { x: 10, region: "North", value: 30 },
                            { x: 10, region: "South", value: 25 },
                            // ... more rows per (x, region)
                        ],
                        {
                            value: {
                                color: "blue.500",
                                pivotColors: new Map([
                                    ["North", "blue.700"],
                                    ["South", "teal.500"],
                                ]),
                            },
                        },
                        {
                            xAxis: { dataKey: "x" },
                            pivotKey: "region",
                            valueKey: "value",
                        }
                    )
                `)
            )
        );

        // Pivot data format without pivotColors (uses default color)
        const pivotWithoutColors = $.let(
            ShowcaseCard(
                "Pivot Default Color",
                "Long-format data using default color for all series",
                Box.Root([
                    Chart.Scatter(
                        [
                            { x: 10, category: "A", value: 30 },
                            { x: 10, category: "B", value: 25 },
                            { x: 10, category: "C", value: 20 },
                            { x: 20, category: "A", value: 50 },
                            { x: 20, category: "B", value: 40 },
                            { x: 20, category: "C", value: 35 },
                        ],
                        {
                            value: { color: "purple.solid" },
                        },
                        {
                            xAxis: { dataKey: "x" },
                            pivotKey: "category",
                            valueKey: "value",
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.Scatter(
                        [
                            { x: 10, category: "A", value: 30 },
                            { x: 10, category: "B", value: 25 },
                            // ... all series use same default color
                        ],
                        {
                            value: { color: "purple.solid" },
                        },
                        {
                            xAxis: { dataKey: "x" },
                            pivotKey: "category",
                            valueKey: "value",
                        }
                    )
                `)
            )
        );

        // ScatterMulti with pivot and pivotColors
        const multiPivotWithColors = $.let(
            ShowcaseCard(
                "Multi Pivot with Colors",
                "Multi-series with pivot within each record",
                Box.Root([
                    Chart.ScatterMulti(
                        {
                            q1: [
                                { x: 10n, region: "North", value: 30n },
                                { x: 10n, region: "South", value: 25n },
                                { x: 20n, region: "North", value: 50n },
                                { x: 20n, region: "South", value: 40n },
                            ],
                            q2: [
                                { x: 10n, region: "North", value: 35n },
                                { x: 10n, region: "South", value: 30n },
                                { x: 20n, region: "North", value: 55n },
                                { x: 20n, region: "South", value: 45n },
                            ],
                        },
                        {
                            xAxis: { dataKey: "x" },
                            valueKey: "value",
                            pivotKey: "region",
                            series: {
                                q1: {
                                    color: "teal.500",
                                    pivotColors: new Map([
                                        ["North", "teal.700"],
                                        ["South", "teal.300"],
                                    ]),
                                },
                                q2: {
                                    color: "blue.500",
                                    pivotColors: new Map([
                                        ["North", "blue.700"],
                                        ["South", "blue.300"],
                                    ]),
                                },
                            },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.ScatterMulti(
                        {
                            q1: [
                                { x: 10n, region: "North", value: 30n },
                                { x: 10n, region: "South", value: 25n },
                                // ...
                            ],
                            q2: [...],
                        },
                        {
                            xAxis: { dataKey: "x" },
                            valueKey: "value",
                            pivotKey: "region",
                            series: {
                                q1: { pivotColors: new Map([...]) },
                                q2: { pivotColors: new Map([...]) },
                            },
                        }
                    )
                `)
            )
        );

        // ScatterMulti with pivot but no pivotColors
        const multiPivotWithoutColors = $.let(
            ShowcaseCard(
                "Multi Pivot Default",
                "Multi-series pivot using default colors",
                Box.Root([
                    Chart.ScatterMulti(
                        {
                            actual: [
                                { x: 10n, type: "Online", value: 50n },
                                { x: 10n, type: "Store", value: 30n },
                                { x: 20n, type: "Online", value: 60n },
                                { x: 20n, type: "Store", value: 40n },
                            ],
                            forecast: [
                                { x: 10n, type: "Online", value: 55n },
                                { x: 10n, type: "Store", value: 35n },
                                { x: 20n, type: "Online", value: 65n },
                                { x: 20n, type: "Store", value: 45n },
                            ],
                        },
                        {
                            xAxis: { dataKey: "x" },
                            valueKey: "value",
                            pivotKey: "type",
                            series: {
                                actual: { color: "green.solid" },
                                forecast: { color: "orange.solid" },
                            },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.ScatterMulti(
                        {
                            actual: [
                                { x: 10n, type: "Online", value: 50n },
                                // ...
                            ],
                            forecast: [...],
                        },
                        {
                            xAxis: { dataKey: "x" },
                            valueKey: "value",
                            pivotKey: "type",
                            series: {
                                actual: { color: "green.solid" },
                                forecast: { color: "orange.solid" },
                            },
                        }
                    )
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
                Grid.Item(withLegend),
                Grid.Item(withReferenceLines),
                Grid.Item(withReferenceArea),
                Grid.Item(withReferenceDot),
                Grid.Item(dualYAxis),
                Grid.Item(pivotWithColors),
                Grid.Item(pivotWithoutColors),
                Grid.Item(multiPivotWithColors),
                Grid.Item(multiPivotWithoutColors),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
