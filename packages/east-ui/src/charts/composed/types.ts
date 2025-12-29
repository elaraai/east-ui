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
    VariantType,
} from "@elaraai/east";

import {
    ChartSeriesType,
    ChartAxisType,
    ChartGridType,
    ChartTooltipType,
    ChartLegendType,
    ChartMarginType,
    ChartBrushType,
    CurveType,
    BarLayoutType,
    StackOffsetType,
    MultiSeriesDataType,
    ReferenceLineType,
    ReferenceDotType,
    ReferenceAreaType,
    YAxisIdType,
    type CurveLiteral,
    type BarLayoutLiteral,
    type StackOffsetLiteral,
    type YAxisIdLiteral,
    type BaseChartStyle,
    type ChartBrushStyleBase,
    type ChartAxisStyle,
    type ReferenceLineStyle,
    type ReferenceDotStyle,
    type ReferenceAreaStyle,
} from "../types.js";
import { LineChartSeriesType } from "../line/types.js";
import { AreaRangeSeriesType } from "../area/types.js";

// ============================================================================
// Composed Series Type (Discriminated Variant)
// ============================================================================

/**
 * Composed series type - a discriminated variant where each tag
 * determines the series chart type and reuses existing series types.
 *
 * @property line - Line series (uses LineChartSeriesType with showDots, showLine)
 * @property area - Area series (uses ChartSeriesType with fill, fillOpacity, stackId)
 * @property areaRange - Area range series (uses AreaRangeSeriesType with lowKey/highKey)
 * @property bar - Bar series (uses ChartSeriesType with fill, fillOpacity, stackId)
 * @property scatter - Scatter series (uses ChartSeriesType)
 */
export const ComposedSeriesType = VariantType({
    line: LineChartSeriesType,
    area: ChartSeriesType,
    areaRange: AreaRangeSeriesType,
    bar: ChartSeriesType,
    scatter: ChartSeriesType,
});

/**
 * Type representing a composed series.
 */
export type ComposedSeriesType = typeof ComposedSeriesType;

// ============================================================================
// Composed Chart Type (East Struct)
// ============================================================================

/**
 * Composed chart component type.
 *
 * @remarks
 * Composed charts combine multiple chart types (Line, Area, Bar, Scatter, AreaRange)
 * in a single visualization. Each series specifies its own chart type
 * via the discriminated variant.
 *
 * Supports two data formats:
 * - Single array: `data` contains all series in one array (series keys are field names)
 * - Multi-series: `dataSeries` contains separate arrays per series (for sparse data)
 *
 * @property data - Array of data points (single array form)
 * @property dataSeries - Record of arrays per series (multi-series form, for sparse data)
 * @property valueKey - Field name for Y values when using dataSeries
 * @property series - Series configuration (discriminated variant array)
 * @property xAxis - X-axis configuration
 * @property yAxis - Y-axis configuration
 * @property layout - Bar direction (horizontal = vertical bars)
 * @property curveType - Line/area curve interpolation type
 * @property stackOffset - Stack offset mode
 * @property grid - Grid configuration
 * @property tooltip - Tooltip configuration
 * @property legend - Legend configuration
 * @property margin - Chart margin configuration
 * @property brush - Brush configuration for range selection
 * @property barSize - Bar width/height in pixels
 * @property barGap - Gap between bars in pixels
 * @property showDots - Show dots at data points (global default for line)
 * @property connectNulls - Connect line across null data points
 */
