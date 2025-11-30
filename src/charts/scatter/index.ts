/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type ExprType, type SubtypeExprOrValue, type TypeOf, ArrayType, DictType, East, Expr, LiteralValueType, none, some, StringType, StructType, variant
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import type { ScatterChartStyle, ScatterChartSeriesConfig } from "./types.js";

// Re-export types
export { ScatterChartType, type ScatterChartStyle, type ScatterChartSeriesConfig } from "./types.js";

// ============================================================================
// Scatter Chart Function
// ============================================================================

/**
 * Creates a Scatter chart component.
 *
 * @param data - Array of data points
 * @param series - Series configuration keyed by field names from the data type
 * @param style - Optional styling configuration
 * @returns An East expression representing the scatter chart component
 *
 * @remarks
 * Scatter charts display data points on a 2D coordinate plane.
 * Useful for showing correlations between variables.
 *
 * @example
 * ```ts
 * import { Chart } from "@elaraai/east-ui";
 *
 * const chart = Chart.Scatter(
 *   [
 *     { height: 170, weight: 65 },
 *     { height: 180, weight: 80 },
 *   ],
 *   { data: { color: "blue.solid" } },
 *   {
 *     xDataKey: "height",
 *     yDataKey: "weight",
 *     grid: Chart.Grid({ show: true }),
 *   }
 * );
 * ```
 */
export function createScatterChart<T extends SubtypeExprOrValue<ArrayType<StructType>>>(
    data: T,
    series: {
        [K in TypeOf<NoInfer<T>> extends ArrayType<StructType> ? keyof TypeOf<NoInfer<T>>["value"]["fields"] : never]?: ScatterChartSeriesConfig
    },
    style?: ScatterChartStyle
): ExprType<UIComponentType> {
    const data_expr = East.value(data) as ExprType<ArrayType<StructType>>;
    const data_mapped = data_expr.map(($, datum) => {
        const ret = $.let(new Map(), DictType(StringType, LiteralValueType));
        for (const [field_name, field_type] of Object.entries(Expr.type(data_expr).value.fields)) {
            $(ret.insert(field_name, variant(field_type.type, datum[field_name] as any)));
        }
        return ret
    });
    const series_mapped = Object.entries(series as Record<string, ScatterChartSeriesConfig>).map(([name, config]) => ({
        name: name as string,
        color: config?.color !== undefined ? some(config.color) : none,
        stackId: none,
        label: config?.label !== undefined ? some(config.label) : none,
        stroke: none,
        strokeWidth: none,
        fill: config?.fill !== undefined ? some(config.fill) : none,
        fillOpacity: none,
        strokeDasharray: none,
    }));

    return East.value(variant("ScatterChart", {
        data: data_mapped,
        series: series_mapped,
        xAxis: style?.xAxis ? variant("some", style.xAxis) : variant("none", null),
        yAxis: style?.yAxis ? variant("some", style.yAxis) : variant("none", null),
        xDataKey: style?.xDataKey !== undefined ? variant("some", style.xDataKey) : variant("none", null),
        yDataKey: style?.yDataKey !== undefined ? variant("some", style.yDataKey) : variant("none", null),
        grid: style?.grid !== undefined ? variant("some", style.grid) : variant("none", null),
        tooltip: style?.tooltip !== undefined ? variant("some", style.tooltip) : variant("none", null),
        legend: style?.legend !== undefined ? variant("some", style.legend) : variant("none", null),
        margin: style?.margin !== undefined ? variant("some", style.margin) : variant("none", null),
        pointSize: style?.pointSize !== undefined ? variant("some", style.pointSize) : variant("none", null),
    }), UIComponentType);
}
