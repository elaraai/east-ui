/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Checkbox, Style } from "../../src/index.js";

describeEast("Checkbox", (test) => {
    // =========================================================================
    // Basic Creation
    // =========================================================================

    test("creates checkbox with checked true", $ => {
        const checkbox = $.let(Checkbox.Root(true));

        $(assertEast.equal(checkbox.unwrap("Checkbox").checked, true));
        $(assertEast.equal(checkbox.unwrap("Checkbox").label.hasTag("none"), true));
        $(assertEast.equal(checkbox.unwrap("Checkbox").indeterminate.hasTag("none"), true));
        $(assertEast.equal(checkbox.unwrap("Checkbox").disabled.hasTag("none"), true));
    });

    test("creates checkbox with checked false", $ => {
        const checkbox = $.let(Checkbox.Root(false));

        $(assertEast.equal(checkbox.unwrap("Checkbox").checked, false));
    });

    // =========================================================================
    // Label
    // =========================================================================

    test("creates checkbox with label", $ => {
        const checkbox = $.let(Checkbox.Root(false, {
            label: "Accept terms",
        }));

        $(assertEast.equal(checkbox.unwrap("Checkbox").label.hasTag("some"), true));
        $(assertEast.equal(checkbox.unwrap("Checkbox").label.unwrap("some"), "Accept terms"));
    });

    test("creates checkbox with long label", $ => {
        const checkbox = $.let(Checkbox.Root(false, {
            label: "I agree to the terms and conditions and privacy policy",
        }));

        $(assertEast.equal(checkbox.unwrap("Checkbox").label.unwrap("some"), "I agree to the terms and conditions and privacy policy"));
    });

    // =========================================================================
    // Indeterminate State
    // =========================================================================

    test("creates indeterminate checkbox", $ => {
        const checkbox = $.let(Checkbox.Root(false, {
            indeterminate: true,
        }));

        $(assertEast.equal(checkbox.unwrap("Checkbox").indeterminate.hasTag("some"), true));
        $(assertEast.equal(checkbox.unwrap("Checkbox").indeterminate.unwrap("some"), true));
    });

    test("creates non-indeterminate checkbox explicitly", $ => {
        const checkbox = $.let(Checkbox.Root(true, {
            indeterminate: false,
        }));

        $(assertEast.equal(checkbox.unwrap("Checkbox").indeterminate.unwrap("some"), false));
    });

    // =========================================================================
    // Disabled State
    // =========================================================================

    test("creates disabled checkbox", $ => {
        const checkbox = $.let(Checkbox.Root(false, {
            disabled: true,
        }));

        $(assertEast.equal(checkbox.unwrap("Checkbox").disabled.hasTag("some"), true));
        $(assertEast.equal(checkbox.unwrap("Checkbox").disabled.unwrap("some"), true));
    });

    test("creates enabled checkbox explicitly", $ => {
        const checkbox = $.let(Checkbox.Root(true, {
            disabled: false,
        }));

        $(assertEast.equal(checkbox.unwrap("Checkbox").disabled.unwrap("some"), false));
    });

    // =========================================================================
    // Color Palettes
    // =========================================================================

    test("creates checkbox with blue color palette", $ => {
        const checkbox = $.let(Checkbox.Root(true, {
            colorPalette: "blue",
        }));

        $(assertEast.equal(checkbox.unwrap("Checkbox").colorPalette.hasTag("some"), true));
        $(assertEast.equal(checkbox.unwrap("Checkbox").colorPalette.unwrap("some").hasTag("blue"), true));
    });

    test("creates checkbox with green color palette", $ => {
        const checkbox = $.let(Checkbox.Root(true, {
            colorPalette: "green",
        }));

        $(assertEast.equal(checkbox.unwrap("Checkbox").colorPalette.unwrap("some").hasTag("green"), true));
    });

    test("creates checkbox with Style.ColorScheme helper", $ => {
        const checkbox = $.let(Checkbox.Root(true, {
            colorPalette: Style.ColorScheme("purple"),
        }));

        $(assertEast.equal(checkbox.unwrap("Checkbox").colorPalette.unwrap("some").hasTag("purple"), true));
    });

    // =========================================================================
    // Sizes
    // =========================================================================

    test("creates small checkbox", $ => {
        const checkbox = $.let(Checkbox.Root(true, {
            size: "sm",
        }));

        $(assertEast.equal(checkbox.unwrap("Checkbox").size.hasTag("some"), true));
        $(assertEast.equal(checkbox.unwrap("Checkbox").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates medium checkbox", $ => {
        const checkbox = $.let(Checkbox.Root(true, {
            size: "md",
        }));

        $(assertEast.equal(checkbox.unwrap("Checkbox").size.unwrap("some").hasTag("md"), true));
    });

    test("creates large checkbox", $ => {
        const checkbox = $.let(Checkbox.Root(true, {
            size: "lg",
        }));

        $(assertEast.equal(checkbox.unwrap("Checkbox").size.unwrap("some").hasTag("lg"), true));
    });

    test("creates checkbox with Style.Size helper", $ => {
        const checkbox = $.let(Checkbox.Root(true, {
            size: Style.Size("md"),
        }));

        $(assertEast.equal(checkbox.unwrap("Checkbox").size.unwrap("some").hasTag("md"), true));
    });

    // =========================================================================
    // Combined Options
    // =========================================================================

    test("creates checkbox with all options", $ => {
        const checkbox = $.let(Checkbox.Root(true, {
            label: "Enable feature",
            indeterminate: false,
            disabled: false,
            colorPalette: "blue",
            size: "md",
        }));

        $(assertEast.equal(checkbox.unwrap("Checkbox").checked, true));
        $(assertEast.equal(checkbox.unwrap("Checkbox").label.unwrap("some"), "Enable feature"));
        $(assertEast.equal(checkbox.unwrap("Checkbox").indeterminate.unwrap("some"), false));
        $(assertEast.equal(checkbox.unwrap("Checkbox").disabled.unwrap("some"), false));
        $(assertEast.equal(checkbox.unwrap("Checkbox").colorPalette.unwrap("some").hasTag("blue"), true));
        $(assertEast.equal(checkbox.unwrap("Checkbox").size.unwrap("some").hasTag("md"), true));
    });

    test("creates terms acceptance checkbox", $ => {
        const checkbox = $.let(Checkbox.Root(false, {
            label: "I accept the terms and conditions",
            colorPalette: "blue",
        }));

        $(assertEast.equal(checkbox.unwrap("Checkbox").checked, false));
        $(assertEast.equal(checkbox.unwrap("Checkbox").label.unwrap("some"), "I accept the terms and conditions"));
        $(assertEast.equal(checkbox.unwrap("Checkbox").colorPalette.unwrap("some").hasTag("blue"), true));
    });

    test("creates select all checkbox with indeterminate", $ => {
        const checkbox = $.let(Checkbox.Root(false, {
            label: "Select all",
            indeterminate: true,
        }));

        $(assertEast.equal(checkbox.unwrap("Checkbox").label.unwrap("some"), "Select all"));
        $(assertEast.equal(checkbox.unwrap("Checkbox").indeterminate.unwrap("some"), true));
    });

    test("creates disabled readonly checkbox", $ => {
        const checkbox = $.let(Checkbox.Root(true, {
            label: "Premium feature (upgrade required)",
            disabled: true,
            colorPalette: "gray",
        }));

        $(assertEast.equal(checkbox.unwrap("Checkbox").checked, true));
        $(assertEast.equal(checkbox.unwrap("Checkbox").disabled.unwrap("some"), true));
        $(assertEast.equal(checkbox.unwrap("Checkbox").colorPalette.unwrap("some").hasTag("gray"), true));
    });
});
