/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Table } from "../../src/index.js";

describeEast("Table", (test) => {
    // =========================================================================
    // Table.Cell
    // =========================================================================

    test("creates cell with string value", $ => {
        const cell = $.let(Table.Cell("Hello"));

        $(assertEast.equal(cell.value, "Hello"));
        $(assertEast.equal(cell.style.hasTag("none"), true));
    });

    test("creates cell with styling", $ => {
        const cell = $.let(Table.Cell("$99.99", {
            textAlign: "right",
            color: "blue.500",
        }));

        $(assertEast.equal(cell.value, "$99.99"));
        $(assertEast.equal(cell.style.hasTag("some"), true));
        $(assertEast.equal(cell.style.unwrap("some").textAlign.hasTag("some"), true));
        $(assertEast.equal(cell.style.unwrap("some").textAlign.unwrap("some").hasTag("right"), true));
    });

    test("creates cell with background color", $ => {
        const cell = $.let(Table.Cell("Highlighted", {
            background: "yellow.100",
        }));

        $(assertEast.equal(cell.style.unwrap("some").background.hasTag("some"), true));
    });

    // =========================================================================
    // Table.Row
    // =========================================================================

    test("creates row with cells", $ => {
        const row = $.let(Table.Row([
            Table.Cell("Alice"),
            Table.Cell("30"),
        ]));

        $(assertEast.equal(row.key.hasTag("none"), true));
        $(assertEast.equal(row.style.hasTag("none"), true));
    });

    test("creates row with key", $ => {
        const row = $.let(Table.Row([
            Table.Cell("Bob"),
            Table.Cell("25"),
        ], {
            key: "user-1",
        }));

        $(assertEast.equal(row.key.hasTag("some"), true));
        $(assertEast.equal(row.key.unwrap("some"), "user-1"));
    });

    test("creates row with background", $ => {
        const row = $.let(Table.Row([
            Table.Cell("Selected"),
        ], {
            background: "blue.50",
        }));

        $(assertEast.equal(row.style.hasTag("some"), true));
        $(assertEast.equal(row.style.unwrap("some").background.hasTag("some"), true));
    });

    test("creates row with key and background", $ => {
        const row = $.let(Table.Row([
            Table.Cell("Item"),
        ], {
            key: "row-1",
            background: "gray.50",
        }));

        $(assertEast.equal(row.key.unwrap("some"), "row-1"));
        $(assertEast.equal(row.style.unwrap("some").background.hasTag("some"), true));
    });

    // =========================================================================
    // Table.Column
    // =========================================================================

    test("creates column with header", $ => {
        const column = $.let(Table.Column("Name"));

        $(assertEast.equal(column.header.hasTag("some"), true));
        $(assertEast.equal(column.header.unwrap("some"), "Name"));
        $(assertEast.equal(column.style.hasTag("none"), true));
    });

    test("creates column with textAlign", $ => {
        const column = $.let(Table.Column("Price", {
            textAlign: "right",
        }));

        $(assertEast.equal(column.header.unwrap("some"), "Price"));
        $(assertEast.equal(column.style.hasTag("some"), true));
        $(assertEast.equal(column.style.unwrap("some").textAlign.unwrap("some").hasTag("right"), true));
    });

    // =========================================================================
    // Table.Root - Basic Creation
    // =========================================================================

    test("creates table with columns and rows", $ => {
        const table = $.let(Table.Root(
            [
                Table.Column("Name"),
                Table.Column("Age"),
            ],
            [
                Table.Row([Table.Cell("Alice"), Table.Cell("30")]),
                Table.Row([Table.Cell("Bob"), Table.Cell("25")]),
            ]
        ));

        $(assertEast.equal(table.style.hasTag("none"), true));
    });

    test("creates empty table", $ => {
        const table = $.let(Table.Root([], []));

        $(assertEast.equal(table.style.hasTag("none"), true));
    });

    // =========================================================================
    // Table.Root - Variant
    // =========================================================================

    test("creates table with line variant", $ => {
        const table = $.let(Table.Root(
            [Table.Column("Col")],
            [Table.Row([Table.Cell("Val")])],
            { variant: "line" }
        ));

        $(assertEast.equal(table.style.hasTag("some"), true));
        $(assertEast.equal(table.style.unwrap("some").variant.hasTag("some"), true));
        $(assertEast.equal(table.style.unwrap("some").variant.unwrap("some").hasTag("line"), true));
    });

    test("creates table with outline variant", $ => {
        const table = $.let(Table.Root(
            [Table.Column("Col")],
            [Table.Row([Table.Cell("Val")])],
            { variant: "outline" }
        ));

        $(assertEast.equal(table.style.unwrap("some").variant.unwrap("some").hasTag("outline"), true));
    });

    // =========================================================================
    // Table.Root - Size
    // =========================================================================

    test("creates table with sm size", $ => {
        const table = $.let(Table.Root(
            [Table.Column("Col")],
            [Table.Row([Table.Cell("Val")])],
            { size: "sm" }
        ));

        $(assertEast.equal(table.style.unwrap("some").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates table with md size", $ => {
        const table = $.let(Table.Root(
            [Table.Column("Col")],
            [Table.Row([Table.Cell("Val")])],
            { size: "md" }
        ));

        $(assertEast.equal(table.style.unwrap("some").size.unwrap("some").hasTag("md"), true));
    });

    test("creates table with lg size", $ => {
        const table = $.let(Table.Root(
            [Table.Column("Col")],
            [Table.Row([Table.Cell("Val")])],
            { size: "lg" }
        ));

        $(assertEast.equal(table.style.unwrap("some").size.unwrap("some").hasTag("lg"), true));
    });

    // =========================================================================
    // Table.Root - Boolean Options
    // =========================================================================

    test("creates striped table", $ => {
        const table = $.let(Table.Root(
            [Table.Column("Col")],
            [Table.Row([Table.Cell("Val")])],
            { striped: true }
        ));

        $(assertEast.equal(table.style.unwrap("some").striped.hasTag("some"), true));
        $(assertEast.equal(table.style.unwrap("some").striped.unwrap("some"), true));
    });

    test("creates interactive table", $ => {
        const table = $.let(Table.Root(
            [Table.Column("Col")],
            [Table.Row([Table.Cell("Val")])],
            { interactive: true }
        ));

        $(assertEast.equal(table.style.unwrap("some").interactive.unwrap("some"), true));
    });

    test("creates table with sticky header", $ => {
        const table = $.let(Table.Root(
            [Table.Column("Col")],
            [Table.Row([Table.Cell("Val")])],
            { stickyHeader: true }
        ));

        $(assertEast.equal(table.style.unwrap("some").stickyHeader.unwrap("some"), true));
    });

    test("creates table with column borders", $ => {
        const table = $.let(Table.Root(
            [Table.Column("Col")],
            [Table.Row([Table.Cell("Val")])],
            { showColumnBorder: true }
        ));

        $(assertEast.equal(table.style.unwrap("some").showColumnBorder.unwrap("some"), true));
    });

    // =========================================================================
    // Table.Root - Color Palette
    // =========================================================================

    test("creates table with blue color palette", $ => {
        const table = $.let(Table.Root(
            [Table.Column("Col")],
            [Table.Row([Table.Cell("Val")])],
            { colorPalette: "blue" }
        ));

        $(assertEast.equal(table.style.unwrap("some").colorPalette.unwrap("some").hasTag("blue"), true));
    });

    test("creates table with green color palette", $ => {
        const table = $.let(Table.Root(
            [Table.Column("Col")],
            [Table.Row([Table.Cell("Val")])],
            { colorPalette: "green" }
        ));

        $(assertEast.equal(table.style.unwrap("some").colorPalette.unwrap("some").hasTag("green"), true));
    });

    // =========================================================================
    // Table.Root - Combined Options
    // =========================================================================

    test("creates table with all options", $ => {
        const table = $.let(Table.Root(
            [
                Table.Column("Name"),
                Table.Column("Email"),
                Table.Column("Role"),
            ],
            [
                Table.Row([
                    Table.Cell("Alice"),
                    Table.Cell("alice@example.com"),
                    Table.Cell("Admin"),
                ], { key: "1" }),
                Table.Row([
                    Table.Cell("Bob"),
                    Table.Cell("bob@example.com"),
                    Table.Cell("User"),
                ], { key: "2" }),
            ],
            {
                variant: "line",
                size: "md",
                striped: true,
                interactive: true,
                colorPalette: "blue",
            }
        ));

        $(assertEast.equal(table.style.unwrap("some").variant.unwrap("some").hasTag("line"), true));
        $(assertEast.equal(table.style.unwrap("some").size.unwrap("some").hasTag("md"), true));
        $(assertEast.equal(table.style.unwrap("some").striped.unwrap("some"), true));
        $(assertEast.equal(table.style.unwrap("some").interactive.unwrap("some"), true));
        $(assertEast.equal(table.style.unwrap("some").colorPalette.unwrap("some").hasTag("blue"), true));
    });

    // =========================================================================
    // Table - Real-World Examples
    // =========================================================================

    test("creates product table", $ => {
        const table = $.let(Table.Root(
            [
                Table.Column("Product"),
                Table.Column("Category"),
                Table.Column("Price", { textAlign: "right" }),
                Table.Column("Stock", { textAlign: "right" }),
            ],
            [
                Table.Row([
                    Table.Cell("Widget A"),
                    Table.Cell("Electronics"),
                    Table.Cell("$29.99"),
                    Table.Cell("150"),
                ]),
                Table.Row([
                    Table.Cell("Gadget B"),
                    Table.Cell("Accessories"),
                    Table.Cell("$14.99"),
                    Table.Cell("300"),
                ]),
            ],
            { variant: "outline", size: "sm" }
        ));

        $(assertEast.equal(table.style.unwrap("some").variant.unwrap("some").hasTag("outline"), true));
        $(assertEast.equal(table.style.unwrap("some").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates user management table", $ => {
        const table = $.let(Table.Root(
            [
                Table.Column("Name"),
                Table.Column("Email"),
                Table.Column("Status"),
                Table.Column("Role"),
            ],
            [
                Table.Row([
                    Table.Cell("Alice Smith"),
                    Table.Cell("alice@example.com"),
                    Table.Cell("Active"),
                    Table.Cell("Admin"),
                ], { key: "user-1" }),
                Table.Row([
                    Table.Cell("Bob Jones"),
                    Table.Cell("bob@example.com"),
                    Table.Cell("Inactive"),
                    Table.Cell("User"),
                ], { key: "user-2" }),
            ],
            {
                variant: "line",
                striped: true,
                interactive: true,
                stickyHeader: true,
            }
        ));

        $(assertEast.equal(table.style.unwrap("some").stickyHeader.unwrap("some"), true));
    });

    test("creates financial report table", $ => {
        const table = $.let(Table.Root(
            [
                Table.Column("Quarter"),
                Table.Column("Revenue", { textAlign: "right" }),
                Table.Column("Expenses", { textAlign: "right" }),
                Table.Column("Profit", { textAlign: "right" }),
            ],
            [
                Table.Row([
                    Table.Cell("Q1 2024"),
                    Table.Cell("$1,250,000"),
                    Table.Cell("$980,000"),
                    Table.Cell("$270,000", { color: "green.600" }),
                ]),
                Table.Row([
                    Table.Cell("Q2 2024"),
                    Table.Cell("$1,450,000"),
                    Table.Cell("$1,100,000"),
                    Table.Cell("$350,000", { color: "green.600" }),
                ]),
            ],
            {
                variant: "line",
                size: "lg",
                showColumnBorder: true,
            }
        ));

        $(assertEast.equal(table.style.unwrap("some").showColumnBorder.unwrap("some"), true));
    });
});
