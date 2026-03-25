/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */
import { East, IntegerType, NullType, example } from "@elaraai/east";
import { Avatar, Stack, Text, Reactive, State, UIComponentType } from "../../src/index.js";

export const avatarBasic = example({
    keywords: ["Avatar", "Root", "name", "basic", "create"],
    description: "Create a simple avatar",
    fn: East.function([], UIComponentType, (_$) => {
        return Avatar.Root({ name: "John Doe" });
    }),
    inputs: [],
});

export const avatarOnClick = example({
    keywords: ["Avatar", "Root", "onClick", "callback", "click"],
    description: "Avatar with onClick callback",
    fn: East.function([], UIComponentType, (_$) => {
        return Reactive.Root(East.function([], UIComponentType, $ => {
            $.if(State.has("avatar_count").not(), $ => {
                $(State.write([IntegerType], "avatar_count", 0n));
            });
            const count = $.let(State.read([IntegerType], "avatar_count"), IntegerType);
            const increment = $.const(East.function([], NullType, $ => {
                const current = $.let(State.read([IntegerType], "avatar_count"), IntegerType);
                $(State.write([IntegerType], "avatar_count", current.add(1n)));
            }));
            return Stack.VStack([
                Avatar.Root({ name: "John Doe", onClick: increment }),
                Text.Root(East.str`Clicked ${count} times`),
            ], { gap: "2" });
        }));
    }),
    inputs: [],
});
