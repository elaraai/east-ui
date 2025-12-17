/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType, type SubtypeExprOrValue, type TypeOf, ArrayType, DictType, East, Expr, LiteralValueType, none, some, StringType, StructType, variant
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import { MultiSeriesDataType } from "../types.js";
import type { ScatterChartStyle, ScatterChartSeriesConfig } from "./types.js";

// Re-export types
export { ScatterChartType, type ScatterChartStyle, type ScatterChartSeriesConfig } from "./types.js";

// ============================================================================
// Scatter Chart Function
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
 * Creates a Scatter chart component.
 *
 * @param data - Array of data points, OR a record of arrays for multi-series sparse data
 * @param series - Series configuration keyed by field names (array form) or record keys (record form)
 * @param style - Optional styling configuration
 * @returns An East expression representing the scatter chart component
 *
 * @remarks
 * Scatter charts display data points on a 2D coordinate plane.
 * Useful for showing correlations between variables.
 *
 * Supports two data formats:
 * - **Single array**: All series share the same data points. Series keys are field names.
 * - **Record of arrays**: Each series has its own array (for sparse data). Series keys are record keys.
 *   Use `style.valueKey` to specify which field contains the Y value in each array.
 *
 * @example Single array form
 * ```ts
 * Chart.Scatter(
 *     [
 *         { x: 10n, y: 30n },
 *         { x: 20n, y: 40n },
 *     ],
 *     { y: { color: "purple.solid" } },
 *     { xAxis: Chart.Axis({ dataKey: "x" }) }
 * );
 * ```
 *
 * @example Record form (for sparse data)
 * ```ts
 * Chart.Scatter(
 *     {
 *         series1: [{ x: 10n, value: 30n }, { x: 20n, value: 40n }],
 *         series2: [{ x: 15n, value: 35n }, { x: 25n, value: 45n }],
 *     },
 *     {
 *         series1: { color: "purple.solid" },
 *         series2: { color: "teal.solid" },
 *     },
 *     { xAxis: Chart.Axis({ dataKey: "x" }), valueKey: "value" }
 * );
 * ```
 */
// Overload 1: Single array form
export function createScatterChart<T extends SubtypeExprOrValue<ArrayType<StructType>>>(
    data: T,
    series: {
        [K in TypeOf<NoInfer<T>> extends ArrayType<StructType> ? keyof TypeOf<NoInfer<T>>["value"]["fields"] : never]?: ScatterChartSeriesConfig
    },
    style?: ScatterChartStyle
): ExprType<UIComponentType>;

// Overload 2: Record form (multi-series)
export function createScatterChart<K extends string, T extends SubtypeExprOrValue<ArrayType<StructType>>>(
    data: Record<K, T>,
    series: { [P in K]?: ScatterChartSeriesConfig },
    style?: ScatterChartStyle
): ExprType<UIComponentType>;

// Implementation
export function createScatterChart(
    data: SubtypeExprOrValue<ArrayType<StructType>> | Record<string, SubtypeExprOrValue<ArrayType<StructType>>>,
    series: Record<string, ScatterChartSeriesConfig | undefined>,
    style?: ScatterChartStyle
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
        dataSeries: dataSeries_mapped ? variant("some", dataSeries_mapped) : variant("none", null),
        valueKey: style?.valueKey !== undefined ? variant("some", style.valueKey) : variant("none", null),
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
