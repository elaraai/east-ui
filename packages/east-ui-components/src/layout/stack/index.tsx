/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Stack as ChakraStack, type StackProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Stack } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";

// Pre-define the equality function at module level
const stackEqual = equalFor(Stack.Types.Stack);

/** East Stack value type */
export type StackValue = ValueTypeOf<typeof Stack.Types.Stack>;

/**
 * Converts an East UI Stack value to Chakra UI Stack props.
 * Pure function - easy to test independently.
 *
 * @param value - The East Stack value
 * @returns Chakra Stack props
 */
export function toChakraStack(value: StackValue): StackProps {
    const style = getSomeorUndefined(value.style);
    const padding = style ? getSomeorUndefined(style.padding) : undefined;
    const margin = style ? getSomeorUndefined(style.margin) : undefined;

    return {
        direction: style ? getSomeorUndefined(style.direction)?.type : undefined,
        gap: style ? getSomeorUndefined(style.gap) : undefined,
        align: style ? getSomeorUndefined(style.align)?.type : undefined,
        justify: style ? getSomeorUndefined(style.justify)?.type : undefined,
        wrap: style ? getSomeorUndefined(style.wrap)?.type : undefined,
        pt: padding ? getSomeorUndefined(padding.top) : undefined,
        pr: padding ? getSomeorUndefined(padding.right) : undefined,
        pb: padding ? getSomeorUndefined(padding.bottom) : undefined,
        pl: padding ? getSomeorUndefined(padding.left) : undefined,
        // Margin struct -> individual props
        mt: margin ? getSomeorUndefined(margin.top) : undefined,
        mr: margin ? getSomeorUndefined(margin.right) : undefined,
        mb: margin ? getSomeorUndefined(margin.bottom) : undefined,
        ml: margin ? getSomeorUndefined(margin.left) : undefined, background: style ? getSomeorUndefined(style.background) : undefined,
        width: style ? getSomeorUndefined(style.width) : undefined,
        height: style ? getSomeorUndefined(style.height) : undefined,
    };
}

export interface EastChakraStackProps {
    value: StackValue;
}

/**
 * Renders an East UI Stack value using Chakra UI Stack component.
 */
export const EastChakraStack = memo(function EastChakraStack({ value }: EastChakraStackProps) {
    const props = useMemo(() => toChakraStack(value), [value]);

    return (
        <ChakraStack {...props}>
            {value.children.map((child, index) => (
                <EastChakraComponent key={index} value={child} />
            ))}
        </ChakraStack>
    );
}, (prev, next) => stackEqual(prev.value, next.value));
