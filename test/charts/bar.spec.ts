/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { type ValueTypeOf, LiteralValueType, variant } from "@elaraai/east";
import { describeEast, assertEast } from "../platforms.spec.js";
import { Chart } from "../../src/index.js";

describeEast("Chart.Bar", (test) => {
    // =========================================================================
    // Basic Bar Charts
    // =========================================================================

    test("creates basic bar chart (vertical bars)", $ => {
        const chart = $.let(Chart.Bar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["type", variant("String", "Stock")], ["allocation", variant("Float", 60)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["type", variant("String", "Crypto")], ["allocation", variant("Float", 45)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["type", variant("String", "ETF")], ["allocation", variant("Float", 12)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["type", variant("String", "Cash")], ["allocation", variant("Float", 4)]]),
            ],
            [{ name: "allocation", color: "teal.solid" }]
        ));

        $(assertEast.equal(chart.getTag(), "BarChart"));
        $(assertEast.equal(chart.unwrap("BarChart").series.size(), 1n));
        $(assertEast.equal(chart.unwrap("BarChart").series.get(0n).name, "allocation"));
        $(assertEast.equal(chart.unwrap("BarChart").series.get(0n).color.unwrap("some"), "teal.solid"));
    });

    test("creates bar chart with x-axis dataKey", $ => {
        const chart = $.let(Chart.Bar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["type", variant("String", "Stock")], ["allocation", variant("Float", 60)]]),
            ],
            [{ name: "allocation", color: "teal.solid" }],
            { xAxis: { dataKey: "type" } }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").xAxis.unwrap("some").dataKey.unwrap("some"), "type"));
    });

    // =========================================================================
    // Stacked Bar Charts
    // =========================================================================

    test("creates stacked bar chart", $ => {
        const chart = $.let(Chart.Bar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["windows", variant("Float", 186)], ["mac", variant("Float", 80)], ["linux", variant("Float", 120)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "February")], ["windows", variant("Float", 165)], ["mac", variant("Float", 95)], ["linux", variant("Float", 110)]]),
            ],
            [
                { name: "windows", color: "teal.solid", stackId: "a" },
                { name: "mac", color: "purple.solid", stackId: "a" },
                { name: "linux", color: "blue.solid", stackId: "a" },
            ],
            { xAxis: { dataKey: "month" } }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").series.size(), 3n));
        $(assertEast.equal(chart.unwrap("BarChart").series.get(0n).stackId.unwrap("some"), "a"));
        $(assertEast.equal(chart.unwrap("BarChart").series.get(1n).stackId.unwrap("some"), "a"));
        $(assertEast.equal(chart.unwrap("BarChart").series.get(2n).stackId.unwrap("some"), "a"));
    });

    test("creates 100% stacked bar chart with stackOffset expand", $ => {
        const chart = $.let(Chart.Bar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["windows", variant("Float", 186)], ["mac", variant("Float", 80)], ["linux", variant("Float", 120)]]),
            ],
            [
                { name: "windows", color: "teal.solid", stackId: "a" },
                { name: "mac", color: "purple.solid", stackId: "a" },
                { name: "linux", color: "blue.solid", stackId: "a" },
            ],
            { stackOffset: "expand", yAxis: { tickFormat: "percent" } }
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
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["windows", variant("Float", 186)], ["mac", variant("Float", 80)], ["linux", variant("Float", 120)]]),
            ],
            [
                { name: "windows", color: "teal.solid", stackId: "a" },
                { name: "mac", color: "purple.solid", stackId: "a" },
                { name: "linux", color: "blue.solid", stackId: "a" },
            ],
            { layout: "vertical", yAxis: { dataKey: "month" } }
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
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["type", variant("String", "mobile")], ["poor", variant("Float", 40)], ["fair", variant("Float", 100)], ["good", variant("Float", 200)], ["excellent", variant("Float", 70)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["type", variant("String", "marketing")], ["poor", variant("Float", 15)], ["fair", variant("Float", 40)], ["good", variant("Float", 120)], ["excellent", variant("Float", 90)]]),
            ],
            [
                { name: "poor", color: "blue.solid" },
                { name: "fair", color: "orange.solid" },
                { name: "good", color: "yellow.solid" },
                { name: "excellent", color: "green.solid" },
            ],
            { xAxis: { dataKey: "type" } }
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
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["type", variant("String", "Stock")], ["allocation", variant("Float", 60)]]),
            ],
            [{ name: "allocation", color: "teal.solid" }],
            { barSize: 30n }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").barSize.unwrap("some"), 30n));
    });

    test("creates bar chart with custom bar gap", $ => {
        const chart = $.let(Chart.Bar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["type", variant("String", "Stock")], ["allocation", variant("Float", 60)]]),
            ],
            [{ name: "allocation", color: "teal.solid" }],
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
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["type", variant("String", "Stock")], ["allocation", variant("Float", 60)]]),
            ],
            [{ name: "allocation", color: "teal.solid" }],
            { yAxis: { tickFormat: "percent", domain: [0, 100] } }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").yAxis.unwrap("some").tickFormat.unwrap("some").hasTag("percent"), true));
    });

    test("creates bar chart with currency y-axis formatter", $ => {
        const chart = $.let(Chart.Bar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "June")], ["sales", variant("Float", 63000)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "July")], ["sales", variant("Float", 72000)]]),
            ],
            [{ name: "sales", color: "teal.solid" }],
            { xAxis: { dataKey: "month" }, yAxis: { tickFormat: "currency" } }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").yAxis.unwrap("some").tickFormat.unwrap("some").hasTag("currency"), true));
    });

    test("creates bar chart with compact y-axis formatter", $ => {
        const chart = $.let(Chart.Bar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "June")], ["sales", variant("Float", 63000)]]),
            ],
            [{ name: "sales", color: "teal.solid" }],
            { yAxis: { tickFormat: "compact" } }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").yAxis.unwrap("some").tickFormat.unwrap("some").hasTag("compact"), true));
    });

    // =========================================================================
    // Display Options
    // =========================================================================

    test("creates bar chart with grid", $ => {
        const chart = $.let(Chart.Bar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["type", variant("String", "Stock")], ["allocation", variant("Float", 60)]]),
            ],
            [{ name: "allocation", color: "teal.solid" }],
            { showGrid: true }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").showGrid.unwrap("some"), true));
    });

    test("creates bar chart with legend", $ => {
        const chart = $.let(Chart.Bar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["type", variant("String", "Stock")], ["allocation", variant("Float", 60)]]),
            ],
            [{ name: "allocation", color: "teal.solid" }],
            { showLegend: true }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").showLegend.unwrap("some"), true));
    });

    test("creates bar chart with tooltip", $ => {
        const chart = $.let(Chart.Bar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["type", variant("String", "Stock")], ["allocation", variant("Float", 60)]]),
            ],
            [{ name: "allocation", color: "teal.solid" }],
            { showTooltip: true }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").showTooltip.unwrap("some"), true));
    });

    // =========================================================================
    // Dimensions
    // =========================================================================

    test("creates bar chart with custom dimensions", $ => {
        const chart = $.let(Chart.Bar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["type", variant("String", "Stock")], ["allocation", variant("Float", 60)]]),
            ],
            [{ name: "allocation", color: "teal.solid" }],
            { width: 500n, height: 400n }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").width.unwrap("some"), 500n));
        $(assertEast.equal(chart.unwrap("BarChart").height.unwrap("some"), 400n));
    });

    // =========================================================================
    // Complete Examples
    // =========================================================================

    test("creates complete bar chart matching Chakra BarChartBasic example", $ => {
        const chart = $.let(Chart.Bar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["type", variant("String", "Stock")], ["allocation", variant("Float", 60)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["type", variant("String", "Crypto")], ["allocation", variant("Float", 45)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["type", variant("String", "ETF")], ["allocation", variant("Float", 12)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["type", variant("String", "Cash")], ["allocation", variant("Float", 4)]]),
            ],
            [{ name: "allocation", color: "teal.solid" }],
            { xAxis: { dataKey: "type" }, yAxis: { domain: [0, 100] }, showGrid: true }
        ));

        $(assertEast.equal(chart.getTag(), "BarChart"));
        $(assertEast.equal(chart.unwrap("BarChart").series.get(0n).name, "allocation"));
        $(assertEast.equal(chart.unwrap("BarChart").showGrid.unwrap("some"), true));
    });

    test("creates complete stacked bar chart matching Chakra BarChartStacked example", $ => {
        const chart = $.let(Chart.Bar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["windows", variant("Float", 186)], ["mac", variant("Float", 80)], ["linux", variant("Float", 120)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "February")], ["windows", variant("Float", 165)], ["mac", variant("Float", 95)], ["linux", variant("Float", 110)]]),
            ],
            [
                { name: "windows", color: "teal.solid", stackId: "a" },
                { name: "mac", color: "purple.solid", stackId: "a" },
                { name: "linux", color: "blue.solid", stackId: "a" },
            ],
            { xAxis: { dataKey: "month" }, showGrid: true, showTooltip: true, showLegend: true }
        ));

        $(assertEast.equal(chart.unwrap("BarChart").series.size(), 3n));
        $(assertEast.equal(chart.unwrap("BarChart").series.get(0n).stackId.unwrap("some"), "a"));
        $(assertEast.equal(chart.unwrap("BarChart").showLegend.unwrap("some"), true));
    });
});
