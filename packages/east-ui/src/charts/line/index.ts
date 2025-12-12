/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType, type SubtypeExprOrValue, type TypeOf, ArrayType, DictType, East, Expr, LiteralValueType, none, some, StringType, StructType, variant
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import { CurveType } from "../types.js";
import type { LineChartStyle, LineChartSeriesConfig } from "./types.js";

// Re-export types
export { LineChartType, type LineChartStyle, type LineChartSeriesConfig } from "./types.js";

// ============================================================================
// Line Chart Function
// ============================================================================

/**
 * Creates a Line chart component.
 *
 * @param data - Array of data points
 * @param series - Series configuration keyed by field names from the data type
 * @param style - Optional styling configuration
 * @returns An East expression representing the line chart component
 *
 * @remarks
 * Line charts display data points connected by line segments.
 * Ideal for showing trends over time.
 *
 * @example
 * ```ts
 * import { East } from "@elaraai/east";
 * import { Chart, UIComponentType } from "@elaraai/east-ui";
 *
 * const example = East.function([], UIComponentType, $ => {
 *     return Chart.Line(
 *         [
 *             { month: "Jan", revenue: 186n, profit: 80n },
 *             { month: "Feb", revenue: 305n, profit: 120n },
 *         ],
 *         {
 *             revenue: { color: "teal.solid" },
 *             profit: { color: "purple.solid" },
 *         },
 *         {
 *             xAxis: Chart.Axis({ dataKey: "month" }),
 *             showDots: true,
 *         }
 *     );
 * });
 * ```
 */
export function createLineChart<T extends SubtypeExprOrValue<ArrayType<StructType>>>(
    data: T,
    series: {
        [K in TypeOf<NoInfer<T>> extends ArrayType<StructType> ? keyof TypeOf<NoInfer<T>>["value"]["fields"] : never]?: LineChartSeriesConfig
    },
    style?: LineChartStyle
): ExprType<UIComponentType> {
    const data_expr = East.value(data) as ExprType<ArrayType<StructType>>;
    const data_mapped = data_expr.map(($, datum) => {
        const ret = $.let(new Map(), DictType(StringType, LiteralValueType));
        for (const [field_name, field_type] of Object.entries(Expr.type(data_expr).value.fields)) {
            $(ret.insert(field_name, variant(field_type.type, datum[field_name] as any)));
        }
        return ret
    });
    const series_mapped = Object.entries(series as Record<string, LineChartSeriesConfig>).map(([name, config]) => ({
        name: name as string,
        color: config?.color !== undefined ? some(config.color) : none,
        stackId: none,
        label: config?.label !== undefined ? some(config.label) : none,
        stroke: config?.stroke !== undefined ? some(config.stroke) : none,
        strokeWidth: config?.strokeWidth !== undefined ? some(config.strokeWidth) : none,
        fill: none,
        fillOpacity: none,
        strokeDasharray: config?.strokeDasharray !== undefined ? some(config.strokeDasharray) : none,
    }));

    const curveValue = style?.curveType
        ? (typeof style.curveType === "string"
            ? East.value(variant(style.curveType, null), CurveType)
            : style.curveType)
        : undefined;

    return East.value(variant("LineChart", {
        data: data_mapped,
        series: series_mapped,
        xAxis: style?.xAxis ? variant("some", style.xAxis) : variant("none", null),
        yAxis: style?.yAxis ? variant("some", style.yAxis) : variant("none", null),
        curveType: curveValue ? variant("some", curveValue) : variant("none", null),
        grid: style?.grid !== undefined ? variant("some", style.grid) : variant("none", null),
        tooltip: style?.tooltip !== undefined ? variant("some", style.tooltip) : variant("none", null),
        legend: style?.legend !== undefined ? variant("some", style.legend) : variant("none", null),
        margin: style?.margin !== undefined ? variant("some", style.margin) : variant("none", null),
        showDots: style?.showDots !== undefined ? variant("some", style.showDots) : variant("none", null),
        strokeWidth: style?.strokeWidth !== undefined ? variant("some", style.strokeWidth) : variant("none", null),
        connectNulls: style?.connectNulls !== undefined ? variant("some", style.connectNulls) : variant("none", null),
    }), UIComponentType);
}
