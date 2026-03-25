/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */
import { East, IntegerType, NullType, example } from "@elaraai/east";
import { Stat, Stack, Text, Reactive, State, UIComponentType } from "../../src/index.js";

export const statBasic = example({
    keywords: ["Stat", "Root", "label", "value", "basic", "create"],
    description: "Create a simple stat",
    fn: East.function([], UIComponentType, (_$) => {
        return Stat.Root("Revenue", Text.Root("$45,231"));
    }),
    inputs: [],
});

export const statOnClick = example({
    keywords: ["Stat", "Root", "onClick", "callback", "click"],
    description: "Stat with onClick callback",
    fn: East.function([], UIComponentType, (_$) => {
        return Reactive.Root(East.function([], UIComponentType, $ => {
            $.if(State.has("stat_count").not(), $ => {
                $(State.write([IntegerType], "stat_count", 0n));
            });
            const count = $.let(State.read([IntegerType], "stat_count"), IntegerType);
            const increment = $.const(East.function([], NullType, $ => {
                const current = $.let(State.read([IntegerType], "stat_count"), IntegerType);
                $(State.write([IntegerType], "stat_count", current.add(1n)));
            }));
            return Stack.VStack([
                Stat.Root("Revenue", Text.Root("$45,231"), { onClick: increment }),
                Text.Root(East.str`Clicked ${count} times`),
            ], { gap: "2" });
        }));
    }),
    inputs: [],
});
