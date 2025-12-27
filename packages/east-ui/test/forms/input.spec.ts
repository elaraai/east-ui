/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Input, Style } from "../../src/index.js";
import { tokenizeDateTimeFormat } from "@elaraai/east/internal";

describeEast("Input", (test) => {
    // =========================================================================
    // String Input - Basic Creation
    // =========================================================================

    test("creates string input with value only", $ => {
        const input = $.let(Input.String("Hello"));

        $(assertEast.equal(input.unwrap().unwrap("StringInput").value, "Hello"));
        $(assertEast.equal(input.unwrap().unwrap("StringInput").placeholder.hasTag("none"), true));
        $(assertEast.equal(input.unwrap().unwrap("StringInput").variant.hasTag("none"), true));
        $(assertEast.equal(input.unwrap().unwrap("StringInput").size.hasTag("none"), true));
    });

    test("creates string input with placeholder", $ => {
        const input = $.let(Input.String("", {
            placeholder: "Enter text",
        }));

        $(assertEast.equal(input.unwrap().unwrap("StringInput").placeholder.hasTag("some"), true));
        $(assertEast.equal(input.unwrap().unwrap("StringInput").placeholder.unwrap("some"), "Enter text"));
    });

    test("creates string input with variant", $ => {
        const input = $.let(Input.String("", {
            variant: "outline",
        }));

        $(assertEast.equal(input.unwrap().unwrap("StringInput").variant.hasTag("some"), true));
        $(assertEast.equal(input.unwrap().unwrap("StringInput").variant.unwrap("some").hasTag("outline"), true));
    });

    test("creates string input with subtle variant", $ => {
        const input = $.let(Input.String("", {
            variant: "subtle",
        }));

        $(assertEast.equal(input.unwrap().unwrap("StringInput").variant.unwrap("some").hasTag("subtle"), true));
    });

    test("creates string input with flushed variant", $ => {
        const input = $.let(Input.String("", {
            variant: "flushed",
        }));

        $(assertEast.equal(input.unwrap().unwrap("StringInput").variant.unwrap("some").hasTag("flushed"), true));
    });

    test("creates string input with size", $ => {
        const input = $.let(Input.String("", {
            size: "md",
        }));

        $(assertEast.equal(input.unwrap().unwrap("StringInput").size.hasTag("some"), true));
        $(assertEast.equal(input.unwrap().unwrap("StringInput").size.unwrap("some").hasTag("md"), true));
    });

    test("creates string input with maxLength", $ => {
        const input = $.let(Input.String("", {
            maxLength: 100n,
        }));

        $(assertEast.equal(input.unwrap().unwrap("StringInput").maxLength.hasTag("some"), true));
        $(assertEast.equal(input.unwrap().unwrap("StringInput").maxLength.unwrap("some"), 100n));
    });

    test("creates string input with pattern", $ => {
        const input = $.let(Input.String("", {
            pattern: "^[a-zA-Z]+$",
        }));

        $(assertEast.equal(input.unwrap().unwrap("StringInput").pattern.hasTag("some"), true));
        $(assertEast.equal(input.unwrap().unwrap("StringInput").pattern.unwrap("some"), "^[a-zA-Z]+$"));
    });

    test("creates disabled string input", $ => {
        const input = $.let(Input.String("", {
            disabled: true,
        }));

        $(assertEast.equal(input.unwrap().unwrap("StringInput").disabled.hasTag("some"), true));
        $(assertEast.equal(input.unwrap().unwrap("StringInput").disabled.unwrap("some"), true));
    });

    test("creates string input with InputVariant helper", $ => {
        const input = $.let(Input.String("", {
            variant: "subtle",
        }));

        $(assertEast.equal(input.unwrap().unwrap("StringInput").variant.unwrap("some").hasTag("subtle"), true));
    });

    // =========================================================================
    // Integer Input - Basic Creation
    // =========================================================================

    test("creates integer input with value only", $ => {
        const input = $.let(Input.Integer(42n));

        $(assertEast.equal(input.unwrap().unwrap("IntegerInput").value, 42n));
        $(assertEast.equal(input.unwrap().unwrap("IntegerInput").min.hasTag("none"), true));
        $(assertEast.equal(input.unwrap().unwrap("IntegerInput").max.hasTag("none"), true));
    });

    test("creates integer input with min", $ => {
        const input = $.let(Input.Integer(0n, {
            min: 0n,
        }));

        $(assertEast.equal(input.unwrap().unwrap("IntegerInput").min.hasTag("some"), true));
        $(assertEast.equal(input.unwrap().unwrap("IntegerInput").min.unwrap("some"), 0n));
    });

    test("creates integer input with max", $ => {
        const input = $.let(Input.Integer(0n, {
            max: 100n,
        }));

        $(assertEast.equal(input.unwrap().unwrap("IntegerInput").max.hasTag("some"), true));
        $(assertEast.equal(input.unwrap().unwrap("IntegerInput").max.unwrap("some"), 100n));
    });

    test("creates integer input with step", $ => {
        const input = $.let(Input.Integer(0n, {
            step: 5n,
        }));

        $(assertEast.equal(input.unwrap().unwrap("IntegerInput").step.hasTag("some"), true));
        $(assertEast.equal(input.unwrap().unwrap("IntegerInput").step.unwrap("some"), 5n));
    });

    test("creates integer input with min and max", $ => {
        const input = $.let(Input.Integer(25n, {
            min: 0n,
            max: 100n,
        }));

        $(assertEast.equal(input.unwrap().unwrap("IntegerInput").min.unwrap("some"), 0n));
        $(assertEast.equal(input.unwrap().unwrap("IntegerInput").max.unwrap("some"), 100n));
    });

    test("creates disabled integer input", $ => {
        const input = $.let(Input.Integer(0n, {
            disabled: true,
        }));

        $(assertEast.equal(input.unwrap().unwrap("IntegerInput").disabled.unwrap("some"), true));
    });

    // =========================================================================
    // Float Input - Basic Creation
    // =========================================================================

    test("creates float input with value only", $ => {
        const input = $.let(Input.Float(3.14));

        $(assertEast.equal(input.unwrap().unwrap("FloatInput").value, 3.14));
        $(assertEast.equal(input.unwrap().unwrap("FloatInput").min.hasTag("none"), true));
        $(assertEast.equal(input.unwrap().unwrap("FloatInput").max.hasTag("none"), true));
        $(assertEast.equal(input.unwrap().unwrap("FloatInput").precision.hasTag("none"), true));
    });

    test("creates float input with min", $ => {
        const input = $.let(Input.Float(0.0, {
            min: 0.0,
        }));

        $(assertEast.equal(input.unwrap().unwrap("FloatInput").min.hasTag("some"), true));
        $(assertEast.equal(input.unwrap().unwrap("FloatInput").min.unwrap("some"), 0.0));
    });

    test("creates float input with max", $ => {
        const input = $.let(Input.Float(0.0, {
            max: 100.0,
        }));

        $(assertEast.equal(input.unwrap().unwrap("FloatInput").max.hasTag("some"), true));
        $(assertEast.equal(input.unwrap().unwrap("FloatInput").max.unwrap("some"), 100.0));
    });

    test("creates float input with step", $ => {
        const input = $.let(Input.Float(0.0, {
            step: 0.1,
        }));

        $(assertEast.equal(input.unwrap().unwrap("FloatInput").step.hasTag("some"), true));
        $(assertEast.equal(input.unwrap().unwrap("FloatInput").step.unwrap("some"), 0.1));
    });

    test("creates float input with precision", $ => {
        const input = $.let(Input.Float(19.99, {
            precision: 2n,
        }));

        $(assertEast.equal(input.unwrap().unwrap("FloatInput").precision.hasTag("some"), true));
        $(assertEast.equal(input.unwrap().unwrap("FloatInput").precision.unwrap("some"), 2n));
    });

    test("creates disabled float input", $ => {
        const input = $.let(Input.Float(0.0, {
            disabled: true,
        }));

        $(assertEast.equal(input.unwrap().unwrap("FloatInput").disabled.unwrap("some"), true));
    });

    // =========================================================================
    // DateTime Input - Basic Creation
    // =========================================================================

    test("creates datetime input with value only", $ => {
        const now = new Date("2025-01-15T10:00:00Z");
        const input = $.let(Input.DateTime(now));

        $(assertEast.equal(input.unwrap().unwrap("DateTimeInput").precision.hasTag("none"), true));
        $(assertEast.equal(input.unwrap().unwrap("DateTimeInput").format.hasTag("none"), true));
    });

    test("creates datetime input with precision date", $ => {
        const now = new Date("2025-01-15T10:00:00Z");
        const input = $.let(Input.DateTime(now, {
            precision: 'date',
        }));

        $(assertEast.equal(input.unwrap().unwrap("DateTimeInput").precision.hasTag("some"), true));
        $(assertEast.equal(input.unwrap().unwrap("DateTimeInput").precision.unwrap("some").getTag(), 'date'));
    });

    test("creates datetime input with precision time", $ => {
        const now = new Date("2025-01-15T10:00:00Z");
        const input = $.let(Input.DateTime(now, {
            precision: 'time',
        }));

        $(assertEast.equal(input.unwrap().unwrap("DateTimeInput").precision.hasTag("some"), true));
        $(assertEast.equal(input.unwrap().unwrap("DateTimeInput").precision.unwrap("some").getTag(), 'time'));
    });

    test("creates datetime input with format", $ => {
        const now = new Date("2025-01-15T10:00:00Z");
        const input = $.let(Input.DateTime(now, {
            format: "yyyy-MM-dd HH:mm",
        }));

        $(assertEast.equal(input.unwrap().unwrap("DateTimeInput").format.hasTag("some"), true));
        $(assertEast.equal(input.unwrap().unwrap("DateTimeInput").format.unwrap("some"), tokenizeDateTimeFormat("yyyy-MM-dd HH:mm")));
    });

    test("creates disabled datetime input", $ => {
        const now = new Date("2025-01-15T10:00:00Z");
        const input = $.let(Input.DateTime(now, {
            disabled: true,
        }));

        $(assertEast.equal(input.unwrap().unwrap("DateTimeInput").disabled.unwrap("some"), true));
    });

    // =========================================================================
    // Combined Style Options
    // =========================================================================

    test("creates string input with all options", $ => {
        const input = $.let(Input.String("test", {
            placeholder: "Enter text",
            variant: "outline",
            size: "md",
            maxLength: 50n,
            pattern: "^[a-z]+$",
            disabled: false,
        }));

        $(assertEast.equal(input.unwrap().unwrap("StringInput").value, "test"));
        $(assertEast.equal(input.unwrap().unwrap("StringInput").placeholder.unwrap("some"), "Enter text"));
        $(assertEast.equal(input.unwrap().unwrap("StringInput").variant.unwrap("some").hasTag("outline"), true));
        $(assertEast.equal(input.unwrap().unwrap("StringInput").size.unwrap("some").hasTag("md"), true));
        $(assertEast.equal(input.unwrap().unwrap("StringInput").maxLength.unwrap("some"), 50n));
        $(assertEast.equal(input.unwrap().unwrap("StringInput").pattern.unwrap("some"), "^[a-z]+$"));
        $(assertEast.equal(input.unwrap().unwrap("StringInput").disabled.unwrap("some"), false));
    });

    test("creates integer input with all options", $ => {
        const input = $.let(Input.Integer(50n, {
            min: 0n,
            max: 100n,
            step: 5n,
            variant: "subtle",
            size: "lg",
            disabled: false,
        }));

        $(assertEast.equal(input.unwrap().unwrap("IntegerInput").value, 50n));
        $(assertEast.equal(input.unwrap().unwrap("IntegerInput").min.unwrap("some"), 0n));
        $(assertEast.equal(input.unwrap().unwrap("IntegerInput").max.unwrap("some"), 100n));
        $(assertEast.equal(input.unwrap().unwrap("IntegerInput").step.unwrap("some"), 5n));
        $(assertEast.equal(input.unwrap().unwrap("IntegerInput").variant.unwrap("some").hasTag("subtle"), true));
        $(assertEast.equal(input.unwrap().unwrap("IntegerInput").size.unwrap("some").hasTag("lg"), true));
    });

    test("creates float input with all options", $ => {
        const input = $.let(Input.Float(9.99, {
            min: 0.0,
            max: 100.0,
            step: 0.01,
            precision: 2n,
            variant: "flushed",
            size: "sm",
            disabled: false,
        }));

        $(assertEast.equal(input.unwrap().unwrap("FloatInput").value, 9.99));
        $(assertEast.equal(input.unwrap().unwrap("FloatInput").min.unwrap("some"), 0.0));
        $(assertEast.equal(input.unwrap().unwrap("FloatInput").max.unwrap("some"), 100.0));
        $(assertEast.equal(input.unwrap().unwrap("FloatInput").precision.unwrap("some"), 2n));
        $(assertEast.equal(input.unwrap().unwrap("FloatInput").variant.unwrap("some").hasTag("flushed"), true));
        $(assertEast.equal(input.unwrap().unwrap("FloatInput").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates datetime input with all options", $ => {
        const now = new Date("2025-01-15T10:00:00Z");
        const input = $.let(Input.DateTime(now, {
            format: "yyyy-MM-dd HH:mm:ss",
            variant: "outline",
            size: "md",
            disabled: false,
        }));

        $(assertEast.equal(input.unwrap().unwrap("DateTimeInput").format.unwrap("some"), tokenizeDateTimeFormat("yyyy-MM-dd HH:mm:ss")));
        $(assertEast.equal(input.unwrap().unwrap("DateTimeInput").variant.unwrap("some").hasTag("outline"), true));
        $(assertEast.equal(input.unwrap().unwrap("DateTimeInput").size.unwrap("some").hasTag("md"), true));
    });

    // =========================================================================
    // All Sizes
    // =========================================================================

    test("supports all sizes for string input", $ => {
        const xs = $.let(Input.String("", { size: "xs" }));
        const sm = $.let(Input.String("", { size: "sm" }));
        const md = $.let(Input.String("", { size: "md" }));
        const lg = $.let(Input.String("", { size: "lg" }));

        $(assertEast.equal(xs.unwrap().unwrap("StringInput").size.unwrap("some").hasTag("xs"), true));
        $(assertEast.equal(sm.unwrap().unwrap("StringInput").size.unwrap("some").hasTag("sm"), true));
        $(assertEast.equal(md.unwrap().unwrap("StringInput").size.unwrap("some").hasTag("md"), true));
        $(assertEast.equal(lg.unwrap().unwrap("StringInput").size.unwrap("some").hasTag("lg"), true));
    });

    test("supports Style.Size helper for input", $ => {
        const input = $.let(Input.String("", {
            size: Style.Size("md"),
        }));

        $(assertEast.equal(input.unwrap().unwrap("StringInput").size.unwrap("some").hasTag("md"), true));
    });
});
