/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Text as ChakraText, type TextProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Text } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define the equality function at module level
const textEqual = equalFor(Text.Types.Text);

/** East Text value type */
export type TextValue = ValueTypeOf<typeof Text.Types.Text>;

/**
 * Converts an East UI Text value to Chakra UI Text props.
 * Pure function - easy to test independently.
 *
 * @param value - The East Text value
 * @returns Chakra Text props
 */
export function toChakraText(value: TextValue): TextProps {
    return {
        color: getSomeorUndefined(value.color),
        background: getSomeorUndefined(value.background),
        fontWeight: getSomeorUndefined(value.fontWeight)?.type,
        fontStyle: getSomeorUndefined(value.fontStyle)?.type,
        fontSize: getSomeorUndefined(value.fontSize)?.type,
        textTransform: getSomeorUndefined(value.textTransform)?.type,
        textAlign: getSomeorUndefined(value.textAlign)?.type,
        textOverflow: getSomeorUndefined(value.textOverflow)?.type,
        whiteSpace: getSomeorUndefined(value.whiteSpace)?.type,
        overflow: getSomeorUndefined(value.overflow)?.type,
        borderWidth: getSomeorUndefined(value.borderWidth)?.type,
        borderStyle: getSomeorUndefined(value.borderStyle)?.type,
        borderColor: getSomeorUndefined(value.borderColor),
    };
}

export interface EastChakraTextProps {
    value: TextValue;
}

/**
 * Renders an East UI Text value using Chakra UI Text component.
 */
export const EastChakraText = memo(function EastChakraText({ value }: EastChakraTextProps) {
    const props = useMemo(() => toChakraText(value), [value]);

    return (
        <ChakraText {...props}>
            {value.value}
        </ChakraText>
    );
}, (prev, next) => textEqual(prev.value, next.value));
