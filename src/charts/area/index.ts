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
    CurveType,
    StackOffsetType,
    TickFormatType,
    type ChartSeries,
} from "../types.js";
import type { AreaChartStyle } from "./types.js";

// Re-export types
export { AreaChartType, type AreaChartStyle } from "./types.js";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Converts a ChartSeries array to East value.
 */
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

/**
 * Converts ChartAxis config to East value.
 */
function convertAxis(axis: AreaChartStyle["xAxis"]): ExprType<typeof ChartAxisType> | undefined {
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
// Area Chart Function
// ============================================================================

/**
 * Creates an Area chart component.
 *
 * @param data - Array of data points
 * @param series - Series configuration
 * @param style - Optional styling configuration
 * @returns An East expression representing the area chart component
 *
 * @remarks
 * Area charts display quantitative data with filled areas under curves.
 * Use stacked mode to show part-to-whole relationships, or stackOffset="expand"
 * for 100% stacked area charts.
 *
 * @example
 * ```ts
 * import { Chart } from "@elaraai/east-ui";
 *
 * // Basic area chart
 * const chart = Chart.Area(
 *   [
 *     { month: "Jan", revenue: 186 },
 *     { month: "Feb", revenue: 305 },
 *     { month: "Mar", revenue: 237 },
 *   ],
 *   [{ name: "revenue", color: "teal.solid" }],
 *   {
 *     xAxis: { dataKey: "month" },
 *     showGrid: true,
 *     curveType: "natural",
 *   }
 * );
 *
 * // 100% stacked area chart
 * const stackedChart = Chart.Area(
 *   osUsageData,
 *   [
 *     { name: "windows", color: "teal.solid" },
 *     { name: "mac", color: "purple.solid" },
 *     { name: "linux", color: "blue.solid" },
 *   ],
 *   {
 *     stacked: true,
 *     stackOffset: "expand",
 *     showLegend: true,
 *   }
 * );
 * ```
 */
export function createAreaChart(
    data: SubtypeExprOrValue<ArrayType<DictType<StringType, LiteralValueType>>>,
    series: ChartSeries[],
    style?: AreaChartStyle
): ExprType<UIComponentType> {

    const curveValue = style?.curveType
        ? (typeof style.curveType === "string"
            ? East.value(variant(style.curveType, null), CurveType)
            : style.curveType)
        : undefined;

    const stackOffsetValue = style?.stackOffset
        ? (typeof style.stackOffset === "string"
            ? East.value(variant(style.stackOffset, null), StackOffsetType)
            : style.stackOffset)
        : undefined;

    const xAxisValue = convertAxis(style?.xAxis);
    const yAxisValue = convertAxis(style?.yAxis);

    return East.value(variant("AreaChart", {
        data: data,
        series: convertSeries(series),
        xAxis: xAxisValue ? variant("some", xAxisValue) : variant("none", null),
        yAxis: yAxisValue ? variant("some", yAxisValue) : variant("none", null),
        curveType: curveValue ? variant("some", curveValue) : variant("none", null),
        stacked: style?.stacked !== undefined ? variant("some", style.stacked) : variant("none", null),
        stackOffset: stackOffsetValue ? variant("some", stackOffsetValue) : variant("none", null),
        showGrid: style?.showGrid !== undefined ? variant("some", style.showGrid) : variant("none", null),
        showTooltip: style?.showTooltip !== undefined ? variant("some", style.showTooltip) : variant("none", null),
        showLegend: style?.showLegend !== undefined ? variant("some", style.showLegend) : variant("none", null),
        fillOpacity: style?.fillOpacity !== undefined ? variant("some", style.fillOpacity) : variant("none", null),
        connectNulls: style?.connectNulls !== undefined ? variant("some", style.connectNulls) : variant("none", null),
        width: style?.width !== undefined ? variant("some", style.width) : variant("none", null),
        height: style?.height !== undefined ? variant("some", style.height) : variant("none", null),
    }), UIComponentType);
}
