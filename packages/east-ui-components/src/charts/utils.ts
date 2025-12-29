/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { match, type ValueTypeOf, type LiteralValueType } from "@elaraai/east";
import type {
    ChartAxisType,
    ChartSeriesType,
    ChartGridType,
    ChartLegendType,
    ChartTooltipType,
    ChartMarginType,
    ChartBrushType,
    TickFormatType,
    ReferenceLineType,
    ReferenceDotType,
    ReferenceAreaType,
} from "@elaraai/east-ui/internal";
import type { UseChartProps, UseChartReturn } from "@chakra-ui/charts";
import type {
    CartesianGridProps,
    XAxisProps,
    YAxisProps,
    TooltipProps as RechartsTooltipProps,
    LegendProps as RechartsLegendProps,
    BrushProps as RechartsBrushProps,
    ReferenceLineProps,
    ReferenceDotProps,
    ReferenceAreaProps,
} from "recharts";
import { getSomeorUndefined } from "../utils";

/** Recharts label position type */
type LabelPosition = "top" | "left" | "right" | "bottom" | "inside" | "outside" | "insideLeft" | "insideRight" | "insideTop" | "insideBottom" | "insideTopLeft" | "insideBottomLeft" | "insideTopRight" | "insideBottomRight" | "end" | "center";

// ============================================================================
// Value Types
// ============================================================================

/** East ChartSeries value type */
export type ChartSeriesValue = ValueTypeOf<ChartSeriesType>;

/** East ChartAxis value type */
export type ChartAxisValue = ValueTypeOf<ChartAxisType>;

/** East ChartGrid value type */
export type ChartGridValue = ValueTypeOf<ChartGridType>;

/** East ChartLegend value type */
export type ChartLegendValue = ValueTypeOf<ChartLegendType>;

/** East ChartTooltip value type */
export type ChartTooltipValue = ValueTypeOf<ChartTooltipType>;

/** East ChartMargin value type */
export type ChartMarginValue = ValueTypeOf<ChartMarginType>;

/** East TickFormat value type */
export type TickFormatValue = ValueTypeOf<TickFormatType>;

/** East ChartBrush value type */
export type ChartBrushValue = ValueTypeOf<ChartBrushType>;

/** Recharts margin type */
export interface RechartsMargin {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}

// ============================================================================
// Series Conversion
// ============================================================================

/**
 * Series item type derived from Chakra's UseChartProps.
 * This is the type expected by useChart's series parameter.
 */
export type ChartSeriesItem = NonNullable<UseChartProps<Record<string, unknown>>["series"]>[number];

/**
 * Converts an East ChartSeries value to props for Chakra useChart series.
 * Pure function - easy to test independently.
 *
 * @param value - The East ChartSeries value
 * @returns ChartSeriesItem props for Chakra useChart
 */
export function toChartSeries(value: ChartSeriesValue): ChartSeriesItem {
    const result: ChartSeriesItem = {
        name: value.name,
        color: getSomeorUndefined(value.color) ?? "teal.solid",
    };

    const stackId = getSomeorUndefined(value.stackId);
    const label = getSomeorUndefined(value.label);

    if (stackId !== undefined) result.stackId = stackId;
    if (label !== undefined) result.label = label;

    return result;
}

// ============================================================================
// Axis Conversion
// ============================================================================

/**
 * Converts an East ChartAxis value to XAxis component props.
 * Pure function - easy to test independently.
 *
 * @param value - The East ChartAxis value
 * @param chart - The Chakra chart instance (for key() function)
 * @returns Partial XAxisProps
 */
export function toRechartsXAxis(
    value: ChartAxisValue,
    chart: UseChartReturn<Record<string, unknown>>
): Partial<XAxisProps> {
    const props: Partial<XAxisProps> = {};

    const dataKey = getSomeorUndefined(value.dataKey);
    if (dataKey !== undefined) props.dataKey = chart.key(dataKey);

    const hide = getSomeorUndefined(value.hide);
    if (hide !== undefined) props.hide = hide;

    const axisLine = getSomeorUndefined(value.axisLine);
    if (axisLine !== undefined) props.axisLine = axisLine;

    const tickLine = getSomeorUndefined(value.tickLine);
    if (tickLine !== undefined) props.tickLine = tickLine;

    const label = getSomeorUndefined(value.label);
    if (label !== undefined) {
        // Use object form for label to add offset for proper spacing from axis line
        props.label = { value: label, position: "insideBottom", offset: -5 };
    }

    const tickMargin = getSomeorUndefined(value.tickMargin);
    if (tickMargin !== undefined) props.tickMargin = Number(tickMargin);

    const orientation = getSomeorUndefined(value.orientation)?.type;
    if (orientation === "top" || orientation === "bottom") {
        props.orientation = orientation;
    }

    const axisId = getSomeorUndefined(value.axisId);
    if (axisId !== undefined) props.xAxisId = axisId;

    return props;
}

