/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Chart } from "../../src/index.js";

describeEast("Chart.Line", (test) => {
    // =========================================================================
    // Basic Line Charts
    // =========================================================================

    test("creates basic line chart with single series", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10 },
                { month: "February", sale: 95 },
                { month: "March", sale: 87 },
            ],
            { sale: { color: "teal.solid" } }
        ));

        $(assertEast.equal(chart.getTag(), "LineChart"));
        $(assertEast.equal(chart.unwrap("LineChart").series.size(), 1n));
        $(assertEast.equal(chart.unwrap("LineChart").series.get(0n).name, "sale"));
        $(assertEast.equal(chart.unwrap("LineChart").series.get(0n).color.unwrap("some"), "teal.solid"));
    });

    test("creates line chart with x-axis dataKey", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10 },
            ],
            { sale: { color: "teal.solid" } },
            { xAxis: Chart.Axis({ dataKey: "month" }) }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").xAxis.unwrap("some").dataKey.unwrap("some"), "month"));
    });

    // =========================================================================
    // Multiple Series
    // =========================================================================

    test("creates line chart with multiple series", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", mac: 10, linux: 120 },
                { month: "February", mac: 95, linux: 110 },
            ],
            {
                mac: { color: "purple.solid" },
                linux: { color: "blue.solid" },
            },
            { xAxis: Chart.Axis({ dataKey: "month" }) }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap("LineChart").series.get(0n).name, "mac"));
        $(assertEast.equal(chart.unwrap("LineChart").series.get(1n).name, "linux"));
    });

    // =========================================================================
    // Curve Types
    // =========================================================================

    test("creates line chart with natural curve", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10 },
            ],
            { sale: { color: "teal.solid" } },
            { curveType: "natural" }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").curveType.unwrap("some").hasTag("natural"), true));
    });

    test("creates line chart with monotone curve", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10 },
            ],
            { sale: { color: "teal.solid" } },
            { curveType: "monotone" }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").curveType.unwrap("some").hasTag("monotone"), true));
    });

    test("creates line chart with linear curve", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10 },
            ],
            { sale: { color: "teal.solid" } },
            { curveType: "linear" }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").curveType.unwrap("some").hasTag("linear"), true));
    });

    test("creates line chart with step curve", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10 },
            ],
            { sale: { color: "teal.solid" } },
            { curveType: "step" }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").curveType.unwrap("some").hasTag("step"), true));
    });

    // =========================================================================
    // Display Options
    // =========================================================================

    test("creates line chart with grid", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10 },
            ],
            { sale: { color: "teal.solid" } },
            { grid: Chart.Grid({ show: true }) }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").grid.unwrap("some").show.unwrap("some"), true));
    });

    test("creates line chart with legend", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10 },
            ],
            { sale: { color: "teal.solid" } },
            { legend: Chart.Legend({ show: true }) }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").legend.unwrap("some").show.unwrap("some"), true));
    });

    test("creates line chart with tooltip", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10 },
            ],
            { sale: { color: "teal.solid" } },
            { tooltip: Chart.Tooltip({ show: true }) }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").tooltip.unwrap("some").show.unwrap("some"), true));
    });

    test("creates line chart with dots", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10 },
            ],
            { sale: { color: "teal.solid" } },
            { showDots: true }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").showDots.unwrap("some"), true));
    });

    test("creates line chart without dots", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10 },
            ],
            { sale: { color: "teal.solid" } },
            { showDots: false }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").showDots.unwrap("some"), false));
    });

    // =========================================================================
    // Stroke Width
    // =========================================================================

    test("creates line chart with custom stroke width", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10 },
            ],
            { sale: { color: "teal.solid" } },
            { strokeWidth: 4n }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").strokeWidth.unwrap("some"), 4n));
    });

    // =========================================================================
    // Connect Nulls
    // =========================================================================

    test("creates line chart with connectNulls", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10 },
            ],
            { sale: { color: "teal.solid" } },
            { connectNulls: true }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").connectNulls.unwrap("some"), true));
    });

    // =========================================================================
    // Axis Formatting
    // =========================================================================

    test("creates line chart with y-axis domain", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sales: 175 },
                { month: "February", sales: 195 },
            ],
            { sales: { color: "teal.solid" } },
            {
                xAxis: Chart.Axis({ dataKey: "month" }),
                yAxis: Chart.Axis({ domain: [160, 210] })
            }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").xAxis.unwrap("some").dataKey.unwrap("some"), "month"));
        $(assertEast.equal(chart.unwrap("LineChart").yAxis.hasTag("some"), true));
    });

    // =========================================================================
    // Margin
    // =========================================================================

    test("creates line chart with custom margin", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10 },
            ],
            { sale: { color: "teal.solid" } },
            { margin: Chart.Margin({ top: 20n, right: 30n, bottom: 20n, left: 30n }) }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").margin.unwrap("some").top.unwrap("some"), 20n));
        $(assertEast.equal(chart.unwrap("LineChart").margin.unwrap("some").left.unwrap("some"), 30n));
    });

    // =========================================================================
    // Complete Examples
    // =========================================================================

    test("creates complete line chart matching Chakra LineChartBasic example", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10 },
                { month: "February", sale: 95 },
                { month: "March", sale: 87 },
            ],
            { sale: { color: "teal.solid" } },
            {
                xAxis: Chart.Axis({ dataKey: "month" }),
                grid: Chart.Grid({ show: true }),
                tooltip: Chart.Tooltip({ show: true }),
                showDots: false,
                strokeWidth: 2n
            }
        ));

        $(assertEast.equal(chart.getTag(), "LineChart"));
        $(assertEast.equal(chart.unwrap("LineChart").series.get(0n).name, "sale"));
        $(assertEast.equal(chart.unwrap("LineChart").grid.unwrap("some").show.unwrap("some"), true));
    });

    test("creates complete multi-series line chart matching Chakra LineChartMultiple example", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", mac: 10, linux: 120 },
                { month: "February", mac: 95, linux: 110 },
            ],
            {
                mac: { color: "purple.solid" },
                linux: { color: "blue.solid" },
            },
            {
                xAxis: Chart.Axis({ dataKey: "month" }),
                grid: Chart.Grid({ show: true }),
                tooltip: Chart.Tooltip({ show: true }),
                legend: Chart.Legend({ show: true }),
                strokeWidth: 2n
            }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap("LineChart").legend.unwrap("some").show.unwrap("some"), true));
    });
});
