/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */
import { East, IntegerType, NullType, example } from "@elaraai/east";
import { Flex, Stack, Text, Reactive, State, UIComponentType } from "../../src/index.js";

export const flexBasic = example({
    keywords: ["Flex", "Root", "container", "basic", "create"],
    description: "Create a simple flex container",
    fn: East.function([], UIComponentType, (_$) => {
        return Flex.Root([Text.Root("Flex content")]);
    }),
    inputs: [],
});

export const flexOnClick = example({
    keywords: ["Flex", "Root", "onClick", "callback", "click"],
    description: "Flex with onClick callback",
    fn: East.function([], UIComponentType, (_$) => {
        return Reactive.Root(East.function([], UIComponentType, $ => {
            $.if(State.has("flex_count").not(), $ => {
                $(State.write([IntegerType], "flex_count", 0n));
            });
            const count = $.let(State.read([IntegerType], "flex_count"), IntegerType);
            const increment = $.const(East.function([], NullType, $ => {
                const current = $.let(State.read([IntegerType], "flex_count"), IntegerType);
                $(State.write([IntegerType], "flex_count", current.add(1n)));
            }));
            return Stack.VStack([
                Flex.Root([Text.Root(East.str`Click count: ${count}`)], { onClick: increment }),
            ], { gap: "2" });
        }));
    }),
    inputs: [],
});
