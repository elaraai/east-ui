### 24. [ ] Charts (`src/charts/`)

**Source:** `@chakra-ui/charts` - built on Recharts

**Reference:** See `CHAKRA_CHARTS_REFERENCE.md` for comprehensive Chakra UI v3 charts examples and API details.

Charts in East UI describe data visualizations that can be rendered using Recharts. East UI defines the data structure and configuration that a renderer would use to create the actual Chakra/Recharts composition.

**Chart Types (all under `Chart.*` namespace):**
- `Chart.Area` - filled area showing trends over time
- `Chart.Bar` - categorical data with rectangular bars
- `Chart.Line` - data points connected by line segments
- `Chart.Scatter` - data points on 2D coordinate plane
- `Chart.Pie` - proportional segments of a circle (set innerRadius > 0 for donut)
- `Chart.Radar` - multivariate data on radial axes
- `Chart.BarList` - horizontal bars for category comparison (Chakra-native)
- `Chart.BarSegment` - proportional segments in a single bar (Chakra-native)
- `Chart.Sparkline` - compact inline trend visualization

**File Structure:**
```
src/charts/
  index.ts              # Main exports, Chart namespace
  types.ts              # Shared types (ChartSeriesType, ChartAxisType, etc.)
  area/
    index.ts            # Chart.Area implementation
    types.ts            # AreaChartType, AreaChartStyle
  bar/
    index.ts            # Chart.Bar implementation
    types.ts            # BarChartType, BarChartStyle
  line/
    index.ts            # Chart.Line implementation
    types.ts            # LineChartType, LineChartStyle
  scatter/
    index.ts            # Chart.Scatter implementation
    types.ts            # ScatterChartType, ScatterChartStyle
  pie/
    index.ts            # Chart.Pie implementation
    types.ts            # PieChartType, PieSliceType, PieChartStyle
  radar/
    index.ts            # Chart.Radar implementation
    types.ts            # RadarChartType, RadarChartStyle
  bar-list/
    index.ts            # Chart.BarList implementation
    types.ts            # BarListType, BarListItemType
  bar-segment/
    index.ts            # Chart.BarSegment implementation
    types.ts            # BarSegmentType, BarSegmentItemType
  sparkline/
    index.ts            # Chart.Sparkline implementation (already done)
    types.ts            # SparklineType, SparklineStyle
```