/**
 * Converts an East ChartAxis value to YAxis component props.
 * Pure function - easy to test independently.
 *
 * @param value - The East ChartAxis value
 * @param chart - The Chakra chart instance (for key() function)
 * @returns Partial YAxisProps
 */
export function toRechartsYAxis(
    value: ChartAxisValue,
    chart: UseChartReturn<Record<string, unknown>>
): Partial<YAxisProps> {
    const props: Partial<YAxisProps> = {};

    const dataKey = getSomeorUndefined(value.dataKey);
    if (dataKey !== undefined) props.dataKey = chart.key(dataKey);

    const hide = getSomeorUndefined(value.hide);
    if (hide !== undefined) props.hide = hide;

    const axisLine = getSomeorUndefined(value.axisLine);
    if (axisLine !== undefined) props.axisLine = axisLine;

    const tickLine = getSomeorUndefined(value.tickLine);
    if (tickLine !== undefined) props.tickLine = tickLine;

    const tickMargin = getSomeorUndefined(value.tickMargin);
    if (tickMargin !== undefined) props.tickMargin = Number(tickMargin);

    const orientation = getSomeorUndefined(value.orientation)?.type;
    if (orientation === "left" || orientation === "right") {
        props.orientation = orientation;
    }

    const label = getSomeorUndefined(value.label);
    if (label !== undefined) {
        // Use object form for label to add offset and rotation for proper spacing from axis line
        // Position depends on axis orientation: insideLeft for left axis, insideRight for right axis
        const position = orientation === "right" ? "insideRight" : "insideLeft";
        props.label = { value: label, position, angle: -90, textAnchor: 'middle',  };
    }

    const axisId = getSomeorUndefined(value.axisId);
    if (axisId !== undefined) props.yAxisId = axisId;

    return props;
}

/**
 * Extracts the tick format value from an East ChartAxis value.
 *
 * @param value - The East ChartAxis value
 * @returns The TickFormat value or undefined
 */
export function getAxisTickFormat(value: ChartAxisValue): TickFormatValue | undefined {
    return getSomeorUndefined(value.tickFormat);
}

// ============================================================================
// Grid Conversion
// ============================================================================

/**
 * Converts an East ChartGrid value to CartesianGrid component props.
 * Pure function - easy to test independently.
 *
 * @param value - The East ChartGrid value
 * @param chart - The Chakra chart instance (for color() function)
 * @returns Partial CartesianGridProps
 */
export function toRechartsCartesianGrid(
    value: ChartGridValue,
    chart: UseChartReturn<Record<string, unknown>>
): Partial<CartesianGridProps> {
    const props: Partial<CartesianGridProps> = {
        stroke: chart.color("border.muted"),
    };

    const vertical = getSomeorUndefined(value.vertical);
    if (vertical !== undefined) props.vertical = vertical;

    const horizontal = getSomeorUndefined(value.horizontal);
    if (horizontal !== undefined) props.horizontal = horizontal;

    const strokeColor = getSomeorUndefined(value.strokeColor);
    if (strokeColor !== undefined) props.stroke = chart.color(strokeColor);

    const strokeDasharray = getSomeorUndefined(value.strokeDasharray);
    if (strokeDasharray !== undefined) props.strokeDasharray = strokeDasharray;

    return props;
}

/**
 * Checks if grid should be shown from an East ChartGrid value.
 *
 * @param value - The East ChartGrid value
 * @returns Whether the grid should be shown
 */
export function shouldShowGrid(value: ChartGridValue): boolean {
    return getSomeorUndefined(value.show) ?? true;
}

// ============================================================================
// Legend Conversion
// ============================================================================

