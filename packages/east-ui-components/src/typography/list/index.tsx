/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { List as ChakraList, type ListRootProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { List } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define the equality function at module level
const listEqual = equalFor(List.Types.List);

/** East List value type */
export type ListValue = ValueTypeOf<typeof List.Types.List>;

/**
 * Converts an East UI List value to Chakra UI List props.
 * Pure function - easy to test independently.
 */
export function toChakraList(value: ListValue): ListRootProps {
    const variant = getSomeorUndefined(value.variant)?.type;
    const padding = getSomeorUndefined(value.padding);
    const margin = getSomeorUndefined(value.margin);

    return {
        as: variant === "ordered" ? "ol" : "ul",
        gap: getSomeorUndefined(value.gap),
        colorPalette: getSomeorUndefined(value.colorPalette),
        ps: "5", // Padding-start for bullet/number markers
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
        opacity: getSomeorUndefined(value.opacity),
    };
}

export interface EastChakraListProps {
    value: ListValue;
}

/**
 * Renders an East UI List value using Chakra UI List component.
 */
export const EastChakraList = memo(function EastChakraList({ value }: EastChakraListProps) {
    const props = useMemo(() => toChakraList(value), [value]);

    return (
        <ChakraList.Root {...props}>
            {value.items.map((item, index) => (
                <ChakraList.Item key={index}>{item}</ChakraList.Item>
            ))}
        </ChakraList.Root>
    );
}, (prev, next) => listEqual(prev.value, next.value));
