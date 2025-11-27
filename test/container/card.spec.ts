/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Card, Text, Style } from "../../src/index.js";

describeEast("Card", (test) => {
    // =========================================================================
    // Basic Creation
    // =========================================================================

    test("creates empty card", $ => {
        const card = $.let(Card.Root([]));

        $(assertEast.equal(card.unwrap("Card").title.hasTag("none"), true));
        $(assertEast.equal(card.unwrap("Card").description.hasTag("none"), true));
        $(assertEast.equal(card.unwrap("Card").style.hasTag("none"), true));
    });

    test("creates card with text child", $ => {
        const card = $.let(Card.Root([
            Text.Root("Card content here"),
        ]));

        // body is an array of components
        $(assertEast.equal(card.unwrap("Card").title.hasTag("none"), true));
    });

    test("creates card with title", $ => {
        const card = $.let(Card.Root([], {
            title: "Card Title",
        }));

        $(assertEast.equal(card.unwrap("Card").title.hasTag("some"), true));
        $(assertEast.equal(card.unwrap("Card").title.unwrap("some"), "Card Title"));
    });

    test("creates card with title and description", $ => {
        const card = $.let(Card.Root([], {
            title: "Product Name",
            description: "Product description here",
        }));

        $(assertEast.equal(card.unwrap("Card").title.unwrap("some"), "Product Name"));
        $(assertEast.equal(card.unwrap("Card").description.unwrap("some"), "Product description here"));
    });

    // =========================================================================
    // Variant
    // =========================================================================

    test("creates elevated card", $ => {
        const card = $.let(Card.Root([], {
            variant: "elevated",
        }));

        $(assertEast.equal(card.unwrap("Card").style.hasTag("some"), true));
        $(assertEast.equal(card.unwrap("Card").style.unwrap("some").variant.hasTag("some"), true));
        $(assertEast.equal(card.unwrap("Card").style.unwrap("some").variant.unwrap("some").hasTag("elevated"), true));
    });

    test("creates outline card", $ => {
        const card = $.let(Card.Root([], {
            variant: "outline",
        }));

        $(assertEast.equal(card.unwrap("Card").style.unwrap("some").variant.unwrap("some").hasTag("outline"), true));
    });

    test("creates subtle card", $ => {
        const card = $.let(Card.Root([], {
            variant: "subtle",
        }));

        $(assertEast.equal(card.unwrap("Card").style.unwrap("some").variant.unwrap("some").hasTag("subtle"), true));
    });

    test("creates card with CardVariant helper", $ => {
        const card = $.let(Card.Root([], {
            variant: Card.Variant("elevated"),
        }));

        $(assertEast.equal(card.unwrap("Card").style.unwrap("some").variant.unwrap("some").hasTag("elevated"), true));
    });

    // =========================================================================
    // Size
    // =========================================================================

    test("creates small card", $ => {
        const card = $.let(Card.Root([], {
            size: "sm",
        }));

        $(assertEast.equal(card.unwrap("Card").style.hasTag("some"), true));
        $(assertEast.equal(card.unwrap("Card").style.unwrap("some").size.hasTag("some"), true));
        $(assertEast.equal(card.unwrap("Card").style.unwrap("some").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates medium card", $ => {
        const card = $.let(Card.Root([], {
            size: "md",
        }));

        $(assertEast.equal(card.unwrap("Card").style.unwrap("some").size.unwrap("some").hasTag("md"), true));
    });

    test("creates large card", $ => {
        const card = $.let(Card.Root([], {
            size: "lg",
        }));

        $(assertEast.equal(card.unwrap("Card").style.unwrap("some").size.unwrap("some").hasTag("lg"), true));
    });

    test("creates card with Style.Size helper", $ => {
        const card = $.let(Card.Root([], {
            size: Style.Size("md"),
        }));

        $(assertEast.equal(card.unwrap("Card").style.unwrap("some").size.unwrap("some").hasTag("md"), true));
    });

    // =========================================================================
    // Combined Options
    // =========================================================================

    test("creates card with all options", $ => {
        const card = $.let(Card.Root([
            Text.Root("Main content goes here"),
        ], {
            title: "Full Card",
            description: "Card with all options",
            variant: "elevated",
            size: "md",
        }));

        $(assertEast.equal(card.unwrap("Card").title.unwrap("some"), "Full Card"));
        $(assertEast.equal(card.unwrap("Card").description.unwrap("some"), "Card with all options"));
        $(assertEast.equal(card.unwrap("Card").style.unwrap("some").variant.unwrap("some").hasTag("elevated"), true));
        $(assertEast.equal(card.unwrap("Card").style.unwrap("some").size.unwrap("some").hasTag("md"), true));
    });

    test("creates product card", $ => {
        const card = $.let(Card.Root([
            Text.Root("$99.99"),
        ], {
            title: "Product Name",
            description: "Product category",
            variant: "outline",
        }));

        $(assertEast.equal(card.unwrap("Card").title.unwrap("some"), "Product Name"));
        $(assertEast.equal(card.unwrap("Card").style.unwrap("some").variant.unwrap("some").hasTag("outline"), true));
    });

    test("creates user profile card", $ => {
        const card = $.let(Card.Root([
            Text.Root("San Francisco, CA"),
        ], {
            title: "John Doe",
            description: "Software Engineer",
            variant: "elevated",
            size: "sm",
        }));

        $(assertEast.equal(card.unwrap("Card").title.unwrap("some"), "John Doe"));
        $(assertEast.equal(card.unwrap("Card").style.unwrap("some").variant.unwrap("some").hasTag("elevated"), true));
    });

    test("creates info card", $ => {
        const card = $.let(Card.Root([
            Text.Root("Important details displayed here in the card body."),
        ], {
            title: "Information",
            variant: "subtle",
        }));

        $(assertEast.equal(card.unwrap("Card").title.unwrap("some"), "Information"));
        $(assertEast.equal(card.unwrap("Card").style.unwrap("some").variant.unwrap("some").hasTag("subtle"), true));
    });

    test("creates card with nested components", $ => {
        const card = $.let(Card.Root([
            Text.Root("First line"),
            Text.Root("Second line"),
        ], {
            title: "Multi-content Card",
        }));

        $(assertEast.equal(card.unwrap("Card").title.unwrap("some"), "Multi-content Card"));
    });
});