/**
 * Converts an East ChartLegend value to Legend component props.
 * Pure function - easy to test independently.
 *
 * @param value - The East ChartLegend value
 * @returns Partial RechartsLegendProps
 */
export function toRechartsLegend(value: ChartLegendValue): Partial<RechartsLegendProps> {
    const props: Partial<RechartsLegendProps> = {};

    const layout = getSomeorUndefined(value.layout)?.type;
    if (layout !== undefined) props.layout = layout;

    const align = getSomeorUndefined(value.align)?.type;
    if (align !== undefined) props.align = align;

    const verticalAlign = getSomeorUndefined(value.verticalAlign)?.type;
    if (verticalAlign !== undefined) props.verticalAlign = verticalAlign;

    return props;
}

/**
 * Checks if legend should be shown from an East ChartLegend value.
 *
 * @param value - The East ChartLegend value
 * @returns Whether the legend should be shown
 */
export function shouldShowLegend(value: ChartLegendValue): boolean {
    return getSomeorUndefined(value.show) ?? true;
}

// ============================================================================
// Tooltip Conversion
// ============================================================================

/**
 * Converts an East ChartTooltip value to Tooltip component props.
 * Pure function - easy to test independently.
 *
 * @param value - The East ChartTooltip value
 * @returns Partial RechartsTooltipProps
 */
export function toRechartsTooltip<TValue extends number | string | Array<number | string>, TName extends string>(
    value: ChartTooltipValue
): Partial<RechartsTooltipProps<TValue, TName>> {
    const props: Partial<RechartsTooltipProps<TValue, TName>> = {};

    const cursor = getSomeorUndefined(value.cursor);
    if (cursor !== undefined) {
        match(cursor, {
            none: () => { props.cursor = false; },
            crosshair: (v) => { props.cursor = { stroke: v, strokeDasharray: "3 3" }; },
            fill: (v) => { props.cursor = { fill: v }; },
        });
    }

    const animationDuration = getSomeorUndefined(value.animationDuration);
    if (animationDuration !== undefined) {
        props.animationDuration = Number(animationDuration);
    }

    return props;
}

/**
 * Checks if tooltip should be shown from an East ChartTooltip value.
 *
 * @param value - The East ChartTooltip value
 * @returns Whether the tooltip should be shown
 */
export function shouldShowTooltip(value: ChartTooltipValue): boolean {
    return getSomeorUndefined(value.show) ?? true;
}

// ============================================================================
// Margin Conversion
// ============================================================================

/**
 * Converts an East ChartMargin value to Recharts Margin.
 * Pure function - easy to test independently.
 *
 * @param value - The East ChartMargin value
 * @returns Margin props for Recharts
 */
export function toRechartsMargin(value: ChartMarginValue): RechartsMargin {
    const margin: RechartsMargin = {};

    const top = getSomeorUndefined(value.top);
    if (top !== undefined) margin.top = Number(top);

    const right = getSomeorUndefined(value.right);
    if (right !== undefined) margin.right = Number(right);

    const bottom = getSomeorUndefined(value.bottom);
    if (bottom !== undefined) margin.bottom = Number(bottom);

    const left = getSomeorUndefined(value.left);
    if (left !== undefined) margin.left = Number(left);

    return margin;
}

/**
 * Default chart margin.
 */
export const DEFAULT_CHART_MARGIN: RechartsMargin = { top: 20, right: 30, left: 5, bottom: 5 };

/**
 * Calculates the chart margin, adding extra bottom margin when both xAxis label and brush are present.
 *
 * @param marginValue - The user-specified margin value (optional)
 * @param hasXAxisLabel - Whether the xAxis has a label
 * @param hasBrush - Whether the chart has a brush
 * @returns The calculated margin
 */
export function calculateChartMargin(
    marginValue: ChartMarginValue | undefined,
    hasXAxisLabel: boolean,
    hasBrush: boolean
): RechartsMargin {
    const baseMargin = marginValue ? toRechartsMargin(marginValue) : { ...DEFAULT_CHART_MARGIN };

    // Add extra bottom margin when both xAxis label and brush are present
    // xAxis label needs ~20px, brush height is typically 40px
    if (hasXAxisLabel && hasBrush) {
        baseMargin.bottom = (baseMargin.bottom ?? 5) + 20;
    }

    return baseMargin;
}

// ============================================================================
// Brush Conversion
// ============================================================================

