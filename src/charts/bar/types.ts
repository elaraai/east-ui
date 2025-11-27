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
    BarLayoutType,
    StackOffsetType,
    type ChartAxis,
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
 * @property data - Array of data points
 * @property series - Series configuration for multi-series charts
 * @property xAxis - X-axis configuration
 * @property yAxis - Y-axis configuration
 * @property layout - Bar direction (horizontal = vertical bars, vertical = horizontal bars)
 * @property stacked - Enable stacking of series
 * @property stackOffset - Stack offset mode
 * @property showGrid - Show grid lines
 * @property showTooltip - Show tooltip on hover
 * @property showLegend - Show legend
 * @property barSize - Bar width/height in pixels
 * @property barGap - Gap between bars in pixels
 * @property radius - Rounded corner radius
 * @property width - Chart width in pixels
 * @property height - Chart height in pixels
 */
export const BarChartType = StructType({
    data: ArrayType(DictType(StringType, LiteralValueType)),
    series: ArrayType(ChartSeriesType),
    xAxis: OptionType(ChartAxisType),
    yAxis: OptionType(ChartAxisType),
    layout: OptionType(BarLayoutType),
    stacked: OptionType(BooleanType),
    stackOffset: OptionType(StackOffsetType),
    showGrid: OptionType(BooleanType),
    showTooltip: OptionType(BooleanType),
    showLegend: OptionType(BooleanType),
    barSize: OptionType(IntegerType),
    barGap: OptionType(IntegerType),
    radius: OptionType(IntegerType),
    width: OptionType(IntegerType),
    height: OptionType(IntegerType),
});

/**
 * Type representing a bar chart.
 */
export type BarChartType = typeof BarChartType;

// ============================================================================
// Bar Chart Style
// ============================================================================

/**
 * TypeScript interface for Bar chart style options.
 */
export interface BarChartStyle extends BaseChartStyle {
    /** X-axis configuration */
    xAxis?: ChartAxis;
    /** Y-axis configuration */
    yAxis?: ChartAxis;
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
}
