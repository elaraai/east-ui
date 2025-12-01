/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Switch, Style } from "../../src/index.js";

describeEast("Switch", (test) => {
    // =========================================================================
    // Basic Creation
    // =========================================================================

    test("creates switch with checked true", $ => {
        const sw = $.let(Switch.Root(true));

        $(assertEast.equal(sw.unwrap("Switch").checked, true));
        $(assertEast.equal(sw.unwrap("Switch").label.hasTag("none"), true));
        $(assertEast.equal(sw.unwrap("Switch").disabled.hasTag("none"), true));
    });

    test("creates switch with checked false", $ => {
        const sw = $.let(Switch.Root(false));

        $(assertEast.equal(sw.unwrap("Switch").checked, false));
    });

    // =========================================================================
    // Label
    // =========================================================================

    test("creates switch with label", $ => {
        const sw = $.let(Switch.Root(false, {
            label: "Enable notifications",
        }));

        $(assertEast.equal(sw.unwrap("Switch").label.hasTag("some"), true));
        $(assertEast.equal(sw.unwrap("Switch").label.unwrap("some"), "Enable notifications"));
    });

    test("creates switch with long label", $ => {
        const sw = $.let(Switch.Root(false, {
            label: "Enable all email notifications for this account",
        }));

        $(assertEast.equal(sw.unwrap("Switch").label.unwrap("some"), "Enable all email notifications for this account"));
    });

    // =========================================================================
    // Disabled State
    // =========================================================================

    test("creates disabled switch", $ => {
        const sw = $.let(Switch.Root(false, {
            disabled: true,
        }));

        $(assertEast.equal(sw.unwrap("Switch").disabled.hasTag("some"), true));
        $(assertEast.equal(sw.unwrap("Switch").disabled.unwrap("some"), true));
    });

    test("creates enabled switch explicitly", $ => {
        const sw = $.let(Switch.Root(true, {
            disabled: false,
        }));

        $(assertEast.equal(sw.unwrap("Switch").disabled.unwrap("some"), false));
    });

    // =========================================================================
    // Color Palettes
    // =========================================================================

    test("creates switch with blue color palette", $ => {
        const sw = $.let(Switch.Root(true, {
            colorPalette: "blue",
        }));

        $(assertEast.equal(sw.unwrap("Switch").colorPalette.hasTag("some"), true));
        $(assertEast.equal(sw.unwrap("Switch").colorPalette.unwrap("some").hasTag("blue"), true));
    });

    test("creates switch with green color palette", $ => {
        const sw = $.let(Switch.Root(true, {
            colorPalette: "green",
        }));

        $(assertEast.equal(sw.unwrap("Switch").colorPalette.unwrap("some").hasTag("green"), true));
    });

    test("creates switch with teal color palette", $ => {
        const sw = $.let(Switch.Root(true, {
            colorPalette: "teal",
        }));

        $(assertEast.equal(sw.unwrap("Switch").colorPalette.unwrap("some").hasTag("teal"), true));
    });

    test("creates switch with Style.ColorScheme helper", $ => {
        const sw = $.let(Switch.Root(true, {
            colorPalette: Style.ColorScheme("purple"),
        }));

        $(assertEast.equal(sw.unwrap("Switch").colorPalette.unwrap("some").hasTag("purple"), true));
    });

    // =========================================================================
    // Sizes
    // =========================================================================

    test("creates small switch", $ => {
        const sw = $.let(Switch.Root(true, {
            size: "sm",
        }));

        $(assertEast.equal(sw.unwrap("Switch").size.hasTag("some"), true));
        $(assertEast.equal(sw.unwrap("Switch").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates medium switch", $ => {
        const sw = $.let(Switch.Root(true, {
            size: "md",
        }));

        $(assertEast.equal(sw.unwrap("Switch").size.unwrap("some").hasTag("md"), true));
    });

    test("creates large switch", $ => {
        const sw = $.let(Switch.Root(true, {
            size: "lg",
        }));

        $(assertEast.equal(sw.unwrap("Switch").size.unwrap("some").hasTag("lg"), true));
    });

    test("creates switch with Style.Size helper", $ => {
        const sw = $.let(Switch.Root(true, {
            size: Style.Size("md"),
        }));

        $(assertEast.equal(sw.unwrap("Switch").size.unwrap("some").hasTag("md"), true));
    });

    // =========================================================================
    // Combined Options
    // =========================================================================

    test("creates switch with all options", $ => {
        const sw = $.let(Switch.Root(true, {
            label: "Dark mode",
            disabled: false,
            colorPalette: "blue",
            size: "md",
        }));

        $(assertEast.equal(sw.unwrap("Switch").checked, true));
        $(assertEast.equal(sw.unwrap("Switch").label.unwrap("some"), "Dark mode"));
        $(assertEast.equal(sw.unwrap("Switch").disabled.unwrap("some"), false));
        $(assertEast.equal(sw.unwrap("Switch").colorPalette.unwrap("some").hasTag("blue"), true));
        $(assertEast.equal(sw.unwrap("Switch").size.unwrap("some").hasTag("md"), true));
    });

    test("creates dark mode toggle switch", $ => {
        const sw = $.let(Switch.Root(false, {
            label: "Dark mode",
            colorPalette: "gray",
        }));

        $(assertEast.equal(sw.unwrap("Switch").checked, false));
        $(assertEast.equal(sw.unwrap("Switch").label.unwrap("some"), "Dark mode"));
        $(assertEast.equal(sw.unwrap("Switch").colorPalette.unwrap("some").hasTag("gray"), true));
    });

    test("creates notification settings switch", $ => {
        const sw = $.let(Switch.Root(true, {
            label: "Push notifications",
            colorPalette: "green",
            size: "sm",
        }));

        $(assertEast.equal(sw.unwrap("Switch").checked, true));
        $(assertEast.equal(sw.unwrap("Switch").label.unwrap("some"), "Push notifications"));
        $(assertEast.equal(sw.unwrap("Switch").colorPalette.unwrap("some").hasTag("green"), true));
        $(assertEast.equal(sw.unwrap("Switch").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates disabled premium feature switch", $ => {
        const sw = $.let(Switch.Root(false, {
            label: "Premium feature (upgrade required)",
            disabled: true,
            colorPalette: "gray",
        }));

        $(assertEast.equal(sw.unwrap("Switch").checked, false));
        $(assertEast.equal(sw.unwrap("Switch").disabled.unwrap("some"), true));
        $(assertEast.equal(sw.unwrap("Switch").colorPalette.unwrap("some").hasTag("gray"), true));
    });
});
