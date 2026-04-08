/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */
import { East, IntegerType, NullType, example } from "@elaraai/east";
import { Tag, Stack, Text, Reactive, State, UIComponentType } from "../../src/index.js";

export const tagBasic = example({
    keywords: ["Tag", "Root", "label", "basic", "create"],
    description: "Create a simple tag",
    fn: East.function([], UIComponentType, (_$) => {
        return Tag.Root("JavaScript");
    }),
    inputs: [],
});

export const tagOnClick = example({
    keywords: ["Tag", "Root", "onClick", "callback", "click"],
    description: "Tag with onClick callback",
    fn: East.function([], UIComponentType, (_$) => {
        return Reactive.Root(East.function([], UIComponentType, $ => {
            $.if(State.has("tag_count").not(), $ => {
                $(State.write([IntegerType], "tag_count", 0n));
            });
            const count = $.let(State.read([IntegerType], "tag_count"), IntegerType);
            const increment = $.const(East.function([], NullType, $ => {
                const current = $.let(State.read([IntegerType], "tag_count"), IntegerType);
                $(State.write([IntegerType], "tag_count", current.add(1n)));
            }));
            return Stack.VStack([
                Tag.Root("Click me", { onClick: increment, colorPalette: "blue", variant: "solid" }),
                Text.Root(East.str`Clicked ${count} times`),
            ], { gap: "2" });
        }));
    }),
    inputs: [],
});
