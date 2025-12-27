/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { List } from "../../src/index.js";

describeEast("List", (test) => {
    // =========================================================================
    // Basic Creation
    // =========================================================================

    test("creates list with string items", $ => {
        const list = $.let(List.Root(["Item 1", "Item 2", "Item 3"]));

        $(assertEast.equal(list.unwrap().unwrap("List").variant.hasTag("none"), true));
    });

    test("creates list with no style - all options are none", $ => {
        const list = $.let(List.Root(["Item"]));

        $(assertEast.equal(list.unwrap().unwrap("List").variant.hasTag("none"), true));
        $(assertEast.equal(list.unwrap().unwrap("List").gap.hasTag("none"), true));
        $(assertEast.equal(list.unwrap().unwrap("List").colorPalette.hasTag("none"), true));
    });

    test("creates list with single item", $ => {
        const list = $.let(List.Root(["Single"]));

        $(assertEast.equal(list.unwrap().unwrap("List").variant.hasTag("none"), true));
    });

    // =========================================================================
    // Variants
    // =========================================================================

    test("creates unordered list", $ => {
        const list = $.let(List.Root(["A", "B"], {
            variant: "unordered",
        }));

        $(assertEast.equal(list.unwrap().unwrap("List").variant.hasTag("some"), true));
        $(assertEast.equal(list.unwrap().unwrap("List").variant.unwrap("some").hasTag("unordered"), true));
    });

    test("creates ordered list", $ => {
        const list = $.let(List.Root(["First", "Second"], {
            variant: "ordered",
        }));

        $(assertEast.equal(list.unwrap().unwrap("List").variant.unwrap("some").hasTag("ordered"), true));
    });

    // =========================================================================
    // Gap
    // =========================================================================

    test("creates list with gap", $ => {
        const list = $.let(List.Root(["A", "B"], {
            gap: "4",
        }));

        $(assertEast.equal(list.unwrap().unwrap("List").gap.hasTag("some"), true));
        $(assertEast.equal(list.unwrap().unwrap("List").gap.unwrap("some"), "4"));
    });

    test("creates list with large gap", $ => {
        const list = $.let(List.Root(["A", "B"], {
            gap: "8",
        }));

        $(assertEast.equal(list.unwrap().unwrap("List").gap.unwrap("some"), "8"));
    });

    // =========================================================================
    // Color Palette
    // =========================================================================

    test("creates list with colorPalette", $ => {
        const list = $.let(List.Root(["A", "B"], {
            colorPalette: "blue",
        }));

        $(assertEast.equal(list.unwrap().unwrap("List").colorPalette.hasTag("some"), true));
        $(assertEast.equal(list.unwrap().unwrap("List").colorPalette.unwrap("some"), "blue"));
    });

    test("creates list with green colorPalette", $ => {
        const list = $.let(List.Root(["A", "B"], {
            colorPalette: "green",
        }));

        $(assertEast.equal(list.unwrap().unwrap("List").colorPalette.unwrap("some"), "green"));
    });

    // =========================================================================
    // Combined Options
    // =========================================================================

    test("creates list with all options", $ => {
        const list = $.let(List.Root(
            ["Step 1", "Step 2", "Step 3"],
            {
                variant: "ordered",
                gap: "2",
                colorPalette: "gray",
            }
        ));

        $(assertEast.equal(list.unwrap().unwrap("List").variant.unwrap("some").hasTag("ordered"), true));
        $(assertEast.equal(list.unwrap().unwrap("List").gap.unwrap("some"), "2"));
        $(assertEast.equal(list.unwrap().unwrap("List").colorPalette.unwrap("some"), "gray"));
    });

    test("creates feature list", $ => {
        const list = $.let(List.Root([
            "Fast performance",
            "Type safe",
            "Easy to use",
        ], {
            variant: "unordered",
            gap: "3",
            colorPalette: "green",
        }));

        $(assertEast.equal(list.unwrap().unwrap("List").variant.unwrap("some").hasTag("unordered"), true));
        $(assertEast.equal(list.unwrap().unwrap("List").gap.unwrap("some"), "3"));
        $(assertEast.equal(list.unwrap().unwrap("List").colorPalette.unwrap("some"), "green"));
    });

    test("creates empty list", $ => {
        const list = $.let(List.Root([]));

        $(assertEast.equal(list.unwrap().unwrap("List").variant.hasTag("none"), true));
    });

    test("creates numbered steps list", $ => {
        const list = $.let(List.Root([
            "Install dependencies",
            "Configure settings",
            "Run the application",
        ], {
            variant: "ordered",
        }));

        $(assertEast.equal(list.unwrap().unwrap("List").variant.unwrap("some").hasTag("ordered"), true));
    });

    test("creates bullet point list", $ => {
        const list = $.let(List.Root([
            "Point one",
            "Point two",
            "Point three",
        ], {
            variant: "unordered",
            colorPalette: "gray",
        }));

        $(assertEast.equal(list.unwrap().unwrap("List").variant.unwrap("some").hasTag("unordered"), true));
        $(assertEast.equal(list.unwrap().unwrap("List").colorPalette.unwrap("some"), "gray"));
    });
});
