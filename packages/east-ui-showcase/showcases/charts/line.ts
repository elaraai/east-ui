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
                            grid: { show: true },
                            tooltip: { show: true },
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
                                grid: { show: true },
                                tooltip: { show: true },
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
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
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
                                grid: { show: true },
                                tooltip: { show: true },
                                legend: { show: true },
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
                            grid: { show: true },
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
                                grid: { show: true },
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
                            grid: { show: true },
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
                                grid: { show: true },
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
                            grid: { show: true },
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
                                grid: { show: true },
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
                            grid: { show: true },
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
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
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
                                grid: { show: true },
                                tooltip: { show: true },
                                legend: { show: true },
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
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
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
                                grid: { show: true },
                                tooltip: { show: true },
                                legend: { show: true },
                            }
                        ),
                    ], { height: "220px", width: "100%" })
                `)
            )
        );

        // With brush for data zooming
        const withBrush = $.let(
            ShowcaseCard(
                "With Brush",
                "Drag to zoom/pan across data range",
                Box.Root([
                    Chart.Line(
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
                        Chart.Line(
                            [
                                { month: "Jan", sales: 186 },
                                { month: "Feb", sales: 305 },
                                // ... more data points
                            ],
                            { sales: { color: "teal.solid" } },
                            {
                                xAxis: { dataKey: "month" },
                                grid: { show: true },
                                tooltip: { show: true },
                                brush: { dataKey: "month", height: 30n },
                            }
                        ),
                    ], { height: "280px", width: "100%" })
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
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
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
                "Zoomable line chart with labeled axes",
                Box.Root([
                    Chart.Line(
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
                    Chart.Line(
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
                    Chart.Line(
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
                                { y: 200, stroke: "red", strokeDasharray: "5 5", label: "Target", labelPosition: "insideBottomRight" }
                            ],
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.Line(
                        [...data],
                        { sales: { color: "teal.solid" } },
                        {
                            xAxis: { dataKey: "month" },
                            grid: { show: true },
                            referenceLines: [
                                { y: 200, stroke: "red", strokeDasharray: "5 5", label: "Target", labelPosition: "insideBottomRight" }
                            ],
                        }
                    )
                `)
            )
        );

        // Reference area (target zone)
        const withReferenceArea = $.let(
            ShowcaseCard(
                "Reference Area",
                "Highlight target zone between y=180 and y=280",
                Box.Root([
                    Chart.Line(
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
                                { y1: 180, y2: 280, fill: "green", fillOpacity: 0.15, label: "Target Zone", labelPosition: "insideTopRight" }
                            ],
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.Line(
                        [...data],
                        { sales: { color: "teal.solid" } },
                        {
                            xAxis: { dataKey: "month" },
                            grid: { show: true },
                            referenceAreas: [
                                { y1: 180, y2: 280, fill: "green", fillOpacity: 0.15, label: "Target Zone", labelPosition: "insideTopRight" }
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
                "Revenue (left axis) vs Growth Rate % (right axis)",
                Box.Root([
                    Chart.Line(
                        [
                            { month: "Jan", revenue: 186, growthRate: 5 },
                            { month: "Feb", revenue: 305, growthRate: 12 },
                            { month: "Mar", revenue: 237, growthRate: -8 },
                            { month: "Apr", revenue: 273, growthRate: 15 },
                            { month: "May", revenue: 350, growthRate: 28 },
                        ],
                        {
                            revenue: { color: "teal.solid", yAxisId: "left" },
                            growthRate: { color: "purple.solid", yAxisId: "right", strokeDasharray: "5 5" },
                        },
                        {
                            xAxis: { dataKey: "month" },
                            yAxis: { label: "Revenue ($)" },
                            yAxis2: { label: "Growth (%)" },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    ),
                ], { height: "250px", width: "100%" }),
                some(`
                    Chart.Line(
                        [
                            { month: "Jan", revenue: 186, growthRate: 5 },
                            { month: "Feb", revenue: 305, growthRate: 12 },
                            // ...
                        ],
                        {
                            revenue: { color: "teal.solid", yAxisId: "left" },
                            growthRate: { color: "purple.solid", yAxisId: "right", strokeDasharray: "5 5" },
                        },
                        {
                            xAxis: { dataKey: "month" },
                            yAxis: { label: "Revenue ($)" },
                            yAxis2: { label: "Growth (%)" },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    )
                `)
            )
        );

        // Reference dot (highlight point)
        const withReferenceDot = $.let(
            ShowcaseCard(
                "Reference Dot",
                "Highlight max value point",
                Box.Root([
                    Chart.Line(
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
                            showDots: false,
                            referenceDots: [
                                { x: "Feb", y: 305, fill: "red", r: 8n, label: "Peak", labelPosition: "top" }
                            ],
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.Line(
                        [...data],
                        { sales: { color: "teal.solid" } },
                        {
                            xAxis: { dataKey: "month" },
                            grid: { show: true },
                            showDots: false,
                            referenceDots: [
                                { x: "Feb", y: 305, fill: "red", r: 8n, label: "Peak", labelPosition: "top" }
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
                    Chart.Line(
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
                    Chart.Line(
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
                    Chart.Line(
                        [
                            { month: "Jan", category: "A", value: 100 },
                            { month: "Jan", category: "B", value: 80 },
                            { month: "Jan", category: "C", value: 60 },
                            { month: "Feb", category: "A", value: 120 },
                            { month: "Feb", category: "B", value: 90 },
                            { month: "Feb", category: "C", value: 70 },
                        ],
                        {
                            value: { color: "purple.solid" },
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
                    Chart.Line(
                        [
                            { month: "Jan", category: "A", value: 100 },
                            { month: "Jan", category: "B", value: 80 },
                            // ... all series use same default color
                        ],
                        {
                            value: { color: "purple.solid" },
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

        // LineMulti with pivot and pivotColors
        const multiPivotWithColors = $.let(
            ShowcaseCard(
                "Multi Pivot with Colors",
                "Multi-series with pivot within each record",
                Box.Root([
                    Chart.LineMulti(
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
                    Chart.LineMulti(
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

        // LineMulti with pivot but no pivotColors
        const multiPivotWithoutColors = $.let(
            ShowcaseCard(
                "Multi Pivot Default",
                "Multi-series pivot using default colors",
                Box.Root([
                    Chart.LineMulti(
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
                    Chart.LineMulti(
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
                Grid.Item(multiSeries),
                Grid.Item(natural),
                Grid.Item(step),
                Grid.Item(noDots),
                Grid.Item(thickLine),
                Grid.Item(sparseMultiSeries),
                Grid.Item(perSeriesStyling),
                Grid.Item(dotsOnly),
                Grid.Item(withBrush),
                Grid.Item(withBrushAndLabels),
                Grid.Item(withReferenceLine),
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
