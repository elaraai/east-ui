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
    FloatType,
    IntegerType,
    StringType,
    DictType,
    LiteralValueType,
} from "@elaraai/east";

import {
    ChartSeriesType,
    ChartAxisType,
    CurveType,
    StackOffsetType,
    type ChartAxis,
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
 * @property data - Array of data points (flexible shape via runtime)
 * @property series - Series configuration for multi-series charts
 * @property xAxis - X-axis configuration
 * @property yAxis - Y-axis configuration
 * @property curveType - Line curve interpolation type
 * @property stacked - Enable stacking of series
 * @property stackOffset - Stack offset mode (none, expand, etc.)
 * @property showGrid - Show grid lines
 * @property showTooltip - Show tooltip on hover
 * @property showLegend - Show legend
 * @property fillOpacity - Fill opacity (0-1)
 * @property connectNulls - Connect line across null data points
 * @property width - Chart width in pixels
 * @property height - Chart height in pixels
 */
export const AreaChartType = StructType({
    data: ArrayType(DictType(StringType, LiteralValueType)),
    series: ArrayType(ChartSeriesType),
    xAxis: OptionType(ChartAxisType),
    yAxis: OptionType(ChartAxisType),
    curveType: OptionType(CurveType),
    stacked: OptionType(BooleanType),
    stackOffset: OptionType(StackOffsetType),
    showGrid: OptionType(BooleanType),
    showTooltip: OptionType(BooleanType),
    showLegend: OptionType(BooleanType),
    fillOpacity: OptionType(FloatType),
    connectNulls: OptionType(BooleanType),
    width: OptionType(IntegerType),
    height: OptionType(IntegerType),
});

/**
 * Type representing an area chart.
 */
export type AreaChartType = typeof AreaChartType;

// ============================================================================
// Area Chart Style
// ============================================================================

/**
 * TypeScript interface for Area chart style options.
 *
 * @remarks
 * All properties are optional and accept either static values or East expressions.
 */
export interface AreaChartStyle extends BaseChartStyle {
    /** X-axis configuration */
    xAxis?: ChartAxis;
    /** Y-axis configuration */
    yAxis?: ChartAxis;
    /** Line curve interpolation type */
    curveType?: SubtypeExprOrValue<CurveType> | CurveLiteral;
    /** Enable stacking of series */
    stacked?: SubtypeExprOrValue<BooleanType>;
    /** Stack offset mode (none, expand for 100%, etc.) */
    stackOffset?: SubtypeExprOrValue<StackOffsetType> | StackOffsetLiteral;
    /** Fill opacity (0-1) */
    fillOpacity?: SubtypeExprOrValue<FloatType>;
    /** Connect line across null data points */
    connectNulls?: SubtypeExprOrValue<BooleanType>;
}
