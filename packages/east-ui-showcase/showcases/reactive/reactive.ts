/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { East, some, IntegerType, NullType, FloatType, BooleanType } from "@elaraai/east";
import {
    Button,
    UIComponentType,
    Stack,
    Grid,
    Text,
    Stat,
    State,
    Reactive,
    Chart,
    Badge,
    Switch,
} from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Reactive Components showcase - demonstrates the difference between
 * reactive and non-reactive state-dependent components.
 *
 * Key concepts:
 * - Non-reactive components read state once and never update
 * - Reactive.Root components automatically re-render when their dependencies change
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // =====================================================================
        // Initialize shared state
        // =====================================================================
        $(State.initTyped("reactive_counter", 0n, IntegerType)());
        $(State.initTyped("reactive_revenue", 100.0, FloatType)());

        // =====================================================================
        // Callbacks for modifying state
        // =====================================================================

        const incrementCounter = East.function([], NullType, $ => {
            const current = $.let(State.readTyped("reactive_counter", IntegerType)());
            $(State.writeTyped("reactive_counter", some(current.unwrap('some').add(1n)), IntegerType)());
        });

        const decrementCounter = East.function([], NullType, $ => {
            const current = $.let(State.readTyped("reactive_counter", IntegerType)());
            $(State.writeTyped("reactive_counter", some(current.unwrap('some').subtract(1n)), IntegerType)());
        });

        const boostRevenue = East.function([], NullType, $ => {
            const current = $.let(State.readTyped("reactive_revenue", FloatType)());
            $(State.writeTyped("reactive_revenue", some(current.unwrap('some').multiply(1.2)), FloatType)());
        });

        const crashRevenue = East.function([], NullType, $ => {
            const current = $.let(State.readTyped("reactive_revenue", FloatType)());
            $(State.writeTyped("reactive_revenue", some(current.unwrap('some').multiply(0.7)), FloatType)());
        });

        const resetRevenue = East.function([], NullType, $ => {
            $(State.writeTyped("reactive_revenue", some(100.0), FloatType)());
        });

        // =====================================================================
        // Example 1: NON-REACTIVE Counter (reads state once, never updates)
        // =====================================================================

        // Read counter value once at render time - this won't update!
        const staticValue = $.let(State.readTyped("reactive_counter", IntegerType)());

        const nonReactiveCard = $.let(
            ShowcaseCard(
                "Non-Reactive (Static)",
                "Reads state once at render. Click buttons - value stays frozen at initial value.",
                Stack.VStack([
                    Badge.Root("Does NOT use Reactive.Root", { colorPalette: "red", variant: "solid" }),
                    Stat.Root("Frozen Value", East.print(staticValue.unwrap('some'))),
                    Stack.HStack([
                        Button.Root("-", { variant: "outline", colorPalette: "gray", onClick: decrementCounter }),
                        Button.Root("+", { variant: "outline", colorPalette: "gray", onClick: incrementCounter }),
                    ], { gap: "2" }),
                ], { gap: "4", align: "center" }),
                some(`
                    Stack.VStack([
                        Badge.Root("Does NOT use Reactive.Root", { colorPalette: "red", variant: "solid" }),
                        Stat.Root("Frozen Value", East.print(staticValue.unwrap('some'))),
                        Stack.HStack([
                            Button.Root("-", { variant: "outline", colorPalette: "gray", onClick: decrementCounter }),
                            Button.Root("+", { variant: "outline", colorPalette: "gray", onClick: incrementCounter }),
                        ], { gap: "2" }),
                    ], { gap: "4", align: "center" })
                `)
            )
        );

        // =====================================================================
        // Example 2: REACTIVE Counter (updates when state changes)
        // =====================================================================

        const reactiveCard = $.let(
            ShowcaseCard(
                "Reactive (Live)",
                "Uses Reactive.Root - automatically updates when state changes!",
                Reactive.Root($ => {
                    const liveValue = $.let(State.readTyped("reactive_counter", IntegerType)());
                    return Stack.VStack([
                        Badge.Root("Uses Reactive.Root", { colorPalette: "green", variant: "solid" }),
                        Stat.Root("Live Value", East.print(liveValue.unwrap('some'))),
                        Stack.HStack([
                            Button.Root("-", { variant: "solid", colorPalette: "red", onClick: decrementCounter }),
                            Button.Root("+", { variant: "solid", colorPalette: "blue", onClick: incrementCounter }),
                        ], { gap: "2" }),
                    ], { gap: "4", align: "center" });
                }),
                some(`
                    Reactive.Root($ => {
                        const liveValue = $.let(State.readTyped("reactive_counter", IntegerType)());
                        return Stack.VStack([
                            Badge.Root("Uses Reactive.Root", { colorPalette: "green", variant: "solid" }),
                            Stat.Root("Live Value", East.print(liveValue.unwrap('some'))),
                            Stack.HStack([
                                Button.Root("-", { variant: "solid", colorPalette: "red", onClick: decrementCounter }),
                                Button.Root("+", { variant: "solid", colorPalette: "blue", onClick: incrementCounter }),
                            ], { gap: "2" }),
                        ], { gap: "4", align: "center" });
                    })
                `)
            )
        );

        // =====================================================================
        // Example 3: REACTIVE Chart - Live revenue visualization
        // =====================================================================

        const reactiveChartCard = $.let(
            ShowcaseCard(
                "Reactive Chart",
                "A live-updating chart! Click Boost or Crash to see the revenue bar change in real-time.",
                Reactive.Root($ => {
                    const revenue = $.let(State.readTyped("reactive_revenue", FloatType)());
                    const revenueValue = revenue.unwrap('some');

                    // Determine color based on revenue level
                    const color = East.greaterEqual(revenueValue, 150.0).ifElse(
                        _$ => "green.solid",
                        _$ => East.greaterEqual(revenueValue, 80.0).ifElse(
                            _$ => "blue.solid",
                            _$ => "red.solid"
                        )
                    );

                    return Stack.VStack([
                        Badge.Root("Live Revenue Tracker", { colorPalette: "purple", variant: "solid" }),
                        // Bar chart showing current revenue
                        Chart.Bar(
                            [{ category: "Revenue", value: revenueValue }],
                            { value: { color, label: "Current" } },
                            {
                                yAxis: { domain: [0.0, 300.0] },
                            }
                        ),
                        Stat.Root("Revenue", East.Float.printCurrency(revenueValue)),
                        Stack.HStack([
                            Button.Root("Crash -30%", { variant: "solid", colorPalette: "red", onClick: crashRevenue }),
                            Button.Root("Reset", { variant: "outline", colorPalette: "gray", onClick: resetRevenue }),
                            Button.Root("Boost +20%", { variant: "solid", colorPalette: "green", onClick: boostRevenue }),
                        ], { gap: "2" }),
                    ], { gap: "4", align: "center" });
                }),
                some(`
                    Reactive.Root($ => {
                        const revenue = $.let(State.readTyped("reactive_revenue", FloatType)());
                        const revenueValue = revenue.unwrap('some');

                        // Determine color based on revenue level
                        const color = East.greaterEqual(revenueValue, 150.0).ifElse(
                            _$ => "green.solid",
                            _$ => East.greaterEqual(revenueValue, 80.0).ifElse(
                                _$ => "blue.solid",
                                _$ => "red.solid"
                            )
                        );

                        return Stack.VStack([
                            Badge.Root("Live Revenue Tracker", { colorPalette: "purple", variant: "solid" }),
                            // Bar chart showing current revenue
                            Chart.Bar(
                                [{ category: "Revenue", value: revenueValue }],
                                { value: { color, label: "Current" } },
                                {
                                    yAxis: { domain: [0.0, 300.0] },
                                }
                            ),
                            Stat.Root("Revenue", East.Float.printCurrency(revenueValue)),
                            Stack.HStack([
                                Button.Root("Crash -30%", { variant: "solid", colorPalette: "red", onClick: crashRevenue }),
                                Button.Root("Reset", { variant: "outline", colorPalette: "gray", onClick: resetRevenue }),
                                Button.Root("Boost +20%", { variant: "solid", colorPalette: "green", onClick: boostRevenue }),
                            ], { gap: "2" }),
                        ], { gap: "4", align: "center" });
                    })
                `)
            )
        );

        // =====================================================================
        // Example 2: REACTIVE Counter (updates when state changes)
        // =====================================================================

        const nestedReactiveCard = $.let(
            ShowcaseCard(
                "Nested Reactive (Live)",
                "Uses Reactive.Root within Reactive.Root - automatically updates when state changes!",
                Reactive.Root(_$ => {
                    return Stack.VStack([
                        Badge.Root("Uses Reactive.Root", { colorPalette: "green", variant: "solid" }),
                        Reactive.Root($ => {
                            $(State.initTyped("reactive_factor", true, BooleanType)());
                            const counter = $.let(State.readTyped("reactive_counter", IntegerType)());
                            const factor = $.let(State.readTyped("reactive_factor", BooleanType)());
                            const onChange = East.function([BooleanType], NullType, ($, newValue) => {
                                $(State.writeTyped("reactive_factor", some(newValue), BooleanType)());
                            })
                            const adjusted = $.let(counter.unwrap('some'))
                            $.if(factor.unwrap('some'),
                                $ => {
                                    $.assign(adjusted, adjusted.multiply(2n));
                                },
                            );
                            return Stack.HStack([
                                Stat.Root("Live Value", East.print(adjusted)),
                                Switch.Root(factor.unwrap('some'), { onChange })
                            ], { gap: "4", align: "center" });
                        }),
                        Stack.HStack([
                            Button.Root("-", { variant: "solid", colorPalette: "red", onClick: decrementCounter }),
                            Button.Root("+", { variant: "solid", colorPalette: "blue", onClick: incrementCounter }),
                        ], { gap: "2" }),
                    ], { gap: "4", align: "center" });
                }),
                some(`
                    Reactive.Root(_$ => {
                        return Stack.VStack([
                            Badge.Root("Uses Reactive.Root", { colorPalette: "green", variant: "solid" }),
                            Reactive.Root($ => {
                                $(State.initTyped("reactive_factor", true, BooleanType)());
                                const counter = $.let(State.readTyped("reactive_counter", IntegerType)());
                                const factor = $.let(State.readTyped("reactive_factor", BooleanType)());
                                const onChange = East.function([BooleanType], NullType, ($, newValue) => {
                                    $(State.writeTyped("reactive_factor", some(newValue), BooleanType)());
                                })
                                const adjusted = $.let(counter.unwrap('some'))
                                $.if(factor.unwrap('some'),
                                    $ => {
                                        $.assign(adjusted, adjusted.multiply(2n));
                                    },
                                );
                                return Stack.HStack([
                                    Stat.Root("Live Value", East.print(adjusted)),
                                    Switch.Root(factor.unwrap('some'), { onChange })
                                ], { gap: "4", align: "center" });
                            }),
                            Stack.HStack([
                                Button.Root("-", { variant: "solid", colorPalette: "red", onClick: decrementCounter }),
                                Button.Root("+", { variant: "solid", colorPalette: "blue", onClick: incrementCounter }),
                            ], { gap: "2" }),
                        ], { gap: "4", align: "center" });
                    })
                `)
            )
        );

        // =====================================================================
        // Layout
        // =====================================================================

        return Stack.VStack([
            Text.Root("Reactive Components", { fontSize: "lg", fontWeight: "bold" }),
            Text.Root("Compare non-reactive vs reactive state handling. Only Reactive.Root components update when state changes."),
            Grid.Root(
                [
                    Grid.Item(nonReactiveCard),
                    Grid.Item(reactiveCard),
                    Grid.Item(reactiveChartCard),
                    Grid.Item(nestedReactiveCard),
                ],
                { templateColumns: "repeat(2, 1fr)", gap: "4" }
            ),
        ], { gap: "6" });
    }
);
