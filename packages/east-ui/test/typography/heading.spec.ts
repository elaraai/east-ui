/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Heading, Style } from "../../src/index.js";

describeEast("Heading", (test) => {
    // =========================================================================
    // Basic Creation
    // =========================================================================

    test("creates heading with string value", $ => {
        const heading = $.let(Heading.Root("Hello World"));

        $(assertEast.equal(heading.unwrap("Heading").value, "Hello World"));
    });

    test("creates heading with no style - all options are none", $ => {
        const heading = $.let(Heading.Root("Title"));

        $(assertEast.equal(heading.unwrap("Heading").value, "Title"));
        $(assertEast.equal(heading.unwrap("Heading").size.hasTag("none"), true));
        $(assertEast.equal(heading.unwrap("Heading").as.hasTag("none"), true));
        $(assertEast.equal(heading.unwrap("Heading").color.hasTag("none"), true));
        $(assertEast.equal(heading.unwrap("Heading").textAlign.hasTag("none"), true));
    });

    // =========================================================================
    // Size - Standard
    // =========================================================================

    test("creates extra small heading", $ => {
        const heading = $.let(Heading.Root("XS", { size: "xs" }));

        $(assertEast.equal(heading.unwrap("Heading").size.hasTag("some"), true));
        $(assertEast.equal(heading.unwrap("Heading").size.unwrap("some").hasTag("xs"), true));
    });

    test("creates small heading", $ => {
        const heading = $.let(Heading.Root("SM", { size: "sm" }));

        $(assertEast.equal(heading.unwrap("Heading").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates medium heading", $ => {
        const heading = $.let(Heading.Root("MD", { size: "md" }));

        $(assertEast.equal(heading.unwrap("Heading").size.unwrap("some").hasTag("md"), true));
    });

    test("creates large heading", $ => {
        const heading = $.let(Heading.Root("LG", { size: "lg" }));

        $(assertEast.equal(heading.unwrap("Heading").size.unwrap("some").hasTag("lg"), true));
    });

    test("creates extra large heading", $ => {
        const heading = $.let(Heading.Root("XL", { size: "xl" }));

        $(assertEast.equal(heading.unwrap("Heading").size.unwrap("some").hasTag("xl"), true));
    });

    // =========================================================================
    // Size - Extended (Typography-specific)
    // =========================================================================

    test("creates 2xl heading", $ => {
        const heading = $.let(Heading.Root("2XL", { size: "2xl" }));

        $(assertEast.equal(heading.unwrap("Heading").size.unwrap("some").hasTag("2xl"), true));
    });

    test("creates 3xl heading", $ => {
        const heading = $.let(Heading.Root("3XL", { size: "3xl" }));

        $(assertEast.equal(heading.unwrap("Heading").size.unwrap("some").hasTag("3xl"), true));
    });

    test("creates 4xl heading", $ => {
        const heading = $.let(Heading.Root("4XL", { size: "4xl" }));

        $(assertEast.equal(heading.unwrap("Heading").size.unwrap("some").hasTag("4xl"), true));
    });

    test("creates 5xl heading", $ => {
        const heading = $.let(Heading.Root("5XL", { size: "5xl" }));

        $(assertEast.equal(heading.unwrap("Heading").size.unwrap("some").hasTag("5xl"), true));
    });

    test("creates 6xl heading", $ => {
        const heading = $.let(Heading.Root("6XL", { size: "6xl" }));

        $(assertEast.equal(heading.unwrap("Heading").size.unwrap("some").hasTag("6xl"), true));
    });

    // =========================================================================
    // Semantic Level (as)
    // =========================================================================

    test("creates h1 heading", $ => {
        const heading = $.let(Heading.Root("Main Title", { as: "h1" }));

        $(assertEast.equal(heading.unwrap("Heading").as.hasTag("some"), true));
        $(assertEast.equal(heading.unwrap("Heading").as.unwrap("some").hasTag("h1"), true));
    });

    test("creates h2 heading", $ => {
        const heading = $.let(Heading.Root("Section", { as: "h2" }));

        $(assertEast.equal(heading.unwrap("Heading").as.unwrap("some").hasTag("h2"), true));
    });

    test("creates h3 heading", $ => {
        const heading = $.let(Heading.Root("Subsection", { as: "h3" }));

        $(assertEast.equal(heading.unwrap("Heading").as.unwrap("some").hasTag("h3"), true));
    });

    test("creates h4 heading", $ => {
        const heading = $.let(Heading.Root("Minor", { as: "h4" }));

        $(assertEast.equal(heading.unwrap("Heading").as.unwrap("some").hasTag("h4"), true));
    });

    test("creates h5 heading", $ => {
        const heading = $.let(Heading.Root("Small", { as: "h5" }));

        $(assertEast.equal(heading.unwrap("Heading").as.unwrap("some").hasTag("h5"), true));
    });

    test("creates h6 heading", $ => {
        const heading = $.let(Heading.Root("Smallest", { as: "h6" }));

        $(assertEast.equal(heading.unwrap("Heading").as.unwrap("some").hasTag("h6"), true));
    });

    // =========================================================================
    // Color
    // =========================================================================

    test("creates heading with color", $ => {
        const heading = $.let(Heading.Root("Colored", {
            color: "blue.500",
        }));

        $(assertEast.equal(heading.unwrap("Heading").color.hasTag("some"), true));
        $(assertEast.equal(heading.unwrap("Heading").color.unwrap("some"), "blue.500"));
    });

    // =========================================================================
    // Text Alignment
    // =========================================================================

    test("creates left aligned heading", $ => {
        const heading = $.let(Heading.Root("Left", {
            textAlign: Style.TextAlign("left"),
        }));

        $(assertEast.equal(heading.unwrap("Heading").textAlign.hasTag("some"), true));
        $(assertEast.equal(heading.unwrap("Heading").textAlign.unwrap("some").hasTag("left"), true));
    });

    test("creates center aligned heading", $ => {
        const heading = $.let(Heading.Root("Center", {
            textAlign: Style.TextAlign("center"),
        }));

        $(assertEast.equal(heading.unwrap("Heading").textAlign.unwrap("some").hasTag("center"), true));
    });

    test("creates right aligned heading", $ => {
        const heading = $.let(Heading.Root("Right", {
            textAlign: Style.TextAlign("right"),
        }));

        $(assertEast.equal(heading.unwrap("Heading").textAlign.unwrap("some").hasTag("right"), true));
    });

    // =========================================================================
    // Combined Options
    // =========================================================================

    test("creates heading with all options", $ => {
        const heading = $.let(Heading.Root("Page Title", {
            size: "4xl",
            as: "h1",
            color: "gray.900",
            textAlign: Style.TextAlign("center"),
        }));

        $(assertEast.equal(heading.unwrap("Heading").value, "Page Title"));
        $(assertEast.equal(heading.unwrap("Heading").size.unwrap("some").hasTag("4xl"), true));
        $(assertEast.equal(heading.unwrap("Heading").as.unwrap("some").hasTag("h1"), true));
        $(assertEast.equal(heading.unwrap("Heading").color.unwrap("some"), "gray.900"));
        $(assertEast.equal(heading.unwrap("Heading").textAlign.unwrap("some").hasTag("center"), true));
    });

    test("creates section heading", $ => {
        const heading = $.let(Heading.Root("Features", {
            size: "2xl",
            as: "h2",
        }));

        $(assertEast.equal(heading.unwrap("Heading").value, "Features"));
        $(assertEast.equal(heading.unwrap("Heading").size.unwrap("some").hasTag("2xl"), true));
        $(assertEast.equal(heading.unwrap("Heading").as.unwrap("some").hasTag("h2"), true));
    });
});
