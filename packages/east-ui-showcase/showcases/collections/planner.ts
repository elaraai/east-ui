/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { East, some, FloatType, StringType, NullType } from "@elaraai/east";
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
                        { resource: "Alice", task: "Development", start: 1.0, end: 3.0 },
                        { resource: "Bob", task: "Testing", start: 2.0, end: 5.0 },
                        { resource: "Charlie", task: "Review", start: 4.0, end: 6.0 },
                    ],
                    ["resource", "task"],
                    row => [Planner.Event({ start: row.start, end: row.end })]
                ),
                some(`
                    Planner.Root(
                        [
                            { resource: "Alice", task: "Development", start: 1.0, end: 3.0 },
                            { resource: "Bob", task: "Testing", start: 2.0, end: 5.0 },
                            { resource: "Charlie", task: "Review", start: 4.0, end: 6.0 },
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
                        { name: "Project A", status: "Active", slot: 1.0, endSlot: 4.0 },
                        { name: "Project B", status: "Pending", slot: 3.0, endSlot: 7.0 },
                        { name: "Project C", status: "Done", slot: 5.0, endSlot: 8.0 },
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
                            { name: "Project A", status: "Active", slot: 1.0, endSlot: 4.0 },
                            { name: "Project B", status: "Pending", slot: 3.0, endSlot: 7.0 },
                            { name: "Project C", status: "Done", slot: 5.0, endSlot: 8.0 },
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
                        { name: "Team A", slot1: 1.0, slot2: 4.0, slot3: 7.0 },
                        { name: "Team B", slot1: 2.0, slot2: 5.0, slot3: 8.0 },
                    ],
                    ["name"],
                    row => [
                        Planner.Event({ start: row.slot1, end: row.slot1.add(1.0), colorPalette: "green", label: "Sprint 1" }),
                        Planner.Event({ start: row.slot2, end: row.slot2.add(1.0), colorPalette: "blue", label: "Sprint 2" }),
                        Planner.Event({ start: row.slot3, end: row.slot3.add(1.0), colorPalette: "purple", label: "Sprint 3" }),
                    ],
                    { maxSlot: 15.0 }
                ),
                some(`
                    Planner.Root(
                        [
                            { name: "Team A", slot1: 1.0, slot2: 4.0, slot3: 7.0 },
                            { name: "Team B", slot1: 2.0, slot2: 5.0, slot3: 8.0 },
                        ],
                        ["name"],
                        row => [
                            Planner.Event({ start: row.slot1, end: row.slot1.add(1.0), colorPalette: "green", label: "Sprint 1" }),
                            Planner.Event({ start: row.slot2, end: row.slot2.add(1.0), colorPalette: "blue", label: "Sprint 2" }),
                            Planner.Event({ start: row.slot3, end: row.slot3.add(1.0), colorPalette: "purple", label: "Sprint 3" }),
                        ],
                        { maxSlot: 10.0 }
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
                        { resource: "Room A", slots: [1.0, 3.0, 5.0, 7.0] },
                        { resource: "Room B", slots: [2.0, 4.0, 6.0, 8.0] },
                    ],
                    ["resource"],
                    row => row.slots.map((_$, slot) =>
                        Planner.Event({ start: slot, colorPalette: "teal" })
                    ),
                    { slotMode: "single", maxSlot: 10.0 }
                ),
                some(`
                    Planner.Root(
                        [
                            { resource: "Room A", slots: [1.0, 3.0, 5.0, 7.0] },
                            { resource: "Room B", slots: [2.0, 4.0, 6.0, 8.0] },
                        ],
                        ["resource"],
                        row => row.slots.map(($, slot) =>
                            Planner.Event({ start: slot, colorPalette: "teal" })
                        ),
                        { slotMode: "single", maxSlot: 10.0 }
                    )
                `)
            )
        );

        // Fractional step sizes
        const fractionalSteps = $.let(
            ShowcaseCard(
                "Fractional Step Sizes",
                "Events can start/end at half or quarter positions with stepSize snapping",
                Planner.Root(
                    [
                        { task: "Task A", start: 0.0, end: 1.5 },
                        { task: "Task B", start: 1.5, end: 3.5 },
                        { task: "Task C", start: 0.5, end: 2.0 },
                    ],
                    ["task"],
                    row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "purple", label: row.task })],
                    {
                        minSlot: 0.0,
                        maxSlot: 5.0,
                        stepSize: 0.5,
                    }
                ),
                some(`
                    Planner.Root(
                        [
                            { task: "Task A", start: 0.0, end: 1.5 },
                            { task: "Task B", start: 1.5, end: 3.5 },
                            { task: "Task C", start: 0.5, end: 2.0 },
                        ],
                        ["task"],
                        row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "purple", label: row.task })],
                        {
                            minSlot: 0.0,
                            maxSlot: 5.0,
                            stepSize: 0.5,
                        }
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
                        { shift: "Morning", start: 0.0, end: 2.0 },
                        { shift: "Afternoon", start: 2.0, end: 4.0 },
                        { shift: "Evening", start: 4.0, end: 6.0 },
                    ],
                    { shift: { header: "Shift" } },
                    row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "orange" })],
                    {
                        minSlot: 0.0,
                        maxSlot: 7.0,
                        slotLabel: East.function([FloatType], StringType, (_$, slot) => {
                            return East.str`Day ${slot}`;
                        }),
                    }
                ),
                some(`
                    Planner.Root(
                        [
                            { shift: "Morning", start: 0.0, end: 2.0 },
                            { shift: "Afternoon", start: 2.0, end: 4.0 },
                            { shift: "Evening", start: 4.0, end: 6.0 },
                        ],
                        { shift: { header: "Shift" } },
                        row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "orange" })],
                        {
                            minSlot: 0.0,
                            maxSlot: 7.0,
                            slotLabel: East.function([FloatType], StringType, ($, slot) => {
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
                        { task: "Analysis", priority: "High", start: 1.0, end: 3.0 },
                        { task: "Design", priority: "Medium", start: 2.0, end: 5.0 },
                        { task: "Build", priority: "High", start: 4.0, end: 8.0 },
                        { task: "Test", priority: "Low", start: 6.0, end: 9.0 },
                    ],
                    ["task", "priority"],
                    row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "cyan" })],
                    {
                        striped: true,
                        interactive: true,
                        slotLineStroke: "gray.300",
                        slotLineDash: "4 2",
                        slotLineOpacity: 0.7,
                        maxSlot: 10.0,
                    }
                ),
                some(`
                    Planner.Root(
                        [
                            { task: "Analysis", priority: "High", start: 1.0, end: 3.0 },
                            { task: "Design", priority: "Medium", start: 2.0, end: 5.0 },
                            { task: "Build", priority: "High", start: 4.0, end: 8.0 },
                            { task: "Test", priority: "Low", start: 6.0, end: 9.0 },
                        ],
                        ["task", "priority"],
                        row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "cyan" })],
                        {
                            striped: true,
                            interactive: true,
                            slotLineStroke: "gray.300",
                            slotLineDash: "4 2",
                            slotLineOpacity: 0.7,
                            maxSlot: 10.0,
                        }
                    )
                `)
            )
        );

        // Complex column types with value function
        const complexColumns = $.let(
            ShowcaseCard(
                "Complex Column Types",
                "Array and struct fields with value functions for sorting",
                Planner.Root(
                    [
                        { name: "Alice", skills: ["TypeScript", "React"], info: { dept: "Eng", level: 3n }, start: 1.0, end: 4.0 },
                        { name: "Bob", skills: ["Python"], info: { dept: "Data", level: 2n }, start: 2.0, end: 5.0 },
                        { name: "Charlie", skills: ["Go", "Rust", "C++"], info: { dept: "Infra", level: 4n }, start: 3.0, end: 7.0 },
                    ],
                    {
                        name: { header: "Name" },
                        skills: {
                            header: "Skills",
                            value: (skills) => skills.size(),
                            render: (skills) => Text.Root(East.str`${skills.size()} skills`),
                        },
                        info: {
                            header: "Level",
                            value: (info) => info.level,
                            render: (info) => Text.Root(East.str`${info.dept} L${info.level}`),
                        },
                    },
                    row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "purple" })],
                    { maxSlot: 8.0, striped: true }
                ),
                some(`
                    Planner.Root(
                        [
                            { name: "Alice", skills: ["TypeScript", "React"], info: { dept: "Eng", level: 3n }, start: 1.0, end: 4.0 },
                            { name: "Bob", skills: ["Python"], info: { dept: "Data", level: 2n }, start: 2.0, end: 5.0 },
                            { name: "Charlie", skills: ["Go", "Rust", "C++"], info: { dept: "Infra", level: 4n }, start: 3.0, end: 7.0 },
                        ],
                        {
                            name: { header: "Name" },
                            skills: {
                                header: "Skills",
                                value: (skills) => skills.size(),
                                render: (skills) => Text.Root(East.str\`\${skills.size()} skills\`),
                            },
                            info: {
                                header: "Level",
                                value: (info) => info.level,
                                render: (info) => Text.Root(East.str\`\${info.dept} L\${info.level}\`),
                            },
                        },
                        row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "purple" })],
                        { maxSlot: 8.0, striped: true }
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
                        { task: "Backend API", owner: "Alice", priority: "high", start: 1.0, end: 4.0 },
                        { task: "Frontend UI", owner: "Bob", priority: "medium", start: 2.0, end: 6.0 },
                        { task: "Integration", owner: "Charlie", priority: "high", start: 4.0, end: 8.0 },
                        { task: "Documentation", owner: "Diana", priority: "low", start: 5.0, end: 9.0 },
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
                    { maxSlot: 10.0, striped: true }
                ),
                some(`
                    Planner.Root(
                        [
                            { task: "Backend API", owner: "Alice", priority: "high", start: 1.0, end: 4.0 },
                            { task: "Frontend UI", owner: "Bob", priority: "medium", start: 2.0, end: 6.0 },
                            { task: "Integration", owner: "Charlie", priority: "high", start: 4.0, end: 8.0 },
                            { task: "Documentation", owner: "Diana", priority: "low", start: 5.0, end: 9.0 },
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
                        { maxSlot: 10.0, striped: true }
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
                        { task: "Planning", team: "Alpha", start: 1.0, end: 3.0 },
                        { task: "Development", team: "Beta", start: 2.0, end: 6.0 },
                        { task: "Testing", team: "Gamma", start: 5.0, end: 8.0 },
                    ],
                    ["task", "team"],
                    row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "blue" })],
                    {
                        maxSlot: 10.0,
                        boundaries: [
                            { x: 4.0, stroke: "red", strokeWidth: 2 },
                            { x: 7.0, stroke: "green", strokeWidth: 4, strokeDash: "4 2" },
                        ],
                    }
                ),
                some(`
                    Planner.Root(
                        [
                            { task: "Planning", team: "Alpha", start: 1.0, end: 3.0 },
                            { task: "Development", team: "Beta", start: 2.0, end: 6.0 },
                            { task: "Testing", team: "Gamma", start: 5.0, end: 8.0 },
                        ],
                        ["task", "team"],
                        row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "blue" })],
                        {
                            maxSlot: 10.0,
                            boundaries: [
                                { x: 4.0, stroke: "red", strokeWidth: 2 },
                                { x: 7.0, stroke: "green", strokeWidth: 2, strokeDash: "4 2" },
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
                        { task: "Design Review", assignee: "Alice", start: 1.0, end: 3.0 },
                        { task: "Code Sprint", assignee: "Bob", start: 2.0, end: 5.0 },
                        { task: "QA Testing", assignee: "Charlie", start: 4.0, end: 6.0 },
                    ],
                    ["task", "assignee"],
                    row => [Planner.Event({ start: row.start, end: row.end, label: row.task, colorPalette: "blue" })],
                    {
                        maxSlot: 8.0,
                        onEventEdit: East.function([Planner.Types.ClickEvent], NullType, () => {
                            // In a real app, this would open an edit dialog
                            return null;
                        }),
                        onEventDelete: East.function([Planner.Types.DeleteEvent], NullType, () => {
                            // In a real app, this would delete the event
                            return null;
                        }),
                    }
                ),
                some(`
                    Planner.Root(
                        [
                            { task: "Design Review", assignee: "Alice", start: 1.0, end: 3.0 },
                            { task: "Code Sprint", assignee: "Bob", start: 2.0, end: 5.0 },
                            { task: "QA Testing", assignee: "Charlie", start: 4.0, end: 6.0 },
                        ],
                        ["task", "assignee"],
                        row => [Planner.Event({ start: row.start, end: row.end, label: row.task, colorPalette: "blue" })],
                        {
                            maxSlot: 8.0,
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

        // Read-only mode - disables all interactions
        const readOnlyMode = $.let(
            ShowcaseCard(
                "Read-Only Mode",
                "Disables moving, resizing, adding, and deleting events",
                Planner.Root(
                    [
                        { task: "Fixed Task A", start: 1.0, end: 3.0 },
                        { task: "Fixed Task B", start: 2.0, end: 5.0 },
                        { task: "Fixed Task C", start: 4.0, end: 7.0 },
                    ],
                    ["task"],
                    row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "gray", label: row.task })],
                    {
                        maxSlot: 8.0,
                        readOnly: true,
                    }
                ),
                some(`
                    Planner.Root(
                        [
                            { task: "Fixed Task A", start: 1.0, end: 3.0 },
                            { task: "Fixed Task B", start: 2.0, end: 5.0 },
                            { task: "Fixed Task C", start: 4.0, end: 7.0 },
                        ],
                        ["task"],
                        row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "gray", label: row.task })],
                        {
                            maxSlot: 8.0,
                            readOnly: true,  // Disables all event interactions
                        }
                    )
                `)
            )
        );

        // Event styling with custom colors, fonts, opacity
        const eventStyling = $.let(
            ShowcaseCard(
                "Event Styling",
                "Custom color, background, opacity, font weight, style, size, and alignment",
                Planner.Root(
                    [
                        { task: "Default", start: 1.0, end: 4.0 },
                        { task: "Bold Red", start: 1.0, end: 4.0 },
                        { task: "Custom BG", start: 1.0, end: 4.0 },
                        { task: "Faded", start: 1.0, end: 4.0 },
                    ],
                    ["task"],
                    () => [
                        Planner.Event({
                            start: 1.0,
                            end: 3.0,
                            label: "Default",
                            colorPalette: "blue",
                        }),
                        Planner.Event({
                            start: 4.0,
                            end: 6.0,
                            label: "Bold Red",
                            colorPalette: "gray",
                            color: "red.600",
                            fontWeight: "bold",
                            fontSize: "md",
                        }),
                        Planner.Event({
                            start: 7.0,
                            end: 9.0,
                            label: "Centered",
                            background: "#ff69b4",
                            stroke: "#c71585",
                            color: "white",
                            fontWeight: "semibold",
                            textAlign: "center",
                        }),
                        Planner.Event({
                            start: 10.0,
                            end: 12.0,
                            label: "Faded Italic",
                            colorPalette: "red",
                            opacity: 0.5,
                            fontStyle: "italic",
                        }),
                    ],
                    { maxSlot: 13.0 }
                ),
                some(`
                    Planner.Root(
                        [...],
                        ["task"],
                        row => [
                            // Default styling
                            Planner.Event({ start: 1.0, end: 3.0, label: "Default", colorPalette: "blue" }),
                            // Bold text with custom color
                            Planner.Event({
                                start: 4.0, end: 6.0, label: "Bold Red",
                                colorPalette: "gray", color: "red.600",
                                fontWeight: "bold", fontSize: "md",
                            }),
                            // Custom background/stroke with centered text
                            Planner.Event({
                                start: 7.0, end: 9.0, label: "Centered",
                                background: "#ff69b4", stroke: "#c71585",
                                color: "white", fontWeight: "semibold", textAlign: "center",
                            }),
                            // Faded with italic
                            Planner.Event({
                                start: 10.0, end: 12.0, label: "Faded Italic",
                                colorPalette: "red", opacity: 0.5, fontStyle: "italic",
                            }),
                        ],
                        { maxSlot: 13.0 }
                    )
                `)
            )
        );

        return Stack.VStack([
            basic,
            withLabels,
            multipleEvents,
            singleSlotMode,
            fractionalSteps,
            customSlotLabels,
            styled,
            complexColumns,
            columnRenderWithRow,
            withBoundaries,
            withContextMenu,
            readOnlyMode,
            eventStyling,
        ], { gap: "6", align: "stretch" });
    }
);