/**
 * Converts an East ChartBrush value to Brush component props.
 * Pure function - easy to test independently.
 *
 * @param value - The East ChartBrush value
 * @param fallbackDataKey - Fallback dataKey if not specified (typically xAxis dataKey)
 * @returns Partial RechartsBrushProps
 */
export function toRechartsBrush(
    value: ChartBrushValue,
    fallbackDataKey?: string
): Partial<RechartsBrushProps> {
    const props: Partial<RechartsBrushProps> = {};

    const dataKey = getSomeorUndefined(value.dataKey) ?? fallbackDataKey;
    if (dataKey !== undefined) props.dataKey = dataKey;

    const height = getSomeorUndefined(value.height);
    props.height = height !== undefined ? Number(height) : 40;

    const travellerWidth = getSomeorUndefined(value.travellerWidth);
    if (travellerWidth !== undefined) props.travellerWidth = Number(travellerWidth);

    const startIndex = getSomeorUndefined(value.startIndex);
    if (startIndex !== undefined) props.startIndex = Number(startIndex);

    const endIndex = getSomeorUndefined(value.endIndex);
    if (endIndex !== undefined) props.endIndex = Number(endIndex);

    const stroke = getSomeorUndefined(value.stroke);
    if (stroke !== undefined) props.stroke = stroke;

    const fill = getSomeorUndefined(value.fill);
    if (fill !== undefined) props.fill = fill;

    return props;
}

// ============================================================================
// Tick Format Conversion
// ============================================================================

/**
 * Creates a tick formatter function based on TickFormat value and Chakra chart.
 *
 * @param value - The East TickFormat value
 * @param chart - The Chakra chart instance
 * @returns A tick formatter function or undefined
 */
export function createTickFormatter(
    value: TickFormatValue | undefined,
    chart: UseChartReturn<Record<string, unknown>>
): ((value: number) => string) | undefined {
    if (!value) return undefined;

    return match(value, {
        number: (opts) => {
            const options: Intl.NumberFormatOptions = {};
            const minFrac = getSomeorUndefined(opts.minimumFractionDigits);
            const maxFrac = getSomeorUndefined(opts.maximumFractionDigits);
            const signDisplay = getSomeorUndefined(opts.signDisplay);

            if (minFrac !== undefined) options.minimumFractionDigits = Number(minFrac);
            if (maxFrac !== undefined) options.maximumFractionDigits = Number(maxFrac);
            if (signDisplay !== undefined) options.signDisplay = signDisplay.type;

            return chart.formatNumber(options);
        },
        currency: (opts) => {
            const options: Intl.NumberFormatOptions = {
                style: "currency",
                currency: opts.currency.type,
            };
            const display = getSomeorUndefined(opts.display);
            const minFrac = getSomeorUndefined(opts.minimumFractionDigits);
            const maxFrac = getSomeorUndefined(opts.maximumFractionDigits);

            if (display !== undefined) options.currencyDisplay = display.type;
            if (minFrac !== undefined) options.minimumFractionDigits = Number(minFrac);
            if (maxFrac !== undefined) options.maximumFractionDigits = Number(maxFrac);

            return chart.formatNumber(options);
        },
        percent: (opts) => {
            const options: Intl.NumberFormatOptions = { style: "percent" };
            const minFrac = getSomeorUndefined(opts.minimumFractionDigits);
            const maxFrac = getSomeorUndefined(opts.maximumFractionDigits);
            const signDisplay = getSomeorUndefined(opts.signDisplay);

            if (minFrac !== undefined) options.minimumFractionDigits = Number(minFrac);
            if (maxFrac !== undefined) options.maximumFractionDigits = Number(maxFrac);
            if (signDisplay !== undefined) options.signDisplay = signDisplay.type;

            return chart.formatNumber(options);
        },
        compact: (opts) => {
            const options: Intl.NumberFormatOptions = { notation: "compact" };
            const display = getSomeorUndefined(opts.display);

            if (display !== undefined) options.compactDisplay = display.type;

            return chart.formatNumber(options);
        },
        unit: (opts) => {
            const options: Intl.NumberFormatOptions = {
                style: "unit",
                unit: opts.unit.type,
            };
            const display = getSomeorUndefined(opts.display);

            if (display !== undefined) options.unitDisplay = display.type;

            return chart.formatNumber(options);
        },
        scientific: () => chart.formatNumber({ notation: "scientific" }),
        engineering: () => chart.formatNumber({ notation: "engineering" }),
        date: () => undefined,
        time: () => undefined,
        datetime: () => undefined,
    });
}

