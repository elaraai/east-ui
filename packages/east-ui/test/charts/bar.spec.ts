/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Chart } from "../../src/index.js";

describeEast("Chart.Bar", (test) => {
    // =========================================================================
    // Basic Bar Charts
    // =========================================================================

    test("creates basic bar chart (vertical bars)", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60n },
                { type: "Crypto", allocation: 45n },
                { type: "ETF", allocation: 12n },
                { type: "Cash", allocation: 4n },
            ],
            { allocation: { color: "teal.solid" } }
        ));

        $(assertEast.equal(chart.unwrap().getTag(), "BarChart"));
        $(assertEast.equal(chart.unwrap().unwrap("BarChart").series.size(), 1n));
        $(assertEast.equal(chart.unwrap().unwrap("BarChart").series.get(0n).name, "allocation"));
        $(assertEast.equal(chart.unwrap().unwrap("BarChart").series.get(0n).color.unwrap("some"), "teal.solid"));
    });

    test("creates bar chart with array series spec", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60n },
            ],
            ["allocation"]
        ));

        $(assertEast.equal(chart.unwrap().unwrap("BarChart").series.size(), 1n));
        $(assertEast.equal(chart.unwrap().unwrap("BarChart").series.get(0n).name, "allocation"));
    });

    test("creates bar chart with x-axis dataKey", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60n },
            ],
            { allocation: { color: "teal.solid" } },
            { xAxis: { dataKey: "type" } }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("BarChart").xAxis.unwrap("some").dataKey.unwrap("some"), "type"));
    });

    // =========================================================================
    // Stacked Bar Charts
    // =========================================================================

    test("creates stacked bar chart", $ => {
        const chart = $.let(Chart.Bar(
            [
                { month: "January", windows: 186n, mac: 80n, linux: 120n },
                { month: "February", windows: 165n, mac: 95n, linux: 110n },
            ],
            {
                windows: { color: "teal.solid", stackId: "a" },
                mac: { color: "purple.solid", stackId: "a" },
                linux: { color: "blue.solid", stackId: "a" },
            },
            { xAxis: { dataKey: "month" } }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("BarChart").series.size(), 3n));
        $(assertEast.equal(chart.unwrap().unwrap("BarChart").series.get(0n).stackId.unwrap("some"), "a"));
        $(assertEast.equal(chart.unwrap().unwrap("BarChart").series.get(1n).stackId.unwrap("some"), "a"));
        $(assertEast.equal(chart.unwrap().unwrap("BarChart").series.get(2n).stackId.unwrap("some"), "a"));
    });

    test("creates 100% stacked bar chart with stackOffset expand", $ => {
        const chart = $.let(Chart.Bar(
            [
                { month: "January", windows: 186n, mac: 80n, linux: 120n },
            ],
            {
                windows: { color: "teal.solid", stackId: "a" },
                mac: { color: "purple.solid", stackId: "a" },
                linux: { color: "blue.solid", stackId: "a" },
            },
            {
                stackOffset: "expand",
                yAxis: { tickFormat: "percent" }
            }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("BarChart").stackOffset.unwrap("some").hasTag("expand"), true));
        $(assertEast.equal(chart.unwrap().unwrap("BarChart").yAxis.unwrap("some").tickFormat.unwrap("some").hasTag("percent"), true));
    });

    // =========================================================================
    // Horizontal Bar Charts
    // =========================================================================

    test("creates horizontal bar chart (layout vertical)", $ => {
        const chart = $.let(Chart.Bar(
            [
                { month: "January", windows: 186n, mac: 80n, linux: 120n },
            ],
            {
                windows: { color: "teal.solid", stackId: "a" },
                mac: { color: "purple.solid", stackId: "a" },
                linux: { color: "blue.solid", stackId: "a" },
            },
            {
                layout: "vertical",
                yAxis: { dataKey: "month" }
            }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("BarChart").layout.unwrap("some").hasTag("vertical"), true));
        $(assertEast.equal(chart.unwrap().unwrap("BarChart").yAxis.unwrap("some").dataKey.unwrap("some"), "month"));
    });

    // =========================================================================
    // Grouped (Multiple) Bar Charts
    // =========================================================================

    test("creates grouped bar chart (multiple bars per category)", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "mobile", poor: 40n, fair: 100n, good: 200n, excellent: 70n },
                { type: "marketing", poor: 15n, fair: 40n, good: 120n, excellent: 90n },
            ],
            {
                poor: { color: "blue.solid" },
                fair: { color: "orange.solid" },
                good: { color: "yellow.solid" },
                excellent: { color: "green.solid" },
            },
            { xAxis: { dataKey: "type" } }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("BarChart").series.size(), 4n));
        $(assertEast.equal(chart.unwrap().unwrap("BarChart").series.get(0n).stackId.hasTag("none"), true));
        $(assertEast.equal(chart.unwrap().unwrap("BarChart").series.get(0n).color.unwrap("some"), "blue.solid"));
    });

    // =========================================================================
    // Bar Size and Gap
    // =========================================================================

    test("creates bar chart with custom bar size", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60n },
            ],
            { allocation: { color: "teal.solid" } },
            { barSize: 30n }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("BarChart").barSize.unwrap("some"), 30n));
    });

    test("creates bar chart with custom bar gap", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60n },
            ],
            { allocation: { color: "teal.solid" } },
            { barGap: 10n }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("BarChart").barGap.unwrap("some"), 10n));
    });

    // =========================================================================
    // Axis Formatting
    // =========================================================================

    test("creates bar chart with percent y-axis formatter", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60n },
            ],
            { allocation: { color: "teal.solid" } },
            { yAxis: { tickFormat: "percent", domain: [0, 100] } }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("BarChart").yAxis.unwrap("some").tickFormat.unwrap("some").hasTag("percent"), true));
    });

    test("creates bar chart with currency y-axis formatter", $ => {
        const chart = $.let(Chart.Bar(
            [
                { month: "June", sales: 63000n },
                { month: "July", sales: 72000n },
            ],
            { sales: { color: "teal.solid" } },
            {
                xAxis: { dataKey: "month" },
                yAxis: { tickFormat: Chart.TickFormat.Currency({ currency: "USD" }) }
            }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("BarChart").yAxis.unwrap("some").tickFormat.unwrap("some").hasTag("currency"), true));
    });

    test("creates bar chart with compact y-axis formatter", $ => {
        const chart = $.let(Chart.Bar(
            [
                { month: "June", sales: 63000n },
            ],
            { sales: { color: "teal.solid" } },
            { yAxis: { tickFormat: "compact" } }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("BarChart").yAxis.unwrap("some").tickFormat.unwrap("some").hasTag("compact"), true));
    });

    // =========================================================================
    // Display Options
    // =========================================================================

    test("creates bar chart with grid", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60n },
            ],
            { allocation: { color: "teal.solid" } },
            { grid: { show: true } }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("BarChart").grid.unwrap("some").show.unwrap("some"), true));
    });

    test("creates bar chart with legend", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60n },
            ],
            { allocation: { color: "teal.solid" } },
            { legend: { show: true } }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("BarChart").legend.unwrap("some").show.unwrap("some"), true));
    });

    test("creates bar chart with tooltip", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60n },
            ],
            { allocation: { color: "teal.solid" } },
            { tooltip: { show: true } }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("BarChart").tooltip.unwrap("some").show.unwrap("some"), true));
    });

    // =========================================================================
    // Margin
    // =========================================================================

    test("creates bar chart with custom margin", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60n },
            ],
            { allocation: { color: "teal.solid" } },
            { margin: { top: 20n, right: 30n, bottom: 20n, left: 30n } }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("BarChart").margin.unwrap("some").top.unwrap("some"), 20n));
        $(assertEast.equal(chart.unwrap().unwrap("BarChart").margin.unwrap("some").left.unwrap("some"), 30n));
    });

    // =========================================================================
    // Brush
    // =========================================================================

    test("creates bar chart with brush enabled", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60n },
                { type: "Crypto", allocation: 45n },
            ],
            { allocation: { color: "teal.solid" } },
            { xAxis: { dataKey: "type" }, brush: {} }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("BarChart").brush.hasTag("some"), true));
    });

    test("creates bar chart with brush configuration", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60n },
            ],
            { allocation: { color: "teal.solid" } },
            { brush: { dataKey: "type", height: 30n, travellerWidth: 8n } }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("BarChart").brush.unwrap("some").dataKey.unwrap("some"), "type"));
        $(assertEast.equal(chart.unwrap().unwrap("BarChart").brush.unwrap("some").height.unwrap("some"), 30n));
        $(assertEast.equal(chart.unwrap().unwrap("BarChart").brush.unwrap("some").travellerWidth.unwrap("some"), 8n));
    });

    // =========================================================================
    // Complete Examples
    // =========================================================================

    test("creates complete bar chart matching Chakra BarChartBasic example", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60n },
                { type: "Crypto", allocation: 45n },
                { type: "ETF", allocation: 12n },
                { type: "Cash", allocation: 4n },
            ],
            { allocation: { color: "teal.solid" } },
            {
                xAxis: { dataKey: "type" },
                yAxis: { domain: [0, 100] },
                grid: { show: true }
            }
        ));

        $(assertEast.equal(chart.unwrap().getTag(), "BarChart"));
        $(assertEast.equal(chart.unwrap().unwrap("BarChart").series.get(0n).name, "allocation"));
        $(assertEast.equal(chart.unwrap().unwrap("BarChart").grid.unwrap("some").show.unwrap("some"), true));
    });

    test("creates complete stacked bar chart matching Chakra BarChartStacked example", $ => {
        const chart = $.let(Chart.Bar(
            [
                { month: "January", windows: 186n, mac: 80n, linux: 120n },
                { month: "February", windows: 165n, mac: 95n, linux: 110n },
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
                legend: { show: true }
            }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("BarChart").series.size(), 3n));
        $(assertEast.equal(chart.unwrap().unwrap("BarChart").series.get(0n).stackId.unwrap("some"), "a"));
        $(assertEast.equal(chart.unwrap().unwrap("BarChart").legend.unwrap("some").show.unwrap("some"), true));
    });
});

describeEast("Chart.BarMulti", (test) => {
    test("creates bar chart with multi-series data", $ => {
        const chart = $.let(Chart.BarMulti(
            {
                sales: [
                    { month: "January", value: 186n },
                    { month: "February", value: 305n },
                ],
                returns: [
                    { month: "January", value: 20n },
                    { month: "March", value: 35n },
                ],
            },
            {
                xAxis: { dataKey: "month" },
                valueKey: "value",
                series: {
                    sales: { color: "teal.solid" },
                    returns: { color: "red.solid" },
                },
            }
        ));

        $(assertEast.equal(chart.unwrap().getTag(), "BarChart"));
        $(assertEast.equal(chart.unwrap().unwrap("BarChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap().unwrap("BarChart").valueKey.unwrap("some"), "value"));
        $(assertEast.equal(chart.unwrap().unwrap("BarChart").dataSeries.hasTag("some"), true));
    });
});
