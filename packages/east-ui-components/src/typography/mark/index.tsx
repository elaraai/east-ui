/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Mark as ChakraMark, type MarkProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Mark } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define the equality function at module level
const markEqual = equalFor(Mark.Types.Mark);

/** East Mark value type */
export type MarkValue = ValueTypeOf<typeof Mark.Types.Mark>;

/**
 * Converts an East UI Mark value to Chakra UI Mark props.
 * Pure function - easy to test independently.
 */
export function toChakraMark(value: MarkValue): MarkProps {
    return {
        variant: getSomeorUndefined(value.variant)?.type,
        colorPalette: getSomeorUndefined(value.colorPalette),
    };
}

export interface EastChakraMarkProps {
    value: MarkValue;
}

/**
 * Renders an East UI Mark value using Chakra UI Mark component.
 */
export const EastChakraMark = memo(function EastChakraMark({ value }: EastChakraMarkProps) {
    const props = useMemo(() => toChakraMark(value), [value]);

    return <ChakraMark {...props}>{value.value}</ChakraMark>;
}, (prev, next) => markEqual(prev.value, next.value));