**East UI Types:**
```typescript
// =============================================================================
// Shared Chart Types (src/charts/types.ts)
// =============================================================================

/**
 * Series configuration for multi-series charts.
 * Mirrors Chakra's useChart series config.
 *
 * @property name - Data key name (matches keys in data points)
 * @property color - Chakra color token (e.g., "teal.solid", "blue.500")
 * @property stackId - Stack group ID (same stackId = stacked together)
 * @property label - Display label (defaults to name)
 */
export const ChartSeriesType = StructType({
  name: StringType,
  color: OptionType(StringType),
  stackId: OptionType(StringType),
  label: OptionType(StringType),
});

/**
 * Sort configuration for BarList and BarSegment.
 *
 * @property by - Data key to sort by
 * @property direction - Sort direction
 */
export const ChartSortDirectionType = VariantType({
  asc: NullType,
  desc: NullType,
});
export type ChartSortDirectionLiteral = "asc" | "desc";

export const ChartSortType = StructType({
  by: StringType,
  direction: ChartSortDirectionType,
});

/**
 * Tick format for axis values.
 * Maps to Intl.NumberFormat style options.
 */
export const TickFormatType = VariantType({
  number: NullType,      // plain number (default)
  currency: NullType,    // $1,234.56
  percent: NullType,     // 12.3%
  compact: NullType,     // 1.2K, 3.4M
  date: NullType,        // formatted date
  time: NullType,        // formatted time
  datetime: NullType,    // date and time
});
export type TickFormatLiteral = "number" | "currency" | "percent" | "compact" | "date" | "time" | "datetime";

/**
 * Line/Area curve type.
 * Maps to Recharts curve types.
 */
export const CurveType = VariantType({
  linear: NullType,      // straight lines
  natural: NullType,     // natural cubic spline
  monotone: NullType,    // monotone cubic spline
  step: NullType,        // step function
  stepBefore: NullType,
  stepAfter: NullType,
});
export type CurveLiteral = "linear" | "natural" | "monotone" | "step" | "stepBefore" | "stepAfter";

/**
 * Stack offset mode for stacked charts.
 */
export const StackOffsetType = VariantType({
  none: NullType,        // regular stacking
  expand: NullType,      // normalize to 100%
  wiggle: NullType,      // streamgraph
  silhouette: NullType,  // centered streamgraph
});
export type StackOffsetLiteral = "none" | "expand" | "wiggle" | "silhouette";

/**
 * Bar chart layout direction.
 */
export const BarLayoutType = VariantType({
  horizontal: NullType,  // vertical bars (default)
  vertical: NullType,    // horizontal bars
});
export type BarLayoutLiteral = "horizontal" | "vertical";

/**
 * Axis configuration.
 *
 * @property dataKey - Data key for axis values
 * @property label - Axis label text
 * @property tickFormat - Format for tick values
 * @property domain - Value range [min, max]
 * @property hide - Hide the axis
 */
export const ChartAxisType = StructType({
  dataKey: OptionType(StringType),
  label: OptionType(StringType),
  tickFormat: OptionType(TickFormatType),
  domain: OptionType(ArrayType(FloatType)),  // [min, max]
  hide: OptionType(BooleanType),
});

export interface ChartAxis {
  dataKey?: SubtypeExprOrValue<StringType>;
  label?: SubtypeExprOrValue<StringType>;
  tickFormat?: SubtypeExprOrValue<TickFormatType> | TickFormatLiteral;
  domain?: SubtypeExprOrValue<ArrayType<FloatType>>;
  hide?: SubtypeExprOrValue<BooleanType>;
}

// =============================================================================
// Area Chart (src/charts/area/types.ts)
// =============================================================================

export const AreaChartType = StructType({
  data: ArrayType(DictType(StringType, AnyValueType)),  // flexible data shape
  series: ArrayType(ChartSeriesType),
  xAxis: OptionType(ChartAxisType),
  yAxis: OptionType(ChartAxisType),
  curveType: OptionType(CurveType),
  stacked: OptionType(BooleanType),
  stackOffset: OptionType(StackOffsetType),
  showGrid: OptionType(BooleanType),
  showTooltip: OptionType(BooleanType),
  showLegend: OptionType(BooleanType),
  fillOpacity: OptionType(FloatType),
  connectNulls: OptionType(BooleanType),
  width: OptionType(IntegerType),
  height: OptionType(IntegerType),
});

export interface AreaChartStyle {
  xAxis?: ChartAxis;
  yAxis?: ChartAxis;
  curveType?: SubtypeExprOrValue<CurveType> | CurveLiteral;
  stacked?: SubtypeExprOrValue<BooleanType>;
  stackOffset?: SubtypeExprOrValue<StackOffsetType> | StackOffsetLiteral;
  showGrid?: SubtypeExprOrValue<BooleanType>;
  showTooltip?: SubtypeExprOrValue<BooleanType>;
  showLegend?: SubtypeExprOrValue<BooleanType>;
  fillOpacity?: SubtypeExprOrValue<FloatType>;
  connectNulls?: SubtypeExprOrValue<BooleanType>;
  width?: SubtypeExprOrValue<IntegerType>;
  height?: SubtypeExprOrValue<IntegerType>;
}

// =============================================================================
// Bar Chart (src/charts/bar/types.ts)
// =============================================================================

export const BarChartType = StructType({
  data: ArrayType(DictType(StringType, AnyValueType)),
  series: ArrayType(ChartSeriesType),
  xAxis: OptionType(ChartAxisType),
  yAxis: OptionType(ChartAxisType),
  layout: OptionType(BarLayoutType),  // horizontal (vertical bars) or vertical (horizontal bars)
  stacked: OptionType(BooleanType),
  stackOffset: OptionType(StackOffsetType),
  showGrid: OptionType(BooleanType),
  showTooltip: OptionType(BooleanType),
  showLegend: OptionType(BooleanType),
  barSize: OptionType(IntegerType),
  barGap: OptionType(IntegerType),
  radius: OptionType(IntegerType),  // rounded corners
  width: OptionType(IntegerType),
  height: OptionType(IntegerType),
});

export interface BarChartStyle {
  xAxis?: ChartAxis;
  yAxis?: ChartAxis;
  layout?: SubtypeExprOrValue<BarLayoutType> | BarLayoutLiteral;
  stacked?: SubtypeExprOrValue<BooleanType>;
  stackOffset?: SubtypeExprOrValue<StackOffsetType> | StackOffsetLiteral;
  showGrid?: SubtypeExprOrValue<BooleanType>;
  showTooltip?: SubtypeExprOrValue<BooleanType>;
  showLegend?: SubtypeExprOrValue<BooleanType>;
  barSize?: SubtypeExprOrValue<IntegerType>;
  barGap?: SubtypeExprOrValue<IntegerType>;
  radius?: SubtypeExprOrValue<IntegerType>;
  width?: SubtypeExprOrValue<IntegerType>;
  height?: SubtypeExprOrValue<IntegerType>;
}

// =============================================================================
// Line Chart (src/charts/line/types.ts)
// =============================================================================

export const LineChartType = StructType({
  data: ArrayType(DictType(StringType, AnyValueType)),
  series: ArrayType(ChartSeriesType),
  xAxis: OptionType(ChartAxisType),
  yAxis: OptionType(ChartAxisType),
  curveType: OptionType(CurveType),
  showGrid: OptionType(BooleanType),
  showTooltip: OptionType(BooleanType),
  showLegend: OptionType(BooleanType),
  showDots: OptionType(BooleanType),
  strokeWidth: OptionType(IntegerType),
  connectNulls: OptionType(BooleanType),
  width: OptionType(IntegerType),
  height: OptionType(IntegerType),
});

export interface LineChartStyle {
  xAxis?: ChartAxis;
  yAxis?: ChartAxis;
  curveType?: SubtypeExprOrValue<CurveType> | CurveLiteral;
  showGrid?: SubtypeExprOrValue<BooleanType>;
  showTooltip?: SubtypeExprOrValue<BooleanType>;
  showLegend?: SubtypeExprOrValue<BooleanType>;
  showDots?: SubtypeExprOrValue<BooleanType>;
  strokeWidth?: SubtypeExprOrValue<IntegerType>;
  connectNulls?: SubtypeExprOrValue<BooleanType>;
  width?: SubtypeExprOrValue<IntegerType>;
  height?: SubtypeExprOrValue<IntegerType>;
}

// =============================================================================
// Scatter Chart (src/charts/scatter/types.ts)
// =============================================================================

export const ScatterChartType = StructType({
  data: ArrayType(DictType(StringType, AnyValueType)),
  series: ArrayType(ChartSeriesType),
  xAxis: OptionType(ChartAxisType),
  yAxis: OptionType(ChartAxisType),
  showGrid: OptionType(BooleanType),
  showTooltip: OptionType(BooleanType),
  showLegend: OptionType(BooleanType),
  width: OptionType(IntegerType),
  height: OptionType(IntegerType),
});

export interface ScatterChartStyle {
  xAxis?: ChartAxis;
  yAxis?: ChartAxis;
  showGrid?: SubtypeExprOrValue<BooleanType>;
  showTooltip?: SubtypeExprOrValue<BooleanType>;
  showLegend?: SubtypeExprOrValue<BooleanType>;
  width?: SubtypeExprOrValue<IntegerType>;
  height?: SubtypeExprOrValue<IntegerType>;
}

// =============================================================================
// Pie Chart (src/charts/pie/types.ts)
// =============================================================================

/**
 * Pie slice data (color is in data, not series).
 */
export const PieSliceType = StructType({
  name: StringType,
  value: FloatType,
  color: OptionType(StringType),
});

export const PieChartType = StructType({
  data: ArrayType(PieSliceType),
  innerRadius: OptionType(FloatType),  // 0 = pie, >0 = donut
  outerRadius: OptionType(FloatType),
  startAngle: OptionType(FloatType),
  endAngle: OptionType(FloatType),
  paddingAngle: OptionType(FloatType),
  showLabels: OptionType(BooleanType),
  showLegend: OptionType(BooleanType),
  showTooltip: OptionType(BooleanType),
  width: OptionType(IntegerType),
  height: OptionType(IntegerType),
});

export interface PieChartStyle {
  innerRadius?: SubtypeExprOrValue<FloatType>;
  outerRadius?: SubtypeExprOrValue<FloatType>;
  startAngle?: SubtypeExprOrValue<FloatType>;
  endAngle?: SubtypeExprOrValue<FloatType>;
  paddingAngle?: SubtypeExprOrValue<FloatType>;
  showLabels?: SubtypeExprOrValue<BooleanType>;
  showLegend?: SubtypeExprOrValue<BooleanType>;
  showTooltip?: SubtypeExprOrValue<BooleanType>;
  width?: SubtypeExprOrValue<IntegerType>;
  height?: SubtypeExprOrValue<IntegerType>;
}

// =============================================================================
// Radar Chart (src/charts/radar/types.ts)
// =============================================================================

export const RadarChartType = StructType({
  data: ArrayType(DictType(StringType, AnyValueType)),
  series: ArrayType(ChartSeriesType),
  showGrid: OptionType(BooleanType),
  showLegend: OptionType(BooleanType),
  showTooltip: OptionType(BooleanType),
  fillOpacity: OptionType(FloatType),
  width: OptionType(IntegerType),
  height: OptionType(IntegerType),
});

export interface RadarChartStyle {
  showGrid?: SubtypeExprOrValue<BooleanType>;
  showLegend?: SubtypeExprOrValue<BooleanType>;
  showTooltip?: SubtypeExprOrValue<BooleanType>;
  fillOpacity?: SubtypeExprOrValue<FloatType>;
  width?: SubtypeExprOrValue<IntegerType>;
  height?: SubtypeExprOrValue<IntegerType>;
}

// =============================================================================
// Bar List (src/charts/bar-list/types.ts) - Chakra native
// =============================================================================

export const BarListItemType = StructType({
  name: StringType,
  value: FloatType,
  color: OptionType(StringType),
});

export const BarListValueFormatType = VariantType({
  number: NullType,
  currency: NullType,
  percent: NullType,
  compact: NullType,
});
export type BarListValueFormatLiteral = "number" | "currency" | "percent" | "compact";

export const BarListType = StructType({
  data: ArrayType(BarListItemType),
  sort: OptionType(ChartSortType),
  showValue: OptionType(BooleanType),
  showLabel: OptionType(BooleanType),
  valueFormat: OptionType(BarListValueFormatType),
  color: OptionType(StringType),  // default bar color
});

export interface BarListStyle {
  sort?: { by: string; direction: SubtypeExprOrValue<ChartSortDirectionType> | ChartSortDirectionLiteral };
  showValue?: SubtypeExprOrValue<BooleanType>;
  showLabel?: SubtypeExprOrValue<BooleanType>;
  valueFormat?: SubtypeExprOrValue<BarListValueFormatType> | BarListValueFormatLiteral;
  color?: SubtypeExprOrValue<StringType>;
}

// =============================================================================
// Bar Segment (src/charts/bar-segment/types.ts) - Chakra native
// =============================================================================

export const BarSegmentItemType = StructType({
  name: StringType,
  value: FloatType,
  color: StringType,  // required for segments
});

export const BarSegmentType = StructType({
  data: ArrayType(BarSegmentItemType),
  sort: OptionType(ChartSortType),
  showValue: OptionType(BooleanType),
  showLabel: OptionType(BooleanType),
});

export interface BarSegmentStyle {
  sort?: { by: string; direction: SubtypeExprOrValue<ChartSortDirectionType> | ChartSortDirectionLiteral };
  showValue?: SubtypeExprOrValue<BooleanType>;
  showLabel?: SubtypeExprOrValue<BooleanType>;
}

// =============================================================================
// Sparkline (src/charts/sparkline/types.ts) - Already implemented
// =============================================================================

export const SparklineTypeVariant = VariantType({
  line: NullType,
  area: NullType,
  bar: NullType,
});
export type SparklineTypeLiteral = "line" | "area" | "bar";

export const SparklineType = StructType({
  data: ArrayType(FloatType),
  type: OptionType(SparklineTypeVariant),
  color: OptionType(StringType),
  width: OptionType(IntegerType),
  height: OptionType(IntegerType),
  showReference: OptionType(BooleanType),
  referenceValue: OptionType(FloatType),
});

// =============================================================================
// Chart Namespace Export
// =============================================================================

export const Chart = {
  Area: createAreaChart,
  Bar: createBarChart,
  Line: createLineChart,
  Scatter: createScatterChart,
  Pie: createPieChart,
  Radar: createRadarChart,
  BarList: createBarList,
  BarSegment: createBarSegment,
  Sparkline: createSparkline,
  Types: {
    // Shared
    Series: ChartSeriesType,
    Sort: ChartSortType,
    SortDirection: ChartSortDirectionType,
    Axis: ChartAxisType,
    TickFormat: TickFormatType,
    Curve: CurveType,
    StackOffset: StackOffsetType,
    BarLayout: BarLayoutType,
    // Chart-specific
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
    SparklineType: SparklineTypeVariant,
  },
} as const;
```

