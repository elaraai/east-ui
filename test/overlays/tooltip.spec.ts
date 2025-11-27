/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Tooltip, Button, Text } from "../../src/index.js";

describeEast("Tooltip", (test) => {
    // =========================================================================
    // Basic Creation
    // =========================================================================

    test("creates basic tooltip with button trigger", $ => {
        const tooltip = $.let(Tooltip.Root(
            Button.Root("Hover me"),
            "This is a tooltip"
        ));

        $(assertEast.equal(tooltip.getTag(), "Tooltip"));
        $(assertEast.equal(tooltip.unwrap("Tooltip").content, "This is a tooltip"));
        $(assertEast.equal(tooltip.unwrap("Tooltip").trigger.getTag(), "Button"));
    });

    test("creates tooltip with text trigger", $ => {
        const tooltip = $.let(Tooltip.Root(
            Text.Root("Hover for info"),
            "Additional information"
        ));

        $(assertEast.equal(tooltip.unwrap("Tooltip").content, "Additional information"));
        $(assertEast.equal(tooltip.unwrap("Tooltip").trigger.getTag(), "Text"));
    });

    test("creates tooltip with default options", $ => {
        const tooltip = $.let(Tooltip.Root(
            Button.Root("Help"),
            "Help text"
        ));

        $(assertEast.equal(tooltip.unwrap("Tooltip").placement.hasTag("none"), true));
        $(assertEast.equal(tooltip.unwrap("Tooltip").hasArrow.hasTag("none"), true));
    });

    // =========================================================================
    // Placement
    // =========================================================================

    test("creates tooltip with top placement", $ => {
        const tooltip = $.let(Tooltip.Root(
            Button.Root("Hover"),
            "Tooltip above",
            { placement: "top" }
        ));

        $(assertEast.equal(tooltip.unwrap("Tooltip").placement.hasTag("some"), true));
        $(assertEast.equal(tooltip.unwrap("Tooltip").placement.unwrap("some").hasTag("top"), true));
    });

    test("creates tooltip with bottom placement", $ => {
        const tooltip = $.let(Tooltip.Root(
            Button.Root("Hover"),
            "Tooltip below",
            { placement: "bottom" }
        ));

        $(assertEast.equal(tooltip.unwrap("Tooltip").placement.unwrap("some").hasTag("bottom"), true));
    });

    test("creates tooltip with left placement", $ => {
        const tooltip = $.let(Tooltip.Root(
            Button.Root("Hover"),
            "Tooltip left",
            { placement: "left" }
        ));

        $(assertEast.equal(tooltip.unwrap("Tooltip").placement.unwrap("some").hasTag("left"), true));
    });

    test("creates tooltip with right placement", $ => {
        const tooltip = $.let(Tooltip.Root(
            Button.Root("Hover"),
            "Tooltip right",
            { placement: "right" }
        ));

        $(assertEast.equal(tooltip.unwrap("Tooltip").placement.unwrap("some").hasTag("right"), true));
    });

    test("creates tooltip with top_start placement", $ => {
        const tooltip = $.let(Tooltip.Root(
            Button.Root("Hover"),
            "Tooltip top start",
            { placement: "top_start" }
        ));

        $(assertEast.equal(tooltip.unwrap("Tooltip").placement.unwrap("some").hasTag("top_start"), true));
    });

    test("creates tooltip with bottom_end placement", $ => {
        const tooltip = $.let(Tooltip.Root(
            Button.Root("Hover"),
            "Tooltip bottom end",
            { placement: "bottom_end" }
        ));

        $(assertEast.equal(tooltip.unwrap("Tooltip").placement.unwrap("some").hasTag("bottom_end"), true));
    });

    // =========================================================================
    // Arrow
    // =========================================================================

    test("creates tooltip with arrow", $ => {
        const tooltip = $.let(Tooltip.Root(
            Button.Root("Hover"),
            "Tooltip with arrow",
            { hasArrow: true }
        ));

        $(assertEast.equal(tooltip.unwrap("Tooltip").hasArrow.hasTag("some"), true));
        $(assertEast.equal(tooltip.unwrap("Tooltip").hasArrow.unwrap("some"), true));
    });

    test("creates tooltip without arrow", $ => {
        const tooltip = $.let(Tooltip.Root(
            Button.Root("Hover"),
            "Tooltip without arrow",
            { hasArrow: false }
        ));

        $(assertEast.equal(tooltip.unwrap("Tooltip").hasArrow.unwrap("some"), false));
    });

    // =========================================================================
    // Combined Options
    // =========================================================================

    test("creates tooltip with placement and arrow", $ => {
        const tooltip = $.let(Tooltip.Root(
            Button.Root("Save"),
            "Save your changes",
            { placement: "bottom", hasArrow: true }
        ));

        $(assertEast.equal(tooltip.unwrap("Tooltip").placement.unwrap("some").hasTag("bottom"), true));
        $(assertEast.equal(tooltip.unwrap("Tooltip").hasArrow.unwrap("some"), true));
    });

    test("creates tooltip with all options", $ => {
        const tooltip = $.let(Tooltip.Root(
            Button.Root("Delete"),
            "This action cannot be undone",
            { placement: "top", hasArrow: true }
        ));

        $(assertEast.equal(tooltip.unwrap("Tooltip").content, "This action cannot be undone"));
        $(assertEast.equal(tooltip.unwrap("Tooltip").placement.unwrap("some").hasTag("top"), true));
        $(assertEast.equal(tooltip.unwrap("Tooltip").hasArrow.unwrap("some"), true));
    });

    // =========================================================================
    // Practical Examples
    // =========================================================================

    test("creates help tooltip on form field", $ => {
        const tooltip = $.let(Tooltip.Root(
            Text.Root("?"),
            "Enter your full legal name as it appears on your ID",
            { placement: "right", hasArrow: true }
        ));

        $(assertEast.equal(tooltip.unwrap("Tooltip").trigger.unwrap("Text").value, "?"));
        $(assertEast.equal(tooltip.unwrap("Tooltip").placement.unwrap("some").hasTag("right"), true));
    });

    test("creates action button tooltip", $ => {
        const tooltip = $.let(Tooltip.Root(
            Button.Root("Submit"),
            "Submit your application for review",
            { placement: "top" }
        ));

        $(assertEast.equal(tooltip.unwrap("Tooltip").trigger.unwrap("Button").label, "Submit"));
    });

    test("creates info tooltip", $ => {
        const tooltip = $.let(Tooltip.Root(
            Text.Root("Terms & Conditions"),
            "Click to read our full terms and conditions",
            { placement: "bottom_start" }
        ));

        $(assertEast.equal(tooltip.unwrap("Tooltip").placement.unwrap("some").hasTag("bottom_start"), true));
    });
});
