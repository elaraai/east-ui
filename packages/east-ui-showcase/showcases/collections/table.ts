/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { East, some, StringType, NullType } from "@elaraai/east";
import { Table, UIComponentType, Grid, Badge, State, Reactive, Stack, Text } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Table showcase - demonstrates Table variants, sizes, and features.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic Table with array syntax
        const basic = $.let(
            ShowcaseCard(
                "Basic Table",
                "Simple table with field names",
                Table.Root(
                    [
                        { name: "Alice", email: "alice@example.com", role: "Admin", tags: ["team lead", "full-time"] },
                        { name: "Bob", email: "bob@example.com", role: "User", tags: ["part-time"] },
                        { name: "Charlie", email: "charlie@example.com", role: "User", tags: ["contractor"] },
                    ],
                    {
                        name: { header: "Name" },
                        email: { header: "Email" },
                        role: { header: "Role" },
                        tags: {
                            header: "Tags",
                            value: tags => tags.size(),
                            render: value => Stack.HStack(value.map(($, tag) => Badge.Root(tag)) as any, { gap: "1" })
                        },
                    }
                ),
                some(`
                    Table.Root(
                        [
                            { name: "Alice", email: "alice@example.com", role: "Admin", tags: ["team lead", "full-time"] },
                            { name: "Bob", email: "bob@example.com", role: "User", tags: ["part-time"] },
                            { name: "Charlie", email: "charlie@example.com", role: "User", tags: ["contractor"] },
                        ],
                        ["name", "email", "role", "tags"]
                    )
                `)
            )
        );

        // Table with custom headers and column widths
        const customHeaders = $.let(
            ShowcaseCard(
                "Custom Headers & Widths",
                "Object config with custom column headers and widths",
                Table.Root(
                    [
                        { firstName: "Alice", lastName: "Smith", dept: "Engineering" },
                        { firstName: "Bob", lastName: "Jones", dept: "Marketing" },
                    ],
                    {
                        firstName: { header: "First Name", width: "300px", minWidth: "80px" },
                        lastName: { header: "Last Name", width: "150px" },
                        dept: { header: "Department", minWidth: "100px", maxWidth: "200px" },
                    }
                ),
                some(`
                    Table.Root(
                        [
                            { firstName: "Alice", lastName: "Smith", dept: "Engineering" },
                            { firstName: "Bob", lastName: "Jones", dept: "Marketing" },
                        ],
                        {
                            firstName: { header: "First Name", width: "120px", minWidth: "80px" },
                            lastName: { header: "Last Name", width: "150px" },
                            dept: { header: "Department", minWidth: "100px", maxWidth: "200px" },
                        }
                    )
                `)
            )
        );

        // Striped Table
        const striped = $.let(
            ShowcaseCard(
                "Striped Table",
                "Alternating row colors for readability",
                Table.Root(
                    [
                        { product: "Widget A", price: "$29.99", stock: 150n },
                        { product: "Widget B", price: "$49.99", stock: 75n },
                        { product: "Widget C", price: "$19.99", stock: 200n },
                        { product: "Widget D", price: "$39.99", stock: 50n },
                    ],
                    {
                        product: { header: "Product" },
                        price: { header: "Price" },
                        stock: { header: "In Stock" },
                    },
                    { striped: true }
                ),
                some(`
                    Table.Root(
                        [
                            { product: "Widget A", price: "$29.99", stock: 150n },
                            { product: "Widget B", price: "$49.99", stock: 75n },
                            { product: "Widget C", price: "$19.99", stock: 200n },
                            { product: "Widget D", price: "$39.99", stock: 50n },
                        ],
                        {
                            product: { header: "Product" },
                            price: { header: "Price" },
                            stock: { header: "In Stock" },
                        },
                        { striped: true }
                    )
                `)
            )
        );

        // Interactive Table
        const interactive = $.let(
            ShowcaseCard(
                "Interactive Table",
                "Hover effects for better UX",
                Table.Root(
                    [
                        { id: "#001", task: "Review PR", status: "In Progress" },
                        { id: "#002", task: "Deploy v2.0", status: "Pending" },
                        { id: "#003", task: "Update docs", status: "Complete" },
                    ],
                    {
                        id: { header: "ID" },
                        task: { header: "Task" },
                        status: { header: "Status" },
                    },
                    { interactive: true }
                ),
                some(`
                    Table.Root(
                        [
                            { id: "#001", task: "Review PR", status: "In Progress" },
                            { id: "#002", task: "Deploy v2.0", status: "Pending" },
                            { id: "#003", task: "Update docs", status: "Complete" },
                        ],
                        {
                            id: { header: "ID" },
                            task: { header: "Task" },
                            status: { header: "Status" },
                        },
                        { interactive: true }
                    )
                `)
            )
        );

        // Custom render with Badge
        const withBadge = $.let(
            ShowcaseCard(
                "Custom Render",
                "Using Badge for status column",
                Table.Root(
                    East.Array.range(0n, 1000n).map(($, i) => ({
                        name: East.str`User ${i}`,
                        email: East.str`user${i}@example.com`,
                        status: "Active",
                    })),
                    {
                        name: { header: "Name" },
                        email: { header: "Email" },
                        status: { header: "Status", render: value => Badge.Root(value, { variant: "solid", colorPalette: "blue" }) },
                    },
                    { variant: "line" }
                ),
                some(`
                    Table.Root(
                        East.Array.range(0n, 1000n).map(($, i) => ({
                            name: East.str\`User \${i}\`,
                            email: East.str\`user\${i}@example.com\`,
                            status: "Active",
                        })),
                        {
                            name: { header: "Name" },
                            email: { header: "Email" },
                            status: { header: "Status", render: value => Badge.Root(value, { variant: "solid", colorPalette: "blue" }) },
                        },
                        { variant: "line" }
                    )
                `)
            )
        );

        // All style options
        const fullStyled = $.let(
            ShowcaseCard(
                "Full Styling",
                "Multiple style options combined",
                Table.Root(
                    [
                        { q1: "$45,000", q2: "$52,000", q3: "$48,000", q4: "$61,000" },
                        { q1: "$38,000", q2: "$41,000", q3: "$44,000", q4: "$47,000" },
                    ],
                    {
                        q1: { header: "Q1" },
                        q2: { header: "Q2" },
                        q3: { header: "Q3" },
                        q4: { header: "Q4" },
                    },
                    {
                        variant: "outline",
                        striped: true,
                        showColumnBorder: true,
                        colorPalette: "teal"
                    }
                ),
                some(`
                    Table.Root(
                        [
                            { q1: "$45,000", q2: "$52,000", q3: "$48,000", q4: "$61,000" },
                            { q1: "$38,000", q2: "$41,000", q3: "$44,000", q4: "$47,000" },
                        ],
                        {
                            q1: { header: "Q1" },
                            q2: { header: "Q2" },
                            q3: { header: "Q3" },
                            q4: { header: "Q4" },
                        },
                        {
                            variant: "outline",
                            striped: true,
                            showColumnBorder: true,
                            colorPalette: "teal"
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
                Table.Root(
                    [
                        { name: "Alice", skills: ["TypeScript", "React", "Node"], metadata: { level: "Senior", years: 5n } },
                        { name: "Bob", skills: ["Python", "Django"], metadata: { level: "Mid", years: 3n } },
                        { name: "Charlie", skills: ["Go", "Rust", "C++", "Java"], metadata: { level: "Senior", years: 8n } },
                    ],
                    {
                        name: { header: "Name" },
                        skills: {
                            header: "Skills",
                            // value function extracts sortable value from array
                            value: (skills) => skills.size(),
                            render: (skills) => Stack.HStack(skills.map(($, s) => Badge.Root(s, { variant: "subtle", colorPalette: "blue" })) as any, { gap: "1", wrap: "wrap" }),
                        },
                        metadata: {
                            header: "Experience",
                            // value function extracts sortable value from struct
                            value: (meta) => meta.years,
                            render: (meta) => Text.Root(East.str`${meta.level} (${meta.years} yrs)`),
                        },
                    },
                    { variant: "line", striped: true }
                ),
                some(`
                    Table.Root(
                        [
                            { name: "Alice", skills: ["TypeScript", "React", "Node"], metadata: { level: "Senior", years: 5n } },
                            { name: "Bob", skills: ["Python", "Django"], metadata: { level: "Mid", years: 3n } },
                            { name: "Charlie", skills: ["Go", "Rust", "C++", "Java"], metadata: { level: "Senior", years: 8n } },
                        ],
                        {
                            name: { header: "Name" },
                            skills: {
                                header: "Skills",
                                // value function extracts sortable value from array
                                value: (skills) => skills.size(),
                                render: (skills) => Stack.HStack(skills.map(($, s) => Badge.Root(s)) as any, { gap: "1" }),
                            },
                            metadata: {
                                header: "Experience",
                                // value function extracts sortable value from struct
                                value: (meta) => meta.years,
                                render: (meta) => Text.Root(East.str\`\${meta.level} (\${meta.years} yrs)\`),
                            },
                        },
                        { variant: "line", striped: true }
                    )
                `)
            )
        );

        // Column render with row access
        const columnRenderWithRow = $.let(
            ShowcaseCard(
                "Column Render with Row Access",
                "Render function accesses other row fields for conditional styling",
                Table.Root(
                    [
                        { name: "Alice", role: "Admin", status: "Active", score: 95n },
                        { name: "Bob", role: "User", status: "Inactive", score: 72n },
                        { name: "Charlie", role: "Manager", status: "Active", score: 88n },
                        { name: "Diana", role: "User", status: "Pending", score: 65n },
                    ],
                    {
                        name: {
                            header: "Name",
                            render: (value, row) => Text.Root(
                                East.str`${value} (${row.role})`,
                            ),
                        },
                        status: {
                            header: "Status",
                            render: (value) => Badge.Root(
                                value,
                                {
                                    variant: "solid",
                                }
                            ),
                        },
                        score: {
                            header: "Score",
                            render: (value) => Text.Root(
                                East.str`${value}`,
                            ),
                        },
                    },
                    { variant: "line", striped: true }
                ),
                some(`
                    Table.Root(
                        [
                            { name: "Alice", role: "Admin", status: "Active", score: 95n },
                            { name: "Bob", role: "User", status: "Inactive", score: 72n },
                            { name: "Charlie", role: "Manager", status: "Active", score: 88n },
                            { name: "Diana", role: "User", status: "Pending", score: 65n },
                        ],
                        {
                            name: {
                                header: "Name",
                                render: (value, row) => Text.Root(
                                    East.str\`\${value} (\${row.role})\`,
                                    { fontWeight: row.role.equal("Admin").ifElse("bold", "normal") }
                                ),
                            },
                            status: {
                                header: "Status",
                                render: (value, row) => Badge.Root(value, {
                                    colorPalette: row.status.equal("Active").ifElse("green",
                                        row.status.equal("Inactive").ifElse("red", "yellow")
                                    ),
                                    variant: "solid",
                                }),
                            },
                            score: {
                                header: "Score",
                                render: (value, row) => Text.Root(
                                    East.str\`\${value}\`,
                                    { color: row.score.greaterEqual(80n).ifElse("green.500", "red.500") }
                                ),
                            },
                        },
                        { variant: "line", striped: true }
                    )
                `)
            )
        );

        // =====================================================================
        // INTERACTIVE EXAMPLES - Demonstrate callbacks with Reactive.Root
        // =====================================================================

        // Initialize state for interactive examples
        $(State.initTyped("table_last_event", "", StringType)());

        // Interactive Table with all callbacks
        const interactiveCallbacks = $.let(
            ShowcaseCard(
                "All Callbacks",
                "Click, double-click rows/cells, or click headers to sort",
                Reactive.Root($ => {
                    const lastEvent = $.let(State.readTyped("table_last_event", StringType)());

                    const onRowClick = East.function(
                        [Table.Types.RowClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("table_last_event", some(East.str`onRowClick: row ${event.rowIndex}`), StringType)());
                        }
                    );

                    const onRowDoubleClick = East.function(
                        [Table.Types.RowClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("table_last_event", some(East.str`onRowDoubleClick: row ${event.rowIndex}`), StringType)());
                        }
                    );

                    const onCellClick = East.function(
                        [Table.Types.CellClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("table_last_event", some(East.str`onCellClick: row ${event.rowIndex}, col ${event.columnKey}`), StringType)());
                        }
                    );

                    const onCellDoubleClick = East.function(
                        [Table.Types.CellClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("table_last_event", some(East.str`onCellDoubleClick: row ${event.rowIndex}, col ${event.columnKey}`), StringType)());
                        }
                    );

                    const onRowSelectionChange = East.function(
                        [Table.Types.RowSelectionEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("table_last_event", some(
                                event.selected.ifElse(
                                    _$ => East.str`onRowSelectionChange: selected row ${event.rowIndex}`,
                                    _$ => East.str`onRowSelectionChange: deselected row ${event.rowIndex}`
                                )
                            ), StringType)());
                        }
                    );

                    const onSortChange = East.function(
                        [Table.Types.SortEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("table_last_event", some(East.str`onSortChange: ${event.columnKey} - ${event.sortDirection.getTag()}`), StringType)());
                        }
                    );

                    return Stack.VStack([
                        Table.Root(
                            [
                                { name: "Alice", role: "Admin", score: 95n },
                                { name: "Bob", role: "User", score: 88n },
                                { name: "Charlie", role: "User", score: 92n },
                            ],
                            {
                                name: { header: "Name" },
                                role: { header: "Role" },
                                score: { header: "Score" },
                            },
                            {
                                interactive: true,
                                striped: true,
                                onRowClick,
                                onRowDoubleClick,
                                onCellClick,
                                onCellDoubleClick,
                                onRowSelectionChange,
                                onSortChange,
                            }
                        ),
                        Badge.Root(
                            East.equal(lastEvent.unwrap('some').length(), 0n).ifElse(_$ => "Interact with the table", _$ => lastEvent.unwrap('some')),
                            { colorPalette: "blue", variant: "outline" }
                        ),
                    ], { gap: "3", align: "stretch" });
                }),
                some(`
                Reactive.Root($ => {
                    const lastEvent = $.let(State.readTyped("table_last_event", StringType)());

                    const onRowClick = East.function(
                        [Table.Types.RowClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("table_last_event", some(East.str\`onRowClick: row \${event.rowIndex}\`), StringType)());
                        }
                    );

                    const onRowDoubleClick = East.function(
                        [Table.Types.RowClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("table_last_event", some(East.str\`onRowDoubleClick: row \${event.rowIndex}\`), StringType)());
                        }
                    );

                    const onCellClick = East.function(
                        [Table.Types.CellClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("table_last_event", some(East.str\`onCellClick: row \${event.rowIndex}, col \${event.columnKey}\`), StringType)());
                        }
                    );

                    const onCellDoubleClick = East.function(
                        [Table.Types.CellClickEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("table_last_event", some(East.str\`onCellDoubleClick: row \${event.rowIndex}, col \${event.columnKey}\`), StringType)());
                        }
                    );

                    const onRowSelectionChange = East.function(
                        [Table.Types.RowSelectionEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("table_last_event", some(
                                event.selected.ifElse(
                                    _$ => East.str\`onRowSelectionChange: selected row \${event.rowIndex}\`,
                                    _$ => East.str\`onRowSelectionChange: deselected row \${event.rowIndex}\`
                                )
                            ), StringType)());
                        }
                    );

                    const onSortChange = East.function(
                        [Table.Types.SortEvent],
                        NullType,
                        ($, event) => {
                            $(State.writeTyped("table_last_event", some(East.str\`onSortChange: \${event.columnKey} - \${event.sortDirection.getTag()}\`), StringType)());
                        }
                    );

                    return Stack.VStack([
                        Table.Root(
                            [
                                { name: "Alice", role: "Admin", score: 95n },
                                { name: "Bob", role: "User", score: 88n },
                                { name: "Charlie", role: "User", score: 92n },
                            ],
                            {
                                name: { header: "Name" },
                                role: { header: "Role" },
                                score: { header: "Score" },
                            },
                            {
                                interactive: true,
                                striped: true,
                                onRowClick,
                                onRowDoubleClick,
                                onCellClick,
                                onCellDoubleClick,
                                onRowSelectionChange,
                                onSortChange,
                            }
                        ),
                        Badge.Root(
                            East.equal(lastEvent.unwrap('some').length(), 0n).ifElse(_$ => "Interact with the table", _$ => lastEvent.unwrap('some')),
                            { colorPalette: "blue", variant: "outline" }
                        ),
                    ], { gap: "3", align: "stretch" });
                })
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(customHeaders),
                Grid.Item(striped),
                Grid.Item(interactive),
                Grid.Item(withBadge),
                Grid.Item(fullStyled),
                // Complex column types with value functions
                Grid.Item(complexColumns, { colSpan: "2" }),
                // Column render with row access
                Grid.Item(columnRenderWithRow, { colSpan: "2" }),
                // Interactive example with all callbacks
                Grid.Item(interactiveCallbacks, { colSpan: "2" }),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
