# Chakra UI v3 Charts Reference

This document captures the complete Chakra UI v3 charts API for reference when designing East UI charts.

## Overview

Chakra UI v3 charts are built on top of [Recharts](https://recharts.org/). The pattern is:
1. `useChart` hook creates a chart configuration object
2. `Chart.Root` wraps the chart with theming context
3. Recharts components are composed directly inside

## Core: useChart Hook

```typescript
import { useChart } from "@chakra-ui/charts"

const chart = useChart({
  data: [...],           // Array of data points
  series: [...],         // Array of series definitions
  sort: { by, direction } // Optional sorting
})
```

### useChart Return Values

```typescript
{
  id: string,                    // Unique chart ID
  data: T[],                     // Sorted data array
  series: Series[],              // Series definitions

  // Utilities
  key: (name) => name,           // Type-safe data key accessor
  color: (token) => string,      // Theme color resolver
  size: (token) => string,       // Theme size resolver
  spacing: (token) => string,    // Theme spacing resolver

  // Formatters
  formatNumber: (options?: Intl.NumberFormatOptions) => (value: number) => string,
  formatDate: (options?: Intl.DateTimeFormatOptions) => (value: string) => string,

  // Aggregation
  getTotal: (key) => number,
  getMin: (key) => number,
  getMax: (key) => number,
  getValuePercent: (key, value, domain?) => number,
  getPayloadTotal: (payload) => number,

  // Series highlighting (for interactivity)
  highlightedSeries: string | null,
  setHighlightedSeries: (name: string | null) => void,
  isHighlightedSeries: (name: string) => boolean,
  getSeriesOpacity: (name: string, fallback?: number) => number,

  // Grouping
  groupBy: (key) => Record<string, T[]>,

  // Series lookup
  getSeries: (item) => Series,
}
```

### formatNumber Options

```typescript
chart.formatNumber({ style: "percent" })           // "50%"
chart.formatNumber({ style: "currency", currency: "USD" })  // "$1,000"
chart.formatNumber({ style: "currency", currency: "USD", notation: "compact" })  // "$1K"
chart.formatNumber({ notation: "compact" })        // "1.2K"
```

---

## Data Structures

### Cartesian Charts (Area, Line, Bar, Scatter)

```typescript
data: [
  { month: "January", windows: 186, mac: 80, linux: 120 },
  { month: "February", windows: 165, mac: 95, linux: 110 },
  // ...
]

series: [
  { name: "windows", color: "teal.solid" },
  { name: "mac", color: "purple.solid" },
  { name: "linux", color: "blue.solid" },
]
```

### Stacked Charts

```typescript
series: [
  { name: "windows", color: "teal.solid", stackId: "a" },
  { name: "mac", color: "purple.solid", stackId: "a" },
  { name: "linux", color: "blue.solid", stackId: "a" },
]
```

### Pie/Donut Charts

```typescript
data: [
  { name: "windows", value: 400, color: "blue.solid" },
  { name: "mac", value: 300, color: "orange.solid" },
  { name: "linux", value: 300, color: "pink.solid" },
  { name: "other", value: 200, color: "green.solid" },
]
// No series needed - color is in data
```

### BarList/BarSegment

```typescript
data: [
  { name: "Google", value: 1200000 },
  { name: "Direct", value: 100000 },
  { name: "Bing", value: 200000 },
]

series: [{ name: "name", color: "teal.subtle" }]

sort: { by: "value", direction: "desc" }
```

### Scatter Charts

```typescript
data: [
  { id: "group1", x: 10, y: 30 },
  { id: "group1", x: 15, y: 50 },
  { id: "group2", x: 20, y: 40 },
  { id: "group2", x: 25, y: 60 },
]

series: [
  { name: "group1", label: "Group 1", color: "blue.solid" },
  { name: "group2", label: "Group 2", color: "green.solid" },
]
```

---

## Complete Examples

### Area Chart - Basic

```tsx
"use client"

import { Chart, useChart } from "@chakra-ui/charts"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
} from "recharts"

export const AreaChartBasic = () => {
  const chart = useChart({
    data: [
      { windows: 186, mac: 80, linux: 120, month: "January" },
      { windows: 165, mac: 95, linux: 110, month: "February" },
      { windows: 190, mac: 87, linux: 125, month: "March" },
      { windows: 195, mac: 88, linux: 130, month: "May" },
      { windows: 182, mac: 98, linux: 122, month: "June" },
      { windows: 175, mac: 90, linux: 115, month: "August" },
      { windows: 180, mac: 86, linux: 124, month: "October" },
      { windows: 185, mac: 91, linux: 126, month: "November" },
    ],
    series: [
      { name: "windows", color: "teal.solid" },
      { name: "mac", color: "purple.solid" },
      { name: "linux", color: "blue.solid" },
    ],
  })

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <AreaChart data={chart.data}>
        <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey={chart.key("month")}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <Tooltip
          cursor={false}
          animationDuration={100}
          content={<Chart.Tooltip />}
        />
        <Legend content={<Chart.Legend />} />
        {chart.series.map((item) => (
          <Area
            key={item.name}
            isAnimationActive={false}
            dataKey={chart.key(item.name)}
            fill={chart.color(item.color)}
            fillOpacity={0.2}
            stroke={chart.color(item.color)}
            stackId="a"
          />
        ))}
      </AreaChart>
    </Chart.Root>
  )
}
```

### Area Chart - Percent (100% Stacked)

```tsx
export const AreaChartPercent = () => {
  const chart = useChart({
    data: [
      { windows: 186, mac: 80, linux: 120, month: "January" },
      // ...
    ],
    series: [
      { name: "windows", color: "teal.solid" },
      { name: "mac", color: "purple.solid" },
      { name: "linux", color: "blue.solid" },
    ],
  })

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <AreaChart accessibilityLayer stackOffset="expand" data={chart.data}>
        <CartesianGrid stroke={chart.color("border")} vertical={false} />
        <XAxis
          dataKey={chart.key("month")}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={chart.formatNumber({ style: "percent" })}
        />
        <Tooltip
          cursor={false}
          animationDuration={100}
          content={<Chart.Tooltip />}
        />
        <Legend content={<Chart.Legend />} />
        {chart.series.map((item) => (
          <Area
            key={item.name}
            isAnimationActive={false}
            dataKey={chart.key(item.name)}
            fill={chart.color(item.color)}
            fillOpacity={0.2}
            stroke={chart.color(item.color)}
            stackId="a"
          />
        ))}
      </AreaChart>
    </Chart.Root>
  )
}
```

### Area Chart - With Gradient

```tsx
export const AreaChartWithGradient = () => {
  const chart = useChart({
    data: [...],
    series: [
      { name: "windows", color: "teal.solid" },
      { name: "mac", color: "purple.solid" },
      { name: "linux", color: "blue.solid" },
    ],
  })

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <AreaChart data={chart.data}>
        <CartesianGrid
          stroke={chart.color("border")}
          vertical={false}
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey={chart.key("month")}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip cursor={false} animationDuration={100} content={<Chart.Tooltip />} />
        <Legend content={<Chart.Legend />} />

        {chart.series.map((item) => (
          <defs key={item.name}>
            <Chart.Gradient
              id={`${item.name}-gradient`}
              stops={[
                { offset: "0%", color: item.color, opacity: 0.3 },
                { offset: "100%", color: item.color, opacity: 0.05 },
              ]}
            />
          </defs>
        ))}

        {chart.series.map((item) => (
          <Area
            key={item.name}
            type="natural"
            isAnimationActive={false}
            dataKey={chart.key(item.name)}
            fill={`url(#${item.name}-gradient)`}
            stroke={chart.color(item.color)}
            strokeWidth={2}
            stackId="a"
          />
        ))}
      </AreaChart>
    </Chart.Root>
  )
}
```

### Bar Chart - Basic

```tsx
export const BarChartBasic = () => {
  const chart = useChart({
    data: [
      { allocation: 60, type: "Stock" },
      { allocation: 45, type: "Crypto" },
      { allocation: 12, type: "ETF" },
      { allocation: 4, type: "Cash" },
    ],
    series: [{ name: "allocation", color: "teal.solid" }],
  })

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <BarChart data={chart.data}>
        <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
        <XAxis axisLine={false} tickLine={false} dataKey={chart.key("type")} />
        <YAxis
          axisLine={false}
          tickLine={false}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        {chart.series.map((item) => (
          <Bar
            key={item.name}
            isAnimationActive={false}
            dataKey={chart.key(item.name)}
            fill={chart.color(item.color)}
          />
        ))}
      </BarChart>
    </Chart.Root>
  )
}
```

### Bar Chart - Stacked

```tsx
export const BarChartStacked = () => {
  const chart = useChart({
    data: [
      { windows: 186, mac: 80, linux: 120, month: "January" },
      // ...
    ],
    series: [
      { name: "windows", color: "teal.solid", stackId: "a" },
      { name: "mac", color: "purple.solid", stackId: "a" },
      { name: "linux", color: "blue.solid", stackId: "a" },
    ],
  })

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <BarChart data={chart.data}>
        <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey={chart.key("month")}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <Tooltip cursor={false} animationDuration={100} content={<Chart.Tooltip />} />
        <Legend content={<Chart.Legend />} />
        {chart.series.map((item) => (
          <Bar
            isAnimationActive={false}
            key={item.name}
            dataKey={chart.key(item.name)}
            fill={chart.color(item.color)}
            stackId={item.stackId}
          />
        ))}
      </BarChart>
    </Chart.Root>
  )
}
```

### Bar Chart - Horizontal

```tsx
export const BarChartHorizontal = () => {
  const chart = useChart({
    data: [...],
    series: [
      { name: "windows", color: "teal.solid", stackId: "a" },
      { name: "mac", color: "purple.solid", stackId: "a" },
      { name: "linux", color: "blue.solid", stackId: "a" },
    ],
  })

  return (
    <Chart.Root maxH="md" chart={chart}>
      <BarChart layout="vertical" data={chart.data} barSize={30}>
        <CartesianGrid stroke={chart.color("border.muted")} horizontal={false} />
        <XAxis type="number" axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          width={80}
          axisLine={false}
          tickLine={false}
          dataKey={chart.key("month")}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <Tooltip cursor={false} animationDuration={100} content={<Chart.Tooltip />} />
        <Legend content={<Chart.Legend />} />
        {chart.series.map((item) => (
          <Bar
            isAnimationActive={false}
            key={item.name}
            dataKey={chart.key(item.name)}
            fill={chart.color(item.color)}
            stackId={item.stackId}
          />
        ))}
      </BarChart>
    </Chart.Root>
  )
}
```

### Bar Chart - Multiple (Grouped)

```tsx
export const BarChartMultiple = () => {
  const chart = useChart({
    data: [
      { type: "mobile", poor: 40, fair: 100, good: 200, excellent: 70 },
      { type: "marketing", poor: 15, fair: 40, good: 120, excellent: 90 },
      { type: "social", poor: 70, fair: 135, good: 220, excellent: 180 },
      { type: "ecommerce", poor: 175, fair: 155, good: 75, excellent: 95 },
    ],
    series: [
      { name: "poor", color: "blue.solid" },
      { name: "fair", color: "orange.solid" },
      { name: "good", color: "yellow.solid" },
      { name: "excellent", color: "green.solid" },
    ],
  })

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <BarChart data={chart.data}>
        <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
        <XAxis tickLine={false} dataKey={chart.key("type")} stroke={chart.color("border")} />
        <YAxis tickLine={false} stroke={chart.color("border")} />
        <Tooltip
          cursor={{ fill: chart.color("bg.muted") }}
          animationDuration={100}
          content={<Chart.Tooltip />}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="top"
          wrapperStyle={{ paddingLeft: 30 }}
          content={<Chart.Legend orientation="vertical" />}
        />
        {chart.series.map((item) => (
          <Bar
            isAnimationActive={false}
            key={item.name}
            dataKey={chart.key(item.name)}
            fill={chart.color(item.color)}
          />
        ))}
      </BarChart>
    </Chart.Root>
  )
}
```

### Bar Chart - Percent (100% Stacked)

```tsx
export const BarChartPercent = () => {
  const chart = useChart({
    data: [...],
    series: [
      { name: "windows", color: "teal.solid", stackId: "a" },
      { name: "mac", color: "purple.solid", stackId: "a" },
      { name: "linux", color: "blue.solid", stackId: "a" },
    ],
  })

  return (
    <Chart.Root maxH="md" chart={chart}>
      <BarChart stackOffset="expand" data={chart.data}>
        <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey={chart.key("month")}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          stroke={chart.color("border.emphasized")}
          tickFormatter={chart.formatNumber({ style: "percent" })}
        />
        <Tooltip
          cursor={{ fill: chart.color("bg.muted") }}
          animationDuration={100}
          content={<Chart.Tooltip />}
        />
        <Legend content={<Chart.Legend />} />
        {chart.series.map((item) => (
          <Bar
            isAnimationActive={false}
            key={item.name}
            dataKey={chart.key(item.name)}
            fill={chart.color(item.color)}
            stroke={chart.color(item.color)}
            stackId={item.stackId}
          />
        ))}
      </BarChart>
    </Chart.Root>
  )
}
```

### Bar Chart - With Reference Lines

```tsx
export const BarChartWithReferenceLines = () => {
  const chart = useChart({
    data: [
      { sales: 63000, month: "June" },
      { sales: 72000, month: "July" },
      { sales: 85000, month: "August" },
      { sales: 79000, month: "September" },
      { sales: 90000, month: "October" },
      { sales: 95000, month: "November" },
      { sales: 88000, month: "December" },
    ],
    series: [{ name: "sales", color: "blue.solid" }],
  })

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <BarChart data={chart.data}>
        <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey={chart.key("month")}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <Tooltip cursor={false} animationDuration={100} content={<Chart.Tooltip />} />
        <ReferenceArea
          y1={76000}
          y2={90000}
          fill={chart.color("red.muted")}
          fillOpacity={0.4}
          label={{
            value: "top line",
            position: "insideTopLeft",
            fill: chart.color("red.fg"),
          }}
        />
        <ReferenceLine
          y={80000}
          stroke={chart.color("red.fg")}
          strokeDasharray="3 3"
        />
        {chart.series.map((item) => (
          <Bar
            isAnimationActive={false}
            key={item.name}
            dataKey={chart.key(item.name)}
            fill={chart.color(item.color)}
            fillOpacity={0.64}
          />
        ))}
      </BarChart>
    </Chart.Root>
  )
}
```

### Bar Chart - With Currency Formatter

```tsx
export const BarChartWithFormatter = () => {
  const chart = useChart({
    data: [
      { sales: 63000, month: "June" },
      { sales: 72000, month: "July" },
      // ...
    ],
    series: [{ name: "sales", color: "teal.solid" }],
  })

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <BarChart data={chart.data}>
        <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey={chart.key("month")}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickFormatter={chart.formatNumber({
            style: "currency",
            currency: "USD",
            notation: "compact",
          })}
        />
        <Tooltip
          cursor={{ fill: chart.color("bg.muted") }}
          animationDuration={0}
          content={<Chart.Tooltip />}
        />
        {chart.series.map((item) => (
          <Bar
            isAnimationActive={false}
            key={item.name}
            dataKey={chart.key(item.name)}
            fill={chart.color(item.color)}
          />
        ))}
      </BarChart>
    </Chart.Root>
  )
}
```

### Line Chart - Basic

```tsx
export const LineChartBasic = () => {
  const chart = useChart({
    data: [
      { sale: 10, month: "January" },
      { sale: 95, month: "February" },
      { sale: 87, month: "March" },
      { sale: 88, month: "May" },
      { sale: 65, month: "June" },
      { sale: 90, month: "August" },
    ],
    series: [{ name: "sale", color: "teal.solid" }],
  })

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <LineChart data={chart.data}>
        <CartesianGrid stroke={chart.color("border")} vertical={false} />
        <XAxis
          axisLine={false}
          dataKey={chart.key("month")}
          tickFormatter={(value) => value.slice(0, 3)}
          stroke={chart.color("border")}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          stroke={chart.color("border")}
        />
        <Tooltip animationDuration={100} cursor={false} content={<Chart.Tooltip />} />
        {chart.series.map((item) => (
          <Line
            key={item.name}
            isAnimationActive={false}
            dataKey={chart.key(item.name)}
            stroke={chart.color(item.color)}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </Chart.Root>
  )
}
```

### Line Chart - Multiple Series

```tsx
export const LineChartMultiple = () => {
  const chart = useChart({
    data: [
      { mac: 10, linux: 120, month: "January" },
      { mac: 95, linux: 110, month: "February" },
      { mac: 87, linux: 125, month: "March" },
      { mac: 88, linux: 30, month: "May" },
      { mac: 98, linux: 122, month: "June" },
      { mac: 90, linux: 15, month: "August" },
    ],
    series: [
      { name: "mac", color: "purple.solid" },
      { name: "linux", color: "blue.solid" },
    ],
  })

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <LineChart data={chart.data}>
        <CartesianGrid stroke={chart.color("border")} vertical={false} />
        <XAxis
          axisLine={false}
          dataKey={chart.key("month")}
          tickFormatter={(value) => value.slice(0, 3)}
          stroke={chart.color("border")}
        />
        <YAxis axisLine={false} tickLine={false} tickMargin={10} stroke={chart.color("border")} />
        <Tooltip animationDuration={100} cursor={false} content={<Chart.Tooltip />} />
        <Legend content={<Chart.Legend />} />
        {chart.series.map((item) => (
          <Line
            key={item.name}
            isAnimationActive={false}
            dataKey={chart.key(item.name)}
            fill={chart.color(item.color)}
            stroke={chart.color(item.color)}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </Chart.Root>
  )
}
```

### Line Chart - Biaxial (Dual Y-Axis)

```tsx
export const LineChartBiaxial = () => {
  const chart = useChart({
    data: [
      { windows: 186, mac: 80, month: "January" },
      // ... (windows has larger values than mac)
    ],
    series: [
      { name: "windows", color: "teal.solid" },
      { name: "mac", color: "purple.solid" },
    ],
  })

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <LineChart data={chart.data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid stroke={chart.color("border")} vertical={false} />
        <XAxis
          axisLine={false}
          dataKey={chart.key("month")}
          tickFormatter={(value) => value.slice(0, 3)}
          stroke={chart.color("border")}
        />
        <YAxis
          yAxisId="left"
          axisLine={false}
          tickLine={false}
          stroke={chart.color("teal.solid")}
          label={{ value: "Windows", angle: -90, position: "insideLeft" }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          axisLine={false}
          tickLine={false}
          stroke={chart.color("purple.solid")}
          label={{ value: "Mac", angle: 90, position: "insideRight" }}
        />
        <Tooltip animationDuration={100} cursor={{ strokeDasharray: "3 3" }} content={<Chart.Tooltip />} />
        <Legend align="right" verticalAlign="top" content={<Chart.Legend />} />
        <Line
          yAxisId="left"
          isAnimationActive={false}
          dataKey={chart.key("windows")}
          stroke={chart.color("teal.solid")}
          strokeWidth={2}
        />
        <Line
          yAxisId="right"
          isAnimationActive={false}
          dataKey={chart.key("mac")}
          stroke={chart.color("purple.solid")}
          strokeWidth={2}
        />
      </LineChart>
    </Chart.Root>
  )
}
```

### Line Chart - With Value Domain

```tsx
export const LineChartWithValueDomain = () => {
  const chart = useChart({
    data: [
      { sales: 175, month: "January" },
      { sales: 195, month: "February" },
      // ... values between 175-195
    ],
    series: [{ name: "sales", color: "teal.solid" }],
  })

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <LineChart data={chart.data}>
        <CartesianGrid stroke={chart.color("border")} vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey={chart.key("month")}
          tickFormatter={(value) => value.slice(0, 3)}
          stroke={chart.color("border")}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          domain={[160, "dataMax + 10"]}  // Custom domain!
          stroke={chart.color("border")}
        />
        <Tooltip animationDuration={100} cursor={false} content={<Chart.Tooltip />} />
        {chart.series.map((item) => (
          <Line
            key={item.name}
            type="natural"
            isAnimationActive={false}
            dataKey={chart.key(item.name)}
            stroke={chart.color(item.color)}
            strokeWidth={4}
            connectNulls
          />
        ))}
      </LineChart>
    </Chart.Root>
  )
}
```

### Scatter Chart - Basic

```tsx
export const ScatterChartBasic = () => {
  const chart = useChart({
    data: [
      { temp: 10, sales: 30 },
      { temp: 15, sales: 50 },
      { temp: 20, sales: 80 },
      // ...
    ],
    series: [{ name: "data", color: "teal.solid" }],
  })

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <XAxis
          type="number"
          dataKey="temp"
          domain={[10, "dataMax + 3"]}
          tickFormatter={(value) => `${value}°C`}
        />
        <YAxis type="number" dataKey="sales" />
        <Scatter
          isAnimationActive={false}
          data={chart.data}
          fill={chart.color("teal.solid")}
        />
      </ScatterChart>
    </Chart.Root>
  )
}
```

### Scatter Chart - Multiple Groups

```tsx
export const ScatterChartMultiple = () => {
  const chart = useChart({
    data: [
      { id: "group1", x: 10, y: 30 },
      { id: "group1", x: 15, y: 50 },
      { id: "group2", x: 20, y: 40 },
      { id: "group2", x: 25, y: 60 },
      // ...
    ],
    series: [
      { name: "group1", label: "Group 1", color: "blue.solid" },
      { name: "group2", label: "Group 2", color: "green.solid" },
    ],
  })

  // Groups data by id field
  const groupedData = chart.groupBy("id")

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <XAxis type="number" dataKey="x" domain={[0, 50]} />
        <YAxis type="number" dataKey="y" domain={[0, 100]} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<Chart.Tooltip />} />
        {chart.series.map((item) => (
          <Scatter
            key={item.name}
            isAnimationActive={false}
            data={groupedData[item.name]}
            fill={chart.color(item.color)}
          />
        ))}
      </ScatterChart>
    </Chart.Root>
  )
}
```

### Pie Chart - Basic

```tsx
export const PieChartBasic = () => {
  const chart = useChart({
    data: [
      { name: "windows", value: 400, color: "blue.solid" },
      { name: "mac", value: 300, color: "orange.solid" },
      { name: "linux", value: 300, color: "pink.solid" },
      { name: "other", value: 200, color: "green.solid" },
    ],
  })

  return (
    <Chart.Root boxSize="200px" mx="auto" chart={chart}>
      <PieChart>
        <Pie
          isAnimationActive={false}
          data={chart.data}
          dataKey={chart.key("value")}
        >
          {chart.data.map((item) => (
            <Cell key={item.name} fill={chart.color(item.color)} />
          ))}
        </Pie>
      </PieChart>
    </Chart.Root>
  )
}
```

### Pie Chart - With Legend

```tsx
export const PieChartWithLegend = () => {
  const chart = useChart({
    data: [
      { name: "windows", value: 400, color: "blue.solid" },
      { name: "mac", value: 300, color: "orange.solid" },
      { name: "linux", value: 300, color: "pink.solid" },
    ],
  })

  return (
    <Chart.Root boxSize="200px" mx="auto" chart={chart}>
      <PieChart>
        <Pie isAnimationActive={false} data={chart.data} dataKey={chart.key("value")}>
          {chart.data.map((item) => (
            <Cell key={item.name} fill={chart.color(item.color)} />
          ))}
        </Pie>
        <Legend content={<Chart.Legend />} />
      </PieChart>
    </Chart.Root>
  )
}
```

### Donut Chart - Basic

```tsx
export const DonutChartBasic = () => {
  const chart = useChart({
    data: [
      { name: "windows", value: 400, color: "blue.solid" },
      { name: "mac", value: 300, color: "orange.solid" },
      { name: "linux", value: 300, color: "pink.solid" },
      { name: "other", value: 200, color: "green.solid" },
    ],
  })

  return (
    <Chart.Root boxSize="200px" mx="auto" chart={chart}>
      <PieChart>
        <Tooltip animationDuration={100} content={<Chart.Tooltip />} />
        <Pie
          isAnimationActive={false}
          data={chart.data}
          dataKey={chart.key("value")}
          innerRadius={60}
          outerRadius={80}
        >
          {chart.data.map((item) => (
            <Cell key={item.name} fill={chart.color(item.color)} />
          ))}
        </Pie>
      </PieChart>
    </Chart.Root>
  )
}
```

### Donut Chart - With Centered Text

```tsx
export const DonutChartWithCenteredText = () => {
  const chart = useChart({
    data: [
      { name: "windows", value: 400, color: "blue.solid" },
      { name: "mac", value: 300, color: "orange.solid" },
      { name: "linux", value: 300, color: "pink.solid" },
      { name: "other", value: 200, color: "green.solid" },
    ],
  })

  const total = chart.getTotal("value")

  return (
    <Chart.Root boxSize="200px" mx="auto" chart={chart}>
      <PieChart>
        <Tooltip animationDuration={100} content={<Chart.Tooltip />} />
        <Pie
          isAnimationActive={false}
          data={chart.data}
          dataKey={chart.key("value")}
          innerRadius={80}
          outerRadius={100}
        >
          {chart.data.map((item) => (
            <Cell key={item.name} fill={chart.color(item.color)} />
          ))}
        </Pie>
        {/* Centered text using absolute positioning */}
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
          {total} Users
        </text>
      </PieChart>
    </Chart.Root>
  )
}
```

### Radar Chart - Basic

```tsx
export const RadarChartBasic = () => {
  const chart = useChart({
    data: [
      { windows: 130, month: "January" },
      { windows: 120, month: "February" },
      { windows: 75, month: "March" },
      { windows: 100, month: "May" },
      { windows: 85, month: "June" },
    ],
    series: [{ name: "windows", color: "teal.solid" }],
  })

  return (
    <Chart.Root maxW="sm" mx="auto" chart={chart}>
      <RadarChart data={chart.data}>
        <PolarGrid />
        <PolarAngleAxis dataKey={chart.key("month")} />
        <PolarRadiusAxis />
        {chart.series.map((item) => (
          <Radar
            key={item.name}
            isAnimationActive={false}
            dataKey={chart.key(item.name)}
            stroke={chart.color(item.color)}
            fill={chart.color(item.color)}
            fillOpacity={0.5}
          />
        ))}
      </RadarChart>
    </Chart.Root>
  )
}
```

### Radar Chart - Multiple Series

```tsx
export const RadarChartMultiple = () => {
  const chart = useChart({
    data: [
      { windows: 30, mac: 100, month: "January" },
      { windows: 50, mac: 80, month: "February" },
      { windows: 70, mac: 60, month: "March" },
      { windows: 90, mac: 40, month: "May" },
      { windows: 60, mac: 70, month: "June" },
      { windows: 40, mac: 90, month: "July" },
    ],
    series: [
      { name: "windows", color: "teal.solid" },
      { name: "mac", color: "orange.solid" },
    ],
  })

  return (
    <Chart.Root maxW="sm" mx="auto" chart={chart}>
      <RadarChart data={chart.data}>
        <PolarGrid />
        <PolarAngleAxis dataKey={chart.key("month")} />
        <Legend content={<Chart.Legend />} />
        {chart.series.map((item) => (
          <Radar
            key={item.name}
            isAnimationActive={false}
            dataKey={chart.key(item.name)}
            stroke={chart.color(item.color)}
            fill={chart.color(item.color)}
            fillOpacity={0.2}
            strokeWidth={2}
          />
        ))}
      </RadarChart>
    </Chart.Root>
  )
}
```

### Sparkline - Basic

```tsx
export const SparklineBasic = () => {
  const chart = useChart({
    data: [
      { value: 10 },
      { value: 16 },
      { value: 19 },
      { value: 15 },
      { value: 12 },
      { value: 15 },
      { value: 10 },
      { value: 18 },
    ],
    series: [{ name: "value", color: "teal.solid" }],
  })

  return (
    <Chart.Root width="28" height="12" chart={chart}>
      <AreaChart data={chart.data}>
        {chart.series.map((item) => (
          <Area
            key={item.name}
            isAnimationActive={false}
            dataKey={chart.key(item.name)}
            fill={chart.color(item.color)}
            fillOpacity={0.2}
            stroke={chart.color(item.color)}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </Chart.Root>
  )
}
```

---

## BarList Component (Chakra-specific)

BarList is a simple horizontal bar chart for comparing categories.

### BarList - Basic

```tsx
import { BarList, type BarListData, useChart } from "@chakra-ui/charts"

export const BarListBasic = () => {
  const chart = useChart<BarListData>({
    sort: { by: "value", direction: "desc" },
    data: [
      { name: "Google", value: 1200000 },
      { name: "Direct", value: 100000 },
      { name: "Bing", value: 200000 },
      { name: "Yahoo", value: 20000 },
      { name: "ChatGPT", value: 1345000 },
      { name: "Github", value: 100000 },
      { name: "Yandex", value: 100000 },
    ],
    series: [{ name: "name", color: "teal.subtle" }],
  })

  return (
    <BarList.Root chart={chart}>
      <BarList.Content>
        <BarList.Bar />
        <BarList.Value />
      </BarList.Content>
    </BarList.Root>
  )
}
```

### BarList - With Formatter

```tsx
export const BarListWithFormatter = () => {
  const chart = useChart<BarListData>({
    sort: { by: "value", direction: "desc" },
    data: [
      { name: "Created", value: 120 },
      { name: "Initial Contact", value: 90 },
      { name: "Booked Demo", value: 45 },
      { name: "Closed", value: 10 },
    ],
    series: [{ name: "name", color: "pink.subtle" }],
  })

  const getPercent = (value: number) =>
    chart.getValuePercent("value", value).toFixed(0)

  return (
    <BarList.Root chart={chart}>
      <BarList.Content>
        <BarList.Bar />
        <BarList.Value
          valueFormatter={(value) => `${value} (${getPercent(value)}%)`}
        />
      </BarList.Content>
    </BarList.Root>
  )
}
```

### BarList - With Labels

```tsx
export const BarListWithLabel = () => {
  const chart = useChart<BarListData>({
    sort: { by: "value", direction: "desc" },
    data: [
      { name: "Google", value: 1200000 },
      { name: "Direct", value: 100000 },
      // ...
    ],
    series: [{ name: "name", color: "teal.subtle" }],
  })

  return (
    <BarList.Root chart={chart}>
      <BarList.Content>
        <BarList.Label title="Search Engine" flex="1">
          <BarList.Bar />
        </BarList.Label>
        <BarList.Label title="Downloads" titleAlignment="end">
          <BarList.Value />
        </BarList.Label>
      </BarList.Content>
    </BarList.Root>
  )
}
```

---

## BarSegment Component (Chakra-specific)

BarSegment shows proportional data as colored segments in a single bar.

### BarSegment - Basic

```tsx
import { BarSegment, useChart } from "@chakra-ui/charts"

export const BarSegmentBasic = () => {
  const chart = useChart({
    sort: { by: "value", direction: "desc" },
    data: [
      { name: "Google", value: 500000, color: "teal.solid" },
      { name: "Direct", value: 100000, color: "blue.solid" },
      { name: "Bing", value: 200000, color: "orange.solid" },
      { name: "Yandex", value: 100000, color: "purple.solid" },
    ],
  })

  return (
    <BarSegment.Root chart={chart}>
      <BarSegment.Content>
        <BarSegment.Value />
        <BarSegment.Bar />
        <BarSegment.Label />
      </BarSegment.Content>
    </BarSegment.Root>
  )
}
```

---

## Key Configuration Options

### Chart.Root Props

| Prop | Type | Description |
|------|------|-------------|
| `chart` | `UseChartReturn` | Required. The chart instance from useChart |
| `maxH` | `string` | Maximum height (e.g., "sm", "md", "lg") |
| `maxW` | `string` | Maximum width |
| `boxSize` | `string` | Width and height (for pie/donut) |
| `width` | `string/number` | Explicit width |
| `height` | `string/number` | Explicit height |

### Recharts Component Props

#### BarChart / LineChart / AreaChart

| Prop | Type | Description |
|------|------|-------------|
| `data` | `array` | Data array |
| `layout` | `"horizontal" \| "vertical"` | Chart orientation |
| `stackOffset` | `"expand" \| "none" \| ...` | Stacking behavior |
| `margin` | `object` | `{ top, right, bottom, left }` |
| `barSize` | `number` | Width of bars |
| `barCategoryGap` | `string/number` | Gap between bar groups |

#### XAxis / YAxis

| Prop | Type | Description |
|------|------|-------------|
| `dataKey` | `string` | Data key for axis values |
| `type` | `"number" \| "category"` | Axis type |
| `domain` | `array` | Value range, e.g., `[0, 100]`, `["dataMin", "dataMax + 10"]` |
| `orientation` | `"left" \| "right" \| "top" \| "bottom"` | Axis position |
| `yAxisId` | `string` | For biaxial charts |
| `tickFormatter` | `function` | Format tick labels |
| `axisLine` | `boolean` | Show axis line |
| `tickLine` | `boolean` | Show tick lines |
| `tickMargin` | `number` | Margin between tick and label |

#### Area / Line / Bar

| Prop | Type | Description |
|------|------|-------------|
| `dataKey` | `string` | Data key for values |
| `stackId` | `string` | Stack identifier (same = stacked) |
| `fill` | `string` | Fill color |
| `stroke` | `string` | Stroke color |
| `strokeWidth` | `number` | Line width |
| `fillOpacity` | `number` | Fill transparency (0-1) |
| `type` | `string` | Curve type: "monotone", "natural", etc. |
| `dot` | `boolean/object` | Show data points |
| `isAnimationActive` | `boolean` | Enable animation |
| `connectNulls` | `boolean` | Connect across null values |

#### Pie

| Prop | Type | Description |
|------|------|-------------|
| `data` | `array` | Data array |
| `dataKey` | `string` | Value key |
| `innerRadius` | `number` | Inner radius (>0 for donut) |
| `outerRadius` | `number` | Outer radius |
| `paddingAngle` | `number` | Gap between slices |
| `startAngle` | `number` | Start angle in degrees |
| `endAngle` | `number` | End angle in degrees |

---

## Color Tokens

Common Chakra color tokens used in charts:

- `teal.solid`, `blue.solid`, `purple.solid`, `orange.solid`, `pink.solid`, `green.solid`
- `teal.subtle`, `blue.subtle`, etc. (lighter versions)
- `border`, `border.muted`, `border.emphasized`
- `bg.muted`
- `red.fg`, `red.muted`

---

## Sources

- [Chakra UI Charts Installation](https://chakra-ui.com/docs/charts/installation)
- [useChart Hook](https://chakra-ui.com/docs/charts/use-chart)
- [GitHub: chakra-ui/chakra-ui](https://github.com/chakra-ui/chakra-ui)
- [Recharts Documentation](https://recharts.org/)
