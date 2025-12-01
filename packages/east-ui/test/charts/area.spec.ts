/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Chart } from "../../src/index.js";

describeEast("Chart.Area", (test) => {
    // =========================================================================
    // Basic Area Charts
    // =========================================================================

    test("creates basic area chart with single series", $ => {
        const chart = $.let(Chart.Area(
            [
                { "month": "January", "revenue": 186 },
                { "month": "February", "revenue": 305 },
                { "month": "March", "revenue": 237 },
            ], {
            revenue: { color: "teal.solid" }
        }));

        $(assertEast.equal(chart.getTag(), "AreaChart"));
        $(assertEast.equal(chart.unwrap("AreaChart").series.size(), 1n));
        $(assertEast.equal(chart.unwrap("AreaChart").series.get(0n).name, "revenue"));
        $(assertEast.equal(chart.unwrap("AreaChart").series.get(0n).color.unwrap("some"), "teal.solid"));
    });

    test("creates area chart with multiple series", $ => {
        const chart = $.let(Chart.Area(
            [
                { month: "January", windows: 186, mac: 80, linux: 120 },
                { month: "February", windows: 165, mac: 95, linux: 110 },
            ],
            {
                windows: { color: "teal.solid" },
                mac: { color: "purple.solid" },
                linux: { color: "blue.solid" },
            }
        ));

        $(assertEast.equal(chart.getTag(), "AreaChart"));
        $(assertEast.equal(chart.unwrap("AreaChart").series.size(), 3n));
    });

    // =========================================================================
    // Stacked Area Charts
    // =========================================================================

    test("creates stacked area chart", $ => {
        const chart = $.let(Chart.Area(
            [
                { month: "January", windows: 186, mac: 80, linux: 120 },
            ],
            {
                windows: { color: "teal.solid", stackId: "a" },
                mac: { color: "purple.solid", stackId: "a" },
                linux: { color: "blue.solid", stackId: "a" },
            },
            { stacked: true }
        ));

        $(assertEast.equal(chart.unwrap("AreaChart").stacked.unwrap("some"), true));
        $(assertEast.equal(chart.unwrap("AreaChart").series.get(0n).stackId.unwrap("some"), "a"));
    });

    test("creates 100% stacked area chart with stackOffset expand", $ => {
        const chart = $.let(Chart.Area(
            [
                { month: "January", windows: 186, mac: 80 },
            ],
            {
                windows: { color: "teal.solid" },
                mac: { color: "purple.solid" },
            },
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
                { month: "January", revenue: 186 },
            ],
            { revenue: { color: "teal.solid" } },
            { xAxis: Chart.Axis({ dataKey: "month" }) }
        ));

        $(assertEast.equal(chart.unwrap("AreaChart").xAxis.hasTag("some"), true));
        $(assertEast.equal(chart.unwrap("AreaChart").xAxis.unwrap("some").dataKey.unwrap("some"), "month"));
    });

    test("creates area chart with y-axis percent tick format", $ => {
        const chart = $.let(Chart.Area(
            [
                { month: "January", revenue: 186 },
            ],
            { revenue: { color: "teal.solid" } },
            { yAxis: Chart.Axis({ tickFormat: "percent" }) }
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
                { month: "January", revenue: 186 },
            ],
            { revenue: { color: "teal.solid" } },
            { curveType: "natural" }
        ));

        $(assertEast.equal(chart.unwrap("AreaChart").curveType.unwrap("some").hasTag("natural"), true));
    });

    test("creates area chart with monotone curve", $ => {
        const chart = $.let(Chart.Area(
            [
                { month: "January", revenue: 186 },
            ],
            { revenue: { color: "teal.solid" } },
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
                { month: "January", revenue: 186 },
            ],
            { revenue: { color: "teal.solid" } },
            { grid: Chart.Grid({ show: true }) }
        ));

        $(assertEast.equal(chart.unwrap("AreaChart").grid.unwrap("some").show.unwrap("some"), true));
    });

    test("creates area chart with legend", $ => {
        const chart = $.let(Chart.Area(
            [
                { month: "January", revenue: 186 },
            ],
            { revenue: { color: "teal.solid" } },
            { legend: Chart.Legend({ show: true }) }
        ));

        $(assertEast.equal(chart.unwrap("AreaChart").legend.unwrap("some").show.unwrap("some"), true));
    });

    test("creates area chart with tooltip", $ => {
        const chart = $.let(Chart.Area(
            [
                { month: "January", revenue: 186 },
            ],
            { revenue: { color: "teal.solid" } },
            { tooltip: Chart.Tooltip({ show: true }) }
        ));

        $(assertEast.equal(chart.unwrap("AreaChart").tooltip.unwrap("some").show.unwrap("some"), true));
    });

    test("creates area chart with custom fill opacity", $ => {
        const chart = $.let(Chart.Area(
            [
                { month: "January", revenue: 186 },
            ],
            { revenue: { color: "teal.solid" } },
            { fillOpacity: 0.3 }
        ));

        $(assertEast.equal(chart.unwrap("AreaChart").fillOpacity.unwrap("some"), 0.3));
    });

    // =========================================================================
    // Margin
    // =========================================================================

    test("creates area chart with custom margin", $ => {
        const chart = $.let(Chart.Area(
            [
                { month: "January", revenue: 186 },
            ],
            { revenue: { color: "teal.solid" } },
            { margin: Chart.Margin({ top: 20n, right: 30n, bottom: 20n, left: 30n }) }
        ));

        $(assertEast.equal(chart.unwrap("AreaChart").margin.unwrap("some").top.unwrap("some"), 20n));
        $(assertEast.equal(chart.unwrap("AreaChart").margin.unwrap("some").left.unwrap("some"), 30n));
    });

    // =========================================================================
    // Complete Example
    // =========================================================================

    test("creates complete area chart matching Chakra example", $ => {
        const chart = $.let(Chart.Area(
            [
                { month: "January", windows: 186, mac: 80, linux: 120 },
                { month: "February", windows: 165, mac: 95, linux: 110 },
                { month: "March", windows: 190, mac: 87, linux: 125 },
            ],
            {
                windows: { color: "teal.solid", stackId: "a" },
                mac: { color: "purple.solid", stackId: "a" },
                linux: { color: "blue.solid", stackId: "a" },
            },
            {
                xAxis: Chart.Axis({ dataKey: "month" }),
                stacked: true,
                stackOffset: "expand",
                grid: Chart.Grid({ show: true }),
                tooltip: Chart.Tooltip({ show: true }),
                legend: Chart.Legend({ show: true }),
                fillOpacity: 0.2,
            }
        ));

        $(assertEast.equal(chart.getTag(), "AreaChart"));
        $(assertEast.equal(chart.unwrap("AreaChart").series.size(), 3n));
        $(assertEast.equal(chart.unwrap("AreaChart").grid.unwrap("some").show.unwrap("some"), true));
        $(assertEast.equal(chart.unwrap("AreaChart").fillOpacity.unwrap("some"), 0.2));
    });
});
