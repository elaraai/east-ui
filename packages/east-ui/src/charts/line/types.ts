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
    ChartSeriesType,
    ChartAxisType,
    ChartGridType,
    ChartTooltipType,
    ChartLegendType,
    ChartMarginType,
    CurveType,
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
 * @property grid - Grid configuration
 * @property tooltip - Tooltip configuration
 * @property legend - Legend configuration
 * @property margin - Chart margin configuration
 * @property showDots - Show dots at data points
 * @property strokeWidth - Line stroke width in pixels
 * @property connectNulls - Connect line across null data points
 */
export const LineChartType = StructType({
    data: ArrayType(DictType(StringType, LiteralValueType)),
    series: ArrayType(ChartSeriesType),
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
 */
export interface LineChartStyle extends BaseChartStyle {
    /** X-axis configuration */
    xAxis?: SubtypeExprOrValue<ChartAxisType>;
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
 * Series configuration for Line charts (used in createLineChart).
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
}
