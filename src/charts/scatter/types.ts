/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
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
    ChartSeriesType,
    ChartAxisType,
    type ChartAxis,
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
 * @property data - Array of data points
 * @property series - Series configuration
 * @property xAxis - X-axis configuration
 * @property yAxis - Y-axis configuration
 * @property showGrid - Show grid lines
 * @property showTooltip - Show tooltip on hover
 * @property showLegend - Show legend
 * @property pointSize - Size of scatter points
 * @property width - Chart width in pixels
 * @property height - Chart height in pixels
 */
export const ScatterChartType = StructType({
    data: ArrayType(DictType(StringType, LiteralValueType)),
    series: ArrayType(ChartSeriesType),
    xAxis: OptionType(ChartAxisType),
    yAxis: OptionType(ChartAxisType),
    xDataKey: OptionType(StringType),
    yDataKey: OptionType(StringType),
    showGrid: OptionType(BooleanType),
    showTooltip: OptionType(BooleanType),
    showLegend: OptionType(BooleanType),
    pointSize: OptionType(IntegerType),
    width: OptionType(IntegerType),
    height: OptionType(IntegerType),
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
 */
export interface ScatterChartStyle extends BaseChartStyle {
    /** X-axis configuration */
    xAxis?: ChartAxis;
    /** Y-axis configuration */
    yAxis?: ChartAxis;
    /** Data key for X values */
    xDataKey?: SubtypeExprOrValue<StringType>;
    /** Data key for Y values */
    yDataKey?: SubtypeExprOrValue<StringType>;
    /** Size of scatter points */
    pointSize?: SubtypeExprOrValue<IntegerType>;
}
