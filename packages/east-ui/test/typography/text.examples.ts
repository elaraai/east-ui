/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */
import { East, IntegerType, NullType, example } from "@elaraai/east";
import { Text, Stack, Reactive, State, UIComponentType } from "../../src/index.js";

export const textBasic = example({
    keywords: ["Text", "Root", "value", "basic", "create"],
    description: "Create a simple text component",
    fn: East.function([], UIComponentType, (_$) => {
        return Text.Root("Hello World");
    }),
    inputs: [],
});

export const textOnClick = example({
    keywords: ["Text", "Root", "onClick", "callback", "click"],
    description: "Text with onClick callback",
    fn: East.function([], UIComponentType, (_$) => {
        return Reactive.Root(East.function([], UIComponentType, $ => {
            $.if(State.has("text_count").not(), $ => {
                $(State.write([IntegerType], "text_count", 0n));
            });
            const count = $.let(State.read([IntegerType], "text_count"), IntegerType);
            const increment = $.const(East.function([], NullType, $ => {
                const current = $.let(State.read([IntegerType], "text_count"), IntegerType);
                $(State.write([IntegerType], "text_count", current.add(1n)));
            }));
            return Stack.VStack([
                Text.Root("Click me", { onClick: increment }),
                Text.Root(East.str`Clicked ${count} times`),
            ], { gap: "2" });
        }));
    }),
    inputs: [],
});
