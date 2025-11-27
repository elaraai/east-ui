/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    ArrayType,
    DictType,
    StringType,
    LiteralValueType,
    variant,
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import {
    ChartSeriesType,
    ChartAxisType,
    BarLayoutType,
    StackOffsetType,
    TickFormatType,
    type ChartSeries,
} from "../types.js";
import type { BarChartStyle } from "./types.js";

// Re-export types
export { BarChartType, type BarChartStyle } from "./types.js";

// ============================================================================
// Helper Functions
// ============================================================================

function convertSeries(series: ChartSeries[]): ExprType<ArrayType<ChartSeriesType>> {
    return East.value(
        series.map(s => ({
            name: s.name,
            color: s.color !== undefined ? variant("some", s.color) : variant("none", null),
            stackId: s.stackId !== undefined ? variant("some", s.stackId) : variant("none", null),
            label: s.label !== undefined ? variant("some", s.label) : variant("none", null),
        })),
        ArrayType(ChartSeriesType)
    );
}

function convertAxis(axis: BarChartStyle["xAxis"]): ExprType<typeof ChartAxisType> | undefined {
    if (!axis) return undefined;

    const tickFormatValue = axis.tickFormat
        ? (typeof axis.tickFormat === "string"
            ? East.value(variant(axis.tickFormat, null), TickFormatType)
            : axis.tickFormat)
        : undefined;

    return East.value({
        dataKey: axis.dataKey !== undefined ? variant("some", axis.dataKey) : variant("none", null),
        label: axis.label !== undefined ? variant("some", axis.label) : variant("none", null),
        tickFormat: tickFormatValue ? variant("some", tickFormatValue) : variant("none", null),
        domain: axis.domain !== undefined ? variant("some", axis.domain) : variant("none", null),
        hide: axis.hide !== undefined ? variant("some", axis.hide) : variant("none", null),
    }, ChartAxisType);
}

// ============================================================================
// Bar Chart Function
// ============================================================================

/**
 * Creates a Bar chart component.
 *
 * @param data - Array of data points
 * @param series - Series configuration
 * @param style - Optional styling configuration
 * @returns An East expression representing the bar chart component
 *
 * @example
 * ```ts
 * import { Chart } from "@elaraai/east-ui";
 *
 * // Basic bar chart
 * Chart.Bar(
 *   [{ month: "Jan", revenue: 186 }, { month: "Feb", revenue: 305 }],
 *   [{ name: "revenue", color: "blue.solid" }],
 *   { xAxis: { dataKey: "month" }, showGrid: true }
 * );
 *
 * // Horizontal bar chart
 * Chart.Bar(data, [{ name: "value" }], { layout: "vertical" });
 * ```
 */
export function createBarChart(
    data: SubtypeExprOrValue<ArrayType<DictType<StringType, LiteralValueType>>>,
    series: ChartSeries[],
    style?: BarChartStyle
): ExprType<UIComponentType> {

    const layoutValue = style?.layout
        ? (typeof style.layout === "string"
            ? East.value(variant(style.layout, null), BarLayoutType)
            : style.layout)
        : undefined;

    const stackOffsetValue = style?.stackOffset
        ? (typeof style.stackOffset === "string"
            ? East.value(variant(style.stackOffset, null), StackOffsetType)
            : style.stackOffset)
        : undefined;

    const xAxisValue = convertAxis(style?.xAxis);
    const yAxisValue = convertAxis(style?.yAxis);

    return East.value(variant("BarChart", {
        data: data,
        series: convertSeries(series),
        xAxis: xAxisValue ? variant("some", xAxisValue) : variant("none", null),
        yAxis: yAxisValue ? variant("some", yAxisValue) : variant("none", null),
        layout: layoutValue ? variant("some", layoutValue) : variant("none", null),
        stacked: style?.stacked !== undefined ? variant("some", style.stacked) : variant("none", null),
        stackOffset: stackOffsetValue ? variant("some", stackOffsetValue) : variant("none", null),
        showGrid: style?.showGrid !== undefined ? variant("some", style.showGrid) : variant("none", null),
        showTooltip: style?.showTooltip !== undefined ? variant("some", style.showTooltip) : variant("none", null),
        showLegend: style?.showLegend !== undefined ? variant("some", style.showLegend) : variant("none", null),
        barSize: style?.barSize !== undefined ? variant("some", style.barSize) : variant("none", null),
        barGap: style?.barGap !== undefined ? variant("some", style.barGap) : variant("none", null),
        radius: style?.radius !== undefined ? variant("some", style.radius) : variant("none", null),
        width: style?.width !== undefined ? variant("some", style.width) : variant("none", null),
        height: style?.height !== undefined ? variant("some", style.height) : variant("none", null),
    }), UIComponentType);
}
