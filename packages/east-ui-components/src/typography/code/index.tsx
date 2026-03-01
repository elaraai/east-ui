/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Code as ChakraCode, type CodeProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Code } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define the equality function at module level
const codeEqual = equalFor(Code.Types.Code);

/** East Code value type */
export type CodeValue = ValueTypeOf<typeof Code.Types.Code>;

/**
 * Converts an East UI Code value to Chakra UI Code props.
 * Pure function - easy to test independently.
 */
export function toChakraCode(value: CodeValue): CodeProps {
    const padding = getSomeorUndefined(value.padding);
    const margin = getSomeorUndefined(value.margin);

    return {
        variant: getSomeorUndefined(value.variant)?.type,
        colorPalette: getSomeorUndefined(value.colorPalette),
        size: getSomeorUndefined(value.size)?.type,
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

export interface EastChakraCodeProps {
    value: CodeValue;
}

/**
 * Renders an East UI Code value using Chakra UI Code component.
 */
export const EastChakraCode = memo(function EastChakraCode({ value }: EastChakraCodeProps) {
    const props = useMemo(() => toChakraCode(value), [value]);

    return <ChakraCode {...props}>{value.value}</ChakraCode>;
}, (prev, next) => codeEqual(prev.value, next.value));
