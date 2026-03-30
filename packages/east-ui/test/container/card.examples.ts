/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */
import { East, IntegerType, NullType, example } from "@elaraai/east";
import { Card, Stack, Text, Reactive, State, UIComponentType } from "../../src/index.js";

export const cardBasic = example({
    keywords: ["Card", "Root", "container", "basic", "create"],
    description: "Create a simple card",
    fn: East.function([], UIComponentType, (_$) => {
        return Card.Root([Text.Root("Card content")]);
    }),
    inputs: [],
});

export const cardOnClick = example({
    keywords: ["Card", "Root", "onClick", "callback", "click"],
    description: "Card with onClick callback",
    fn: East.function([], UIComponentType, (_$) => {
        return Reactive.Root(East.function([], UIComponentType, $ => {
            $.if(State.has("card_count").not(), $ => {
                $(State.write([IntegerType], "card_count", 0n));
            });
            const count = $.let(State.read([IntegerType], "card_count"), IntegerType);
            const increment = $.const(East.function([], NullType, $ => {
                const current = $.let(State.read([IntegerType], "card_count"), IntegerType);
                $(State.write([IntegerType], "card_count", current.add(1n)));
            }));
            return Stack.VStack([
                Card.Root([Text.Root(East.str`Click count: ${count}`)], { onClick: increment }),
            ], { gap: "2" });
        }));
    }),
    inputs: [],
});