export const ComposedChartType = StructType({
    data: ArrayType(DictType(StringType, LiteralValueType)),
    dataSeries: OptionType(MultiSeriesDataType),
    valueKey: OptionType(StringType),
    series: ArrayType(ComposedSeriesType),
    xAxis: OptionType(ChartAxisType),
    yAxis: OptionType(ChartAxisType),
    yAxis2: OptionType(ChartAxisType),
    layout: OptionType(BarLayoutType),
    curveType: OptionType(CurveType),
    stackOffset: OptionType(StackOffsetType),
    grid: OptionType(ChartGridType),
    tooltip: OptionType(ChartTooltipType),
    legend: OptionType(ChartLegendType),
    margin: OptionType(ChartMarginType),
    brush: OptionType(ChartBrushType),
    barSize: OptionType(IntegerType),
    barGap: OptionType(IntegerType),
    showDots: OptionType(BooleanType),
    connectNulls: OptionType(BooleanType),
    referenceLines: OptionType(ArrayType(ReferenceLineType)),
    referenceDots: OptionType(ArrayType(ReferenceDotType)),
    referenceAreas: OptionType(ArrayType(ReferenceAreaType)),
});

/**
 * Type representing a composed chart.
 */
export type ComposedChartType = typeof ComposedChartType;

// ============================================================================
// TypeScript Interfaces for Type-Safe API
// ============================================================================

/**
 * Base series configuration shared by all chart types.
 */
export interface ComposedSeriesBase {
    /** Chakra color token (e.g., "teal.solid", "blue.500") */
    color?: SubtypeExprOrValue<StringType>;
    /** Display label (defaults to series name) */
    label?: SubtypeExprOrValue<StringType>;
    /** Stroke color (defaults to color) */
    stroke?: SubtypeExprOrValue<StringType>;
    /** Stroke width in pixels */
    strokeWidth?: SubtypeExprOrValue<IntegerType>;
    /** Y-axis binding (left = primary yAxis, right = secondary yAxis2) */
    yAxisId?: SubtypeExprOrValue<YAxisIdType> | YAxisIdLiteral;
}

/**
 * Line series configuration.
 */
export interface ComposedLineSeries extends ComposedSeriesBase {
    /** Chart type discriminator */
    type: "line";
    /** Dash pattern for dashed lines (e.g., "5 5") */
    strokeDasharray?: SubtypeExprOrValue<StringType>;
    /** Show dots at data points */
    showDots?: SubtypeExprOrValue<BooleanType>;
    /** Show the line (default true) */
    showLine?: SubtypeExprOrValue<BooleanType>;
    /** Stack group ID */
    stackId?: SubtypeExprOrValue<StringType>;
}

/**
 * Area series configuration.
 */
export interface ComposedAreaSeries extends ComposedSeriesBase {
    /** Chart type discriminator */
    type: "area";
    /** Fill color (defaults to color) */
    fill?: SubtypeExprOrValue<StringType>;
    /** Fill opacity (0-1) */
    fillOpacity?: SubtypeExprOrValue<FloatType>;
    /** Stack group ID (same stackId = stacked together) */
    stackId?: SubtypeExprOrValue<StringType>;
    /** Dash pattern for dashed stroke */
    strokeDasharray?: SubtypeExprOrValue<StringType>;
}

/**
 * Area range series configuration for bands/ranges.
 */
export interface ComposedAreaRangeSeries extends ComposedSeriesBase {
    /** Chart type discriminator */
    type: "area-range";
    /** Field name for lower bound values */
    lowKey: string;
    /** Field name for upper bound values */
    highKey: string;
    /** Fill opacity (0-1) */
    fillOpacity?: SubtypeExprOrValue<FloatType>;
}

/**
 * Bar series configuration.
 */
export interface ComposedBarSeries extends ComposedSeriesBase {
    /** Chart type discriminator */
    type: "bar";
    /** Fill color (defaults to color) */
    fill?: SubtypeExprOrValue<StringType>;
    /** Fill opacity (0-1) */
    fillOpacity?: SubtypeExprOrValue<FloatType>;
    /** Stack group ID (same stackId = stacked together) */
    stackId?: SubtypeExprOrValue<StringType>;
    /** Dash pattern for dashed stroke */
    strokeDasharray?: SubtypeExprOrValue<StringType>;
}

/**
 * Scatter series configuration.
 */
