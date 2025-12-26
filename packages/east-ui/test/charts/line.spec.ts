/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
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
                { month: "January", sale: 10n },
                { month: "February", sale: 95n },
                { month: "March", sale: 87n },
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
                { month: "January", sale: 10n },
            ],
            { sale: { color: "teal.solid" } },
            { xAxis: { dataKey: "month" } }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").xAxis.unwrap("some").dataKey.unwrap("some"), "month"));
    });

    test("creates line chart with array series spec", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
            ],
            ["sale"]
        ));

        $(assertEast.equal(chart.unwrap("LineChart").series.size(), 1n));
        $(assertEast.equal(chart.unwrap("LineChart").series.get(0n).name, "sale"));
    });

    // =========================================================================
    // Multiple Series
    // =========================================================================

    test("creates line chart with multiple series", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", mac: 10.0, linux: 120.0 },
                { month: "February", mac: 95.0, linux: 110.0 },
            ],
            {
                mac: { color: "purple.solid" },
                linux: { color: "blue.solid" },
            },
            { xAxis: { dataKey: "month" } }
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
                { month: "January", sale: 10n },
            ],
            { sale: { color: "teal.solid" } },
            { curveType: "natural" }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").curveType.unwrap("some").hasTag("natural"), true));
    });

    test("creates line chart with monotone curve", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
            ],
            { sale: { color: "teal.solid" } },
            { curveType: "monotone" }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").curveType.unwrap("some").hasTag("monotone"), true));
    });

    test("creates line chart with linear curve", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
            ],
            { sale: { color: "teal.solid" } },
            { curveType: "linear" }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").curveType.unwrap("some").hasTag("linear"), true));
    });

    test("creates line chart with step curve", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
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
                { month: "January", sale: 10n },
            ],
            { sale: { color: "teal.solid" } },
            { grid: Chart.Grid({ show: true }) }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").grid.unwrap("some").show.unwrap("some"), true));
    });

    test("creates line chart with legend", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
            ],
            { sale: { color: "teal.solid" } },
            { legend: Chart.Legend({ show: true }) }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").legend.unwrap("some").show.unwrap("some"), true));
    });

    test("creates line chart with tooltip", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
            ],
            { sale: { color: "teal.solid" } },
            { tooltip: Chart.Tooltip({ show: true }) }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").tooltip.unwrap("some").show.unwrap("some"), true));
    });

    test("creates line chart with dots", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
            ],
            { sale: { color: "teal.solid" } },
            { showDots: true }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").showDots.unwrap("some"), true));
    });

    test("creates line chart without dots", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
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
                { month: "January", sale: 10n },
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
                { month: "January", sale: 10n },
            ],
            { sale: { color: "teal.solid" } },
            { connectNulls: true }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").connectNulls.unwrap("some"), true));
    });

    // =========================================================================
    // Axis Formatting
    // =========================================================================

    test("creates line chart with y-axis", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sales: 175n },
                { month: "February", sales: 195n },
            ],
            { sales: { color: "teal.solid" } },
            {
                xAxis: { dataKey: "month" },
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
                { month: "January", sale: 10n },
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
                { month: "January", sale: 10n },
                { month: "February", sale: 95n },
                { month: "March", sale: 87n },
            ],
            { sale: { color: "teal.solid" } },
            {
                xAxis: { dataKey: "month" },
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

    test("creates complete multi-series line chart", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", mac: 10.0, linux: 120.0 },
                { month: "February", mac: 95.0, linux: 110.0 },
            ],
            {
                mac: { color: "purple.solid" },
                linux: { color: "blue.solid" },
            },
            {
                xAxis: { dataKey: "month" },
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

describeEast("Chart.LineMulti", (test) => {
    // =========================================================================
    // Multi-Series Data (Record Form) - for sparse data
    // =========================================================================

    test("creates line chart with multi-series data", $ => {
        const chart = $.let(Chart.LineMulti(
            {
                revenue: [
                    { month: "January", value: 186n },
                    { month: "February", value: 305n },
                ],
                profit: [
                    { month: "January", value: 80n },
                    { month: "March", value: 150n },
                ],
            },
            {
                xAxis: { dataKey: "month" },
                valueKey: "value",
                series: {
                    revenue: { color: "teal.solid" },
                    profit: { color: "purple.solid" },
                },
            }
        ));

        $(assertEast.equal(chart.getTag(), "LineChart"));
        $(assertEast.equal(chart.unwrap("LineChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap("LineChart").valueKey.unwrap("some"), "value"));
        $(assertEast.equal(chart.unwrap("LineChart").dataSeries.hasTag("some"), true));
    });

    test("creates line chart with multi-series expression data", $ => {
        const revenue = $.let([
            { month: "January", value: 186n },
            { month: "February", value: 305n },
        ]);
        const profit = $.let([
            { month: "January", value: 80n },
            { month: "March", value: 150n },
        ]);
        const chart = $.let(Chart.LineMulti(
            {
                revenue: revenue,
                profit: profit
            },
            {
                xAxis: { dataKey: "month" },
                valueKey: "value",
                series: {
                    revenue: { color: "teal.solid" },
                    profit: { color: "purple.solid" },
                },
            }
        ));

        $(assertEast.equal(chart.getTag(), "LineChart"));
        $(assertEast.equal(chart.unwrap("LineChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap("LineChart").valueKey.unwrap("some"), "value"));
        $(assertEast.equal(chart.unwrap("LineChart").dataSeries.hasTag("some"), true));
    });

    test("creates line chart with multi-series and styling options", $ => {
        const chart = $.let(Chart.LineMulti(
            {
                sales: [
                    { date: "2024-01", amount: 1000n },
                    { date: "2024-02", amount: 1500n },
                ],
                returns: [
                    { date: "2024-01", amount: 50n },
                ],
            },
            {
                xAxis: { dataKey: "date" },
                valueKey: "amount",
                showDots: true,
                series: {
                    sales: { color: "blue.solid", strokeWidth: 2n },
                    returns: { color: "red.solid", strokeDasharray: "5 5" },
                },
            }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap("LineChart").valueKey.unwrap("some"), "amount"));
        $(assertEast.equal(chart.unwrap("LineChart").showDots.unwrap("some"), true));
    });
});
