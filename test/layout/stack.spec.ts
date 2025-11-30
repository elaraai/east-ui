/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Stack, HStack, VStack, Text, Style } from "../../src/index.js";

describeEast("Stack", (test) => {
    // =========================================================================
    // Basic Creation
    // =========================================================================

    test("creates stack with empty children", $ => {
        const stack = $.let(Stack.Root([]));

        $(assertEast.equal(stack.unwrap("Stack").children.size(), 0n));
        $(assertEast.equal(stack.unwrap("Stack").style.hasTag("none"), true));
    });

    test("creates stack with single text child", $ => {
        const textChild = Text.Root("Hello");
        const stack = $.let(Stack.Root([textChild]));

        $(assertEast.equal(stack.unwrap("Stack").children.size(), 1n));
        $(assertEast.equal(stack.unwrap("Stack").style.hasTag("none"), true));
    });

    test("creates stack with multiple text children", $ => {
        const child1 = Text.Root("First");
        const child2 = Text.Root("Second");
        const child3 = Text.Root("Third");
        const stack = $.let(Stack.Root([
            child1,
            child2,
            child3,
        ]));

        $(assertEast.equal(stack.unwrap("Stack").children.size(), 3n));
    });

    // =========================================================================
    // Style Properties - Individual
    // =========================================================================

    test("creates stack with direction", $ => {
        const stack = $.let(Stack.Root([], {
            direction: Style.FlexDirection("row"),
        }));

        $(assertEast.equal(stack.unwrap("Stack").style.hasTag("some"), true));
        $(assertEast.equal(stack.unwrap("Stack").style.unwrap("some").direction.hasTag("some"), true));
        $(assertEast.equal(stack.unwrap("Stack").style.unwrap("some").direction.unwrap("some").hasTag("row"), true));
    });

    test("creates stack with gap", $ => {
        const stack = $.let(Stack.Root([], {
            gap: "4",
        }));

        $(assertEast.equal(stack.unwrap("Stack").style.unwrap("some").gap.hasTag("some"), true));
        $(assertEast.equal(stack.unwrap("Stack").style.unwrap("some").gap.unwrap("some"), "4"));
    });

    test("creates stack with align", $ => {
        const stack = $.let(Stack.Root([], {
            align: Style.AlignItems("center"),
        }));

        $(assertEast.equal(stack.unwrap("Stack").style.unwrap("some").align.hasTag("some"), true));
        $(assertEast.equal(stack.unwrap("Stack").style.unwrap("some").align.unwrap("some").hasTag("center"), true));
    });

    test("creates stack with justify", $ => {
        const stack = $.let(Stack.Root([], {
            justify: Style.JustifyContent("space-between"),
        }));

        $(assertEast.equal(stack.unwrap("Stack").style.unwrap("some").justify.hasTag("some"), true));
        $(assertEast.equal(stack.unwrap("Stack").style.unwrap("some").justify.unwrap("some").hasTag("space-between"), true));
    });

    test("creates stack with wrap", $ => {
        const stack = $.let(Stack.Root([], {
            wrap: Style.FlexWrap("wrap"),
        }));

        $(assertEast.equal(stack.unwrap("Stack").style.unwrap("some").wrap.hasTag("some"), true));
        $(assertEast.equal(stack.unwrap("Stack").style.unwrap("some").wrap.unwrap("some").hasTag("wrap"), true));
    });

    test("creates stack with padding", $ => {
        const stack = $.let(Stack.Root([], {
            padding: "4",
        }));

        $(assertEast.equal(stack.unwrap("Stack").style.unwrap("some").padding.hasTag("some"), true));
        $(assertEast.equal(stack.unwrap("Stack").style.unwrap("some").padding.unwrap("some"), "4"));
    });

    test("creates stack with background", $ => {
        const stack = $.let(Stack.Root([], {
            background: "gray.100",
        }));

        $(assertEast.equal(stack.unwrap("Stack").style.unwrap("some").background.hasTag("some"), true));
        $(assertEast.equal(stack.unwrap("Stack").style.unwrap("some").background.unwrap("some"), "gray.100"));
    });

    // =========================================================================
    // No Style - Defaults to None
    // =========================================================================

    test("creates stack with no style - style option is none", $ => {
        const stack = $.let(Stack.Root([]));

        $(assertEast.equal(stack.unwrap("Stack").style.hasTag("none"), true));
    });

    // =========================================================================
    // Multiple Style Properties
    // =========================================================================

    test("creates stack with multiple styles", $ => {
        const stack = $.let(Stack.Root([], {
            direction: 'row',
            gap: "4",
            align: 'center',
            justify: 'space-between',
            padding: "2",
            background: "gray.50",
        }));

        const style = stack.unwrap("Stack").style.unwrap("some");
        $(assertEast.equal(style.direction.unwrap("some").hasTag("row"), true));
        $(assertEast.equal(style.gap.unwrap("some"), "4"));
        $(assertEast.equal(style.align.unwrap("some").hasTag("center"), true));
        $(assertEast.equal(style.justify.unwrap("some").hasTag("space-between"), true));
        $(assertEast.equal(style.padding.unwrap("some"), "2"));
        $(assertEast.equal(style.background.unwrap("some"), "gray.50"));
        // Other styles should be none
        $(assertEast.equal(style.wrap.hasTag("none"), true));
        $(assertEast.equal(style.margin.hasTag("none"), true));
    });

    // =========================================================================
    // All Flex Directions
    // =========================================================================

    test("supports all flex directions", $ => {
        const row = $.let(Stack.Root([], { direction: Style.FlexDirection("row") }));
        const column = $.let(Stack.Root([], { direction: Style.FlexDirection("column") }));
        const rowReverse = $.let(Stack.Root([], { direction: Style.FlexDirection("row-reverse") }));
        const columnReverse = $.let(Stack.Root([], { direction: Style.FlexDirection("column-reverse") }));

        $(assertEast.equal(row.unwrap("Stack").style.unwrap("some").direction.unwrap("some").hasTag("row"), true));
        $(assertEast.equal(column.unwrap("Stack").style.unwrap("some").direction.unwrap("some").hasTag("column"), true));
        $(assertEast.equal(rowReverse.unwrap("Stack").style.unwrap("some").direction.unwrap("some").hasTag("row-reverse"), true));
        $(assertEast.equal(columnReverse.unwrap("Stack").style.unwrap("some").direction.unwrap("some").hasTag("column-reverse"), true));
    });

    // =========================================================================
    // All Flex Wrap Options
    // =========================================================================

    test("supports all flex wrap options", $ => {
        const nowrap = $.let(Stack.Root([], { wrap: Style.FlexWrap("nowrap") }));
        const wrap = $.let(Stack.Root([], { wrap: Style.FlexWrap("wrap") }));
        const wrapReverse = $.let(Stack.Root([], { wrap: Style.FlexWrap("wrap-reverse") }));

        $(assertEast.equal(nowrap.unwrap("Stack").style.unwrap("some").wrap.unwrap("some").hasTag("nowrap"), true));
        $(assertEast.equal(wrap.unwrap("Stack").style.unwrap("some").wrap.unwrap("some").hasTag("wrap"), true));
        $(assertEast.equal(wrapReverse.unwrap("Stack").style.unwrap("some").wrap.unwrap("some").hasTag("wrap-reverse"), true));
    });

    // =========================================================================
    // HStack (Horizontal Stack)
    // =========================================================================

    test("HStack creates horizontal stack", $ => {
        const hstack = $.let(HStack([]));

        $(assertEast.equal(hstack.unwrap("Stack").style.hasTag("some"), true));
        $(assertEast.equal(hstack.unwrap("Stack").style.unwrap("some").direction.hasTag("some"), true));
        $(assertEast.equal(hstack.unwrap("Stack").style.unwrap("some").direction.unwrap("some").hasTag("row"), true));
    });

    test("HStack with gap", $ => {
        const hstack = $.let(HStack([], {
            gap: "4",
        }));

        $(assertEast.equal(hstack.unwrap("Stack").style.unwrap("some").direction.unwrap("some").hasTag("row"), true));
        $(assertEast.equal(hstack.unwrap("Stack").style.unwrap("some").gap.unwrap("some"), "4"));
    });

    test("HStack with children and styling", $ => {
        const child1 = Text.Root("Left");
        const child2 = Text.Root("Right");
        const hstack = $.let(HStack([
            child1,
            child2,
        ], {
            gap: "4",
            align: Style.AlignItems("center"),
            justify: Style.JustifyContent("space-between"),
        }));

        $(assertEast.equal(hstack.unwrap("Stack").children.size(), 2n));
        const style = hstack.unwrap("Stack").style.unwrap("some");
        $(assertEast.equal(style.direction.unwrap("some").hasTag("row"), true));
        $(assertEast.equal(style.gap.unwrap("some"), "4"));
        $(assertEast.equal(style.align.unwrap("some").hasTag("center"), true));
        $(assertEast.equal(style.justify.unwrap("some").hasTag("space-between"), true));
    });

    // =========================================================================
    // VStack (Vertical Stack)
    // =========================================================================

    test("VStack creates vertical stack", $ => {
        const vstack = $.let(VStack([]));

        $(assertEast.equal(vstack.unwrap("Stack").style.hasTag("some"), true));
        $(assertEast.equal(vstack.unwrap("Stack").style.unwrap("some").direction.hasTag("some"), true));
        $(assertEast.equal(vstack.unwrap("Stack").style.unwrap("some").direction.unwrap("some").hasTag("column"), true));
    });

    test("VStack with gap", $ => {
        const vstack = $.let(VStack([], {
            gap: "4",
        }));

        $(assertEast.equal(vstack.unwrap("Stack").style.unwrap("some").direction.unwrap("some").hasTag("column"), true));
        $(assertEast.equal(vstack.unwrap("Stack").style.unwrap("some").gap.unwrap("some"), "4"));
    });

    test("VStack with children and styling", $ => {
        const child1 = Text.Root("Top");
        const child2 = Text.Root("Bottom");
        const vstack = $.let(VStack([
            child1,
            child2,
        ], {
            gap: "4",
            align: Style.AlignItems("stretch"),
        }));

        $(assertEast.equal(vstack.unwrap("Stack").children.size(), 2n));
        const style = vstack.unwrap("Stack").style.unwrap("some");
        $(assertEast.equal(style.direction.unwrap("some").hasTag("column"), true));
        $(assertEast.equal(style.gap.unwrap("some"), "4"));
        $(assertEast.equal(style.align.unwrap("some").hasTag("stretch"), true));
    });

    // =========================================================================
    // Nested Stacks
    // =========================================================================

    test("creates nested stacks", $ => {
        const innerStack = HStack([
            Text.Root("Inner 1"),
            Text.Root("Inner 2"),
        ], {
            gap: "2",
        });

        const outerStack = $.let(VStack([
            innerStack,
            Text.Root("Outer Item"),
        ], {
            gap: "4",
        }));

        $(assertEast.equal(outerStack.unwrap("Stack").children.size(), 2n));
        $(assertEast.equal(outerStack.unwrap("Stack").style.unwrap("some").direction.unwrap("some").hasTag("column"), true));
        $(assertEast.equal(outerStack.unwrap("Stack").style.unwrap("some").gap.unwrap("some"), "4"));
    });

    // =========================================================================
    // Typical Use Cases
    // =========================================================================

    test("creates navigation bar layout", $ => {
        const logo = Text.Root("Logo");
        const nav1 = Text.Root("Home");
        const nav2 = Text.Root("About");
        const navBar = $.let(HStack([
            logo,
            nav1,
            nav2,
        ], {
            gap: "4",
            align: Style.AlignItems("center"),
            justify: Style.JustifyContent("space-between"),
            padding: "4",
            background: "white",
        }));

        $(assertEast.equal(navBar.unwrap("Stack").children.size(), 3n));
        const style = navBar.unwrap("Stack").style.unwrap("some");
        $(assertEast.equal(style.direction.unwrap("some").hasTag("row"), true));
        $(assertEast.equal(style.justify.unwrap("some").hasTag("space-between"), true));
    });

    test("creates form layout", $ => {
        const label1 = Text.Root("Name:");
        const label2 = Text.Root("Email:");
        const formLayout = $.let(VStack([
            label1,
            label2,
        ], {
            gap: "4",
            align: Style.AlignItems("stretch"),
            width: "100%",
        }));

        $(assertEast.equal(formLayout.unwrap("Stack").children.size(), 2n));
        const style = formLayout.unwrap("Stack").style.unwrap("some");
        $(assertEast.equal(style.direction.unwrap("some").hasTag("column"), true));
        $(assertEast.equal(style.align.unwrap("some").hasTag("stretch"), true));
        $(assertEast.equal(style.width.unwrap("some"), "100%"));
    });
});
