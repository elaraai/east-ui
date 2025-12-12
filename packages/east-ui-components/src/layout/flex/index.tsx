/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Flex as ChakraFlex, type FlexProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Flex } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";

// Pre-define the equality function at module level
const flexEqual = equalFor(Flex.Types.Flex);

/** East Flex value type */
export type FlexValue = ValueTypeOf<typeof Flex.Types.Flex>;

/**
 * Converts an East UI Flex value to Chakra UI Flex props.
 * Pure function - easy to test independently.
 *
 * @param value - The East Flex value
 * @returns Chakra Flex props
 */
export function toChakraFlex(value: FlexValue): FlexProps {
    const style = getSomeorUndefined(value.style);
    const padding = style ? getSomeorUndefined(style.padding) : undefined;
    const margin = style ? getSomeorUndefined(style.margin) : undefined;

    return {
        direction: style ? getSomeorUndefined(style.direction)?.type : undefined,
        wrap: style ? getSomeorUndefined(style.wrap)?.type : undefined,
        justifyContent: style ? getSomeorUndefined(style.justifyContent)?.type : undefined,
        alignItems: style ? getSomeorUndefined(style.alignItems)?.type : undefined,
        gap: style ? getSomeorUndefined(style.gap) : undefined,
        width: style ? getSomeorUndefined(style.width) : undefined,
        height: style ? getSomeorUndefined(style.height) : undefined,
        minHeight: style ? getSomeorUndefined(style.minHeight) : undefined,
        minWidth: style ? getSomeorUndefined(style.minWidth) : undefined,
        maxHeight: style ? getSomeorUndefined(style.maxHeight) : undefined,
        maxWidth: style ? getSomeorUndefined(style.maxWidth) : undefined,
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
        overflow: style ? getSomeorUndefined(style.overflow)?.type : undefined,
        overflowX: style ? getSomeorUndefined(style.overflowX)?.type : undefined,
        overflowY: style ? getSomeorUndefined(style.overflowY)?.type : undefined,
    };
}

export interface EastChakraFlexProps {
    value: FlexValue;
}

/**
 * Renders an East UI Flex value using Chakra UI Flex component.
 */
export const EastChakraFlex = memo(function EastChakraFlex({ value }: EastChakraFlexProps) {
    const props = useMemo(() => toChakraFlex(value), [value]);

    return (
        <ChakraFlex {...props}>
            {value.children.map((child, index) => (
                <EastChakraComponent key={index} value={child} />
            ))}
        </ChakraFlex>
    );
}, (prev, next) => flexEqual(prev.value, next.value));
