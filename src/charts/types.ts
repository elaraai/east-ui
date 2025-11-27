/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

/**
 * Shared types for Chart components.
 *
 * @remarks
 * These types are shared across multiple chart components (Area, Bar, Line, etc.)
 * and provide common configuration options for series, axes, and styling.
 *
 * @packageDocumentation
 */

import {
    type SubtypeExprOrValue,
    OptionType,
    StructType,
    ArrayType,
    StringType,
    FloatType,
    BooleanType,
    VariantType,
    NullType,
    IntegerType,
} from "@elaraai/east";

// ============================================================================
// Chart Series Type
// ============================================================================

/**
 * Series configuration for multi-series charts.
 *
 * @remarks
 * Mirrors Chakra's useChart series config. Each series represents a data
 * dimension to be visualized (e.g., "revenue", "profit").
 *
 * @property name - Data key name (matches keys in data points)
 * @property color - Chakra color token (e.g., "teal.solid", "blue.500")
 * @property stackId - Stack group ID (same stackId = stacked together)
 * @property label - Display label (defaults to name)
 */
export const ChartSeriesType = StructType({
    name: StringType,
    color: OptionType(StringType),
    stackId: OptionType(StringType),
    label: OptionType(StringType),
});

/**
 * Type representing chart series configuration.
 */
export type ChartSeriesType = typeof ChartSeriesType;

/**
 * TypeScript interface for chart series configuration.
 */
export interface ChartSeries {
    /** Data key name (matches keys in data points) */
    name: SubtypeExprOrValue<StringType>;
    /** Chakra color token (e.g., "teal.solid", "blue.500") */
    color?: SubtypeExprOrValue<StringType>;
    /** Stack group ID (same stackId = stacked together) */
    stackId?: SubtypeExprOrValue<StringType>;
    /** Display label (defaults to name) */
    label?: SubtypeExprOrValue<StringType>;
}

// ============================================================================
// Sort Direction Type
// ============================================================================

/**
 * Sort direction for BarList and BarSegment sorting.
 *
 * @property asc - Ascending order (smallest to largest)
 * @property desc - Descending order (largest to smallest)
 */
export const ChartSortDirectionType = VariantType({
    asc: NullType,
    desc: NullType,
});

/**
 * Type representing chart sort direction.
 */
export type ChartSortDirectionType = typeof ChartSortDirectionType;

/**
 * String literal type for sort direction values.
 */
export type ChartSortDirectionLiteral = "asc" | "desc";

// ============================================================================
// Sort Type
// ============================================================================

/**
 * Sort configuration for BarList and BarSegment.
 *
 * @property by - Data key to sort by
 * @property direction - Sort direction (asc or desc)
 */
export const ChartSortType = StructType({
    by: StringType,
    direction: ChartSortDirectionType,
});

/**
 * Type representing chart sort configuration.
 */
export type ChartSortType = typeof ChartSortType;

/**
 * TypeScript interface for chart sort configuration.
 */
export interface ChartSort {
    /** Data key to sort by */
    by: SubtypeExprOrValue<StringType>;
    /** Sort direction */
    direction: SubtypeExprOrValue<ChartSortDirectionType> | ChartSortDirectionLiteral;
}

// ============================================================================
// Tick Format Type
// ============================================================================

/**
 * Tick format for axis values.
 *
 * @remarks
 * Maps to Intl.NumberFormat style options for number formatting,
 * and Intl.DateTimeFormat for date/time formatting.
 *
 * @property number - Plain number (default)
 * @property currency - Currency format ($1,234.56)
 * @property percent - Percentage format (12.3%)
 * @property compact - Compact notation (1.2K, 3.4M)
 * @property date - Formatted date
 * @property time - Formatted time
 * @property datetime - Date and time
 */
export const TickFormatType = VariantType({
    number: NullType,
    currency: NullType,
    percent: NullType,
    compact: NullType,
    date: NullType,
    time: NullType,
    datetime: NullType,
});

/**
 * Type representing tick format.
 */
export type TickFormatType = typeof TickFormatType;

/**
 * String literal type for tick format values.
 */
export type TickFormatLiteral = "number" | "currency" | "percent" | "compact" | "date" | "time" | "datetime";

// ============================================================================
// Curve Type
// ============================================================================

/**
 * Line/Area curve type.
 *
 * @remarks
 * Maps to Recharts curve types for controlling line smoothness.
 *
 * @property linear - Straight lines between points
 * @property natural - Natural cubic spline
 * @property monotone - Monotone cubic spline
 * @property step - Step function
 * @property stepBefore - Step function before point
 * @property stepAfter - Step function after point
 */
