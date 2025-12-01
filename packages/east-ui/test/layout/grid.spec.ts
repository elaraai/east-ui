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

   
    // =========================================================================
    // Grid.Root - Basic Creation
    // =========================================================================

    test("creates grid with empty items", $ => {
        const grid = $.let(Grid.Root([]));

        $(assertEast.equal(grid.unwrap("Grid").items.size(), 0n));
        $(assertEast.equal(grid.unwrap("Grid").style.hasTag("none"), true));
    });

    test("creates grid with single item", $ => {
        const item = Grid.Item(Text.Root("Single"));
        const grid = $.let(Grid.Root([item]));

        $(assertEast.equal(grid.unwrap("Grid").items.size(), 1n));
    });

    test("creates grid with multiple items", $ => {
        const item1 = Grid.Item(Text.Root("One"));
        const item2 = Grid.Item(Text.Root("Two"));
        const item3 = Grid.Item(Text.Root("Three"));
        const grid = $.let(Grid.Root([item1, item2, item3]));

        $(assertEast.equal(grid.unwrap("Grid").items.size(), 3n));
    });

    // =========================================================================
    // Grid.Root - Template Properties
    // =========================================================================

    test("creates grid with templateColumns", $ => {
        const grid = $.let(Grid.Root([], { templateColumns: "repeat(3, 1fr)" }));

        $(assertEast.equal(grid.unwrap("Grid").style.hasTag("some"), true));
        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").templateColumns.unwrap("some"), "repeat(3, 1fr)"));
    });

    test("creates grid with templateRows", $ => {
        const grid = $.let(Grid.Root([], { templateRows: "100px auto 100px" }));

        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").templateRows.unwrap("some"), "100px auto 100px"));
    });

    test("creates grid with templateAreas", $ => {
        const grid = $.let(Grid.Root([], { templateAreas: "'header header' 'sidebar main' 'footer footer'" }));

        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").templateAreas.unwrap("some"), "'header header' 'sidebar main' 'footer footer'"));
    });

    // =========================================================================
    // Grid.Root - Gap Properties
    // =========================================================================

    test("creates grid with gap", $ => {
        const grid = $.let(Grid.Root([], { gap: "4" }));

        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").gap.unwrap("some"), "4"));
    });

    test("creates grid with columnGap", $ => {
        const grid = $.let(Grid.Root([], { columnGap: "2" }));

        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").columnGap.unwrap("some"), "2"));
    });

    test("creates grid with rowGap", $ => {
        const grid = $.let(Grid.Root([], { rowGap: "6" }));

        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").rowGap.unwrap("some"), "6"));
    });

    // =========================================================================
    // Grid.Root - Alignment Properties
    // =========================================================================

    test("creates grid with justifyItems", $ => {
        const grid = $.let(Grid.Root([], { justifyItems: Style.JustifyContent("center") }));

        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").justifyItems.hasTag("some"), true));
        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").justifyItems.unwrap("some").hasTag("center"), true));
    });

    test("creates grid with alignItems", $ => {
        const grid = $.let(Grid.Root([], { alignItems: Style.AlignItems("center") }));

        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").alignItems.hasTag("some"), true));
        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").alignItems.unwrap("some").hasTag("center"), true));
    });

    test("creates grid with justifyContent", $ => {
        const grid = $.let(Grid.Root([], { justifyContent: Style.JustifyContent("space-between") }));

        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").justifyContent.unwrap("some").hasTag("space-between"), true));
    });

    test("creates grid with alignContent", $ => {
        const grid = $.let(Grid.Root([], { alignContent: Style.AlignItems("stretch") }));

        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").alignContent.unwrap("some").hasTag("stretch"), true));
    });

    // =========================================================================
    // Grid.Root - Auto Properties
    // =========================================================================

    test("creates grid with autoColumns", $ => {
        const grid = $.let(Grid.Root([], { autoColumns: "minmax(100px, auto)" }));

        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").autoColumns.unwrap("some"), "minmax(100px, auto)"));
    });

    test("creates grid with autoRows", $ => {
        const grid = $.let(Grid.Root([], { autoRows: "min-content" }));

        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").autoRows.unwrap("some"), "min-content"));
    });

    test("creates grid with autoFlow row", $ => {
        const grid = $.let(Grid.Root([], { autoFlow: "row" }));

        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").autoFlow.unwrap("some").hasTag("row"), true));
    });

    test("creates grid with autoFlow column", $ => {
        const grid = $.let(Grid.Root([], { autoFlow: "column" }));

        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").autoFlow.unwrap("some").hasTag("column"), true));
    });

    test("creates grid with autoFlow dense", $ => {
        const grid = $.let(Grid.Root([], { autoFlow: "dense" }));

        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").autoFlow.unwrap("some").hasTag("dense"), true));
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

        $(assertEast.equal(grid.unwrap("Grid").items.size(), 3n));
        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").templateColumns.unwrap("some"), "repeat(3, 1fr)"));
        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").gap.unwrap("some"), "4"));
    });

    test("creates grid with spanning item", $ => {
        const mainContent = Grid.Item(Text.Root("Main"), { colSpan: "2" });
        const sidebar = Grid.Item(Text.Root("Sidebar"));

        const grid = $.let(Grid.Root([mainContent, sidebar], { templateColumns: "repeat(3, 1fr)" }));

        $(assertEast.equal(grid.unwrap("Grid").items.size(), 2n));
    });

    test("creates responsive grid with auto-fit", $ => {
        const grid = $.let(Grid.Root([], {
                templateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "6",
            }));

        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").templateColumns.unwrap("some"), "repeat(auto-fit, minmax(200px, 1fr))"));
    });

    test("creates grid with all style properties", $ => {
        const grid = $.let(Grid.Root([], {
                templateColumns: "1fr 2fr 1fr",
                templateRows: "auto 1fr auto",
                gap: "4",
                justifyItems: Style.JustifyContent("center"),
                alignItems: Style.AlignItems("stretch"),
                autoFlow: "row dense",
            }));

        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").templateColumns.unwrap("some"), "1fr 2fr 1fr"));
        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").templateRows.unwrap("some"), "auto 1fr auto"));
        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").gap.unwrap("some"), "4"));
        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").justifyItems.unwrap("some").hasTag("center"), true));
        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").alignItems.unwrap("some").hasTag("stretch"), true));
        $(assertEast.equal(grid.unwrap("Grid").style.unwrap("some").autoFlow.unwrap("some").hasTag("row dense"), true));
    });
});
