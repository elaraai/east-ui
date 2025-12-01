/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Field, Input, Checkbox } from "../../src/index.js";

describeEast("Field", (test) => {
    // =========================================================================
    // Basic Creation
    // =========================================================================

    test("creates field with label and control", $ => {
        const field = $.let(Field.Root(
            "Email",
            Input.String("", { placeholder: "you@example.com" })
        ));

        $(assertEast.equal(field.unwrap("Field").label, "Email"));
        $(assertEast.equal(field.unwrap("Field").helperText.hasTag("none"), true));
        $(assertEast.equal(field.unwrap("Field").errorText.hasTag("none"), true));
        $(assertEast.equal(field.unwrap("Field").required.hasTag("none"), true));
        $(assertEast.equal(field.unwrap("Field").disabled.hasTag("none"), true));
        $(assertEast.equal(field.unwrap("Field").invalid.hasTag("none"), true));
        $(assertEast.equal(field.unwrap("Field").readOnly.hasTag("none"), true));
    });

    test("creates field with checkbox control", $ => {
        const field = $.let(Field.Root(
            "Accept Terms",
            Checkbox.Root(false, { label: "I agree to the terms" })
        ));

        $(assertEast.equal(field.unwrap("Field").label, "Accept Terms"));
        // Verify control is a Checkbox
        $(assertEast.equal(field.unwrap("Field").control.hasTag("Checkbox"), true));
    });

    // =========================================================================
    // Helper Text
    // =========================================================================

    test("creates field with helper text", $ => {
        const field = $.let(Field.Root(
            "Email",
            Input.String("", { placeholder: "you@example.com" }),
            { helperText: "We'll never share your email." }
        ));

        $(assertEast.equal(field.unwrap("Field").helperText.hasTag("some"), true));
        $(assertEast.equal(field.unwrap("Field").helperText.unwrap("some"), "We'll never share your email."));
    });

    test("creates field with long helper text", $ => {
        const field = $.let(Field.Root(
            "Password",
            Input.String(""),
            { helperText: "Must be at least 8 characters with one uppercase, one lowercase, and one number." }
        ));

        $(assertEast.equal(field.unwrap("Field").helperText.unwrap("some"), "Must be at least 8 characters with one uppercase, one lowercase, and one number."));
    });

    // =========================================================================
    // Error Text
    // =========================================================================

    test("creates field with error text", $ => {
        const field = $.let(Field.Root(
            "Email",
            Input.String(""),
            { errorText: "Email is required" }
        ));

        $(assertEast.equal(field.unwrap("Field").errorText.hasTag("some"), true));
        $(assertEast.equal(field.unwrap("Field").errorText.unwrap("some"), "Email is required"));
    });

    test("creates field with error text and invalid state", $ => {
        const field = $.let(Field.Root(
            "Email",
            Input.String(""),
            {
                errorText: "Please enter a valid email address",
                invalid: true,
            }
        ));

        $(assertEast.equal(field.unwrap("Field").errorText.unwrap("some"), "Please enter a valid email address"));
        $(assertEast.equal(field.unwrap("Field").invalid.unwrap("some"), true));
    });

    // =========================================================================
    // Required State
    // =========================================================================

    test("creates required field", $ => {
        const field = $.let(Field.Root(
            "Username",
            Input.String("", { placeholder: "Enter username" }),
            { required: true }
        ));

        $(assertEast.equal(field.unwrap("Field").required.hasTag("some"), true));
        $(assertEast.equal(field.unwrap("Field").required.unwrap("some"), true));
    });

    test("creates non-required field explicitly", $ => {
        const field = $.let(Field.Root(
            "Middle Name",
            Input.String(""),
            { required: false }
        ));

        $(assertEast.equal(field.unwrap("Field").required.unwrap("some"), false));
    });

    // =========================================================================
    // Disabled State
    // =========================================================================

    test("creates disabled field", $ => {
        const field = $.let(Field.Root(
            "Email",
            Input.String(""),
            { disabled: true }
        ));

        $(assertEast.equal(field.unwrap("Field").disabled.hasTag("some"), true));
        $(assertEast.equal(field.unwrap("Field").disabled.unwrap("some"), true));
    });

    test("creates enabled field explicitly", $ => {
        const field = $.let(Field.Root(
            "Email",
            Input.String(""),
            { disabled: false }
        ));

        $(assertEast.equal(field.unwrap("Field").disabled.unwrap("some"), false));
    });

    // =========================================================================
    // Invalid State
    // =========================================================================

    test("creates invalid field", $ => {
        const field = $.let(Field.Root(
            "Email",
            Input.String(""),
            { invalid: true }
        ));

        $(assertEast.equal(field.unwrap("Field").invalid.hasTag("some"), true));
        $(assertEast.equal(field.unwrap("Field").invalid.unwrap("some"), true));
    });

    test("creates valid field explicitly", $ => {
        const field = $.let(Field.Root(
            "Email",
            Input.String(""),
            { invalid: false }
        ));

        $(assertEast.equal(field.unwrap("Field").invalid.unwrap("some"), false));
    });

    // =========================================================================
    // ReadOnly State
    // =========================================================================

    test("creates read-only field", $ => {
        const field = $.let(Field.Root(
            "Account ID",
            Input.String(""),
            { readOnly: true }
        ));

        $(assertEast.equal(field.unwrap("Field").readOnly.hasTag("some"), true));
        $(assertEast.equal(field.unwrap("Field").readOnly.unwrap("some"), true));
    });

    test("creates editable field explicitly", $ => {
        const field = $.let(Field.Root(
            "Email",
            Input.String(""),
            { readOnly: false }
        ));

        $(assertEast.equal(field.unwrap("Field").readOnly.unwrap("some"), false));
    });

    // =========================================================================
    // Combined Options
    // =========================================================================

    test("creates field with all options", $ => {
        const field = $.let(Field.Root(
            "Password",
            Input.String("", { placeholder: "Enter password" }),
            {
                helperText: "Must be at least 8 characters",
                errorText: "Password is too short",
                required: true,
                disabled: false,
                invalid: true,
                readOnly: false,
            }
        ));

        $(assertEast.equal(field.unwrap("Field").label, "Password"));
        $(assertEast.equal(field.unwrap("Field").helperText.unwrap("some"), "Must be at least 8 characters"));
        $(assertEast.equal(field.unwrap("Field").errorText.unwrap("some"), "Password is too short"));
        $(assertEast.equal(field.unwrap("Field").required.unwrap("some"), true));
        $(assertEast.equal(field.unwrap("Field").disabled.unwrap("some"), false));
        $(assertEast.equal(field.unwrap("Field").invalid.unwrap("some"), true));
        $(assertEast.equal(field.unwrap("Field").readOnly.unwrap("some"), false));
    });

    test("creates email field with validation", $ => {
        const field = $.let(Field.Root(
            "Email Address",
            Input.String("", { placeholder: "user@company.com" }),
            {
                helperText: "Enter your work email",
                required: true,
            }
        ));

        $(assertEast.equal(field.unwrap("Field").label, "Email Address"));
        $(assertEast.equal(field.unwrap("Field").helperText.unwrap("some"), "Enter your work email"));
        $(assertEast.equal(field.unwrap("Field").required.unwrap("some"), true));
    });

    test("creates read-only display field", $ => {
        const field = $.let(Field.Root(
            "User ID",
            Input.String(""),
            {
                readOnly: true,
                helperText: "This value cannot be changed",
            }
        ));

        $(assertEast.equal(field.unwrap("Field").readOnly.unwrap("some"), true));
        $(assertEast.equal(field.unwrap("Field").helperText.unwrap("some"), "This value cannot be changed"));
    });

    test("creates disabled field with explanation", $ => {
        const field = $.let(Field.Root(
            "Premium Feature",
            Checkbox.Root(false),
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
