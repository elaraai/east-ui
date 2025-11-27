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
    TickFormatType,
    type ChartSeries,
} from "../types.js";
import type { ScatterChartStyle } from "./types.js";

// Re-export types
export { ScatterChartType, type ScatterChartStyle } from "./types.js";

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

function convertAxis(axis: ScatterChartStyle["xAxis"]): ExprType<typeof ChartAxisType> | undefined {
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
// Scatter Chart Function
// ============================================================================

/**
 * Creates a Scatter chart component.
 *
 * @param data - Array of data points
 * @param series - Series configuration
 * @param style - Optional styling configuration
 * @returns An East expression representing the scatter chart component
 *
 * @example
 * ```ts
 * import { Chart } from "@elaraai/east-ui";
 *
 * Chart.Scatter(
 *   [{ height: 170, weight: 65 }, { height: 180, weight: 80 }],
 *   [{ name: "data", color: "blue.solid" }],
 *   {
 *     xDataKey: "height",
 *     yDataKey: "weight",
 *     showGrid: true,
 *   }
 * );
 * ```
 */
export function createScatterChart(
    data: SubtypeExprOrValue<ArrayType<DictType<StringType, LiteralValueType>>>,
    series: ChartSeries[],
    style?: ScatterChartStyle
): ExprType<UIComponentType> {

    const xAxisValue = convertAxis(style?.xAxis);
    const yAxisValue = convertAxis(style?.yAxis);

    return East.value(variant("ScatterChart", {
        data: data,
        series: convertSeries(series),
        xAxis: xAxisValue ? variant("some", xAxisValue) : variant("none", null),
        yAxis: yAxisValue ? variant("some", yAxisValue) : variant("none", null),
        xDataKey: style?.xDataKey !== undefined ? variant("some", style.xDataKey) : variant("none", null),
        yDataKey: style?.yDataKey !== undefined ? variant("some", style.yDataKey) : variant("none", null),
        showGrid: style?.showGrid !== undefined ? variant("some", style.showGrid) : variant("none", null),
        showTooltip: style?.showTooltip !== undefined ? variant("some", style.showTooltip) : variant("none", null),
        showLegend: style?.showLegend !== undefined ? variant("some", style.showLegend) : variant("none", null),
        pointSize: style?.pointSize !== undefined ? variant("some", style.pointSize) : variant("none", null),
        width: style?.width !== undefined ? variant("some", style.width) : variant("none", null),
        height: style?.height !== undefined ? variant("some", style.height) : variant("none", null),
    }), UIComponentType);
}
