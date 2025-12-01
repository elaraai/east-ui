/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { memo, useMemo } from "react";
import { Progress as ChakraProgress, type ProgressRootProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Progress } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define equality function at module level
const progressEqual = equalFor(Progress.Types.Progress);

/** East Progress value type */
export type ProgressValue = ValueTypeOf<typeof Progress.Types.Progress>;

/**
 * Converts an East UI Progress value to Chakra UI Progress props.
 * Pure function - easy to test independently.
 */
export function toChakraProgress(value: ProgressValue): ProgressRootProps {
    return {
        value: value.value,
        min: getSomeorUndefined(value.min),
        max: getSomeorUndefined(value.max),
        colorPalette: getSomeorUndefined(value.colorPalette)?.type,
        size: getSomeorUndefined(value.size)?.type,
        variant: getSomeorUndefined(value.variant)?.type as ProgressRootProps["variant"],
        striped: getSomeorUndefined(value.striped),
        animated: getSomeorUndefined(value.animated),
    };
}

export interface EastChakraProgressProps {
    value: ProgressValue;
}

/**
 * Renders an East UI Progress value using Chakra UI Progress component.
 */
export const EastChakraProgress = memo(function EastChakraProgress({ value }: EastChakraProgressProps) {
    const props = useMemo(() => toChakraProgress(value), [value]);
    const label = useMemo(() => getSomeorUndefined(value.label), [value.label]);
    const valueText = useMemo(() => getSomeorUndefined(value.valueText), [value.valueText]);

    return (
        <ChakraProgress.Root {...props}>
            {(label || valueText) && (
                <ChakraProgress.Label>
                    {label}
                    {valueText && <ChakraProgress.ValueText>{valueText}</ChakraProgress.ValueText>}
                </ChakraProgress.Label>
            )}
            <ChakraProgress.Track>
                <ChakraProgress.Range />
            </ChakraProgress.Track>
        </ChakraProgress.Root>
    );
}, (prev, next) => progressEqual(prev.value, next.value));
