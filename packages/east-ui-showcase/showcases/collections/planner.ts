/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { East, some, IntegerType, StringType, NullType } from "@elaraai/east";
import { Planner, UIComponentType, Stack, Badge, Text } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Planner showcase - demonstrates Planner component variants and features.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic Planner with events
        const basic = $.let(
            ShowcaseCard(
                "Basic Planner",
                "Simple resource allocation grid with events",
                Planner.Root(
                    [
                        { resource: "Alice", task: "Development", start: 1n, end: 3n },
                        { resource: "Bob", task: "Testing", start: 2n, end: 5n },
                        { resource: "Charlie", task: "Review", start: 4n, end: 6n },
                    ],
                    ["resource", "task"],
                    row => [Planner.Event({ start: row.start, end: row.end })]
                ),
                some(`
                    Planner.Root(
                        [
                            { resource: "Alice", task: "Development", start: 1n, end: 3n },
                            { resource: "Bob", task: "Testing", start: 2n, end: 5n },
                            { resource: "Charlie", task: "Review", start: 4n, end: 6n },
                        ],
                        ["resource", "task"],
                        row => [Planner.Event({ start: row.start, end: row.end })]
                    )
                `)
            )
        );

        // Planner with labels, colors and column widths
        const withLabels = $.let(
            ShowcaseCard(
                "Events with Labels, Colors & Width",
                "Events with custom labels, color palettes, and column widths",
                Planner.Root(
                    [
                        { name: "Project A", status: "Active", slot: 1n, endSlot: 4n },
                        { name: "Project B", status: "Pending", slot: 3n, endSlot: 7n },
                        { name: "Project C", status: "Done", slot: 5n, endSlot: 8n },
                    ],
                    {
                        name: { header: "Project", width: "200px", minWidth: "80px" },
                        status: { header: "Status", width: "100px", maxWidth: "150px" },
                    },
                    row => [
                        Planner.Event({
                            start: row.slot,
                            end: row.endSlot,
                            label: "Active",
                            colorPalette: "blue",
                        }),
                    ]
                ),
                some(`
                    Planner.Root(
                        [
                            { name: "Project A", status: "Active", slot: 1n, endSlot: 4n },
                            { name: "Project B", status: "Pending", slot: 3n, endSlot: 7n },
                            { name: "Project C", status: "Done", slot: 5n, endSlot: 8n },
                        ],
                        {
                            name: { header: "Project", width: "120px", minWidth: "80px" },
                            status: { header: "Status", width: "100px", maxWidth: "150px" },
                        },
                        row => [
                            Planner.Event({
                                start: row.slot,
                                end: row.endSlot,
                                label: "Active",
                                colorPalette: "blue",
                            }),
                        ]
                    )
                `)
            )
        );

        // Planner with multiple events per row
        const multipleEvents = $.let(
            ShowcaseCard(
                "Multiple Events Per Row",
                "Rows can have multiple events with different colors",
                Planner.Root(
                    [
                        { name: "Team A", slot1: 1n, slot2: 4n, slot3: 7n },
                        { name: "Team B", slot1: 2n, slot2: 5n, slot3: 8n },
                    ],
                    ["name"],
                    row => [
                        Planner.Event({ start: row.slot1, end: row.slot1.add(1n), colorPalette: "green", label: "Sprint 1" }),
                        Planner.Event({ start: row.slot2, end: row.slot2.add(1n), colorPalette: "blue", label: "Sprint 2" }),
                        Planner.Event({ start: row.slot3, end: row.slot3.add(1n), colorPalette: "purple", label: "Sprint 3" }),
                    ],
                    { maxSlot: 15n }
                ),
                some(`
                    Planner.Root(
                        [
                            { name: "Team A", slot1: 1n, slot2: 4n, slot3: 7n },
                            { name: "Team B", slot1: 2n, slot2: 5n, slot3: 8n },
                        ],
                        ["name"],
                        row => [
                            Planner.Event({ start: row.slot1, end: row.slot1.add(1n), colorPalette: "green", label: "Sprint 1" }),
                            Planner.Event({ start: row.slot2, end: row.slot2.add(1n), colorPalette: "blue", label: "Sprint 2" }),
                            Planner.Event({ start: row.slot3, end: row.slot3.add(1n), colorPalette: "purple", label: "Sprint 3" }),
                        ],
                        { maxSlot: 10n }
                    )
                `)
            )
        );

        // Single slot mode
        const singleSlotMode = $.let(
            ShowcaseCard(
                "Single Slot Mode",
                "Events occupy exactly one slot each",
                Planner.Root(
                    [
                        { resource: "Room A", slots: [1n, 3n, 5n, 7n] },
                        { resource: "Room B", slots: [2n, 4n, 6n, 8n] },
                    ],
                    ["resource"],
                    row => row.slots.map(($, slot) =>
                        Planner.Event({ start: slot, colorPalette: "teal" })
                    ),
                    { slotMode: "single", maxSlot: 10n }
                ),
                some(`
                    Planner.Root(
                        [
                            { resource: "Room A", slots: [1n, 3n, 5n, 7n] },
                            { resource: "Room B", slots: [2n, 4n, 6n, 8n] },
                        ],
                        ["resource"],
                        row => row.slots.map(($, slot) =>
                            Planner.Event({ start: slot, colorPalette: "teal" })
                        ),
                        { slotMode: "single", maxSlot: 10n }
                    )
                `)
            )
        );

        // Custom slot labels
        const customSlotLabels = $.let(
            ShowcaseCard(
                "Custom Slot Labels",
                "Use a function to format slot labels",
                Planner.Root(
                    [
                        { shift: "Morning", start: 0n, end: 2n },
                        { shift: "Afternoon", start: 2n, end: 4n },
                        { shift: "Evening", start: 4n, end: 6n },
                    ],
                    { shift: { header: "Shift" } },
                    row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "orange" })],
                    {
                        minSlot: 0n,
                        maxSlot: 7n,
                        slotLabel: East.function([IntegerType], StringType, ($, slot) => {
                            return East.str`Day ${slot}`;
                        }),
                    }
                ),
                some(`
                    Planner.Root(
                        [
                            { shift: "Morning", start: 0n, end: 2n },
                            { shift: "Afternoon", start: 2n, end: 4n },
                            { shift: "Evening", start: 4n, end: 6n },
                        ],
                        { shift: { header: "Shift" } },
                        row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "orange" })],
                        {
                            minSlot: 0n,
                            maxSlot: 7n,
                            slotLabel: East.function([IntegerType], StringType, ($, slot) => {
                                return East.str\`Day \${slot}\`;
                            }),
                        }
                    )
                `)
            )
        );

        // Styled planner
        const styled = $.let(
            ShowcaseCard(
                "Styled Planner",
                "Table styling options: striped, interactive, custom grid lines",
                Planner.Root(
                    [
                        { task: "Analysis", priority: "High", start: 1n, end: 3n },
                        { task: "Design", priority: "Medium", start: 2n, end: 5n },
                        { task: "Build", priority: "High", start: 4n, end: 8n },
                        { task: "Test", priority: "Low", start: 6n, end: 9n },
                    ],
                    ["task", "priority"],
                    row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "cyan" })],
                    {
                        striped: true,
                        interactive: true,
                        slotLineStroke: "gray.300",
                        slotLineDash: "4 2",
                        slotLineOpacity: 0.7,
                        maxSlot: 10n,
                    }
                ),
                some(`
                    Planner.Root(
                        [
                            { task: "Analysis", priority: "High", start: 1n, end: 3n },
                            { task: "Design", priority: "Medium", start: 2n, end: 5n },
                            { task: "Build", priority: "High", start: 4n, end: 8n },
                            { task: "Test", priority: "Low", start: 6n, end: 9n },
                        ],
                        ["task", "priority"],
                        row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "cyan" })],
                        {
                            striped: true,
                            interactive: true,
                            slotLineStroke: "gray.300",
                            slotLineDash: "4 2",
                            slotLineOpacity: 0.7,
                            maxSlot: 10n,
                        }
                    )
                `)
            )
        );

        // Column render with row access
        const columnRenderWithRow = $.let(
            ShowcaseCard(
                "Column Render with Row Access",
                "Render function accesses other row fields for conditional styling",
                Planner.Root(
                    [
                        { task: "Backend API", owner: "Alice", priority: "high", start: 1n, end: 4n },
                        { task: "Frontend UI", owner: "Bob", priority: "medium", start: 2n, end: 6n },
                        { task: "Integration", owner: "Charlie", priority: "high", start: 4n, end: 8n },
                        { task: "Documentation", owner: "Diana", priority: "low", start: 5n, end: 9n },
                    ],
                    {
                        task: {
                            header: "Task",
                            render: (value, row) => Text.Root(
                                East.str`${value} (${row.owner})`,
                            ),
                        },
                        priority: {
                            header: "Priority",
                            render: (value, row) => Badge.Root(
                                East.str`${value} (${row.owner})`,
                                {
                                    variant: "solid",
                                }
                            ),
                        },
                    },
                    row => [Planner.Event({ start: row.start, end: row.end })],
                    { maxSlot: 10n, striped: true }
                ),
                some(`
                    Planner.Root(
                        [
                            { task: "Backend API", owner: "Alice", priority: "high", start: 1n, end: 4n },
                            { task: "Frontend UI", owner: "Bob", priority: "medium", start: 2n, end: 6n },
                            { task: "Integration", owner: "Charlie", priority: "high", start: 4n, end: 8n },
                            { task: "Documentation", owner: "Diana", priority: "low", start: 5n, end: 9n },
                        ],
                        {
                            task: {
                                header: "Task",
                                render: (value, row) => Text.Root(
                                    East.str\`\${value} (\${row.owner})\`,
                                ),
                            },
                            priority: {
                                header: "Priority",
                                render: (value, row) => Badge.Root(value, {
                                    colorPalette: row.priority.equal("high").ifElse("red",
                                        row.priority.equal("medium").ifElse("yellow", "green")
                                    ),
                                    variant: "solid",
                                }),
                            },
                        },
                        row => [Planner.Event({ start: row.start, end: row.end })],
                        { maxSlot: 10n, striped: true }
                    )
                `)
            )
        );

        // Planner with boundaries
        const withBoundaries = $.let(
            ShowcaseCard(
                "Boundaries",
                "Vertical boundary lines at specific slot positions (e.g., deadlines, milestones)",
                Planner.Root(
                    [
                        { task: "Planning", team: "Alpha", start: 1n, end: 3n },
                        { task: "Development", team: "Beta", start: 2n, end: 6n },
                        { task: "Testing", team: "Gamma", start: 5n, end: 8n },
                    ],
                    ["task", "team"],
                    row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "blue" })],
                    {
                        maxSlot: 10n,
                        boundaries: [
                            { x: 4n, stroke: "red", strokeWidth: 2 },
                            { x: 7n, stroke: "green", strokeWidth: 4, strokeDash: "4 2" },
                        ],
                    }
                ),
                some(`
                    Planner.Root(
                        [
                            { task: "Planning", team: "Alpha", start: 1n, end: 3n },
                            { task: "Development", team: "Beta", start: 2n, end: 6n },
                            { task: "Testing", team: "Gamma", start: 5n, end: 8n },
                        ],
                        ["task", "team"],
                        row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "blue" })],
                        {
                            maxSlot: 10n,
                            boundaries: [
                                { x: 4n, stroke: "red", strokeWidth: 2 },
                                { x: 7n, stroke: "green", strokeWidth: 2, strokeDash: "4 2" },
                            ],
                        }
                    )
                `)
            )
        );

        // Event context menu with Edit/Delete
        const withContextMenu = $.let(
            ShowcaseCard(
                "Event Context Menu",
                "Right-click on events to see Edit and Delete options",
                Planner.Root(
                    [
                        { task: "Design Review", assignee: "Alice", start: 1n, end: 3n },
                        { task: "Code Sprint", assignee: "Bob", start: 2n, end: 5n },
                        { task: "QA Testing", assignee: "Charlie", start: 4n, end: 6n },
                    ],
                    ["task", "assignee"],
                    row => [Planner.Event({ start: row.start, end: row.end, label: row.task, colorPalette: "blue" })],
                    {
                        maxSlot: 8n,
                        onEventEdit: East.function([Planner.Types.ClickEvent], NullType, ($, ev) => {
                            // In a real app, this would open an edit dialog
                            return null;
                        }),
                        onEventDelete: East.function([Planner.Types.DeleteEvent], NullType, ($, ev) => {
                            // In a real app, this would delete the event
                            return null;
                        }),
                    }
                ),
                some(`
                    Planner.Root(
                        [
                            { task: "Design Review", assignee: "Alice", start: 1n, end: 3n },
                            { task: "Code Sprint", assignee: "Bob", start: 2n, end: 5n },
                            { task: "QA Testing", assignee: "Charlie", start: 4n, end: 6n },
                        ],
                        ["task", "assignee"],
                        row => [Planner.Event({ start: row.start, end: row.end, label: row.task, colorPalette: "blue" })],
                        {
                            maxSlot: 8n,
                            onEventEdit: East.function([Planner.Types.ClickEvent], NullType, ($, ev) => {
                                // In a real app, this would open an edit dialog
                                return null;
                            }),
                            onEventDelete: East.function([Planner.Types.DeleteEvent], NullType, ($, ev) => {
                                // In a real app, this would delete the event
                                return null;
                            }),
                        }
                    )
                `)
            )
        );

        return Stack.VStack([
            basic,
            withLabels,
            multipleEvents,
            singleSlotMode,
            customSlotLabels,
            styled,
            columnRenderWithRow,
            withBoundaries,
            withContextMenu,
        ], { gap: "6", align: "stretch" });
    }
);
