/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Table, Badge, Text } from "../../src/index.js";

describeEast("Table", (test) => {
    // =========================================================================
    // Simple Array Syntax
    // =========================================================================

    test("creates table with array of field names", $ => {
        const table = $.let(Table.Root(
            [
                { name: "Alice", email: "alice@example.com" },
                { name: "Bob", email: "bob@example.com" },
            ],
            ["name", "email"]
        ));

        $(assertEast.equal(table.getTag(), "Table"));
        $(assertEast.equal(table.unwrap("Table").columns.size(), 2n));
        $(assertEast.equal(table.unwrap("Table").rows.size(), 2n));
    });

    // =========================================================================
    // Object Syntax with Default Rendering
    // =========================================================================

    test("creates table with object config (no render - uses default)", $ => {
        const table = $.let(Table.Root(
            [
                { name: "Alice", email: "alice@example.com" },
                { name: "Bob", email: "bob@example.com" },
            ],
            {
                name: { header: "Name" },
                email: { header: "Email" },
            }
        ));

        $(assertEast.equal(table.getTag(), "Table"));
        $(assertEast.equal(table.unwrap("Table").columns.size(), 2n));
    });

    test("creates table with column subset", $ => {
        // Only select some columns
        const table = $.let(Table.Root(
            [
                { name: "Alice", age: 30n, city: "NYC", other: true },
            ],
            {
                name: { header: "Name" },
                city: { header: "City" },
                // age and other are not included
            }
        ));

        $(assertEast.equal(table.unwrap("Table").columns.size(), 2n));
    });

    test("creates table with non-string fields (auto converts to string)", $ => {
        const table = $.let(Table.Root(
            [
                { name: "Alice", age: 30n, active: true },
            ],
            {
                name: { header: "Name" },
                age: { header: "Age" },
                active: { header: "Active" },
            }
        ));

        $(assertEast.equal(table.unwrap("Table").columns.size(), 3n));
    });

    // =========================================================================
    // Column Configuration
    // =========================================================================

    test("creates table with custom headers", $ => {
        const table = $.let(Table.Root(
            [
                { firstName: "Alice", lastName: "Smith" },
            ],
            {
                firstName: { header: "First Name" },
                lastName: { header: "Last Name" },
            }
        ));

        $(assertEast.equal(table.unwrap("Table").columns.get(0n).header.unwrap("some"), "First Name"));
    });

    test("creates table with custom render for text alignment", $ => {
        const table = $.let(Table.Root(
            [
                { item: "Widget", price: "$99.99" },
            ],
            {
                item: { header: "Item" },
                price: { header: "Price", render: value => Text.Root(value, { textAlign: "right" }) },
            }
        ));

        $(assertEast.equal(table.unwrap("Table").columns.size(), 2n));
    });

    // =========================================================================
    // Custom Rendering
    // =========================================================================

    test("creates table with custom render for Badge", $ => {
        const table = $.let(Table.Root(
            [
                { name: "Alice", status: "Active" },
                { name: "Bob", status: "Pending" },
            ],
            {
                name: { header: "Name" },
                status: { header: "Status", render: value => Badge.Root(value, { variant: "solid" }) },
            }
        ));

        $(assertEast.equal(table.unwrap("Table").rows.size(), 2n));
    });

    // =========================================================================
    // Styling
    // =========================================================================

    test("creates table with line variant", $ => {
        const table = $.let(Table.Root(
            [{ col: "value" }],
            { col: { header: "Column" } },
            { variant: "line" }
        ));

        $(assertEast.equal(table.unwrap("Table").style.unwrap("some").variant.unwrap("some").hasTag("line"), true));
    });

    test("creates striped table", $ => {
        const table = $.let(Table.Root(
            [{ col: "value" }],
            { col: { header: "Column" } },
            { striped: true }
        ));

        $(assertEast.equal(table.unwrap("Table").style.unwrap("some").striped.unwrap("some"), true));
    });

    test("creates table with size", $ => {
        const table = $.let(Table.Root(
            [{ col: "value" }],
            { col: { header: "Column" } },
            { size: "lg" }
        ));

        $(assertEast.equal(table.unwrap("Table").style.unwrap("some").size.unwrap("some").hasTag("lg"), true));
    });

    test("creates table with all style options", $ => {
        const table = $.let(Table.Root(
            [{ name: "Alice", email: "alice@example.com" }],
            {
                name: { header: "Name" },
                email: { header: "Email" },
            },
            {
                variant: "outline",
                size: "md",
                striped: true,
                interactive: true,
                stickyHeader: true,
                colorPalette: "blue",
            }
        ));

        $(assertEast.equal(table.unwrap("Table").style.unwrap("some").variant.unwrap("some").hasTag("outline"), true));
        $(assertEast.equal(table.unwrap("Table").style.unwrap("some").striped.unwrap("some"), true));
        $(assertEast.equal(table.unwrap("Table").style.unwrap("some").interactive.unwrap("some"), true));
    });

    // =========================================================================
    // Real-World Examples
    // =========================================================================

    test("creates user table with mixed components", $ => {
        const table = $.let(Table.Root(
            [
                { name: "Alice Smith", email: "alice@example.com", role: "Admin" },
                { name: "Bob Jones", email: "bob@example.com", role: "User" },
            ],
            {
                name: { header: "Name" },
                email: { header: "Email" },
                role: { header: "Role", render: value => Badge.Root(value, { colorPalette: "blue" }) },
            },
            { variant: "line", striped: true }
        ));

        $(assertEast.equal(table.unwrap("Table").rows.size(), 2n));
        $(assertEast.equal(table.unwrap("Table").columns.size(), 3n));
    });
});
