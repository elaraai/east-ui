/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Text, Style } from "../../src/index.js";

describeEast("Text", (test) => {
    // =========================================================================
    // Basic Creation
    // =========================================================================

    test("creates text with string value", $ => {
        const text = $.let(Text.Root("Hello"));

        $(assertEast.equal(text.unwrap("Text").value, "Hello"));
    });

    // =========================================================================
    // Style Properties - Individual
    // =========================================================================

    test("creates text with color", $ => {
        const text = $.let(Text.Root("Colored", {
            color: "blue.500",
        }));

        $(assertEast.equal(text.unwrap("Text").value, "Colored"));
        $(assertEast.equal(text.unwrap("Text").color.hasTag("some"), true));
        $(assertEast.equal(text.unwrap("Text").color.unwrap("some"), "blue.500"));
    });

    test("creates text with background", $ => {
        const text = $.let(Text.Root("Background", {
            background: "gray.100",
        }));

        $(assertEast.equal(text.unwrap("Text").value, "Background"));
        $(assertEast.equal(text.unwrap("Text").background.hasTag("some"), true));
        $(assertEast.equal(text.unwrap("Text").background.unwrap("some"), "gray.100"));
    });

    test("creates text with fontWeight", $ => {
        const text = $.let(Text.Root("Bold", {
            fontWeight: Style.FontWeight("bold"),
        }));

        $(assertEast.equal(text.unwrap("Text").value, "Bold"));
        $(assertEast.equal(text.unwrap("Text").fontWeight.hasTag("some"), true));
        $(assertEast.equal(text.unwrap("Text").fontWeight.unwrap("some").hasTag("bold"), true));
    });

    test("creates text with fontStyle", $ => {
        const text = $.let(Text.Root("Italic", {
            fontStyle: Style.FontStyle("italic"),
        }));

        $(assertEast.equal(text.unwrap("Text").value, "Italic"));
        $(assertEast.equal(text.unwrap("Text").fontStyle.hasTag("some"), true));
        $(assertEast.equal(text.unwrap("Text").fontStyle.unwrap("some").hasTag("italic"), true));
    });

    test("creates text with textTransform", $ => {
        const text = $.let(Text.Root("uppercase", {
            textTransform: Style.TextTransform("uppercase"),
        }));

        $(assertEast.equal(text.unwrap("Text").value, "uppercase"));
        $(assertEast.equal(text.unwrap("Text").textTransform.hasTag("some"), true));
        $(assertEast.equal(text.unwrap("Text").textTransform.unwrap("some").hasTag("uppercase"), true));
    });

    test("creates text with textAlign", $ => {
        const text = $.let(Text.Root("Centered", {
            textAlign: Style.TextAlign("center"),
        }));

        $(assertEast.equal(text.unwrap("Text").value, "Centered"));
        $(assertEast.equal(text.unwrap("Text").textAlign.hasTag("some"), true));
        $(assertEast.equal(text.unwrap("Text").textAlign.unwrap("some").hasTag("center"), true));
    });

    test("creates text with borderWidth", $ => {
        const text = $.let(Text.Root("Bordered", {
            borderWidth: Style.BorderWidth("thin"),
        }));

        $(assertEast.equal(text.unwrap("Text").value, "Bordered"));
        $(assertEast.equal(text.unwrap("Text").borderWidth.hasTag("some"), true));
        $(assertEast.equal(text.unwrap("Text").borderWidth.unwrap("some").hasTag("thin"), true));
    });

    test("creates text with borderStyle", $ => {
        const text = $.let(Text.Root("Bordered", {
            borderStyle: Style.BorderStyle("solid"),
        }));

        $(assertEast.equal(text.unwrap("Text").value, "Bordered"));
        $(assertEast.equal(text.unwrap("Text").borderStyle.hasTag("some"), true));
        $(assertEast.equal(text.unwrap("Text").borderStyle.unwrap("some").hasTag("solid"), true));
    });

    test("creates text with borderColor", $ => {
        const text = $.let(Text.Root("Bordered", {
            borderColor: "red.500",
        }));

        $(assertEast.equal(text.unwrap("Text").value, "Bordered"));
        $(assertEast.equal(text.unwrap("Text").borderColor.hasTag("some"), true));
        $(assertEast.equal(text.unwrap("Text").borderColor.unwrap("some"), "red.500"));
    });

    // =========================================================================
    // No Style - Defaults to None
    // =========================================================================

    test("creates text with no style - all options are none", $ => {
        const text = $.let(Text.Root("Plain"));

        $(assertEast.equal(text.unwrap("Text").value, "Plain"));
        $(assertEast.equal(text.unwrap("Text").color.hasTag("none"), true));
        $(assertEast.equal(text.unwrap("Text").background.hasTag("none"), true));
        $(assertEast.equal(text.unwrap("Text").fontWeight.hasTag("none"), true));
        $(assertEast.equal(text.unwrap("Text").fontStyle.hasTag("none"), true));
        $(assertEast.equal(text.unwrap("Text").textTransform.hasTag("none"), true));
        $(assertEast.equal(text.unwrap("Text").textAlign.hasTag("none"), true));
        $(assertEast.equal(text.unwrap("Text").borderWidth.hasTag("none"), true));
        $(assertEast.equal(text.unwrap("Text").borderStyle.hasTag("none"), true));
        $(assertEast.equal(text.unwrap("Text").borderColor.hasTag("none"), true));
    });

    // =========================================================================
    // Multiple Style Properties
    // =========================================================================

    test("creates text with multiple styles", $ => {
        const text = $.let(Text.Root("Styled", {
            color: "blue.500",
            fontWeight: Style.FontWeight("bold"),
            textAlign: Style.TextAlign("center"),
            background: "yellow.100",
        }));

        $(assertEast.equal(text.unwrap("Text").value, "Styled"));
        $(assertEast.equal(text.unwrap("Text").color.unwrap("some"), "blue.500"));
        $(assertEast.equal(text.unwrap("Text").fontWeight.unwrap("some").hasTag("bold"), true));
        $(assertEast.equal(text.unwrap("Text").textAlign.unwrap("some").hasTag("center"), true));
        $(assertEast.equal(text.unwrap("Text").background.unwrap("some"), "yellow.100"));
        // Other styles should be none
        $(assertEast.equal(text.unwrap("Text").fontStyle.hasTag("none"), true));
        $(assertEast.equal(text.unwrap("Text").borderWidth.hasTag("none"), true));
    });

    // =========================================================================
    // All Font Weights
    // =========================================================================

    test("supports all font weights", $ => {
        const normal = $.let(Text.Root("normal", { fontWeight: Style.FontWeight("normal") }));
        const bold = $.let(Text.Root("bold", { fontWeight: Style.FontWeight("bold") }));
        const semibold = $.let(Text.Root("semibold", { fontWeight: Style.FontWeight("semibold") }));
        const medium = $.let(Text.Root("medium", { fontWeight: Style.FontWeight("medium") }));
        const light = $.let(Text.Root("light", { fontWeight: Style.FontWeight("light") }));

        $(assertEast.equal(normal.unwrap("Text").fontWeight.unwrap("some").hasTag("normal"), true));
        $(assertEast.equal(bold.unwrap("Text").fontWeight.unwrap("some").hasTag("bold"), true));
        $(assertEast.equal(semibold.unwrap("Text").fontWeight.unwrap("some").hasTag("semibold"), true));
        $(assertEast.equal(medium.unwrap("Text").fontWeight.unwrap("some").hasTag("medium"), true));
        $(assertEast.equal(light.unwrap("Text").fontWeight.unwrap("some").hasTag("light"), true));
    });

    // =========================================================================
    // All Text Alignments
    // =========================================================================

    test("supports all text alignments", $ => {
        const left = $.let(Text.Root("left", { textAlign: Style.TextAlign("left") }));
        const center = $.let(Text.Root("center", { textAlign: Style.TextAlign("center") }));
        const right = $.let(Text.Root("right", { textAlign: Style.TextAlign("right") }));
        const justify = $.let(Text.Root("justify", { textAlign: Style.TextAlign("justify") }));

        $(assertEast.equal(left.unwrap("Text").textAlign.unwrap("some").hasTag("left"), true));
        $(assertEast.equal(center.unwrap("Text").textAlign.unwrap("some").hasTag("center"), true));
        $(assertEast.equal(right.unwrap("Text").textAlign.unwrap("some").hasTag("right"), true));
        $(assertEast.equal(justify.unwrap("Text").textAlign.unwrap("some").hasTag("justify"), true));
    });

    // =========================================================================
    // All Text Transforms
    // =========================================================================

    test("supports all text transforms", $ => {
        const uppercase = $.let(Text.Root("a", { textTransform: Style.TextTransform("uppercase") }));
        const lowercase = $.let(Text.Root("A", { textTransform: Style.TextTransform("lowercase") }));
        const capitalize = $.let(Text.Root("hello", { textTransform: Style.TextTransform("capitalize") }));
        const none = $.let(Text.Root("Hello", { textTransform: Style.TextTransform("none") }));

        $(assertEast.equal(uppercase.unwrap("Text").textTransform.unwrap("some").hasTag("uppercase"), true));
        $(assertEast.equal(lowercase.unwrap("Text").textTransform.unwrap("some").hasTag("lowercase"), true));
        $(assertEast.equal(capitalize.unwrap("Text").textTransform.unwrap("some").hasTag("capitalize"), true));
        $(assertEast.equal(none.unwrap("Text").textTransform.unwrap("some").hasTag("none"), true));
    });

    // =========================================================================
    // All Border Widths
    // =========================================================================

    test("supports all border widths", $ => {
        const noBorder = $.let(Text.Root("none", { borderWidth: Style.BorderWidth("none") }));
        const thin = $.let(Text.Root("thin", { borderWidth: Style.BorderWidth("thin") }));
        const medium = $.let(Text.Root("medium", { borderWidth: Style.BorderWidth("medium") }));
        const thick = $.let(Text.Root("thick", { borderWidth: Style.BorderWidth("thick") }));

        $(assertEast.equal(noBorder.unwrap("Text").borderWidth.unwrap("some").hasTag("none"), true));
        $(assertEast.equal(thin.unwrap("Text").borderWidth.unwrap("some").hasTag("thin"), true));
        $(assertEast.equal(medium.unwrap("Text").borderWidth.unwrap("some").hasTag("medium"), true));
        $(assertEast.equal(thick.unwrap("Text").borderWidth.unwrap("some").hasTag("thick"), true));
    });

    // =========================================================================
    // All Border Styles
    // =========================================================================

    test("supports all border styles", $ => {
        const solid = $.let(Text.Root("solid", { borderStyle: Style.BorderStyle("solid") }));
        const dashed = $.let(Text.Root("dashed", { borderStyle: Style.BorderStyle("dashed") }));
        const dotted = $.let(Text.Root("dotted", { borderStyle: Style.BorderStyle("dotted") }));
        const double_ = $.let(Text.Root("double", { borderStyle: Style.BorderStyle("double") }));
        const noBorder = $.let(Text.Root("none", { borderStyle: Style.BorderStyle("none") }));

        $(assertEast.equal(solid.unwrap("Text").borderStyle.unwrap("some").hasTag("solid"), true));
        $(assertEast.equal(dashed.unwrap("Text").borderStyle.unwrap("some").hasTag("dashed"), true));
        $(assertEast.equal(dotted.unwrap("Text").borderStyle.unwrap("some").hasTag("dotted"), true));
        $(assertEast.equal(double_.unwrap("Text").borderStyle.unwrap("some").hasTag("double"), true));
        $(assertEast.equal(noBorder.unwrap("Text").borderStyle.unwrap("some").hasTag("none"), true));
    });

    // =========================================================================
    // Full Border Configuration
    // =========================================================================

    test("creates text with full border configuration", $ => {
        const text = $.let(Text.Root("Bordered", {
            borderWidth: Style.BorderWidth("medium"),
            borderStyle: Style.BorderStyle("solid"),
            borderColor: "gray.300",
        }));

        $(assertEast.equal(text.unwrap("Text").borderWidth.unwrap("some").hasTag("medium"), true));
        $(assertEast.equal(text.unwrap("Text").borderStyle.unwrap("some").hasTag("solid"), true));
        $(assertEast.equal(text.unwrap("Text").borderColor.unwrap("some"), "gray.300"));
    });
});
