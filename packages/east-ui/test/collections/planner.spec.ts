/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { East, IntegerType, StringType } from "@elaraai/east";
import { describeEast, assertEast } from "../platforms.spec.js";
import { Planner, Text, Badge } from "../../src/index.js";

describeEast("Planner", (test) => {
    // =========================================================================
    // Basic Event Creation
    // =========================================================================

    test("creates event with start only", $ => {
        const event = $.let(Planner.Event({
            start: 1n,
        }));

        $(assertEast.equal(event.start, 1n));
        $(assertEast.equal(event.end.hasTag("none"), true));
        $(assertEast.equal(event.label.hasTag("none"), true));
        $(assertEast.equal(event.colorPalette.hasTag("none"), true));
    });

    test("creates event with start and end", $ => {
        const event = $.let(Planner.Event({
            start: 1n,
            end: 5n,
        }));

        $(assertEast.equal(event.start, 1n));
        $(assertEast.equal(event.end.hasTag("some"), true));
        $(assertEast.equal(event.end.unwrap("some"), 5n));
    });

    test("creates event with label", $ => {
        const event = $.let(Planner.Event({
            start: 1n,
            end: 3n,
            label: "Task A",
        }));

        $(assertEast.equal(event.label.hasTag("some"), true));
        $(assertEast.equal(event.label.unwrap("some"), "Task A"));
    });

    test("creates event with colorPalette", $ => {
        const event = $.let(Planner.Event({
            start: 1n,
            end: 3n,
            colorPalette: "blue",
        }));

        $(assertEast.equal(event.colorPalette.hasTag("some"), true));
        $(assertEast.equal(event.colorPalette.unwrap("some").hasTag("blue"), true));
    });

    test("creates event with all options", $ => {
        const event = $.let(Planner.Event({
            start: 2n,
            end: 6n,
            label: "Important Task",
            colorPalette: "green",
        }));

        $(assertEast.equal(event.start, 2n));
        $(assertEast.equal(event.end.unwrap("some"), 6n));
        $(assertEast.equal(event.label.unwrap("some"), "Important Task"));
        $(assertEast.equal(event.colorPalette.unwrap("some").hasTag("green"), true));
    });

    // =========================================================================
    // Planner Root Creation
    // =========================================================================

    test("creates basic planner", $ => {
        const planner = $.let(Planner.Root(
            [
                { name: "Alice", start: 1n, end: 3n },
                { name: "Bob", start: 2n, end: 5n },
            ],
            ["name"],
            row => [Planner.Event({ start: row.start, end: row.end })],
        ));

        $(assertEast.equal(planner.hasTag("Planner"), true));
    });

    test("creates planner with style", $ => {
        const planner = $.let(Planner.Root(
            [
                { name: "Task 1", slot: 1n },
            ],
            ["name"],
            row => [Planner.Event({ start: row.slot })],
            {
                slotMode: "single",
            }
        ));

        $(assertEast.equal(planner.hasTag("Planner"), true));
        $(assertEast.equal(planner.unwrap("Planner").style.hasTag("some"), true));
        $(assertEast.equal(planner.unwrap("Planner").style.unwrap("some").slotMode.hasTag("some"), true));
        $(assertEast.equal(planner.unwrap("Planner").style.unwrap("some").slotMode.unwrap("some").hasTag("single"), true));
    });

    test("creates planner with span mode", $ => {
        const planner = $.let(Planner.Root(
            [{ name: "Task", start: 1n, end: 5n }],
            ["name"],
            row => [Planner.Event({ start: row.start, end: row.end })],
            {
                slotMode: "span",
            }
        ));

        $(assertEast.equal(planner.unwrap("Planner").style.unwrap("some").slotMode.unwrap("some").hasTag("span"), true));
    });

    test("creates planner with minSlot and maxSlot", $ => {
        const planner = $.let(Planner.Root(
            [{ name: "Task", start: 3n, end: 5n }],
            ["name"],
            row => [Planner.Event({ start: row.start, end: row.end })],
            {
                minSlot: 1n,
                maxSlot: 10n,
            }
        ));

        $(assertEast.equal(planner.unwrap("Planner").style.unwrap("some").minSlot.unwrap("some"), 1n));
        $(assertEast.equal(planner.unwrap("Planner").style.unwrap("some").maxSlot.unwrap("some"), 10n));
    });

    test("creates planner with slotMinWidth", $ => {
        const planner = $.let(Planner.Root(
            [{ name: "Task", start: 1n }],
            ["name"],
            row => [Planner.Event({ start: row.start })],
            {
                slotMinWidth: "80px",
            }
        ));

        $(assertEast.equal(planner.unwrap("Planner").style.unwrap("some").slotMinWidth.unwrap("some"), "80px"));
    });

    test("creates planner with slotLabel function", $ => {
        const labelFn = East.function([IntegerType], StringType, ($, slot) => {
            return East.str`Day ${slot}`;
        });

        const planner = $.let(Planner.Root(
            [{ name: "Task", start: 1n }],
            ["name"],
            row => [Planner.Event({ start: row.start })],
            {
                slotLabel: labelFn,
            }
        ));

        $(assertEast.equal(planner.unwrap("Planner").style.unwrap("some").slotLabel.hasTag("some"), true));
    });

    // =========================================================================
    // Slot Line Styling
    // =========================================================================

    test("creates planner with slot line stroke", $ => {
        const planner = $.let(Planner.Root(
            [{ name: "Task", start: 1n }],
            ["name"],
            row => [Planner.Event({ start: row.start })],
            {
                slotLineStroke: "gray.200",
            }
        ));

        $(assertEast.equal(planner.unwrap("Planner").style.unwrap("some").slotLineStroke.unwrap("some"), "gray.200"));
    });

    test("creates planner with slot line width", $ => {
        const planner = $.let(Planner.Root(
            [{ name: "Task", start: 1n }],
            ["name"],
            row => [Planner.Event({ start: row.start })],
            {
                slotLineWidth: 2.0,
            }
        ));

        $(assertEast.equal(planner.unwrap("Planner").style.unwrap("some").slotLineWidth.unwrap("some"), 2.0));
    });

    test("creates planner with slot line dash", $ => {
        const planner = $.let(Planner.Root(
            [{ name: "Task", start: 1n }],
            ["name"],
            row => [Planner.Event({ start: row.start })],
            {
                slotLineDash: "4 2",
            }
        ));

        $(assertEast.equal(planner.unwrap("Planner").style.unwrap("some").slotLineDash.unwrap("some"), "4 2"));
    });

    test("creates planner with slot line opacity", $ => {
        const planner = $.let(Planner.Root(
            [{ name: "Task", start: 1n }],
            ["name"],
            row => [Planner.Event({ start: row.start })],
            {
                slotLineOpacity: 0.5,
            }
        ));

        $(assertEast.equal(planner.unwrap("Planner").style.unwrap("some").slotLineOpacity.unwrap("some"), 0.5));
    });

    // =========================================================================
    // Table Styling
    // =========================================================================

    test("creates planner with table variant", $ => {
        const planner = $.let(Planner.Root(
            [{ name: "Task", start: 1n }],
            ["name"],
            row => [Planner.Event({ start: row.start })],
            {
                variant: "outline",
            }
        ));

        $(assertEast.equal(planner.unwrap("Planner").style.unwrap("some").variant.unwrap("some").hasTag("outline"), true));
    });

    test("creates planner with size", $ => {
        const planner = $.let(Planner.Root(
            [{ name: "Task", start: 1n }],
            ["name"],
            row => [Planner.Event({ start: row.start })],
            {
                size: "sm",
            }
        ));

        $(assertEast.equal(planner.unwrap("Planner").style.unwrap("some").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates planner with striped", $ => {
        const planner = $.let(Planner.Root(
            [{ name: "Task", start: 1n }],
            ["name"],
            row => [Planner.Event({ start: row.start })],
            {
                striped: true,
            }
        ));

        $(assertEast.equal(planner.unwrap("Planner").style.unwrap("some").striped.unwrap("some"), true));
    });

    test("creates planner with interactive", $ => {
        const planner = $.let(Planner.Root(
            [{ name: "Task", start: 1n }],
            ["name"],
            row => [Planner.Event({ start: row.start })],
            {
                interactive: true,
            }
        ));

        $(assertEast.equal(planner.unwrap("Planner").style.unwrap("some").interactive.unwrap("some"), true));
    });

    test("creates planner with stickyHeader", $ => {
        const planner = $.let(Planner.Root(
            [{ name: "Task", start: 1n }],
            ["name"],
            row => [Planner.Event({ start: row.start })],
            {
                stickyHeader: true,
            }
        ));

        $(assertEast.equal(planner.unwrap("Planner").style.unwrap("some").stickyHeader.unwrap("some"), true));
    });

    // =========================================================================
    // Multiple Events Per Row
    // =========================================================================

    test("creates planner with multiple events per row", $ => {
        const planner = $.let(Planner.Root(
            [
                { name: "Alice", slot1: 1n, slot2: 3n, slot3: 5n },
            ],
            ["name"],
            row => [
                Planner.Event({ start: row.slot1, label: "Event 1" }),
                Planner.Event({ start: row.slot2, label: "Event 2" }),
                Planner.Event({ start: row.slot3, label: "Event 3" }),
            ],
        ));

        $(assertEast.equal(planner.hasTag("Planner"), true));
    });

    // =========================================================================
    // Column Configuration
    // =========================================================================

    test("creates planner with multiple columns", $ => {
        const planner = $.let(Planner.Root(
            [
                { name: "Task A", category: "Development", start: 1n, end: 3n },
                { name: "Task B", category: "Design", start: 2n, end: 4n },
            ],
            ["name", "category"],
            row => [Planner.Event({ start: row.start, end: row.end })],
        ));

        $(assertEast.equal(planner.hasTag("Planner"), true));
    });

    test("creates planner with column config object", $ => {
        const planner = $.let(Planner.Root(
            [
                { name: "Task A", priority: 1n },
            ],
            {
                name: { header: "Task Name" },
                priority: { header: "Priority" },
            },
            row => [Planner.Event({ start: row.priority })],
        ));

        $(assertEast.equal(planner.hasTag("Planner"), true));
    });

    // =========================================================================
    // Color Palette
    // =========================================================================

    test("creates planner with default colorPalette", $ => {
        const planner = $.let(Planner.Root(
            [{ name: "Task", start: 1n }],
            ["name"],
            row => [Planner.Event({ start: row.start })],
            {
                colorPalette: "purple",
            }
        ));

        $(assertEast.equal(planner.unwrap("Planner").style.unwrap("some").colorPalette.unwrap("some").hasTag("purple"), true));
    });

    // =========================================================================
    // Column Render with Row Field Access
    // =========================================================================

    test("column render function receives row parameter to access other fields", $ => {
        const planner = $.let(Planner.Root(
            [
                { name: "Alice", role: "Developer", start: 1n, end: 3n },
                { name: "Bob", role: "Designer", start: 2n, end: 5n },
            ],
            {
                name: {
                    header: "Name",
                    render: (value, row) => Text.Root(East.str`${value} (${row.role})`),
                },
            },
            row => [Planner.Event({ start: row.start, end: row.end })],
        ));

        $(assertEast.equal(planner.hasTag("Planner"), true));
        $(assertEast.equal(planner.unwrap("Planner").rows.size(), 2n));
        $(assertEast.equal(planner.unwrap("Planner").columns.size(), 1n));
    });

    test("column render function uses row field for conditional styling", $ => {
        const planner = $.let(Planner.Root(
            [
                { task: "Bug Fix", priority: "high", start: 1n, end: 3n },
                { task: "Feature", priority: "low", start: 2n, end: 4n },
            ],
            {
                task: { header: "Task" },
                priority: {
                    header: "Priority",
                    render: (value) => Badge.Root(
                        value,
                    ),
                },
            },
            row => [Planner.Event({ start: row.start, end: row.end })],
        ));

        $(assertEast.equal(planner.hasTag("Planner"), true));
        $(assertEast.equal(planner.unwrap("Planner").rows.size(), 2n));
        $(assertEast.equal(planner.unwrap("Planner").columns.size(), 2n));
    });

    test("column render function accesses multiple row fields", $ => {
        const planner = $.let(Planner.Root(
            [
                { firstName: "Alice", lastName: "Smith", department: "Eng", start: 1n, end: 5n },
            ],
            {
                firstName: {
                    header: "Full Name",
                    render: (value, row) => Text.Root(East.str`${value} ${row.lastName}`),
                },
                department: { header: "Department" },
            },
            row => [Planner.Event({ start: row.start, end: row.end })],
        ));

        $(assertEast.equal(planner.unwrap("Planner").rows.size(), 1n));
        $(assertEast.equal(planner.unwrap("Planner").columns.size(), 2n));
    });
});
