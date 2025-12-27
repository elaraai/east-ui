/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Link } from "../../src/index.js";

describeEast("Link", (test) => {
    // =========================================================================
    // Basic Creation
    // =========================================================================

    test("creates link with value and href", $ => {
        const link = $.let(Link.Root("Click here", "https://example.com"));

        $(assertEast.equal(link.unwrap().unwrap("Link").value, "Click here"));
        $(assertEast.equal(link.unwrap().unwrap("Link").href, "https://example.com"));
    });

    test("creates link with no style - all options are none", $ => {
        const link = $.let(Link.Root("Link", "/about"));

        $(assertEast.equal(link.unwrap().unwrap("Link").value, "Link"));
        $(assertEast.equal(link.unwrap().unwrap("Link").href, "/about"));
        $(assertEast.equal(link.unwrap().unwrap("Link").external.hasTag("none"), true));
        $(assertEast.equal(link.unwrap().unwrap("Link").variant.hasTag("none"), true));
        $(assertEast.equal(link.unwrap().unwrap("Link").colorPalette.hasTag("none"), true));
    });

    // =========================================================================
    // External
    // =========================================================================

    test("creates external link", $ => {
        const link = $.let(Link.Root("External", "https://google.com", {
            external: true,
        }));

        $(assertEast.equal(link.unwrap().unwrap("Link").external.hasTag("some"), true));
        $(assertEast.equal(link.unwrap().unwrap("Link").external.unwrap("some"), true));
    });

    test("creates non-external link", $ => {
        const link = $.let(Link.Root("Internal", "/home", {
            external: false,
        }));

        $(assertEast.equal(link.unwrap().unwrap("Link").external.unwrap("some"), false));
    });

    // =========================================================================
    // Variants
    // =========================================================================

    test("creates underline variant link", $ => {
        const link = $.let(Link.Root("Underlined", "/page", {
            variant: "underline",
        }));

        $(assertEast.equal(link.unwrap().unwrap("Link").variant.hasTag("some"), true));
        $(assertEast.equal(link.unwrap().unwrap("Link").variant.unwrap("some").hasTag("underline"), true));
    });

    test("creates plain variant link", $ => {
        const link = $.let(Link.Root("Plain", "/page", {
            variant: "plain",
        }));

        $(assertEast.equal(link.unwrap().unwrap("Link").variant.unwrap("some").hasTag("plain"), true));
    });

    // =========================================================================
    // Color Palette
    // =========================================================================

    test("creates link with colorPalette", $ => {
        const link = $.let(Link.Root("Colored", "/page", {
            colorPalette: "blue",
        }));

        $(assertEast.equal(link.unwrap().unwrap("Link").colorPalette.hasTag("some"), true));
        $(assertEast.equal(link.unwrap().unwrap("Link").colorPalette.unwrap("some"), "blue"));
    });

    test("creates link with teal colorPalette", $ => {
        const link = $.let(Link.Root("Teal", "/page", {
            colorPalette: "teal",
        }));

        $(assertEast.equal(link.unwrap().unwrap("Link").colorPalette.unwrap("some"), "teal"));
    });

    // =========================================================================
    // Combined Options
    // =========================================================================

    test("creates link with all options", $ => {
        const link = $.let(Link.Root("Documentation", "https://docs.example.com", {
            external: true,
            variant: "underline",
            colorPalette: "blue",
        }));

        $(assertEast.equal(link.unwrap().unwrap("Link").value, "Documentation"));
        $(assertEast.equal(link.unwrap().unwrap("Link").href, "https://docs.example.com"));
        $(assertEast.equal(link.unwrap().unwrap("Link").external.unwrap("some"), true));
        $(assertEast.equal(link.unwrap().unwrap("Link").variant.unwrap("some").hasTag("underline"), true));
        $(assertEast.equal(link.unwrap().unwrap("Link").colorPalette.unwrap("some"), "blue"));
    });

    test("creates navigation link", $ => {
        const link = $.let(Link.Root("Home", "/", {
            variant: "plain",
        }));

        $(assertEast.equal(link.unwrap().unwrap("Link").value, "Home"));
        $(assertEast.equal(link.unwrap().unwrap("Link").href, "/"));
        $(assertEast.equal(link.unwrap().unwrap("Link").variant.unwrap("some").hasTag("plain"), true));
    });

    test("creates social link", $ => {
        const link = $.let(Link.Root("GitHub", "https://github.com", {
            external: true,
            colorPalette: "gray",
        }));

        $(assertEast.equal(link.unwrap().unwrap("Link").value, "GitHub"));
        $(assertEast.equal(link.unwrap().unwrap("Link").external.unwrap("some"), true));
    });
});
