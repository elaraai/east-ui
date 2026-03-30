/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */
import { East, IntegerType, NullType, example } from "@elaraai/east";
import { Heading, Stack, Text, Reactive, State, UIComponentType } from "../../src/index.js";

export const headingBasic = example({
    keywords: ["Heading", "Root", "value", "basic", "create"],
    description: "Create a simple heading",
    fn: East.function([], UIComponentType, (_$) => {
        return Heading.Root("Welcome");
    }),
    inputs: [],
});

export const headingOnClick = example({
    keywords: ["Heading", "Root", "onClick", "callback", "click"],
    description: "Heading with onClick callback",
    fn: East.function([], UIComponentType, (_$) => {
        return Reactive.Root(East.function([], UIComponentType, $ => {
            $.if(State.has("heading_count").not(), $ => {
                $(State.write([IntegerType], "heading_count", 0n));
            });
            const count = $.let(State.read([IntegerType], "heading_count"), IntegerType);
            const increment = $.const(East.function([], NullType, $ => {
                const current = $.let(State.read([IntegerType], "heading_count"), IntegerType);
                $(State.write([IntegerType], "heading_count", current.add(1n)));
            }));
            return Stack.VStack([
                Heading.Root("Click me", { onClick: increment }),
                Text.Root(East.str`Clicked ${count} times`),
            ], { gap: "2" });
        }));
    }),
    inputs: [],
});
