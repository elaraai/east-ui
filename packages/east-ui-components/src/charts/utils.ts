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
    TickFormatType,
} from "@elaraai/east-ui/internal";
import type { UseChartProps, UseChartReturn } from "@chakra-ui/charts";
import type {
    CartesianGridProps,
    XAxisProps,
    YAxisProps,
    TooltipProps as RechartsTooltipProps,
    LegendProps as RechartsLegendProps,
} from "recharts";
import { getSomeorUndefined } from "../utils";

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
    if (label !== undefined) props.label = label;

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

    const label = getSomeorUndefined(value.label);
    if (label !== undefined) props.label = label;

    const tickMargin = getSomeorUndefined(value.tickMargin);
    if (tickMargin !== undefined) props.tickMargin = Number(tickMargin);

    const orientation = getSomeorUndefined(value.orientation)?.type;
    if (orientation === "left" || orientation === "right") {
        props.orientation = orientation;
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
