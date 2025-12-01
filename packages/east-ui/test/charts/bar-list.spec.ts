/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Chart } from "../../src/index.js";
import { none, some } from "@elaraai/east";

describeEast("Chart.BarList", (test) => {
    // =========================================================================
    // Basic BarList
    // =========================================================================

    test("creates basic bar list", $ => {
        const chart = $.let(Chart.BarList([
            { name: "Google", value: 1200000, color: none },
            { name: "Direct", value: 100000, color: none },
            { name: "Bing", value: 200000, color: none },
        ]));

        $(assertEast.equal(chart.getTag(), "BarList"));
        $(assertEast.equal(chart.unwrap("BarList").data.size(), 3n));
        $(assertEast.equal(chart.unwrap("BarList").data.get(0n).name, "Google"));
        $(assertEast.equal(chart.unwrap("BarList").data.get(0n).value, 1200000));
    });

    test("creates bar list with many items", $ => {
        const chart = $.let(Chart.BarList([
            { name: "Google", value: 1200000, color: none },
            { name: "Direct", value: 100000, color: none },
            { name: "Bing", value: 200000, color: none },
            { name: "Yahoo", value: 20000, color: none },
            { name: "ChatGPT", value: 1345000, color: none },
            { name: "Github", value: 100000, color: none },
            { name: "Yandex", value: 100000, color: none },
        ]));

        $(assertEast.equal(chart.unwrap("BarList").data.size(), 7n));
        $(assertEast.equal(chart.unwrap("BarList").data.get(4n).name, "ChatGPT"));
        $(assertEast.equal(chart.unwrap("BarList").data.get(4n).value, 1345000));
    });

    // =========================================================================
    // Sorting
    // =========================================================================

    test("creates bar list with descending sort", $ => {
        const chart = $.let(Chart.BarList([
            { name: "Google", value: 1200000, color: none },
            { name: "Direct", value: 100000, color: none },
        ], {
            sort: { by: "value", direction: "desc" },
        }));

        $(assertEast.equal(chart.unwrap("BarList").sort.hasTag("some"), true));
        $(assertEast.equal(chart.unwrap("BarList").sort.unwrap("some").by, "value"));
        $(assertEast.equal(chart.unwrap("BarList").sort.unwrap("some").direction.hasTag("desc"), true));
    });

    test("creates bar list with ascending sort", $ => {
        const chart = $.let(Chart.BarList([
            { name: "Google", value: 1200000, color: none },
            { name: "Direct", value: 100000, color: none },
        ], {
            sort: { by: "value", direction: "asc" },
        }));

        $(assertEast.equal(chart.unwrap("BarList").sort.unwrap("some").direction.hasTag("asc"), true));
    });

    test("creates bar list with sort by name", $ => {
        const chart = $.let(Chart.BarList([
            { name: "Google", value: 1200000, color: none },
            { name: "Bing", value: 200000, color: none },
        ], {
            sort: { by: "name", direction: "asc" },
        }));

        $(assertEast.equal(chart.unwrap("BarList").sort.unwrap("some").by, "name"));
    });

    // =========================================================================
    // Display Options
    // =========================================================================

    test("creates bar list with value display", $ => {
        const chart = $.let(Chart.BarList([
            { name: "Google", value: 1200000, color: none },
        ], {
            showValue: true,
        }));

        $(assertEast.equal(chart.unwrap("BarList").showValue.unwrap("some"), true));
    });

    test("creates bar list without value display", $ => {
        const chart = $.let(Chart.BarList([
            { name: "Google", value: 1200000, color: none },
        ], {
            showValue: false,
        }));

        $(assertEast.equal(chart.unwrap("BarList").showValue.unwrap("some"), false));
    });

    test("creates bar list with label display", $ => {
        const chart = $.let(Chart.BarList([
            { name: "Google", value: 1200000, color: none },
        ], {
            showLabel: true,
        }));

        $(assertEast.equal(chart.unwrap("BarList").showLabel.unwrap("some"), true));
    });

    // =========================================================================
    // Value Format
    // =========================================================================

    test("creates bar list with compact value format", $ => {
        const chart = $.let(Chart.BarList([
            { name: "Google", value: 1200000, color: none },
        ], {
            valueFormat: "compact",
        }));

        $(assertEast.equal(chart.unwrap("BarList").valueFormat.unwrap("some").hasTag("compact"), true));
    });

    test("creates bar list with percent value format", $ => {
        const chart = $.let(Chart.BarList([
            { name: "Created", value: 120, color: none },
            { name: "Closed", value: 10, color: none },
        ], {
            valueFormat: "percent",
        }));

        $(assertEast.equal(chart.unwrap("BarList").valueFormat.unwrap("some").hasTag("percent"), true));
    });

    test("creates bar list with currency value format", $ => {
        const chart = $.let(Chart.BarList([
            { name: "Sales", value: 50000, color: none },
        ], {
            valueFormat: Chart.TickFormat.Currency({ currency: "USD" }),
        }));

        $(assertEast.equal(chart.unwrap("BarList").valueFormat.unwrap("some").hasTag("currency"), true));
    });

    // =========================================================================
    // Color
    // =========================================================================

    test("creates bar list with custom color", $ => {
        const chart = $.let(Chart.BarList([
            { name: "Google", value: 1200000, color: none },
        ], {
            color: "teal.subtle",
        }));

        $(assertEast.equal(chart.unwrap("BarList").color.unwrap("some"), "teal.subtle"));
    });

    test("creates bar list with pink color", $ => {
        const chart = $.let(Chart.BarList([
            { name: "Created", value: 120, color: none },
        ], {
            color: "pink.subtle",
        }));

        $(assertEast.equal(chart.unwrap("BarList").color.unwrap("some"), "pink.subtle"));
    });

    // =========================================================================
    // Item-level Colors
    // =========================================================================

    test("creates bar list with item-level colors", $ => {
        const chart = $.let(Chart.BarList([
            { name: "Google", value: 1200000, color: some("teal.solid") },
            { name: "Direct", value: 100000, color: some("blue.solid") },
        ]));

        $(assertEast.equal(chart.unwrap("BarList").data.get(0n).color.unwrap("some"), "teal.solid"));
        $(assertEast.equal(chart.unwrap("BarList").data.get(1n).color.unwrap("some"), "blue.solid"));
    });

    // =========================================================================
    // Complete Examples from Chakra Reference
    // =========================================================================

    test("creates complete bar list matching Chakra BarListBasic example", $ => {
        const chart = $.let(Chart.BarList([
            { name: "Google", value: 1200000, color: none },
            { name: "Direct", value: 100000, color: none },
            { name: "Bing", value: 200000, color: none },
            { name: "Yahoo", value: 20000, color: none },
            { name: "ChatGPT", value: 1345000, color: none },
            { name: "Github", value: 100000, color: none },
            { name: "Yandex", value: 100000, color: none },
        ], {
            sort: { by: "value", direction: "desc" },
            showValue: true,
            color: "teal.subtle",
        }));

        $(assertEast.equal(chart.getTag(), "BarList"));
        $(assertEast.equal(chart.unwrap("BarList").data.size(), 7n));
        $(assertEast.equal(chart.unwrap("BarList").sort.unwrap("some").by, "value"));
        $(assertEast.equal(chart.unwrap("BarList").sort.unwrap("some").direction.hasTag("desc"), true));
        $(assertEast.equal(chart.unwrap("BarList").showValue.unwrap("some"), true));
        $(assertEast.equal(chart.unwrap("BarList").color.unwrap("some"), "teal.subtle"));
    });

    test("creates funnel-style bar list matching Chakra BarListWithFormatter example", $ => {
        const chart = $.let(Chart.BarList([
            { name: "Created", value: 120, color: none },
            { name: "Initial Contact", value: 90, color: none },
            { name: "Booked Demo", value: 45, color: none },
            { name: "Closed", value: 10, color: none },
        ], {
            sort: { by: "value", direction: "desc" },
            showValue: true,
            valueFormat: "percent",
            color: "pink.subtle",
        }));

        $(assertEast.equal(chart.unwrap("BarList").data.size(), 4n));
        $(assertEast.equal(chart.unwrap("BarList").valueFormat.unwrap("some").hasTag("percent"), true));
        $(assertEast.equal(chart.unwrap("BarList").color.unwrap("some"), "pink.subtle"));
    });
});
