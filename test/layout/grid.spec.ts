/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Grid, Style, Text } from "../../src/index.js";

describeEast("Grid", (test) => {
    // Helper to create a simple text component (already returns UIComponentType)

    // =========================================================================
    // Grid.Item - Basic Creation
    // =========================================================================

    test("creates grid item with content only", $ => {
        const content = Text.Root("Hello");
        const item = $.let(Grid.Item(content));

        $(assertEast.equal(item.content.hasTag("Text"), true));
        $(assertEast.equal(item.colSpan.hasTag("none"), true));
        $(assertEast.equal(item.rowSpan.hasTag("none"), true));
    });

    test("creates grid item with colSpan", $ => {
        const content = Text.Root("Wide");
        const item = $.let(Grid.Item(content, { colSpan: 2 }));

        $(assertEast.equal(item.colSpan.hasTag("some"), true));
        $(assertEast.equal(item.colSpan.unwrap("some"), "2"));
    });

    test("creates grid item with rowSpan", $ => {
        const content = Text.Root("Tall");
        const item = $.let(Grid.Item(content, { rowSpan: 3 }));

        $(assertEast.equal(item.rowSpan.hasTag("some"), true));
        $(assertEast.equal(item.rowSpan.unwrap("some"), "3"));
    });

    test("creates grid item with colStart and colEnd", $ => {
        const content = Text.Root("Positioned");
        const item = $.let(Grid.Item(content, { colStart: 1, colEnd: 3 }));

        $(assertEast.equal(item.colStart.hasTag("some"), true));
        $(assertEast.equal(item.colStart.unwrap("some"), "1"));
        $(assertEast.equal(item.colEnd.hasTag("some"), true));
        $(assertEast.equal(item.colEnd.unwrap("some"), "3"));
    });

    test("creates grid item with rowStart and rowEnd", $ => {
        const content = Text.Root("Positioned");
        const item = $.let(Grid.Item(content, { rowStart: 2, rowEnd: 4 }));

        $(assertEast.equal(item.rowStart.hasTag("some"), true));
        $(assertEast.equal(item.rowStart.unwrap("some"), "2"));
        $(assertEast.equal(item.rowEnd.hasTag("some"), true));
        $(assertEast.equal(item.rowEnd.unwrap("some"), "4"));
    });

    test("creates grid item with string span values", $ => {
        const content = Text.Root("Span");
        const item = $.let(Grid.Item(content, { colSpan: "span 2", rowSpan: "span 3" }));

        $(assertEast.equal(item.colSpan.unwrap("some"), "span 2"));
        $(assertEast.equal(item.rowSpan.unwrap("some"), "span 3"));
    });

    // =========================================================================
    // Grid.Root - Basic Creation
    // =========================================================================

    test("creates grid with empty items", $ => {
        const grid = $.let(Grid.Root([]));

        $(assertEast.equal(grid.items.size(), 0n));
        $(assertEast.equal(grid.style.hasTag("none"), true));
    });

    test("creates grid with single item", $ => {
        const item = Grid.Item(Text.Root("Single"));
        const grid = $.let(Grid.Root([item]));

        $(assertEast.equal(grid.items.size(), 1n));
    });

    test("creates grid with multiple items", $ => {
        const item1 = Grid.Item(Text.Root("One"));
        const item2 = Grid.Item(Text.Root("Two"));
        const item3 = Grid.Item(Text.Root("Three"));
        const grid = $.let(Grid.Root([item1, item2, item3]));

        $(assertEast.equal(grid.items.size(), 3n));
    });

    // =========================================================================
    // Grid.Root - Template Properties
    // =========================================================================

    test("creates grid with templateColumns", $ => {
        const grid = $.let(Grid.Root([], { templateColumns: "repeat(3, 1fr)" }));

        $(assertEast.equal(grid.style.hasTag("some"), true));
        $(assertEast.equal(grid.style.unwrap("some").templateColumns.unwrap("some"), "repeat(3, 1fr)"));
    });

    test("creates grid with templateRows", $ => {
        const grid = $.let(Grid.Root([], { templateRows: "100px auto 100px" }));

        $(assertEast.equal(grid.style.unwrap("some").templateRows.unwrap("some"), "100px auto 100px"));
    });

    test("creates grid with templateAreas", $ => {
        const grid = $.let(Grid.Root([], { templateAreas: "'header header' 'sidebar main' 'footer footer'" }));

        $(assertEast.equal(grid.style.unwrap("some").templateAreas.unwrap("some"), "'header header' 'sidebar main' 'footer footer'"));
    });

    // =========================================================================
    // Grid.Root - Gap Properties
    // =========================================================================

    test("creates grid with gap", $ => {
        const grid = $.let(Grid.Root([], { gap: "4" }));

        $(assertEast.equal(grid.style.unwrap("some").gap.unwrap("some"), "4"));
    });

    test("creates grid with columnGap", $ => {
        const grid = $.let(Grid.Root([], { columnGap: "2" }));

        $(assertEast.equal(grid.style.unwrap("some").columnGap.unwrap("some"), "2"));
    });

    test("creates grid with rowGap", $ => {
        const grid = $.let(Grid.Root([], { rowGap: "6" }));

        $(assertEast.equal(grid.style.unwrap("some").rowGap.unwrap("some"), "6"));
    });

    // =========================================================================
    // Grid.Root - Alignment Properties
    // =========================================================================

    test("creates grid with justifyItems", $ => {
        const grid = $.let(Grid.Root([], { justifyItems: Style.JustifyContent("center") }));

        $(assertEast.equal(grid.style.unwrap("some").justifyItems.hasTag("some"), true));
        $(assertEast.equal(grid.style.unwrap("some").justifyItems.unwrap("some").hasTag("center"), true));
    });

    test("creates grid with alignItems", $ => {
        const grid = $.let(Grid.Root([], { alignItems: Style.AlignItems("center") }));

        $(assertEast.equal(grid.style.unwrap("some").alignItems.hasTag("some"), true));
        $(assertEast.equal(grid.style.unwrap("some").alignItems.unwrap("some").hasTag("center"), true));
    });

    test("creates grid with justifyContent", $ => {
        const grid = $.let(Grid.Root([], { justifyContent: Style.JustifyContent("space_between") }));

        $(assertEast.equal(grid.style.unwrap("some").justifyContent.unwrap("some").hasTag("space_between"), true));
    });

    test("creates grid with alignContent", $ => {
        const grid = $.let(Grid.Root([], { alignContent: Style.AlignItems("stretch") }));

        $(assertEast.equal(grid.style.unwrap("some").alignContent.unwrap("some").hasTag("stretch"), true));
    });

    // =========================================================================
    // Grid.Root - Auto Properties
    // =========================================================================

    test("creates grid with autoColumns", $ => {
        const grid = $.let(Grid.Root([], { autoColumns: "minmax(100px, auto)" }));

        $(assertEast.equal(grid.style.unwrap("some").autoColumns.unwrap("some"), "minmax(100px, auto)"));
    });

    test("creates grid with autoRows", $ => {
        const grid = $.let(Grid.Root([], { autoRows: "min-content" }));

        $(assertEast.equal(grid.style.unwrap("some").autoRows.unwrap("some"), "min-content"));
    });

    test("creates grid with autoFlow row", $ => {
        const grid = $.let(Grid.Root([], { autoFlow: "row" }));

        $(assertEast.equal(grid.style.unwrap("some").autoFlow.unwrap("some").hasTag("row"), true));
    });

    test("creates grid with autoFlow column", $ => {
        const grid = $.let(Grid.Root([], { autoFlow: "column" }));

        $(assertEast.equal(grid.style.unwrap("some").autoFlow.unwrap("some").hasTag("column"), true));
    });

    test("creates grid with autoFlow dense", $ => {
        const grid = $.let(Grid.Root([], { autoFlow: "dense" }));

        $(assertEast.equal(grid.style.unwrap("some").autoFlow.unwrap("some").hasTag("dense"), true));
    });

    // =========================================================================
    // Typical Use Cases
    // =========================================================================

    test("creates 3-column grid layout", $ => {
        const item1 = Grid.Item(Text.Root("1"));
        const item2 = Grid.Item(Text.Root("2"));
        const item3 = Grid.Item(Text.Root("3"));

        const grid = $.let(Grid.Root([item1, item2, item3], {
            templateColumns: "repeat(3, 1fr)",
            gap: "4",
        }));

        $(assertEast.equal(grid.items.size(), 3n));
        $(assertEast.equal(grid.style.unwrap("some").templateColumns.unwrap("some"), "repeat(3, 1fr)"));
        $(assertEast.equal(grid.style.unwrap("some").gap.unwrap("some"), "4"));
    });

    test("creates grid with spanning item", $ => {
        const mainContent = Grid.Item(Text.Root("Main"), { colSpan: 2 });
        const sidebar = Grid.Item(Text.Root("Sidebar"));

        const grid = $.let(Grid.Root([mainContent, sidebar], { templateColumns: "repeat(3, 1fr)" }));

        $(assertEast.equal(grid.items.size(), 2n));
    });

    test("creates responsive grid with auto-fit", $ => {
        const grid = $.let(Grid.Root([], {
                templateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "6",
            }));

        $(assertEast.equal(grid.style.unwrap("some").templateColumns.unwrap("some"), "repeat(auto-fit, minmax(200px, 1fr))"));
    });

    test("creates grid with all style properties", $ => {
        const grid = $.let(Grid.Root([], {
                templateColumns: "1fr 2fr 1fr",
                templateRows: "auto 1fr auto",
                gap: "4",
                justifyItems: Style.JustifyContent("center"),
                alignItems: Style.AlignItems("stretch"),
                autoFlow: "row_dense",
            }));

        $(assertEast.equal(grid.style.unwrap("some").templateColumns.unwrap("some"), "1fr 2fr 1fr"));
        $(assertEast.equal(grid.style.unwrap("some").templateRows.unwrap("some"), "auto 1fr auto"));
        $(assertEast.equal(grid.style.unwrap("some").gap.unwrap("some"), "4"));
        $(assertEast.equal(grid.style.unwrap("some").justifyItems.unwrap("some").hasTag("center"), true));
        $(assertEast.equal(grid.style.unwrap("some").alignItems.unwrap("some").hasTag("stretch"), true));
        $(assertEast.equal(grid.style.unwrap("some").autoFlow.unwrap("some").hasTag("row_dense"), true));
    });
});
