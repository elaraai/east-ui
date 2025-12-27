/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Flex, Text, Style } from "../../src/index.js";

describeEast("Flex", (test) => {
    // =========================================================================
    // Basic Creation
    // =========================================================================

    test("creates flex with empty children", $ => {
        const flex = $.let(Flex.Root([]));

        $(assertEast.equal(flex.unwrap().unwrap("Flex").children.size(), 0n));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.hasTag("none"), true));
    });

    test("creates flex with single text child", $ => {
        const textChild = Text.Root("Hello");
        const flex = $.let(Flex.Root([textChild]));

        $(assertEast.equal(flex.unwrap().unwrap("Flex").children.size(), 1n));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.hasTag("none"), true));
    });

    test("creates flex with multiple text children", $ => {
        const child1 = Text.Root("First");
        const child2 = Text.Root("Second");
        const flex = $.let(Flex.Root([
            child1,
            child2,
        ]));

        $(assertEast.equal(flex.unwrap().unwrap("Flex").children.size(), 2n));
    });

    // =========================================================================
    // Style Properties - Individual
    // =========================================================================

    test("creates flex with direction style", $ => {
        const flex = $.let(Flex.Root([], {
            direction: Style.FlexDirection("column"),
        }));

        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.hasTag("some"), true));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").direction.hasTag("some"), true));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").direction.unwrap("some").hasTag("column"), true));
    });

    test("creates flex with direction string literal", $ => {
        const flex = $.let(Flex.Root([], {
            direction: "row",
        }));

        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").direction.hasTag("some"), true));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").direction.unwrap("some").hasTag("row"), true));
    });

    test("creates flex with wrap style", $ => {
        const flex = $.let(Flex.Root([], {
            wrap: Style.FlexWrap("wrap"),
        }));

        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").wrap.hasTag("some"), true));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").wrap.unwrap("some").hasTag("wrap"), true));
    });

    test("creates flex with wrap string literal", $ => {
        const flex = $.let(Flex.Root([], {
            wrap: "nowrap",
        }));

        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").wrap.hasTag("some"), true));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").wrap.unwrap("some").hasTag("nowrap"), true));
    });

    test("creates flex with justifyContent", $ => {
        const flex = $.let(Flex.Root([], {
            justifyContent: Style.JustifyContent("center"),
        }));

        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").justifyContent.hasTag("some"), true));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").justifyContent.unwrap("some").hasTag("center"), true));
    });

    test("creates flex with justifyContent string literal", $ => {
        const flex = $.let(Flex.Root([], {
            justifyContent: "space-between",
        }));

        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").justifyContent.hasTag("some"), true));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").justifyContent.unwrap("some").hasTag("space-between"), true));
    });

    test("creates flex with alignItems", $ => {
        const flex = $.let(Flex.Root([], {
            alignItems: Style.AlignItems("center"),
        }));

        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").alignItems.hasTag("some"), true));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").alignItems.unwrap("some").hasTag("center"), true));
    });

    test("creates flex with alignItems string literal", $ => {
        const flex = $.let(Flex.Root([], {
            alignItems: "flex-start",
        }));

        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").alignItems.hasTag("some"), true));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").alignItems.unwrap("some").hasTag("flex-start"), true));
    });

    test("creates flex with gap", $ => {
        const flex = $.let(Flex.Root([], {
            gap: "4",
        }));

        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").gap.hasTag("some"), true));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").gap.unwrap("some"), "4"));
    });

    test("creates flex with width", $ => {
        const flex = $.let(Flex.Root([], {
            width: "100%",
        }));

        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").width.hasTag("some"), true));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").width.unwrap("some"), "100%"));
    });

    test("creates flex with height", $ => {
        const flex = $.let(Flex.Root([], {
            height: "200px",
        }));

        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").height.hasTag("some"), true));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").height.unwrap("some"), "200px"));
    });

    test("creates flex with padding", $ => {
        const flex = $.let(Flex.Root([], {
            padding: Flex.Padding({ top: "4", right: "4", bottom: "4", left: "4" }),
        }));

        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").padding.hasTag("some"), true));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").padding.unwrap("some").top.unwrap("some"), "4"));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").padding.unwrap("some").right.unwrap("some"), "4"));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").padding.unwrap("some").bottom.unwrap("some"), "4"));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").padding.unwrap("some").left.unwrap("some"), "4"));
    });

    test("creates flex with margin", $ => {
        const flex = $.let(Flex.Root([], {
            margin: Flex.Margin({ top: "2", right: "2", bottom: "2", left: "2" }),
        }));

        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").margin.hasTag("some"), true));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").margin.unwrap("some").top.unwrap("some"), "2"));
    });

    test("creates flex with background", $ => {
        const flex = $.let(Flex.Root([], {
            background: "gray.100",
        }));

        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").background.hasTag("some"), true));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").background.unwrap("some"), "gray.100"));
    });

    test("creates flex with color", $ => {
        const flex = $.let(Flex.Root([], {
            color: "blue.500",
        }));

        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").color.hasTag("some"), true));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").color.unwrap("some"), "blue.500"));
    });

    test("creates flex with borderRadius", $ => {
        const flex = $.let(Flex.Root([], {
            borderRadius: "md",
        }));

        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").borderRadius.hasTag("some"), true));
        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.unwrap("some").borderRadius.unwrap("some"), "md"));
    });

    // =========================================================================
    // No Style - Defaults to None
    // =========================================================================

    test("creates flex with no style - style option is none", $ => {
        const flex = $.let(Flex.Root([]));

        $(assertEast.equal(flex.unwrap().unwrap("Flex").style.hasTag("none"), true));
    });

    // =========================================================================
    // Multiple Style Properties
    // =========================================================================

    test("creates flex with multiple styles", $ => {
        const flex = $.let(Flex.Root([], {
            direction: "row",
            wrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "4",
            padding: Flex.Padding({ top: "4", right: "4", bottom: "4", left: "4" }),
            background: "gray.100",
            borderRadius: "md",
        }));

        const style = flex.unwrap().unwrap("Flex").style.unwrap("some");
        $(assertEast.equal(style.direction.unwrap("some").hasTag("row"), true));
        $(assertEast.equal(style.wrap.unwrap("some").hasTag("wrap"), true));
        $(assertEast.equal(style.justifyContent.unwrap("some").hasTag("center"), true));
        $(assertEast.equal(style.alignItems.unwrap("some").hasTag("center"), true));
        $(assertEast.equal(style.gap.unwrap("some"), "4"));
        $(assertEast.equal(style.padding.unwrap("some").top.unwrap("some"), "4"));
        $(assertEast.equal(style.background.unwrap("some"), "gray.100"));
        $(assertEast.equal(style.borderRadius.unwrap("some"), "md"));
        // Other styles should be none
        $(assertEast.equal(style.width.hasTag("none"), true));
        $(assertEast.equal(style.height.hasTag("none"), true));
        $(assertEast.equal(style.margin.hasTag("none"), true));
        $(assertEast.equal(style.color.hasTag("none"), true));
    });

    // =========================================================================
    // All Flex Directions
    // =========================================================================

    test("supports all flex directions", $ => {
        const row = $.let(Flex.Root([], { direction: "row" }));
        const column = $.let(Flex.Root([], { direction: "column" }));
        const rowReverse = $.let(Flex.Root([], { direction: "row-reverse" }));
        const columnReverse = $.let(Flex.Root([], { direction: "column-reverse" }));

        $(assertEast.equal(row.unwrap().unwrap("Flex").style.unwrap("some").direction.unwrap("some").hasTag("row"), true));
        $(assertEast.equal(column.unwrap().unwrap("Flex").style.unwrap("some").direction.unwrap("some").hasTag("column"), true));
        $(assertEast.equal(rowReverse.unwrap().unwrap("Flex").style.unwrap("some").direction.unwrap("some").hasTag("row-reverse"), true));
        $(assertEast.equal(columnReverse.unwrap().unwrap("Flex").style.unwrap("some").direction.unwrap("some").hasTag("column-reverse"), true));
    });

    // =========================================================================
    // All Flex Wrap Options
    // =========================================================================

    test("supports all flex wrap options", $ => {
        const nowrap = $.let(Flex.Root([], { wrap: "nowrap" }));
        const wrap = $.let(Flex.Root([], { wrap: "wrap" }));
        const wrapReverse = $.let(Flex.Root([], { wrap: "wrap-reverse" }));

        $(assertEast.equal(nowrap.unwrap().unwrap("Flex").style.unwrap("some").wrap.unwrap("some").hasTag("nowrap"), true));
        $(assertEast.equal(wrap.unwrap().unwrap("Flex").style.unwrap("some").wrap.unwrap("some").hasTag("wrap"), true));
        $(assertEast.equal(wrapReverse.unwrap().unwrap("Flex").style.unwrap("some").wrap.unwrap("some").hasTag("wrap-reverse"), true));
    });

    // =========================================================================
    // All Justify Content Options
    // =========================================================================

    test("supports all justify content options", $ => {
        const flexStart = $.let(Flex.Root([], { justifyContent: "flex-start" }));
        const flexEnd = $.let(Flex.Root([], { justifyContent: "flex-end" }));
        const center = $.let(Flex.Root([], { justifyContent: "center" }));
        const spaceBetween = $.let(Flex.Root([], { justifyContent: "space-between" }));
        const spaceAround = $.let(Flex.Root([], { justifyContent: "space-around" }));
        const spaceEvenly = $.let(Flex.Root([], { justifyContent: "space-evenly" }));

        $(assertEast.equal(flexStart.unwrap().unwrap("Flex").style.unwrap("some").justifyContent.unwrap("some").hasTag("flex-start"), true));
        $(assertEast.equal(flexEnd.unwrap().unwrap("Flex").style.unwrap("some").justifyContent.unwrap("some").hasTag("flex-end"), true));
        $(assertEast.equal(center.unwrap().unwrap("Flex").style.unwrap("some").justifyContent.unwrap("some").hasTag("center"), true));
        $(assertEast.equal(spaceBetween.unwrap().unwrap("Flex").style.unwrap("some").justifyContent.unwrap("some").hasTag("space-between"), true));
        $(assertEast.equal(spaceAround.unwrap().unwrap("Flex").style.unwrap("some").justifyContent.unwrap("some").hasTag("space-around"), true));
        $(assertEast.equal(spaceEvenly.unwrap().unwrap("Flex").style.unwrap("some").justifyContent.unwrap("some").hasTag("space-evenly"), true));
    });

    // =========================================================================
    // All Align Items Options
    // =========================================================================

    test("supports all align items options", $ => {
        const flexStart = $.let(Flex.Root([], { alignItems: "flex-start" }));
        const flexEnd = $.let(Flex.Root([], { alignItems: "flex-end" }));
        const center = $.let(Flex.Root([], { alignItems: "center" }));
        const baseline = $.let(Flex.Root([], { alignItems: "baseline" }));
        const stretch = $.let(Flex.Root([], { alignItems: "stretch" }));

        $(assertEast.equal(flexStart.unwrap().unwrap("Flex").style.unwrap("some").alignItems.unwrap("some").hasTag("flex-start"), true));
        $(assertEast.equal(flexEnd.unwrap().unwrap("Flex").style.unwrap("some").alignItems.unwrap("some").hasTag("flex-end"), true));
        $(assertEast.equal(center.unwrap().unwrap("Flex").style.unwrap("some").alignItems.unwrap("some").hasTag("center"), true));
        $(assertEast.equal(baseline.unwrap().unwrap("Flex").style.unwrap("some").alignItems.unwrap("some").hasTag("baseline"), true));
        $(assertEast.equal(stretch.unwrap().unwrap("Flex").style.unwrap("some").alignItems.unwrap("some").hasTag("stretch"), true));
    });

    // =========================================================================
    // Typical Flex Container Configuration
    // =========================================================================

    test("creates typical flex container", $ => {
        const child1 = Text.Root("Item 1");
        const child2 = Text.Root("Item 2");
        const flexContainer = $.let(Flex.Root([
            child1,
            child2,
        ], {
            direction: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "4",
        }));

        $(assertEast.equal(flexContainer.unwrap().unwrap("Flex").children.size(), 2n));
        const style = flexContainer.unwrap().unwrap("Flex").style.unwrap("some");
        $(assertEast.equal(style.direction.unwrap("some").hasTag("row"), true));
        $(assertEast.equal(style.justifyContent.unwrap("some").hasTag("space-between"), true));
        $(assertEast.equal(style.alignItems.unwrap("some").hasTag("center"), true));
        $(assertEast.equal(style.gap.unwrap("some"), "4"));
    });

    // =========================================================================
    // Nested Flex
    // =========================================================================

    test("creates nested flex containers", $ => {
        const innerFlex = Flex.Root([
            Text.Root("Inner"),
        ], {
            direction: "column",
            padding: Flex.Padding({ top: "2", right: "2", bottom: "2", left: "2" }),
            background: "blue.100",
        });

        const outerFlex = $.let(Flex.Root([
            innerFlex,
        ], {
            direction: "row",
            padding: Flex.Padding({ top: "4", right: "4", bottom: "4", left: "4" }),
            background: "gray.100",
        }));

        $(assertEast.equal(outerFlex.unwrap().unwrap("Flex").children.size(), 1n));
        $(assertEast.equal(outerFlex.unwrap().unwrap("Flex").style.unwrap("some").padding.unwrap("some").top.unwrap("some"), "4"));
        $(assertEast.equal(outerFlex.unwrap().unwrap("Flex").style.unwrap("some").background.unwrap("some"), "gray.100"));
    });
});
