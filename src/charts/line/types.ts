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
    CurveType,
    type ChartAxis,
    type CurveLiteral,
    type BaseChartStyle,
} from "../types.js";

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
 * @property data - Array of data points
 * @property series - Series configuration for multi-series charts
 * @property xAxis - X-axis configuration
 * @property yAxis - Y-axis configuration
 * @property curveType - Line curve interpolation type
 * @property showGrid - Show grid lines
 * @property showTooltip - Show tooltip on hover
 * @property showLegend - Show legend
 * @property showDots - Show dots at data points
 * @property strokeWidth - Line stroke width in pixels
 * @property connectNulls - Connect line across null data points
 * @property width - Chart width in pixels
 * @property height - Chart height in pixels
 */
export const LineChartType = StructType({
    data: ArrayType(DictType(StringType, LiteralValueType)),
    series: ArrayType(ChartSeriesType),
    xAxis: OptionType(ChartAxisType),
    yAxis: OptionType(ChartAxisType),
    curveType: OptionType(CurveType),
    showGrid: OptionType(BooleanType),
    showTooltip: OptionType(BooleanType),
    showLegend: OptionType(BooleanType),
    showDots: OptionType(BooleanType),
    strokeWidth: OptionType(IntegerType),
    connectNulls: OptionType(BooleanType),
    width: OptionType(IntegerType),
    height: OptionType(IntegerType),
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
 */
export interface LineChartStyle extends BaseChartStyle {
    /** X-axis configuration */
    xAxis?: ChartAxis;
    /** Y-axis configuration */
    yAxis?: ChartAxis;
    /** Line curve interpolation type */
    curveType?: SubtypeExprOrValue<CurveType> | CurveLiteral;
    /** Show dots at data points */
    showDots?: SubtypeExprOrValue<BooleanType>;
    /** Line stroke width in pixels */
    strokeWidth?: SubtypeExprOrValue<IntegerType>;
    /** Connect line across null data points */
    connectNulls?: SubtypeExprOrValue<BooleanType>;
}
