import { East, some } from "@elaraai/east";
import { Chart, UIComponentType, Grid, Box } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Area Chart showcase - demonstrates area chart variants and configurations.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic area chart
        const basic = $.let(
            ShowcaseCard(
                "Basic Area Chart",
                "Single series area chart",
                Box.Root([
                    Chart.Area(
                        [
                            { month: "Jan", revenue: 186 },
                            { month: "Feb", revenue: 305 },
                            { month: "Mar", revenue: 237 },
                            { month: "Apr", revenue: 273 },
                            { month: "May", revenue: 209 },
                        ],
                        {
                            revenue: { color: "teal.solid" },
                        },
                        {
                            xAxis: { dataKey: "month" },
                            grid: { show: true },
                        }
                    ),
                ], { height: "200px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Area(
                            [
                                { month: "Jan", revenue: 186 },
                                { month: "Feb", revenue: 305 },
                                { month: "Mar", revenue: 237 },
                                { month: "Apr", revenue: 273 },
                                { month: "May", revenue: 209 },
                            ],
                            {
                                revenue: { color: "teal.solid" },
                            },
                            {
                                xAxis: { dataKey: "month" },
                                grid: { show: true },
                            }
                        ),
                    ], { height: "200px", width: "100%" })
                `)
            )
        );

        // Multi-series area chart
        const multiSeries = $.let(
            ShowcaseCard(
                "Multi-Series Area",
                "Multiple data series overlaid",
                Box.Root([
                    Chart.Area(
                        [
                            { month: "Jan", windows: 186, mac: 80, linux: 120 },
                            { month: "Feb", windows: 165, mac: 95, linux: 110 },
                            { month: "Mar", windows: 190, mac: 87, linux: 125 },
                            { month: "Apr", windows: 175, mac: 92, linux: 115 },
                        ],
                        {
                            windows: { color: "teal.solid" },
                            mac: { color: "purple.solid" },
                            linux: { color: "blue.solid" },
                        },
                        {
                            xAxis: { dataKey: "month" },
                            legend: { show: true },
                            tooltip: { show: true },
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Area(
                            [
                                { month: "Jan", windows: 186, mac: 80, linux: 120 },
                                { month: "Feb", windows: 165, mac: 95, linux: 110 },
                                { month: "Mar", windows: 190, mac: 87, linux: 125 },
                                { month: "Apr", windows: 175, mac: 92, linux: 115 },
                            ],
                            {
                                windows: { color: "teal.solid" },
                                mac: { color: "purple.solid" },
                                linux: { color: "blue.solid" },
                            },
                            {
                                xAxis: { dataKey: "month" },
                                legend: { show: true },
                                tooltip: { show: true },
                            }
                        ),
                    ], { height: "220px", width: "100%" })
                `)
            )
        );

        // Stacked area chart
        const stacked = $.let(
            ShowcaseCard(
                "Stacked Area Chart",
                "Areas stacked on top of each other",
                Box.Root([
                    Chart.Area(
                        [
                            { month: "Jan", windows: 186, mac: 80, linux: 120 },
                            { month: "Feb", windows: 165, mac: 95, linux: 110 },
                            { month: "Mar", windows: 190, mac: 87, linux: 125 },
                        ],
                        {
                            windows: { color: "teal.solid", stackId: "a" },
                            mac: { color: "purple.solid", stackId: "a" },
                            linux: { color: "blue.solid", stackId: "a" },
                        },
                        {
                            xAxis: { dataKey: "month" },
                            stacked: true,
                            legend: { show: true },
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Area(
                            [
                                { month: "Jan", windows: 186, mac: 80, linux: 120 },
                                { month: "Feb", windows: 165, mac: 95, linux: 110 },
                                { month: "Mar", windows: 190, mac: 87, linux: 125 },
                            ],
                            {
                                windows: { color: "teal.solid", stackId: "a" },
                                mac: { color: "purple.solid", stackId: "a" },
                                linux: { color: "blue.solid", stackId: "a" },
                            },
                            {
                                xAxis: { dataKey: "month" },
                                stacked: true,
                                legend: { show: true },
                            }
                        ),
                    ], { height: "220px", width: "100%" })
                `)
            )
        );

        // 100% stacked area
        const percentStacked = $.let(
            ShowcaseCard(
                "100% Stacked Area",
                "Proportional stacked area chart",
                Box.Root([
                    Chart.Area(
                        [
                            { month: "Jan", windows: 186, mac: 80, linux: 120 },
                            { month: "Feb", windows: 165, mac: 95, linux: 110 },
                            { month: "Mar", windows: 190, mac: 87, linux: 125 },
                        ],
                        {
                            windows: { color: "teal.solid", stackId: "a" },
                            mac: { color: "purple.solid", stackId: "a" },
                            linux: { color: "blue.solid", stackId: "a" },
                        },
                        {
                            xAxis: { dataKey: "month" },
                            yAxis: { tickFormat: "percent" },
                            stacked: true,
                            stackOffset: "expand",
                            legend: { show: true },
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Area(
                            [
                                { month: "Jan", windows: 186, mac: 80, linux: 120 },
                                { month: "Feb", windows: 165, mac: 95, linux: 110 },
                                { month: "Mar", windows: 190, mac: 87, linux: 125 },
                            ],
                            {
                                windows: { color: "teal.solid", stackId: "a" },
                                mac: { color: "purple.solid", stackId: "a" },
                                linux: { color: "blue.solid", stackId: "a" },
                            },
                            {
                                xAxis: { dataKey: "month" },
                                yAxis: { tickFormat: "percent" },
                                stacked: true,
                                stackOffset: "expand",
                                legend: { show: true },
                            }
                        ),
                    ], { height: "220px", width: "100%" })
                `)
            )
        );

        // Natural curve
        const curved = $.let(
            ShowcaseCard(
                "Natural Curve",
                "Smooth natural interpolation",
                Box.Root([
                    Chart.Area(
                        [
                            { month: "Jan", revenue: 180 },
                            { month: "Feb", revenue: 220 },
                            { month: "Mar", revenue: 190 },
                            { month: "Apr", revenue: 260 },
                            { month: "May", revenue: 230 },
                        ],
                        {
                            revenue: { color: "green.solid" },
                        },
                        {
                            xAxis: { dataKey: "month" },
                            curveType: "natural",
                            fillOpacity: 0.3,
                            grid: { show: true },
                        }
                    ),
                ], { height: "200px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Area(
                            [
                                { month: "Jan", revenue: 180 },
                                { month: "Feb", revenue: 220 },
                                { month: "Mar", revenue: 190 },
                                { month: "Apr", revenue: 260 },
                                { month: "May", revenue: 230 },
                            ],
                            {
                                revenue: { color: "green.solid" },
                            },
                            {
                                xAxis: { dataKey: "month" },
                                curveType: "natural",
                                fillOpacity: 0.3,
                                grid: { show: true },
                            }
                        ),
                    ], { height: "200px", width: "100%" })
                `)
            )
        );

        // With custom fill opacity
        const opacity = $.let(
            ShowcaseCard(
                "Custom Fill Opacity",
                "Lower opacity for lighter fill",
                Box.Root([
                    Chart.Area(
                        [
                            { month: "Jan", sales: 100 },
                            { month: "Feb", sales: 150 },
                            { month: "Mar", sales: 120 },
                            { month: "Apr", sales: 180 },
                        ],
                        {
                            sales: { color: "blue.solid" },
                        },
                        {
                            xAxis: { dataKey: "month" },
                            fillOpacity: 0.2,
                            grid: { show: true },
                            tooltip: { show: true },
                        }
                    ),
                ], { height: "200px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Area(
                            [
                                { month: "Jan", sales: 100 },
                                { month: "Feb", sales: 150 },
                                { month: "Mar", sales: 120 },
                                { month: "Apr", sales: 180 },
                            ],
                            {
                                sales: { color: "blue.solid" },
                            },
                            {
                                xAxis: { dataKey: "month" },
                                fillOpacity: 0.2,
                                grid: { show: true },
                                tooltip: { show: true },
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
                    Chart.Area(
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
                        Chart.Area(
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
                    Chart.AreaMulti(
                        {
                            windows: [
                                { month: "Jan", value: 186n },
                                { month: "Feb", value: 165n },
                                { month: "Mar", value: 190n },
                                { month: "Apr", value: 175n },
                            ],
                            mac: [
                                { month: "Jan", value: 80n },
                                // Feb is missing - sparse data!
                                { month: "Mar", value: 87n },
                                { month: "Apr", value: 92n },
                            ],
                        },
                        {
                            xAxis: { dataKey: "month" },
                            valueKey: "value",
                            series: {
                                windows: { color: "teal.solid" },
                                mac: { color: "purple.solid" },
                            },
                            connectNulls: true,
                            tooltip: { show: true },
                            legend: { show: true },
                            grid: { show: true },
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.AreaMulti(
                            {
                                windows: [
                                    { month: "Jan", value: 186n },
                                    { month: "Feb", value: 165n },
                                    { month: "Mar", value: 190n },
                                    { month: "Apr", value: 175n },
                                ],
                                mac: [
                                    { month: "Jan", value: 80n },
                                    // Feb is missing - sparse data!
                                    { month: "Mar", value: 87n },
                                    { month: "Apr", value: 92n },
                                ],
                            },
                            {
                                xAxis: { dataKey: "month" },
                                valueKey: "value",
                                series: {
                                    windows: { color: "teal.solid" },
                                    mac: { color: "purple.solid" },
                                },
                                connectNulls: true,
                                tooltip: { show: true },
                                legend: { show: true },
                                grid: { show: true },
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
                "Zoomable area chart with labeled axes",
                Box.Root([
                    Chart.Area(
                        [
                            { month: "Jan", revenue: 186 },
                            { month: "Feb", revenue: 305 },
                            { month: "Mar", revenue: 237 },
                            { month: "Apr", revenue: 273 },
                            { month: "May", revenue: 209 },
                            { month: "Jun", revenue: 314 },
                            { month: "Jul", revenue: 256 },
                            { month: "Aug", revenue: 289 },
                            { month: "Sep", revenue: 321 },
                            { month: "Oct", revenue: 278 },
                            { month: "Nov", revenue: 342 },
                            { month: "Dec", revenue: 398 },
                        ],
                        { revenue: { color: "teal.solid" } },
                        {
                            xAxis: { dataKey: "month" },
                            yAxis: { label: "Revenue ($K)" },
                            grid: { show: true },
                            tooltip: { show: true },
                            brush: { dataKey: "month", height: 30n },
                        }
                    ),
                ], { height: "300px", width: "100%" }),
                some(`
                    Chart.Area(
                        [...data],
                        { revenue: { color: "teal.solid" } },
                        {
                            xAxis: { dataKey: "month" },
                            yAxis: { label: "Revenue ($K)" },
                            grid: { show: true },
                            tooltip: { show: true },
                            brush: { dataKey: "month", height: 30n },
                        }
                    )
                `)
            )
        );

        // Reference line (threshold)
        const withReferenceLine = $.let(
            ShowcaseCard(
                "Reference Line",
                "Horizontal threshold line at y=250",
                Box.Root([
                    Chart.Area(
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
                            grid: { show: true },
                            tooltip: { show: true },
                            referenceLines: [
                                { y: 250, stroke: "red", strokeDasharray: "5 5", label: "Threshold", labelPosition: "insideBottomRight" }
                            ],
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.Area(
                        [...data],
                        { revenue: { color: "teal.solid" } },
                        {
                            xAxis: { dataKey: "month" },
                            grid: { show: true },
                            referenceLines: [
                                { y: 250, stroke: "red", strokeDasharray: "5 5", label: "Threshold", labelPosition: "insideBottomRight" }
                            ],
                        }
                    )
                `)
            )
        );

        // Reference area (acceptable range)
        const withReferenceArea = $.let(
            ShowcaseCard(
                "Reference Area",
                "Highlight acceptable range between y=200 and y=280",
                Box.Root([
                    Chart.Area(
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
                            grid: { show: true },
                            tooltip: { show: true },
                            referenceAreas: [
                                { y1: 200, y2: 280, fill: "blue", fillOpacity: 0.1, label: "Target Range", labelPosition: "insideTopRight" }
                            ],
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.Area(
                        [...data],
                        { revenue: { color: "teal.solid" } },
                        {
                            xAxis: { dataKey: "month" },
                            grid: { show: true },
                            referenceAreas: [
                                { y1: 200, y2: 280, fill: "blue", fillOpacity: 0.1, label: "Target Range", labelPosition: "insideTopRight" }
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
                "Revenue (left axis) vs Conversion Rate % (right axis)",
                Box.Root([
                    Chart.Area(
                        [
                            { month: "Jan", revenue: 186, conversionRate: 2.5 },
                            { month: "Feb", revenue: 305, conversionRate: 3.2 },
                            { month: "Mar", revenue: 237, conversionRate: 2.8 },
                            { month: "Apr", revenue: 273, conversionRate: 3.5 },
                            { month: "May", revenue: 350, conversionRate: 4.1 },
                        ],
                        {
                            revenue: { color: "teal.solid", yAxisId: "left" },
                            conversionRate: { color: "purple.solid", yAxisId: "right" },
                        },
                        {
                            xAxis: { dataKey: "month" },
                            yAxis: { label: "Revenue ($)" },
                            yAxis2: { label: "Conversion (%)" },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                            fillOpacity: 0.3,
                        }
                    ),
                ], { height: "250px", width: "100%" }),
                some(`
                    Chart.Area(
                        [
                            { month: "Jan", revenue: 186, conversionRate: 2.5 },
                            { month: "Feb", revenue: 305, conversionRate: 3.2 },
                            // ...
                        ],
                        {
                            revenue: { color: "teal.solid", yAxisId: "left" },
                            conversionRate: { color: "purple.solid", yAxisId: "right" },
                        },
                        {
                            xAxis: { dataKey: "month" },
                            yAxis: { label: "Revenue ($)" },
                            yAxis2: { label: "Conversion (%)" },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                        }
                    )
                `)
            )
        );

        // Area Range Chart - shows bands between low/high values
        const areaRange = $.let(
            ShowcaseCard(
                "Area Range Chart",
                "Temperature range showing low/high values as a band",
                Box.Root([
                    Chart.AreaRange(
                        [
                            { day: "Mon", low: 5, high: 15 },
                            { day: "Tue", low: 3, high: 12 },
                            { day: "Wed", low: 7, high: 18 },
                            { day: "Thu", low: 8, high: 20 },
                            { day: "Fri", low: 6, high: 16 },
                        ],
                        {
                            temperature: { lowKey: "low", highKey: "high", color: "teal.solid" },
                        },
                        {
                            xAxis: { dataKey: "day" },
                            grid: { show: true },
                            tooltip: { show: true },
                            fillOpacity: 0.4,
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.AreaRange(
                        [
                            { day: "Mon", low: 5, high: 15 },
                            { day: "Tue", low: 3, high: 12 },
                            { day: "Wed", low: 7, high: 18 },
                            { day: "Thu", low: 8, high: 20 },
                            { day: "Fri", low: 6, high: 16 },
                        ],
                        {
                            temperature: { lowKey: "low", highKey: "high", color: "teal.solid" },
                        },
                        {
                            xAxis: { dataKey: "day" },
                            grid: { show: true },
                            tooltip: { show: true },
                            fillOpacity: 0.4,
                        }
                    )
                `)
            )
        );

        // Area Range with multiple series
        const areaRangeMulti = $.let(
            ShowcaseCard(
                "Multi-Series Range",
                "Temperature and humidity ranges overlaid",
                Box.Root([
                    Chart.AreaRange(
                        [
                            { day: "Mon", tempLow: 5, tempHigh: 15, humidLow: 40, humidHigh: 60 },
                            { day: "Tue", tempLow: 3, tempHigh: 12, humidLow: 45, humidHigh: 65 },
                            { day: "Wed", tempLow: 7, tempHigh: 18, humidLow: 35, humidHigh: 55 },
                            { day: "Thu", tempLow: 8, tempHigh: 20, humidLow: 30, humidHigh: 50 },
                            { day: "Fri", tempLow: 6, tempHigh: 16, humidLow: 38, humidHigh: 58 },
                        ],
                        {
                            temperature: { lowKey: "tempLow", highKey: "tempHigh", color: "teal.solid", label: "Temperature" },
                            humidity: { lowKey: "humidLow", highKey: "humidHigh", color: "blue.solid", label: "Humidity" },
                        },
                        {
                            xAxis: { dataKey: "day" },
                            legend: { show: true },
                            tooltip: { show: true },
                            curveType: "natural",
                            fillOpacity: 0.3,
                        }
                    ),
                ], { height: "240px", width: "100%" }),
                some(`
                    Chart.AreaRange(
                        [
                            { day: "Mon", tempLow: 5, tempHigh: 15, humidLow: 40, humidHigh: 60 },
                            { day: "Tue", tempLow: 3, tempHigh: 12, humidLow: 45, humidHigh: 65 },
                            ...
                        ],
                        {
                            temperature: { lowKey: "tempLow", highKey: "tempHigh", color: "teal.solid" },
                            humidity: { lowKey: "humidLow", highKey: "humidHigh", color: "blue.solid" },
                        },
                        {
                            xAxis: { dataKey: "day" },
                            legend: { show: true },
                            curveType: "natural",
                            fillOpacity: 0.3,
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
                    Chart.Area(
                        [
                            { month: "Jan", region: "North", revenue: 100 },
                            { month: "Jan", region: "South", revenue: 80 },
                            { month: "Feb", region: "North", revenue: 120 },
                            { month: "Feb", region: "South", revenue: 90 },
                            { month: "Mar", region: "North", revenue: 140 },
                            { month: "Mar", region: "South", revenue: 110 },
                        ],
                        {
                            revenue: {
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
                            valueKey: "revenue",
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                            fillOpacity: 0.4,
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.Area(
                        [
                            { month: "Jan", region: "North", revenue: 100 },
                            { month: "Jan", region: "South", revenue: 80 },
                            // ... more rows per (month, region)
                        ],
                        {
                            revenue: {
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
                            valueKey: "revenue",
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
                    Chart.Area(
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
                            fillOpacity: 0.3,
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.Area(
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

        // AreaMulti with pivot and pivotColors
        const multiPivotWithColors = $.let(
            ShowcaseCard(
                "Multi Pivot with Colors",
                "Multi-series with pivot within each record",
                Box.Root([
                    Chart.AreaMulti(
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
                            fillOpacity: 0.3,
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.AreaMulti(
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

        // AreaMulti with pivot but no pivotColors
        const multiPivotWithoutColors = $.let(
            ShowcaseCard(
                "Multi Pivot Default",
                "Multi-series pivot using default colors",
                Box.Root([
                    Chart.AreaMulti(
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
                                forecast: { color: "orange.solid" },
                            },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                            fillOpacity: 0.3,
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.AreaMulti(
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
                                forecast: { color: "orange.solid" },
                            },
                        }
                    )
                `)
            )
        );

        // Integer x-axis (proportional spacing, gaps visible)
        const integerXAxis = $.let(
            ShowcaseCard(
                "Integer X-Axis",
                "Numeric integer x-axis — gaps at hours 1-2, 13-17 show proportional spacing",
                Box.Root([
                    Chart.Area(
                        [
                            { hour: 0n, temp: 8, humidity: 85 },
                            { hour: 3n, temp: 6, humidity: 90 },
                            { hour: 6n, temp: 7, humidity: 88 },
                            { hour: 9n, temp: 15, humidity: 65 },
                            { hour: 12n, temp: 22, humidity: 45 },
                            { hour: 18n, temp: 18, humidity: 55 },
                            { hour: 24n, temp: 10, humidity: 80 },
                        ],
                        {
                            temp: { color: "teal.solid" },
                            humidity: { color: "purple.solid" },
                        },
                        {
                            xAxis: { dataKey: "hour", label: "Hour" },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                            fillOpacity: 0.3,
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.Area(
                        [
                            { hour: 0n, temp: 8, humidity: 85 },
                            { hour: 3n, temp: 6, humidity: 90 },
                            { hour: 6n, temp: 7, humidity: 88 },
                            { hour: 9n, temp: 15, humidity: 65 },
                            { hour: 12n, temp: 22, humidity: 45 },
                            { hour: 18n, temp: 18, humidity: 55 },
                            { hour: 24n, temp: 10, humidity: 80 },
                        ],
                        { temp: { color: "teal.solid" }, humidity: { color: "purple.solid" } },
                        { xAxis: { dataKey: "hour", label: "Hour" }, grid: { show: true }, tooltip: { show: true }, legend: { show: true }, fillOpacity: 0.3 }
                    )
                `)
            )
        );

        // Float x-axis (non-uniform spacing)
        const floatXAxis = $.let(
            ShowcaseCard(
                "Float X-Axis",
                "Continuous float x-axis — non-uniform dose spacing shows proportional gaps",
                Box.Root([
                    Chart.Area(
                        [
                            { dose: 0.1, response: 2, control: 1 },
                            { dose: 0.25, response: 8, control: 3 },
                            { dose: 0.5, response: 25, control: 5 },
                            { dose: 1.0, response: 50, control: 8 },
                            { dose: 2.5, response: 80, control: 10 },
                            { dose: 5.0, response: 95, control: 12 },
                        ],
                        {
                            response: { color: "blue.solid" },
                            control: { color: "orange.solid" },
                        },
                        {
                            xAxis: { dataKey: "dose", label: "Dose (mg)" },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                            fillOpacity: 0.3,
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.Area(
                        [
                            { dose: 0.1, response: 2, control: 1 },
                            { dose: 0.25, response: 8, control: 3 },
                            { dose: 0.5, response: 25, control: 5 },
                            { dose: 1.0, response: 50, control: 8 },
                            { dose: 2.5, response: 80, control: 10 },
                            { dose: 5.0, response: 95, control: 12 },
                        ],
                        { response: { color: "blue.solid" }, control: { color: "orange.solid" } },
                        { xAxis: { dataKey: "dose", label: "Dose (mg)" }, grid: { show: true }, tooltip: { show: true }, legend: { show: true }, fillOpacity: 0.3 }
                    )
                `)
            )
        );

        // String x-axis (equal spacing)
        const stringXAxis = $.let(
            ShowcaseCard(
                "String X-Axis",
                "Categorical string x-axis — all categories equally spaced",
                Box.Root([
                    Chart.Area(
                        [
                            { region: "North", sales: 120, target: 100 },
                            { region: "South", sales: 200, target: 180 },
                            { region: "East", sales: 150, target: 160 },
                            { region: "West", sales: 180, target: 170 },
                            { region: "Central", sales: 95, target: 110 },
                        ],
                        {
                            sales: { color: "green.solid" },
                            target: { color: "red.solid" },
                        },
                        {
                            xAxis: { dataKey: "region" },
                            grid: { show: true },
                            tooltip: { show: true },
                            legend: { show: true },
                            fillOpacity: 0.3,
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.Area(
                        [
                            { region: "North", sales: 120, target: 100 },
                            { region: "South", sales: 200, target: 180 },
                            { region: "East", sales: 150, target: 160 },
                            { region: "West", sales: 180, target: 170 },
                            { region: "Central", sales: 95, target: 110 },
                        ],
                        { sales: { color: "green.solid" }, target: { color: "red.solid" } },
                        { xAxis: { dataKey: "region" }, grid: { show: true }, tooltip: { show: true }, legend: { show: true }, fillOpacity: 0.3 }
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
                    Chart.Area(
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
                            fillOpacity: 0.3,
                        }
                    ),
                ], { height: "220px", width: "100%" }),
                some(`
                    Chart.Area(
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
                            fillOpacity: 0.3,
                        }
                    )
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(multiSeries),
                Grid.Item(stacked),
                Grid.Item(percentStacked),
                Grid.Item(curved),
                Grid.Item(opacity),
                Grid.Item(withBrush),
                Grid.Item(sparseMultiSeries),
                Grid.Item(withBrushAndLabels),
                Grid.Item(withReferenceLine),
                Grid.Item(withReferenceArea),
                Grid.Item(dualYAxis),
                Grid.Item(areaRange),
                Grid.Item(areaRangeMulti),
                Grid.Item(pivotWithColors),
                Grid.Item(pivotWithoutColors),
                Grid.Item(multiPivotWithColors),
                Grid.Item(multiPivotWithoutColors),
                Grid.Item(integerXAxis),
                Grid.Item(floatXAxis),
                Grid.Item(stringXAxis),
                Grid.Item(axisFormatting),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
