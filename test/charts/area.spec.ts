/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { type ValueTypeOf, LiteralValueType, variant } from "@elaraai/east";
import { describeEast, assertEast } from "../platforms.spec.js";
import { Chart } from "../../src/index.js";

describeEast("Chart.Area", (test) => {
    // =========================================================================
    // Basic Area Charts
    // =========================================================================

    test("creates basic area chart with single series", $ => {
        const chart = $.let(Chart.Area(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["revenue", variant("Float", 186)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "February")], ["revenue", variant("Float", 305)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "March")], ["revenue", variant("Float", 237)]]),
            ],
            [{ name: "revenue", color: "teal.solid" }]
        ));

        $(assertEast.equal(chart.getTag(), "AreaChart"));
        $(assertEast.equal(chart.unwrap("AreaChart").series.size(), 1n));
        $(assertEast.equal(chart.unwrap("AreaChart").series.get(0n).name, "revenue"));
        $(assertEast.equal(chart.unwrap("AreaChart").series.get(0n).color.unwrap("some"), "teal.solid"));
    });

    test("creates area chart with multiple series", $ => {
        const chart = $.let(Chart.Area(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["windows", variant("Float", 186)], ["mac", variant("Float", 80)], ["linux", variant("Float", 120)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "February")], ["windows", variant("Float", 165)], ["mac", variant("Float", 95)], ["linux", variant("Float", 110)]]),
            ],
            [
                { name: "windows", color: "teal.solid" },
                { name: "mac", color: "purple.solid" },
                { name: "linux", color: "blue.solid" },
            ]
        ));

        $(assertEast.equal(chart.getTag(), "AreaChart"));
        $(assertEast.equal(chart.unwrap("AreaChart").series.size(), 3n));
        $(assertEast.equal(chart.unwrap("AreaChart").series.get(0n).name, "windows"));
        $(assertEast.equal(chart.unwrap("AreaChart").series.get(1n).name, "mac"));
        $(assertEast.equal(chart.unwrap("AreaChart").series.get(2n).name, "linux"));
    });

    // =========================================================================
    // Stacked Area Charts
    // =========================================================================

    test("creates stacked area chart", $ => {
        const chart = $.let(Chart.Area(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["windows", variant("Float", 186)], ["mac", variant("Float", 80)], ["linux", variant("Float", 120)]]),
            ],
            [
                { name: "windows", color: "teal.solid", stackId: "a" },
                { name: "mac", color: "purple.solid", stackId: "a" },
                { name: "linux", color: "blue.solid", stackId: "a" },
            ],
            { stacked: true }
        ));

        $(assertEast.equal(chart.unwrap("AreaChart").stacked.unwrap("some"), true));
        $(assertEast.equal(chart.unwrap("AreaChart").series.get(0n).stackId.unwrap("some"), "a"));
    });

    test("creates 100% stacked area chart with stackOffset expand", $ => {
        const chart = $.let(Chart.Area(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["windows", variant("Float", 186)], ["mac", variant("Float", 80)]]),
            ],
            [
                { name: "windows", color: "teal.solid" },
                { name: "mac", color: "purple.solid" },
            ],
            { stacked: true, stackOffset: "expand" }
        ));

        $(assertEast.equal(chart.unwrap("AreaChart").stacked.unwrap("some"), true));
        $(assertEast.equal(chart.unwrap("AreaChart").stackOffset.unwrap("some").hasTag("expand"), true));
    });

    // =========================================================================
    // Axis Configuration
    // =========================================================================

    test("creates area chart with x-axis dataKey", $ => {
        const chart = $.let(Chart.Area(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["revenue", variant("Float", 186)]]),
            ],
            [{ name: "revenue", color: "teal.solid" }],
            { xAxis: { dataKey: "month" } }
        ));

        $(assertEast.equal(chart.unwrap("AreaChart").xAxis.hasTag("some"), true));
        $(assertEast.equal(chart.unwrap("AreaChart").xAxis.unwrap("some").dataKey.unwrap("some"), "month"));
    });

    test("creates area chart with y-axis percent tick format", $ => {
        const chart = $.let(Chart.Area(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["revenue", variant("Float", 186)]]),
            ],
            [{ name: "revenue", color: "teal.solid" }],
            { yAxis: { tickFormat: "percent" } }
        ));

        $(assertEast.equal(chart.unwrap("AreaChart").yAxis.hasTag("some"), true));
        $(assertEast.equal(chart.unwrap("AreaChart").yAxis.unwrap("some").tickFormat.unwrap("some").hasTag("percent"), true));
    });

    // =========================================================================
    // Curve Types
    // =========================================================================

    test("creates area chart with natural curve", $ => {
        const chart = $.let(Chart.Area(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["revenue", variant("Float", 186)]]),
            ],
            [{ name: "revenue", color: "teal.solid" }],
            { curveType: "natural" }
        ));

        $(assertEast.equal(chart.unwrap("AreaChart").curveType.unwrap("some").hasTag("natural"), true));
    });

    test("creates area chart with monotone curve", $ => {
        const chart = $.let(Chart.Area(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["revenue", variant("Float", 186)]]),
            ],
            [{ name: "revenue", color: "teal.solid" }],
            { curveType: "monotone" }
        ));

        $(assertEast.equal(chart.unwrap("AreaChart").curveType.unwrap("some").hasTag("monotone"), true));
    });

    // =========================================================================
    // Display Options
    // =========================================================================

    test("creates area chart with grid", $ => {
        const chart = $.let(Chart.Area(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["revenue", variant("Float", 186)]]),
            ],
            [{ name: "revenue", color: "teal.solid" }],
            { showGrid: true }
        ));

        $(assertEast.equal(chart.unwrap("AreaChart").showGrid.unwrap("some"), true));
    });

    test("creates area chart with legend", $ => {
        const chart = $.let(Chart.Area(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["revenue", variant("Float", 186)]]),
            ],
            [{ name: "revenue", color: "teal.solid" }],
            { showLegend: true }
        ));

        $(assertEast.equal(chart.unwrap("AreaChart").showLegend.unwrap("some"), true));
    });

    test("creates area chart with tooltip", $ => {
        const chart = $.let(Chart.Area(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["revenue", variant("Float", 186)]]),
            ],
            [{ name: "revenue", color: "teal.solid" }],
            { showTooltip: true }
        ));

        $(assertEast.equal(chart.unwrap("AreaChart").showTooltip.unwrap("some"), true));
    });

    test("creates area chart with custom fill opacity", $ => {
        const chart = $.let(Chart.Area(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["revenue", variant("Float", 186)]]),
            ],
            [{ name: "revenue", color: "teal.solid" }],
            { fillOpacity: 0.3 }
        ));

        $(assertEast.equal(chart.unwrap("AreaChart").fillOpacity.unwrap("some"), 0.3));
    });

    // =========================================================================
    // Dimensions
    // =========================================================================

    test("creates area chart with custom dimensions", $ => {
        const chart = $.let(Chart.Area(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["revenue", variant("Float", 186)]]),
            ],
            [{ name: "revenue", color: "teal.solid" }],
            { width: 400n, height: 300n }
        ));

        $(assertEast.equal(chart.unwrap("AreaChart").width.unwrap("some"), 400n));
        $(assertEast.equal(chart.unwrap("AreaChart").height.unwrap("some"), 300n));
    });

    // =========================================================================
    // Complete Example
    // =========================================================================

    test("creates complete area chart matching Chakra example", $ => {
        const chart = $.let(Chart.Area(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["windows", variant("Float", 186)], ["mac", variant("Float", 80)], ["linux", variant("Float", 120)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "February")], ["windows", variant("Float", 165)], ["mac", variant("Float", 95)], ["linux", variant("Float", 110)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "March")], ["windows", variant("Float", 190)], ["mac", variant("Float", 87)], ["linux", variant("Float", 125)]]),
            ],
            [
                { name: "windows", color: "teal.solid", stackId: "a" },
                { name: "mac", color: "purple.solid", stackId: "a" },
                { name: "linux", color: "blue.solid", stackId: "a" },
            ],
            { xAxis: { dataKey: "month" }, showGrid: true, showTooltip: true, showLegend: true, fillOpacity: 0.2 }
        ));

        $(assertEast.equal(chart.getTag(), "AreaChart"));
        $(assertEast.equal(chart.unwrap("AreaChart").series.size(), 3n));
        $(assertEast.equal(chart.unwrap("AreaChart").showGrid.unwrap("some"), true));
        $(assertEast.equal(chart.unwrap("AreaChart").fillOpacity.unwrap("some"), 0.2));
    });
});
