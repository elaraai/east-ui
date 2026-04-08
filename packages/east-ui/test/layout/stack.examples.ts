/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */
import { East, IntegerType, NullType, example } from "@elaraai/east";
import { Stack, Text, Reactive, State, UIComponentType } from "../../src/index.js";

export const stackBasic = example({
    keywords: ["Stack", "HStack", "layout", "basic", "create"],
    description: "Create a simple horizontal stack",
    fn: East.function([], UIComponentType, (_$) => {
        return Stack.HStack([Text.Root("Left"), Text.Root("Right")], { gap: "4" });
    }),
    inputs: [],
});

export const stackOnClick = example({
    keywords: ["Stack", "Root", "onClick", "callback", "click"],
    description: "Stack with onClick callback",
    fn: East.function([], UIComponentType, (_$) => {
        return Reactive.Root(East.function([], UIComponentType, $ => {
            $.if(State.has("stack_count").not(), $ => {
                $(State.write([IntegerType], "stack_count", 0n));
            });
            const count = $.let(State.read([IntegerType], "stack_count"), IntegerType);
            const increment = $.const(East.function([], NullType, $ => {
                const current = $.let(State.read([IntegerType], "stack_count"), IntegerType);
                $(State.write([IntegerType], "stack_count", current.add(1n)));
            }));
            return Stack.VStack([
                Stack.HStack([Text.Root(East.str`Click count: ${count}`)], { onClick: increment }),
            ], { gap: "2" });
        }));
    }),
    inputs: [],
});
