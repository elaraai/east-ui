/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Fieldset, Field, Input, Text } from "../../src/index.js";

describeEast("Fieldset", (test) => {
    // =========================================================================
    // Basic Creation
    // =========================================================================

    test("creates fieldset with content only", $ => {
        const fieldset = $.let(Fieldset.Root([
            Text.Root("Field content"),
        ]));

        $(assertEast.equal(fieldset.getTag(), "Fieldset"));
        $(assertEast.equal(fieldset.unwrap("Fieldset").content.size(), 1n));
        $(assertEast.equal(fieldset.unwrap("Fieldset").legend.hasTag("none"), true));
    });

    test("creates fieldset with multiple children", $ => {
        const fieldset = $.let(Fieldset.Root([
            Text.Root("First"),
            Text.Root("Second"),
            Text.Root("Third"),
        ]));

        $(assertEast.equal(fieldset.unwrap("Fieldset").content.size(), 3n));
    });

    test("creates empty fieldset", $ => {
        const fieldset = $.let(Fieldset.Root([]));

        $(assertEast.equal(fieldset.unwrap("Fieldset").content.size(), 0n));
    });

    // =========================================================================
    // Legend
    // =========================================================================

    test("creates fieldset with legend", $ => {
        const fieldset = $.let(Fieldset.Root([
            Text.Root("Content"),
        ], {
            legend: "Contact Information",
        }));

        $(assertEast.equal(fieldset.unwrap("Fieldset").legend.hasTag("some"), true));
        $(assertEast.equal(fieldset.unwrap("Fieldset").legend.unwrap("some"), "Contact Information"));
    });

    test("creates fieldset with different legend", $ => {
        const fieldset = $.let(Fieldset.Root([
            Text.Root("Content"),
        ], {
            legend: "Personal Details",
        }));

        $(assertEast.equal(fieldset.unwrap("Fieldset").legend.unwrap("some"), "Personal Details"));
    });

    // =========================================================================
    // Helper Text
    // =========================================================================

    test("creates fieldset with helper text", $ => {
        const fieldset = $.let(Fieldset.Root([
            Text.Root("Content"),
        ], {
            helperText: "Please fill out all required fields.",
        }));

        $(assertEast.equal(fieldset.unwrap("Fieldset").helperText.hasTag("some"), true));
        $(assertEast.equal(fieldset.unwrap("Fieldset").helperText.unwrap("some"), "Please fill out all required fields."));
    });

    // =========================================================================
    // Error Text
    // =========================================================================

    test("creates fieldset with error text", $ => {
        const fieldset = $.let(Fieldset.Root([
            Text.Root("Content"),
        ], {
            errorText: "Some fields are invalid.",
        }));

        $(assertEast.equal(fieldset.unwrap("Fieldset").errorText.hasTag("some"), true));
        $(assertEast.equal(fieldset.unwrap("Fieldset").errorText.unwrap("some"), "Some fields are invalid."));
    });

    // =========================================================================
    // Disabled State
    // =========================================================================

    test("creates disabled fieldset", $ => {
        const fieldset = $.let(Fieldset.Root([
            Text.Root("Content"),
        ], {
            disabled: true,
        }));

        $(assertEast.equal(fieldset.unwrap("Fieldset").disabled.hasTag("some"), true));
        $(assertEast.equal(fieldset.unwrap("Fieldset").disabled.unwrap("some"), true));
    });

    test("creates enabled fieldset explicitly", $ => {
        const fieldset = $.let(Fieldset.Root([
            Text.Root("Content"),
        ], {
            disabled: false,
        }));

        $(assertEast.equal(fieldset.unwrap("Fieldset").disabled.unwrap("some"), false));
    });

    // =========================================================================
    // Invalid State
    // =========================================================================

    test("creates invalid fieldset", $ => {
        const fieldset = $.let(Fieldset.Root([
            Text.Root("Content"),
        ], {
            invalid: true,
        }));

        $(assertEast.equal(fieldset.unwrap("Fieldset").invalid.hasTag("some"), true));
        $(assertEast.equal(fieldset.unwrap("Fieldset").invalid.unwrap("some"), true));
    });

    test("creates valid fieldset explicitly", $ => {
        const fieldset = $.let(Fieldset.Root([
            Text.Root("Content"),
        ], {
            invalid: false,
        }));

        $(assertEast.equal(fieldset.unwrap("Fieldset").invalid.unwrap("some"), false));
    });

    // =========================================================================
    // Size
    // =========================================================================

    test("creates fieldset with small size", $ => {
        const fieldset = $.let(Fieldset.Root([
            Text.Root("Content"),
        ], {
            size: "sm",
        }));

        $(assertEast.equal(fieldset.unwrap("Fieldset").style.hasTag("some"), true));
        $(assertEast.equal(fieldset.unwrap("Fieldset").style.unwrap("some").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates fieldset with medium size", $ => {
        const fieldset = $.let(Fieldset.Root([
            Text.Root("Content"),
        ], {
            size: "md",
        }));

        $(assertEast.equal(fieldset.unwrap("Fieldset").style.unwrap("some").size.unwrap("some").hasTag("md"), true));
    });

    test("creates fieldset with large size", $ => {
        const fieldset = $.let(Fieldset.Root([
            Text.Root("Content"),
        ], {
            size: "lg",
        }));

        $(assertEast.equal(fieldset.unwrap("Fieldset").style.unwrap("some").size.unwrap("some").hasTag("lg"), true));
    });

    // =========================================================================
    // Practical Examples
    // =========================================================================

    test("creates contact form fieldset", $ => {
        const fieldset = $.let(Fieldset.Root([
            Field.Root("Email", Input.String("")),
            Field.Root("Phone", Input.String("")),
        ], {
            legend: "Contact Information",
            helperText: "Please fill out all required fields.",
            size: "md",
        }));

        $(assertEast.equal(fieldset.unwrap("Fieldset").legend.unwrap("some"), "Contact Information"));
        $(assertEast.equal(fieldset.unwrap("Fieldset").helperText.unwrap("some"), "Please fill out all required fields."));
        $(assertEast.equal(fieldset.unwrap("Fieldset").content.size(), 2n));
    });

    test("creates read-only fieldset", $ => {
        const fieldset = $.let(Fieldset.Root([
            Field.Root("Name", Input.String("John Doe")),
        ], {
            legend: "Read-only Information",
            disabled: true,
        }));

        $(assertEast.equal(fieldset.unwrap("Fieldset").legend.unwrap("some"), "Read-only Information"));
        $(assertEast.equal(fieldset.unwrap("Fieldset").disabled.unwrap("some"), true));
    });

    test("creates invalid fieldset with error", $ => {
        const fieldset = $.let(Fieldset.Root([
            Field.Root("Password", Input.String("")),
        ], {
            legend: "Security",
            invalid: true,
            errorText: "Password does not meet requirements.",
        }));

        $(assertEast.equal(fieldset.unwrap("Fieldset").invalid.unwrap("some"), true));
        $(assertEast.equal(fieldset.unwrap("Fieldset").errorText.unwrap("some"), "Password does not meet requirements."));
    });

    test("creates full fieldset with all options", $ => {
        const fieldset = $.let(Fieldset.Root([
            Field.Root("Field 1", Input.String("")),
            Field.Root("Field 2", Input.String("")),
        ], {
            legend: "Form Section",
            helperText: "Helper text",
            errorText: "Error text",
            disabled: false,
            invalid: false,
            size: "lg",
        }));

        $(assertEast.equal(fieldset.unwrap("Fieldset").legend.unwrap("some"), "Form Section"));
        $(assertEast.equal(fieldset.unwrap("Fieldset").helperText.unwrap("some"), "Helper text"));
        $(assertEast.equal(fieldset.unwrap("Fieldset").errorText.unwrap("some"), "Error text"));
        $(assertEast.equal(fieldset.unwrap("Fieldset").disabled.unwrap("some"), false));
        $(assertEast.equal(fieldset.unwrap("Fieldset").invalid.unwrap("some"), false));
        $(assertEast.equal(fieldset.unwrap("Fieldset").style.unwrap("some").size.unwrap("some").hasTag("lg"), true));
    });
});
