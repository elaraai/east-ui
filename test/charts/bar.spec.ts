/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
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
                { type: "Stock", allocation: 60 },
                { type: "Crypto", allocation: 45 },
                { type: "ETF", allocation: 12 },
                { type: "Cash", allocation: 4 },
            ],
            { allocation: { color: "teal.solid" } }
        ));

        $(assertEast.equal(chart.getTag(), "BarChart"));
        $(assertEast.equal(chart.unwrap("BarChart").series.size(), 1n));
        $(assertEast.equal(chart.unwrap("BarChart").series.get(0n).name, "allocation"));
        $(assertEast.equal(chart.unwrap("BarChart").series.get(0n).color.unwrap("some"), "teal.solid"));
    });

    test("creates bar chart with x-axis dataKey", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60 },
            ],
            { allocation: { color: "teal.solid" } },
            { xAxis: Chart.Axis({ dataKey: "type" }) }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").xAxis.unwrap("some").dataKey.unwrap("some"), "type"));
    });

    // =========================================================================
    // Stacked Bar Charts
    // =========================================================================

    test("creates stacked bar chart", $ => {
        const chart = $.let(Chart.Bar(
            [
                { month: "January", windows: 186, mac: 80, linux: 120 },
                { month: "February", windows: 165, mac: 95, linux: 110 },
            ],
            {
                windows: { color: "teal.solid", stackId: "a" },
                mac: { color: "purple.solid", stackId: "a" },
                linux: { color: "blue.solid", stackId: "a" },
            },
            { xAxis: Chart.Axis({ dataKey: "month" }) }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").series.size(), 3n));
        $(assertEast.equal(chart.unwrap("BarChart").series.get(0n).stackId.unwrap("some"), "a"));
        $(assertEast.equal(chart.unwrap("BarChart").series.get(1n).stackId.unwrap("some"), "a"));
        $(assertEast.equal(chart.unwrap("BarChart").series.get(2n).stackId.unwrap("some"), "a"));
    });

    test("creates 100% stacked bar chart with stackOffset expand", $ => {
        const chart = $.let(Chart.Bar(
            [
                { month: "January", windows: 186, mac: 80, linux: 120 },
            ],
            {
                windows: { color: "teal.solid", stackId: "a" },
                mac: { color: "purple.solid", stackId: "a" },
                linux: { color: "blue.solid", stackId: "a" },
            },
            {
                stackOffset: "expand",
                yAxis: Chart.Axis({ tickFormat: "percent" })
            }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").stackOffset.unwrap("some").hasTag("expand"), true));
        $(assertEast.equal(chart.unwrap("BarChart").yAxis.unwrap("some").tickFormat.unwrap("some").hasTag("percent"), true));
    });

    // =========================================================================
    // Horizontal Bar Charts
    // =========================================================================

    test("creates horizontal bar chart (layout vertical)", $ => {
        const chart = $.let(Chart.Bar(
            [
                { month: "January", windows: 186, mac: 80, linux: 120 },
            ],
            {
                windows: { color: "teal.solid", stackId: "a" },
                mac: { color: "purple.solid", stackId: "a" },
                linux: { color: "blue.solid", stackId: "a" },
            },
            {
                layout: "vertical",
                yAxis: Chart.Axis({ dataKey: "month" })
            }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").layout.unwrap("some").hasTag("vertical"), true));
        $(assertEast.equal(chart.unwrap("BarChart").yAxis.unwrap("some").dataKey.unwrap("some"), "month"));
    });

    // =========================================================================
    // Grouped (Multiple) Bar Charts
    // =========================================================================

    test("creates grouped bar chart (multiple bars per category)", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "mobile", poor: 40, fair: 100, good: 200, excellent: 70 },
                { type: "marketing", poor: 15, fair: 40, good: 120, excellent: 90 },
            ],
            {
                poor: { color: "blue.solid" },
                fair: { color: "orange.solid" },
                good: { color: "yellow.solid" },
                excellent: { color: "green.solid" },
            },
            { xAxis: Chart.Axis({ dataKey: "type" }) }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").series.size(), 4n));
        $(assertEast.equal(chart.unwrap("BarChart").series.get(0n).stackId.hasTag("none"), true));
        $(assertEast.equal(chart.unwrap("BarChart").series.get(0n).color.unwrap("some"), "blue.solid"));
    });

    // =========================================================================
    // Bar Size and Gap
    // =========================================================================

    test("creates bar chart with custom bar size", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60 },
            ],
            { allocation: { color: "teal.solid" } },
            { barSize: 30n }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").barSize.unwrap("some"), 30n));
    });

    test("creates bar chart with custom bar gap", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60 },
            ],
            { allocation: { color: "teal.solid" } },
            { barGap: 10n }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").barGap.unwrap("some"), 10n));
    });

    // =========================================================================
    // Axis Formatting
    // =========================================================================

    test("creates bar chart with percent y-axis formatter", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60 },
            ],
            { allocation: { color: "teal.solid" } },
            { yAxis: Chart.Axis({ tickFormat: "percent", domain: [0, 100] }) }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").yAxis.unwrap("some").tickFormat.unwrap("some").hasTag("percent"), true));
    });

    test("creates bar chart with currency y-axis formatter", $ => {
        const chart = $.let(Chart.Bar(
            [
                { month: "June", sales: 63000 },
                { month: "July", sales: 72000 },
            ],
            { sales: { color: "teal.solid" } },
            {
                xAxis: Chart.Axis({ dataKey: "month" }),
                yAxis: Chart.Axis({ tickFormat: Chart.TickFormat.Currency({ currency: "USD" }) })
            }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").yAxis.unwrap("some").tickFormat.unwrap("some").hasTag("currency"), true));
    });

    test("creates bar chart with compact y-axis formatter", $ => {
        const chart = $.let(Chart.Bar(
            [
                { month: "June", sales: 63000 },
            ],
            { sales: { color: "teal.solid" } },
            { yAxis: Chart.Axis({ tickFormat: "compact" }) }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").yAxis.unwrap("some").tickFormat.unwrap("some").hasTag("compact"), true));
    });

    // =========================================================================
    // Display Options
    // =========================================================================

    test("creates bar chart with grid", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60 },
            ],
            { allocation: { color: "teal.solid" } },
            { grid: Chart.Grid({ show: true }) }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").grid.unwrap("some").show.unwrap("some"), true));
    });

    test("creates bar chart with legend", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60 },
            ],
            { allocation: { color: "teal.solid" } },
            { legend: Chart.Legend({ show: true }) }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").legend.unwrap("some").show.unwrap("some"), true));
    });

    test("creates bar chart with tooltip", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60 },
            ],
            { allocation: { color: "teal.solid" } },
            { tooltip: Chart.Tooltip({ show: true }) }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").tooltip.unwrap("some").show.unwrap("some"), true));
    });

    // =========================================================================
    // Margin
    // =========================================================================

    test("creates bar chart with custom margin", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60 },
            ],
            { allocation: { color: "teal.solid" } },
            { margin: Chart.Margin({ top: 20n, right: 30n, bottom: 20n, left: 30n }) }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").margin.unwrap("some").top.unwrap("some"), 20n));
        $(assertEast.equal(chart.unwrap("BarChart").margin.unwrap("some").left.unwrap("some"), 30n));
    });

    // =========================================================================
    // Complete Examples
    // =========================================================================

    test("creates complete bar chart matching Chakra BarChartBasic example", $ => {
        const chart = $.let(Chart.Bar(
            [
                { type: "Stock", allocation: 60 },
                { type: "Crypto", allocation: 45 },
                { type: "ETF", allocation: 12 },
                { type: "Cash", allocation: 4 },
            ],
            { allocation: { color: "teal.solid" } },
            {
                xAxis: Chart.Axis({ dataKey: "type" }),
                yAxis: Chart.Axis({ domain: [0, 100] }),
                grid: Chart.Grid({ show: true })
            }
        ));

        $(assertEast.equal(chart.getTag(), "BarChart"));
        $(assertEast.equal(chart.unwrap("BarChart").series.get(0n).name, "allocation"));
        $(assertEast.equal(chart.unwrap("BarChart").grid.unwrap("some").show.unwrap("some"), true));
    });

    test("creates complete stacked bar chart matching Chakra BarChartStacked example", $ => {
        const chart = $.let(Chart.Bar(
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
                grid: Chart.Grid({ show: true }),
                tooltip: Chart.Tooltip({ show: true }),
                legend: Chart.Legend({ show: true })
            }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").series.size(), 3n));
        $(assertEast.equal(chart.unwrap("BarChart").series.get(0n).stackId.unwrap("some"), "a"));
        $(assertEast.equal(chart.unwrap("BarChart").legend.unwrap("some").show.unwrap("some"), true));
    });
});
