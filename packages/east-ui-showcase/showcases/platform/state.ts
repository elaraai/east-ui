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

        // Initialize counter state to 0 (only if not already set)
        $.if(State.has("showcase_counter").not(), $ => {
            $(State.write([IntegerType], "showcase_counter", 0n));
        });

        // Create increment callback
        const incrementFn = East.function([], NullType, $ => {
            const current = $.let(State.read([IntegerType], "showcase_counter"));
            $(State.write([IntegerType], "showcase_counter", current.add(1n)));
        });

        // Create decrement callback
        const decrementFn = East.function([], NullType, $ => {
            const current = $.let(State.read([IntegerType], "showcase_counter"));
            $(State.write([IntegerType], "showcase_counter", current.subtract(1n)));
        });

        // Read current counter value for display
        const counterValue = $.let(State.read([IntegerType], "showcase_counter"));

        const simpleCounter = $.let(
            ShowcaseCard(
                "Simple Counter",
                "Click buttons to increment/decrement. Tests basic state read/write.",
                Stack.VStack([
                    Stack.HStack([
                          Stat.Root("Counter Value", East.str`${counterValue}`),
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
