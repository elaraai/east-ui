/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */
import { East, IntegerType, NullType, example } from "@elaraai/east";
import { Code, Stack, Text, Reactive, State, UIComponentType } from "../../src/index.js";

export const codeBasic = example({
    keywords: ["Code", "Root", "value", "basic", "create"],
    description: "Create a simple code component",
    fn: East.function([], UIComponentType, (_$) => {
        return Code.Root("console.log('hello')");
    }),
    inputs: [],
});

export const codeOnClick = example({
    keywords: ["Code", "Root", "onClick", "callback", "click"],
    description: "Code with onClick callback",
    fn: East.function([], UIComponentType, (_$) => {
        return Reactive.Root(East.function([], UIComponentType, $ => {
            $.if(State.has("code_count").not(), $ => {
                $(State.write([IntegerType], "code_count", 0n));
            });
            const count = $.let(State.read([IntegerType], "code_count"), IntegerType);
            const increment = $.const(East.function([], NullType, $ => {
                const current = $.let(State.read([IntegerType], "code_count"), IntegerType);
                $(State.write([IntegerType], "code_count", current.add(1n)));
            }));
            return Stack.VStack([
                Code.Root("click me", { onClick: increment }),
                Text.Root(East.str`Clicked ${count} times`),
            ], { gap: "2" });
        }));
    }),
    inputs: [],
});
