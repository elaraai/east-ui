/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { memo, useMemo } from "react";
import { Box as ChakraBox, type BoxProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Box } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";

// Pre-define the equality function at module level
const boxEqual = equalFor(Box.Types.Box);

/** East Box value type */
export type BoxValue = ValueTypeOf<typeof Box.Types.Box>;

/**
 * Converts an East UI Box value to Chakra UI Box props.
 * Pure function - easy to test independently.
 *
 * @param value - The East Box value
 * @returns Chakra Box props
 */
export function toChakraBox(value: BoxValue): BoxProps {
    const style = getSomeorUndefined(value.style);
    const padding = style ? getSomeorUndefined(style.padding) : undefined;
    const margin = style ? getSomeorUndefined(style.margin) : undefined;

    return {
        display: style ? getSomeorUndefined(style.display)?.type : undefined,
        width: style ? getSomeorUndefined(style.width) : undefined,
        height: style ? getSomeorUndefined(style.height) : undefined,
        // Padding struct -> individual props
        pt: padding ? getSomeorUndefined(padding.top) : undefined,
        pr: padding ? getSomeorUndefined(padding.right) : undefined,
        pb: padding ? getSomeorUndefined(padding.bottom) : undefined,
        pl: padding ? getSomeorUndefined(padding.left) : undefined,
        // Margin struct -> individual props
        mt: margin ? getSomeorUndefined(margin.top) : undefined,
        mr: margin ? getSomeorUndefined(margin.right) : undefined,
        mb: margin ? getSomeorUndefined(margin.bottom) : undefined,
        ml: margin ? getSomeorUndefined(margin.left) : undefined,
        background: style ? getSomeorUndefined(style.background) : undefined,
        color: style ? getSomeorUndefined(style.color) : undefined,
        borderRadius: style ? getSomeorUndefined(style.borderRadius) : undefined,
        flexDirection: style ? getSomeorUndefined(style.flexDirection)?.type : undefined,
        justifyContent: style ? getSomeorUndefined(style.justifyContent)?.type : undefined,
        alignItems: style ? getSomeorUndefined(style.alignItems)?.type : undefined,
        gap: style ? getSomeorUndefined(style.gap) : undefined,
    };
}

export interface EastChakraBoxProps {
    value: BoxValue;
}

/**
 * Renders an East UI Box value using Chakra UI Box component.
 */
export const EastChakraBox = memo(function EastChakraBox({ value }: EastChakraBoxProps) {
    const props = useMemo(() => toChakraBox(value), [value]);

    return (
        <ChakraBox {...props}>
            {value.children.map((child, index) => (
                <EastChakraComponent key={index} value={child} />
            ))}
        </ChakraBox>
    );
}, (prev, next) => boxEqual(prev.value, next.value));
