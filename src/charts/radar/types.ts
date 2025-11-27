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
    type BaseChartStyle,
} from "../types.js";

// ============================================================================
// Radar Chart Type
// ============================================================================

/**
 * Radar chart component type.
 *
 * @remarks
 * Radar charts display multivariate data on radial axes.
 * Each axis represents a different variable.
 *
 * @property data - Array of data points with values for each axis
 * @property series - Series configuration for multi-series charts
 * @property dataKey - Key for axis labels (e.g., "subject")
 * @property showGrid - Show grid lines
 * @property showLegend - Show legend
 * @property showTooltip - Show tooltip on hover
 * @property fillOpacity - Fill opacity (0-1)
 * @property width - Chart width in pixels
 * @property height - Chart height in pixels
 */
export const RadarChartType = StructType({
    data: ArrayType(DictType(StringType, LiteralValueType)),
    series: ArrayType(ChartSeriesType),
    dataKey: OptionType(StringType),
    showGrid: OptionType(BooleanType),
    showLegend: OptionType(BooleanType),
    showTooltip: OptionType(BooleanType),
    fillOpacity: OptionType(FloatType),
    width: OptionType(IntegerType),
    height: OptionType(IntegerType),
});

/**
 * Type representing a radar chart.
 */
export type RadarChartType = typeof RadarChartType;

// ============================================================================
// Radar Chart Style
// ============================================================================

/**
 * TypeScript interface for Radar chart style options.
 */
export interface RadarChartStyle extends BaseChartStyle {
    /** Key for axis labels (e.g., "subject") */
    dataKey?: SubtypeExprOrValue<StringType>;
    /** Fill opacity (0-1) */
    fillOpacity?: SubtypeExprOrValue<FloatType>;
}
