/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type SubtypeExprOrValue,
    OptionType,
    StructType,
    ArrayType,
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
    MultiSeriesDataType,
    type BaseChartStyle,
} from "../types.js";

// ============================================================================
// Scatter Chart Type
// ============================================================================

/**
 * Scatter chart component type.
 *
 * @remarks
 * Scatter charts display data points on a 2D coordinate plane.
 * Useful for showing correlations between variables.
 *
 * Supports two data formats:
 * - Single array: `data` contains all series in one array (series keys are field names)
 * - Multi-series: `dataSeries` contains separate arrays per series (for sparse data)
 *
 * @property data - Array of data points (single array form)
 * @property dataSeries - Record of arrays per series (multi-series form, for sparse data)
 * @property valueKey - Field name for Y values when using dataSeries
 * @property series - Series configuration
 * @property xAxis - X-axis configuration
 * @property yAxis - Y-axis configuration
 * @property xDataKey - Data key for X values
 * @property yDataKey - Data key for Y values
 * @property grid - Grid configuration
 * @property tooltip - Tooltip configuration
 * @property legend - Legend configuration
 * @property margin - Chart margin configuration
 * @property pointSize - Size of scatter points
 */
export const ScatterChartType = StructType({
    data: ArrayType(DictType(StringType, LiteralValueType)),
    dataSeries: OptionType(MultiSeriesDataType),
    valueKey: OptionType(StringType),
    series: ArrayType(ChartSeriesType),
    xAxis: OptionType(ChartAxisType),
    yAxis: OptionType(ChartAxisType),
    xDataKey: OptionType(StringType),
    yDataKey: OptionType(StringType),
    grid: OptionType(ChartGridType),
    tooltip: OptionType(ChartTooltipType),
    legend: OptionType(ChartLegendType),
    margin: OptionType(ChartMarginType),
    pointSize: OptionType(IntegerType),
});

/**
 * Type representing a scatter chart.
 */
export type ScatterChartType = typeof ScatterChartType;

// ============================================================================
// Scatter Chart Style
// ============================================================================

/**
 * TypeScript interface for Scatter chart style options.
 *
 * @remarks
 * All properties are optional and accept either static values or East expressions.
 *
 * @property xAxis - X-axis configuration
 * @property yAxis - Y-axis configuration
 * @property xDataKey - Data key for X values
 * @property yDataKey - Data key for Y values
 * @property pointSize - Size of scatter points
 */
export interface ScatterChartStyle extends BaseChartStyle {
    /** X-axis configuration */
    xAxis?: SubtypeExprOrValue<ChartAxisType>;
    /** Y-axis configuration */
    yAxis?: SubtypeExprOrValue<ChartAxisType>;
    /** Data key for X values */
    xDataKey?: SubtypeExprOrValue<StringType>;
    /** Data key for Y values */
    yDataKey?: SubtypeExprOrValue<StringType>;
    /** Size of scatter points */
    pointSize?: SubtypeExprOrValue<IntegerType>;
}

/**
 * Series configuration for Scatter charts.
 *
 * @remarks
 * Configures how a data field is rendered as a series in the scatter chart.
 *
 * @property color - Chakra color token (e.g., "teal.solid", "blue.500")
 * @property label - Display label (defaults to name)
 * @property fill - Fill color for points
 */
export interface ScatterChartSeriesConfig {
    /** Chakra color token (e.g., "teal.solid", "blue.500") */
    color?: SubtypeExprOrValue<StringType>;
    /** Display label (defaults to name) */
    label?: SubtypeExprOrValue<StringType>;
    /** Fill color for points */
    fill?: SubtypeExprOrValue<StringType>;
}
