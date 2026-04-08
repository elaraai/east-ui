/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */
import { East, IntegerType, NullType, example } from "@elaraai/east";
import { Alert, Stack, Text, Reactive, State, UIComponentType } from "../../src/index.js";

export const alertBasic = example({
    keywords: ["Alert", "Root", "status", "basic", "create"],
    description: "Create a simple alert",
    fn: East.function([], UIComponentType, (_$) => {
        return Alert.Root("info", { title: "Information" });
    }),
    inputs: [],
});

export const alertOnClick = example({
    keywords: ["Alert", "Root", "onClick", "callback", "click"],
    description: "Alert with onClick callback",
    fn: East.function([], UIComponentType, (_$) => {
        return Reactive.Root(East.function([], UIComponentType, $ => {
            $.if(State.has("alert_count").not(), $ => {
                $(State.write([IntegerType], "alert_count", 0n));
            });
            const count = $.let(State.read([IntegerType], "alert_count"), IntegerType);
            const increment = $.const(East.function([], NullType, $ => {
                const current = $.let(State.read([IntegerType], "alert_count"), IntegerType);
                $(State.write([IntegerType], "alert_count", current.add(1n)));
            }));
            return Stack.VStack([
                Alert.Root("info", { title: "Click me", onClick: increment }),
                Text.Root(East.str`Clicked ${count} times`),
            ], { gap: "2" });
        }));
    }),
    inputs: [],
});
