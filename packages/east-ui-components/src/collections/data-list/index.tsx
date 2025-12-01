/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { memo, useMemo } from "react";
import {
    DataList as ChakraDataList,
    type DataListRootProps,
} from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { DataList } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define equality functions at module level
const dataListRootEqual = equalFor(DataList.Types.Root);

/** East DataList Root value type */
export type DataListRootValue = ValueTypeOf<typeof DataList.Types.Root>;

/** East DataList Item value type */
export type DataListItemValue = ValueTypeOf<typeof DataList.Types.Item>;

/**
 * Converts an East UI DataList Root value to Chakra UI DataListRoot props.
 * Pure function - easy to test independently.
 */
export function toChakraDataListRoot(value: DataListRootValue): DataListRootProps {
    return {
        orientation: getSomeorUndefined(value.orientation)?.type,
        size: getSomeorUndefined(value.size)?.type,
        variant: getSomeorUndefined(value.variant)?.type,
    };
}

export interface EastChakraDataListProps {
    value: DataListRootValue;
}

/**
 * Renders an East UI DataList value using Chakra UI DataList components.
 */
export const EastChakraDataList = memo(function EastChakraDataList({ value }: EastChakraDataListProps) {
    const props = useMemo(() => toChakraDataListRoot(value), [value]);

    return (
        <ChakraDataList.Root {...props}>
            {value.items.map((item, index) => (
                <ChakraDataList.Item key={index}>
                    <ChakraDataList.ItemLabel>{item.label}</ChakraDataList.ItemLabel>
                    <ChakraDataList.ItemValue>{item.value}</ChakraDataList.ItemValue>
                </ChakraDataList.Item>
            ))}
        </ChakraDataList.Root>
    );
}, (prev, next) => dataListRootEqual(prev.value, next.value));
