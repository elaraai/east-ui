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
    FloatType,
    StringType,
    DictType,
    LiteralValueType,
} from "@elaraai/east";

import {
    ChartSeriesType,
    ChartAxisType,
    ChartGridType,
    ChartTooltipType,
    ChartLegendType,
    ChartMarginType,
    BarLayoutType,
    StackOffsetType,
    MultiSeriesDataType,
    type BarLayoutLiteral,
    type StackOffsetLiteral,
    type BaseChartStyle,
} from "../types.js";

// ============================================================================
// Bar Chart Type
// ============================================================================

/**
 * Bar chart component type.
 *
 * @remarks
 * Bar charts display categorical data with rectangular bars.
 * Supports horizontal/vertical layouts and stacking.
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
 * @property layout - Bar direction (horizontal = vertical bars, vertical = horizontal bars)
 * @property stacked - Enable stacking of series
 * @property stackOffset - Stack offset mode
 * @property grid - Grid configuration
 * @property tooltip - Tooltip configuration
 * @property legend - Legend configuration
 * @property margin - Chart margin configuration
 * @property barSize - Bar width/height in pixels
 * @property barGap - Gap between bars in pixels
 * @property radius - Rounded corner radius
 */
export const BarChartType = StructType({
    data: ArrayType(DictType(StringType, LiteralValueType)),
    dataSeries: OptionType(MultiSeriesDataType),
    valueKey: OptionType(StringType),
    series: ArrayType(ChartSeriesType),
    xAxis: OptionType(ChartAxisType),
    yAxis: OptionType(ChartAxisType),
    layout: OptionType(BarLayoutType),
    stacked: OptionType(BooleanType),
    stackOffset: OptionType(StackOffsetType),
    grid: OptionType(ChartGridType),
    tooltip: OptionType(ChartTooltipType),
    legend: OptionType(ChartLegendType),
    margin: OptionType(ChartMarginType),
    barSize: OptionType(IntegerType),
    barGap: OptionType(IntegerType),
    radius: OptionType(IntegerType),
});

/**
 * Type representing a bar chart.
 */
export type BarChartType = typeof BarChartType;

// ============================================================================
// Bar Chart Style
// ============================================================================

/**
 * Base style options shared by Bar and BarMulti charts.
 */
export interface BarChartStyleBase extends BaseChartStyle {
    /** Y-axis configuration */
    yAxis?: SubtypeExprOrValue<ChartAxisType>;
    /** Bar direction (horizontal = vertical bars, vertical = horizontal bars) */
    layout?: SubtypeExprOrValue<BarLayoutType> | BarLayoutLiteral;
    /** Enable stacking of series */
    stacked?: SubtypeExprOrValue<BooleanType>;
    /** Stack offset mode */
    stackOffset?: SubtypeExprOrValue<StackOffsetType> | StackOffsetLiteral;
    /** Bar width/height in pixels */
    barSize?: SubtypeExprOrValue<IntegerType>;
    /** Gap between bars in pixels */
    barGap?: SubtypeExprOrValue<IntegerType>;
    /** Rounded corner radius */
    radius?: SubtypeExprOrValue<IntegerType>;
    /** Chart margin configuration */
    margin?: SubtypeExprOrValue<ChartMarginType>;
}

/**
 * Style for Bar charts (single array form).
 *
 * @typeParam DataKey - Union of field keys from the data struct
 */
export interface BarChartStyle<DataKey extends string = string> extends BarChartStyleBase {
    /** X-axis configuration with type-safe dataKey */
    xAxis?: { dataKey: DataKey };
}

/**
 * Style for BarMulti charts (multi-series with separate arrays).
 *
 * @typeParam DataKey - Union of field keys from series array structs
 * @typeParam NumericKey - Union of numeric field keys (for valueKey)
 * @typeParam SeriesKey - Union of series names (record keys)
 */
export interface BarChartMultiStyle<
    DataKey extends string = string,
    NumericKey extends string = string,
    SeriesKey extends string = string
> extends BarChartStyleBase {
    /** X-axis configuration with type-safe dataKey */
    xAxis?: { dataKey: DataKey };
    /** Field name containing Y values in each series array (must be numeric) */
    valueKey: NumericKey;
    /** Per-series configuration (keyed by series name) */
    series?: { [K in SeriesKey]?: BarChartSeriesConfig };
}

/**
 * Series configuration for Bar charts.
 *
 * @remarks
 * Configures how a data field is rendered as a series in the bar chart.
 *
 * @property color - Chakra color token (e.g., "teal.solid", "blue.500")
 * @property stackId - Stack group ID (same stackId = stacked together)
 * @property label - Display label (defaults to field name)
 * @property stroke - Stroke/line color (defaults to color)
 * @property strokeWidth - Stroke/line width in pixels
 * @property fill - Fill color (defaults to color)
 * @property fillOpacity - Fill opacity (0-1)
 * @property strokeDasharray - Dash pattern for dashed lines (e.g., "5 5")
 */
export interface BarChartSeriesConfig {
    /** Chakra color token (e.g., "teal.solid", "blue.500") */
    color?: SubtypeExprOrValue<StringType>;
    /** Stack group ID (same stackId = stacked together) */
    stackId?: SubtypeExprOrValue<StringType>;
    /** Display label (defaults to name) */
    label?: SubtypeExprOrValue<StringType>;
    /** Stroke/line color (defaults to color) */
    stroke?: SubtypeExprOrValue<StringType>;
    /** Stroke/line width in pixels */
    strokeWidth?: SubtypeExprOrValue<IntegerType>;
    /** Fill color (defaults to color) */
    fill?: SubtypeExprOrValue<StringType>;
    /** Fill opacity (0-1) */
    fillOpacity?: SubtypeExprOrValue<FloatType>;
    /** Dash pattern for dashed lines (e.g., "5 5") */
    strokeDasharray?: SubtypeExprOrValue<StringType>;
}
