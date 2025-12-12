/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType, type SubtypeExprOrValue, ArrayType, East, variant
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import { PieSliceType, type PieChartStyle } from "./types.js";

// Re-export types
export { PieSliceType, PieChartType, type PieChartStyle } from "./types.js";

// ============================================================================
// Pie Chart Function
// ============================================================================

/**
 * Creates a Pie chart component.
 *
 * @param data - Array of pie slices
 * @param style - Optional styling configuration
 * @returns An East expression representing the pie chart component
 *
 * @remarks
 * Set innerRadius > 0 to create a donut chart.
 *
 * @example
 * ```ts
 * import { East, some } from "@elaraai/east";
 * import { Chart, UIComponentType } from "@elaraai/east-ui";
 *
 * const example = East.function([], UIComponentType, $ => {
 *     return Chart.Pie(
 *         [
 *             { name: "Chrome", value: 275, color: some("blue.solid") },
 *             { name: "Safari", value: 200, color: some("green.solid") },
 *         ],
 *         { showLabels: true }
 *     );
 * });
 * ```
 */
export function createPieChart(
    data: SubtypeExprOrValue<ArrayType<typeof PieSliceType>>,
    style?: PieChartStyle
): ExprType<UIComponentType> {
    return East.value(variant("PieChart", {
        data: data,
        innerRadius: style?.innerRadius !== undefined ? variant("some", style.innerRadius) : variant("none", null),
        outerRadius: style?.outerRadius !== undefined ? variant("some", style.outerRadius) : variant("none", null),
        startAngle: style?.startAngle !== undefined ? variant("some", style.startAngle) : variant("none", null),
        endAngle: style?.endAngle !== undefined ? variant("some", style.endAngle) : variant("none", null),
        paddingAngle: style?.paddingAngle !== undefined ? variant("some", style.paddingAngle) : variant("none", null),
        showLabels: style?.showLabels !== undefined ? variant("some", style.showLabels) : variant("none", null),
        tooltip: style?.tooltip !== undefined ? variant("some", style.tooltip) : variant("none", null),
        legend: style?.legend !== undefined ? variant("some", style.legend) : variant("none", null),
        margin: style?.margin !== undefined ? variant("some", style.margin) : variant("none", null),
    }), UIComponentType);
}
