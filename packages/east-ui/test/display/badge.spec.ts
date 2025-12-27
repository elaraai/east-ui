/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Badge, Style } from "../../src/index.js";

describeEast("Badge", (test) => {
    // =========================================================================
    // Basic Creation
    // =========================================================================

    test("creates badge with string value", $ => {
        const badge = $.let(Badge.Root("New"));

        $(assertEast.equal(badge.unwrap().unwrap("Badge").value, "New"));
        $(assertEast.equal(badge.unwrap().unwrap("Badge").variant.hasTag("none"), true));
        $(assertEast.equal(badge.unwrap().unwrap("Badge").colorPalette.hasTag("none"), true));
        $(assertEast.equal(badge.unwrap().unwrap("Badge").size.hasTag("none"), true));
    });

    test("creates badge with expression value", $ => {
        const badge = $.let(Badge.Root("Active"));

        $(assertEast.equal(badge.unwrap().unwrap("Badge").value, "Active"));
    });

    test("creates badge with number text", $ => {
        const badge = $.let(Badge.Root("42"));

        $(assertEast.equal(badge.unwrap().unwrap("Badge").value, "42"));
    });

    // =========================================================================
    // Variants
    // =========================================================================

    test("creates solid variant badge", $ => {
        const badge = $.let(Badge.Root("Sold", {
            variant: "solid",
        }));

        $(assertEast.equal(badge.unwrap().unwrap("Badge").variant.hasTag("some"), true));
        $(assertEast.equal(badge.unwrap().unwrap("Badge").variant.unwrap("some").hasTag("solid"), true));
    });

    test("creates subtle variant badge", $ => {
        const badge = $.let(Badge.Root("Pending", {
            variant: "subtle",
        }));

        $(assertEast.equal(badge.unwrap().unwrap("Badge").variant.unwrap("some").hasTag("subtle"), true));
    });

    test("creates outline variant badge", $ => {
        const badge = $.let(Badge.Root("Draft", {
            variant: "outline",
        }));

        $(assertEast.equal(badge.unwrap().unwrap("Badge").variant.unwrap("some").hasTag("outline"), true));
    });

    test("creates badge with Style.StyleVariant helper", $ => {
        const badge = $.let(Badge.Root("Featured", {
            variant: Style.StyleVariant("solid"),
        }));

        $(assertEast.equal(badge.unwrap().unwrap("Badge").variant.unwrap("some").hasTag("solid"), true));
    });

    // =========================================================================
    // Color Palettes
    // =========================================================================

    test("creates badge with green color palette", $ => {
        const badge = $.let(Badge.Root("Active", {
            colorPalette: "green",
        }));

        $(assertEast.equal(badge.unwrap().unwrap("Badge").colorPalette.hasTag("some"), true));
        $(assertEast.equal(badge.unwrap().unwrap("Badge").colorPalette.unwrap("some").hasTag("green"), true));
    });

    test("creates badge with red color palette", $ => {
        const badge = $.let(Badge.Root("Sold", {
            colorPalette: "red",
        }));

        $(assertEast.equal(badge.unwrap().unwrap("Badge").colorPalette.unwrap("some").hasTag("red"), true));
    });

    test("creates badge with blue color palette", $ => {
        const badge = $.let(Badge.Root("Featured", {
            colorPalette: "blue",
        }));

        $(assertEast.equal(badge.unwrap().unwrap("Badge").colorPalette.unwrap("some").hasTag("blue"), true));
    });

    test("creates badge with Style.ColorScheme helper", $ => {
        const badge = $.let(Badge.Root("Premium", {
            colorPalette: Style.ColorScheme("purple"),
        }));

        $(assertEast.equal(badge.unwrap().unwrap("Badge").colorPalette.unwrap("some").hasTag("purple"), true));
    });

    // =========================================================================
    // Size
    // =========================================================================

    test("creates extra small badge", $ => {
        const badge = $.let(Badge.Root("XS", {
            size: "xs",
        }));

        $(assertEast.equal(badge.unwrap().unwrap("Badge").size.hasTag("some"), true));
        $(assertEast.equal(badge.unwrap().unwrap("Badge").size.unwrap("some").hasTag("xs"), true));
    });

    test("creates small badge", $ => {
        const badge = $.let(Badge.Root("SM", {
            size: "sm",
        }));

        $(assertEast.equal(badge.unwrap().unwrap("Badge").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates medium badge", $ => {
        const badge = $.let(Badge.Root("MD", {
            size: "md",
        }));

        $(assertEast.equal(badge.unwrap().unwrap("Badge").size.unwrap("some").hasTag("md"), true));
    });

    test("creates large badge", $ => {
        const badge = $.let(Badge.Root("LG", {
            size: "lg",
        }));

        $(assertEast.equal(badge.unwrap().unwrap("Badge").size.unwrap("some").hasTag("lg"), true));
    });

    test("creates badge with Style.Size helper", $ => {
        const badge = $.let(Badge.Root("Size", {
            size: Style.Size("md"),
        }));

        $(assertEast.equal(badge.unwrap().unwrap("Badge").size.unwrap("some").hasTag("md"), true));
    });

    // =========================================================================
    // Combined Options
    // =========================================================================

    test("creates badge with all options", $ => {
        const badge = $.let(Badge.Root("Active", {
            variant: "solid",
            colorPalette: "green",
            size: "sm",
        }));

        $(assertEast.equal(badge.unwrap().unwrap("Badge").value, "Active"));
        $(assertEast.equal(badge.unwrap().unwrap("Badge").variant.unwrap("some").hasTag("solid"), true));
        $(assertEast.equal(badge.unwrap().unwrap("Badge").colorPalette.unwrap("some").hasTag("green"), true));
        $(assertEast.equal(badge.unwrap().unwrap("Badge").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates status badge", $ => {
        const badge = $.let(Badge.Root("Online", {
            colorPalette: "green",
            variant: "solid",
        }));

        $(assertEast.equal(badge.unwrap().unwrap("Badge").value, "Online"));
        $(assertEast.equal(badge.unwrap().unwrap("Badge").colorPalette.unwrap("some").hasTag("green"), true));
    });

    test("creates notification count badge", $ => {
        const badge = $.let(Badge.Root("99+", {
            colorPalette: "red",
            variant: "solid",
            size: "xs",
        }));

        $(assertEast.equal(badge.unwrap().unwrap("Badge").value, "99+"));
        $(assertEast.equal(badge.unwrap().unwrap("Badge").colorPalette.unwrap("some").hasTag("red"), true));
    });

    test("creates category tag badge", $ => {
        const badge = $.let(Badge.Root("Technology", {
            colorPalette: "blue",
            variant: "subtle",
            size: "sm",
        }));

        $(assertEast.equal(badge.unwrap().unwrap("Badge").value, "Technology"));
        $(assertEast.equal(badge.unwrap().unwrap("Badge").variant.unwrap("some").hasTag("subtle"), true));
    });

    test("creates premium label badge", $ => {
        const badge = $.let(Badge.Root("PRO", {
            colorPalette: "purple",
            variant: "outline",
        }));

        $(assertEast.equal(badge.unwrap().unwrap("Badge").value, "PRO"));
        $(assertEast.equal(badge.unwrap().unwrap("Badge").variant.unwrap("some").hasTag("outline"), true));
    });
});
