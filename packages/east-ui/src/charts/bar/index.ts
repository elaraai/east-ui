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
    StackOffsetType,
    MultiSeriesDataType,
} from "../types.js";
import type { BarChartStyle, BarChartSeriesConfig } from "./types.js";

// Re-export types
export { BarChartType, type BarChartStyle, type BarChartSeriesConfig } from "./types.js";


// ============================================================================
// Bar Chart Function
// ============================================================================

/**
 * Helper to check if data is in record form (multiple series arrays).
 */
function isRecordForm(data: unknown): data is Record<string, unknown> {
    if (data === null || data === undefined) return false;
    if (Array.isArray(data)) return false;
    if (typeof data !== "object") return false;
    const keys = Object.keys(data);
    if (keys.length === 0) return false;
    return keys.some(key => Array.isArray((data as Record<string, unknown>)[key]));
}

/**
 * Helper to map a single array to Dict format.
 */
function mapArrayToDict(data_expr: ExprType<ArrayType<StructType>>): ExprType<ArrayType<DictType<typeof StringType, typeof LiteralValueType>>> {
    return data_expr.map(($, datum) => {
        const ret = $.let(new Map(), DictType(StringType, LiteralValueType));
        for (const [field_name, field_type] of Object.entries(Expr.type(data_expr).value.fields)) {
            $(ret.insert(field_name, variant(field_type.type, datum[field_name] as any)));
        }
        return ret;
    });
}

/**
 * Creates a Bar chart component.
 *
 * @param data - Array of data points, OR a record of arrays for multi-series sparse data
 * @param series - Series configuration keyed by field names (array form) or record keys (record form)
 * @param style - Optional styling configuration
 * @returns An East expression representing the bar chart component
 *
 * @remarks
 * Bar charts display categorical data with rectangular bars.
 * Use layout="vertical" for horizontal bars, stacked=true for stacked bars,
 * or stackOffset="expand" for 100% stacked bar charts.
 *
 * Supports two data formats:
 * - **Single array**: All series share the same data points. Series keys are field names.
 * - **Record of arrays**: Each series has its own array (for sparse data). Series keys are record keys.
 *   Use `style.valueKey` to specify which field contains the Y value in each array.
 *
 * @example Single array form
 * ```ts
 * Chart.Bar(
 *     [
 *         { category: "A", value: 100n },
 *         { category: "B", value: 200n },
 *     ],
 *     { value: { color: "blue.solid" } },
 *     { xAxis: Chart.Axis({ dataKey: "category" }) }
 * );
 * ```
 *
 * @example Record form (for sparse data)
 * ```ts
 * Chart.Bar(
 *     {
 *         sales: [{ month: "Jan", value: 186n }, { month: "Feb", value: 305n }],
 *         returns: [{ month: "Jan", value: 20n }, { month: "Mar", value: 35n }],
 *     },
 *     {
 *         sales: { color: "teal.solid" },
 *         returns: { color: "red.solid" },
 *     },
 *     { xAxis: Chart.Axis({ dataKey: "month" }), valueKey: "value" }
 * );
 * ```
 */
// Overload 1: Single array form
export function createBarChart<T extends SubtypeExprOrValue<ArrayType<StructType>>>(
    data: T,
    series: {
        [K in TypeOf<NoInfer<T>> extends ArrayType<StructType> ? keyof TypeOf<NoInfer<T>>["value"]["fields"] : never]?: BarChartSeriesConfig
    },
    style?: BarChartStyle
): ExprType<UIComponentType>;

// Overload 2: Record form (multi-series)
export function createBarChart<K extends string, T extends SubtypeExprOrValue<ArrayType<StructType>>>(
    data: Record<K, T>,
    series: { [P in K]?: BarChartSeriesConfig },
    style?: BarChartStyle
): ExprType<UIComponentType>;

// Implementation
export function createBarChart(
    data: SubtypeExprOrValue<ArrayType<StructType>> | Record<string, SubtypeExprOrValue<ArrayType<StructType>>>,
    series: Record<string, BarChartSeriesConfig | undefined>,
    style?: BarChartStyle
): ExprType<UIComponentType> {
    let data_mapped: ExprType<ArrayType<DictType<typeof StringType, typeof LiteralValueType>>>;
    let dataSeries_mapped: ExprType<typeof MultiSeriesDataType> | undefined;

    if (isRecordForm(data)) {
        const dataRecord = data as Record<string, SubtypeExprOrValue<ArrayType<StructType>>>;
        data_mapped = East.value([], ArrayType(DictType(StringType, LiteralValueType)));
        const seriesDataMap = new Map<string, ExprType<ArrayType<DictType<typeof StringType, typeof LiteralValueType>>>>();
        for (const [seriesName, seriesData] of Object.entries(dataRecord)) {
            const series_expr = East.value(seriesData) as ExprType<ArrayType<StructType>>;
            seriesDataMap.set(seriesName, mapArrayToDict(series_expr));
        }
        dataSeries_mapped = East.value(seriesDataMap, MultiSeriesDataType);
    } else {
        const data_expr = East.value(data) as ExprType<ArrayType<StructType>>;
        data_mapped = mapArrayToDict(data_expr);
        dataSeries_mapped = undefined;
    }

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
        dataSeries: dataSeries_mapped ? variant("some", dataSeries_mapped) : variant("none", null),
        valueKey: style?.valueKey !== undefined ? variant("some", style.valueKey) : variant("none", null),
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
