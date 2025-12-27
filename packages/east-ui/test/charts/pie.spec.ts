/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Chart } from "../../src/index.js";
import { none, some } from "@elaraai/east";

describeEast("Chart.Pie", (test) => {
    // =========================================================================
    // Basic Pie Charts
    // =========================================================================

    test("creates basic pie chart", $ => {
        const chart = $.let(Chart.Pie([
            { name: "windows", value: 400, color: some("blue.solid") },
            { name: "mac", value: 300, color: some("orange.solid") },
            { name: "linux", value: 300, color: some("pink.solid") },
            { name: "other", value: 200, color: some("green.solid") },
        ]));

        $(assertEast.equal(chart.unwrap().getTag(), "PieChart"));
        $(assertEast.equal(chart.unwrap().unwrap("PieChart").data.size(), 4n));
        $(assertEast.equal(chart.unwrap().unwrap("PieChart").data.get(0n).name, "windows"));
        $(assertEast.equal(chart.unwrap().unwrap("PieChart").data.get(0n).value, 400));
        $(assertEast.equal(chart.unwrap().unwrap("PieChart").data.get(0n).color.unwrap("some"), "blue.solid"));
    });

    test("creates pie chart with three slices", $ => {
        const chart = $.let(Chart.Pie([
            { name: "windows", value: 400, color: some("blue.solid") },
            { name: "mac", value: 300, color: some("orange.solid") },
            { name: "linux", value: 300, color: some("pink.solid") },
        ]));

        $(assertEast.equal(chart.unwrap().unwrap("PieChart").data.size(), 3n));
        $(assertEast.equal(chart.unwrap().unwrap("PieChart").data.get(0n).name, "windows"));
        $(assertEast.equal(chart.unwrap().unwrap("PieChart").data.get(1n).name, "mac"));
        $(assertEast.equal(chart.unwrap().unwrap("PieChart").data.get(2n).name, "linux"));
    });

    test("creates pie chart without colors (optional)", $ => {
        const chart = $.let(Chart.Pie([
            { name: "windows", value: 400, color: none },
            { name: "mac", value: 300, color: none },
        ]));

        $(assertEast.equal(chart.unwrap().unwrap("PieChart").data.size(), 2n));
        $(assertEast.equal(chart.unwrap().unwrap("PieChart").data.get(0n).color.hasTag("none"), true));
        $(assertEast.equal(chart.unwrap().unwrap("PieChart").data.get(1n).color.hasTag("none"), true));
    });

    // =========================================================================
    // Donut Charts (innerRadius > 0)
    // =========================================================================

    test("creates donut chart with inner radius", $ => {
        const chart = $.let(Chart.Pie(
            [
                { name: "windows", value: 400, color: some("blue.solid") },
                { name: "mac", value: 300, color: some("orange.solid") },
            ],
            {
                innerRadius: 60,
                outerRadius: 80,
            }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("PieChart").innerRadius.unwrap("some"), 60));
        $(assertEast.equal(chart.unwrap().unwrap("PieChart").outerRadius.unwrap("some"), 80));
    });

    test("creates large donut chart for centered text", $ => {
        const chart = $.let(Chart.Pie(
            [
                { name: "windows", value: 400, color: some("blue.solid") },
                { name: "mac", value: 300, color: some("orange.solid") },
                { name: "linux", value: 300, color: some("pink.solid") },
                { name: "other", value: 200, color: some("green.solid") },
            ],
            {
                innerRadius: 80,
                outerRadius: 100,
            }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("PieChart").innerRadius.unwrap("some"), 80));
        $(assertEast.equal(chart.unwrap().unwrap("PieChart").outerRadius.unwrap("some"), 100));
    });

    // =========================================================================
    // Angle Configuration
    // =========================================================================

    test("creates pie chart with custom start angle", $ => {
        const chart = $.let(Chart.Pie(
            [
                { name: "windows", value: 400, color: some("blue.solid") },
            ],
            { startAngle: 90 }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("PieChart").startAngle.unwrap("some"), 90));
    });

    test("creates pie chart with custom end angle", $ => {
        const chart = $.let(Chart.Pie(
            [
                { name: "windows", value: 400, color: some("blue.solid") },
            ],
            { endAngle: 270 }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("PieChart").endAngle.unwrap("some"), 270));
    });

    test("creates semi-circle pie chart", $ => {
        const chart = $.let(Chart.Pie(
            [
                { name: "windows", value: 400, color: some("blue.solid") },
                { name: "mac", value: 300, color: some("orange.solid") },
            ],
            {
                startAngle: 180,
                endAngle: 0,
            }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("PieChart").startAngle.unwrap("some"), 180));
        $(assertEast.equal(chart.unwrap().unwrap("PieChart").endAngle.unwrap("some"), 0));
    });

    // =========================================================================
    // Padding Angle
    // =========================================================================

    test("creates pie chart with padding angle", $ => {
        const chart = $.let(Chart.Pie(
            [
                { name: "windows", value: 400, color: some("blue.solid") },
                { name: "mac", value: 300, color: some("orange.solid") },
            ],
            { paddingAngle: 5 }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("PieChart").paddingAngle.unwrap("some"), 5));
    });

    // =========================================================================
    // Display Options
    // =========================================================================

    test("creates pie chart with labels", $ => {
        const chart = $.let(Chart.Pie(
            [
                { name: "windows", value: 400, color: some("blue.solid") },
            ],
            { showLabels: true }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("PieChart").showLabels.unwrap("some"), true));
    });

    test("creates pie chart with legend", $ => {
        const chart = $.let(Chart.Pie(
            [
                { name: "windows", value: 400, color: some("blue.solid") },
            ],
            { legend: Chart.Legend({ show: true }) }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("PieChart").legend.unwrap("some").show.unwrap("some"), true));
    });

    test("creates pie chart with tooltip", $ => {
        const chart = $.let(Chart.Pie(
            [
                { name: "windows", value: 400, color: some("blue.solid") },
            ],
            { tooltip: Chart.Tooltip({ show: true }) }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("PieChart").tooltip.unwrap("some").show.unwrap("some"), true));
    });

    // =========================================================================
    // Margin
    // =========================================================================

    test("creates pie chart with custom margin", $ => {
        const chart = $.let(Chart.Pie(
            [
                { name: "windows", value: 400, color: some("blue.solid") },
            ],
            { margin: Chart.Margin({ top: 20n, right: 30n, bottom: 20n, left: 30n }) }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("PieChart").margin.unwrap("some").top.unwrap("some"), 20n));
        $(assertEast.equal(chart.unwrap().unwrap("PieChart").margin.unwrap("some").left.unwrap("some"), 30n));
    });

    // =========================================================================
    // Complete Examples from Chakra Reference
    // =========================================================================

    test("creates complete pie chart matching Chakra PieChartBasic example", $ => {
        const chart = $.let(Chart.Pie([
            { name: "windows", value: 400, color: some("blue.solid") },
            { name: "mac", value: 300, color: some("orange.solid") },
            { name: "linux", value: 300, color: some("pink.solid") },
            { name: "other", value: 200, color: some("green.solid") },
        ]));

        $(assertEast.equal(chart.unwrap().getTag(), "PieChart"));
        $(assertEast.equal(chart.unwrap().unwrap("PieChart").data.size(), 4n));
        $(assertEast.equal(chart.unwrap().unwrap("PieChart").data.get(0n).color.unwrap("some"), "blue.solid"));
        $(assertEast.equal(chart.unwrap().unwrap("PieChart").data.get(1n).color.unwrap("some"), "orange.solid"));
        $(assertEast.equal(chart.unwrap().unwrap("PieChart").data.get(2n).color.unwrap("some"), "pink.solid"));
        $(assertEast.equal(chart.unwrap().unwrap("PieChart").data.get(3n).color.unwrap("some"), "green.solid"));
    });

    test("creates complete pie chart with legend matching Chakra PieChartWithLegend example", $ => {
        const chart = $.let(Chart.Pie(
            [
                { name: "windows", value: 400, color: some("blue.solid") },
                { name: "mac", value: 300, color: some("orange.solid") },
                { name: "linux", value: 300, color: some("pink.solid") },
            ],
            { legend: Chart.Legend({ show: true }) }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("PieChart").data.size(), 3n));
        $(assertEast.equal(chart.unwrap().unwrap("PieChart").legend.unwrap("some").show.unwrap("some"), true));
    });

    test("creates complete donut chart matching Chakra DonutChartBasic example", $ => {
        const chart = $.let(Chart.Pie(
            [
                { name: "windows", value: 400, color: some("blue.solid") },
                { name: "mac", value: 300, color: some("orange.solid") },
                { name: "linux", value: 300, color: some("pink.solid") },
                { name: "other", value: 200, color: some("green.solid") },
            ],
            {
                innerRadius: 60,
                outerRadius: 80,
                tooltip: Chart.Tooltip({ show: true }),
            }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("PieChart").innerRadius.unwrap("some"), 60));
        $(assertEast.equal(chart.unwrap().unwrap("PieChart").outerRadius.unwrap("some"), 80));
        $(assertEast.equal(chart.unwrap().unwrap("PieChart").tooltip.unwrap("some").show.unwrap("some"), true));
    });
});
