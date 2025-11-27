/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { type ValueTypeOf, LiteralValueType, variant } from "@elaraai/east";
import { describeEast, assertEast } from "../platforms.spec.js";
import { Chart } from "../../src/index.js";

describeEast("Chart.Scatter", (test) => {
    // =========================================================================
    // Basic Scatter Charts
    // =========================================================================

    test("creates basic scatter chart", $ => {
        const chart = $.let(Chart.Scatter(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["temp", variant("Float", 10)], ["sales", variant("Float", 30)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["temp", variant("Float", 15)], ["sales", variant("Float", 50)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["temp", variant("Float", 20)], ["sales", variant("Float", 80)]]),
            ],
            [{ name: "data", color: "teal.solid" }]
        ));

        $(assertEast.equal(chart.getTag(), "ScatterChart"));
        $(assertEast.equal(chart.unwrap("ScatterChart").series.size(), 1n));
        $(assertEast.equal(chart.unwrap("ScatterChart").series.get(0n).name, "data"));
        $(assertEast.equal(chart.unwrap("ScatterChart").series.get(0n).color.unwrap("some"), "teal.solid"));
    });

    test("creates scatter chart with x and y data keys", $ => {
        const chart = $.let(Chart.Scatter(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["temp", variant("Float", 10)], ["sales", variant("Float", 30)]]),
            ],
            [{ name: "data", color: "teal.solid" }],
            { xDataKey: "temp", yDataKey: "sales" }
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").xDataKey.unwrap("some"), "temp"));
        $(assertEast.equal(chart.unwrap("ScatterChart").yDataKey.unwrap("some"), "sales"));
    });

    // =========================================================================
    // Multiple Groups
    // =========================================================================

    test("creates scatter chart with multiple series (groups)", $ => {
        const chart = $.let(Chart.Scatter(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["id", variant("String", "group1")], ["x", variant("Float", 10)], ["y", variant("Float", 30)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["id", variant("String", "group2")], ["x", variant("Float", 20)], ["y", variant("Float", 40)]]),
            ],
            [
                { name: "group1", label: "Group 1", color: "blue.solid" },
                { name: "group2", label: "Group 2", color: "green.solid" },
            ]
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap("ScatterChart").series.get(0n).name, "group1"));
        $(assertEast.equal(chart.unwrap("ScatterChart").series.get(0n).label.unwrap("some"), "Group 1"));
    });

    // =========================================================================
    // Axis Configuration
    // =========================================================================

    test("creates scatter chart with x-axis configuration", $ => {
        const chart = $.let(Chart.Scatter(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["temp", variant("Float", 10)], ["sales", variant("Float", 30)]]),
            ],
            [{ name: "data", color: "teal.solid" }],
            { xAxis: { dataKey: "temp", label: "Temperature" } }
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").xAxis.unwrap("some").dataKey.unwrap("some"), "temp"));
        $(assertEast.equal(chart.unwrap("ScatterChart").xAxis.unwrap("some").label.unwrap("some"), "Temperature"));
    });

    test("creates scatter chart with y-axis configuration", $ => {
        const chart = $.let(Chart.Scatter(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["temp", variant("Float", 10)], ["sales", variant("Float", 30)]]),
            ],
            [{ name: "data", color: "teal.solid" }],
            { yAxis: { dataKey: "sales", label: "Sales" } }
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").yAxis.unwrap("some").dataKey.unwrap("some"), "sales"));
        $(assertEast.equal(chart.unwrap("ScatterChart").yAxis.unwrap("some").label.unwrap("some"), "Sales"));
    });

    test("creates scatter chart with axis domain", $ => {
        const chart = $.let(Chart.Scatter(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["temp", variant("Float", 10)], ["sales", variant("Float", 30)]]),
            ],
            [{ name: "data", color: "teal.solid" }],
            { xAxis: { domain: [0, 50] }, yAxis: { domain: [0, 100] } }
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
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["temp", variant("Float", 10)], ["sales", variant("Float", 30)]]),
            ],
            [{ name: "data", color: "teal.solid" }],
            { showGrid: true }
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").showGrid.unwrap("some"), true));
    });

    test("creates scatter chart with legend", $ => {
        const chart = $.let(Chart.Scatter(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["temp", variant("Float", 10)], ["sales", variant("Float", 30)]]),
            ],
            [{ name: "data", color: "teal.solid" }],
            { showLegend: true }
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").showLegend.unwrap("some"), true));
    });

    test("creates scatter chart with tooltip", $ => {
        const chart = $.let(Chart.Scatter(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["temp", variant("Float", 10)], ["sales", variant("Float", 30)]]),
            ],
            [{ name: "data", color: "teal.solid" }],
            { showTooltip: true }
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").showTooltip.unwrap("some"), true));
    });

    // =========================================================================
    // Point Size
    // =========================================================================

    test("creates scatter chart with custom point size", $ => {
        const chart = $.let(Chart.Scatter(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["temp", variant("Float", 10)], ["sales", variant("Float", 30)]]),
            ],
            [{ name: "data", color: "teal.solid" }],
            { pointSize: 8n }
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").pointSize.unwrap("some"), 8n));
    });

    // =========================================================================
    // Dimensions
    // =========================================================================

    test("creates scatter chart with custom dimensions", $ => {
        const chart = $.let(Chart.Scatter(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["temp", variant("Float", 10)], ["sales", variant("Float", 30)]]),
            ],
            [{ name: "data", color: "teal.solid" }],
            { width: 500n, height: 400n }
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").width.unwrap("some"), 500n));
        $(assertEast.equal(chart.unwrap("ScatterChart").height.unwrap("some"), 400n));
    });

    // =========================================================================
    // Complete Examples
    // =========================================================================

    test("creates complete scatter chart matching Chakra ScatterChartBasic example", $ => {
        const chart = $.let(Chart.Scatter(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["temp", variant("Float", 10)], ["sales", variant("Float", 30)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["temp", variant("Float", 15)], ["sales", variant("Float", 50)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["temp", variant("Float", 20)], ["sales", variant("Float", 80)]]),
            ],
            [{ name: "data", color: "teal.solid" }],
            { xDataKey: "temp", yDataKey: "sales", showGrid: true }
        ));

        $(assertEast.equal(chart.getTag(), "ScatterChart"));
        $(assertEast.equal(chart.unwrap("ScatterChart").series.get(0n).color.unwrap("some"), "teal.solid"));
        $(assertEast.equal(chart.unwrap("ScatterChart").showGrid.unwrap("some"), true));
    });

    test("creates complete multi-group scatter chart", $ => {
        const chart = $.let(Chart.Scatter(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["id", variant("String", "group1")], ["x", variant("Float", 10)], ["y", variant("Float", 30)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["id", variant("String", "group2")], ["x", variant("Float", 20)], ["y", variant("Float", 40)]]),
            ],
            [
                { name: "group1", label: "Group 1", color: "blue.solid" },
                { name: "group2", label: "Group 2", color: "green.solid" },
            ],
            { xAxis: { domain: [0, 50] }, yAxis: { domain: [0, 100] }, showTooltip: true }
        ));

        $(assertEast.equal(chart.unwrap("ScatterChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap("ScatterChart").showTooltip.unwrap("some"), true));
    });
});