export interface ComposedScatterSeries extends ComposedSeriesBase {
    /** Chart type discriminator */
    type: "scatter";
    /** Fill color for points */
    fill?: SubtypeExprOrValue<StringType>;
    /** Fill opacity (0-1) */
    fillOpacity?: SubtypeExprOrValue<FloatType>;
}

/**
 * Union type for all composed series configurations.
 */
export type ComposedSeriesConfig =
    | ComposedLineSeries
    | ComposedAreaSeries
    | ComposedAreaRangeSeries
    | ComposedBarSeries
    | ComposedScatterSeries;

// ============================================================================
// Composed Chart Style Interfaces
// ============================================================================

/**
 * Base style options shared by Composed and ComposedMulti charts.
 */
export interface ComposedChartStyleBase<DataKey extends string = string> extends BaseChartStyle {
    /** X-axis configuration */
    xAxis?: ChartAxisStyle<DataKey>;
    /** Y-axis configuration (primary, left side) */
    yAxis?: ChartAxisStyle<DataKey>;
    /** Secondary Y-axis configuration (right side) */
    yAxis2?: ChartAxisStyle<DataKey>;
    /** Bar direction (horizontal = vertical bars, vertical = horizontal bars) */
    layout?: SubtypeExprOrValue<BarLayoutType> | BarLayoutLiteral;
    /** Line/area curve interpolation type */
    curveType?: SubtypeExprOrValue<CurveType> | CurveLiteral;
    /** Stack offset mode */
    stackOffset?: SubtypeExprOrValue<StackOffsetType> | StackOffsetLiteral;
    /** Bar width/height in pixels */
    barSize?: SubtypeExprOrValue<IntegerType>;
    /** Gap between bars in pixels */
    barGap?: SubtypeExprOrValue<IntegerType>;
    /** Show dots at data points (global default for line series) */
    showDots?: SubtypeExprOrValue<BooleanType>;
    /** Connect line across null data points */
    connectNulls?: SubtypeExprOrValue<BooleanType>;
    /** Reference lines (horizontal/vertical lines at specific values) */
    referenceLines?: ReferenceLineStyle[];
    /** Reference dots (markers at specific x,y coordinates) */
    referenceDots?: ReferenceDotStyle[];
    /** Reference areas (highlighted rectangular regions) */
    referenceAreas?: ReferenceAreaStyle[];
}

/**
 * Brush configuration for Composed charts with type-safe dataKey.
 */
export interface ComposedChartBrushStyle<DataKey extends string = string> extends ChartBrushStyleBase {
    /** Data key for brush labels (defaults to xAxis dataKey) */
    dataKey?: DataKey;
}

/**
 * Style for Composed charts (single array form).
 *
 * @typeParam DataKey - Union of field keys from the data struct
 * @typeParam SeriesKey - Union of series names (data field keys used as series)
 */
export interface ComposedChartStyle<
    DataKey extends string = string,
    SeriesKey extends string = string
> extends ComposedChartStyleBase<DataKey> {
    /** Per-series configuration (keyed by data field name) */
    series: { [K in SeriesKey]?: ComposedSeriesConfig };
    /** Brush configuration for data range selection */
    brush?: ComposedChartBrushStyle<DataKey>;
}

/**
 * Style for ComposedMulti charts (multi-series with separate arrays).
 *
 * @typeParam DataKey - Union of field keys from series array structs
 * @typeParam NumericKey - Union of numeric field keys (for valueKey)
 * @typeParam SeriesKey - Union of series names (record keys)
 */
export interface ComposedChartMultiStyle<
    DataKey extends string = string,
    NumericKey extends string = string,
    SeriesKey extends string = string
> extends ComposedChartStyleBase<DataKey> {
    /** Field name containing Y values in each series array (must be numeric) */
    valueKey: NumericKey;
    /** Per-series configuration (keyed by series name) */
    series: { [K in SeriesKey]?: ComposedSeriesConfig };
    /** Brush configuration for data range selection */
    brush?: ComposedChartBrushStyle<DataKey>;
}
