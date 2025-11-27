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
    TickFormatType,
    type ChartSeries,
} from "../types.js";
import type { LineChartStyle } from "./types.js";

// Re-export types
export { LineChartType, type LineChartStyle } from "./types.js";

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

function convertAxis(axis: LineChartStyle["xAxis"]): ExprType<typeof ChartAxisType> | undefined {
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
// Line Chart Function
// ============================================================================

/**
 * Creates a Line chart component.
 *
 * @param data - Array of data points
 * @param series - Series configuration
 * @param style - Optional styling configuration
 * @returns An East expression representing the line chart component
 *
 * @example
 * ```ts
 * import { Chart } from "@elaraai/east-ui";
 *
 * Chart.Line(
 *   [{ month: "Jan", revenue: 186, profit: 80 }],
 *   [
 *     { name: "revenue", color: "teal.solid" },
 *     { name: "profit", color: "purple.solid" },
 *   ],
 *   { xAxis: { dataKey: "month" }, curveType: "natural", showDots: true }
 * );
 * ```
 */
export function createLineChart(
    data: SubtypeExprOrValue<ArrayType<DictType<StringType, LiteralValueType>>>,
    series: ChartSeries[],
    style?: LineChartStyle
): ExprType<UIComponentType> {

    const curveValue = style?.curveType
        ? (typeof style.curveType === "string"
            ? East.value(variant(style.curveType, null), CurveType)
            : style.curveType)
        : undefined;

    const xAxisValue = convertAxis(style?.xAxis);
    const yAxisValue = convertAxis(style?.yAxis);

    return East.value(variant("LineChart", {
        data: data,
        series: convertSeries(series),
        xAxis: xAxisValue ? variant("some", xAxisValue) : variant("none", null),
        yAxis: yAxisValue ? variant("some", yAxisValue) : variant("none", null),
        curveType: curveValue ? variant("some", curveValue) : variant("none", null),
        showGrid: style?.showGrid !== undefined ? variant("some", style.showGrid) : variant("none", null),
        showTooltip: style?.showTooltip !== undefined ? variant("some", style.showTooltip) : variant("none", null),
        showLegend: style?.showLegend !== undefined ? variant("some", style.showLegend) : variant("none", null),
        showDots: style?.showDots !== undefined ? variant("some", style.showDots) : variant("none", null),
        strokeWidth: style?.strokeWidth !== undefined ? variant("some", style.strokeWidth) : variant("none", null),
        connectNulls: style?.connectNulls !== undefined ? variant("some", style.connectNulls) : variant("none", null),
        width: style?.width !== undefined ? variant("some", style.width) : variant("none", null),
        height: style?.height !== undefined ? variant("some", style.height) : variant("none", null),
    }), UIComponentType);
}