// ============================================================================
// Data Conversion
// ============================================================================

/**
 * Converts an East LiteralValue to a plain JavaScript value.
 *
 * @param value - The East LiteralValue
 * @returns The plain JavaScript value
 */
export function convertLiteralValue(
    value: ValueTypeOf<typeof LiteralValueType>
): unknown {
    return match(value, {
        String: (s) => s,
        Float: (f) => f,
        Integer: (i) => Number(i),
        Boolean: (b) => b,
        Null: () => null,
        DateTime: (d) => d.toISOString(),
        Blob: () => null,
    });
}

/**
 * Converts an East Dict data point (Map) to a plain object.
 *
 * @param dataPoint - The East Dict data point
 * @returns A plain JavaScript object
 */
export function convertDataPoint(
    dataPoint: Map<string, ValueTypeOf<typeof LiteralValueType>>
): Record<string, unknown> {
    const obj: Record<string, unknown> = {};
    dataPoint.forEach((val, key) => {
        obj[key] = convertLiteralValue(val);
    });
    return obj;
}

/**
 * Converts an array of East Dict data points to plain objects.
 *
 * @param data - Array of East Dict data points
 * @returns Array of plain JavaScript objects
 */
export function convertChartData(
    data: Map<string, ValueTypeOf<typeof LiteralValueType>>[]
): Record<string, unknown>[] {
    return data.map(convertDataPoint);
}

/**
 * Converts multi-series data (record of arrays) to a merged array format for Recharts.
 *
 * @remarks
 * This function takes data in the format:
 * ```
 * {
 *   revenue: [{ month: "Jan", value: 100 }, { month: "Feb", value: 200 }],
 *   profit: [{ month: "Jan", value: 50 }, { month: "Mar", value: 75 }]
 * }
 * ```
 * And converts it to the merged format Recharts expects:
 * ```
 * [
 *   { month: "Jan", revenue: 100, profit: 50 },
 *   { month: "Feb", revenue: 200, profit: null },
 *   { month: "Mar", revenue: null, profit: 75 }
 * ]
 * ```
 *
 * @param dataSeries - Map of series name to array of data points
 * @param xAxisKey - The key used for the x-axis (to merge on)
 * @param valueKey - The key containing the y-value in each data point
 * @returns Array of merged data points
 */
export function convertMultiSeriesData(
    dataSeries: Map<string, Map<string, ValueTypeOf<typeof LiteralValueType>>[]>,
    xAxisKey: string,
    valueKey: string
): Record<string, unknown>[] {
    // Collect all unique x-axis values
    const xAxisValues = new Set<unknown>();
    const seriesData = new Map<string, Map<unknown, unknown>>();

    dataSeries.forEach((dataPoints, seriesName) => {
        const seriesMap = new Map<unknown, unknown>();
        dataPoints.forEach(point => {
            const xValue = point.get(xAxisKey);
            const yValue = point.get(valueKey);
            if (xValue !== undefined) {
                const xConverted = convertLiteralValue(xValue);
                xAxisValues.add(xConverted);
                if (yValue !== undefined) {
                    seriesMap.set(xConverted, convertLiteralValue(yValue));
                }
            }
        });
        seriesData.set(seriesName, seriesMap);
    });

    // Build merged array
    const result: Record<string, unknown>[] = [];
    xAxisValues.forEach(xValue => {
        const row: Record<string, unknown> = { [xAxisKey]: xValue };
        seriesData.forEach((seriesMap, seriesName) => {
            row[seriesName] = seriesMap.get(xValue) ?? null;
        });
        result.push(row);
    });

    return result;
}

/**
 * Range series configuration for area range charts.
 */
export interface RangeSeriesConfig {
    name: string;
    lowKey: string;
    highKey: string;
}

/**
 * Converts an array of East Dict data points to range chart format.
 * For each series, creates a combined field with [low, high] array values.
 *
 * @param data - Array of East Dict data points
 * @param series - Array of range series configurations
 * @returns Array of plain JavaScript objects with range values
 */
