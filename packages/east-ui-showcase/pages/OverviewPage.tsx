/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    Box,
    Card,
    Heading,
    Text,
    Stack,
    Badge,
    HStack,
    VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved, faShuffle, faPuzzlePiece, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { EastFunction } from "@elaraai/east-ui-components";
import { East, some, FloatType, NullType, StructType, StringType } from "@elaraai/east";
import {
    UIComponentType,
    Stack as EastStack,
    Chart,
    Field,
    State,
    Reactive,
    Box as EastBox,
} from "@elaraai/east-ui";
import { ShowcaseCard } from "../showcases/components";

// Data point type for the chart
const DataPointType = StructType({
    month: StringType,
    actual: FloatType,
    forecast: FloatType,
});

// Interactive demo: Dual-axis chart with slider-controlled projection
const interactiveDemoShowcase = East.function([], UIComponentType, ($) => {
    // Initialize state for the growth multiplier
    $(State.initTyped("demo_multiplier", 1.5, FloatType)());

    // Callback to update multiplier from slider
    const onSliderChange = East.function([FloatType], NullType, ($, value) => {
        $(State.writeTyped("demo_multiplier", some(value), FloatType)());
    });

    const content = $.let(EastBox.Root([
        Reactive.Root($ => {
            // Month names as East array
            const monthNames = $.const(["Jan", "Feb", "Mar", "Apr", "May", "Jun"]);

            const multiplier = $.let(State.readTyped("demo_multiplier", FloatType)().unwrap('some'));

            // Generate chart data dynamically based on multiplier
            // actual: base curve that flattens and shifts down as m increases
            // forecast: exponential growth that accelerates in later months as m increases
            const data = $.let(East.Array.generate(6n, DataPointType, ($, i) => {
                const idx = $.let(i.toFloat());
                const baseActual = $.let(East.value(100.0).add(idx.multiply(20.0)));
                const baseForecast = $.let(East.value(80.0).add(idx.multiply(15.0)));

                // actual = base * (3-m)/2 + seasonal variation that dampens with m
                const seasonal = $.let(idx.multiply(0.5).add(1.0));
                const actualValue = $.let(baseActual
                    .multiply(East.value(3.0).sub(multiplier).divide(2.0))
                    .add(seasonal.multiply(East.value(2.0).sub(multiplier)).multiply(15.0)));

                // forecast = base * m * (1 + idx * m * 0.1) - compounds more in later months
                const growthFactor = $.let(East.value(1.0).add(idx.multiply(multiplier).multiply(0.08)));
                const forecastValue = $.let(baseForecast.multiply(multiplier).multiply(growthFactor));

                $.return({
                    month: monthNames.get(i),
                    actual: actualValue,
                    forecast: forecastValue,
                });
            }));

            return EastStack.VStack([
                // Controls
                Field.Slider("Growth Factor", multiplier, {
                    min: 0.5,
                    max: 3.0,
                    step: 0.1,
                    colorPalette: "purple",
                    onChange: onSliderChange,
                    helperText: "Adjust to see how forecast diverges from actual",
                }),
                // Chart
                EastBox.Root([
                    Chart.Composed(data, {
                        xAxis: { dataKey: "month" },
                        yAxis: {
                            label: "Actual",
                            tickFormat: Chart.TickFormat.Currency({ currency: "USD", compact: "short" }),
                        },
                        yAxis2: {
                            label: "Forecast",
                            tickFormat: Chart.TickFormat.Currency({ currency: "USD", compact: "short" }),
                        },
                        series: {
                            actual: { type: "line", color: "teal.solid", yAxisId: "left", strokeWidth: 3n, showDots: true },
                            forecast: { type: "area", color: "purple.solid", yAxisId: "right", fillOpacity: 0.3 },
                        },
                        grid: { show: true },
                        tooltip: { show: true },
                        legend: { show: true },
                        curveType: "natural",
                    }),
                ], { height: "280px", width: "100%" }),
            ], { gap: "4", align: "stretch" });
        }),
    ], { width: "100%" }));

    return ShowcaseCard(
        "Interactive Dashboard",
        "Reactive chart with dynamically generated data using State, Reactive, Array.generate, and Field.Slider",
        content,
        some(`
const DataPointType = StructType({ month: StringType, actual: FloatType, forecast: FloatType });

const Dashboard = East.function([], UIComponentType, ($) => {
    $(State.initTyped("multiplier", 1.5, FloatType)());
    const onSliderChange = East.function([FloatType], NullType, ($, v) => {
        $(State.writeTyped("multiplier", some(v), FloatType)());
    });

    return Reactive.Root($ => {
        const months = $.const(["Jan", "Feb", "Mar", "Apr", "May", "Jun"]);
        const m = $.let(State.readTyped("multiplier", FloatType)().unwrap('some'));

        // Generate data dynamically - curves change shape as m changes
        const data = $.let(East.Array.generate(6n, DataPointType, ($, i) => {
            const idx = $.let(i.toFloat());
            const base = $.let(East.value(100.0).add(idx.multiply(20.0)));
            const actual = $.let(base.multiply(East.value(3.0).sub(m).divide(2.0)));
            const forecast = $.let(base.multiply(m).multiply(
                East.value(1.0).add(idx.multiply(m).multiply(0.08))
            ));
            $.return({ month: months.get(i), actual, forecast });
        }));

        return Stack.VStack([
            Field.Slider("Growth Factor", m, {
                min: 0.5, max: 3.0, onChange: onSliderChange,
                helperText: "Adjust to see how forecast diverges from actual",
            }),
            Chart.Composed(data, {
                xAxis: { dataKey: "month" },
                series: {
                    actual: { type: "line", yAxisId: "left" },
                    forecast: { type: "area", yAxisId: "right" },
                },
            }),
        ]);
    });
});
        `)
    );
});

