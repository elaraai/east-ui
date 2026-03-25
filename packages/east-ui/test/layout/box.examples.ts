/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */
import { East, IntegerType, NullType, example } from "@elaraai/east";
import { Box, Stack, Text, Reactive, State, UIComponentType } from "../../src/index.js";

export const boxBasic = example({
    keywords: ["Box", "Root", "container", "basic", "create"],
    description: "Create a simple box",
    fn: East.function([], UIComponentType, (_$) => {
        return Box.Root([Text.Root("Box content")]);
    }),
    inputs: [],
});

export const boxOnClick = example({
    keywords: ["Box", "Root", "onClick", "callback", "click"],
    description: "Box with onClick callback",
    fn: East.function([], UIComponentType, (_$) => {
        return Reactive.Root(East.function([], UIComponentType, $ => {
            $.if(State.has("box_count").not(), $ => {
                $(State.write([IntegerType], "box_count", 0n));
            });
            const count = $.let(State.read([IntegerType], "box_count"), IntegerType);
            const increment = $.const(East.function([], NullType, $ => {
                const current = $.let(State.read([IntegerType], "box_count"), IntegerType);
                $(State.write([IntegerType], "box_count", current.add(1n)));
            }));
            return Stack.VStack([
                Box.Root([Text.Root(East.str`Click count: ${count}`)], { onClick: increment }),
            ], { gap: "2" });
        }));
    }),
    inputs: [],
});
