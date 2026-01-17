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

        $(assertEast.equal(chart.unwrap().getTag(), "LineChart"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").series.size(), 1n));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").series.get(0n).name, "sale"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").series.get(0n).color.unwrap("some"), "teal.solid"));
    });

    test("creates line chart with x-axis dataKey", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
            ],
            { sale: { color: "teal.solid" } },
            { xAxis: { dataKey: "month" } }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").xAxis.unwrap("some").dataKey.unwrap("some"), "month"));
    });

    test("creates line chart with array series spec", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
            ],
            ["sale"]
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").series.size(), 1n));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").series.get(0n).name, "sale"));
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

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").series.get(0n).name, "mac"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").series.get(1n).name, "linux"));
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

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").curveType.unwrap("some").hasTag("natural"), true));
    });

    test("creates line chart with monotone curve", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
            ],
            { sale: { color: "teal.solid" } },
            { curveType: "monotone" }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").curveType.unwrap("some").hasTag("monotone"), true));
    });

    test("creates line chart with linear curve", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
            ],
            { sale: { color: "teal.solid" } },
            { curveType: "linear" }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").curveType.unwrap("some").hasTag("linear"), true));
    });

    test("creates line chart with step curve", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
            ],
            { sale: { color: "teal.solid" } },
            { curveType: "step" }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").curveType.unwrap("some").hasTag("step"), true));
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
            { grid: { show: true } }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").grid.unwrap("some").show.unwrap("some"), true));
    });

    test("creates line chart with legend", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
            ],
            { sale: { color: "teal.solid" } },
            { legend: { show: true } }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").legend.unwrap("some").show.unwrap("some"), true));
    });

    test("creates line chart with tooltip", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
            ],
            { sale: { color: "teal.solid" } },
            { tooltip: { show: true } }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").tooltip.unwrap("some").show.unwrap("some"), true));
    });

    test("creates line chart with dots", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
            ],
            { sale: { color: "teal.solid" } },
            { showDots: true }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").showDots.unwrap("some"), true));
    });

    test("creates line chart without dots", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
            ],
            { sale: { color: "teal.solid" } },
            { showDots: false }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").showDots.unwrap("some"), false));
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

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").strokeWidth.unwrap("some"), 4n));
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

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").connectNulls.unwrap("some"), true));
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
                yAxis: { domain: [160, 210] }
            }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").xAxis.unwrap("some").dataKey.unwrap("some"), "month"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").yAxis.hasTag("some"), true));
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
            { margin: { top: 20n, right: 30n, bottom: 20n, left: 30n } }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").margin.unwrap("some").top.unwrap("some"), 20n));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").margin.unwrap("some").left.unwrap("some"), 30n));
    });

    // =========================================================================
    // Brush
    // =========================================================================

    test("creates line chart with brush enabled", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
                { month: "February", sale: 95n },
                { month: "March", sale: 87n },
            ],
            { sale: { color: "teal.solid" } },
            { xAxis: { dataKey: "month" }, brush: {} }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").brush.hasTag("some"), true));
    });

    test("creates line chart with brush dataKey", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
            ],
            { sale: { color: "teal.solid" } },
            { 
                xAxis: { dataKey: "month" }, 
                brush: { dataKey: "month" } 
            }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").brush.unwrap("some").dataKey.unwrap("some"), "month"));
    });

    test("creates line chart with brush height", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
            ],
            { sale: { color: "teal.solid" } },
            { brush: { height: 50n } }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").brush.unwrap("some").height.unwrap("some"), 50n));
    });

    test("creates line chart with brush start and end index", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
                { month: "February", sale: 95n },
                { month: "March", sale: 87n },
            ],
            { sale: { color: "teal.solid" } },
            { brush: { startIndex: 0n, endIndex: 1n } }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").brush.unwrap("some").startIndex.unwrap("some"), 0n));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").brush.unwrap("some").endIndex.unwrap("some"), 1n));
    });

    test("creates line chart with brush styling", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
            ],
            { sale: { color: "teal.solid" } },
            { brush: { stroke: "#8884d8", fill: "#8884d8", travellerWidth: 10n } }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").brush.unwrap("some").stroke.unwrap("some"), "#8884d8"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").brush.unwrap("some").fill.unwrap("some"), "#8884d8"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").brush.unwrap("some").travellerWidth.unwrap("some"), 10n));
    });

    // =========================================================================
    // Reference Annotations
    // =========================================================================

    test("creates line chart with reference line (horizontal)", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
                { month: "February", sale: 95n },
            ],
            { sale: { color: "teal.solid" } },
            {
                xAxis: { dataKey: "month" },
                referenceLines: [
                    { y: 50n, stroke: "red", label: "Target" }
                ]
            }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").referenceLines.unwrap("some").size(), 1n));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").referenceLines.unwrap("some").get(0n).y.unwrap("some").getTag(), "Integer"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").referenceLines.unwrap("some").get(0n).stroke.unwrap("some"), "red"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").referenceLines.unwrap("some").get(0n).label.unwrap("some"), "Target"));
    });

    test("creates line chart with reference line (vertical)", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
                { month: "February", sale: 95n },
            ],
            { sale: { color: "teal.solid" } },
            {
                xAxis: { dataKey: "month" },
                referenceLines: [
                    { x: "January", stroke: "blue", strokeDasharray: "5 5" }
                ]
            }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").referenceLines.unwrap("some").size(), 1n));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").referenceLines.unwrap("some").get(0n).x.unwrap("some").unwrap("String"), "January"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").referenceLines.unwrap("some").get(0n).strokeDasharray.unwrap("some"), "5 5"));
    });

    test("creates line chart with reference dot", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
                { month: "February", sale: 95n },
            ],
            { sale: { color: "teal.solid" } },
            {
                xAxis: { dataKey: "month" },
                referenceDots: [
                    { x: "January", y: 10n, fill: "red", r: 8n, label: "Start" }
                ]
            }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").referenceDots.unwrap("some").size(), 1n));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").referenceDots.unwrap("some").get(0n).x.unwrap("String"), "January"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").referenceDots.unwrap("some").get(0n).y.unwrap("Integer"), 10n));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").referenceDots.unwrap("some").get(0n).fill.unwrap("some"), "red"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").referenceDots.unwrap("some").get(0n).r.unwrap("some"), 8n));
    });

    test("creates line chart with reference area", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
                { month: "February", sale: 95n },
            ],
            { sale: { color: "teal.solid" } },
            {
                xAxis: { dataKey: "month" },
                referenceAreas: [
                    { y1: 40n, y2: 60n, fill: "green", fillOpacity: 0.2, label: "Target Zone" }
                ]
            }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").referenceAreas.unwrap("some").size(), 1n));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").referenceAreas.unwrap("some").get(0n).y1.unwrap("some").unwrap("Integer"), 40n));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").referenceAreas.unwrap("some").get(0n).y2.unwrap("some").unwrap("Integer"), 60n));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").referenceAreas.unwrap("some").get(0n).fill.unwrap("some"), "green"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").referenceAreas.unwrap("some").get(0n).fillOpacity.unwrap("some"), 0.2));
    });

    test("creates line chart with multiple reference annotations", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "January", sale: 10n },
                { month: "February", sale: 95n },
            ],
            { sale: { color: "teal.solid" } },
            {
                xAxis: { dataKey: "month" },
                referenceLines: [
                    { y: 50n, stroke: "red" },
                    { y: 80n, stroke: "orange" }
                ],
                referenceDots: [
                    { x: "January", y: 10n, fill: "blue" }
                ],
                referenceAreas: [
                    { y1: 0n, y2: 20n, fill: "gray", fillOpacity: 0.1 }
                ]
            }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").referenceLines.unwrap("some").size(), 2n));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").referenceDots.unwrap("some").size(), 1n));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").referenceAreas.unwrap("some").size(), 1n));
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
                grid: { show: true },
                tooltip: { show: true },
                showDots: false,
                strokeWidth: 2n
            }
        ));

        $(assertEast.equal(chart.unwrap().getTag(), "LineChart"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").series.get(0n).name, "sale"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").grid.unwrap("some").show.unwrap("some"), true));
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
                grid: { show: true },
                tooltip: { show: true },
                legend: { show: true },
                strokeWidth: 2n
            }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").legend.unwrap("some").show.unwrap("some"), true));
    });
});

