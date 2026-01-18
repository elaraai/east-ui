# Design: Centralized Chart Data Preparation with Improved Default Colors

## Overview

This document describes a refactoring of cartesian chart (Line, Area, Bar, Composed) data preparation to:

1. **Centralize all logic in `prepareChartData`** - data transformation, series generation, color assignment, and chart-type-specific enhancement
2. **Improve default colors** - automatic, visually distinct colors for series and pivot values
3. **Fix pivot mode bugs** - ensure chart-type-specific properties (strokeWidth, showDots, etc.) are correctly applied to pivot-generated series

### Design Goals

After this refactoring, chart components become simple renderers:

```typescript
// Any chart type - just call prepareChartData and render
const { data, series } = prepareChartData({ ...config, enhancer: chartTypeEnhancer });
const chart = useChart({ data, series });
// Render elements directly from series - no post-processing needed
```

No more:
- Custom post-processing per chart type
- `if (pivotKey) { ... } else { ... }` branching
- Duplicate color fallback logic
- Series lookup bugs in pivot mode

---

## Current Problems

### 1. All Series Default to Same Color

- All series without explicit color default to `"teal.solid"`
- Pivot values without `pivotColors` also default to `"teal.solid"`
- Results in indistinguishable series

### 2. Fragmented Post-Processing

Each chart type has custom logic after `prepareChartData`:

```typescript
// Line chart (line/index.tsx:82-103)
const series = useMemo((): LineSeriesItem[] => {
    return baseSeries.map(s => {
        const eastConfig = value.series.find(es => es.name === s.name);  // BUG: fails in pivot mode
        if (!eastConfig) return s as LineSeriesItem;
        // ... enhance with strokeWidth, showDots, etc.
    });
}, [baseSeries, value.series]);

// Composed chart (composed/index.tsx:241-256)
const chartSeries = useMemo((): ChartSeriesItem[] => {
    if (getSomeorUndefined(value.pivotKey)) {
        return baseSeries;  // Loses chart-type info!
    }
    return composedSeries.map(s => ({ ... }));
}, [baseSeries, composedSeries, value.pivotKey]);
```

### 3. Pivot Mode Bug

In pivot mode, series names are pivot values ("North", "South") not original series names ("revenue"). The lookup `value.series.find(es => es.name === s.name)` fails, so chart-type-specific properties like `strokeWidth`, `showDots` are never applied.

---

## Solution: Enhanced `prepareChartData`

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      prepareChartData                            │
├─────────────────────────────────────────────────────────────────┤
│  Inputs:                                                         │
│  - rawData, dataSeries, xAxisKey, valueKey, pivotKey            │
│  - eastSeries (chart-type-specific config)                      │
│  - enhancer (optional function to add chart-specific props)     │
├─────────────────────────────────────────────────────────────────┤
│  Processing:                                                     │
│  1. Transform data (pivot, multi-series, or regular mode)       │
│  2. Generate series with names and colors                       │
│  3. Build seriesOriginMap (pivot name → original name)          │
│  4. Apply enhancer using seriesOriginMap for correct lookup     │
├─────────────────────────────────────────────────────────────────┤
│  Outputs:                                                        │
│  - data: Record<string, unknown>[]                              │
│  - series: TEnhanced[] (fully enhanced, ready to render)        │
│  - seriesOriginMap: Map<string, string>                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Chart Component                              │
├─────────────────────────────────────────────────────────────────┤
│  const { data, series } = prepareChartData(config);             │
│  const chart = useChart({ data, series });                      │
│  return <Chart>{ series.map(s => <Element {...s} />) }</Chart>; │
└─────────────────────────────────────────────────────────────────┘
```

---

## Color System

### Color Palettes

```typescript
/**
 * Default color palette for series without explicit colors.
 * Colors chosen for visual distinction and aesthetic harmony.
 */
export const SERIES_COLOR_PALETTE = [
    "blue",
    "purple",
    "teal",
    "orange",
    "pink",
    "cyan",
    "green",
    "red",
    "yellow",
    "indigo",
] as const;

/**
 * Shade palette for pivot values.
 * Order maximizes visual distinction between adjacent values.
 */
