/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type ExprType, type SubtypeExprOrValue, type TypeOf, ArrayType, DictType, East, Expr, LiteralValueType, none, some, StringType, StructType, variant
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import type { RadarChartStyle, RadarChartSeriesConfig } from "./types.js";

// Re-export types
export { RadarChartType, type RadarChartStyle, type RadarChartSeriesConfig } from "./types.js";

// ============================================================================
// Radar Chart Function
// ============================================================================

/**
 * Creates a Radar chart component.
 *
 * @param data - Array of data points
 * @param series - Series configuration keyed by field names from the data type
 * @param style - Optional styling configuration
 * @returns An East expression representing the radar chart component
 *
 * @remarks
 * Radar charts display multivariate data on radial axes.
 * Each axis represents a different variable.
 *
 * @example
 * ```ts
 * import { Chart } from "@elaraai/east-ui";
 *
 * const chart = Chart.Radar(
 *   [
 *     { subject: "Math", current: 80, target: 90 },
 *     { subject: "Science", current: 95, target: 85 },
 *   ],
 *   {
 *     current: { color: "teal.solid" },
 *     target: { color: "orange.solid" },
 *   },
 *   {
 *     dataKey: "subject",
 *     grid: Chart.Grid({ show: true }),
 *     fillOpacity: 0.3,
 *   }
 * );
 * ```
 */
export function createRadarChart<T extends SubtypeExprOrValue<ArrayType<StructType>>>(
    data: T,
    series: {
        [K in TypeOf<NoInfer<T>> extends ArrayType<StructType> ? keyof TypeOf<NoInfer<T>>["value"]["fields"] : never]?: RadarChartSeriesConfig
    },
    style?: RadarChartStyle
): ExprType<UIComponentType> {
    const data_expr = East.value(data) as ExprType<ArrayType<StructType>>;
    const data_mapped = data_expr.map(($, datum) => {
        const ret = $.let(new Map(), DictType(StringType, LiteralValueType));
        for (const [field_name, field_type] of Object.entries(Expr.type(data_expr).value.fields)) {
            $(ret.insert(field_name, variant(field_type.type, datum[field_name] as any)));
        }
        return ret
    });
    const series_mapped = Object.entries(series as Record<string, RadarChartSeriesConfig>).map(([name, config]) => ({
        name: name as string,
        color: config?.color !== undefined ? some(config.color) : none,
        stackId: none,
        label: config?.label !== undefined ? some(config.label) : none,
        stroke: config?.stroke !== undefined ? some(config.stroke) : none,
        strokeWidth: config?.strokeWidth !== undefined ? some(config.strokeWidth) : none,
        fill: config?.fill !== undefined ? some(config.fill) : none,
        fillOpacity: config?.fillOpacity !== undefined ? some(config.fillOpacity) : none,
        strokeDasharray: config?.strokeDasharray !== undefined ? some(config.strokeDasharray) : none,
    }));

    return East.value(variant("RadarChart", {
        data: data_mapped,
        series: series_mapped,
        dataKey: style?.dataKey !== undefined ? variant("some", style.dataKey) : variant("none", null),
        grid: style?.grid !== undefined ? variant("some", style.grid) : variant("none", null),
        tooltip: style?.tooltip !== undefined ? variant("some", style.tooltip) : variant("none", null),
        legend: style?.legend !== undefined ? variant("some", style.legend) : variant("none", null),
        margin: style?.margin !== undefined ? variant("some", style.margin) : variant("none", null),
        fillOpacity: style?.fillOpacity !== undefined ? variant("some", style.fillOpacity) : variant("none", null),
    }), UIComponentType);
}