const interactiveDemoShowcaseIR = interactiveDemoShowcase.toIR();

export function OverviewPage() {
    return (
        <Stack gap={6}>
            {/* Hero Section */}
            <Card.Root variant="elevated" p={6}>
                <Stack gap={5}>
                    <HStack gap={3}>
                        <Heading size="2xl">East UI</Heading>
                        <Badge colorPalette="purple" variant="solid">Beta</Badge>
                    </HStack>
                    <Text fontSize="lg" color="gray.600">
                        A type-safe UI component library for the East language. Build portable,
                        serializable UI definitions that can be rendered anywhere.
                    </Text>
                    <VStack gap={3} align="stretch">
                        <HStack gap={3} align="flex-start">
                            <Box color="blue.500" mt={1}><FontAwesomeIcon icon={faShieldHalved} /></Box>
                            <Text color="gray.700">
                                <Text as="span" fontWeight="semibold">Type Safety</Text> — Full compile-time checking of component structure and styling
                            </Text>
                        </HStack>
                        <HStack gap={3} align="flex-start">
                            <Box color="green.500" mt={1}><FontAwesomeIcon icon={faShuffle} /></Box>
                            <Text color="gray.700">
                                <Text as="span" fontWeight="semibold">Portability</Text> — UI definitions can be serialized and rendered in any environment
                            </Text>
                        </HStack>
                        <HStack gap={3} align="flex-start">
                            <Box color="purple.500" mt={1}><FontAwesomeIcon icon={faPuzzlePiece} /></Box>
                            <Text color="gray.700">
                                <Text as="span" fontWeight="semibold">Composability</Text> — Components are just East functions that return typed values
                            </Text>
                        </HStack>
                        <HStack gap={3} align="flex-start">
                            <Box color="orange.500" mt={1}><FontAwesomeIcon icon={faLayerGroup} /></Box>
                            <Text color="gray.700">
                                <Text as="span" fontWeight="semibold">Separation of Concerns</Text> — UI logic separate from rendering implementation
                            </Text>
                        </HStack>
                    </VStack>
                </Stack>
            </Card.Root>

            {/* Interactive Example */}
            <Box width="100%">
                <EastFunction ir={interactiveDemoShowcaseIR} />
            </Box>
        </Stack>
    );
}
