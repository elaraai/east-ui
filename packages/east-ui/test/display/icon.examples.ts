/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */
import { East, IntegerType, NullType, example } from "@elaraai/east";
import { Icon, Stack, Text, Reactive, State, UIComponentType } from "../../src/index.js";

export const iconBasic = example({
    keywords: ["Icon", "Root", "prefix", "name", "basic", "create"],
    description: "Create a simple icon",
    fn: East.function([], UIComponentType, (_$) => {
        return Icon.Root("fas", "star");
    }),
    inputs: [],
});

export const iconOnClick = example({
    keywords: ["Icon", "Root", "onClick", "callback", "click"],
    description: "Icon with onClick callback",
    fn: East.function([], UIComponentType, (_$) => {
        return Reactive.Root(East.function([], UIComponentType, $ => {
            $.if(State.has("icon_count").not(), $ => {
                $(State.write([IntegerType], "icon_count", 0n));
            });
            const count = $.let(State.read([IntegerType], "icon_count"), IntegerType);
            const increment = $.const(East.function([], NullType, $ => {
                const current = $.let(State.read([IntegerType], "icon_count"), IntegerType);
                $(State.write([IntegerType], "icon_count", current.add(1n)));
            }));
            return Stack.VStack([
                Icon.Root("fas", "star", { onClick: increment }),
                Text.Root(East.str`Clicked ${count} times`),
            ], { gap: "2" });
        }));
    }),
    inputs: [],
});
