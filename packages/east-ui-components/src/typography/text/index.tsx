/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useCallback } from "react";
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
    const padding = getSomeorUndefined(value.padding);
    const margin = getSomeorUndefined(value.margin);

    return {
        color: getSomeorUndefined(value.color),
        background: getSomeorUndefined(value.background),
        fontWeight: getSomeorUndefined(value.fontWeight)?.type,
        fontStyle: getSomeorUndefined(value.fontStyle)?.type,
        fontSize: getSomeorUndefined(value.fontSize)?.type,
        textTransform: getSomeorUndefined(value.textTransform)?.type,
        textAlign: getSomeorUndefined(value.textAlign)?.type,
        textOverflow: getSomeorUndefined(value.textOverflow)?.type,
        textDecoration: getSomeorUndefined(value.textDecoration)?.type,
        whiteSpace: getSomeorUndefined(value.whiteSpace)?.type,
        overflow: getSomeorUndefined(value.overflow)?.type,
        overflowX: getSomeorUndefined(value.overflowX)?.type,
        overflowY: getSomeorUndefined(value.overflowY)?.type,
        borderWidth: getSomeorUndefined(value.borderWidth)?.type,
        borderStyle: getSomeorUndefined(value.borderStyle)?.type,
        borderColor: getSomeorUndefined(value.borderColor),
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

export interface EastChakraTextProps {
    value: TextValue;
}

/**
 * Renders an East UI Text value using Chakra UI Text component.
 */
export const EastChakraText = memo(function EastChakraText({ value }: EastChakraTextProps) {
    const props = useMemo(() => toChakraText(value), [value]);

    const onClickFn = useMemo(() => getSomeorUndefined(value.onClick), [value.onClick]);

    const handleClick = useCallback(() => {
        if (onClickFn) {
            queueMicrotask(() => onClickFn());
        }
    }, [onClickFn]);

    return (
        <ChakraText {...props} onClick={onClickFn ? handleClick : undefined} cursor={onClickFn ? "pointer" : undefined}>
            {value.value}
        </ChakraText>
    );
}, (prev, next) => textEqual(prev.value, next.value));
