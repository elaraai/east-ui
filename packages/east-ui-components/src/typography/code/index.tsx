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
    return {
        variant: getSomeorUndefined(value.variant)?.type,
        colorPalette: getSomeorUndefined(value.colorPalette),
        size: getSomeorUndefined(value.size)?.type,
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