export const PIVOT_SHADE_PALETTE = [
    "500",   // Medium (solid equivalent)
    "700",   // Dark
    "300",   // Light
    "800",   // Very Dark
    "400",   // Medium-Light
    "600",   // Medium-Dark
    "200",   // Very Light
] as const;
```

### Color Resolution Priority

#### Non-Pivot Mode

```
Series has explicit color?
├── YES → Use explicit color
└── NO  → Use SERIES_COLOR_PALETTE[seriesIndex % 10].solid
```

#### Pivot Mode (per pivot value)

| Priority | Condition | Result |
|----------|-----------|--------|
| 1 | `pivotColors.has(pivotValue)` | `pivotColors.get(pivotValue)` |
| 2 | Series `color` defined (no pivotColors entry) | Series color (same for all) |
| 3 | Neither defined | `SERIES_COLOR_PALETTE[seriesIndex].PIVOT_SHADE_PALETTE[pivotIndex]` |

### Color Examples

#### Multi-Series Without Explicit Colors

```typescript
series: [{ name: "revenue" }, { name: "costs" }, { name: "profit" }]

// Output:
// revenue → blue.solid   (index 0)
// costs   → purple.solid (index 1)
// profit  → teal.solid   (index 2)
```

#### Pivot Without Colors (Auto Shades)

```typescript
config: { pivotKey: "region", valueKey: "sales", series: [{ name: "sales" }] }
data regions: ["North", "South", "East", "West"]

// Output (series index 0 = blue):
// North → blue.500 (pivotIndex 0)
// South → blue.700 (pivotIndex 1)
// East  → blue.300 (pivotIndex 2)
// West  → blue.800 (pivotIndex 3)
```

#### Pivot With Series Color (No Variation)

```typescript
config: { pivotKey: "region", series: [{ name: "sales", color: "purple.solid" }] }

// Output (Priority 2 - series color used for all):
// North → purple.solid
// South → purple.solid
// East  → purple.solid
// West  → purple.solid
```

#### Partial pivotColors Override

```typescript
config: {
    pivotKey: "region",
    series: [{
        name: "sales",
        pivotColors: new Map([["North", "red.600"]]),  // Only North defined
    }]
}

// Output:
// North → red.600    (Priority 1: pivotColors entry)
// South → blue.700   (Priority 3: auto, pivotIndex 1)
// East  → blue.300   (Priority 3: auto, pivotIndex 2)
// West  → blue.800   (Priority 3: auto, pivotIndex 3)
```

#### pivotColors With Series Color Fallback

```typescript
config: {
    pivotKey: "region",
    series: [{
        name: "sales",
        color: "green.solid",
        pivotColors: new Map([["North", "red.600"]]),
    }]
}

// Output:
// North → red.600      (Priority 1: pivotColors entry)
// South → green.solid  (Priority 2: series color fallback)
// East  → green.solid  (Priority 2: series color fallback)
// West  → green.solid  (Priority 2: series color fallback)
```

---

## Implementation

### New Types

```typescript
/**
 * Series enhancer function type.
 * Called for each output series with the original East config.
 */
export type SeriesEnhancer<TEastConfig, TEnhanced extends ChartSeriesItem> = (
    base: ChartSeriesItem,
    eastConfig: TEastConfig,
    pivotValue?: string
) => TEnhanced;

/**
 * Configuration for prepareChartData.
 */
export interface PrepareChartDataConfig<
    TEastConfig extends { name: string },
    TEnhanced extends ChartSeriesItem = ChartSeriesItem
> {
    rawData: Map<string, ValueTypeOf<typeof LiteralValueType>>[];
    dataSeries?: Map<string, Map<string, ValueTypeOf<typeof LiteralValueType>>[]>;
    xAxisKey?: string;
    valueKey?: string;
    pivotKey?: string;
    eastSeries: TEastConfig[];
    enhancer?: SeriesEnhancer<TEastConfig, TEnhanced>;
}

/**
 * Result from prepareChartData.
 */
export interface PreparedChartData<TEnhanced extends ChartSeriesItem = ChartSeriesItem> {
    data: Record<string, unknown>[];
    series: TEnhanced[];
    seriesOriginMap: Map<string, string>;
}
```

### Helper Functions

```typescript
export function getDefaultSeriesColor(seriesIndex: number): string {
    return SERIES_COLOR_PALETTE[seriesIndex % SERIES_COLOR_PALETTE.length];
}

export function getDefaultSeriesColorToken(seriesIndex: number): string {
    return `${getDefaultSeriesColor(seriesIndex)}.solid`;
}

export function getPivotShade(pivotIndex: number): string {
    return PIVOT_SHADE_PALETTE[pivotIndex % PIVOT_SHADE_PALETTE.length];
}

export function getPivotColorToken(baseColor: string, pivotIndex: number): string {
    const colorName = baseColor.split(".")[0];
    return `${colorName}.${getPivotShade(pivotIndex)}`;
}

