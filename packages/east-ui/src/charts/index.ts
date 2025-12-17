/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
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
    MultiSeriesDataType,
    type ChartSeries,
    type ChartSort,
    type ChartAxis,
    type ChartSortDirectionLiteral,
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
import { ChartSeriesType, ChartSortType, ChartSortDirectionType, ChartAxisType, TickFormatType, CurveType, StackOffsetType, BarLayoutType, MultiSeriesDataType, ChartSeries, ChartSort, StackOffset, BarLayout, ChartGrid, ChartLegend, ChartTooltip, ChartAxis, ChartMargin, NumberTickFormat, CurrencyTickFormat, PercentTickFormat, CompactTickFormat, UnitTickFormat, ScientificTickFormat, EngineeringTickFormat, DateTickFormat, TimeTickFormat, DateTimeTickFormat } from "./types.js";
import { AreaChartType } from "./area/index.js";
import { BarChartType } from "./bar/index.js";
import { LineChartType } from "./line/index.js";
import { ScatterChartType } from "./scatter/index.js";
import { PieChartType, PieSliceType } from "./pie/index.js";
import { RadarChartType } from "./radar/index.js";
import { BarListType, BarListItemType } from "./bar-list/index.js";
import { BarSegmentType, BarSegmentItemType } from "./bar-segment/index.js";

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
    /**
     * Creates an Area chart component.
     *
     * @param data - Array of data points
     * @param series - Series configuration keyed by field names
     * @param style - Optional styling configuration
     * @returns An East expression representing the area chart component
     *
     * @remarks
     * Area charts display quantitative data as filled areas under lines.
     * Supports stacking for showing part-to-whole relationships.
     *
     * @example
     * ```ts
     * import { East } from "@elaraai/east";
     * import { Chart, UIComponentType } from "@elaraai/east-ui";
     *
     * const example = East.function([], UIComponentType, $ => {
     *     return Chart.Area(
     *         [
     *             { month: "Jan", revenue: 186n, profit: 80n },
     *             { month: "Feb", revenue: 305n, profit: 120n },
     *         ],
     *         {
     *             revenue: { color: "teal.solid" },
     *             profit: { color: "purple.solid" },
     *         },
     *         { xAxis: Chart.Axis({ dataKey: "month" }) }
     *     );
     * });
     * ```
     */
    Area: createAreaChart,
    /**
     * Creates a Bar chart component.
     *
     * @param data - Array of data points
     * @param series - Series configuration keyed by field names
     * @param style - Optional styling configuration
     * @returns An East expression representing the bar chart component
     *
     * @remarks
     * Bar charts display categorical data with rectangular bars.
     * Supports vertical and horizontal layouts, stacked and grouped modes.
     *
     * @example
     * ```ts
     * import { East } from "@elaraai/east";
     * import { Chart, UIComponentType } from "@elaraai/east-ui";
     *
     * const example = East.function([], UIComponentType, $ => {
     *     return Chart.Bar(
     *         [
     *             { category: "A", value: 100n },
     *             { category: "B", value: 200n },
     *         ],
     *         { value: { color: "blue.solid" } },
     *         { xAxis: Chart.Axis({ dataKey: "category" }) }
     *     );
     * });
     * ```
     */
    Bar: createBarChart,
    /**
     * Creates a Line chart component.
     *
     * @param data - Array of data points
     * @param series - Series configuration keyed by field names
     * @param style - Optional styling configuration
     * @returns An East expression representing the line chart component
     *
     * @remarks
     * Line charts display data points connected by line segments.
     * Ideal for showing trends over time.
     *
     * @example
     * ```ts
     * import { East } from "@elaraai/east";
     * import { Chart, UIComponentType } from "@elaraai/east-ui";
     *
     * const example = East.function([], UIComponentType, $ => {
     *     return Chart.Line(
     *         [
     *             { month: "Jan", revenue: 186n, profit: 80n },
     *             { month: "Feb", revenue: 305n, profit: 120n },
     *         ],
     *         {
     *             revenue: { color: "teal.solid" },
     *             profit: { color: "purple.solid" },
     *         },
     *         {
     *             xAxis: Chart.Axis({ dataKey: "month" }),
     *             showDots: true,
     *         }
     *     );
     * });
     * ```
     */
    Line: createLineChart,
    /**
     * Creates a Scatter chart component.
     *
     * @param data - Array of data points
     * @param series - Series configuration keyed by field names
     * @param style - Optional styling configuration
     * @returns An East expression representing the scatter chart component
     *
     * @remarks
     * Scatter charts display individual data points on a coordinate plane.
     * Ideal for showing relationships between two variables.
     *
     * @example
     * ```ts
     * import { East } from "@elaraai/east";
     * import { Chart, UIComponentType } from "@elaraai/east-ui";
     *
     * const example = East.function([], UIComponentType, $ => {
     *     return Chart.Scatter(
     *         [
     *             { x: 10n, y: 30n },
     *             { x: 20n, y: 40n },
     *         ],
     *         { y: { color: "purple.solid" } },
     *         { xAxis: Chart.Axis({ dataKey: "x" }) }
     *     );
     * });
     * ```
     */
    Scatter: createScatterChart,
    /**
     * Creates a Pie or Donut chart component.
     *
     * @param data - Array of slice data
     * @param style - Optional styling configuration
     * @returns An East expression representing the pie chart component
     *
     * @remarks
     * Pie charts display proportional data as slices of a circle.
     * Set innerRadius for a donut chart appearance.
     *
     * @example
     * ```ts
     * import { East } from "@elaraai/east";
     * import { Chart, UIComponentType } from "@elaraai/east-ui";
     *
     * const example = East.function([], UIComponentType, $ => {
     *     return Chart.Pie(
     *         [
     *             { name: "Chrome", value: 275n, color: "blue.solid" },
     *             { name: "Safari", value: 200n, color: "green.solid" },
     *         ],
     *         { showLabels: true }
     *     );
     * });
     * ```
     */
    Pie: createPieChart,
    /**
     * Creates a Radar chart component.
     *
     * @param data - Array of data points
     * @param series - Series configuration keyed by field names
     * @param style - Optional styling configuration
     * @returns An East expression representing the radar chart component
     *
     * @remarks
     * Radar charts display multivariate data on radial axes.
     * Useful for comparing multiple attributes across entities.
     *
     * @example
     * ```ts
     * import { East } from "@elaraai/east";
     * import { Chart, UIComponentType } from "@elaraai/east-ui";
     *
     * const example = East.function([], UIComponentType, $ => {
     *     return Chart.Radar(
     *         [
     *             { subject: "Math", A: 120n, B: 110n },
     *             { subject: "English", A: 98n, B: 130n },
     *         ],
     *         {
     *             A: { color: "teal.solid" },
     *             B: { color: "purple.solid" },
     *         },
     *         { dataKey: "subject" }
     *     );
     * });
     * ```
     */
    Radar: createRadarChart,
    /**
     * Creates a BarList component (Chakra-native horizontal bars).
     *
     * @param data - Array of bar items with name, value, and optional color/href
     * @param style - Optional styling configuration
     * @returns An East expression representing the bar list component
     *
     * @remarks
     * BarList displays horizontal comparison bars with labels and values.
     * Native Chakra component, not Recharts-based.
     *
     * @example
     * ```ts
     * import { East } from "@elaraai/east";
     * import { Chart, UIComponentType } from "@elaraai/east-ui";
     *
     * const example = East.function([], UIComponentType, $ => {
     *     return Chart.BarList(
     *         [
     *             { name: "Chrome", value: 275n },
     *             { name: "Safari", value: 200n },
     *         ],
     *         { colorPalette: "blue", showValue: true }
     *     );
     * });
     * ```
     */
    BarList: createBarList,
    /**
     * Creates a BarSegment component (proportional horizontal segments).
     *
     * @param data - Array of segment items with name, value, and optional color
     * @param style - Optional styling configuration
     * @returns An East expression representing the bar segment component
     *
     * @remarks
     * BarSegment displays proportional segments in a single horizontal bar.
     * Native Chakra component for showing percentage breakdowns.
     *
     * @example
     * ```ts
     * import { East } from "@elaraai/east";
     * import { Chart, UIComponentType } from "@elaraai/east-ui";
     *
     * const example = East.function([], UIComponentType, $ => {
     *     return Chart.BarSegment(
     *         [
     *             { name: "Completed", value: 75n, color: "green.solid" },
     *             { name: "Remaining", value: 25n, color: "gray.solid" },
     *         ],
     *         { showLegend: true }
     *     );
     * });
     * ```
     */
    BarSegment: createBarSegment,

    /**
     * Helper function to create chart series configuration.
     *
     * @param config - Series configuration options
     * @returns A series configuration object
     *
     * @remarks
     * Used to define how a data field is rendered as a series in charts.
     */
    Series: ChartSeries,
    /**
     * Helper function to create chart sort configuration.
     *
     * @param config - Sort configuration options
     * @returns A sort configuration object
     *
     * @remarks
     * Used to sort data in BarList and BarSegment charts.
     */
    Sort: ChartSort,
    /**
     * Helper function to create chart grid configuration.
     *
     * @param config - Grid configuration options
     * @returns A grid configuration object
     *
     * @remarks
     * Controls the display of grid lines on Cartesian charts.
     */
    Grid: ChartGrid,
    /**
     * Helper function to create chart margin configuration.
     *
     * @param config - Margin configuration options
     * @returns A margin configuration object
     *
     * @remarks
     * Sets the margin around the chart content area.
     */
    Margin: ChartMargin,

    /**
     * Helper function to create stack offset configuration.
     *
     * @param offset - Stack offset type
     * @returns A stack offset variant
     *
     * @remarks
     * Controls how stacked series are offset (none, expand, wiggle, silhouette).
     */
    StackOffset,
    /**
     * Helper function to create bar layout configuration.
     *
     * @param layout - Bar layout type
     * @returns A bar layout variant
     *
     * @remarks
     * Controls bar orientation (horizontal or vertical).
     */
    BarLayout,

    /**
     * Helper function to create legend configuration.
     *
     * @param config - Legend configuration options
     * @returns A legend configuration object
     *
     * @remarks
     * Controls the display and positioning of the chart legend.
     */
    Legend: ChartLegend,
    /**
     * Helper function to create tooltip configuration.
     *
     * @param config - Tooltip configuration options
     * @returns A tooltip configuration object
     *
     * @remarks
     * Controls the display and behavior of chart tooltips.
     */
    Tooltip: ChartTooltip,
    /**
     * Helper function to create axis configuration.
     *
     * @param config - Axis configuration options
     * @returns An axis configuration object
     *
     * @remarks
     * Configures axis labels, tick formats, and visibility.
     */
    Axis: ChartAxis,

    /**
     * Tick format helpers for axis labels.
     *
     * @remarks
     * Provides type-safe formatters for different number and date formats.
     */
    TickFormat: {
        /** Format as plain number */
        Number: NumberTickFormat,
        /** Format as currency */
        Currency: CurrencyTickFormat,
        /** Format as percentage */
        Percent: PercentTickFormat,
        /** Format as compact number (K, M, B) */
        Compact: CompactTickFormat,
        /** Format with custom unit */
        Unit: UnitTickFormat,
        /** Format in scientific notation */
        Scientific: ScientificTickFormat,
        /** Format in engineering notation */
        Engineering: EngineeringTickFormat,
        /** Format as date */
        Date: DateTickFormat,
        /** Format as time */
        Time: TimeTickFormat,
        /** Format as date and time */
        DateTime: DateTimeTickFormat
    },

    /**
     * East types for all chart components and configuration.
     *
     * @remarks
     * Access these types for serialization or type-checking chart data structures.
     */
    Types: {
        /**
         * The concrete East type for chart series configuration.
         *
         * @remarks
         * Defines how a data field is rendered as a series in multi-series charts.
         * Mirrors Chakra's useChart series config.
         *
         * @property name - Data key name matching keys in data points (StringType)
         * @property color - Chakra color token e.g. "teal.solid" (OptionType<StringType>)
         * @property stackId - Stack group ID for stacking (OptionType<StringType>)
         * @property label - Display label, defaults to name (OptionType<StringType>)
         * @property stroke - Stroke/line color (OptionType<StringType>)
         * @property strokeWidth - Stroke width in pixels (OptionType<IntegerType>)
         * @property fill - Fill color (OptionType<StringType>)
         * @property fillOpacity - Fill opacity 0-1 (OptionType<FloatType>)
         * @property strokeDasharray - Dash pattern e.g. "5 5" (OptionType<StringType>)
         */
        Series: ChartSeriesType,
        /**
         * The concrete East type for chart sort configuration.
         *
         * @remarks
         * Used to sort data in BarList and BarSegment charts.
         *
         * @property by - Data key to sort by (StringType)
         * @property direction - Sort direction asc or desc (ChartSortDirectionType)
         */
        Sort: ChartSortType,
        /**
         * Sort direction variant type.
         *
         * @remarks
         * Controls ascending or descending sort order for charts.
         *
         * @property asc - Ascending order (smallest to largest)
         * @property desc - Descending order (largest to smallest)
         */
        SortDirection: ChartSortDirectionType,
        /**
         * The concrete East type for chart axis configuration.
         *
         * @remarks
         * Configures X and Y axis display on Cartesian charts.
         *
         * @property dataKey - Field name for axis values (OptionType<StringType>)
         * @property label - Axis label text (OptionType<StringType>)
         * @property tickFormat - Format for tick labels (OptionType<TickFormatType>)
         * @property hide - Whether to hide the axis (OptionType<BooleanType>)
         * @property domain - Axis domain min/max (OptionType<ArrayType<FloatType>>)
         * @property tickLine - Show tick lines (OptionType<BooleanType>)
         * @property axisLine - Show axis line (OptionType<BooleanType>)
         */
        Axis: ChartAxisType,
        /**
         * Tick format variant type for axis labels.
         *
         * @remarks
         * Provides type-safe number and date formatting options for axis ticks.
         *
         * @property Number - Plain number format with decimal places
         * @property Currency - Currency format with symbol and locale
         * @property Percent - Percentage format
         * @property Compact - Compact notation (K, M, B)
         * @property Unit - Custom unit suffix
         * @property Scientific - Scientific notation
         * @property Engineering - Engineering notation
         * @property Date - Date format
         * @property Time - Time format
         * @property DateTime - Date and time format
         */
        TickFormat: TickFormatType,
        /**
         * Curve type variant for line interpolation.
         *
         * @remarks
         * Controls how line segments are interpolated between data points.
         *
         * @property linear - Straight line segments
         * @property natural - Natural cubic spline (smooth)
         * @property monotone - Monotone cubic interpolation (no overshoot)
         * @property step - Step function (horizontal then vertical)
         * @property stepBefore - Step before the point
         * @property stepAfter - Step after the point
         */
        Curve: CurveType,
        /**
         * Stack offset variant type.
         *
         * @remarks
         * Controls how stacked series are offset relative to each other.
         *
         * @property none - No offset, standard stacking from zero
         * @property expand - Normalize to percentage (0-100%)
         * @property wiggle - Minimize deviation from center
         * @property silhouette - Center the baseline
         */
        StackOffset: StackOffsetType,
        /**
         * Bar layout variant type.
         *
         * @remarks
         * Controls the orientation of bars in bar charts.
         *
         * @property horizontal - Bars extend horizontally (category on Y axis)
         * @property vertical - Bars extend vertically (category on X axis)
         */
        BarLayout: BarLayoutType,
        /**
         * Multi-series data type for sparse/separate series arrays.
         *
         * @remarks
         * Used when data is passed as a record of arrays instead of a single array.
         * Each key is a series name, value is an array of data points.
         * This avoids the need for null values when series have different data points.
         */
        MultiSeriesData: MultiSeriesDataType,

        /**
         * The concrete East type for Area chart data.
         *
         * @remarks
         * Area charts display quantitative data with filled areas under line curves.
         * Supports stacking for showing part-to-whole relationships.
         *
         * @property data - Array of data points as Dict<String, LiteralValue>
         * @property series - Array of series configuration (ArrayType<ChartSeriesType>)
         * @property xAxis - X-axis configuration (OptionType<ChartAxisType>)
         * @property yAxis - Y-axis configuration (OptionType<ChartAxisType>)
         * @property curveType - Line curve interpolation (OptionType<CurveType>)
         * @property stacked - Enable stacking (OptionType<BooleanType>)
         * @property stackOffset - Stack offset mode (OptionType<StackOffsetType>)
         * @property grid - Grid configuration (OptionType<ChartGridType>)
         * @property tooltip - Tooltip configuration (OptionType<ChartTooltipType>)
         * @property legend - Legend configuration (OptionType<ChartLegendType>)
         * @property margin - Chart margin (OptionType<ChartMarginType>)
         * @property fillOpacity - Fill opacity 0-1 (OptionType<FloatType>)
         * @property connectNulls - Connect across nulls (OptionType<BooleanType>)
         */
        AreaChart: AreaChartType,
        /**
         * The concrete East type for Bar chart data.
         *
         * @remarks
         * Bar charts display categorical data with rectangular bars.
         * Supports horizontal/vertical layouts and stacking.
         *
         * @property data - Array of data points as Dict<String, LiteralValue>
         * @property series - Array of series configuration (ArrayType<ChartSeriesType>)
         * @property xAxis - X-axis configuration (OptionType<ChartAxisType>)
         * @property yAxis - Y-axis configuration (OptionType<ChartAxisType>)
         * @property layout - Bar direction (OptionType<BarLayoutType>)
         * @property stacked - Enable stacking (OptionType<BooleanType>)
         * @property stackOffset - Stack offset mode (OptionType<StackOffsetType>)
         * @property grid - Grid configuration (OptionType<ChartGridType>)
         * @property tooltip - Tooltip configuration (OptionType<ChartTooltipType>)
         * @property legend - Legend configuration (OptionType<ChartLegendType>)
         * @property margin - Chart margin (OptionType<ChartMarginType>)
         * @property barSize - Bar width/height in pixels (OptionType<IntegerType>)
         * @property barGap - Gap between bars (OptionType<IntegerType>)
         * @property radius - Rounded corner radius (OptionType<IntegerType>)
         */
        BarChart: BarChartType,
        /**
         * The concrete East type for Line chart data.
         *
         * @remarks
         * Line charts display data points connected by line segments.
         * Ideal for showing trends over time.
         *
         * @property data - Array of data points as Dict<String, LiteralValue>
         * @property series - Array of series configuration (ArrayType<ChartSeriesType>)
         * @property xAxis - X-axis configuration (OptionType<ChartAxisType>)
         * @property yAxis - Y-axis configuration (OptionType<ChartAxisType>)
         * @property curveType - Line curve interpolation (OptionType<CurveType>)
         * @property grid - Grid configuration (OptionType<ChartGridType>)
         * @property tooltip - Tooltip configuration (OptionType<ChartTooltipType>)
         * @property legend - Legend configuration (OptionType<ChartLegendType>)
         * @property margin - Chart margin (OptionType<ChartMarginType>)
         * @property showDots - Show dots at data points (OptionType<BooleanType>)
         * @property strokeWidth - Line stroke width (OptionType<IntegerType>)
         * @property connectNulls - Connect across nulls (OptionType<BooleanType>)
         */
        LineChart: LineChartType,
        /**
         * The concrete East type for Scatter chart data.
         *
         * @remarks
         * Scatter charts display individual data points on a coordinate plane.
         * Ideal for showing relationships between two variables.
         *
         * @property data - Array of data points as Dict<String, LiteralValue>
         * @property series - Array of series configuration (ArrayType<ChartSeriesType>)
         * @property xAxis - X-axis configuration (OptionType<ChartAxisType>)
         * @property yAxis - Y-axis configuration (OptionType<ChartAxisType>)
         * @property grid - Grid configuration (OptionType<ChartGridType>)
         * @property tooltip - Tooltip configuration (OptionType<ChartTooltipType>)
         * @property legend - Legend configuration (OptionType<ChartLegendType>)
         * @property margin - Chart margin (OptionType<ChartMarginType>)
         */
        ScatterChart: ScatterChartType,
        /**
         * The concrete East type for Pie chart data.
         *
         * @remarks
         * Pie charts display proportional data as slices of a circle.
         * Set innerRadius for a donut chart appearance.
         *
         * @property data - Array of pie slices (ArrayType<PieSliceType>)
         * @property innerRadius - Inner radius for donut chart (OptionType<IntegerType>)
         * @property outerRadius - Outer radius (OptionType<IntegerType>)
         * @property startAngle - Starting angle in degrees (OptionType<IntegerType>)
         * @property endAngle - Ending angle in degrees (OptionType<IntegerType>)
         * @property showLabels - Show slice labels (OptionType<BooleanType>)
         * @property tooltip - Tooltip configuration (OptionType<ChartTooltipType>)
         * @property legend - Legend configuration (OptionType<ChartLegendType>)
         */
        PieChart: PieChartType,
        /**
         * The concrete East type for Pie chart slice data.
         *
         * @remarks
         * Each slice represents a segment of the pie chart.
         *
         * @property name - Slice label (StringType)
         * @property value - Slice value (IntegerType or FloatType)
         * @property color - Slice color (OptionType<StringType>)
         */
        PieSlice: PieSliceType,
        /**
         * The concrete East type for Radar chart data.
         *
         * @remarks
         * Radar charts display multivariate data on radial axes.
         * Useful for comparing multiple attributes across entities.
         *
         * @property data - Array of data points as Dict<String, LiteralValue>
         * @property series - Array of series configuration (ArrayType<ChartSeriesType>)
         * @property dataKey - Field name for radial axis labels (StringType)
         * @property grid - Grid configuration (OptionType<ChartGridType>)
         * @property tooltip - Tooltip configuration (OptionType<ChartTooltipType>)
         * @property legend - Legend configuration (OptionType<ChartLegendType>)
         */
        RadarChart: RadarChartType,
        /**
         * The concrete East type for BarList data.
         *
         * @remarks
         * BarList displays horizontal comparison bars with labels and values.
         * Native Chakra component, not Recharts-based.
         *
         * @property data - Array of bar items (ArrayType<BarListItemType>)
         * @property colorPalette - Default color scheme (OptionType<ColorSchemeType>)
         * @property showValue - Show values next to bars (OptionType<BooleanType>)
         * @property sort - Sort configuration (OptionType<ChartSortType>)
         */
        BarList: BarListType,
        /**
         * The concrete East type for BarList item data.
         *
         * @remarks
         * Each item represents a bar in the BarList chart.
         *
         * @property name - Item label (StringType)
         * @property value - Item value (IntegerType or FloatType)
         * @property color - Item color (OptionType<StringType>)
         * @property href - Optional link URL (OptionType<StringType>)
         */
        BarListItem: BarListItemType,
        /**
         * The concrete East type for BarSegment data.
         *
         * @remarks
         * BarSegment displays proportional segments in a single horizontal bar.
         * Native Chakra component for showing percentage breakdowns.
         *
         * @property data - Array of segment items (ArrayType<BarSegmentItemType>)
         * @property showLegend - Show legend (OptionType<BooleanType>)
         * @property showValue - Show values on segments (OptionType<BooleanType>)
         */
        BarSegment: BarSegmentType,
        /**
         * The concrete East type for BarSegment item data.
         *
         * @remarks
         * Each item represents a segment in the BarSegment chart.
         *
         * @property name - Segment label (StringType)
         * @property value - Segment value (IntegerType or FloatType)
         * @property color - Segment color (OptionType<StringType>)
         */
        BarSegmentItem: BarSegmentItemType,
    },
} as const;

// Keep Sparkline export for backwards compatibility
export { Sparkline };
