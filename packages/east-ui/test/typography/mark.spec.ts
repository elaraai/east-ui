/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Mark } from "../../src/index.js";

describeEast("Mark", (test) => {
    // =========================================================================
    // Basic Creation
    // =========================================================================

    test("creates mark with string value", $ => {
        const mark = $.let(Mark.Root("Important"));

        $(assertEast.equal(mark.unwrap("Mark").value, "Important"));
    });

    test("creates mark with no style - all options are none", $ => {
        const mark = $.let(Mark.Root("Text"));

        $(assertEast.equal(mark.unwrap("Mark").value, "Text"));
        $(assertEast.equal(mark.unwrap("Mark").variant.hasTag("none"), true));
        $(assertEast.equal(mark.unwrap("Mark").colorPalette.hasTag("none"), true));
    });

    // =========================================================================
    // Variants
    // =========================================================================

    test("creates subtle variant mark", $ => {
        const mark = $.let(Mark.Root("Subtle", {
            variant: "subtle",
        }));

        $(assertEast.equal(mark.unwrap("Mark").variant.hasTag("some"), true));
        $(assertEast.equal(mark.unwrap("Mark").variant.unwrap("some").hasTag("subtle"), true));
    });

    test("creates solid variant mark", $ => {
        const mark = $.let(Mark.Root("Solid", {
            variant: "solid",
        }));

        $(assertEast.equal(mark.unwrap("Mark").variant.unwrap("some").hasTag("solid"), true));
    });

    test("creates text variant mark", $ => {
        const mark = $.let(Mark.Root("Text", {
            variant: "text",
        }));

        $(assertEast.equal(mark.unwrap("Mark").variant.unwrap("some").hasTag("text"), true));
    });

    test("creates plain variant mark", $ => {
        const mark = $.let(Mark.Root("Plain", {
            variant: "plain",
        }));

        $(assertEast.equal(mark.unwrap("Mark").variant.unwrap("some").hasTag("plain"), true));
    });

    // =========================================================================
    // Color Palette
    // =========================================================================

    test("creates mark with yellow colorPalette", $ => {
        const mark = $.let(Mark.Root("Highlighted", {
            colorPalette: "yellow",
        }));

        $(assertEast.equal(mark.unwrap("Mark").colorPalette.hasTag("some"), true));
        $(assertEast.equal(mark.unwrap("Mark").colorPalette.unwrap("some"), "yellow"));
    });

    test("creates mark with green colorPalette", $ => {
        const mark = $.let(Mark.Root("Success", {
            colorPalette: "green",
        }));

        $(assertEast.equal(mark.unwrap("Mark").colorPalette.unwrap("some"), "green"));
    });

    test("creates mark with red colorPalette", $ => {
        const mark = $.let(Mark.Root("Error", {
            colorPalette: "red",
        }));

        $(assertEast.equal(mark.unwrap("Mark").colorPalette.unwrap("some"), "red"));
    });

    // =========================================================================
    // Combined Options
    // =========================================================================

    test("creates mark with all options", $ => {
        const mark = $.let(Mark.Root("Featured", {
            variant: "solid",
            colorPalette: "blue",
        }));

        $(assertEast.equal(mark.unwrap("Mark").value, "Featured"));
        $(assertEast.equal(mark.unwrap("Mark").variant.unwrap("some").hasTag("solid"), true));
        $(assertEast.equal(mark.unwrap("Mark").colorPalette.unwrap("some"), "blue"));
    });

    test("creates warning mark", $ => {
        const mark = $.let(Mark.Root("Warning", {
            variant: "subtle",
            colorPalette: "orange",
        }));

        $(assertEast.equal(mark.unwrap("Mark").value, "Warning"));
        $(assertEast.equal(mark.unwrap("Mark").variant.unwrap("some").hasTag("subtle"), true));
        $(assertEast.equal(mark.unwrap("Mark").colorPalette.unwrap("some"), "orange"));
    });

    test("creates info mark", $ => {
        const mark = $.let(Mark.Root("Note", {
            variant: "text",
            colorPalette: "cyan",
        }));

        $(assertEast.equal(mark.unwrap("Mark").value, "Note"));
        $(assertEast.equal(mark.unwrap("Mark").variant.unwrap("some").hasTag("text"), true));
    });
});
