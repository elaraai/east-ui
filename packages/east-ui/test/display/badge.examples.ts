/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */
import { East, IntegerType, NullType, example } from "@elaraai/east";
import { Badge, Stack, Text, Reactive, State, UIComponentType } from "../../src/index.js";

export const badgeBasic = example({
    keywords: ["Badge", "Root", "label", "basic", "create"],
    description: "Create a simple badge",
    fn: East.function([], UIComponentType, (_$) => {
        return Badge.Root("New");
    }),
    inputs: [],
});

export const badgeOnClick = example({
    keywords: ["Badge", "Root", "onClick", "callback", "click"],
    description: "Badge with onClick callback",
    fn: East.function([], UIComponentType, (_$) => {
        return Reactive.Root(East.function([], UIComponentType, $ => {
            $.if(State.has("badge_count").not(), $ => {
                $(State.write([IntegerType], "badge_count", 0n));
            });
            const count = $.let(State.read([IntegerType], "badge_count"), IntegerType);
            const increment = $.const(East.function([], NullType, $ => {
                const current = $.let(State.read([IntegerType], "badge_count"), IntegerType);
                $(State.write([IntegerType], "badge_count", current.add(1n)));
            }));
            return Stack.VStack([
                Badge.Root("Click me", { onClick: increment, colorPalette: "blue", variant: "solid" }),
                Text.Root(East.str`Clicked ${count} times`),
            ], { gap: "2" });
        }));
    }),
    inputs: [],
});
