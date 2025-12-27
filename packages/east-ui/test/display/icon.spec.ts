/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { Icon } from "../../src/display/icon/index.js";
import { describeEast as describe, assertEast } from "../platforms.spec.js";

describe("Icon", (test) => {
    // =========================================================================
    // Icon.Root - Basic with prefix
    // =========================================================================

    test("creates solid icon with name", $ => {
        const icon = $.let(Icon.Root("fas", "user"));

        $(assertEast.equal(icon.unwrap().unwrap("Icon").prefix, "fas"));
        $(assertEast.equal(icon.unwrap().unwrap("Icon").name, "user"));
        $(assertEast.equal(icon.unwrap().unwrap("Icon").style.hasTag("none"), true));
    });

    test("creates regular icon", $ => {
        const icon = $.let(Icon.Root("far", "heart"));

        $(assertEast.equal(icon.unwrap().unwrap("Icon").prefix, "far"));
        $(assertEast.equal(icon.unwrap().unwrap("Icon").name, "heart"));
    });

    test("creates brands icon", $ => {
        const icon = $.let(Icon.Root("fab", "github"));

        $(assertEast.equal(icon.unwrap().unwrap("Icon").prefix, "fab"));
        $(assertEast.equal(icon.unwrap().unwrap("Icon").name, "github"));
    });

    test("creates folder icon", $ => {
        const icon = $.let(Icon.Root("fas", "folder"));

        $(assertEast.equal(icon.unwrap().unwrap("Icon").name, "folder"));
    });

    test("creates chevron icon", $ => {
        const icon = $.let(Icon.Root("fas", "chevron-right"));

        $(assertEast.equal(icon.unwrap().unwrap("Icon").name, "chevron-right"));
    });

    // =========================================================================
    // Icon.Root - Size
    // =========================================================================

    test("creates icon with xs size", $ => {
        const icon = $.let(Icon.Root("fas", "user", { size: "xs" }));

        $(assertEast.equal(icon.unwrap().unwrap("Icon").style.unwrap("some").size.unwrap("some").hasTag("xs"), true));
    });

    test("creates icon with sm size", $ => {
        const icon = $.let(Icon.Root("fas", "user", { size: "sm" }));

        $(assertEast.equal(icon.unwrap().unwrap("Icon").style.unwrap("some").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates icon with md size", $ => {
        const icon = $.let(Icon.Root("fas", "user", { size: "md" }));

        $(assertEast.equal(icon.unwrap().unwrap("Icon").style.unwrap("some").size.unwrap("some").hasTag("md"), true));
    });

    test("creates icon with lg size", $ => {
        const icon = $.let(Icon.Root("fas", "user", { size: "lg" }));

        $(assertEast.equal(icon.unwrap().unwrap("Icon").style.unwrap("some").size.unwrap("some").hasTag("lg"), true));
    });

    test("creates icon with xl size", $ => {
        const icon = $.let(Icon.Root("fas", "user", { size: "xl" }));

        $(assertEast.equal(icon.unwrap().unwrap("Icon").style.unwrap("some").size.unwrap("some").hasTag("xl"), true));
    });

    test("creates icon with 2xl size", $ => {
        const icon = $.let(Icon.Root("fas", "user", { size: "2xl" }));

        $(assertEast.equal(icon.unwrap().unwrap("Icon").style.unwrap("some").size.unwrap("some").hasTag("2xl"), true));
    });

    // =========================================================================
    // Icon.Root - Color
    // =========================================================================

    test("creates icon with color", $ => {
        const icon = $.let(Icon.Root("fas", "heart", { color: "red.500" }));

        $(assertEast.equal(icon.unwrap().unwrap("Icon").style.unwrap("some").color.unwrap("some"), "red.500"));
    });

    test("creates icon with CSS color", $ => {
        const icon = $.let(Icon.Root("fas", "star", { color: "#FFD700" }));

        $(assertEast.equal(icon.unwrap().unwrap("Icon").style.unwrap("some").color.unwrap("some"), "#FFD700"));
    });

    // =========================================================================
    // Icon.Root - Color Palette
    // =========================================================================

    test("creates icon with blue color palette", $ => {
        const icon = $.let(Icon.Root("fas", "info", { colorPalette: "blue" }));

        $(assertEast.equal(icon.unwrap().unwrap("Icon").style.unwrap("some").colorPalette.unwrap("some").hasTag("blue"), true));
    });

    test("creates icon with red color palette", $ => {
        const icon = $.let(Icon.Root("fas", "circle-exclamation", { colorPalette: "red" }));

        $(assertEast.equal(icon.unwrap().unwrap("Icon").style.unwrap("some").colorPalette.unwrap("some").hasTag("red"), true));
    });

    // =========================================================================
    // Icon.Root - Combined Styles
    // =========================================================================

    test("creates icon with all style properties", $ => {
        const icon = $.let(Icon.Root("fas", "check", {
            size: "lg",
            color: "green.500",
            colorPalette: "green",
        }));

        $(assertEast.equal(icon.unwrap().unwrap("Icon").prefix, "fas"));
        $(assertEast.equal(icon.unwrap().unwrap("Icon").name, "check"));
        $(assertEast.equal(icon.unwrap().unwrap("Icon").style.unwrap("some").size.unwrap("some").hasTag("lg"), true));
        $(assertEast.equal(icon.unwrap().unwrap("Icon").style.unwrap("some").color.unwrap("some"), "green.500"));
        $(assertEast.equal(icon.unwrap().unwrap("Icon").style.unwrap("some").colorPalette.unwrap("some").hasTag("green"), true));
    });

    // =========================================================================
    // Icon.Root - Tree View Use Cases
    // =========================================================================

    test("creates folder-open icon for tree view", $ => {
        const icon = $.let(Icon.Root("far", "folder-open"));

        $(assertEast.equal(icon.unwrap().unwrap("Icon").prefix, "far"));
        $(assertEast.equal(icon.unwrap().unwrap("Icon").name, "folder-open"));
    });

    test("creates file icon for tree view", $ => {
        const icon = $.let(Icon.Root("far", "file", { size: "sm" }));

        $(assertEast.equal(icon.unwrap().unwrap("Icon").prefix, "far"));
        $(assertEast.equal(icon.unwrap().unwrap("Icon").name, "file"));
        $(assertEast.equal(icon.unwrap().unwrap("Icon").style.unwrap("some").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates code file icon for tree view", $ => {
        const icon = $.let(Icon.Root("fas", "file-code", { color: "blue.500" }));

        $(assertEast.equal(icon.unwrap().unwrap("Icon").name, "file-code"));
        $(assertEast.equal(icon.unwrap().unwrap("Icon").style.unwrap("some").color.unwrap("some"), "blue.500"));
    });
});
