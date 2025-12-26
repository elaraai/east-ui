/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Chart } from "../../src/index.js";

describeEast("Chart.Scatter", (test) => {
    // =========================================================================
    // Basic Scatter Charts
    // =========================================================================

    test("creates basic scatter chart", $ => {
        const chart = $.let(Chart.Scatter(
            [
                { temp: 10, sales: 30 },
                { temp: 15, sales: 50 },
                { temp: 20, sales: 80 },
            ],
            { temp: { color: "teal.solid" } }
        ));

        $(assertEast.equal(chart.getTag(), "ScatterChart"));
        $(assertEast.equal(chart.unwrap("ScatterChart").series.size(), 1n));
        $(assertEast.equal(chart.unwrap("ScatterChart").series.get(0n).name, "temp"));
        $(assertEast.equal(chart.unwrap("ScatterChart").series.get(0n).color.unwrap("some"), "teal.solid"));
    });

    test("creates scatter chart with array series spec", $ => {
        const chart = $.let(Chart.Scatter(
            [
                { temp: 10, sales: 30 },
            ],
            ["temp"]
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").series.size(), 1n));
        $(assertEast.equal(chart.unwrap("ScatterChart").series.get(0n).name, "temp"));
    });

    test("creates scatter chart with x and y data keys", $ => {
        const chart = $.let(Chart.Scatter(
            [
                { temp: 10, sales: 30 },
            ],
            { temp: { color: "teal.solid" } },
            {
                xDataKey: "temp",
                yDataKey: "sales"
            }
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").xDataKey.unwrap("some"), "temp"));
        $(assertEast.equal(chart.unwrap("ScatterChart").yDataKey.unwrap("some"), "sales"));
    });

    // =========================================================================
    // Multiple Series
    // =========================================================================

    test("creates scatter chart with multiple series", $ => {
        const chart = $.let(Chart.Scatter(
            [
                { x: 10, y: 30, size: 5 },
                { x: 20, y: 40, size: 8 },
            ],
            {
                x: { color: "blue.solid", label: "X Position" },
                y: { color: "green.solid", label: "Y Position" },
            }
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap("ScatterChart").series.get(0n).name, "x"));
        $(assertEast.equal(chart.unwrap("ScatterChart").series.get(0n).label.unwrap("some"), "X Position"));
    });

    // =========================================================================
    // Axis Configuration
    // =========================================================================

    test("creates scatter chart with x-axis configuration", $ => {
        const chart = $.let(Chart.Scatter(
            [
                { temp: 10, sales: 30 },
            ],
            { temp: { color: "teal.solid" } },
            { xAxis: Chart.Axis({ dataKey: "temp", label: "Temperature" }) }
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").xAxis.unwrap("some").dataKey.unwrap("some"), "temp"));
        $(assertEast.equal(chart.unwrap("ScatterChart").xAxis.unwrap("some").label.unwrap("some"), "Temperature"));
    });

    test("creates scatter chart with y-axis configuration", $ => {
        const chart = $.let(Chart.Scatter(
            [
                { temp: 10, sales: 30 },
            ],
            { temp: { color: "teal.solid" } },
            { yAxis: Chart.Axis({ dataKey: "sales", label: "Sales" }) }
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").yAxis.unwrap("some").dataKey.unwrap("some"), "sales"));
        $(assertEast.equal(chart.unwrap("ScatterChart").yAxis.unwrap("some").label.unwrap("some"), "Sales"));
    });

    test("creates scatter chart with axis domain", $ => {
        const chart = $.let(Chart.Scatter(
            [
                { temp: 10, sales: 30 },
            ],
            { temp: { color: "teal.solid" } },
            {
                xAxis: Chart.Axis({ domain: [0, 50] }),
                yAxis: Chart.Axis({ domain: [0, 100] })
            }
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").xAxis.hasTag("some"), true));
        $(assertEast.equal(chart.unwrap("ScatterChart").yAxis.hasTag("some"), true));
    });

    // =========================================================================
    // Display Options
    // =========================================================================

    test("creates scatter chart with grid", $ => {
        const chart = $.let(Chart.Scatter(
            [
                { temp: 10, sales: 30 },
            ],
            { temp: { color: "teal.solid" } },
            { grid: Chart.Grid({ show: true }) }
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").grid.unwrap("some").show.unwrap("some"), true));
    });

    test("creates scatter chart with legend", $ => {
        const chart = $.let(Chart.Scatter(
            [
                { temp: 10, sales: 30 },
            ],
            { temp: { color: "teal.solid" } },
            { legend: Chart.Legend({ show: true }) }
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").legend.unwrap("some").show.unwrap("some"), true));
    });

    test("creates scatter chart with tooltip", $ => {
        const chart = $.let(Chart.Scatter(
            [
                { temp: 10, sales: 30 },
            ],
            { temp: { color: "teal.solid" } },
            { tooltip: Chart.Tooltip({ show: true }) }
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").tooltip.unwrap("some").show.unwrap("some"), true));
    });

    // =========================================================================
    // Point Size
    // =========================================================================

    test("creates scatter chart with custom point size", $ => {
        const chart = $.let(Chart.Scatter(
            [
                { temp: 10, sales: 30 },
            ],
            { temp: { color: "teal.solid" } },
            { pointSize: 8n }
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").pointSize.unwrap("some"), 8n));
    });

    // =========================================================================
    // Margin
    // =========================================================================

    test("creates scatter chart with custom margin", $ => {
        const chart = $.let(Chart.Scatter(
            [
                { temp: 10, sales: 30 },
            ],
            { temp: { color: "teal.solid" } },
            { margin: Chart.Margin({ top: 20n, right: 30n, bottom: 20n, left: 30n }) }
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").margin.unwrap("some").top.unwrap("some"), 20n));
        $(assertEast.equal(chart.unwrap("ScatterChart").margin.unwrap("some").left.unwrap("some"), 30n));
    });

    // =========================================================================
    // Complete Examples
    // =========================================================================

    test("creates complete scatter chart matching Chakra ScatterChartBasic example", $ => {
        const chart = $.let(Chart.Scatter(
            [
                { temp: 10, sales: 30 },
                { temp: 15, sales: 50 },
                { temp: 20, sales: 80 },
            ],
            { temp: { color: "teal.solid" } },
            {
                xDataKey: "temp",
                yDataKey: "sales",
                grid: Chart.Grid({ show: true })
            }
        ));

        $(assertEast.equal(chart.getTag(), "ScatterChart"));
        $(assertEast.equal(chart.unwrap("ScatterChart").series.get(0n).color.unwrap("some"), "teal.solid"));
        $(assertEast.equal(chart.unwrap("ScatterChart").grid.unwrap("some").show.unwrap("some"), true));
    });

    test("creates complete multi-series scatter chart", $ => {
        const chart = $.let(Chart.Scatter(
            [
                { x: 10, y: 30 },
                { x: 20, y: 40 },
            ],
            {
                x: { color: "blue.solid", label: "X Value" },
                y: { color: "green.solid", label: "Y Value" },
            },
            {
                xAxis: Chart.Axis({ domain: [0, 50] }),
                yAxis: Chart.Axis({ domain: [0, 100] }),
                tooltip: Chart.Tooltip({ show: true })
            }
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap("ScatterChart").tooltip.unwrap("some").show.unwrap("some"), true));
    });
});

describeEast("Chart.ScatterMulti", (test) => {
    test("creates scatter chart with multi-series data", $ => {
        const chart = $.let(Chart.ScatterMulti(
            {
                temperature: [
                    { x: 10, value: 30 },
                    { x: 20, value: 50 },
                ],
                humidity: [
                    { x: 10, value: 45 },
                    { x: 25, value: 60 },
                ],
            },
            {
                xDataKey: "x",
                valueKey: "value",
                series: {
                    temperature: { color: "teal.solid" },
                    humidity: { color: "blue.solid" },
                },
            }
        ));

        $(assertEast.equal(chart.getTag(), "ScatterChart"));
        $(assertEast.equal(chart.unwrap("ScatterChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap("ScatterChart").valueKey.unwrap("some"), "value"));
        $(assertEast.equal(chart.unwrap("ScatterChart").dataSeries.hasTag("some"), true));
    });
});
