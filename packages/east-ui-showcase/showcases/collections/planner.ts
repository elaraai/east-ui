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
                            label: { value: "Active" },
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
                                label: { value: "Active" },
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
                        Planner.Event({ start: row.slot1, end: row.slot1.add(1.0), colorPalette: "green", label: { value: "Sprint 1" } }),
                        Planner.Event({ start: row.slot2, end: row.slot2.add(1.0), colorPalette: "blue", label: { value: "Sprint 2" } }),
                        Planner.Event({ start: row.slot3, end: row.slot3.add(1.0), colorPalette: "purple", label: { value: "Sprint 3" } }),
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
                            Planner.Event({ start: row.slot1, end: row.slot1.add(1.0), colorPalette: "green", label: { value: "Sprint 1" } }),
                            Planner.Event({ start: row.slot2, end: row.slot2.add(1.0), colorPalette: "blue", label: { value: "Sprint 2" } }),
                            Planner.Event({ start: row.slot3, end: row.slot3.add(1.0), colorPalette: "purple", label: { value: "Sprint 3" } }),
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
                    row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "purple", label: { value: row.task } })],
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
                        row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "purple", label: { value: row.task } })],
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
                    row => [Planner.Event({ start: row.start, end: row.end, label: { value: row.task }, colorPalette: "blue" })],
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
                        row => [Planner.Event({ start: row.start, end: row.end, label: { value: row.task }, colorPalette: "blue" })],
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

        // Event popover with click trigger (default)
        const popoverClick = $.let(
            ShowcaseCard(
                "Event Popover (Click)",
                "Click on events to see a popover with custom content",
                Planner.Root(
                    [
                        { task: "Sprint Planning", owner: "Alice", start: 1.0, end: 3.0 },
                        { task: "Development", owner: "Bob", start: 2.0, end: 5.0 },
                        { task: "Code Review", owner: "Charlie", start: 4.0, end: 6.0 },
                    ],
                    ["task", "owner"],
                    row => [Planner.Event({ start: row.start, end: row.end, label: { value: row.task }, colorPalette: "teal" })],
                    {
                        maxSlot: 8.0,
                        eventPopoverTrigger: "click",
                    },
                    East.function([Planner.Types.EventPopoverContext], UIComponentType, (_$, ctx) => {
                        return Stack.VStack([
                            Text.Root(East.str`Event Details`, { fontWeight: "bold" }),
                            Text.Root(East.str`Row: ${ctx.rowIndex}, Event: ${ctx.eventIndex}`),
                            Text.Root(East.str`Slots: ${ctx.start} - ${ctx.end}`),
                        ], { gap: "2" });
                    })
                ),
                some(`
                    Planner.Root(
                        [...],
                        ["task", "owner"],
                        row => [Planner.Event({ start: row.start, end: row.end, label: { value: row.task }, colorPalette: "teal" })],
                        {
                            maxSlot: 8.0,
                            eventPopoverTrigger: "click",
                        },
                        // 5th parameter: eventPopover function receives context
                        East.function([Planner.Types.EventPopoverContext], UIComponentType, ($, ctx) => {
                            return Stack.VStack([
                                Text.Root(East.str\`Event Details\`, { fontWeight: "bold" }),
                                Text.Root(East.str\`Row: \${ctx.rowIndex}, Event: \${ctx.eventIndex}\`),
                                Text.Root(East.str\`Slots: \${ctx.start} - \${ctx.end}\`),
                            ], { gap: "2" });
                        })
                    )
                `)
            )
        );

        // Event popover with hover trigger
        const popoverHover = $.let(
            ShowcaseCard(
                "Event Popover (Hover)",
                "Hover over events to see a tooltip-like popover",
                Planner.Root(
                    [
                        { resource: "Server A", status: "Active", start: 0.0, end: 4.0 },
                        { resource: "Server B", status: "Idle", start: 2.0, end: 6.0 },
                        { resource: "Server C", status: "Maintenance", start: 5.0, end: 8.0 },
                    ],
                    ["resource", "status"],
                    row => [Planner.Event({ start: row.start, end: row.end, label: { value: row.resource }, colorPalette: "purple" })],
                    {
                        maxSlot: 10.0,
                        eventPopoverTrigger: "hover",
                    },
                    East.function([Planner.Types.EventPopoverContext], UIComponentType, (_$, ctx) => {
                        return Stack.VStack([
                            Badge.Root(East.str`Event #${ctx.eventIndex}`, { colorPalette: "purple", variant: "solid" }),
                            Text.Root(East.str`Duration: ${ctx.end.subtract(ctx.start)} slots`),
                        ], { gap: "1", padding: "0px" });
                    })
                ),
                some(`
                    Planner.Root(
                        [...],
                        ["resource", "status"],
                        row => [Planner.Event({ start: row.start, end: row.end, label: { value: row.resource }, colorPalette: "purple" })],
                        {
                            maxSlot: 10.0,
                            eventPopoverTrigger: "hover",  // Shows on hover instead of click
                        },
                        East.function([Planner.Types.EventPopoverContext], UIComponentType, ($, ctx) => {
                            return Stack.VStack([
                                Badge.Root(East.str\`Event #\${ctx.eventIndex}\`, { colorPalette: "purple", variant: "solid" }),
                                Text.Root(East.str\`Duration: \${ctx.end.subtract(ctx.start)} slots\`),
                            ], { gap: "1" });
                        })
                    )
                `)
            )
        );

        // Popover combined with context menu
        const popoverAndContextMenu = $.let(
            ShowcaseCard(
                "Popover with Context Menu",
                "Click for popover, right-click for Edit/Delete menu",
                Planner.Root(
                    [
                        { project: "Alpha", phase: "Design", start: 1.0, end: 3.0 },
                        { project: "Beta", phase: "Build", start: 2.0, end: 5.0 },
                        { project: "Gamma", phase: "Test", start: 4.0, end: 7.0 },
                    ],
                    ["project", "phase"],
                    row => [Planner.Event({ start: row.start, end: row.end, label: { value: row.project }, colorPalette: "orange" })],
                    {
                        maxSlot: 8.0,
                        eventPopoverTrigger: "click",
                        onEventEdit: East.function([Planner.Types.ClickEvent], NullType, () => null),
                        onEventDelete: East.function([Planner.Types.DeleteEvent], NullType, () => null),
                    },
                    East.function([Planner.Types.EventPopoverContext], UIComponentType, (_$, ctx) => {
                        return Stack.VStack([
                            Text.Root(East.str`Project Info`, { fontWeight: "semibold" }),
                            Text.Root(East.str`Event #${ctx.eventIndex} in row ${ctx.rowIndex}`),
                            Text.Root(East.str`Time: ${ctx.start} to ${ctx.end}`),
                        ], { gap: "2" });
                    })
                ),
                some(`
                    Planner.Root(
                        [...],
                        ["project", "phase"],
                        row => [Planner.Event({ start: row.start, end: row.end, label: { value: row.project }, colorPalette: "orange" })],
                        {
                            maxSlot: 8.0,
                            eventPopoverTrigger: "click",
                            // Context menu callbacks for right-click
                            onEventEdit: East.function([Planner.Types.ClickEvent], NullType, ($, ev) => null),
                            onEventDelete: East.function([Planner.Types.DeleteEvent], NullType, ($, ev) => null),
                        },
                        // Popover content function
                        East.function([Planner.Types.EventPopoverContext], UIComponentType, ($, ctx) => {
                            return Stack.VStack([
                                Text.Root(East.str\`Project Info\`, { fontWeight: "semibold" }),
                                Text.Root(East.str\`Event #\${ctx.eventIndex} in row \${ctx.rowIndex}\`),
                                Text.Root(East.str\`Time: \${ctx.start} to \${ctx.end}\`),
                            ], { gap: "2" });
                        })
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
                    row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "gray", label: { value: row.task } })],
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
                        row => [Planner.Event({ start: row.start, end: row.end, colorPalette: "gray", label: { value: row.task } })],
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
                "Custom background, opacity, and label styling (color, font weight, style, size, alignment)",
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
                            label: { value: "Default" },
                            colorPalette: "blue",
                        }),
                        Planner.Event({
                            start: 4.0,
                            end: 6.0,
                            label: { value: "Bold Red", color: "red.600", fontWeight: "bold", fontSize: "md" },
                            colorPalette: "gray",
                        }),
                        Planner.Event({
                            start: 7.0,
                            end: 9.0,
                            label: { value: "Centered", align: "center", color: "white", fontWeight: "semibold" },
                            background: "#ff69b4",
                            stroke: "#c71585",
                        }),
                        Planner.Event({
                            start: 10.0,
                            end: 12.0,
                            label: { value: "Faded Italic", fontStyle: "italic" },
                            colorPalette: "red",
                            opacity: 0.5,
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
                            Planner.Event({ start: 1.0, end: 3.0, label: { value: "Default" }, colorPalette: "blue" }),
                            // Bold text with custom color (styling inside label object)
                            Planner.Event({
                                start: 4.0, end: 6.0,
                                label: { value: "Bold Red", color: "red.600", fontWeight: "bold", fontSize: "md" },
                                colorPalette: "gray",
                            }),
                            // Custom background/stroke with centered text
                            Planner.Event({
                                start: 7.0, end: 9.0,
                                label: { value: "Centered", align: "center", color: "white", fontWeight: "semibold" },
                                background: "#ff69b4", stroke: "#c71585",
                            }),
                            // Faded with italic
                            Planner.Event({
                                start: 10.0, end: 12.0,
                                label: { value: "Faded Italic", fontStyle: "italic" },
                                colorPalette: "red", opacity: 0.5,
                            }),
                        ],
                        { maxSlot: 13.0 }
                    )
                `)
            )
        );

        // Overlapping events with hover dimming
        const overlappingEvents = $.let(
            ShowcaseCard(
                "Overlapping Events",
                "Hover over an event to dim others in the same row, making overlapping labels readable",
                Planner.Root(
                    [
                        { resource: "Team Alpha", category: "Development" },
                        { resource: "Team Beta", category: "Design" },
                    ],
                    ["resource", "category"],
                    () => [
                        Planner.Event({ start: 0.0, end: 3.0, label: { value: "Task A" }, colorPalette: "blue" }),
                        Planner.Event({ start: 2.0, end: 5.0, label: { value: "Task B (overlaps A)" }, colorPalette: "green" }),
                        Planner.Event({ start: 4.0, end: 7.0, label: { value: "Task C (overlaps B)" }, colorPalette: "orange" }),
                        Planner.Event({ start: 6.0, end: 9.0, label: { value: "Task D (overlaps C)" }, colorPalette: "purple" }),
                    ],
                    { maxSlot: 10.0 }
                ),
                some(`
                    Planner.Root(
                        [
                            { resource: "Team Alpha", category: "Development" },
                            { resource: "Team Beta", category: "Design" },
                        ],
                        ["resource", "category"],
                        () => [
                            // Multiple overlapping events - hover to dim others
                            Planner.Event({ start: 0.0, end: 3.0, label: { value: "Task A" }, colorPalette: "blue" }),
                            Planner.Event({ start: 2.0, end: 5.0, label: { value: "Task B (overlaps A)" }, colorPalette: "green" }),
                            Planner.Event({ start: 4.0, end: 7.0, label: { value: "Task C (overlaps B)" }, colorPalette: "orange" }),
                            Planner.Event({ start: 6.0, end: 9.0, label: { value: "Task D (overlaps C)" }, colorPalette: "purple" }),
                        ],
                        { maxSlot: 10.0 }
                    )
                `)
            )
        );

        // Events with icons
        const withIcons = $.let(
            ShowcaseCard(
                "Events with Icons",
                "Icons can be positioned independently (start, center, end) with or without labels",
                Planner.Root(
                    [
                        { task: "Icon at Start", position: "start" },
                        { task: "Icon at Center", position: "center" },
                        { task: "Icon at End", position: "end" },
                        { task: "Icon + Label", position: "both" },
                    ],
                    ["task", "position"],
                    () => [
                        // Icon only at start (default)
                        Planner.Event({
                            start: 0.0,
                            end: 3.0,
                            icon: { prefix: "fas", name: "check", align: "start" },
                            colorPalette: "green",
                        }),
                        // Icon only at center
                        Planner.Event({
                            start: 4.0,
                            end: 7.0,
                            icon: { prefix: "fas", name: "spinner", align: "center" },
                            colorPalette: "blue",
                        }),
                        // Icon only at end
                        Planner.Event({
                            start: 8.0,
                            end: 11.0,
                            icon: { prefix: "fas", name: "flag", align: "end", color: "red.500" },
                            colorPalette: "gray",
                        }),
                        // Icon at start with label at end
                        Planner.Event({
                            start: 0.0,
                            end: 5.0,
                            icon: { prefix: "fas", name: "play", align: "start", size: "lg" },
                            label: { value: "In Progress", align: "end" },
                            colorPalette: "purple",
                        }),
                    ],
                    { maxSlot: 12.0 }
                ),
                some(`
                    Planner.Root(
                        [...],
                        ["task", "position"],
                        () => [
                            // Icon only at start (default alignment)
                            Planner.Event({
                                start: 0.0, end: 3.0,
                                icon: { prefix: "fas", name: "check", align: "start" },
                                colorPalette: "green",
                            }),
                            // Icon only at center
                            Planner.Event({
                                start: 4.0, end: 7.0,
                                icon: { prefix: "fas", name: "spinner", align: "center" },
                                colorPalette: "blue",
                            }),
                            // Icon only at end with custom color
                            Planner.Event({
                                start: 8.0, end: 11.0,
                                icon: { prefix: "fas", name: "flag", align: "end", color: "red.500" },
                                colorPalette: "gray",
                            }),
                            // Icon at start + label at end (independent positioning)
                            Planner.Event({
                                start: 0.0, end: 5.0,
                                icon: { prefix: "fas", name: "play", align: "start", size: "lg" },
                                label: { value: "In Progress", align: "end" },
                                colorPalette: "purple",
                            }),
                        ],
                        { maxSlot: 12.0 }
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
            popoverClick,
            popoverHover,
            popoverAndContextMenu,
            readOnlyMode,
            eventStyling,
            overlappingEvents,
            withIcons,
        ], { gap: "6", align: "stretch" });
    }
);
