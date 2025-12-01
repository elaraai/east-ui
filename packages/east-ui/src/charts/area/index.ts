/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type ExprType, type SubtypeExprOrValue, type TypeOf, ArrayType, DictType, East, Expr, LiteralValueType, none, some, StringType, StructType, variant
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import {
    CurveType,
    StackOffsetType,
} from "../types.js";
import type { AreaChartStyle, AreaChartSeriesConfig } from "./types.js";

// Re-export types
export { AreaChartType, type AreaChartStyle, type AreaChartSeriesConfig } from "./types.js";


// ============================================================================
// Area Chart Function
// ============================================================================

/**
 * Creates an Area chart component.
 *
 * @param data - Array of data points
 * @param series - Series configuration
 * @param style - Optional styling configuration
 * @returns An East expression representing the area chart component
 *
 * @remarks
 * Area charts display quantitative data with filled areas under curves.
 * Use stacked mode to show part-to-whole relationships, or stackOffset="expand"
 * for 100% stacked area charts.
 *
 * @example
 * ```ts
 * import { Chart } from "@elaraai/east-ui";
 *
 * // Basic area chart
 * const chart = Chart.Area(
 *   [
 *     { month: "Jan", revenue: 186 },
 *     { month: "Feb", revenue: 305 },
 *     { month: "Mar", revenue: 237 },
 *   ],
 *   [{ name: "revenue", color: "teal.solid" }],
 *   {
 *     xAxis: { dataKey: "month" },
 *     showGrid: true,
 *     curveType: "natural",
 *   }
 * );
 *
 * // 100% stacked area chart
 * const stackedChart = Chart.Area(
 *   osUsageData,
 *   [
 *     { name: "windows", color: "teal.solid" },
 *     { name: "mac", color: "purple.solid" },
 *     { name: "linux", color: "blue.solid" },
 *   ],
 *   {
 *     stacked: true,
 *     stackOffset: "expand",
 *     showLegend: true,
 *   }
 * );
 * ```
 */
export function createAreaChart<T extends SubtypeExprOrValue<ArrayType<StructType>>>(
    data: T,
    series: {
        [K in TypeOf<NoInfer<T>> extends ArrayType<StructType> ? keyof TypeOf<NoInfer<T>>["value"]["fields"] : never]?: AreaChartSeriesConfig
    },
    style?: AreaChartStyle
): ExprType<UIComponentType> {
    const data_expr = East.value(data) as ExprType<ArrayType<StructType>>;
    const data_mapped = data_expr.map(($, datum) => {
        const ret = $.let(new Map(), DictType(StringType, LiteralValueType));
        for (const [field_name, field_type] of Object.entries(Expr.type(data_expr).value.fields)) {
            $(ret.insert(field_name, variant(field_type.type, datum[field_name] as any)));
        }
        return ret
    });
    const series_mapped = Object.entries(series as Record<string, AreaChartSeriesConfig>).map(([name, config]) => ({
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
    const curveValue = style?.curveType
        ? (typeof style.curveType === "string"
            ? East.value(variant(style.curveType, null), CurveType)
            : style.curveType)
        : undefined;

    const stackOffsetValue = style?.stackOffset
        ? (typeof style.stackOffset === "string"
            ? East.value(variant(style.stackOffset, null), StackOffsetType)
            : style.stackOffset)
        : undefined;

    return East.value(variant("AreaChart", {
        data: data_mapped,
        series: series_mapped,
        xAxis: style?.xAxis ? variant("some", style.xAxis) : variant("none", null),
        yAxis: style?.yAxis ? variant("some", style.yAxis) : variant("none", null),
        curveType: curveValue ? variant("some", curveValue) : variant("none", null),
        stacked: style?.stacked !== undefined ? variant("some", style.stacked) : variant("none", null),
        stackOffset: stackOffsetValue ? variant("some", stackOffsetValue) : variant("none", null),
        grid: style?.grid !== undefined ? variant("some", style.grid) : variant("none", null),
        tooltip: style?.tooltip !== undefined ? variant("some", style.tooltip) : variant("none", null),
        legend: style?.legend !== undefined ? variant("some", style.legend) : variant("none", null),
        margin: style?.margin !== undefined ? variant("some", style.margin) : variant("none", null),
        fillOpacity: style?.fillOpacity !== undefined ? variant("some", style.fillOpacity) : variant("none", null),
        connectNulls: style?.connectNulls !== undefined ? variant("some", style.connectNulls) : variant("none", null),
    }), UIComponentType);
}
