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
    return {
        as: variant === "ordered" ? "ol" : "ul",
        gap: getSomeorUndefined(value.gap),
        colorPalette: getSomeorUndefined(value.colorPalette),
        ps: "5", // Padding-start for bullet/number markers
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
