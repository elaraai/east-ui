/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { type ValueTypeOf, LiteralValueType, variant } from "@elaraai/east";
import { describeEast, assertEast } from "../platforms.spec.js";
import { Chart } from "../../src/index.js";

describeEast("Chart.Radar", (test) => {
    // =========================================================================
    // Basic Radar Charts
    // =========================================================================

    test("creates basic radar chart with single series", $ => {
        const chart = $.let(Chart.Radar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["windows", variant("Float", 130)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "February")], ["windows", variant("Float", 120)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "March")], ["windows", variant("Float", 75)]]),
            ],
            [{ name: "windows", color: "teal.solid" }]
        ));

        $(assertEast.equal(chart.getTag(), "RadarChart"));
        $(assertEast.equal(chart.unwrap("RadarChart").series.size(), 1n));
        $(assertEast.equal(chart.unwrap("RadarChart").series.get(0n).name, "windows"));
        $(assertEast.equal(chart.unwrap("RadarChart").series.get(0n).color.unwrap("some"), "teal.solid"));
    });

    test("creates radar chart with dataKey", $ => {
        const chart = $.let(Chart.Radar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["windows", variant("Float", 130)]]),
            ],
            [{ name: "windows", color: "teal.solid" }],
            { dataKey: "month" }
        ));

        $(assertEast.equal(chart.unwrap("RadarChart").dataKey.unwrap("some"), "month"));
    });

    // =========================================================================
    // Multiple Series
    // =========================================================================

    test("creates radar chart with multiple series", $ => {
        const chart = $.let(Chart.Radar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["windows", variant("Float", 30)], ["mac", variant("Float", 100)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "February")], ["windows", variant("Float", 50)], ["mac", variant("Float", 80)]]),
            ],
            [
                { name: "windows", color: "teal.solid" },
                { name: "mac", color: "orange.solid" },
            ],
            { dataKey: "month" }
        ));

        $(assertEast.equal(chart.unwrap("RadarChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap("RadarChart").series.get(0n).name, "windows"));
        $(assertEast.equal(chart.unwrap("RadarChart").series.get(1n).name, "mac"));
    });

    test("creates skills comparison radar chart", $ => {
        const chart = $.let(Chart.Radar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["subject", variant("String", "Math")], ["current", variant("Float", 80)], ["target", variant("Float", 90)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["subject", variant("String", "Science")], ["current", variant("Float", 95)], ["target", variant("Float", 85)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["subject", variant("String", "English")], ["current", variant("Float", 70)], ["target", variant("Float", 80)]]),
            ],
            [
                { name: "current", color: "teal.solid" },
                { name: "target", color: "orange.solid" },
            ],
            { dataKey: "subject" }
        ));

        $(assertEast.equal(chart.unwrap("RadarChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap("RadarChart").dataKey.unwrap("some"), "subject"));
    });

    // =========================================================================
    // Display Options
    // =========================================================================

    test("creates radar chart with grid", $ => {
        const chart = $.let(Chart.Radar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["windows", variant("Float", 130)]]),
            ],
            [{ name: "windows", color: "teal.solid" }],
            { showGrid: true }
        ));

        $(assertEast.equal(chart.unwrap("RadarChart").showGrid.unwrap("some"), true));
    });

    test("creates radar chart with legend", $ => {
        const chart = $.let(Chart.Radar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["windows", variant("Float", 130)]]),
            ],
            [{ name: "windows", color: "teal.solid" }],
            { showLegend: true }
        ));

        $(assertEast.equal(chart.unwrap("RadarChart").showLegend.unwrap("some"), true));
    });

    test("creates radar chart with tooltip", $ => {
        const chart = $.let(Chart.Radar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["windows", variant("Float", 130)]]),
            ],
            [{ name: "windows", color: "teal.solid" }],
            { showTooltip: true }
        ));

        $(assertEast.equal(chart.unwrap("RadarChart").showTooltip.unwrap("some"), true));
    });

    // =========================================================================
    // Fill Opacity
    // =========================================================================

    test("creates radar chart with custom fill opacity", $ => {
        const chart = $.let(Chart.Radar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["windows", variant("Float", 130)]]),
            ],
            [{ name: "windows", color: "teal.solid" }],
            { fillOpacity: 0.5 }
        ));

        $(assertEast.equal(chart.unwrap("RadarChart").fillOpacity.unwrap("some"), 0.5));
    });

    test("creates radar chart with low fill opacity for overlapping series", $ => {
        const chart = $.let(Chart.Radar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["windows", variant("Float", 30)], ["mac", variant("Float", 100)]]),
            ],
            [
                { name: "windows", color: "teal.solid" },
                { name: "mac", color: "orange.solid" },
            ],
            { fillOpacity: 0.2 }
        ));

        $(assertEast.equal(chart.unwrap("RadarChart").fillOpacity.unwrap("some"), 0.2));
    });

    // =========================================================================
    // Dimensions
    // =========================================================================

    test("creates radar chart with custom dimensions", $ => {
        const chart = $.let(Chart.Radar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["windows", variant("Float", 130)]]),
            ],
            [{ name: "windows", color: "teal.solid" }],
            { width: 400n, height: 400n }
        ));

        $(assertEast.equal(chart.unwrap("RadarChart").width.unwrap("some"), 400n));
        $(assertEast.equal(chart.unwrap("RadarChart").height.unwrap("some"), 400n));
    });

    // =========================================================================
    // Complete Examples
    // =========================================================================

    test("creates complete radar chart matching Chakra RadarChartBasic example", $ => {
        const chart = $.let(Chart.Radar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["windows", variant("Float", 130)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "February")], ["windows", variant("Float", 120)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "March")], ["windows", variant("Float", 75)]]),
            ],
            [{ name: "windows", color: "teal.solid" }],
            { dataKey: "month", showGrid: true, fillOpacity: 0.5 }
        ));

        $(assertEast.equal(chart.getTag(), "RadarChart"));
        $(assertEast.equal(chart.unwrap("RadarChart").series.get(0n).name, "windows"));
        $(assertEast.equal(chart.unwrap("RadarChart").dataKey.unwrap("some"), "month"));
        $(assertEast.equal(chart.unwrap("RadarChart").showGrid.unwrap("some"), true));
        $(assertEast.equal(chart.unwrap("RadarChart").fillOpacity.unwrap("some"), 0.5));
    });

    test("creates complete multi-series radar chart matching Chakra RadarChartMultiple example", $ => {
        const chart = $.let(Chart.Radar(
            [
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "January")], ["windows", variant("Float", 30)], ["mac", variant("Float", 100)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "February")], ["windows", variant("Float", 50)], ["mac", variant("Float", 80)]]),
                new Map<string, ValueTypeOf<typeof LiteralValueType>>([["month", variant("String", "March")], ["windows", variant("Float", 70)], ["mac", variant("Float", 60)]]),
            ],
            [
                { name: "windows", color: "teal.solid" },
                { name: "mac", color: "orange.solid" },
            ],
            { dataKey: "month", showGrid: true, showLegend: true, fillOpacity: 0.2 }
        ));

        $(assertEast.equal(chart.unwrap("RadarChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap("RadarChart").showGrid.unwrap("some"), true));
        $(assertEast.equal(chart.unwrap("RadarChart").showLegend.unwrap("some"), true));
        $(assertEast.equal(chart.unwrap("RadarChart").fillOpacity.unwrap("some"), 0.2));
    });
});