describeEast("Chart.Line Pivot", (test) => {
    // =========================================================================
    // Pivot Key Support (Long/Pivoted Data Format)
    // =========================================================================

    test("creates chart with pivotKey", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "Jan", category: "A", value: 100n },
                { month: "Jan", category: "B", value: 50n },
                { month: "Feb", category: "A", value: 120n },
                { month: "Feb", category: "B", value: 80n },
            ],
            { value: { color: "teal.solid" } },
            {
                xAxis: { dataKey: "month" },
                pivotKey: "category",
                valueKey: "value",
            }
        ));

        $(assertEast.equal(chart.unwrap().getTag(), "LineChart"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").pivotKey.unwrap("some"), "category"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").valueKey.unwrap("some"), "value"));
    });

    test("creates chart without pivotKey (backward compat)", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "Jan", revenue: 100n, profit: 50n },
            ],
            { revenue: { color: "teal.solid" }, profit: { color: "blue.solid" } },
            { xAxis: { dataKey: "month" } }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").pivotKey.hasTag("none"), true));
    });

    test("creates chart with pivotColors mapping", $ => {
        const chart = $.let(Chart.Line(
            [
                { month: "Jan", region: "North", sales: 100n },
                { month: "Jan", region: "South", sales: 80n },
            ],
            {
                sales: {
                    color: "blue.500",
                    pivotColors: new Map([
                        ["North", "blue.700"],
                        ["South", "blue.300"],
                    ]),
                },
            },
            {
                xAxis: { dataKey: "month" },
                pivotKey: "region",
                valueKey: "sales",
            }
        ));

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").pivotKey.unwrap("some"), "region"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").series.get(0n).pivotColors.hasTag("some"), true));
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

        $(assertEast.equal(chart.unwrap().getTag(), "LineChart"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").valueKey.unwrap("some"), "value"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").dataSeries.hasTag("some"), true));
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

        $(assertEast.equal(chart.unwrap().getTag(), "LineChart"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").valueKey.unwrap("some"), "value"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").dataSeries.hasTag("some"), true));
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

        $(assertEast.equal(chart.unwrap().unwrap("LineChart").series.size(), 2n));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").valueKey.unwrap("some"), "amount"));
        $(assertEast.equal(chart.unwrap().unwrap("LineChart").showDots.unwrap("some"), true));
    });
});