export function convertRangeChartData(
    data: Map<string, ValueTypeOf<typeof LiteralValueType>>[],
    series: RangeSeriesConfig[]
): Record<string, unknown>[] {
    return data.map(row => {
        const converted = convertDataPoint(row);
        // Create combined range fields for each series
        for (const s of series) {
            const low = converted[s.lowKey];
            const high = converted[s.highKey];
            if (low !== undefined && high !== undefined) {
                converted[s.name] = [low, high];
            }
        }
        return converted;
    });
}

/**
 * Converts multi-series range data to a merged array format for Recharts.
 *
 * @param dataSeries - Map of series name to array of data points
 * @param xAxisKey - The key used for the x-axis (to merge on)
 * @param lowKey - The key containing the low value in each data point
 * @param highKey - The key containing the high value in each data point
 * @returns Array of merged data points with [low, high] range values
 */
export function convertMultiSeriesRangeData(
    dataSeries: Map<string, Map<string, ValueTypeOf<typeof LiteralValueType>>[]>,
    xAxisKey: string,
    lowKey: string,
    highKey: string
): Record<string, unknown>[] {
    // Collect all unique x-axis values
    const xAxisValues = new Set<unknown>();
    const seriesData = new Map<string, Map<unknown, [unknown, unknown]>>();

    dataSeries.forEach((dataPoints, seriesName) => {
        const seriesMap = new Map<unknown, [unknown, unknown]>();
        dataPoints.forEach(point => {
            const xValue = point.get(xAxisKey);
            const lowValue = point.get(lowKey);
            const highValue = point.get(highKey);
            if (xValue !== undefined) {
                const xConverted = convertLiteralValue(xValue);
                xAxisValues.add(xConverted);
                if (lowValue !== undefined && highValue !== undefined) {
                    seriesMap.set(xConverted, [
                        convertLiteralValue(lowValue),
                        convertLiteralValue(highValue)
                    ]);
                }
            }
        });
        seriesData.set(seriesName, seriesMap);
    });

    // Build merged array
    const result: Record<string, unknown>[] = [];
    xAxisValues.forEach(xValue => {
        const row: Record<string, unknown> = { [xAxisKey]: xValue };
        seriesData.forEach((seriesMap, seriesName) => {
            row[seriesName] = seriesMap.get(xValue) ?? null;
        });
        result.push(row);
    });

    return result;
}

// ============================================================================
// Reference Annotation Conversion
// ============================================================================

/** East ReferenceLine value type */
export type ReferenceLineValue = ValueTypeOf<ReferenceLineType>;

/** East ReferenceDot value type */
export type ReferenceDotValue = ValueTypeOf<ReferenceDotType>;

/** East ReferenceArea value type */
export type ReferenceAreaValue = ValueTypeOf<ReferenceAreaType>;

/**
 * Converts an East ReferenceLine value to Recharts ReferenceLine props.
 *
 * @param value - The East ReferenceLine value
 * @returns Partial ReferenceLineProps
 */
export function toRechartsReferenceLine(value: ReferenceLineValue): Partial<ReferenceLineProps> {
    const props: Partial<ReferenceLineProps> = {};

    const x = getSomeorUndefined(value.x);
    if (x !== undefined) props.x = convertLiteralValue(x) as string | number;

    const y = getSomeorUndefined(value.y);
    if (y !== undefined) props.y = convertLiteralValue(y) as string | number;

    const stroke = getSomeorUndefined(value.stroke);
    if (stroke !== undefined) props.stroke = stroke;

    const strokeWidth = getSomeorUndefined(value.strokeWidth);
    if (strokeWidth !== undefined) props.strokeWidth = Number(strokeWidth);

    const strokeDasharray = getSomeorUndefined(value.strokeDasharray);
    if (strokeDasharray !== undefined) props.strokeDasharray = strokeDasharray;

    const label = getSomeorUndefined(value.label);
    const labelPosition = getSomeorUndefined(value.labelPosition)?.type as LabelPosition | undefined;
    const labelOffset = getSomeorUndefined(value.labelOffset);

    if (label !== undefined) {
        if (labelPosition !== undefined || labelOffset !== undefined) {
            // Use object form for label with position/offset
            const labelObj: { value: string; position?: LabelPosition; offset?: number } = { value: label };
            if (labelPosition !== undefined) labelObj.position = labelPosition;
            if (labelOffset !== undefined) labelObj.offset = Number(labelOffset);
            props.label = labelObj;
        } else {
            props.label = label;
        }
    }

    const ifOverflow = getSomeorUndefined(value.ifOverflow);
    if (ifOverflow !== undefined) props.ifOverflow = ifOverflow.type;

    return props;
}

