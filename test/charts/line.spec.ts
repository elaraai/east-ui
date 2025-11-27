/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { type ValueTypeOf, LiteralValueType, variant } from "@elaraai/east";
import { describeEast, assertEast } from "../platforms.spec.js";
import { Chart } from "../../src/index.js";

describeEast("Chart.Line", (test) => {
    // =========================================================================
    // Basic Line Charts
    // =========================================================================

    test("creates basic line chart with single series", $ => {
        const chart = $.let(Chart.Line(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["sale", variant("Float", 10)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "February")], ["sale", variant("Float", 95)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "March")], ["sale", variant("Float", 87)]]),
            ],
            [{ name: "sale", color: "teal.solid" }]
        ));

        $(assertEast.equal(chart.getTag(), "LineChart"));
        $(assertEast.equal(chart.unwrap("LineChart").series.size(), 1n));
        $(assertEast.equal(chart.unwrap("LineChart").series.get(0n).name, "sale"));
        $(assertEast.equal(chart.unwrap("LineChart").series.get(0n).color.unwrap("some"), "teal.solid"));
    });

    test("creates line chart with x-axis dataKey", $ => {
        const chart = $.let(Chart.Line(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["sale", variant("Float", 10)]]),
            ],
            [{ name: "sale", color: "teal.solid" }],
            { xAxis: { dataKey: "month" } }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").xAxis.unwrap("some").dataKey.unwrap("some"), "month"));
    });

    // =========================================================================
    // Multiple Series
    // =========================================================================

    test("creates line chart with multiple series", $ => {
        const chart = $.let(Chart.Line(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["mac", variant("Float", 10)], ["linux", variant("Float", 120)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "February")], ["mac", variant("Float", 95)], ["linux", variant("Float", 110)]]),
            ],
            [
                { name: "mac", color: "purple.solid" },
                { name: "linux", color: "blue.solid" },
            ],
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
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["sale", variant("Float", 10)]]),
            ],
            [{ name: "sale", color: "teal.solid" }],
            { curveType: "natural" }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").curveType.unwrap("some").hasTag("natural"), true));
    });

    test("creates line chart with monotone curve", $ => {
        const chart = $.let(Chart.Line(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["sale", variant("Float", 10)]]),
            ],
            [{ name: "sale", color: "teal.solid" }],
            { curveType: "monotone" }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").curveType.unwrap("some").hasTag("monotone"), true));
    });

    test("creates line chart with linear curve", $ => {
        const chart = $.let(Chart.Line(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["sale", variant("Float", 10)]]),
            ],
            [{ name: "sale", color: "teal.solid" }],
            { curveType: "linear" }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").curveType.unwrap("some").hasTag("linear"), true));
    });

    test("creates line chart with step curve", $ => {
        const chart = $.let(Chart.Line(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["sale", variant("Float", 10)]]),
            ],
            [{ name: "sale", color: "teal.solid" }],
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
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["sale", variant("Float", 10)]]),
            ],
            [{ name: "sale", color: "teal.solid" }],
            { showGrid: true }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").showGrid.unwrap("some"), true));
    });

    test("creates line chart with legend", $ => {
        const chart = $.let(Chart.Line(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["sale", variant("Float", 10)]]),
            ],
            [{ name: "sale", color: "teal.solid" }],
            { showLegend: true }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").showLegend.unwrap("some"), true));
    });

    test("creates line chart with tooltip", $ => {
        const chart = $.let(Chart.Line(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["sale", variant("Float", 10)]]),
            ],
            [{ name: "sale", color: "teal.solid" }],
            { showTooltip: true }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").showTooltip.unwrap("some"), true));
    });

    test("creates line chart with dots", $ => {
        const chart = $.let(Chart.Line(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["sale", variant("Float", 10)]]),
            ],
            [{ name: "sale", color: "teal.solid" }],
            { showDots: true }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").showDots.unwrap("some"), true));
    });

    test("creates line chart without dots", $ => {
        const chart = $.let(Chart.Line(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["sale", variant("Float", 10)]]),
            ],
            [{ name: "sale", color: "teal.solid" }],
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
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["sale", variant("Float", 10)]]),
            ],
            [{ name: "sale", color: "teal.solid" }],
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
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["sale", variant("Float", 10)]]),
            ],
            [{ name: "sale", color: "teal.solid" }],
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
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["sales", variant("Float", 175)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "February")], ["sales", variant("Float", 195)]]),
            ],
            [{ name: "sales", color: "teal.solid" }],
            { xAxis: { dataKey: "month" }, yAxis: { domain: [160, 210] } }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").xAxis.unwrap("some").dataKey.unwrap("some"), "month"));
        $(assertEast.equal(chart.unwrap("LineChart").yAxis.hasTag("some"), true));
    });

    // =========================================================================
    // Dimensions
    // =========================================================================

    test("creates line chart with custom dimensions", $ => {
        const chart = $.let(Chart.Line(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["sale", variant("Float", 10)]]),
            ],
            [{ name: "sale", color: "teal.solid" }],
            { width: 600n, height: 400n }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").width.unwrap("some"), 600n));
        $(assertEast.equal(chart.unwrap("LineChart").height.unwrap("some"), 400n));
    });

    // =========================================================================
    // Complete Examples
    // =========================================================================

    test("creates complete line chart matching Chakra LineChartBasic example", $ => {
        const chart = $.let(Chart.Line(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["sale", variant("Float", 10)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "February")], ["sale", variant("Float", 95)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "March")], ["sale", variant("Float", 87)]]),
            ],
            [{ name: "sale", color: "teal.solid" }],
            { xAxis: { dataKey: "month" }, showGrid: true, showTooltip: true, showDots: false, strokeWidth: 2n }
        ));

        $(assertEast.equal(chart.getTag(), "LineChart"));
        $(assertEast.equal(chart.unwrap("LineChart").series.get(0n).name, "sale"));
        $(assertEast.equal(chart.unwrap("LineChart").showGrid.unwrap("some"), true));
    });

    test("creates complete multi-series line chart matching Chakra LineChartMultiple example", $ => {
        const chart = $.let(Chart.Line(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["mac", variant("Float", 10)], ["linux", variant("Float", 120)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "February")], ["mac", variant("Float", 95)], ["linux", variant("Float", 110)]]),
            ],
            [
                { name: "mac", color: "purple.solid" },
                { name: "linux", color: "blue.solid" },
            ],
            { xAxis: { dataKey: "month" }, showGrid: true, showTooltip: true, showLegend: true, strokeWidth: 2n }
        ));

        $(assertEast.equal(chart.unwrap("LineChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap("LineChart").showLegend.unwrap("some"), true));
    });
});
