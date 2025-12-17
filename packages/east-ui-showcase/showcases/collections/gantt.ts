/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { East, some, StringType, NullType, DateTimeType, variant } from "@elaraai/east";
import { Gantt, UIComponentType, Grid, State, Reactive, Stack, Badge, Table, Text } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Gantt showcase - demonstrates Gantt chart variants and features.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic Gantt with tasks
        const basic = $.let(
            ShowcaseCard(
                "Basic Gantt",
                "Simple project timeline with tasks",
                Gantt.Root(
                    [
                        { task: "Planning", owner: "Alice", start: new Date("2024-01-01"), end: new Date("2024-01-15") },
                        { task: "Design", owner: "Bob", start: new Date("2024-01-10"), end: new Date("2024-02-01") },
                        { task: "Development", owner: "Charlie", start: new Date("2024-01-20"), end: new Date("2024-03-15") },
                        { task: "Testing", owner: "Diana", start: new Date("2024-03-01"), end: new Date("2024-03-30") },
                    ],
                    ["task", "owner"],
                    row => [Gantt.Task({ start: row.start, end: row.end })]
                ),
                some(`
                    Gantt.Root(
                        [
                            { task: "Planning", owner: "Alice", start: new Date("2024-01-01"), end: new Date("2024-01-15") },
                            { task: "Design", owner: "Bob", start: new Date("2024-01-10"), end: new Date("2024-02-01") },
                            { task: "Development", owner: "Charlie", start: new Date("2024-01-20"), end: new Date("2024-03-15") },
                            { task: "Testing", owner: "Diana", start: new Date("2024-03-01"), end: new Date("2024-03-30") },
                        ],
                        ["task", "owner"],
                        row => [Gantt.Task({ start: row.start, end: row.end })]
                    )
                `)
            )
        );

        // Gantt with custom headers
        const customHeaders = $.let(
            ShowcaseCard(
                "Custom Headers",
                "Object config with custom column headers",
                Gantt.Root(
                    [
                        { phase: "Research", team: "R&D", start: new Date("2024-02-01"), end: new Date("2024-02-28") },
                        { phase: "Prototype", team: "Engineering", start: new Date("2024-02-15"), end: new Date("2024-03-31") },
                        { phase: "Launch", team: "Marketing", start: new Date("2024-03-15"), end: new Date("2024-04-15") },
                    ],
                    {
                        phase: { header: "Phase" },
                        team: { header: "Team" },
                    },
                    row => [Gantt.Task({ start: row.start, end: row.end, colorPalette: "teal" })]
                ),
                some(`
                    Gantt.Root(
                        [
                            { phase: "Research", team: "R&D", start: new Date("2024-02-01"), end: new Date("2024-02-28") },
                            { phase: "Prototype", team: "Engineering", start: new Date("2024-02-15"), end: new Date("2024-03-31") },
                            { phase: "Launch", team: "Marketing", start: new Date("2024-03-15"), end: new Date("2024-04-15") },
                        ],
                        {
                            phase: { header: "Phase" },
                            team: { header: "Team" },
                        },
                        row => [Gantt.Task({ start: row.start, end: row.end, colorPalette: "teal" })]
                    )
                `)
            )
        );

        // Gantt with milestones
        const withMilestones = $.let(
            ShowcaseCard(
                "Tasks & Milestones",
                "Combining tasks with milestone markers",
                Gantt.Root(
                    [
                        { name: "Sprint 1", start: new Date("2024-01-01"), end: new Date("2024-01-14"), release: new Date("2024-01-14") },
                        { name: "Sprint 2", start: new Date("2024-01-15"), end: new Date("2024-01-28"), release: new Date("2024-01-28") },
                        { name: "Sprint 3", start: new Date("2024-01-29"), end: new Date("2024-02-11"), release: new Date("2024-02-11") },
                    ],
                    { name: { header: "Sprint" } },
                    row => [
                        Gantt.Task({ start: row.start, end: row.end, colorPalette: "blue" }),
                        Gantt.Milestone({ date: row.release, label: "Release", colorPalette: "green" }),
                    ]
                ),
                some(`
                    Gantt.Root(
                        [
                            { name: "Sprint 1", start: new Date("2024-01-01"), end: new Date("2024-01-14"), release: new Date("2024-01-14") },
                            { name: "Sprint 2", start: new Date("2024-01-15"), end: new Date("2024-01-28"), release: new Date("2024-01-28") },
                            { name: "Sprint 3", start: new Date("2024-01-29"), end: new Date("2024-02-11"), release: new Date("2024-02-11") },
                        ],
                        { name: { header: "Sprint" } },
                        row => [
                            Gantt.Task({ start: row.start, end: row.end, colorPalette: "blue" }),
                            Gantt.Milestone({ date: row.release, label: "Release", colorPalette: "green" }),
                        ]
                    )
                `)
            )
        );

        // Gantt with progress
        const withProgress = $.let(
            ShowcaseCard(
                "Progress Tracking",
                "Tasks with progress indicators",
                Gantt.Root(
                    [
                        { task: "Backend API", start: new Date("2024-01-01"), end: new Date("2024-02-15"), progress: 100 },
                        { task: "Frontend UI", start: new Date("2024-01-15"), end: new Date("2024-03-01"), progress: 75 },
                        { task: "Integration", start: new Date("2024-02-01"), end: new Date("2024-03-15"), progress: 40 },
                        { task: "QA Testing", start: new Date("2024-02-15"), end: new Date("2024-04-01"), progress: 10 },
                    ],
                    { task: { header: "Task" } },
                    row => [
                        Gantt.Task({
                            start: row.start,
                            end: row.end,
                            progress: row.progress,
                            colorPalette: "purple",
                        }),
                    ]
                ),
                some(`
                    Gantt.Root(
                        [
                            { task: "Backend API", start: new Date("2024-01-01"), end: new Date("2024-02-15"), progress: 100 },
                            { task: "Frontend UI", start: new Date("2024-01-15"), end: new Date("2024-03-01"), progress: 75 },
                            { task: "Integration", start: new Date("2024-02-01"), end: new Date("2024-03-15"), progress: 40 },
                            { task: "QA Testing", start: new Date("2024-02-15"), end: new Date("2024-04-01"), progress: 10 },
                        ],
                        { task: { header: "Task" } },
                        row => [
                            Gantt.Task({
                                start: row.start,
                                end: row.end,
                                progress: row.progress,
                                colorPalette: "purple",
                            }),
                        ]
                    )
                `)
            )
        );

        // Colorful tasks
        const colorful = $.let(
            ShowcaseCard(
                "Color Palettes",
                "Different colors for different task types",
                Gantt.Root(
                    [
                        { type: "Feature", name: "User Auth", start: new Date("2024-01-01"), end: new Date("2024-01-20") },
                        { type: "Bug Fix", name: "Login Issue", start: new Date("2024-01-10"), end: new Date("2024-01-15") },
                        { type: "Enhancement", name: "Performance", start: new Date("2024-01-15"), end: new Date("2024-02-01") },
                        { type: "Feature", name: "Dashboard", start: new Date("2024-01-20"), end: new Date("2024-02-15") },
                    ],
                    {
                        type: { header: "Type" },
                        name: { header: "Name" },
                    },
                    row => [
                        Gantt.Task({
                            start: row.start,
                            end: row.end,
                            label: row.name,
                        }),
                    ]
                ),
                some(`
                    Gantt.Root(
                        [
                            { type: "Feature", name: "User Auth", start: new Date("2024-01-01"), end: new Date("2024-01-20") },
                            { type: "Bug Fix", name: "Login Issue", start: new Date("2024-01-10"), end: new Date("2024-01-15") },
                            { type: "Enhancement", name: "Performance", start: new Date("2024-01-15"), end: new Date("2024-02-01") },
                            { type: "Feature", name: "Dashboard", start: new Date("2024-01-20"), end: new Date("2024-02-15") },
                        ],
                        {
                            type: { header: "Type" },
                            name: { header: "Name" },
                        },
                        row => [
                            Gantt.Task({
                                start: row.start,
                                end: row.end,
                                label: row.name,
                            }),
                        ]
                    )
                `)
            )
        );

        // Styled Gantt
        const styled = $.let(
            ShowcaseCard(
                "Full Styling",
                "Multiple style options combined",
                Gantt.Root(
                    [
                        { dept: "Engineering", project: "Platform v2", start: new Date("2024-01-01"), end: new Date("2024-03-31") },
                        { dept: "Design", project: "UI Refresh", start: new Date("2024-01-15"), end: new Date("2024-02-28") },
                        { dept: "DevOps", project: "CI/CD Pipeline", start: new Date("2024-02-01"), end: new Date("2024-02-28") },
                        { dept: "QA", project: "Test Automation", start: new Date("2024-02-15"), end: new Date("2024-04-15") },
                    ],
                    {
                        dept: { header: "Department" },
                        project: { header: "Project" },
                    },
                    row => [Gantt.Task({ start: row.start, end: row.end, colorPalette: "cyan" })],
                    {
                        variant: "line",
                        striped: true,
                        interactive: true,
                        showToday: true,
                    }
                ),
                some(`
                    Gantt.Root(
                        [
                            { dept: "Engineering", project: "Platform v2", start: new Date("2024-01-01"), end: new Date("2024-03-31") },
                            { dept: "Design", project: "UI Refresh", start: new Date("2024-01-15"), end: new Date("2024-02-28") },
                            { dept: "DevOps", project: "CI/CD Pipeline", start: new Date("2024-02-01"), end: new Date("2024-02-28") },
                            { dept: "QA", project: "Test Automation", start: new Date("2024-02-15"), end: new Date("2024-04-15") },
                        ],
                        {
                            dept: { header: "Department" },
                            project: { header: "Project" },
                        },
                        row => [Gantt.Task({ start: row.start, end: row.end, colorPalette: "cyan" })],
                        {
                            variant: "line",
                            striped: true,
                            interactive: true,
                            showToday: true,
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
                Gantt.Root(
                    [
                        { task: "Backend API", owner: "Alice", priority: "high", start: new Date("2024-01-01"), end: new Date("2024-02-15") },
                        { task: "Frontend UI", owner: "Bob", priority: "medium", start: new Date("2024-01-15"), end: new Date("2024-03-01") },
                        { task: "Integration", owner: "Charlie", priority: "high", start: new Date("2024-02-01"), end: new Date("2024-03-15") },
                        { task: "Documentation", owner: "Diana", priority: "low", start: new Date("2024-02-15"), end: new Date("2024-04-01") },
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
                                East.str`${value} ${row.owner}`,
                                {
                                    variant: "solid",
                                }
                            ),
                        },
                    },
                    row => [Gantt.Task({ start: row.start, end: row.end })],
                    { variant: "line", striped: true }
                ),
                some(`
                    Gantt.Root(
                        [
                            { task: "Backend API", owner: "Alice", priority: "high", start: new Date("2024-01-01"), end: new Date("2024-02-15") },
                            { task: "Frontend UI", owner: "Bob", priority: "medium", start: new Date("2024-01-15"), end: new Date("2024-03-01") },
                            { task: "Integration", owner: "Charlie", priority: "high", start: new Date("2024-02-01"), end: new Date("2024-03-15") },
                            { task: "Documentation", owner: "Diana", priority: "low", start: new Date("2024-02-15"), end: new Date("2024-04-01") },
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
                        row => [Gantt.Task({ start: row.start, end: row.end })],
                        { variant: "line", striped: true }
                    )
                `)
            )
        );

        // =====================================================================
        // INTERACTIVE EXAMPLE - Demonstrate all callbacks
        // =====================================================================

        // Initialize state for interactive example
        $(State.initTyped("gantt_last_event", "", StringType)());

        // Interactive Gantt with all callbacks
        const interactiveCallbacks = $.let(
            ShowcaseCard(
                "All Callbacks",
                "Click rows, cells, tasks, milestones or drag to see events",
                Reactive.Root($ => {
                    const lastEvent = $.let(State.readTyped("gantt_last_event", StringType)());

                    // Table-inherited callbacks
                    const onRowClick = East.function(
                        [Table.Types.RowClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str`onRowClick: row ${event.rowIndex}`), StringType)());
                        }
                    );

                    const onRowDoubleClick = East.function(
                        [Table.Types.RowClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str`onRowDoubleClick: row ${event.rowIndex}`), StringType)());
                        }
                    );

                    const onCellClick = East.function(
                        [Table.Types.CellClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str`onCellClick: row ${event.rowIndex}, col ${event.columnKey}`), StringType)());
                        }
                    );

                    const onCellDoubleClick = East.function(
                        [Table.Types.CellClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str`onCellDoubleClick: row ${event.rowIndex}, col ${event.columnKey}`), StringType)());
                        }
                    );

                    const onSortChange = East.function(
                        [Table.Types.SortEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str`onSortChange: ${event.columnKey} - ${event.sortDirection.getTag()}`), StringType)());
                        }
                    );

                    // Gantt-specific callbacks
                    const onTaskClick = East.function(
                        [Gantt.Types.TaskClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str`onTaskClick: row ${event.rowIndex}, task ${event.taskIndex}`), StringType)());
                        }
                    );

                    const onTaskDoubleClick = East.function(
                        [Gantt.Types.TaskClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str`onTaskDoubleClick: row ${event.rowIndex}, task ${event.taskIndex}`), StringType)());
                        }
                    );

                    const onTaskDrag = East.function(
                        [Gantt.Types.TaskDragEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str`onTaskDrag: row ${event.rowIndex}, task ${event.taskIndex} moved`), StringType)());
                        }
                    );

                    const onTaskDurationChange = East.function(
                        [Gantt.Types.TaskDurationChangeEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str`onTaskDurationChange: row ${event.rowIndex}, task ${event.taskIndex}, new end date`), StringType)());
                        }
                    );

                    const onTaskProgressChange = East.function(
                        [Gantt.Types.TaskProgressChangeEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str`onTaskProgressChange: row ${event.rowIndex}, task ${event.taskIndex}, progress ${event.newProgress}`), StringType)());
                        }
                    );

                    const onMilestoneClick = East.function(
                        [Gantt.Types.MilestoneClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str`onMilestoneClick: row ${event.rowIndex}, milestone ${event.milestoneIndex}`), StringType)());
                        }
                    );

                    const onMilestoneDoubleClick = East.function(
                        [Gantt.Types.MilestoneClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str`onMilestoneDoubleClick: row ${event.rowIndex}, milestone ${event.milestoneIndex}`), StringType)());
                        }
                    );

                    const onMilestoneDrag = East.function(
                        [Gantt.Types.MilestoneDragEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str`onMilestoneDrag: row ${event.rowIndex}, milestone ${event.milestoneIndex} moved`), StringType)());
                        }
                    );

                    return Stack.VStack([
                        Gantt.Root(
                            [
                                { name: "Sprint 1", start: new Date("2024-01-01"), end: new Date("2024-01-14"), release: new Date("2024-01-14") },
                                { name: "Sprint 2", start: new Date("2024-01-15"), end: new Date("2024-01-28"), release: new Date("2024-01-28") },
                                { name: "Sprint 3", start: new Date("2024-01-29"), end: new Date("2024-02-11"), release: new Date("2024-02-11") },
                            ],
                            { name: { header: "Sprint" } },
                            row => [
                                Gantt.Task({ start: row.start, end: row.end, colorPalette: "blue", progress: 50 }),
                                Gantt.Milestone({ date: row.release, label: "Release", colorPalette: "green" }),
                            ],
                            {
                                interactive: true,
                                striped: true,
                                showToday: true,
                                onRowClick,
                                onRowDoubleClick,
                                onCellClick,
                                onCellDoubleClick,
                                onSortChange,
                                onTaskClick,
                                onTaskDoubleClick,
                                onTaskDrag,
                                onTaskDurationChange,
                                onTaskProgressChange,
                                onMilestoneClick,
                                onMilestoneDoubleClick,
                                onMilestoneDrag,
                            }
                        ),
                        Badge.Root(
                            East.equal(lastEvent.unwrap('some').length(), 0n).ifElse($ => "Interact with the Gantt chart", $ => lastEvent.unwrap('some')),
                            { colorPalette: "blue", variant: "outline" }
                        ),
                    ], { gap: "3", align: "stretch" });
                }),
                some(`
                Reactive.Root($ => {
                    const lastEvent = $.let(State.readTyped("gantt_last_event", StringType)());

                    // Table-inherited callbacks
                    const onRowClick = East.function(
                        [Table.Types.RowClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str\`onRowClick: row \${event.rowIndex} \`), StringType)());
                        }
                    );

                    const onRowDoubleClick = East.function(
                        [Table.Types.RowClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str\`onRowDoubleClick: row \${event.rowIndex}\`), StringType)());
                        }
                    );

                    const onCellClick = East.function(
                        [Table.Types.CellClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str\`onCellClick: row \${event.rowIndex}, col \${event.columnKey}\`), StringType)());
                        }
                    );

                    const onCellDoubleClick = East.function(
                        [Table.Types.CellClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str\`onCellDoubleClick: row \${event.rowIndex}, col \${event.columnKey}\`), StringType)());
                        }
                    );

                    const onSortChange = East.function(
                        [Table.Types.SortEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str\`onSortChange: \${event.columnKey} - \${event.sortDirection.getTag()}\`), StringType)());
                        }
                    );

                    // Gantt-specific callbacks
                    const onTaskClick = East.function(
                        [Gantt.Types.TaskClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str\`onTaskClick: row \${event.rowIndex}, task \${event.taskIndex}\`), StringType)());
                        }
                    );

                    const onTaskDoubleClick = East.function(
                        [Gantt.Types.TaskClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str\`onTaskDoubleClick: row \${event.rowIndex}, task \${event.taskIndex}\`), StringType)());
                        }
                    );

                    const onTaskDrag = East.function(
                        [Gantt.Types.TaskDragEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str\`onTaskDrag: row \${event.rowIndex}, task \${event.taskIndex} moved\`), StringType)());
                        }
                    );

                    const onTaskDurationChange = East.function(
                        [Gantt.Types.TaskDurationChangeEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str\`onTaskDurationChange: row \${event.rowIndex}, task \${event.taskIndex}, new end date\`), StringType)());
                        }
                    );

                    const onTaskProgressChange = East.function(
                        [Gantt.Types.TaskProgressChangeEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str\`onTaskProgressChange: row \${event.rowIndex}, task \${event.taskIndex}, progress \${event.newProgress}\`), StringType)());
                        }
                    );

                    const onMilestoneClick = East.function(
                        [Gantt.Types.MilestoneClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str\`onMilestoneClick: row \${event.rowIndex}, milestone \${event.milestoneIndex}\`), StringType)());
                        }
                    );

                    const onMilestoneDoubleClick = East.function(
                        [Gantt.Types.MilestoneClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str\`onMilestoneDoubleClick: row \${event.rowIndex}, milestone \${event.milestoneIndex}\`), StringType)());
                        }
                    );

                    const onMilestoneDrag = East.function(
                        [Gantt.Types.MilestoneDragEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_last_event", some(East.str\`onMilestoneDrag: row \${event.rowIndex}, milestone \${event.milestoneIndex} moved\`), StringType)());
                        }
                    );

                    return Stack.VStack([
                        Gantt.Root(
                            [
                                { name: "Sprint 1", start: new Date("2024-01-01"), end: new Date("2024-01-14"), release: new Date("2024-01-14") },
                                { name: "Sprint 2", start: new Date("2024-01-15"), end: new Date("2024-01-28"), release: new Date("2024-01-28") },
                                { name: "Sprint 3", start: new Date("2024-01-29"), end: new Date("2024-02-11"), release: new Date("2024-02-11") },
                            ],
                            { name: { header: "Sprint" } },
                            row => [
                                Gantt.Task({ start: row.start, end: row.end, colorPalette: "blue", progress: 50 }),
                                Gantt.Milestone({ date: row.release, label: "Release", colorPalette: "green" }),
                            ],
                            {
                                interactive: true,
                                striped: true,
                                showToday: true,
                                onRowClick,
                                onRowDoubleClick,
                                onCellClick,
                                onCellDoubleClick,
                                onSortChange,
                                onTaskClick,
                                onTaskDoubleClick,
                                onTaskDrag,
                                onTaskDurationChange,
                                onTaskProgressChange,
                                onMilestoneClick,
                                onMilestoneDoubleClick,
                                onMilestoneDrag,
                            }
                        ),
                        Badge.Root(
                            East.equal(lastEvent.unwrap('some').length(), 0n).ifElse($ => "Interact with the Gantt chart", $ => lastEvent.unwrap('some')),
                            { colorPalette: "blue", variant: "outline" }
                        ),
                    ], { gap: "3", align: "stretch" });
                })
            `)
            )
        );

        // =====================================================================
        // REACTIVE DRAG EXAMPLE - Task dates stored in state and updated on drag
        // =====================================================================

        // Initialize state for the draggable task's start date
        $(State.initTyped("gantt_task_start", new Date("2024-01-15"), DateTimeType)());

        const reactiveDrag = $.let(
            ShowcaseCard(
                "Reactive Drag",
                "Drag task to update state - position persists after re-render",
                Reactive.Root($ => {
                    // Read task start date from state
                    const taskStart = $.let(State.readTyped("gantt_task_start", DateTimeType)());
                    // Calculate end date (14 days after start)
                    const taskEnd = $.let(taskStart.unwrap('some').addDays(14));

                    // Callback to update start date when dragged
                    const onTaskDrag = East.function(
                        [Gantt.Types.TaskDragEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_task_start", some(event.newStart), DateTimeType)());
                        }
                    );

                    return Stack.VStack([
                        Gantt.Root(
                            [{ name: "Draggable Task" }],
                            { name: { header: "Task" } },
                            _row => [
                                Gantt.Task({
                                    start: taskStart.unwrap('some'),
                                    end: taskEnd,
                                    label: "Drag me!",
                                    colorPalette: "orange",
                                }),
                            ],
                            {
                                interactive: true,
                                onTaskDrag,
                                // Snap to 1-day increments when dragging
                                dragStep: variant("days", 1),
                                durationStep: variant("days", 1),
                            }
                        ),
                        Text.Root(East.str`Start: ${taskStart.unwrap('some')}`, { fontSize: "sm", color: "fg.muted" }),
                    ], { gap: "3", align: "stretch" });
                }),
                some(`
                // Initialize state with task start date
                $(State.initTyped("gantt_task_start", new Date("2024-01-15"), DateTimeType)());

                Reactive.Root($ => {
                    // Read from state
                    const taskStart = $.let(State.readTyped("gantt_task_start", DateTimeType)());
                    const taskEnd = $.let(East.datetime.addDays(taskStart, 14n));

                    // Update state on drag
                    const onTaskDrag = East.function(
                        [Gantt.Types.TaskDragEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("gantt_task_start", some(event.newStart), DateTimeType)());
                        }
                    );

                    return Gantt.Root(
                        [{ name: "Draggable Task" }],
                        { name: { header: "Task" } },
                        _row => [Gantt.Task({ start: taskStart, end: taskEnd, label: "Drag me!" })],
                        { interactive: true, onTaskDrag, dragStep: variant("days", 1) }
                    );
                })
            `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(customHeaders),
                Grid.Item(withMilestones),
                Grid.Item(withProgress),
                Grid.Item(colorful),
                Grid.Item(styled),
                // Column render with row access
                Grid.Item(columnRenderWithRow, { colSpan: "2" }),
                // Interactive example with all callbacks
                Grid.Item(interactiveCallbacks, { colSpan: "2" }),
                // Reactive drag example
                Grid.Item(reactiveDrag, { colSpan: "2" }),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
