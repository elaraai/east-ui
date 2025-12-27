/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Chart } from "../../src/index.js";

describeEast("Chart.Radar", (test) => {
    // =========================================================================
    // Basic Radar Charts
    // =========================================================================

    test("creates basic radar chart with single series", $ => {
        const chart = $.let(Chart.Radar(
            [
                { month: "January", windows: 130 },
                { month: "February", windows: 120 },
                { month: "March", windows: 75 },
            ],
            { windows: { color: "teal.solid" } }
        ));

        $(assertEast.equal(chart.unwrap().getTag(), "RadarChart"));
        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").series.size(), 1n));
        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").series.get(0n).name, "windows"));
        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").series.get(0n).color.unwrap("some"), "teal.solid"));
    });

    test("creates radar chart with dataKey", $ => {
        const chart = $.let(Chart.Radar(
            [
                { month: "January", windows: 130 },
            ],
            { windows: { color: "teal.solid" } },
            { dataKey: "month" }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").dataKey.unwrap("some"), "month"));
    });

    // =========================================================================
    // Multiple Series
    // =========================================================================

    test("creates radar chart with multiple series", $ => {
        const chart = $.let(Chart.Radar(
            [
                { month: "January", windows: 30, mac: 100 },
                { month: "February", windows: 50, mac: 80 },
            ],
            {
                windows: { color: "teal.solid" },
                mac: { color: "orange.solid" },
            },
            { dataKey: "month" }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").series.get(0n).name, "windows"));
        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").series.get(1n).name, "mac"));
    });

    test("creates skills comparison radar chart", $ => {
        const chart = $.let(Chart.Radar(
            [
                { subject: "Math", current: 80, target: 90 },
                { subject: "Science", current: 95, target: 85 },
                { subject: "English", current: 70, target: 80 },
            ],
            {
                current: { color: "teal.solid" },
                target: { color: "orange.solid" },
            },
            { dataKey: "subject" }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").dataKey.unwrap("some"), "subject"));
    });

    // =========================================================================
    // Display Options
    // =========================================================================

    test("creates radar chart with grid", $ => {
        const chart = $.let(Chart.Radar(
            [
                { month: "January", windows: 130 },
            ],
            { windows: { color: "teal.solid" } },
            { grid: Chart.Grid({ show: true }) }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").grid.unwrap("some").show.unwrap("some"), true));
    });

    test("creates radar chart with legend", $ => {
        const chart = $.let(Chart.Radar(
            [
                { month: "January", windows: 130 },
            ],
            { windows: { color: "teal.solid" } },
            { legend: Chart.Legend({ show: true }) }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").legend.unwrap("some").show.unwrap("some"), true));
    });

    test("creates radar chart with tooltip", $ => {
        const chart = $.let(Chart.Radar(
            [
                { month: "January", windows: 130 },
            ],
            { windows: { color: "teal.solid" } },
            { tooltip: Chart.Tooltip({ show: true }) }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").tooltip.unwrap("some").show.unwrap("some"), true));
    });

    // =========================================================================
    // Fill Opacity
    // =========================================================================

    test("creates radar chart with custom fill opacity", $ => {
        const chart = $.let(Chart.Radar(
            [
                { month: "January", windows: 130 },
            ],
            { windows: { color: "teal.solid" } },
            { fillOpacity: 0.5 }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").fillOpacity.unwrap("some"), 0.5));
    });

    test("creates radar chart with low fill opacity for overlapping series", $ => {
        const chart = $.let(Chart.Radar(
            [
                { month: "January", windows: 30, mac: 100 },
            ],
            {
                windows: { color: "teal.solid" },
                mac: { color: "orange.solid" },
            },
            { fillOpacity: 0.2 }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").fillOpacity.unwrap("some"), 0.2));
    });

    // =========================================================================
    // Margin
    // =========================================================================

    test("creates radar chart with custom margin", $ => {
        const chart = $.let(Chart.Radar(
            [
                { month: "January", windows: 130 },
            ],
            { windows: { color: "teal.solid" } },
            { margin: Chart.Margin({ top: 20n, right: 30n, bottom: 20n, left: 30n }) }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").margin.unwrap("some").top.unwrap("some"), 20n));
        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").margin.unwrap("some").left.unwrap("some"), 30n));
    });

    // =========================================================================
    // Complete Examples
    // =========================================================================

    test("creates complete radar chart matching Chakra RadarChartBasic example", $ => {
        const chart = $.let(Chart.Radar(
            [
                { month: "January", windows: 130 },
                { month: "February", windows: 120 },
                { month: "March", windows: 75 },
            ],
            { windows: { color: "teal.solid" } },
            {
                dataKey: "month",
                grid: Chart.Grid({ show: true }),
                fillOpacity: 0.5
            }
        ));

        $(assertEast.equal(chart.unwrap().getTag(), "RadarChart"));
        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").series.get(0n).name, "windows"));
        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").dataKey.unwrap("some"), "month"));
        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").grid.unwrap("some").show.unwrap("some"), true));
        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").fillOpacity.unwrap("some"), 0.5));
    });

    test("creates complete multi-series radar chart matching Chakra RadarChartMultiple example", $ => {
        const chart = $.let(Chart.Radar(
            [
                { month: "January", windows: 30, mac: 100 },
                { month: "February", windows: 50, mac: 80 },
                { month: "March", windows: 70, mac: 60 },
            ],
            {
                windows: { color: "teal.solid" },
                mac: { color: "orange.solid" },
            },
            {
                dataKey: "month",
                grid: Chart.Grid({ show: true }),
                legend: Chart.Legend({ show: true }),
                fillOpacity: 0.2
            }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").grid.unwrap("some").show.unwrap("some"), true));
        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").legend.unwrap("some").show.unwrap("some"), true));
        $(assertEast.equal(chart.unwrap().unwrap("RadarChart").fillOpacity.unwrap("some"), 0.2));
    });
});
