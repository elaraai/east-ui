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
                            xAxis: Chart.Axis({ dataKey: "type" }),
                            grid: Chart.Grid({ show: true }),
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
                                xAxis: Chart.Axis({ dataKey: "type" }),
                                grid: Chart.Grid({ show: true }),
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
                            xAxis: Chart.Axis({ dataKey: "month" }),
                            grid: Chart.Grid({ show: true }),
                            tooltip: Chart.Tooltip({ show: true }),
                            legend: Chart.Legend({ show: true }),
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
                                xAxis: Chart.Axis({ dataKey: "month" }),
                                grid: Chart.Grid({ show: true }),
                                tooltip: Chart.Tooltip({ show: true }),
                                legend: Chart.Legend({ show: true }),
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
                            xAxis: Chart.Axis({ dataKey: "month" }),
                            yAxis: Chart.Axis({ tickFormat: "percent" }),
                            stackOffset: "expand",
                            legend: Chart.Legend({ show: true }),
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
                                xAxis: Chart.Axis({ dataKey: "month" }),
                                yAxis: Chart.Axis({ tickFormat: "percent" }),
                                stackOffset: "expand",
                                legend: Chart.Legend({ show: true }),
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
                            yAxis: Chart.Axis({ dataKey: "month" }),
                            legend: Chart.Legend({ show: true }),
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
                                yAxis: Chart.Axis({ dataKey: "month" }),
                                legend: Chart.Legend({ show: true }),
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
                            xAxis: Chart.Axis({ dataKey: "type" }),
                            legend: Chart.Legend({ show: true }),
                            tooltip: Chart.Tooltip({ show: true }),
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
                                xAxis: Chart.Axis({ dataKey: "type" }),
                                legend: Chart.Legend({ show: true }),
                                tooltip: Chart.Tooltip({ show: true }),
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
                            xAxis: Chart.Axis({ dataKey: "month" }),
                            yAxis: Chart.Axis({ tickFormat: Chart.TickFormat.Currency({ currency: "USD" }) }),
                            grid: Chart.Grid({ show: true }),
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
                                xAxis: Chart.Axis({ dataKey: "month" }),
                                yAxis: Chart.Axis({ tickFormat: Chart.TickFormat.Currency({ currency: "USD" }) }),
                                grid: Chart.Grid({ show: true }),
                            }
                        ),
                    ], { height: "200px", width: "100%" })
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
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
