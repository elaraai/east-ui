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
                            xAxis: Chart.Axis({ dataKey: "month" }),
                            grid: Chart.Grid({ show: true }),
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
                                xAxis: Chart.Axis({ dataKey: "month" }),
                                grid: Chart.Grid({ show: true }),
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
                            xAxis: Chart.Axis({ dataKey: "month" }),
                            legend: Chart.Legend({ show: true }),
                            tooltip: Chart.Tooltip({ show: true }),
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
                                xAxis: Chart.Axis({ dataKey: "month" }),
                                legend: Chart.Legend({ show: true }),
                                tooltip: Chart.Tooltip({ show: true }),
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
                            xAxis: Chart.Axis({ dataKey: "month" }),
                            stacked: true,
                            legend: Chart.Legend({ show: true }),
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
                                xAxis: Chart.Axis({ dataKey: "month" }),
                                stacked: true,
                                legend: Chart.Legend({ show: true }),
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
                            xAxis: Chart.Axis({ dataKey: "month" }),
                            yAxis: Chart.Axis({ tickFormat: "percent" }),
                            stacked: true,
                            stackOffset: "expand",
                            legend: Chart.Legend({ show: true }),
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
                                xAxis: Chart.Axis({ dataKey: "month" }),
                                yAxis: Chart.Axis({ tickFormat: "percent" }),
                                stacked: true,
                                stackOffset: "expand",
                                legend: Chart.Legend({ show: true }),
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
                            xAxis: Chart.Axis({ dataKey: "month" }),
                            curveType: "natural",
                            fillOpacity: 0.3,
                            grid: Chart.Grid({ show: true }),
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
                                xAxis: Chart.Axis({ dataKey: "month" }),
                                curveType: "natural",
                                fillOpacity: 0.3,
                                grid: Chart.Grid({ show: true }),
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
                            xAxis: Chart.Axis({ dataKey: "month" }),
                            fillOpacity: 0.2,
                            grid: Chart.Grid({ show: true }),
                            tooltip: Chart.Tooltip({ show: true }),
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
                                xAxis: Chart.Axis({ dataKey: "month" }),
                                fillOpacity: 0.2,
                                grid: Chart.Grid({ show: true }),
                                tooltip: Chart.Tooltip({ show: true }),
                            }
                        ),
                    ], { height: "200px", width: "100%" })
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
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
