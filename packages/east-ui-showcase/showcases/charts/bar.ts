import { East, some } from "@elaraai/east";
import { Chart, UIComponentType, Grid, Box } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Bar Chart showcase - demonstrates bar chart variants and configurations.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic bar chart
        const basic = $.let(
            ShowcaseCard(
                "Basic Bar Chart",
                "Vertical bars showing allocation",
                Box.Root([
                    Chart.Bar(
                        [
                            { type: "Stock", allocation: 60 },
                            { type: "Crypto", allocation: 45 },
                            { type: "ETF", allocation: 12 },
                            { type: "Cash", allocation: 4 },
                        ],
                        { allocation: { color: "teal.solid" } },
                        {
                            xAxis: { dataKey: "type" },
                            grid: { show: true },
                        }
                    ),
                ], { height: "200px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Bar(
                            [
                                { type: "Stock", allocation: 60 },
                                { type: "Crypto", allocation: 45 },
                                { type: "ETF", allocation: 12 },
                                { type: "Cash", allocation: 4 },
                            ],
                            { allocation: { color: "teal.solid" } },
                            {
                                xAxis: { dataKey: "type" },
                                grid: { show: true },
                            }
                        ),
                    ], { height: "200px", width: "100%" })
                `)
            )
        );

        // Stacked bar chart
        const stacked = $.let(
            ShowcaseCard(
                "Stacked Bar Chart",
                "Multiple series stacked together",
                Box.Root([
                    Chart.Bar(
                        [
                            { month: "January", windows: 186, mac: 80, linux: 120 },
                            { month: "February", windows: 165, mac: 95, linux: 110 },
                            { month: "March", windows: 190, mac: 87, linux: 125 },
                        ],
                        {
                            windows: { color: "teal.solid", stackId: "a" },
                            mac: { color: "purple.solid", stackId: "a" },
                            linux: { color: "blue.solid", stackId: "a" },
                        },
                        {
                            xAxis: { dataKey: "month" },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Bar(
                            [
                                { month: "January", windows: 186, mac: 80, linux: 120 },
                                { month: "February", windows: 165, mac: 95, linux: 110 },
                                { month: "March", windows: 190, mac: 87, linux: 125 },
                            ],
                            {
                                windows: { color: "teal.solid", stackId: "a" },
                                mac: { color: "purple.solid", stackId: "a" },
                                linux: { color: "blue.solid", stackId: "a" },
                            },
                            {
                                xAxis: { dataKey: "month" },
                                grid: { show: true },
                                tooltip: { show: true },
                                legend: { show: true },
                            }
                        ),
                    ], { height: "220px", width: "100%" })
                `)
            )
        );

        // 100% stacked bar chart
        const percentStacked = $.let(
            ShowcaseCard(
                "100% Stacked Bar",
                "Proportional stacked chart",
                Box.Root([
                    Chart.Bar(
                        [
                            { month: "January", windows: 186, mac: 80, linux: 120 },
                            { month: "February", windows: 165, mac: 95, linux: 110 },
                        ],
                        {
                            windows: { color: "teal.solid", stackId: "a" },
                            mac: { color: "purple.solid", stackId: "a" },
                            linux: { color: "blue.solid", stackId: "a" },
                        },
                        {
                            xAxis: { dataKey: "month" },
                            yAxis: { tickFormat: "percent" },
                            stackOffset: "expand",
                            legend: { show: true },
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Bar(
                            [
                                { month: "January", windows: 186, mac: 80, linux: 120 },
                                { month: "February", windows: 165, mac: 95, linux: 110 },
                            ],
                            {
                                windows: { color: "teal.solid", stackId: "a" },
                                mac: { color: "purple.solid", stackId: "a" },
                                linux: { color: "blue.solid", stackId: "a" },
                            },
                            {
                                xAxis: { dataKey: "month" },
                                yAxis: { tickFormat: "percent" },
                                stackOffset: "expand",
                                legend: { show: true },
                            }
                        ),
                    ], { height: "220px", width: "100%" })
                `)
            )
        );

        // Horizontal bar chart
        const horizontal = $.let(
            ShowcaseCard(
                "Horizontal Bar Chart",
                "Bars oriented horizontally",
                Box.Root([
                    Chart.Bar(
                        [
                            { month: "January", windows: 186, mac: 80 },
                            { month: "February", windows: 165, mac: 95 },
                            { month: "March", windows: 190, mac: 87 },
                        ],
                        {
                            windows: { color: "teal.solid", stackId: "a" },
                            mac: { color: "purple.solid", stackId: "a" },
                        },
                        {
                            layout: "vertical",
                            yAxis: { dataKey: "month" },
                            legend: { show: true },
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Bar(
                            [
                                { month: "January", windows: 186, mac: 80 },
                                { month: "February", windows: 165, mac: 95 },
                                { month: "March", windows: 190, mac: 87 },
                            ],
                            {
                                windows: { color: "teal.solid", stackId: "a" },
                                mac: { color: "purple.solid", stackId: "a" },
                            },
                            {
                                layout: "vertical",
                                yAxis: { dataKey: "month" },
                                legend: { show: true },
                            }
                        ),
                    ], { height: "220px", width: "100%" })
                `)
            )
        );

        // Grouped bar chart
        const grouped = $.let(
            ShowcaseCard(
                "Grouped Bar Chart",
                "Multiple bars per category",
                Box.Root([
                    Chart.Bar(
                        [
                            { type: "mobile", poor: 40, fair: 100, good: 200, excellent: 70 },
                            { type: "marketing", poor: 15, fair: 40, good: 120, excellent: 90 },
                        ],
                        {
                            poor: { color: "red.solid" },
                            fair: { color: "orange.solid" },
                            good: { color: "yellow.solid" },
                            excellent: { color: "green.solid" },
                        },
                        {
                            xAxis: { dataKey: "type" },
                            legend: { show: true },
                            tooltip: { show: true },
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Bar(
                            [
                                { type: "mobile", poor: 40, fair: 100, good: 200, excellent: 70 },
                                { type: "marketing", poor: 15, fair: 40, good: 120, excellent: 90 },
                            ],
                            {
                                poor: { color: "red.solid" },
                                fair: { color: "orange.solid" },
                                good: { color: "yellow.solid" },
                                excellent: { color: "green.solid" },
                            },
                            {
                                xAxis: { dataKey: "type" },
                                legend: { show: true },
                                tooltip: { show: true },
                            }
                        ),
                    ], { height: "220px", width: "100%" })
                `)
            )
        );

        // Currency formatted
        const currency = $.let(
            ShowcaseCard(
                "Currency Formatting",
                "Y-axis with currency format",
                Box.Root([
                    Chart.Bar(
                        [
                            { month: "June", sales: 63000 },
                            { month: "July", sales: 72000 },
                            { month: "August", sales: 58000 },
                            { month: "September", sales: 81000 },
                        ],
                        { sales: { color: "teal.solid" } },
                        {
                            xAxis: { dataKey: "month" },
                            yAxis: { tickFormat: Chart.TickFormat.Currency({ currency: "USD", compact: "short" }) },
                            grid: { show: true },
                        }
                    ),
                ], { height: "200px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Bar(
                            [
                                { month: "June", sales: 63000 },
                                { month: "July", sales: 72000 },
                                { month: "August", sales: 58000 },
                                { month: "September", sales: 81000 },
                            ],
                            { sales: { color: "teal.solid" } },
                            {
                                xAxis: { dataKey: "month" },
                                yAxis: { tickFormat: Chart.TickFormat.Currency({ currency: "USD", compact: "short" }) },
                                grid: { show: true },
                            }
                        ),
                    ], { height: "200px", width: "100%" })
                `)
            )
        );

        // With brush for data zooming
        const withBrush = $.let(
            ShowcaseCard(
                "With Brush",
                "Drag to zoom/pan across data range",
                Box.Root([
                    Chart.Bar(
                        [
                            { month: "Jan", sales: 186 },
                            { month: "Feb", sales: 305 },
                            { month: "Mar", sales: 237 },
                            { month: "Apr", sales: 273 },
                            { month: "May", sales: 209 },
                            { month: "Jun", sales: 314 },
                            { month: "Jul", sales: 256 },
                            { month: "Aug", sales: 289 },
                            { month: "Sep", sales: 321 },
                            { month: "Oct", sales: 278 },
                            { month: "Nov", sales: 342 },
                            { month: "Dec", sales: 398 },
                        ],
                        { sales: { color: "teal.solid" } },
                        {
                            xAxis: { dataKey: "month" },
                            grid: { show: true },
                            tooltip: { show: true },
                            brush: { dataKey: "month", height: 30n },
                        }
                    ),
                ], { height: "280px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Bar(
                            [...data],
                            { sales: { color: "teal.solid" } },
                            {
                                xAxis: { dataKey: "month" },
                                grid: { show: true },
                                brush: { dataKey: "month", height: 30n },
                            }
                        ),
                    ], { height: "280px", width: "100%" })
                `)
            )
        );

        // Multi-series sparse data (record form)
        const sparseMultiSeries = $.let(
            ShowcaseCard(
                "Sparse Multi-Series",
                "Separate arrays for each series (avoids null values)",
                Box.Root([
                    Chart.BarMulti(
                        {
                            sales: [
                                { month: "Jan", value: 186n },
                                { month: "Feb", value: 305n },
                                { month: "Mar", value: 237n },
                                { month: "Apr", value: 273n },
                            ],
                            returns: [
                                { month: "Jan", value: 20n },
                                { month: "Mar", value: 35n },
                                { month: "Apr", value: 28n },
                            ],
                        },
                        {
                            xAxis: { dataKey: "month" },
                            valueKey: "value",
                            series: {
                                sales: { color: "teal.solid" },
                                returns: { color: "red.solid" },
                            },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.BarMulti(
                            {
                                sales: [
                                    { month: "Jan", value: 186n },
                                    { month: "Feb", value: 305n },
                                    { month: "Mar", value: 237n },
                                    { month: "Apr", value: 273n },
                                ],
                                returns: [
                                    { month: "Jan", value: 20n },
                                    // Feb is missing - sparse data!
                                    { month: "Mar", value: 35n },
                                    { month: "Apr", value: 28n },
                                ],
                            },
                            {
                                xAxis: { dataKey: "month" },
                                valueKey: "value",
                                series: {
                                    sales: { color: "teal.solid" },
                                    returns: { color: "red.solid" },
                                },
                                grid: { show: true },
                                tooltip: { show: true },
                                legend: { show: true },
                            }
                        ),
                    ], { height: "220px", width: "100%" })
                `)
            )
        );

        // With brush and axis labels
        const withBrushAndLabels = $.let(
            ShowcaseCard(
                "Brush with Axis Labels",
                "Zoomable bar chart with labeled axes",
                Box.Root([
                    Chart.Bar(
                        [
                            { month: "Jan", sales: 186 },
                            { month: "Feb", sales: 305 },
                            { month: "Mar", sales: 237 },
                            { month: "Apr", sales: 273 },
                            { month: "May", sales: 209 },
                            { month: "Jun", sales: 314 },
                            { month: "Jul", sales: 256 },
                            { month: "Aug", sales: 289 },
                            { month: "Sep", sales: 321 },
                            { month: "Oct", sales: 278 },
                            { month: "Nov", sales: 342 },
                            { month: "Dec", sales: 398 },
                        ],
                        { sales: { color: "teal.solid" } },
                        {
                            xAxis: { dataKey: "month" },
                            yAxis: { label: "Monthly Sales ($)" },
                            grid: { show: true },
                            tooltip: { show: true },
                            brush: { dataKey: "month", height: 30n },
                        }
                    ),
                ], { height: "300px", width: "100%" }),
                some(`
                    Chart.Bar(
                        [...data],
                        { sales: { color: "teal.solid" } },
                        {
                            xAxis: { dataKey: "month" },
                            yAxis: { label: "Monthly Sales ($)" },
                            grid: { show: true },
                            tooltip: { show: true },
                            brush: { dataKey: "month", height: 30n },
                        }
                    )
                `)
            )
        );

        // Reference line (target line)
        const withReferenceLine = $.let(
            ShowcaseCard(
                "Reference Line",
                "Horizontal target line at y=200",
                Box.Root([
                    Chart.Bar(
                        [
                            { month: "Jan", sales: 186 },
                            { month: "Feb", sales: 305 },
                            { month: "Mar", sales: 237 },
                            { month: "Apr", sales: 273 },
                            { month: "May", sales: 209 },
                        ],
                        { sales: { color: "teal.solid" } },
                        {
                            xAxis: { dataKey: "month" },
                            grid: { show: true },
                            tooltip: { show: true },
                            referenceLines: [
                                { y: 250, stroke: "red", strokeDasharray: "5 5", label: "Target", labelPosition: "insideBottomRight" }
                            ],
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.Bar(
                        [...data],
                        { sales: { color: "teal.solid" } },
                        {
                            xAxis: { dataKey: "month" },
                            grid: { show: true },
                            referenceLines: [
                                { y: 250, stroke: "red", strokeDasharray: "5 5", label: "Target", labelPosition: "insideBottomRight" }
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
                "Sales volume (left) vs Profit margin % (right)",
                Box.Root([
                    Chart.Bar(
                        [
                            { month: "Jan", sales: 186, margin: 15 },
                            { month: "Feb", sales: 305, margin: 22 },
                            { month: "Mar", sales: 237, margin: 18 },
                            { month: "Apr", sales: 273, margin: 25 },
                            { month: "May", sales: 350, margin: 30 },
                        ],
                        {
                            sales: { color: "teal.solid", yAxisId: "left" },
                            margin: { color: "purple.solid", yAxisId: "right" },
                        },
                        {
                            xAxis: { dataKey: "month" },
                            yAxis: { label: "Sales ($K)" },
                            yAxis2: { label: "Margin (%)" },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    ),
                ], { height: "250px", width: "100%" }),
                some(`
                    Chart.Bar(
                        [
                            { month: "Jan", sales: 186, margin: 15 },
                            { month: "Feb", sales: 305, margin: 22 },
                            // ...
                        ],
                        {
                            sales: { color: "teal.solid", yAxisId: "left" },
                            margin: { color: "purple.solid", yAxisId: "right" },
                        },
                        {
                            xAxis: { dataKey: "month" },
                            yAxis: { label: "Sales ($K)" },
                            yAxis2: { label: "Margin (%)" },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    )
                `)
            )
        );

        // Reference area (target zone)
        const withReferenceArea = $.let(
            ShowcaseCard(
                "Reference Area",
                "Highlight target zone between y=200 and y=300",
                Box.Root([
                    Chart.Bar(
                        [
                            { month: "Jan", sales: 186 },
                            { month: "Feb", sales: 305 },
                            { month: "Mar", sales: 237 },
                            { month: "Apr", sales: 273 },
                            { month: "May", sales: 209 },
                        ],
                        { sales: { color: "teal.solid" } },
                        {
                            xAxis: { dataKey: "month" },
                            grid: { show: true },
                            tooltip: { show: true },
                            referenceAreas: [
                                { y1: 200, y2: 300, fill: "green", fillOpacity: 0.15, label: "Target Zone", labelPosition: "insideTopRight" }
                            ],
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.Bar(
                        [...data],
                        { sales: { color: "teal.solid" } },
                        {
                            xAxis: { dataKey: "month" },
                            grid: { show: true },
                            referenceAreas: [
                                { y1: 200, y2: 300, fill: "green", fillOpacity: 0.15, label: "Target Zone", labelPosition: "insideTopRight" }
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
                    Chart.Bar(
                        [
                            { month: "Jan", region: "North", sales: 100 },
                            { month: "Jan", region: "South", sales: 80 },
                            { month: "Feb", region: "North", sales: 120 },
                            { month: "Feb", region: "South", sales: 90 },
                            { month: "Mar", region: "North", sales: 140 },
                            { month: "Mar", region: "South", sales: 110 },
                        ],
                        {
                            sales: {
                                color: "blue.500",
                                pivotColors: new Map([
                                    ["North", "blue.700"],
                                    ["South", "teal.500"],
                                ]),
                            },
                        },
                        {
                            xAxis: { dataKey: "month" },
                            pivotKey: "region",
                            valueKey: "sales",
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.Bar(
                        [
                            { month: "Jan", region: "North", sales: 100 },
                            { month: "Jan", region: "South", sales: 80 },
                            // ... more rows per (month, region)
                        ],
                        {
                            sales: {
                                color: "blue.500",
                                pivotColors: new Map([
                                    ["North", "blue.700"],
                                    ["South", "teal.500"],
                                ]),
                            },
                        },
                        {
                            xAxis: { dataKey: "month" },
                            pivotKey: "region",
                            valueKey: "sales",
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
                    Chart.Bar(
                        [
                            { month: "Jan", category: "A", value: 100 },
                            { month: "Jan", category: "B", value: 80 },
                            { month: "Jan", category: "C", value: 60 },
                            { month: "Feb", category: "A", value: 120 },
                            { month: "Feb", category: "B", value: 90 },
                            { month: "Feb", category: "C", value: 70 },
                        ],
                        {
                            value: { },
                        },
                        {
                            xAxis: { dataKey: "month" },
                            pivotKey: "category",
                            valueKey: "value",
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.Bar(
                        [
                            { month: "Jan", category: "A", value: 100 },
                            { month: "Jan", category: "B", value: 80 },
                            // ... all series use same default color
                        ],
                        {
                            value: { },
                        },
                        {
                            xAxis: { dataKey: "month" },
                            pivotKey: "category",
                            valueKey: "value",
                        }
                    )
                `)
            )
        );

        // BarMulti with pivot and pivotColors
        const multiPivotWithColors = $.let(
            ShowcaseCard(
                "Multi Pivot with Colors",
                "Multi-series with pivot within each record",
                Box.Root([
                    Chart.BarMulti(
                        {
                            q1: [
                                { month: "Jan", region: "North", value: 100n },
                                { month: "Jan", region: "South", value: 80n },
                                { month: "Feb", region: "North", value: 120n },
                                { month: "Feb", region: "South", value: 95n },
                            ],
                            q2: [
                                { month: "Jan", region: "North", value: 110n },
                                { month: "Jan", region: "South", value: 85n },
                                { month: "Feb", region: "North", value: 130n },
                                { month: "Feb", region: "South", value: 100n },
                            ],
                        },
                        {
                            xAxis: { dataKey: "month" },
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
                    Chart.BarMulti(
                        {
                            q1: [
                                { month: "Jan", region: "North", value: 100n },
                                { month: "Jan", region: "South", value: 80n },
                                // ...
                            ],
                            q2: [...],
                        },
                        {
                            xAxis: { dataKey: "month" },
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

        // BarMulti with pivot but no pivotColors
        const multiPivotWithoutColors = $.let(
            ShowcaseCard(
                "Multi Pivot Default",
                "Multi-series pivot using default colors",
                Box.Root([
                    Chart.BarMulti(
                        {
                            actual: [
                                { month: "Jan", type: "Online", value: 50n },
                                { month: "Jan", type: "Store", value: 30n },
                                { month: "Feb", type: "Online", value: 60n },
                                { month: "Feb", type: "Store", value: 40n },
                            ],
                            forecast: [
                                { month: "Jan", type: "Online", value: 55n },
                                { month: "Jan", type: "Store", value: 35n },
                                { month: "Feb", type: "Online", value: 65n },
                                { month: "Feb", type: "Store", value: 45n },
                            ],
                        },
                        {
                            xAxis: { dataKey: "month" },
                            valueKey: "value",
                            pivotKey: "type",
                            series: {
                                actual: {  },
                                forecast: {  },
                            },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.BarMulti(
                        {
                            actual: [
                                { month: "Jan", type: "Online", value: 50n },
                                // ...
                            ],
                            forecast: [...],
                        },
                        {
                            xAxis: { dataKey: "month" },
                            valueKey: "value",
                            pivotKey: "type",
                            series: {
                                actual: {  },
                                forecast: {  },
                            },
                        }
                    )
                `)
            )
        );

        // Axis formatting with date and currency
        const axisFormatting = $.let(
            ShowcaseCard(
                "Axis Formatting",
                "Custom tick formats for date (x-axis) and currency (y-axis)",
                Box.Root([
                    Chart.Bar(
                        [
                            { date: new Date("2024-01-15"), revenue: 12500 },
                            { date: new Date("2024-02-15"), revenue: 15800 },
                            { date: new Date("2024-03-15"), revenue: 18200 },
                            { date: new Date("2024-04-15"), revenue: 16500 },
                            { date: new Date("2024-05-15"), revenue: 21000 },
                            { date: new Date("2024-06-15"), revenue: 24300 },
                        ],
                        { revenue: { color: "teal.solid" } },
                        {
                            xAxis: {
                                dataKey: "date",
                                tickFormat: Chart.TickFormat.Date({ format: "DD MMM" }),
                            },
                            yAxis: {
                                label: "Revenue",
                                tickFormat: Chart.TickFormat.Currency({ currency: "USD", compact: "short" }),
                            },
                            grid: { show: true },
                            tooltip: { show: true },
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.Bar(
                        [
                            { date: new Date("2024-01-15"), revenue: 12500 },
                            { date: new Date("2024-02-15"), revenue: 15800 },
                            { date: new Date("2024-03-15"), revenue: 18200 },
                            { date: new Date("2024-04-15"), revenue: 16500 },
                            { date: new Date("2024-05-15"), revenue: 21000 },
                            { date: new Date("2024-06-15"), revenue: 24300 },
                        ],
                        { revenue: { color: "teal.solid" } },
                        {
                            xAxis: {
                                dataKey: "date",
                                tickFormat: Chart.TickFormat.Date({ format: "DD MMM" }),
                            },
                            yAxis: {
                                label: "Revenue",
                                tickFormat: Chart.TickFormat.Currency({ currency: "USD", compact: "short" }),
                            },
                            grid: { show: true },
                            tooltip: { show: true },
                        }
                    )
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(stacked),
                Grid.Item(percentStacked),
                Grid.Item(horizontal),
                Grid.Item(grouped),
                Grid.Item(currency),
                Grid.Item(withBrush),
                Grid.Item(sparseMultiSeries),
                Grid.Item(withBrushAndLabels),
                Grid.Item(withReferenceLine),
                Grid.Item(withReferenceArea),
                Grid.Item(dualYAxis),
                Grid.Item(pivotWithColors),
                Grid.Item(pivotWithoutColors),
                Grid.Item(multiPivotWithColors),
                Grid.Item(multiPivotWithoutColors),
                Grid.Item(axisFormatting),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
