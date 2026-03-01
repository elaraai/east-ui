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
    const padding = getSomeorUndefined(value.padding);
    const margin = getSomeorUndefined(value.margin);

    return {
        variant: getSomeorUndefined(value.variant)?.type,
        colorPalette: getSomeorUndefined(value.colorPalette),
        textDecoration: getSomeorUndefined(value.textDecoration)?.type,
        overflow: getSomeorUndefined(value.overflow)?.type,
        overflowX: getSomeorUndefined(value.overflowX)?.type,
        overflowY: getSomeorUndefined(value.overflowY)?.type,
        width: getSomeorUndefined(value.width),
        height: getSomeorUndefined(value.height),
        minWidth: getSomeorUndefined(value.minWidth),
        minHeight: getSomeorUndefined(value.minHeight),
        maxWidth: getSomeorUndefined(value.maxWidth),
        maxHeight: getSomeorUndefined(value.maxHeight),
        pt: padding ? getSomeorUndefined(padding.top) : undefined,
        pr: padding ? getSomeorUndefined(padding.right) : undefined,
        pb: padding ? getSomeorUndefined(padding.bottom) : undefined,
        pl: padding ? getSomeorUndefined(padding.left) : undefined,
        mt: margin ? getSomeorUndefined(margin.top) : undefined,
        mr: margin ? getSomeorUndefined(margin.right) : undefined,
        mb: margin ? getSomeorUndefined(margin.bottom) : undefined,
        ml: margin ? getSomeorUndefined(margin.left) : undefined,
        lineHeight: getSomeorUndefined(value.lineHeight),
        letterSpacing: getSomeorUndefined(value.letterSpacing),
        opacity: getSomeorUndefined(value.opacity),
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
