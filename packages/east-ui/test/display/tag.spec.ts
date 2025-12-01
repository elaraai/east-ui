/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Tag, Style } from "../../src/index.js";

describeEast("Tag", (test) => {
    // =========================================================================
    // Basic Creation
    // =========================================================================

    test("creates tag with string label", $ => {
        const tag = $.let(Tag.Root("JavaScript"));

        $(assertEast.equal(tag.unwrap("Tag").label, "JavaScript"));
        $(assertEast.equal(tag.unwrap("Tag").variant.hasTag("none"), true));
        $(assertEast.equal(tag.unwrap("Tag").colorPalette.hasTag("none"), true));
        $(assertEast.equal(tag.unwrap("Tag").size.hasTag("none"), true));
        $(assertEast.equal(tag.unwrap("Tag").closable.hasTag("none"), true));
    });

    test("creates tag with expression label", $ => {
        const tag = $.let(Tag.Root("TypeScript"));

        $(assertEast.equal(tag.unwrap("Tag").label, "TypeScript"));
    });

    // =========================================================================
    // Variants
    // =========================================================================

    test("creates solid variant tag", $ => {
        const tag = $.let(Tag.Root("Featured", {
            variant: "solid",
        }));

        $(assertEast.equal(tag.unwrap("Tag").variant.hasTag("some"), true));
        $(assertEast.equal(tag.unwrap("Tag").variant.unwrap("some").hasTag("solid"), true));
    });

    test("creates subtle variant tag", $ => {
        const tag = $.let(Tag.Root("Category", {
            variant: "subtle",
        }));

        $(assertEast.equal(tag.unwrap("Tag").variant.unwrap("some").hasTag("subtle"), true));
    });

    test("creates outline variant tag", $ => {
        const tag = $.let(Tag.Root("Label", {
            variant: "outline",
        }));

        $(assertEast.equal(tag.unwrap("Tag").variant.unwrap("some").hasTag("outline"), true));
    });

    test("creates tag with Style.StyleVariant helper", $ => {
        const tag = $.let(Tag.Root("Styled", {
            variant: Style.StyleVariant("solid"),
        }));

        $(assertEast.equal(tag.unwrap("Tag").variant.unwrap("some").hasTag("solid"), true));
    });

    // =========================================================================
    // Color Palettes
    // =========================================================================

    test("creates tag with blue color palette", $ => {
        const tag = $.let(Tag.Root("React", {
            colorPalette: "blue",
        }));

        $(assertEast.equal(tag.unwrap("Tag").colorPalette.hasTag("some"), true));
        $(assertEast.equal(tag.unwrap("Tag").colorPalette.unwrap("some").hasTag("blue"), true));
    });

    test("creates tag with green color palette", $ => {
        const tag = $.let(Tag.Root("Active", {
            colorPalette: "green",
        }));

        $(assertEast.equal(tag.unwrap("Tag").colorPalette.unwrap("some").hasTag("green"), true));
    });

    test("creates tag with cyan color palette", $ => {
        const tag = $.let(Tag.Root("Node.js", {
            colorPalette: "cyan",
        }));

        $(assertEast.equal(tag.unwrap("Tag").colorPalette.unwrap("some").hasTag("cyan"), true));
    });

    test("creates tag with Style.ColorScheme helper", $ => {
        const tag = $.let(Tag.Root("Premium", {
            colorPalette: Style.ColorScheme("purple"),
        }));

        $(assertEast.equal(tag.unwrap("Tag").colorPalette.unwrap("some").hasTag("purple"), true));
    });

    // =========================================================================
    // Size
    // =========================================================================

    test("creates small tag", $ => {
        const tag = $.let(Tag.Root("SM", {
            size: "sm",
        }));

        $(assertEast.equal(tag.unwrap("Tag").size.hasTag("some"), true));
        $(assertEast.equal(tag.unwrap("Tag").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates medium tag", $ => {
        const tag = $.let(Tag.Root("MD", {
            size: "md",
        }));

        $(assertEast.equal(tag.unwrap("Tag").size.unwrap("some").hasTag("md"), true));
    });

    test("creates large tag", $ => {
        const tag = $.let(Tag.Root("LG", {
            size: "lg",
        }));

        $(assertEast.equal(tag.unwrap("Tag").size.unwrap("some").hasTag("lg"), true));
    });

    test("creates extra large tag", $ => {
        const tag = $.let(Tag.Root("XL", {
            size: "xl",
        }));

        $(assertEast.equal(tag.unwrap("Tag").size.unwrap("some").hasTag("xl"), true));
    });

    test("creates tag with string literal size", $ => {
        const tag = $.let(Tag.Root("Sized", {
            size: "md",
        }));

        $(assertEast.equal(tag.unwrap("Tag").size.unwrap("some").hasTag("md"), true));
    });

    // =========================================================================
    // Closable
    // =========================================================================

    test("creates closable tag", $ => {
        const tag = $.let(Tag.Root("Removable", {
            closable: true,
        }));

        $(assertEast.equal(tag.unwrap("Tag").closable.hasTag("some"), true));
        $(assertEast.equal(tag.unwrap("Tag").closable.unwrap("some"), true));
    });

    test("creates non-closable tag explicitly", $ => {
        const tag = $.let(Tag.Root("Fixed", {
            closable: false,
        }));

        $(assertEast.equal(tag.unwrap("Tag").closable.unwrap("some"), false));
    });

    // =========================================================================
    // Combined Options
    // =========================================================================

    test("creates tag with all options", $ => {
        const tag = $.let(Tag.Root("Complete", {
            variant: "solid",
            colorPalette: "blue",
            size: "md",
            closable: true,
        }));

        $(assertEast.equal(tag.unwrap("Tag").label, "Complete"));
        $(assertEast.equal(tag.unwrap("Tag").variant.unwrap("some").hasTag("solid"), true));
        $(assertEast.equal(tag.unwrap("Tag").colorPalette.unwrap("some").hasTag("blue"), true));
        $(assertEast.equal(tag.unwrap("Tag").size.unwrap("some").hasTag("md"), true));
        $(assertEast.equal(tag.unwrap("Tag").closable.unwrap("some"), true));
    });

    test("creates programming language tag", $ => {
        const tag = $.let(Tag.Root("Python", {
            colorPalette: "yellow",
            variant: "subtle",
        }));

        $(assertEast.equal(tag.unwrap("Tag").label, "Python"));
        $(assertEast.equal(tag.unwrap("Tag").colorPalette.unwrap("some").hasTag("yellow"), true));
    });

    test("creates filter chip tag", $ => {
        const tag = $.let(Tag.Root("Technology", {
            colorPalette: "blue",
            closable: true,
            size: "sm",
        }));

        $(assertEast.equal(tag.unwrap("Tag").closable.unwrap("some"), true));
        $(assertEast.equal(tag.unwrap("Tag").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates status tag", $ => {
        const tag = $.let(Tag.Root("In Progress", {
            colorPalette: "orange",
            variant: "solid",
            size: "sm",
        }));

        $(assertEast.equal(tag.unwrap("Tag").label, "In Progress"));
        $(assertEast.equal(tag.unwrap("Tag").variant.unwrap("some").hasTag("solid"), true));
    });

    test("creates removable skill tag", $ => {
        const tag = $.let(Tag.Root("React", {
            colorPalette: "cyan",
            variant: "outline",
            closable: true,
        }));

        $(assertEast.equal(tag.unwrap("Tag").variant.unwrap("some").hasTag("outline"), true));
        $(assertEast.equal(tag.unwrap("Tag").closable.unwrap("some"), true));
    });
});