**Usage Examples:**

```typescript
import { Chart } from "@elaraai/east-ui";

// Line chart with multiple series
const lineChart = Chart.Line(
  [
    { month: "January", revenue: 186, profit: 80 },
    { month: "February", revenue: 165, profit: 95 },
    { month: "March", revenue: 190, profit: 87 },
  ],
  [
    { name: "revenue", color: "teal.solid" },
    { name: "profit", color: "purple.solid" },
  ],
  {
    xAxis: { dataKey: "month" },
    yAxis: { tickFormat: "currency" },
    showGrid: true,
    showTooltip: true,
    showLegend: true,
    curveType: "natural",
  }
);

// Stacked area chart (100% normalized)
const areaChart = Chart.Area(
  osUsageData,
  [
    { name: "windows", color: "teal.solid" },
    { name: "mac", color: "purple.solid" },
    { name: "linux", color: "blue.solid" },
  ],
  {
    xAxis: { dataKey: "month" },
    yAxis: { tickFormat: "percent" },
    stacked: true,
    stackOffset: "expand",  // 100% stacked
    showLegend: true,
  }
);

// Horizontal bar chart
const barChart = Chart.Bar(
  categoryData,
  [{ name: "value", color: "blue.solid" }],
  {
    layout: "vertical",  // horizontal bars
    xAxis: { tickFormat: "compact" },
    showGrid: true,
  }
);

// Pie chart (donut style)
const donutChart = Chart.Pie(
  [
    { name: "Desktop", value: 400, color: "blue.solid" },
    { name: "Mobile", value: 300, color: "orange.solid" },
    { name: "Tablet", value: 200, color: "pink.solid" },
  ],
  {
    innerRadius: 60,  // > 0 makes it a donut
    outerRadius: 80,
    showLegend: true,
    showTooltip: true,
  }
);

// Radar chart
const radarChart = Chart.Radar(
  skillData,
  [
    { name: "current", color: "teal.solid" },
    { name: "target", color: "orange.solid" },
  ],
  {
    showGrid: true,
    showLegend: true,
    fillOpacity: 0.3,
  }
);

// Bar list with sorting
const barList = Chart.BarList(
  [
    { name: "Google", value: 1200000 },
    { name: "ChatGPT", value: 1345000 },
    { name: "Bing", value: 200000 },
  ],
  {
    sort: { by: "value", direction: "desc" },
    showValue: true,
    valueFormat: "compact",
    color: "teal.subtle",
  }
);

// Bar segment
const barSegment = Chart.BarSegment(
  [
    { name: "Google", value: 500000, color: "teal.solid" },
    { name: "Direct", value: 100000, color: "blue.solid" },
    { name: "Bing", value: 200000, color: "orange.solid" },
  ],
  {
    sort: { by: "value", direction: "desc" },
    showValue: true,
    showLabel: true,
  }
);

// Sparkline
const sparkline = Chart.Sparkline(
  [10, 16, 19, 15, 12, 15, 10, 18],
  {
    type: "area",
    color: "teal.solid",
    width: 120n,
    height: 40n,
  }
);
```

---

