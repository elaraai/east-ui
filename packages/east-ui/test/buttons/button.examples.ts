/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */
import { East, IntegerType, NullType, example } from "@elaraai/east";
import { Button, Text, Stack, Stat, Reactive, State, UIComponentType } from "../../src/index.js";

export const buttonBasic = example({
    keywords: ["Button", "Root", "label", "basic", "create"],
    description: "Create a simple button with a text label",
    fn: East.function([], UIComponentType, (_$) => {
        return Button.Root("Click me");
    }),
    inputs: [],
});

export const buttonSolidVariant = example({
    keywords: ["Button", "Root", "variant", "solid", "colorPalette", "blue", "size"],
    description: "Create a solid blue primary action button with size",
    fn: East.function([], UIComponentType, (_$) => {
        return Button.Root("Save Changes", {
            variant: "solid",
            colorPalette: "blue",
            size: "md",
        });
    }),
    inputs: [],
});

export const buttonDangerOutline = example({
    keywords: ["Button", "Root", "variant", "outline", "ghost", "colorPalette", "red", "danger"],
    description: "Create danger and secondary action buttons with outline and ghost variants",
    fn: East.function([], UIComponentType, (_$) => {
        return Stack.HStack([
            Button.Root("Delete", { variant: "solid", colorPalette: "red" }),
            Button.Root("Cancel", { variant: "outline", colorPalette: "gray" }),
            Button.Root("More", { variant: "ghost", size: "sm" }),
        ], { gap: "2" });
    }),
    inputs: [],
});

export const buttonReactiveCounter = example({
    keywords: ["Button", "Root", "onClick", "Reactive", "State", "callback", "interactive", "counter"],
    description: "Reactive counter with increment/decrement buttons using onClick callbacks and State",
    fn: East.function([], UIComponentType, (_$) => {
        // Reactive.Root re-renders when state changes
        return Reactive.Root(East.function([], UIComponentType, $ => {
            // Initialize counter state
            $.if(State.has("counter").not(), $ => {
                $(State.write([IntegerType], "counter", 0n));
            });

            const count = $.let(State.read([IntegerType], "counter"), IntegerType);

            // Define callbacks that modify state (must be stored in $.const)
            const increment = $.const(East.function([], NullType, $ => {
                const current = $.let(State.read([IntegerType], "counter"), IntegerType);
                $(State.write([IntegerType], "counter", current.add(1n)));
            }));

            const decrement = $.const(East.function([], NullType, $ => {
                const current = $.let(State.read([IntegerType], "counter"), IntegerType);
                $(State.write([IntegerType], "counter", current.subtract(1n)));
            }));

            return Stack.VStack([
                Stat.Root("Count", Text.Root(East.print(count))),
                Stack.HStack([
                    Button.Root("-", { variant: "solid", colorPalette: "red", onClick: decrement }),
                    Button.Root("+", { variant: "solid", colorPalette: "blue", onClick: increment }),
                ], { gap: "2" }),
            ], { gap: "4" });
        }));
    }),
    inputs: [],
});
