/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Textarea, Style } from "../../src/index.js";

describeEast("Textarea", (test) => {
    // =========================================================================
    // Basic Creation
    // =========================================================================

    test("creates textarea with value only", $ => {
        const textarea = $.let(Textarea.Root("Hello"));

        $(assertEast.equal(textarea.unwrap("Textarea").value, "Hello"));
        $(assertEast.equal(textarea.unwrap("Textarea").placeholder.hasTag("none"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").variant.hasTag("none"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").size.hasTag("none"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").resize.hasTag("none"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").rows.hasTag("none"), true));
    });

    test("creates textarea with empty value", $ => {
        const textarea = $.let(Textarea.Root(""));

        $(assertEast.equal(textarea.unwrap("Textarea").value, ""));
    });

    // =========================================================================
    // Placeholder
    // =========================================================================

    test("creates textarea with placeholder", $ => {
        const textarea = $.let(Textarea.Root("", {
            placeholder: "Enter description...",
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").placeholder.hasTag("some"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").placeholder.unwrap("some"), "Enter description..."));
    });

    // =========================================================================
    // Variant
    // =========================================================================

    test("creates textarea with outline variant", $ => {
        const textarea = $.let(Textarea.Root("", {
            variant: "outline",
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").variant.hasTag("some"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").variant.unwrap("some").hasTag("outline"), true));
    });

    test("creates textarea with subtle variant", $ => {
        const textarea = $.let(Textarea.Root("", {
            variant: "subtle",
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").variant.unwrap("some").hasTag("subtle"), true));
    });

    test("creates textarea with flushed variant", $ => {
        const textarea = $.let(Textarea.Root("", {
            variant: "flushed",
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").variant.unwrap("some").hasTag("flushed"), true));
    });

    // =========================================================================
    // Size
    // =========================================================================

    test("creates textarea with size", $ => {
        const textarea = $.let(Textarea.Root("", {
            size: "md",
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").size.hasTag("some"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").size.unwrap("some").hasTag("md"), true));
    });

    test("supports all sizes", $ => {
        const xs = $.let(Textarea.Root("", { size: "xs" }));
        const sm = $.let(Textarea.Root("", { size: "sm" }));
        const md = $.let(Textarea.Root("", { size: "md" }));
        const lg = $.let(Textarea.Root("", { size: "lg" }));

        $(assertEast.equal(xs.unwrap("Textarea").size.unwrap("some").hasTag("xs"), true));
        $(assertEast.equal(sm.unwrap("Textarea").size.unwrap("some").hasTag("sm"), true));
        $(assertEast.equal(md.unwrap("Textarea").size.unwrap("some").hasTag("md"), true));
        $(assertEast.equal(lg.unwrap("Textarea").size.unwrap("some").hasTag("lg"), true));
    });

    test("supports Style.Size helper", $ => {
        const textarea = $.let(Textarea.Root("", {
            size: Style.Size("lg"),
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").size.unwrap("some").hasTag("lg"), true));
    });

    // =========================================================================
    // Resize
    // =========================================================================

    test("creates textarea with resize none", $ => {
        const textarea = $.let(Textarea.Root("", {
            resize: "none",
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").resize.hasTag("some"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").resize.unwrap("some").hasTag("none"), true));
    });

    test("creates textarea with resize vertical", $ => {
        const textarea = $.let(Textarea.Root("", {
            resize: "vertical",
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").resize.unwrap("some").hasTag("vertical"), true));
    });

    test("creates textarea with resize horizontal", $ => {
        const textarea = $.let(Textarea.Root("", {
            resize: "horizontal",
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").resize.unwrap("some").hasTag("horizontal"), true));
    });

    test("creates textarea with resize both", $ => {
        const textarea = $.let(Textarea.Root("", {
            resize: "both",
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").resize.unwrap("some").hasTag("both"), true));
    });

    // =========================================================================
    // Rows
    // =========================================================================

    test("creates textarea with rows as number", $ => {
        const textarea = $.let(Textarea.Root("", {
            rows: 5,
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").rows.hasTag("some"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").rows.unwrap("some"), 5n));
    });

    test("creates textarea with rows as bigint", $ => {
        const textarea = $.let(Textarea.Root("", {
            rows: 10n,
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").rows.unwrap("some"), 10n));
    });

    // =========================================================================
    // Max Length
    // =========================================================================

    test("creates textarea with maxLength as number", $ => {
        const textarea = $.let(Textarea.Root("", {
            maxLength: 500,
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").maxLength.hasTag("some"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").maxLength.unwrap("some"), 500n));
    });

    test("creates textarea with maxLength as bigint", $ => {
        const textarea = $.let(Textarea.Root("", {
            maxLength: 1000n,
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").maxLength.unwrap("some"), 1000n));
    });

    // =========================================================================
    // Boolean Flags
    // =========================================================================

    test("creates disabled textarea", $ => {
        const textarea = $.let(Textarea.Root("", {
            disabled: true,
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").disabled.hasTag("some"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").disabled.unwrap("some"), true));
    });

    test("creates read-only textarea", $ => {
        const textarea = $.let(Textarea.Root("Read only content", {
            readOnly: true,
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").readOnly.hasTag("some"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").readOnly.unwrap("some"), true));
    });

    test("creates invalid textarea", $ => {
        const textarea = $.let(Textarea.Root("", {
            invalid: true,
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").invalid.hasTag("some"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").invalid.unwrap("some"), true));
    });

    test("creates required textarea", $ => {
        const textarea = $.let(Textarea.Root("", {
            required: true,
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").required.hasTag("some"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").required.unwrap("some"), true));
    });

    test("creates auto-resizing textarea", $ => {
        const textarea = $.let(Textarea.Root("", {
            autoresize: true,
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").autoresize.hasTag("some"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").autoresize.unwrap("some"), true));
    });

    // =========================================================================
    // Combined Options
    // =========================================================================

    test("creates textarea with all options", $ => {
        const textarea = $.let(Textarea.Root("Initial content", {
            placeholder: "Enter text...",
            variant: "outline",
            size: "md",
            resize: "vertical",
            rows: 6,
            maxLength: 1000,
            disabled: false,
            readOnly: false,
            invalid: false,
            required: true,
            autoresize: false,
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").value, "Initial content"));
        $(assertEast.equal(textarea.unwrap("Textarea").placeholder.unwrap("some"), "Enter text..."));
        $(assertEast.equal(textarea.unwrap("Textarea").variant.unwrap("some").hasTag("outline"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").size.unwrap("some").hasTag("md"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").resize.unwrap("some").hasTag("vertical"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").rows.unwrap("some"), 6n));
        $(assertEast.equal(textarea.unwrap("Textarea").maxLength.unwrap("some"), 1000n));
        $(assertEast.equal(textarea.unwrap("Textarea").disabled.unwrap("some"), false));
        $(assertEast.equal(textarea.unwrap("Textarea").readOnly.unwrap("some"), false));
        $(assertEast.equal(textarea.unwrap("Textarea").invalid.unwrap("some"), false));
        $(assertEast.equal(textarea.unwrap("Textarea").required.unwrap("some"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").autoresize.unwrap("some"), false));
    });

    test("creates auto-resize textarea without fixed rows", $ => {
        const textarea = $.let(Textarea.Root("", {
            autoresize: true,
            placeholder: "Start typing...",
            variant: "subtle",
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").autoresize.unwrap("some"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").rows.hasTag("none"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").variant.unwrap("some").hasTag("subtle"), true));
    });

    test("creates fixed-size textarea", $ => {
        const textarea = $.let(Textarea.Root("", {
            rows: 8,
            resize: "none",
            maxLength: 2000,
        }));

        $(assertEast.equal(textarea.unwrap("Textarea").rows.unwrap("some"), 8n));
        $(assertEast.equal(textarea.unwrap("Textarea").resize.unwrap("some").hasTag("none"), true));
        $(assertEast.equal(textarea.unwrap("Textarea").maxLength.unwrap("some"), 2000n));
    });
});
