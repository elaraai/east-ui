/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    type TypeOf,
    ArrayType,
    DictType,
    East,
    Expr,
    LiteralValueType,
    none,
    some,
    StringType,
    StructType,
    variant,
    IntegerType,
    FloatType,
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import { MultiSeriesDataType } from "../types.js";
import type {
    ScatterChartStyle,
    ScatterChartMultiStyle,
    ScatterChartSeriesConfig,
    ScatterChartStyleBase,
} from "./types.js";

// Re-export types
export {
    ScatterChartType,
    type ScatterChartStyle,
    type ScatterChartMultiStyle,
    type ScatterChartSeriesConfig,
    type ScatterChartStyleBase,
} from "./types.js";

// ============================================================================
// Type Helpers
// ============================================================================

// Numeric types that can be used as axis values
type NumericEastType = IntegerType | FloatType;

// Extract struct fields from array type
type ExtractStructFields<T> = T extends ArrayType<infer S>
    ? S extends StructType
        ? S["fields"]
        : never
    : never;

// Extract fields from data (handles SubtypeExprOrValue wrapping)
type DataFields<T extends SubtypeExprOrValue<ArrayType<StructType>>> = ExtractStructFields<TypeOf<T>>;

// Extract only numeric field keys from a struct's fields
type NumericFieldKeys<Fields> = {
    [K in keyof Fields]: Fields[K] extends NumericEastType ? K : never
}[keyof Fields];

// ============================================================================
// Series Specification
// ============================================================================

/**
 * Series specification for the Scatter chart API.
 *
 * @remarks
 * - **Array form**: Only numeric field keys allowed (e.g., `["y1", "y2"]`)
 * - **Object form**: Numeric fields with optional per-series config
 */
type SeriesSpec<T extends SubtypeExprOrValue<ArrayType<StructType>>> =
    | NumericFieldKeys<DataFields<NoInfer<T>>>[]
    | { [K in NumericFieldKeys<DataFields<NoInfer<T>>>]?: ScatterChartSeriesConfig };

// ============================================================================
// Scatter Chart (Single Array Form)
// ============================================================================

/**
 * Creates a Scatter chart component from a single data array.
 *
 * @typeParam T - The array type containing data structs
 * @param data - Array of data points (each point has x + y values)
 * @param series - Series specification: array of numeric field names, or object with config
 * @param style - Optional styling with type-safe xDataKey and yDataKey
 * @returns An East expression representing the scatter chart component
 *
 * @remarks
 * All series share the same data points. Series keys are numeric field names.
 *
 * @example Array form (just field names)
 * ```ts
 * Chart.Scatter(
 *     [
 *         { x: 10n, y: 30n },
 *         { x: 20n, y: 40n },
 *     ],
 *     ["y"],
 *     { xDataKey: "x", yDataKey: "y" }
 * );
 * ```
 *
 * @example Object form (with per-series config)
 * ```ts
 * Chart.Scatter(
 *     data,
 *     { y: { color: "purple.solid" } },
 *     { xDataKey: "x" }
 * );
 * ```
 */
export function createScatterChart<T extends SubtypeExprOrValue<ArrayType<StructType>>>(
    data: T,
    series: SeriesSpec<T>,
    style?: ScatterChartStyle<NumericFieldKeys<DataFields<T>> & string>
): ExprType<UIComponentType> {
    const data_expr = East.value(data) as ExprType<ArrayType<StructType>>;
    const field_types = Expr.type(data_expr).value.fields;

    // Map each data row to a Dict<String, LiteralValueType>
    const data_mapped = data_expr.map(($, datum) => {
        const ret = $.let(new Map(), DictType(StringType, LiteralValueType));
        for (const [field_name, field_type] of Object.entries(field_types)) {
            $(ret.insert(field_name, variant(field_type.type, (datum as any)[field_name])));
        }
        return ret;
    });

    // Normalize series to entries
    const seriesEntries: readonly (readonly [string, ScatterChartSeriesConfig | undefined])[] = Array.isArray(series)
        ? (series as string[]).map(key => [key, undefined] as const)
        : Object.entries(series) as [string, ScatterChartSeriesConfig | undefined][];

    return buildScatterChart(data_mapped, undefined, seriesEntries, style);
}

// ============================================================================
// Scatter Chart Multi (Multi-Series with Separate Arrays)
// ============================================================================

/**
 * Creates a Scatter chart component from multiple data arrays (one per series).
 *
 * @typeParam K - Union of series names (record keys)
 * @typeParam T - The array type containing data structs for each series
 * @param data - Record mapping series names to their data arrays
 * @param style - Styling with type-safe xDataKey and valueKey
 * @returns An East expression representing the scatter chart component
 *
 * @remarks
 * Each series has its own data array, allowing sparse data where series
 * don't need to have values at every x-axis point.
 *
 * @example
 * ```ts
 * Chart.ScatterMulti(
 *     {
 *         series1: [
 *             { x: 10n, value: 30n },
 *             { x: 20n, value: 40n },
 *         ],
 *         series2: [
 *             { x: 15n, value: 35n },
 *             { x: 25n, value: 45n },
 *         ],
 *     },
 *     {
 *         xDataKey: "x",
 *         valueKey: "value",
 *         series: { series1: { color: "purple.solid" } },
 *     }
 * );
 * ```
 */
export function createScatterChartMulti<
    K extends string,
    T extends SubtypeExprOrValue<ArrayType<StructType>>
>(
    data: Record<K, T>,
    style: ScatterChartMultiStyle<
        NumericFieldKeys<DataFields<T>> & string,
        K
    >
): ExprType<UIComponentType> {
    // Create empty data array (renderer will use dataSeries instead)
    const data_mapped = East.value([], ArrayType(DictType(StringType, LiteralValueType)));

    // Map each series array to Dict format
    const seriesDataMap = new Map<string, ExprType<ArrayType<DictType<typeof StringType, typeof LiteralValueType>>>>();

    for (const [seriesName, seriesData] of Object.entries(data) as [string, T][]) {
        const series_expr = East.value(seriesData) as ExprType<ArrayType<StructType>>;
        const field_types = Expr.type(series_expr).value.fields;

        const series_mapped = series_expr.map(($, datum) => {
            const ret = $.let(new Map(), DictType(StringType, LiteralValueType));
            for (const [field_name, field_type] of Object.entries(field_types)) {
                $(ret.insert(field_name, variant(field_type.type, (datum as any)[field_name])));
            }
            return ret;
        });

        seriesDataMap.set(seriesName, series_mapped);
    }

    const dataSeries_mapped = East.value(seriesDataMap, MultiSeriesDataType);

    // Build series entries from record keys and optional config
    const seriesEntries = Object.keys(data).map(key => [
        key,
        style.series?.[key as K]
    ] as const);

    return buildScatterChart(data_mapped, dataSeries_mapped, seriesEntries, style, style.valueKey);
}

// ============================================================================
// Shared Chart Builder
// ============================================================================

function buildScatterChart(
    data_mapped: ExprType<ArrayType<DictType<typeof StringType, typeof LiteralValueType>>>,
    dataSeries_mapped: ExprType<typeof MultiSeriesDataType> | undefined,
    seriesEntries: readonly (readonly [string, ScatterChartSeriesConfig | undefined])[],
    style?: ScatterChartStyleBase & { xDataKey?: string; yDataKey?: string },
    valueKey?: string
): ExprType<UIComponentType> {
    const series_mapped = seriesEntries.map(([name, config]) => ({
        name: name,
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
        valueKey: valueKey !== undefined ? variant("some", valueKey) : variant("none", null),
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
