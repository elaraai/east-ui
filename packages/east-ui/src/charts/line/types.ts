/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type SubtypeExprOrValue,
    OptionType,
    StructType,
    ArrayType,
    BooleanType,
    IntegerType,
    StringType,
    DictType,
    LiteralValueType,
} from "@elaraai/east";

import {
    ChartAxisType,
    ChartGridType,
    ChartTooltipType,
    ChartLegendType,
    ChartMarginType,
    CurveType,
    MultiSeriesDataType,
    type CurveLiteral,
    type BaseChartStyle,
} from "../types.js";

// ============================================================================
// Line Chart Series Type
// ============================================================================

/**
 * Series configuration for Line charts.
 *
 * @remarks
 * Line-specific series type that includes all base series properties
 * plus line-specific options like showDots and showLine.
 *
 * @property name - Data key name (matches keys in data points)
 * @property color - Chakra color token (e.g., "teal.solid", "blue.500")
 * @property stackId - Stack group ID (same stackId = stacked together)
 * @property label - Display label (defaults to name)
 * @property stroke - Stroke/line color (defaults to color)
 * @property strokeWidth - Stroke/line width in pixels
 * @property strokeDasharray - Dash pattern for dashed lines (e.g., "5 5")
 * @property showDots - Whether to show dots at data points (per-series override)
 * @property showLine - Whether to show the line (per-series override)
 */
export const LineChartSeriesType = StructType({
    name: StringType,
    color: OptionType(StringType),
    stackId: OptionType(StringType),
    label: OptionType(StringType),
    stroke: OptionType(StringType),
    strokeWidth: OptionType(IntegerType),
    strokeDasharray: OptionType(StringType),
    showDots: OptionType(BooleanType),
    showLine: OptionType(BooleanType),
});

/**
 * Type representing line chart series configuration.
 */
export type LineChartSeriesType = typeof LineChartSeriesType;

// ============================================================================
// Line Chart Type
// ============================================================================

/**
 * Line chart component type.
 *
 * @remarks
 * Line charts display data points connected by line segments.
 * Ideal for showing trends over time.
 *
 * Supports two data formats:
 * - Single array: `data` contains all series in one array (series keys are field names)
 * - Multi-series: `dataSeries` contains separate arrays per series (for sparse data)
 *
 * @property data - Array of data points (single array form)
 * @property dataSeries - Record of arrays per series (multi-series form, for sparse data)
 * @property valueKey - Field name for Y values when using dataSeries
 * @property series - Series configuration for multi-series charts
 * @property xAxis - X-axis configuration
 * @property yAxis - Y-axis configuration
 * @property curveType - Line curve interpolation type
 * @property grid - Grid configuration
 * @property tooltip - Tooltip configuration
 * @property legend - Legend configuration
 * @property margin - Chart margin configuration
 * @property showDots - Show dots at data points (global default)
 * @property strokeWidth - Line stroke width in pixels (global default)
 * @property connectNulls - Connect line across null data points
 */
export const LineChartType = StructType({
    data: ArrayType(DictType(StringType, LiteralValueType)),
    dataSeries: OptionType(MultiSeriesDataType),
    valueKey: OptionType(StringType),
    series: ArrayType(LineChartSeriesType),
    xAxis: OptionType(ChartAxisType),
    yAxis: OptionType(ChartAxisType),
    curveType: OptionType(CurveType),
    grid: OptionType(ChartGridType),
    tooltip: OptionType(ChartTooltipType),
    legend: OptionType(ChartLegendType),
    margin: OptionType(ChartMarginType),
    showDots: OptionType(BooleanType),
    strokeWidth: OptionType(IntegerType),
    connectNulls: OptionType(BooleanType),
});

/**
 * Type representing a line chart.
 */
export type LineChartType = typeof LineChartType;

// ============================================================================
// Line Chart Style
// ============================================================================

/**
 * TypeScript interface for Line chart style options.
 *
 * @remarks
 * All properties are optional and accept either static values or East expressions.
 *
 * @property xAxis - X-axis configuration
 * @property yAxis - Y-axis configuration
 * @property curveType - Line curve interpolation type
 * @property showDots - Show dots at data points
 * @property strokeWidth - Line stroke width in pixels
 * @property connectNulls - Connect line across null data points
 * @property margin - Chart margin configuration
 */
/**
 * Base style options shared by Line and LineMulti charts.
 */
export interface LineChartStyleBase extends BaseChartStyle {
    /** Y-axis configuration */
    yAxis?: SubtypeExprOrValue<ChartAxisType>;
    /** Line curve interpolation type */
    curveType?: SubtypeExprOrValue<CurveType> | CurveLiteral;
    /** Show dots at data points */
    showDots?: SubtypeExprOrValue<BooleanType>;
    /** Line stroke width in pixels */
    strokeWidth?: SubtypeExprOrValue<IntegerType>;
    /** Connect line across null data points */
    connectNulls?: SubtypeExprOrValue<BooleanType>;
    /** Chart margin configuration */
    margin?: SubtypeExprOrValue<ChartMarginType>;
}

/**
 * Style for Line charts (single array form).
 *
 * @typeParam DataKey - Union of field keys from the data struct
 */
export interface LineChartStyle<DataKey extends string = string> extends LineChartStyleBase {
    /** X-axis configuration with type-safe dataKey */
    xAxis?: { dataKey: DataKey };
}

/**
 * Style for LineMulti charts (multi-series with separate arrays).
 *
 * @typeParam DataKey - Union of field keys from series array structs
 * @typeParam NumericKey - Union of numeric field keys (for valueKey)
 * @typeParam SeriesKey - Union of series names (record keys)
 */
export interface LineChartMultiStyle<
    DataKey extends string = string,
    NumericKey extends string = string,
    SeriesKey extends string = string
> extends LineChartStyleBase {
    /** X-axis configuration with type-safe dataKey */
    xAxis?: { dataKey: DataKey };
    /** Field name containing Y values in each series array (must be numeric) */
    valueKey: NumericKey;
    /** Per-series configuration (keyed by series name) */
    series?: { [K in SeriesKey]?: LineChartSeriesConfig };
}

/**
 * TypeScript interface for Line chart series configuration.
 *
 * @remarks
 * Configures how a data field is rendered as a series in the line chart.
 *
 * @property color - Chakra color token (e.g., "teal.solid", "blue.500")
 * @property label - Display label (defaults to field name)
 * @property stroke - Stroke/line color (defaults to color)
 * @property strokeWidth - Stroke/line width in pixels
 * @property strokeDasharray - Dash pattern for dashed lines (e.g., "5 5")
 * @property showDots - Whether to show dots at data points (per-series override)
 * @property showLine - Whether to show the line (per-series override)
 */
export interface LineChartSeriesConfig {
    /** Chakra color token (e.g., "teal.solid", "blue.500") */
    color?: SubtypeExprOrValue<StringType>;
    /** Display label (defaults to name) */
    label?: SubtypeExprOrValue<StringType>;
    /** Stroke/line color (defaults to color) */
    stroke?: SubtypeExprOrValue<StringType>;
    /** Stroke/line width in pixels */
    strokeWidth?: SubtypeExprOrValue<IntegerType>;
    /** Dash pattern for dashed lines (e.g., "5 5") */
    strokeDasharray?: SubtypeExprOrValue<StringType>;
    /** Whether to show dots at data points (per-series override) */
    showDots?: SubtypeExprOrValue<BooleanType>;
    /** Whether to show the line (per-series override) */
    showLine?: SubtypeExprOrValue<BooleanType>;
}
