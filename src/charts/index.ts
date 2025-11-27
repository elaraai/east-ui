/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

/**
 * Charts components for data visualization.
 *
 * @remarks
 * Chart components describe data visualizations that can be rendered
 * using various charting libraries (e.g., Recharts for Cartesian charts,
 * Chakra-native for BarList and BarSegment).
 *
 * All charts are accessed via the `Chart` namespace:
 * - `Chart.Area` - filled area charts
 * - `Chart.Bar` - bar charts (vertical or horizontal)
 * - `Chart.Line` - line charts
 * - `Chart.Scatter` - scatter plots
 * - `Chart.Pie` - pie/donut charts
 * - `Chart.Radar` - radar/spider charts
 * - `Chart.BarList` - horizontal bar comparison (Chakra-native)
 * - `Chart.BarSegment` - proportional segments (Chakra-native)
 * - `Chart.Sparkline` - compact inline trend visualization
 *
 * @packageDocumentation
 */

// Shared types
export {
    ChartSeriesType,
    ChartSortType,
    ChartSortDirectionType,
    ChartAxisType,
    TickFormatType,
    CurveType,
    StackOffsetType,
    BarLayoutType,
    type ChartSeries,
    type ChartSort,
    type ChartAxis,
    type ChartSortDirectionLiteral,
    type TickFormatLiteral,
    type CurveLiteral,
    type StackOffsetLiteral,
    type BarLayoutLiteral,
    type BaseChartStyle,
} from "./types.js";

// Area chart
import { createAreaChart } from "./area/index.js";
export { AreaChartType, type AreaChartStyle } from "./area/index.js";

// Bar chart
import { createBarChart } from "./bar/index.js";
export { BarChartType, type BarChartStyle } from "./bar/index.js";

// Line chart
import { createLineChart } from "./line/index.js";
export { LineChartType, type LineChartStyle } from "./line/index.js";

// Scatter chart
import { createScatterChart } from "./scatter/index.js";
export { ScatterChartType, type ScatterChartStyle } from "./scatter/index.js";

// Pie chart
import { createPieChart } from "./pie/index.js";
export { PieChartType, PieSliceType, type PieChartStyle } from "./pie/index.js";

// Radar chart
import { createRadarChart } from "./radar/index.js";
export { RadarChartType, type RadarChartStyle } from "./radar/index.js";

// Bar list
import { createBarList } from "./bar-list/index.js";
export {
    BarListType,
    BarListItemType,
    BarListValueFormatType,
    type BarListStyle,
} from "./bar-list/index.js";

// Bar segment
import { createBarSegment } from "./bar-segment/index.js";
export {
    BarSegmentType,
    BarSegmentItemType,
    type BarSegmentStyle,
} from "./bar-segment/index.js";

// Sparkline (already implemented)
import { Sparkline } from "./sparkline/index.js";
export {
    SparklineType,
    SparklineChartType,
    type SparklineChartLiteral,
    type SparklineStyle,
} from "./sparkline/index.js";

// Import types for the namespace
import { ChartSeriesType, ChartSortType, ChartSortDirectionType, ChartAxisType, TickFormatType, CurveType, StackOffsetType, BarLayoutType } from "./types.js";
import { AreaChartType } from "./area/index.js";
import { BarChartType } from "./bar/index.js";
import { LineChartType } from "./line/index.js";
import { ScatterChartType } from "./scatter/index.js";
import { PieChartType, PieSliceType } from "./pie/index.js";
import { RadarChartType } from "./radar/index.js";
import { BarListType, BarListItemType, BarListValueFormatType } from "./bar-list/index.js";
import { BarSegmentType, BarSegmentItemType } from "./bar-segment/index.js";
import { SparklineType, SparklineChartType } from "./sparkline/index.js";

// ============================================================================
// Chart Namespace
// ============================================================================

/**
 * Chart namespace providing access to all chart creation functions and types.
 *
 * @remarks
 * All chart components are accessed through this namespace:
 * - Factory functions create chart components (Area, Bar, Line, etc.)
 * - Types object contains all East types for serialization
 *
 * @example
 * ```ts
 * import { Chart } from "@elaraai/east-ui";
 *
 * // Create a line chart
 * const lineChart = Chart.Line(
 *   [{ month: "Jan", revenue: 186 }],
 *   [{ name: "revenue", color: "teal.solid" }],
 *   { xAxis: { dataKey: "month" }, showGrid: true }
 * );
 *
 * // Access types
 * const chartType = Chart.Types.LineChart;
 * ```
 */
export const Chart = {
    /** Create an area chart */
    Area: createAreaChart,
    /** Create a bar chart */
    Bar: createBarChart,
    /** Create a line chart */
    Line: createLineChart,
    /** Create a scatter chart */
    Scatter: createScatterChart,
    /** Create a pie/donut chart */
    Pie: createPieChart,
    /** Create a radar chart */
    Radar: createRadarChart,
    /** Create a bar list (Chakra-native) */
    BarList: createBarList,
    /** Create a bar segment (Chakra-native) */
    BarSegment: createBarSegment,
    /** Create a sparkline */
    Sparkline: Sparkline.Root,

    /** East types for all chart components */
    Types: {
        // Shared types
        Series: ChartSeriesType,
        Sort: ChartSortType,
        SortDirection: ChartSortDirectionType,
        Axis: ChartAxisType,
        TickFormat: TickFormatType,
        Curve: CurveType,
        StackOffset: StackOffsetType,
        BarLayout: BarLayoutType,

        // Chart-specific types
        AreaChart: AreaChartType,
        BarChart: BarChartType,
        LineChart: LineChartType,
        ScatterChart: ScatterChartType,
        PieChart: PieChartType,
        PieSlice: PieSliceType,
        RadarChart: RadarChartType,
        BarList: BarListType,
        BarListItem: BarListItemType,
        BarListValueFormat: BarListValueFormatType,
        BarSegment: BarSegmentType,
        BarSegmentItem: BarSegmentItemType,
        Sparkline: SparklineType,
        SparklineType: SparklineChartType,
    },
} as const;

// Keep Sparkline export for backwards compatibility
export { Sparkline };