/**
 * Converts an East ReferenceDot value to Recharts ReferenceDot props.
 *
 * @param value - The East ReferenceDot value
 * @returns Partial ReferenceDotProps
 */
export function toRechartsReferenceDot(value: ReferenceDotValue): Partial<ReferenceDotProps> {
    const props: Partial<ReferenceDotProps> = {};

    // x and y are required (not OptionType) for ReferenceDot
    props.x = convertLiteralValue(value.x) as string | number;
    props.y = convertLiteralValue(value.y) as string | number;

    const r = getSomeorUndefined(value.r);
    if (r !== undefined) props.r = Number(r);

    const fill = getSomeorUndefined(value.fill);
    if (fill !== undefined) props.fill = fill;

    const stroke = getSomeorUndefined(value.stroke);
    if (stroke !== undefined) props.stroke = stroke;

    const strokeWidth = getSomeorUndefined(value.strokeWidth);
    if (strokeWidth !== undefined) props.strokeWidth = Number(strokeWidth);

    const label = getSomeorUndefined(value.label);
    const labelPosition = getSomeorUndefined(value.labelPosition)?.type as LabelPosition | undefined;
    const labelOffset = getSomeorUndefined(value.labelOffset);

    if (label !== undefined) {
        if (labelPosition !== undefined || labelOffset !== undefined) {
            // Use object form for label with position/offset
            const labelObj: { value: string; position?: LabelPosition; offset?: number } = { value: label };
            if (labelPosition !== undefined) labelObj.position = labelPosition;
            if (labelOffset !== undefined) labelObj.offset = Number(labelOffset);
            props.label = labelObj;
        } else {
            props.label = label;
        }
    }

    const ifOverflow = getSomeorUndefined(value.ifOverflow);
    if (ifOverflow !== undefined) props.ifOverflow = ifOverflow.type;

    return props;
}

/**
 * Converts an East ReferenceArea value to Recharts ReferenceArea props.
 *
 * @param value - The East ReferenceArea value
 * @returns Partial ReferenceAreaProps
 */
export function toRechartsReferenceArea(value: ReferenceAreaValue): Partial<ReferenceAreaProps> {
    const props: Partial<ReferenceAreaProps> = {};

    const x1 = getSomeorUndefined(value.x1);
    if (x1 !== undefined) props.x1 = convertLiteralValue(x1) as string | number;

    const x2 = getSomeorUndefined(value.x2);
    if (x2 !== undefined) props.x2 = convertLiteralValue(x2) as string | number;

    const y1 = getSomeorUndefined(value.y1);
    if (y1 !== undefined) props.y1 = convertLiteralValue(y1) as string | number;

    const y2 = getSomeorUndefined(value.y2);
    if (y2 !== undefined) props.y2 = convertLiteralValue(y2) as string | number;

    const fill = getSomeorUndefined(value.fill);
    if (fill !== undefined) props.fill = fill;

    const fillOpacity = getSomeorUndefined(value.fillOpacity);
    if (fillOpacity !== undefined) props.fillOpacity = fillOpacity;

    const stroke = getSomeorUndefined(value.stroke);
    if (stroke !== undefined) props.stroke = stroke;

    const label = getSomeorUndefined(value.label);
    const labelPosition = getSomeorUndefined(value.labelPosition)?.type as LabelPosition | undefined;
    const labelOffset = getSomeorUndefined(value.labelOffset);

    if (label !== undefined) {
        if (labelPosition !== undefined || labelOffset !== undefined) {
            // Use object form for label with position/offset
            const labelObj: { value: string; position?: LabelPosition; offset?: number } = { value: label };
            if (labelPosition !== undefined) labelObj.position = labelPosition;
            if (labelOffset !== undefined) labelObj.offset = Number(labelOffset);
            props.label = labelObj;
        } else {
            props.label = label;
        }
    }

    const ifOverflow = getSomeorUndefined(value.ifOverflow);
    if (ifOverflow !== undefined) props.ifOverflow = ifOverflow.type;

    return props;
}
