/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { East, some, IntegerType, NullType } from "@elaraai/east";
import {
    Button,
    UIComponentType,
    Stack,
    Grid, Stat, State,
} from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Platform State showcase - demonstrates reactive state management with callbacks.
 *
 * This showcase tests:
 * 1. Button onClick callbacks that modify state
 * 2. State reads that display current values
 * 3. Nested components to verify selective re-rendering
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // =====================================================================
        // Example 1: Simple Counter
        // =====================================================================

        // Initialize counter state to 0
        $(State.initTyped("showcase_counter", 0n, IntegerType)());

        // Create increment callback
        const incrementFn = East.function([], NullType, $ => {
            const current = $.let(State.readTyped("showcase_counter", IntegerType)());
            $(State.writeTyped("showcase_counter", some(current.unwrap('some').add(1n)), IntegerType)());
        });

        // Create decrement callback
        const decrementFn = East.function([], NullType, $ => {
            const current = $.let(State.readTyped("showcase_counter", IntegerType)());
            $(State.writeTyped("showcase_counter", some(current.unwrap('some').subtract(1n)), IntegerType)());
        });

        // Read current counter value for display
        const counterValue = $.let(State.readTyped("showcase_counter", IntegerType)());

        const simpleCounter = $.let(
            ShowcaseCard(
                "Simple Counter",
                "Click buttons to increment/decrement. Tests basic state read/write.",
                Stack.VStack([
                    Stack.HStack([
                          Stat.Root("Counter Value", East.str`${counterValue.unwrap('some')}`),
                    ], { width: "100%" }),
                    Stack.HStack([
                        Button.Root("- Decrement", {
                            variant: "outline",
                            colorPalette: "red",
                            size: "md",
                            onClick: decrementFn,
                        }),
                        Button.Root("+ Increment", {
                            variant: "solid",
                            colorPalette: "blue",
                            size: "md",
                            onClick: incrementFn,
                        }),
                    ], { gap: "3" }),
                ], { gap: "4", align: "center" }),
                some(`
                    Stack.VStack([
                        Stat.Root("Counter Value", counterDisplay),
                        Stack.HStack([
                            Button.Root("- Decrement", {
                                variant: "outline",
                                colorPalette: "red",
                                size: "md",
                                onClick: decrementFn,
                            }),
                            Button.Root("+ Increment", {
                                variant: "solid",
                                colorPalette: "blue",
                                size: "md",
                                onClick: incrementFn,
                            }),
                        ], { gap: "3" }),
                    ], { gap: "4", align: "center" })
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(simpleCounter),
            ],
            {
                templateColumns: "repeat(1, 1fr)",
                gap: "4",
            }
        );
    }
);
