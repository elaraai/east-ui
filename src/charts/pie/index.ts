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
 * import { Chart } from "@elaraai/east-ui";
 *
 * // Pie chart
 * Chart.Pie([
 *   { name: "Desktop", value: 400, color: some("blue.solid") },
 *   { name: "Mobile", value: 300, color: some("orange.solid") },
 * ]);
 *
 * // Donut chart
 * Chart.Pie(data, { innerRadius: 60, outerRadius: 80 });
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
        showLegend: style?.showLegend !== undefined ? variant("some", style.showLegend) : variant("none", null),
        showTooltip: style?.showTooltip !== undefined ? variant("some", style.showTooltip) : variant("none", null),
        width: style?.width !== undefined ? variant("some", style.width) : variant("none", null),
        height: style?.height !== undefined ? variant("some", style.height) : variant("none", null),
    }), UIComponentType);
}