/**
 * Resolve color for a pivot value using the priority rules.
 */
function resolvePivotColor(
    pivotValue: string,
    pivotIndex: number,
    seriesIndex: number,
    pivotColors: Map<string, string> | undefined,
    explicitSeriesColor: string | undefined
): string {
    // Priority 1: Explicit pivotColors entry
    if (pivotColors?.has(pivotValue)) {
        return pivotColors.get(pivotValue)!;
    }
    // Priority 2: Series color (same for all pivot values)
    if (explicitSeriesColor) {
        return explicitSeriesColor;
    }
    // Priority 3: Auto-generate from palettes
    const baseColor = getDefaultSeriesColor(seriesIndex);
    return getPivotColorToken(baseColor, pivotIndex);
}
```

### prepareChartData Implementation

```typescript
export function prepareChartData<
    TEastConfig extends { name: string; color?: unknown; pivotColors?: unknown },
    TEnhanced extends ChartSeriesItem = ChartSeriesItem
>(config: PrepareChartDataConfig<TEastConfig, TEnhanced>): PreparedChartData<TEnhanced> {
    const { rawData, dataSeries, xAxisKey, valueKey, pivotKey, eastSeries, enhancer } = config;

    let data: Record<string, unknown>[];
    let baseSeries: ChartSeriesItem[];
    let seriesOriginMap = new Map<string, string>();

    // ========================================================================
    // Mode 1: Pivot (long-format data with pivotKey, no dataSeries)
    // ========================================================================
    if (pivotKey && xAxisKey && valueKey && !dataSeries) {
        const seriesConfig = eastSeries.find(s => s.name === valueKey);
        const seriesIndex = Math.max(0, eastSeries.findIndex(s => s.name === valueKey));
        const pivotColors = (seriesConfig?.pivotColors as { type: string; value: Map<string, string> })?.type === "some"
            ? (seriesConfig?.pivotColors as { value: Map<string, string> }).value
            : undefined;
        const explicitColor = seriesConfig?.color
            ? getSomeorUndefined(seriesConfig.color as { type: string; value: string })
            : undefined;

        // Transform pivot data to wide format
        const xAxisValues = new Map<unknown, Record<string, unknown>>();
        const pivotValues = new Set<string>();

        for (const row of rawData) {
            const xValue = row.get(xAxisKey);
            const pivotValue = row.get(pivotKey);
            const yValue = row.get(valueKey);
            if (xValue === undefined || pivotValue === undefined) continue;

            const xConverted = convertLiteralValue(xValue);
            const pivotConverted = String(convertLiteralValue(pivotValue));
            pivotValues.add(pivotConverted);

            let xRow = xAxisValues.get(xConverted);
            if (!xRow) {
                xRow = { [xAxisKey]: xConverted };
                xAxisValues.set(xConverted, xRow);
            }
            xRow[pivotConverted] = yValue !== undefined ? convertLiteralValue(yValue) : null;
        }

        data = Array.from(xAxisValues.values());
        const pivotValuesArray = Array.from(pivotValues);

        baseSeries = pivotValuesArray.map((pv, pivotIndex) => ({
            name: pv,
            color: resolvePivotColor(pv, pivotIndex, seriesIndex, pivotColors, explicitColor),
        }));

        for (const pv of pivotValues) {
            seriesOriginMap.set(pv, valueKey);
        }
    }

    // ========================================================================
    // Mode 2: Multi-series + Pivot
    // ========================================================================
    else if (dataSeries && pivotKey && xAxisKey && valueKey) {
        const xAxisValues = new Map<unknown, Record<string, unknown>>();
        baseSeries = [];

        let seriesIdx = 0;
        for (const [seriesName, seriesData] of dataSeries.entries()) {
            const seriesConfig = eastSeries.find(s => s.name === seriesName);
            const pivotColors = (seriesConfig?.pivotColors as { type: string; value: Map<string, string> })?.type === "some"
                ? (seriesConfig?.pivotColors as { value: Map<string, string> }).value
                : undefined;
            const explicitColor = seriesConfig?.color
                ? getSomeorUndefined(seriesConfig.color as { type: string; value: string })
                : undefined;

            const pivotValuesForSeries = new Set<string>();

            for (const row of seriesData) {
                const xValue = row.get(xAxisKey);
                const pivotValue = row.get(pivotKey);
                const yValue = row.get(valueKey);
                if (xValue === undefined || pivotValue === undefined) continue;

                const xConverted = convertLiteralValue(xValue);
                const pivotConverted = String(convertLiteralValue(pivotValue));
                const compositeName = `${seriesName}_${pivotConverted}`;
                pivotValuesForSeries.add(pivotConverted);

                let xRow = xAxisValues.get(xConverted);
                if (!xRow) {
                    xRow = { [xAxisKey]: xConverted };
                    xAxisValues.set(xConverted, xRow);
                }
                xRow[compositeName] = yValue !== undefined ? convertLiteralValue(yValue) : null;
            }

            const pivotValuesArray = Array.from(pivotValuesForSeries);
            for (let pivotIndex = 0; pivotIndex < pivotValuesArray.length; pivotIndex++) {
                const pv = pivotValuesArray[pivotIndex];
                const compositeName = `${seriesName}_${pv}`;
                baseSeries.push({
                    name: compositeName,
                    color: resolvePivotColor(pv, pivotIndex, seriesIdx, pivotColors, explicitColor),
                });
                seriesOriginMap.set(compositeName, seriesName);
            }
            seriesIdx++;
        }

        data = Array.from(xAxisValues.values());
    }

    // ========================================================================
    // Mode 3: Multi-series without pivot
    // ========================================================================
    else if (dataSeries && xAxisKey && valueKey) {
        data = convertMultiSeriesData(dataSeries, xAxisKey, valueKey);
        baseSeries = eastSeries.map((s, idx) => ({
            name: s.name,
            color: s.color
                ? getSomeorUndefined(s.color as { type: string; value: string }) ?? getDefaultSeriesColorToken(idx)
                : getDefaultSeriesColorToken(idx),
        }));
    }

    // ========================================================================
    // Mode 4: Regular (wide-format data)
    // ========================================================================
    else {
        data = convertChartData(rawData);
        baseSeries = eastSeries.map((s, idx) => ({
            name: s.name,
            color: s.color
                ? getSomeorUndefined(s.color as { type: string; value: string }) ?? getDefaultSeriesColorToken(idx)
                : getDefaultSeriesColorToken(idx),
        }));
    }

    // ========================================================================
    // Apply enhancer (if provided)
    // ========================================================================
    const enhancedSeries = baseSeries.map((s) => {
        if (!enhancer) return s as TEnhanced;

        // Look up original config using seriesOriginMap for pivot series
        const originalName = seriesOriginMap.get(s.name) ?? s.name;
        const eastConfig = eastSeries.find(es => es.name === originalName);
        if (!eastConfig) return s as TEnhanced;

        const pivotValue = seriesOriginMap.has(s.name) ? s.name : undefined;
        return enhancer(s, eastConfig, pivotValue);
    });

    return { data, series: enhancedSeries, seriesOriginMap };
}
```

---

## Chart Component Updates

### Line Chart (After)

```typescript
// Define enhancer once, outside component
const enhanceLineSeries: SeriesEnhancer<LineSeriesValue, LineSeriesItem> = (base, config) => {
    const enhanced: LineSeriesItem = { ...base };
    const strokeWidth = getSomeorUndefined(config.strokeWidth);
    const strokeDasharray = getSomeorUndefined(config.strokeDasharray);
    const showDots = getSomeorUndefined(config.showDots);
    const showLine = getSomeorUndefined(config.showLine);
    const yAxisId = getSomeorUndefined(config.yAxisId);

    if (strokeWidth !== undefined) enhanced.strokeWidth = Number(strokeWidth);
    if (strokeDasharray !== undefined) enhanced.strokeDasharray = strokeDasharray;
    if (showDots !== undefined) enhanced.showDots = showDots;
    if (showLine !== undefined) enhanced.showLine = showLine;
    if (yAxisId !== undefined) enhanced.yAxisId = yAxisId.type as "left" | "right";

    return enhanced;
};

