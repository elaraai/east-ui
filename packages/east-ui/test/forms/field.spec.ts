/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Field } from "../../src/index.js";

describeEast("Field", (test) => {
    // =========================================================================
    // Basic Creation
    // =========================================================================

    test("creates field with label and control", $ => {
        const field = $.let(Field.StringInput(
            "Email",
            "",
            { placeholder: "you@example.com" }
        ));

        $(assertEast.equal(field.unwrap("Field").label, "Email"));
        $(assertEast.equal(field.unwrap("Field").helperText.hasTag("none"), true));
        $(assertEast.equal(field.unwrap("Field").errorText.hasTag("none"), true));
        $(assertEast.equal(field.unwrap("Field").required.hasTag("none"), true));
        $(assertEast.equal(field.unwrap("Field").disabled.hasTag("none"), true));
        $(assertEast.equal(field.unwrap("Field").readOnly.hasTag("none"), true));
    });

    test("creates field with checkbox control", $ => {
        const field = $.let(Field.Checkbox(
            "Accept Terms",
            false
        ));

        $(assertEast.equal(field.unwrap("Field").label, "Accept Terms"));
        // Verify control is a Checkbox
        $(assertEast.equal(field.unwrap("Field").control.hasTag("Checkbox"), true));
    });

    // =========================================================================
    // Helper Text
    // =========================================================================

    test("creates field with helper text", $ => {
        const field = $.let(Field.StringInput(
            "Email",
            "",
            { placeholder: "you@example.com", helperText: "We'll never share your email." }
        ));

        $(assertEast.equal(field.unwrap("Field").helperText.hasTag("some"), true));
        $(assertEast.equal(field.unwrap("Field").helperText.unwrap("some"), "We'll never share your email."));
    });

    test("creates field with long helper text", $ => {
        const field = $.let(Field.StringInput(
            "Password",
            "",
            { helperText: "Must be at least 8 characters with one uppercase, one lowercase, and one number." }
        ));

        $(assertEast.equal(field.unwrap("Field").helperText.unwrap("some"), "Must be at least 8 characters with one uppercase, one lowercase, and one number."));
    });

    // =========================================================================
    // Error Text
    // =========================================================================

    test("creates field with error text", $ => {
        const field = $.let(Field.StringInput(
            "Email",
            "",
            { errorText: "Email is required" }
        ));

        $(assertEast.equal(field.unwrap("Field").errorText.hasTag("some"), true));
        $(assertEast.equal(field.unwrap("Field").errorText.unwrap("some"), "Email is required"));
    });

    // =========================================================================
    // Required State
    // =========================================================================

    test("creates required field", $ => {
        const field = $.let(Field.StringInput(
            "Username",
            "",
            { placeholder: "Enter username", required: true }
        ));

        $(assertEast.equal(field.unwrap("Field").required.hasTag("some"), true));
        $(assertEast.equal(field.unwrap("Field").required.unwrap("some"), true));
    });

    test("creates non-required field explicitly", $ => {
        const field = $.let(Field.StringInput(
            "Middle Name",
            "",
            { required: false }
        ));

        $(assertEast.equal(field.unwrap("Field").required.unwrap("some"), false));
    });

    // =========================================================================
    // Disabled State
    // =========================================================================

    test("creates disabled field", $ => {
        const field = $.let(Field.StringInput(
            "Email",
            "",
            { disabled: true }
        ));

        $(assertEast.equal(field.unwrap("Field").disabled.hasTag("some"), true));
        $(assertEast.equal(field.unwrap("Field").disabled.unwrap("some"), true));
    });

    test("creates enabled field explicitly", $ => {
        const field = $.let(Field.StringInput(
            "Email",
            "",
            { disabled: false }
        ));

        $(assertEast.equal(field.unwrap("Field").disabled.unwrap("some"), false));
    });

    // =========================================================================
    // ReadOnly State
    // =========================================================================

    test("creates read-only field", $ => {
        const field = $.let(Field.StringInput(
            "Account ID",
            "",
            { readOnly: true }
        ));

        $(assertEast.equal(field.unwrap("Field").readOnly.hasTag("some"), true));
        $(assertEast.equal(field.unwrap("Field").readOnly.unwrap("some"), true));
    });

    test("creates editable field explicitly", $ => {
        const field = $.let(Field.StringInput(
            "Email",
            "",
            { readOnly: false }
        ));

        $(assertEast.equal(field.unwrap("Field").readOnly.unwrap("some"), false));
    });

    // =========================================================================
    // Combined Options
    // =========================================================================

    test("creates field with all options", $ => {
        const field = $.let(Field.StringInput(
            "Password",
            "",
            {
                placeholder: "Enter password",
                helperText: "Must be at least 8 characters",
                errorText: "Password is too short",
                required: true,
                disabled: false,
                readOnly: false,
            }
        ));

        $(assertEast.equal(field.unwrap("Field").label, "Password"));
        $(assertEast.equal(field.unwrap("Field").helperText.unwrap("some"), "Must be at least 8 characters"));
        $(assertEast.equal(field.unwrap("Field").errorText.unwrap("some"), "Password is too short"));
        $(assertEast.equal(field.unwrap("Field").required.unwrap("some"), true));
        $(assertEast.equal(field.unwrap("Field").disabled.unwrap("some"), false));
        $(assertEast.equal(field.unwrap("Field").readOnly.unwrap("some"), false));
    });

    test("creates email field with validation", $ => {
        const field = $.let(Field.StringInput(
            "Email Address",
            "",
            {
                placeholder: "user@company.com",
                helperText: "Enter your work email",
                required: true,
            }
        ));

        $(assertEast.equal(field.unwrap("Field").label, "Email Address"));
        $(assertEast.equal(field.unwrap("Field").helperText.unwrap("some"), "Enter your work email"));
        $(assertEast.equal(field.unwrap("Field").required.unwrap("some"), true));
    });

    test("creates read-only display field", $ => {
        const field = $.let(Field.StringInput(
            "User ID",
            "",
            {
                readOnly: true,
                helperText: "This value cannot be changed",
            }
        ));

        $(assertEast.equal(field.unwrap("Field").readOnly.unwrap("some"), true));
        $(assertEast.equal(field.unwrap("Field").helperText.unwrap("some"), "This value cannot be changed"));
    });

    test("creates disabled field with explanation", $ => {
        const field = $.let(Field.Checkbox(
            "Premium Feature",
            false,
            {
                disabled: true,
                helperText: "Upgrade to enable this feature",
            }
        ));

        $(assertEast.equal(field.unwrap("Field").disabled.unwrap("some"), true));
        $(assertEast.equal(field.unwrap("Field").helperText.unwrap("some"), "Upgrade to enable this feature"));
        $(assertEast.equal(field.unwrap("Field").control.hasTag("Checkbox"), true));
    });
});
