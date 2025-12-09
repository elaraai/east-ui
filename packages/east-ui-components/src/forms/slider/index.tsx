/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useCallback } from "react";
import { Slider as ChakraSlider, type ConditionalValue, type SliderRootProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Slider } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define equality function at module level
const sliderEqual = equalFor(Slider.Types.Slider);

/** East Slider value type */
export type SliderValue = ValueTypeOf<typeof Slider.Types.Slider>;

/**
 * Converts an East UI Slider value to Chakra UI Slider props.
 * Pure function - easy to test independently.
 */
export function toChakraSlider(value: SliderValue): SliderRootProps {
    return {
        value: [value.value],
        min: getSomeorUndefined(value.min),
        max: getSomeorUndefined(value.max),
        step: getSomeorUndefined(value.step),
        orientation: getSomeorUndefined(value.orientation)?.type,
        colorPalette: getSomeorUndefined(value.colorPalette)?.type,
        size: getSomeorUndefined(value.size)?.type as ConditionalValue<"sm" | "md" | "lg" | undefined>,
        variant: getSomeorUndefined(value.variant)?.type as ConditionalValue<"outline" | "solid" | undefined>,
        disabled: getSomeorUndefined(value.disabled),
    };
}

export interface EastChakraSliderProps {
    value: SliderValue;
}

/**
 * Renders an East UI Slider value using Chakra UI Slider component.
 */
export const EastChakraSlider = memo(function EastChakraSlider({ value }: EastChakraSliderProps) {
    const props = useMemo(() => toChakraSlider(value), [value]);
    const onChangeFn = useMemo(() => getSomeorUndefined(value.onChange), [value.onChange]);
    const onChangeEndFn = useMemo(() => getSomeorUndefined(value.onChangeEnd), [value.onChangeEnd]);

    const handleValueChange = useCallback((details: { value: number[] }) => {
        if (onChangeFn && details.value.length > 0) {
            queueMicrotask(() => onChangeFn(details.value[0]!));
        }
    }, [onChangeFn]);

    const handleValueChangeEnd = useCallback((details: { value: number[] }) => {
        if (onChangeEndFn && details.value.length > 0) {
            queueMicrotask(() => onChangeEndFn(details.value[0]!));
        }
    }, [onChangeEndFn]);

    return (
        <ChakraSlider.Root
            {...props}
            onValueChange={onChangeFn ? handleValueChange : undefined}
            onValueChangeEnd={onChangeEndFn ? handleValueChangeEnd : undefined}
        >
            <ChakraSlider.Control>
                <ChakraSlider.Track>
                    <ChakraSlider.Range />
                </ChakraSlider.Track>
                <ChakraSlider.Thumbs />
            </ChakraSlider.Control>
        </ChakraSlider.Root>
    );
}, (prev, next) => sliderEqual(prev.value, next.value));