// In component - single call, no post-processing
const { data, series } = useMemo(() => prepareChartData({
    rawData: value.data,
    dataSeries: getSomeorUndefined(value.dataSeries),
    xAxisKey: xAxisDataKey,
    valueKey: getSomeorUndefined(value.valueKey),
    pivotKey: getSomeorUndefined(value.pivotKey),
    eastSeries: value.series,
    enhancer: enhanceLineSeries,
}), [value.data, value.dataSeries, value.valueKey, value.pivotKey, value.series, xAxisDataKey]);

const chart = useChart({ data, series });
// Render directly - series already has all properties!
```

### Composed Chart (After)

```typescript
const enhanceComposedSeries: SeriesEnhancer<ComposedSeriesVariant, ComposedSeriesItem> = (base, config) => {
    return match(config, {
        line: (v) => ({
            ...base,
            chartType: "line" as const,
            strokeWidth: getSomeorUndefined(v.strokeWidth) ? Number(getSomeorUndefined(v.strokeWidth)) : undefined,
            strokeDasharray: getSomeorUndefined(v.strokeDasharray),
            showDots: getSomeorUndefined(v.showDots),
            showLine: getSomeorUndefined(v.showLine),
            yAxisId: getSomeorUndefined(v.yAxisId)?.type as "left" | "right" | undefined,
        }),
        area: (v) => ({
            ...base,
            chartType: "area" as const,
            fill: getSomeorUndefined(v.fill),
            fillOpacity: getSomeorUndefined(v.fillOpacity),
            strokeWidth: getSomeorUndefined(v.strokeWidth) ? Number(getSomeorUndefined(v.strokeWidth)) : undefined,
            yAxisId: getSomeorUndefined(v.yAxisId)?.type as "left" | "right" | undefined,
        }),
        bar: (v) => ({
            ...base,
            chartType: "bar" as const,
            fill: getSomeorUndefined(v.fill),
            fillOpacity: getSomeorUndefined(v.fillOpacity),
            yAxisId: getSomeorUndefined(v.yAxisId)?.type as "left" | "right" | undefined,
        }),
        // ... other variants
    });
};

