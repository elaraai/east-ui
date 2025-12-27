/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Box, Text, Style } from "../../src/index.js";

describeEast("Box", (test) => {
    // =========================================================================
    // Basic Creation
    // =========================================================================

    test("creates box with empty children", $ => {
        const box = $.let(Box.Root([]));

        $(assertEast.equal(box.unwrap().unwrap("Box").children.size(), 0n));
        $(assertEast.equal(box.unwrap().unwrap("Box").style.hasTag("none"), true));
    });

    test("creates box with single text child", $ => {
        const textChild = Text.Root("Hello");
        const box = $.let(Box.Root([textChild]));

        $(assertEast.equal(box.unwrap().unwrap("Box").children.size(), 1n));
        $(assertEast.equal(box.unwrap().unwrap("Box").style.hasTag("none"), true));
    });

    test("creates box with multiple text children", $ => {
        const child1 = Text.Root("First");
        const child2 = Text.Root("Second");
        const box = $.let(Box.Root([
            child1,
            child2,
        ]));

        $(assertEast.equal(box.unwrap().unwrap("Box").children.size(), 2n));
    });

    // =========================================================================
    // Style Properties - Individual
    // =========================================================================

    test("creates box with display style", $ => {
        const box = $.let(Box.Root([], {
            display: Style.Display("flex"),
        }));

        $(assertEast.equal(box.unwrap().unwrap("Box").style.hasTag("some"), true));
        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").display.hasTag("some"), true));
        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").display.unwrap("some").hasTag("flex"), true));
    });

    test("creates box with width", $ => {
        const box = $.let(Box.Root([], {
            width: "100%",
        }));

        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").width.hasTag("some"), true));
        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").width.unwrap("some"), "100%"));
    });

    test("creates box with height", $ => {
        const box = $.let(Box.Root([], {
            height: "200px",
        }));

        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").height.hasTag("some"), true));
        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").height.unwrap("some"), "200px"));
    });

    test("creates box with padding", $ => {
        const box = $.let(Box.Root([], {
            padding: Box.Padding({ top: "4", right: "4", bottom: "4", left: "4" }),
        }));

        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").padding.hasTag("some"), true));
        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").padding.unwrap("some").top.unwrap("some"), "4"));
        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").padding.unwrap("some").right.unwrap("some"), "4"));
        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").padding.unwrap("some").bottom.unwrap("some"), "4"));
        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").padding.unwrap("some").left.unwrap("some"), "4"));
    });

    test("creates box with margin", $ => {
        const box = $.let(Box.Root([], {
            margin: Box.Margin({ top: "2", right: "2", bottom: "2", left: "2" }),
        }));

        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").margin.hasTag("some"), true));
        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").margin.unwrap("some").top.unwrap("some"), "2"));
    });

    test("creates box with background", $ => {
        const box = $.let(Box.Root([], {
            background: "gray.100",
        }));

        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").background.hasTag("some"), true));
        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").background.unwrap("some"), "gray.100"));
    });

    test("creates box with color", $ => {
        const box = $.let(Box.Root([], {
            color: "blue.500",
        }));

        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").color.hasTag("some"), true));
        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").color.unwrap("some"), "blue.500"));
    });

    test("creates box with borderRadius", $ => {
        const box = $.let(Box.Root([], {
            borderRadius: "md",
        }));

        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").borderRadius.hasTag("some"), true));
        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").borderRadius.unwrap("some"), "md"));
    });

    test("creates box with flexDirection", $ => {
        const box = $.let(Box.Root([], {
            flexDirection: Style.FlexDirection("column"),
        }));

        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").flexDirection.hasTag("some"), true));
        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").flexDirection.unwrap("some").hasTag("column"), true));
    });

    test("creates box with justifyContent", $ => {
        const box = $.let(Box.Root([], {
            justifyContent: Style.JustifyContent("center"),
        }));

        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").justifyContent.hasTag("some"), true));
        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").justifyContent.unwrap("some").hasTag("center"), true));
    });

    test("creates box with alignItems", $ => {
        const box = $.let(Box.Root([], {
            alignItems: Style.AlignItems("center"),
        }));

        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").alignItems.hasTag("some"), true));
        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").alignItems.unwrap("some").hasTag("center"), true));
    });

    test("creates box with gap", $ => {
        const box = $.let(Box.Root([], {
            gap: "4",
        }));

        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").gap.hasTag("some"), true));
        $(assertEast.equal(box.unwrap().unwrap("Box").style.unwrap("some").gap.unwrap("some"), "4"));
    });

    // =========================================================================
    // No Style - Defaults to None
    // =========================================================================

    test("creates box with no style - style option is none", $ => {
        const box = $.let(Box.Root([]));

        $(assertEast.equal(box.unwrap().unwrap("Box").style.hasTag("none"), true));
    });

    // =========================================================================
    // Multiple Style Properties
    // =========================================================================

    test("creates box with multiple styles", $ => {
        const box = $.let(Box.Root([], {
            display: Style.Display("flex"),
            flexDirection: Style.FlexDirection("column"),
            justifyContent: Style.JustifyContent("center"),
            alignItems: Style.AlignItems("center"),
            gap: "4",
            padding: Box.Padding({ top: "4", right: "4", bottom: "4", left: "4" }),
            background: "gray.100",
            borderRadius: "md",
        }));

        const style = box.unwrap().unwrap("Box").style.unwrap("some");
        $(assertEast.equal(style.display.unwrap("some").hasTag("flex"), true));
        $(assertEast.equal(style.flexDirection.unwrap("some").hasTag("column"), true));
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
    // All Display Types
    // =========================================================================

    test("supports all display types", $ => {
        const block = $.let(Box.Root([], { display: Style.Display("block") }));
        const inline = $.let(Box.Root([], { display: Style.Display("inline") }));
        const inlineBlock = $.let(Box.Root([], { display: Style.Display("inline-block") }));
        const flex = $.let(Box.Root([], { display: Style.Display("flex") }));
        const inlineFlex = $.let(Box.Root([], { display: Style.Display("inline-flex") }));
        const grid = $.let(Box.Root([], { display: Style.Display("grid") }));
        const inlineGrid = $.let(Box.Root([], { display: Style.Display("inline-grid") }));
        const none = $.let(Box.Root([], { display: Style.Display("none") }));

        $(assertEast.equal(block.unwrap().unwrap("Box").style.unwrap("some").display.unwrap("some").hasTag("block"), true));
        $(assertEast.equal(inline.unwrap().unwrap("Box").style.unwrap("some").display.unwrap("some").hasTag("inline"), true));
        $(assertEast.equal(inlineBlock.unwrap().unwrap("Box").style.unwrap("some").display.unwrap("some").hasTag("inline-block"), true));
        $(assertEast.equal(flex.unwrap().unwrap("Box").style.unwrap("some").display.unwrap("some").hasTag("flex"), true));
        $(assertEast.equal(inlineFlex.unwrap().unwrap("Box").style.unwrap("some").display.unwrap("some").hasTag("inline-flex"), true));
        $(assertEast.equal(grid.unwrap().unwrap("Box").style.unwrap("some").display.unwrap("some").hasTag("grid"), true));
        $(assertEast.equal(inlineGrid.unwrap().unwrap("Box").style.unwrap("some").display.unwrap("some").hasTag("inline-grid"), true));
        $(assertEast.equal(none.unwrap().unwrap("Box").style.unwrap("some").display.unwrap("some").hasTag("none"), true));
    });

    // =========================================================================
    // All Flex Directions
    // =========================================================================

    test("supports all flex directions", $ => {
        const row = $.let(Box.Root([], { flexDirection: Style.FlexDirection("row") }));
        const column = $.let(Box.Root([], { flexDirection: Style.FlexDirection("column") }));
        const rowReverse = $.let(Box.Root([], { flexDirection: Style.FlexDirection("row-reverse") }));
        const columnReverse = $.let(Box.Root([], { flexDirection: Style.FlexDirection("column-reverse") }));

        $(assertEast.equal(row.unwrap().unwrap("Box").style.unwrap("some").flexDirection.unwrap("some").hasTag("row"), true));
        $(assertEast.equal(column.unwrap().unwrap("Box").style.unwrap("some").flexDirection.unwrap("some").hasTag("column"), true));
        $(assertEast.equal(rowReverse.unwrap().unwrap("Box").style.unwrap("some").flexDirection.unwrap("some").hasTag("row-reverse"), true));
        $(assertEast.equal(columnReverse.unwrap().unwrap("Box").style.unwrap("some").flexDirection.unwrap("some").hasTag("column-reverse"), true));
    });

    // =========================================================================
    // All Justify Content Options
    // =========================================================================

    test("supports all justify content options", $ => {
        const flexStart = $.let(Box.Root([], { justifyContent: Style.JustifyContent("flex-start") }));
        const flexEnd = $.let(Box.Root([], { justifyContent: Style.JustifyContent("flex-end") }));
        const center = $.let(Box.Root([], { justifyContent: Style.JustifyContent("center") }));
        const spaceBetween = $.let(Box.Root([], { justifyContent: Style.JustifyContent("space-between") }));
        const spaceAround = $.let(Box.Root([], { justifyContent: Style.JustifyContent("space-around") }));
        const spaceEvenly = $.let(Box.Root([], { justifyContent: Style.JustifyContent("space-evenly") }));

        $(assertEast.equal(flexStart.unwrap().unwrap("Box").style.unwrap("some").justifyContent.unwrap("some").hasTag("flex-start"), true));
        $(assertEast.equal(flexEnd.unwrap().unwrap("Box").style.unwrap("some").justifyContent.unwrap("some").hasTag("flex-end"), true));
        $(assertEast.equal(center.unwrap().unwrap("Box").style.unwrap("some").justifyContent.unwrap("some").hasTag("center"), true));
        $(assertEast.equal(spaceBetween.unwrap().unwrap("Box").style.unwrap("some").justifyContent.unwrap("some").hasTag("space-between"), true));
        $(assertEast.equal(spaceAround.unwrap().unwrap("Box").style.unwrap("some").justifyContent.unwrap("some").hasTag("space-around"), true));
        $(assertEast.equal(spaceEvenly.unwrap().unwrap("Box").style.unwrap("some").justifyContent.unwrap("some").hasTag("space-evenly"), true));
    });

    // =========================================================================
    // All Align Items Options
    // =========================================================================

    test("supports all align items options", $ => {
        const flexStart = $.let(Box.Root([], { alignItems: Style.AlignItems("flex-start") }));
        const flexEnd = $.let(Box.Root([], { alignItems: Style.AlignItems("flex-end") }));
        const center = $.let(Box.Root([], { alignItems: Style.AlignItems("center") }));
        const baseline = $.let(Box.Root([], { alignItems: Style.AlignItems("baseline") }));
        const stretch = $.let(Box.Root([], { alignItems: Style.AlignItems("stretch") }));

        $(assertEast.equal(flexStart.unwrap().unwrap("Box").style.unwrap("some").alignItems.unwrap("some").hasTag("flex-start"), true));
        $(assertEast.equal(flexEnd.unwrap().unwrap("Box").style.unwrap("some").alignItems.unwrap("some").hasTag("flex-end"), true));
        $(assertEast.equal(center.unwrap().unwrap("Box").style.unwrap("some").alignItems.unwrap("some").hasTag("center"), true));
        $(assertEast.equal(baseline.unwrap().unwrap("Box").style.unwrap("some").alignItems.unwrap("some").hasTag("baseline"), true));
        $(assertEast.equal(stretch.unwrap().unwrap("Box").style.unwrap("some").alignItems.unwrap("some").hasTag("stretch"), true));
    });

    // =========================================================================
    // Flex Container Configuration
    // =========================================================================

    test("creates typical flex container", $ => {
        const child1 = Text.Root("Item 1");
        const child2 = Text.Root("Item 2");
        const flexContainer = $.let(Box.Root([
            child1,
            child2,
        ], {
            display: Style.Display("flex"),
            flexDirection: Style.FlexDirection("row"),
            justifyContent: Style.JustifyContent("space-between"),
            alignItems: Style.AlignItems("center"),
            gap: "4",
        }));

        $(assertEast.equal(flexContainer.unwrap().unwrap("Box").children.size(), 2n));
        const style = flexContainer.unwrap().unwrap("Box").style.unwrap("some");
        $(assertEast.equal(style.display.unwrap("some").hasTag("flex"), true));
        $(assertEast.equal(style.flexDirection.unwrap("some").hasTag("row"), true));
        $(assertEast.equal(style.justifyContent.unwrap("some").hasTag("space-between"), true));
        $(assertEast.equal(style.alignItems.unwrap("some").hasTag("center"), true));
        $(assertEast.equal(style.gap.unwrap("some"), "4"));
    });

    // =========================================================================
    // Nested Boxes
    // =========================================================================

    test("creates nested boxes", $ => {
        const innerBox = Box.Root([
            Text.Root("Inner"),
        ], {
            padding: Box.Padding({ top: "2", right: "2", bottom: "2", left: "2" }),
            background: "blue.100",
        });

        const outerBox = $.let(Box.Root([
            innerBox,
        ], {
            padding: Box.Padding({ top: "4", right: "4", bottom: "4", left: "4" }),
            background: "gray.100",
        }));

        $(assertEast.equal(outerBox.unwrap().unwrap("Box").children.size(), 1n));
        $(assertEast.equal(outerBox.unwrap().unwrap("Box").style.unwrap("some").padding.unwrap("some").top.unwrap("some"), "4"));
        $(assertEast.equal(outerBox.unwrap().unwrap("Box").style.unwrap("some").background.unwrap("some"), "gray.100"));
    });
});
