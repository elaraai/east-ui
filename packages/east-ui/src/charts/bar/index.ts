/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType, type SubtypeExprOrValue, type TypeOf, ArrayType, DictType, East, Expr, LiteralValueType, none, some, StringType, StructType, variant
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import {
    BarLayoutType,
    StackOffsetType
} from "../types.js";
import type { BarChartStyle, BarChartSeriesConfig } from "./types.js";

// Re-export types
export { BarChartType, type BarChartStyle, type BarChartSeriesConfig } from "./types.js";


// ============================================================================
// Bar Chart Function
// ============================================================================

/**
 * Creates a Bar chart component.
 *
 * @param data - Array of data points
 * @param series - Series configuration keyed by field names from the data type
 * @param style - Optional styling configuration
 * @returns An East expression representing the bar chart component
 *
 * @remarks
 * Bar charts display categorical data with rectangular bars.
 * Use layout="vertical" for horizontal bars, stacked=true for stacked bars,
 * or stackOffset="expand" for 100% stacked bar charts.
 *
 * @example
 * ```ts
 * import { Chart } from "@elaraai/east-ui";
 *
 * // Basic bar chart
 * const chart = Chart.Bar(
 *   [
 *     { type: "Stock", allocation: 60 },
 *     { type: "Crypto", allocation: 45 },
 *     { type: "ETF", allocation: 12 },
 *   ],
 *   { allocation: { color: "teal.solid" } },
 *   {
 *     xAxis: Chart.Axis({ dataKey: "type" }),
 *     grid: Chart.Grid({ show: true }),
 *   }
 * );
 *
 * // Horizontal bar chart
 * const horizontalChart = Chart.Bar(
 *   monthlyData,
 *   { value: { color: "blue.solid" } },
 *   {
 *     layout: "vertical",
 *     yAxis: Chart.Axis({ dataKey: "month" }),
 *   }
 * );
 *
 * // 100% stacked bar chart
 * const stackedChart = Chart.Bar(
 *   osUsageData,
 *   {
 *     windows: { color: "teal.solid", stackId: "a" },
 *     mac: { color: "purple.solid", stackId: "a" },
 *     linux: { color: "blue.solid", stackId: "a" },
 *   },
 *   {
 *     stacked: true,
 *     stackOffset: "expand",
 *     legend: Chart.Legend({ show: true }),
 *   }
 * );
 * ```
 */
export function createBarChart<T extends SubtypeExprOrValue<ArrayType<StructType>>>(
    data: T,
    series: {
        [K in TypeOf<NoInfer<T>> extends ArrayType<StructType> ? keyof TypeOf<NoInfer<T>>["value"]["fields"] : never]?: BarChartSeriesConfig
    },
    style?: BarChartStyle
): ExprType<UIComponentType> {
    const data_expr = East.value(data) as ExprType<ArrayType<StructType>>;
    const data_mapped = data_expr.map(($, datum) => {
        const ret = $.let(new Map(), DictType(StringType, LiteralValueType));
        for (const [field_name, field_type] of Object.entries(Expr.type(data_expr).value.fields)) {
            $(ret.insert(field_name, variant(field_type.type, datum[field_name] as any)));
        }
        return ret
    });
    const series_mapped = Object.entries(series as Record<string, BarChartSeriesConfig>).map(([name, config]) => ({
        name: name as string,
        color: config?.color !== undefined ? some(config.color) : none,
        stackId: config?.stackId !== undefined ? some(config.stackId) : none,
        label: config?.label !== undefined ? some(config.label) : none,
        stroke: config?.stroke !== undefined ? some(config.stroke) : none,
        strokeWidth: config?.strokeWidth !== undefined ? some(config.strokeWidth) : none,
        fill: config?.fill !== undefined ? some(config.fill) : none,
        fillOpacity: config?.fillOpacity !== undefined ? some(config.fillOpacity) : none,
        strokeDasharray: config?.strokeDasharray !== undefined ? some(config.strokeDasharray) : none,
    }));

    const layoutValue = style?.layout
        ? (typeof style.layout === "string"
            ? East.value(variant(style.layout, null), BarLayoutType)
            : style.layout)
        : undefined;

    const stackOffsetValue = style?.stackOffset
        ? (typeof style.stackOffset === "string"
            ? East.value(variant(style.stackOffset, null), StackOffsetType)
            : style.stackOffset)
        : undefined;

    return East.value(variant("BarChart", {
        data: data_mapped,
        series: series_mapped,
        xAxis: style?.xAxis ? variant("some", style.xAxis) : variant("none", null),
        yAxis: style?.yAxis ? variant("some", style.yAxis) : variant("none", null),
        layout: layoutValue ? variant("some", layoutValue) : variant("none", null),
        stacked: style?.stacked !== undefined ? variant("some", style.stacked) : variant("none", null),
        stackOffset: stackOffsetValue ? variant("some", stackOffsetValue) : variant("none", null),
        grid: style?.grid !== undefined ? variant("some", style.grid) : variant("none", null),
        tooltip: style?.tooltip !== undefined ? variant("some", style.tooltip) : variant("none", null),
        legend: style?.legend !== undefined ? variant("some", style.legend) : variant("none", null),
        margin: style?.margin !== undefined ? variant("some", style.margin) : variant("none", null),
        barSize: style?.barSize !== undefined ? variant("some", style.barSize) : variant("none", null),
        barGap: style?.barGap !== undefined ? variant("some", style.barGap) : variant("none", null),
        radius: style?.radius !== undefined ? variant("some", style.radius) : variant("none", null),
    }), UIComponentType);
}
