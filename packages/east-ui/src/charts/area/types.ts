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
    FloatType,
    IntegerType,
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
    CurveType,
    StackOffsetType,
    MultiSeriesDataType,
    type CurveLiteral,
    type StackOffsetLiteral,
    type BaseChartStyle,
} from "../types.js";

// ============================================================================
// Area Chart Type
// ============================================================================

/**
 * Area chart component type.
 *
 * @remarks
 * Area charts display quantitative data with filled areas under line curves.
 * Supports stacking for showing part-to-whole relationships.
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
 * @property stacked - Enable stacking of series
 * @property stackOffset - Stack offset mode (none, expand, etc.)
 * @property grid - Grid configuration
 * @property tooltip - Tooltip configuration
 * @property legend - Legend configuration
 * @property margin - Chart margin configuration
 * @property fillOpacity - Fill opacity (0-1)
 * @property connectNulls - Connect line across null data points
 */
export const AreaChartType = StructType({
    data: ArrayType(DictType(StringType, LiteralValueType)),
    dataSeries: OptionType(MultiSeriesDataType),
    valueKey: OptionType(StringType),
    series: ArrayType(ChartSeriesType),
    xAxis: OptionType(ChartAxisType),
    yAxis: OptionType(ChartAxisType),
    curveType: OptionType(CurveType),
    stacked: OptionType(BooleanType),
    stackOffset: OptionType(StackOffsetType),
    grid: OptionType(ChartGridType),
    tooltip: OptionType(ChartTooltipType),
    legend: OptionType(ChartLegendType),
    margin: OptionType(ChartMarginType),
    fillOpacity: OptionType(FloatType),
    connectNulls: OptionType(BooleanType),
});

/**
 * Type representing an area chart.
 */
export type AreaChartType = typeof AreaChartType;

// ============================================================================
// Area Chart Style
// ============================================================================

/**
 * Base style options shared by Area and AreaMulti charts.
 */
export interface AreaChartStyleBase extends BaseChartStyle {
    /** Y-axis configuration */
    yAxis?: SubtypeExprOrValue<ChartAxisType>;
    /** Line curve interpolation type */
    curveType?: SubtypeExprOrValue<CurveType> | CurveLiteral;
    /** Enable stacking of series */
    stacked?: SubtypeExprOrValue<BooleanType>;
    /** Stack offset mode (none, expand for 100%, etc.) */
    stackOffset?: SubtypeExprOrValue<StackOffsetType> | StackOffsetLiteral;
    /** Fill opacity (0-1, applies to all series unless overridden per-series) */
    fillOpacity?: SubtypeExprOrValue<FloatType>;
    /** Connect line across null data points */
    connectNulls?: SubtypeExprOrValue<BooleanType>;
    /** Chart margin configuration */
    margin?: SubtypeExprOrValue<ChartMarginType>;
}

/**
 * Style for Area charts (single array form).
 *
 * @typeParam DataKey - Union of field keys from the data struct
 */
export interface AreaChartStyle<DataKey extends string = string> extends AreaChartStyleBase {
    /** X-axis configuration with type-safe dataKey */
    xAxis?: { dataKey: DataKey };
}

/**
 * Style for AreaMulti charts (multi-series with separate arrays).
 *
 * @typeParam DataKey - Union of field keys from series array structs
 * @typeParam NumericKey - Union of numeric field keys (for valueKey)
 * @typeParam SeriesKey - Union of series names (record keys)
 */
export interface AreaChartMultiStyle<
    DataKey extends string = string,
    NumericKey extends string = string,
    SeriesKey extends string = string
> extends AreaChartStyleBase {
    /** X-axis configuration with type-safe dataKey */
    xAxis?: { dataKey: DataKey };
    /** Field name containing Y values in each series array (must be numeric) */
    valueKey: NumericKey;
    /** Per-series configuration (keyed by series name) */
    series?: { [K in SeriesKey]?: AreaChartSeriesConfig };
}

/**
 * Series configuration for Area charts.
 *
 * @remarks
 * Configures how a data field is rendered as a series in the area chart.
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
export interface AreaChartSeriesConfig {
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