// Single call - no if (pivotKey) branching!
const { data, series } = useMemo(() => prepareChartData({
    rawData: value.data,
    eastSeries: value.series,
    enhancer: enhanceComposedSeries,
    // ...
}), [...]);

// series already has chartType, strokeWidth, etc. - just render!
```

---

## Implementation Plan

### Phase 1: Add Color Palettes and Helpers

**File:** `packages/east-ui-components/src/charts/utils.ts`

1. Add `SERIES_COLOR_PALETTE` and `PIVOT_SHADE_PALETTE` constants
2. Add helper functions: `getDefaultSeriesColor`, `getDefaultSeriesColorToken`, `getPivotShade`, `getPivotColorToken`, `resolvePivotColor`
3. Add new types: `SeriesEnhancer`, updated `PrepareChartDataConfig`, `PreparedChartData`

### Phase 2: Update prepareChartData

**File:** `packages/east-ui-components/src/charts/utils.ts`

1. Add generic type parameters to `prepareChartData`
2. Add `enhancer` parameter handling
3. Update all 4 modes to use new color resolution logic
4. Apply enhancer at the end using `seriesOriginMap` for correct config lookup

### Phase 3: Refactor Chart Components

**Files:**
- `packages/east-ui-components/src/charts/line/index.tsx`
- `packages/east-ui-components/src/charts/area/index.tsx`
- `packages/east-ui-components/src/charts/bar/index.tsx`
- `packages/east-ui-components/src/charts/composed/index.tsx`

For each chart:
1. Define chart-specific enhancer function
2. Remove post-processing `useMemo` blocks
3. Pass enhancer to `prepareChartData`
4. Use returned series directly in rendering

### Phase 4: Update Showcase Examples

**Files:** `packages/east-ui-showcase/showcases/charts/*.ts`

1. Add examples without explicit colors to demonstrate auto-coloring
2. Add pivot examples showing shade variation

---

## Testing Checklist

- [ ] Single series without color → blue.solid
- [ ] Multiple series without colors → distinct colors from palette
- [ ] Series with explicit color → uses explicit color
- [ ] Mix of explicit and auto colors → explicit respected, auto fills gaps
- [ ] Pivot without pivotColors or series color → shades of auto base color
- [ ] Pivot with series color (no pivotColors) → same color for all
- [ ] Pivot with pivotColors → explicit entries used
- [ ] Partial pivotColors → explicit entries + fallback for others
- [ ] More than 10 series → wraps to beginning of palette
- [ ] More than 7 pivot values → wraps to beginning of shade palette
- [ ] Pivot mode with strokeWidth/showDots → properties correctly applied
- [ ] Composed chart pivot mode → chartType correctly preserved

---

## Backwards Compatibility

This change is backwards compatible:

1. Charts with explicit `color` continue to use those colors
2. Charts with explicit `pivotColors` continue to use those mappings
3. Only charts without explicit colors get new automatic coloring
4. First series defaults to blue.solid (visually similar to old teal.solid)
5. Existing enhancer-less usage works (enhancer is optional)
