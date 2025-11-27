/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type ExprType,
    East,
    ArrayType,
    variant,
    type SubtypeExprOrValue,
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import {
    ChartSortType,
} from "../types.js";
import {
    BarSegmentItemType,
    type BarSegmentStyle,
} from "./types.js";

// Re-export types
export {
    BarSegmentItemType,
    BarSegmentType,
    type BarSegmentStyle,
} from "./types.js";

// ============================================================================
// Bar Segment Function
// ============================================================================

/**
 * Creates a Bar segment component.
 *
 * @param data - Array of segment items
 * @param style - Optional styling configuration
 * @returns An East expression representing the bar segment component
 *
 * @remarks
 * Bar segment displays proportional segments in a single horizontal bar.
 * Like a horizontal stacked bar showing part-to-whole relationships.
 *
 * @example
 * ```ts
 * import { Chart } from "@elaraai/east-ui";
 *
 * Chart.BarSegment(
 *   [
 *     { name: "Google", value: 500000, color: "teal.solid" },
 *     { name: "Direct", value: 100000, color: "blue.solid" },
 *     { name: "Bing", value: 200000, color: "orange.solid" },
 *   ],
 *   {
 *     sort: { by: "value", direction: "desc" },
 *     showValue: true,
 *     showLabel: true,
 *   }
 * );
 * ```
 */
export function createBarSegment(
    data: SubtypeExprOrValue<ArrayType<typeof BarSegmentItemType>>,
    style?: BarSegmentStyle
): ExprType<UIComponentType> {
    const sortValue = style?.sort
        ? East.value({
            by: style.sort.by,
            direction: typeof style.sort.direction === "string"
                ? variant(style.sort.direction, null)
                : style.sort.direction,
        }, ChartSortType)
        : undefined;

    return East.value(variant("BarSegment", {
        data: data,
        sort: sortValue ? variant("some", sortValue) : variant("none", null),
        showValue: style?.showValue !== undefined ? variant("some", style.showValue) : variant("none", null),
        showLabel: style?.showLabel !== undefined ? variant("some", style.showLabel) : variant("none", null),
    }), UIComponentType);
}