export const CurveType = VariantType({
    linear: NullType,
    natural: NullType,
    monotone: NullType,
    step: NullType,
    stepBefore: NullType,
    stepAfter: NullType,
});

/**
 * Type representing curve type.
 */
export type CurveType = typeof CurveType;

/**
 * String literal type for curve values.
 */
export type CurveLiteral = "linear" | "natural" | "monotone" | "step" | "stepBefore" | "stepAfter";

// ============================================================================
// Stack Offset Type
// ============================================================================

/**
 * Stack offset mode for stacked charts.
 *
 * @remarks
 * Controls how stacked areas/bars are positioned.
 *
 * @property none - Regular stacking (default)
 * @property expand - Normalize to 100%
 * @property wiggle - Streamgraph style
 * @property silhouette - Centered streamgraph
 */
export const StackOffsetType = VariantType({
    none: NullType,
    expand: NullType,
    wiggle: NullType,
    silhouette: NullType,
});

/**
 * Type representing stack offset.
 */
export type StackOffsetType = typeof StackOffsetType;

/**
 * String literal type for stack offset values.
 */
export type StackOffsetLiteral = "none" | "expand" | "wiggle" | "silhouette";

// ============================================================================
// Bar Layout Type
// ============================================================================

/**
 * Bar chart layout direction.
 *
 * @remarks
 * Note: In Recharts, "horizontal" layout = vertical bars,
 * "vertical" layout = horizontal bars.
 *
 * @property horizontal - Vertical bars (default)
 * @property vertical - Horizontal bars
 */
export const BarLayoutType = VariantType({
    horizontal: NullType,
    vertical: NullType,
});

/**
 * Type representing bar layout.
 */
export type BarLayoutType = typeof BarLayoutType;

/**
 * String literal type for bar layout values.
 */
export type BarLayoutLiteral = "horizontal" | "vertical";

// ============================================================================
// Chart Axis Type
// ============================================================================

/**
 * Axis configuration type.
 *
 * @remarks
 * Configuration for X or Y axis including data binding, labels, and formatting.
 *
 * @property dataKey - Data key for axis values
 * @property label - Axis label text
 * @property tickFormat - Format for tick values
 * @property domain - Value range [min, max]
 * @property hide - Hide the axis
 */
export const ChartAxisType = StructType({
    dataKey: OptionType(StringType),
    label: OptionType(StringType),
    tickFormat: OptionType(TickFormatType),
    domain: OptionType(ArrayType(FloatType)),
    hide: OptionType(BooleanType),
});

/**
 * Type representing chart axis configuration.
 */
export type ChartAxisType = typeof ChartAxisType;

/**
 * TypeScript interface for chart axis configuration.
 */
export interface ChartAxis {
    /** Data key for axis values */
    dataKey?: SubtypeExprOrValue<StringType>;
    /** Axis label text */
    label?: SubtypeExprOrValue<StringType>;
    /** Format for tick values */
    tickFormat?: SubtypeExprOrValue<TickFormatType> | TickFormatLiteral;
    /** Value range [min, max] */
    domain?: SubtypeExprOrValue<ArrayType<FloatType>>;
    /** Hide the axis */
    hide?: SubtypeExprOrValue<BooleanType>;
}

// ============================================================================
// Chart Data Point Type
// ============================================================================

/**
 * Generic chart data point type.
 *
 * @remarks
 * Data points are key-value pairs where keys are strings (category names,
 * series names) and values are numbers. This flexible structure allows
 * for dynamic data shapes.
 *
 * Example: { month: "Jan", revenue: 100, profit: 50 }
 */
export const ChartDataPointType = StructType({
    // Using a struct with flexible fields via any data shape
    // The actual data is passed as JS objects and converted at runtime
});

/**
 * Type representing a chart data point.
 */
export type ChartDataPointType = typeof ChartDataPointType;

// ============================================================================
// Common Chart Style Properties
// ============================================================================

/**
 * Base chart dimensions and display options.
 */
export interface BaseChartStyle {
    /** Show grid lines */
    showGrid?: SubtypeExprOrValue<BooleanType>;
    /** Show tooltip on hover */
    showTooltip?: SubtypeExprOrValue<BooleanType>;
    /** Show legend */
    showLegend?: SubtypeExprOrValue<BooleanType>;
    /** Chart width in pixels */
    width?: SubtypeExprOrValue<IntegerType>;
    /** Chart height in pixels */
    height?: SubtypeExprOrValue<IntegerType>;
}

/**
 * Base chart style type for serialization.
 */
export const BaseChartStyleType = StructType({
    showGrid: OptionType(BooleanType),
    showTooltip: OptionType(BooleanType),
    showLegend: OptionType(BooleanType),
    width: OptionType(IntegerType),
    height: OptionType(IntegerType),
});
