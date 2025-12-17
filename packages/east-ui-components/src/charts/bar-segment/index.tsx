/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { BarSegment, useChart } from "@chakra-ui/charts";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Chart as EastChart } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define the equality function at module level
const barSegmentEqual = equalFor(EastChart.Types.BarSegment);

/** East BarSegment value type */
export type BarSegmentValue = ValueTypeOf<typeof EastChart.Types.BarSegment>;

export interface EastChakraBarSegmentProps {
    value: BarSegmentValue;
}

/**
 * Renders an East UI BarSegment value using Chakra UI BarSegment.
 */
export const EastChakraBarSegment = memo(function EastChakraBarSegment({ value }: EastChakraBarSegmentProps) {
    // Convert East data to Chakra format - each item has its own color
    const data = useMemo(() => value.data.map((item, index) => ({
        name: item.name,
        value: item.value,
        color: getSomeorUndefined(item.color) ?? `chart.${index + 1}`,
    })), [value.data]);

    const showValue = useMemo(() => getSomeorUndefined(value.showValue) ?? false, [value.showValue]);
    const showLabel = useMemo(() => getSomeorUndefined(value.showLabel) ?? true, [value.showLabel]);

    // Build sort config if provided
    const sortConfig = useMemo(() => {
        const sortValue = getSomeorUndefined(value.sort);
        if (!sortValue) return undefined;
        return {
            by: sortValue.by as "name" | "value",
            direction: sortValue.direction.type,
        };
    }, [value.sort]);

    // BarSegment doesn't need series - colors come from each data item
    const chart = useChart({
        data,
        ...(sortConfig && { sort: sortConfig }),
    });

    return (
        <BarSegment.Root chart={chart}>
            <BarSegment.Content>
                <BarSegment.Bar tooltip  />
            </BarSegment.Content>
            {showLabel && (
                <BarSegment.Legend showPercent={showValue} />
            )}
        </BarSegment.Root>
    );
}, (prev, next) => barSegmentEqual(prev.value, next.value));
