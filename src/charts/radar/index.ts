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
    type ChartSeries,
} from "../types.js";
import type { RadarChartStyle } from "./types.js";

// Re-export types
export { RadarChartType, type RadarChartStyle } from "./types.js";

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

// ============================================================================
// Radar Chart Function
// ============================================================================

/**
 * Creates a Radar chart component.
 *
 * @param data - Array of data points
 * @param series - Series configuration
 * @param style - Optional styling configuration
 * @returns An East expression representing the radar chart component
 *
 * @example
 * ```ts
 * import { Chart } from "@elaraai/east-ui";
 *
 * Chart.Radar(
 *   [
 *     { subject: "Math", current: 80, target: 90 },
 *     { subject: "Science", current: 95, target: 85 },
 *   ],
 *   [
 *     { name: "current", color: "teal.solid" },
 *     { name: "target", color: "orange.solid" },
 *   ],
 *   { dataKey: "subject", showGrid: true, fillOpacity: 0.3 }
 * );
 * ```
 */
export function createRadarChart(
    data: SubtypeExprOrValue<ArrayType<DictType<StringType, LiteralValueType>>>,
    series: ChartSeries[],
    style?: RadarChartStyle
): ExprType<UIComponentType> {

    return East.value(variant("RadarChart", {
        data: data,
        series: convertSeries(series),
        dataKey: style?.dataKey !== undefined ? variant("some", style.dataKey) : variant("none", null),
        showGrid: style?.showGrid !== undefined ? variant("some", style.showGrid) : variant("none", null),
        showLegend: style?.showLegend !== undefined ? variant("some", style.showLegend) : variant("none", null),
        showTooltip: style?.showTooltip !== undefined ? variant("some", style.showTooltip) : variant("none", null),
        fillOpacity: style?.fillOpacity !== undefined ? variant("some", style.fillOpacity) : variant("none", null),
        width: style?.width !== undefined ? variant("some", style.width) : variant("none", null),
        height: style?.height !== undefined ? variant("some", style.height) : variant("none", null),
    }), UIComponentType);
}
