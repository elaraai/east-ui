/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Chart, useChart } from "@chakra-ui/charts";
import {
    ComposedChart,
    Line,
    Area,
    Bar,
    Scatter,
    CartesianGrid,
    Legend,
    Tooltip,
    XAxis,
    YAxis,
    Brush,
    ReferenceLine,
    ReferenceDot,
    ReferenceArea,
    type LineProps,
    type AreaProps,
} from "recharts";
import { equalFor, match, none, type ValueTypeOf } from "@elaraai/east";
import { Chart as EastChart } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import {
    prepareChartData,
    inferAxisType,
    toRechartsXAxis,
    toRechartsYAxis,
    getAxisTickFormat,
    toRechartsCartesianGrid,
    shouldShowGrid,
    toRechartsLegend,
    shouldShowLegend,
    toRechartsTooltip,
    shouldShowTooltip,
    calculateChartMargin,
    toRechartsBrush,
    createTickFormatter,
    toRechartsReferenceLine,
    toRechartsReferenceDot,
    toRechartsReferenceArea,
    type ChartSeriesItem,
} from "../utils";

// Pre-define the equality function at module level
const composedChartEqual = equalFor(EastChart.Types.ComposedChart);

/** East ComposedChart value type */
export type ComposedChartValue = ValueTypeOf<typeof EastChart.Types.ComposedChart>;

/** Extended series item with chart type and type-specific properties */
interface ComposedSeriesItem extends ChartSeriesItem {
    chartType: "line" | "area" | "areaRange" | "bar" | "scatter";
    // Per-series data key (for multi-series with different field names)
    dataKey?: string;
    // Line-specific
    strokeWidth?: number;
    strokeDasharray?: string;
    showDots?: boolean;
    showLine?: boolean;
    // Area/Bar-specific
    fill?: string;
    fillOpacity?: number;
    // AreaRange-specific
    lowKey?: string;
    highKey?: string;
    // Axis binding
    yAxisId?: "left" | "right";
}

/**
 * Converts an East composed series variant to props for the chart.
 */
function toComposedSeriesItem(seriesVariant: ValueTypeOf<typeof EastChart.Types.ComposedSeries>): ComposedSeriesItem {
    return match(seriesVariant, {
        line: (v) => {
            const result: ComposedSeriesItem = {
                chartType: "line",
                name: v.name,
                color: getSomeorUndefined(v.color) ?? "teal.solid",
            };
            const dataKey = getSomeorUndefined(v.dataKey);
            const stackId = getSomeorUndefined(v.stackId);
            const label = getSomeorUndefined(v.label);
            const strokeWidth = getSomeorUndefined(v.strokeWidth);
            const strokeDasharray = getSomeorUndefined(v.strokeDasharray);
            const showDots = getSomeorUndefined(v.showDots);
            const showLine = getSomeorUndefined(v.showLine);
            const yAxisId = getSomeorUndefined(v.yAxisId);

            if (dataKey !== undefined) result.dataKey = dataKey;
            if (stackId !== undefined) result.stackId = stackId;
            if (label !== undefined) result.label = label;
            if (strokeWidth !== undefined) result.strokeWidth = Number(strokeWidth);
            if (strokeDasharray !== undefined) result.strokeDasharray = strokeDasharray;
            if (showDots !== undefined) result.showDots = showDots;
            if (showLine !== undefined) result.showLine = showLine;
            if (yAxisId !== undefined) result.yAxisId = yAxisId.type as "left" | "right";

            return result;
        },
        area: (v) => {
            const result: ComposedSeriesItem = {
                chartType: "area",
                name: v.name,
                color: getSomeorUndefined(v.color) ?? "teal.solid",
            };
            const dataKey = getSomeorUndefined(v.dataKey);
            const stackId = getSomeorUndefined(v.stackId);
            const label = getSomeorUndefined(v.label);
            const strokeWidth = getSomeorUndefined(v.strokeWidth);
            const strokeDasharray = getSomeorUndefined(v.strokeDasharray);
            const fill = getSomeorUndefined(v.fill);
            const fillOpacity = getSomeorUndefined(v.fillOpacity);
            const yAxisId = getSomeorUndefined(v.yAxisId);

            if (dataKey !== undefined) result.dataKey = dataKey;
            if (stackId !== undefined) result.stackId = stackId;
            if (label !== undefined) result.label = label;
            if (strokeWidth !== undefined) result.strokeWidth = Number(strokeWidth);
            if (strokeDasharray !== undefined) result.strokeDasharray = strokeDasharray;
            if (fill !== undefined) result.fill = fill;
            if (fillOpacity !== undefined) result.fillOpacity = fillOpacity;
            if (yAxisId !== undefined) result.yAxisId = yAxisId.type as "left" | "right";

            return result;
        },
        areaRange: (v) => {
            const result: ComposedSeriesItem = {
                chartType: "areaRange",
                name: v.name,
                color: getSomeorUndefined(v.color) ?? "teal.solid",
                lowKey: v.lowKey,
                highKey: v.highKey,
            };
            const label = getSomeorUndefined(v.label);
            const strokeWidth = getSomeorUndefined(v.strokeWidth);
            const fillOpacity = getSomeorUndefined(v.fillOpacity);
            const yAxisId = getSomeorUndefined(v.yAxisId);

            if (label !== undefined) result.label = label;
            if (strokeWidth !== undefined) result.strokeWidth = Number(strokeWidth);
            if (fillOpacity !== undefined) result.fillOpacity = fillOpacity;
            if (yAxisId !== undefined) result.yAxisId = yAxisId.type as "left" | "right";

            return result;
        },
        bar: (v) => {
            const result: ComposedSeriesItem = {
                chartType: "bar",
                name: v.name,
                color: getSomeorUndefined(v.color) ?? "teal.solid",
            };
            const dataKey = getSomeorUndefined(v.dataKey);
            const stackId = getSomeorUndefined(v.stackId);
            const label = getSomeorUndefined(v.label);
            const strokeWidth = getSomeorUndefined(v.strokeWidth);
            const strokeDasharray = getSomeorUndefined(v.strokeDasharray);
            const fill = getSomeorUndefined(v.fill);
            const fillOpacity = getSomeorUndefined(v.fillOpacity);
            const yAxisId = getSomeorUndefined(v.yAxisId);

            if (dataKey !== undefined) result.dataKey = dataKey;
            if (stackId !== undefined) result.stackId = stackId;
            if (label !== undefined) result.label = label;
            if (strokeWidth !== undefined) result.strokeWidth = Number(strokeWidth);
            if (strokeDasharray !== undefined) result.strokeDasharray = strokeDasharray;
            if (fill !== undefined) result.fill = fill;
            if (fillOpacity !== undefined) result.fillOpacity = fillOpacity;
            if (yAxisId !== undefined) result.yAxisId = yAxisId.type as "left" | "right";

            return result;
        },
        scatter: (v) => {
            const result: ComposedSeriesItem = {
                chartType: "scatter",
                name: v.name,
                color: getSomeorUndefined(v.color) ?? "teal.solid",
            };
            const dataKey = getSomeorUndefined(v.dataKey);
            const label = getSomeorUndefined(v.label);
            const fill = getSomeorUndefined(v.fill);
            const fillOpacity = getSomeorUndefined(v.fillOpacity);
            const yAxisId = getSomeorUndefined(v.yAxisId);

            if (dataKey !== undefined) result.dataKey = dataKey;
            if (label !== undefined) result.label = label;
            if (fill !== undefined) result.fill = fill;
            if (fillOpacity !== undefined) result.fillOpacity = fillOpacity;
            if (yAxisId !== undefined) result.yAxisId = yAxisId.type as "left" | "right";

            return result;
        },
    });
}

export interface EastChakraComposedChartProps {
    value: ComposedChartValue;
}

/**
 * Renders an East UI ComposedChart value using Recharts ComposedChart.
 *
 * @remarks
 * Composed charts combine multiple chart types (Line, Area, Bar, Scatter)
 * in a single visualization. Each series specifies its chart type.
 */
export const EastChakraComposedChart = memo(function EastChakraComposedChart({ value }: EastChakraComposedChartProps) {
    // Extract xAxis dataKey for data conversion and brush
    const xAxisDataKey = useMemo(() => {
        const xAxis = getSomeorUndefined(value.xAxis);
        return xAxis ? getSomeorUndefined(xAxis.dataKey) : undefined;
    }, [value.xAxis]);

    // Convert series to composed format with chart type info
    const composedSeries = useMemo(() => value.series.map(toComposedSeriesItem), [value.series]);

    // Convert composed series variants to flat series for prepareChartData
    // Each variant (line, area, bar, etc.) has name, color, pivotColors, layerIndex
    // We need to preserve the Option types as prepareChartData expects them
    // Note: areaRange uses AreaRangeSeriesType which doesn't have pivotColors/layerIndex
    const flatSeries = useMemo(() => value.series.map(sv => {
        return match(sv, {
            line: v => ({ name: v.name, color: v.color, pivotColors: v.pivotColors, layerIndex: v.layerIndex }),
            area: v => ({ name: v.name, color: v.color, pivotColors: v.pivotColors, layerIndex: v.layerIndex }),
            areaRange: v => ({ name: v.name, color: v.color, pivotColors: none, layerIndex: none }),
            bar: v => ({ name: v.name, color: v.color, pivotColors: v.pivotColors, layerIndex: v.layerIndex }),
            scatter: v => ({ name: v.name, color: v.color, pivotColors: v.pivotColors, layerIndex: v.layerIndex }),
        });
    }), [value.series]);

    // Build series field configs for each series
    // - Area-range: { type: 'range', lowKey, highKey }
    // - Others: { type: 'value', key: dataKey } when dataKey is specified
    const seriesFieldConfigs = useMemo(() => {
        const configs = new Map<string, { type: 'value'; key: string } | { type: 'range'; lowKey: string; highKey: string }>();
        for (const s of composedSeries) {
            if (s.chartType === 'areaRange' && s.lowKey && s.highKey) {
                configs.set(s.name as string, { type: 'range', lowKey: s.lowKey, highKey: s.highKey });
            } else if (s.dataKey) {
                configs.set(s.name as string, { type: 'value', key: s.dataKey });
            }
        }
        return configs.size > 0 ? configs : undefined;
    }, [composedSeries]);

    // Prepare chart data and series (handles pivot, multi-series, and regular modes)
    const { data: chartData, series: baseSeries, seriesOriginMap, layerIndexMap } = useMemo(() => {
        const config = {
            rawData: value.data,
            dataSeries: getSomeorUndefined(value.dataSeries),
            xAxisKey: xAxisDataKey,
            valueKey: getSomeorUndefined(value.valueKey),
            pivotKey: getSomeorUndefined(value.pivotKey),
            mappedSeries: flatSeries as unknown as Parameters<typeof prepareChartData>[0]["mappedSeries"],
            seriesFieldConfigs,
        };
        return prepareChartData(config);
    }, [value.data, value.dataSeries, value.valueKey, value.pivotKey, flatSeries, xAxisDataKey, seriesFieldConfigs]);

    // Merge base series with composed series info for rendering
    // In pivot mode, baseSeries are generated from pivot values; otherwise they match composedSeries
    const chartSeries = useMemo((): ChartSeriesItem[] => {
        // If we have pivot-generated series, use them (they have colors from pivotColors)
        if (getSomeorUndefined(value.pivotKey)) {
            return baseSeries;
        }
        // Otherwise use composed series for rendering
        return composedSeries.map(s => {
            const item: ChartSeriesItem = {
                name: s.name as string,
                color: s.color,
            };
            if (s.stackId !== undefined) item.stackId = s.stackId;
            if (s.label !== undefined) item.label = s.label;
            return item;
        });
    }, [baseSeries, composedSeries, value.pivotKey]);

    // Initialize the chart hook
    const chart = useChart({ data: chartData, series: chartSeries });

    // X-axis configuration
    const xAxis = useMemo(() => {
        const axisValue = getSomeorUndefined(value.xAxis);
        if (!axisValue) return { props: {}, tickFormatter: undefined };
        const axisType = inferAxisType(value.data, xAxisDataKey, getSomeorUndefined(value.dataSeries));
        const props = toRechartsXAxis(axisValue, chart, axisType);
        const tickFormat = getAxisTickFormat(axisValue);
        return { props, tickFormatter: createTickFormatter(tickFormat, chart) };
    }, [value.xAxis, value.data, value.dataSeries, xAxisDataKey, chart]);

    // Y-axis configuration (primary, left)
    const yAxis = useMemo(() => {
        const axisValue = getSomeorUndefined(value.yAxis);
        if (!axisValue) return { props: {}, tickFormatter: undefined, show: true };
        const yAxisDataKey = getSomeorUndefined(axisValue.dataKey);
        const axisType = inferAxisType(value.data, yAxisDataKey, getSomeorUndefined(value.dataSeries));
        const props = toRechartsYAxis(axisValue, chart, axisType);
        const tickFormat = getAxisTickFormat(axisValue);
        return { props, tickFormatter: createTickFormatter(tickFormat, chart), show: true };
    }, [value.yAxis, value.data, value.dataSeries, chart]);

    // Y-axis2 configuration (secondary, right)
    const yAxis2 = useMemo(() => {
        const axisValue = getSomeorUndefined(value.yAxis2);
        if (!axisValue) return { props: { hide: true }, tickFormatter: undefined, show: false };
        const props = toRechartsYAxis(axisValue, chart);
        const tickFormat = getAxisTickFormat(axisValue);
        // Fix label position for right-side axis
        if (props.label && typeof props.label === "object") {
            props.label = { ...props.label, position: "insideRight" };
        }
        return {
            props: { ...props, yAxisId: "right", orientation: "right" as const },
            tickFormatter: createTickFormatter(tickFormat, chart),
            show: true,
        };
    }, [value.yAxis2, chart]);

    // Grid configuration
    const grid = useMemo(() => {
        const gridValue = getSomeorUndefined(value.grid);
        if (!gridValue) return { show: false, props: {} };
        return { show: shouldShowGrid(gridValue), props: toRechartsCartesianGrid(gridValue, chart) };
    }, [value.grid, chart]);

    // Legend configuration
    const legend = useMemo(() => {
        const legendValue = getSomeorUndefined(value.legend);
        if (!legendValue) return { show: false, props: {} };
        return { show: shouldShowLegend(legendValue), props: toRechartsLegend(legendValue) };
    }, [value.legend]);

    // Tooltip configuration (depends on axis formatters)
    const tooltip = useMemo(() => {
        const tooltipValue = getSomeorUndefined(value.tooltip);
        if (!tooltipValue) return { show: false, props: {} };
        return { show: shouldShowTooltip(tooltipValue), props: toRechartsTooltip(tooltipValue, xAxis.tickFormatter, yAxis.tickFormatter) };
    }, [value.tooltip, xAxis.tickFormatter, yAxis.tickFormatter]);

    // Layout: margin and brush
    const layout = useMemo(() => {
        const marginValue = getSomeorUndefined(value.margin);
        const brushValue = getSomeorUndefined(value.brush);
        const xAxisValue = getSomeorUndefined(value.xAxis);
        const hasXAxisLabel = xAxisValue ? getSomeorUndefined(xAxisValue.label) !== undefined : false;
        const hasBrush = brushValue !== undefined;
        return {
            margin: calculateChartMargin(marginValue, hasXAxisLabel, hasBrush),
            brush: brushValue ? toRechartsBrush(brushValue, xAxisDataKey) : null,
        };
    }, [value.margin, value.brush, value.xAxis, xAxisDataKey]);

    // Chart-level options
    const options = useMemo(() => {
        const barSize = getSomeorUndefined(value.barSize);
        const barGap = getSomeorUndefined(value.barGap);
        return {
            curveType: getSomeorUndefined(value.curveType)?.type ?? "linear",
            layout: getSomeorUndefined(value.layout)?.type ?? "horizontal",
            stackOffset: getSomeorUndefined(value.stackOffset)?.type,
            showDots: getSomeorUndefined(value.showDots) ?? true,
            connectNulls: getSomeorUndefined(value.connectNulls) ?? false,
            barSize: barSize !== undefined ? Number(barSize) : undefined,
            barGap: barGap !== undefined ? Number(barGap) : undefined,
        };
    }, [value.curveType, value.layout, value.stackOffset, value.showDots, value.connectNulls, value.barSize, value.barGap]);

    // Reference annotations
    const references = useMemo(() => ({
        lines: getSomeorUndefined(value.referenceLines)?.map(toRechartsReferenceLine) ?? [],
        dots: getSomeorUndefined(value.referenceDots)?.map(toRechartsReferenceDot) ?? [],
        areas: getSomeorUndefined(value.referenceAreas)?.map(toRechartsReferenceArea) ?? [],
    }), [value.referenceLines, value.referenceDots, value.referenceAreas]);

    // Render individual series based on chart type
    // Each series uses position-based z-index to respect declaration order
    // (Recharts assigns fixed z-index by chart type, so we override with position-based z-index)
    const renderSeries = () => {
        const isPivotMode = !!getSomeorUndefined(value.pivotKey);

        // In pivot mode, render from chartSeries (which has pivot-generated names like "revenue_North" or just "North")
        // and look up chart type from the original series name using seriesOriginMap
        if (isPivotMode) {
            return [...chartSeries]
                .sort((a, b) => (layerIndexMap.get(a.name as string) ?? 0) - (layerIndexMap.get(b.name as string) ?? 0))
                .map((seriesItem, index) => {
                const seriesName = seriesItem.name as string;
                // Use seriesOriginMap to find the original series name
                const originalName = seriesOriginMap.get(seriesName) ?? seriesName;
                const originalSeries = composedSeries.find(s => s.name === originalName);
                if (!originalSeries) return null;

                const dataKey = chart.key(seriesName);
                const color = chart.color(seriesItem.color);
                const fillColor = originalSeries.fill ? chart.color(originalSeries.fill) : color;
                const zIndex = layerIndexMap.get(seriesName) ?? index;

                switch (originalSeries.chartType) {
                    case "line":
                        return (
                            <Line
                                key={`line-${seriesName}`}
                                type={options.curveType as NonNullable<LineProps["type"]>}
                                dataKey={dataKey}
                                stroke={(originalSeries.showLine ?? true) ? color : "transparent"}
                                strokeWidth={originalSeries.strokeWidth ?? 2}
                                strokeDasharray={originalSeries.strokeDasharray}
                                dot={originalSeries.showDots ?? options.showDots}
                                connectNulls={options.connectNulls}
                                isAnimationActive={false}
                                zIndex={zIndex}
                                {...(yAxis2.show && { yAxisId: originalSeries.yAxisId ?? "left" })}
                            />
                        );
                    case "area":
                        return (
                            <Area
                                key={`area-${seriesName}`}
                                type={options.curveType as NonNullable<AreaProps["type"]>}
                                dataKey={dataKey}
                                fill={fillColor}
                                fillOpacity={originalSeries.fillOpacity ?? 0.2}
                                stroke={color}
                                strokeWidth={originalSeries.strokeWidth ?? 2}
                                connectNulls={options.connectNulls}
                                isAnimationActive={false}
                                zIndex={zIndex}
                                {...(originalSeries.strokeDasharray !== undefined && { strokeDasharray: originalSeries.strokeDasharray })}
                                {...(originalSeries.stackId !== undefined && { stackId: originalSeries.stackId })}
                                {...(yAxis2.show && { yAxisId: originalSeries.yAxisId ?? "left" })}
                            />
                        );
                    case "bar":
                        return (
                            <Bar
                                key={`bar-${seriesName}`}
                                dataKey={dataKey}
                                fill={fillColor}
                                fillOpacity={originalSeries.fillOpacity ?? 1}
                                stroke={color}
                                strokeWidth={originalSeries.strokeWidth ?? 0}
                                isAnimationActive={false}
                                zIndex={zIndex}
                                {...(originalSeries.stackId !== undefined && { stackId: originalSeries.stackId })}
                                {...(options.barSize !== undefined && { barSize: options.barSize })}
                                {...(yAxis2.show && { yAxisId: originalSeries.yAxisId ?? "left" })}
                            />
                        );
                    case "scatter":
                        return (
                            <Scatter
                                key={`scatter-${seriesName}`}
                                dataKey={dataKey}
                                fill={fillColor}
                                isAnimationActive={false}
                                zIndex={zIndex}
                                {...(yAxis2.show && { yAxisId: originalSeries.yAxisId ?? "left" })}
                            />
                        );
                    default:
                        return null;
                }
            });
        }

        // Non-pivot mode: use composedSeries directly, sorted by layerIndex
        return [...composedSeries]
            .sort((a, b) => (layerIndexMap.get(a.name as string) ?? 0) - (layerIndexMap.get(b.name as string) ?? 0))
            .map((item, index) => {
            const dataKey = chart.key(item.name);
            const color = chart.color(item.color);
            const fillColor = item.fill ? chart.color(item.fill) : color;
            const zIndex = layerIndexMap.get(item.name as string) ?? index;

            switch (item.chartType) {
                case "line":
                    return (
                        <Line
                            key={`line-${item.name}`}
                            type={options.curveType as NonNullable<LineProps["type"]>}
                            dataKey={dataKey}
                            stroke={(item.showLine ?? true) ? color : "transparent"}
                            strokeWidth={item.strokeWidth ?? 2}
                            strokeDasharray={item.strokeDasharray}
                            dot={item.showDots ?? options.showDots}
                            connectNulls={options.connectNulls}
                            isAnimationActive={false}
                            zIndex={zIndex}
                            {...(yAxis2.show && { yAxisId: item.yAxisId ?? "left" })}
                        />
                    );

                case "area":
                    return (
                        <Area
                            key={`area-${item.name}`}
                            type={options.curveType as NonNullable<AreaProps["type"]>}
                            dataKey={dataKey}
                            fill={fillColor}
                            fillOpacity={item.fillOpacity ?? 0.2}
                            stroke={color}
                            strokeWidth={item.strokeWidth ?? 2}
                            connectNulls={options.connectNulls}
                            isAnimationActive={false}
                            zIndex={zIndex}
                            {...(item.strokeDasharray !== undefined && { strokeDasharray: item.strokeDasharray })}
                            {...(item.stackId !== undefined && { stackId: item.stackId })}
                            {...(yAxis2.show && { yAxisId: item.yAxisId ?? "left" })}
                        />
                    );

                case "areaRange":
                    // For area range, the dataKey should return [low, high] array
                    // The data should already have the series name as a key with [low, high] values
                    return (
                        <Area
                            key={`areaRange-${item.name}`}
                            type={options.curveType as NonNullable<AreaProps["type"]>}
                            dataKey={item.name as string}
                            fill={fillColor}
                            fillOpacity={item.fillOpacity ?? 0.4}
                            stroke={color}
                            strokeWidth={item.strokeWidth ?? 2}
                            connectNulls={options.connectNulls}
                            isAnimationActive={false}
                            zIndex={zIndex}
                            {...(yAxis2.show && { yAxisId: item.yAxisId ?? "left" })}
                        />
                    );

                case "bar":
                    return (
                        <Bar
                            key={`bar-${item.name}`}
                            dataKey={dataKey}
                            fill={fillColor}
                            fillOpacity={item.fillOpacity ?? 1}
                            stroke={color}
                            strokeWidth={item.strokeWidth ?? 0}
                            isAnimationActive={false}
                            zIndex={zIndex}
                            {...(item.stackId !== undefined && { stackId: item.stackId })}
                            {...(options.barSize !== undefined && { barSize: options.barSize })}
                            {...(yAxis2.show && { yAxisId: item.yAxisId ?? "left" })}
                        />
                    );

                case "scatter":
                    return (
                        <Scatter
                            key={`scatter-${item.name}`}
                            dataKey={dataKey}
                            fill={fillColor}
                            isAnimationActive={false}
                            zIndex={zIndex}
                            {...(yAxis2.show && { yAxisId: item.yAxisId ?? "left" })}
                        />
                    );

                default:
                    return null;
            }
        });
    };

    return (
        <Chart.Root chart={chart} w="full" h="full">
            <ComposedChart
                data={chart.data}
                layout={options.layout as "horizontal" | "vertical"}
                margin={layout.margin}
                {...(options.stackOffset && { stackOffset: options.stackOffset })}
                {...(options.barGap !== undefined && { barGap: options.barGap })}
            >
                {grid.show && <CartesianGrid {...grid.props} />}
                {!xAxis.props.hide && (
                    <XAxis {...xAxis.props} {...(xAxis.tickFormatter && { tickFormatter: xAxis.tickFormatter })} />
                )}
                {!yAxis.props.hide && (
                    <YAxis
                        {...yAxis.props}
                        {...(yAxis2.show && { yAxisId: "left" })}
                        {...(yAxis.tickFormatter && { tickFormatter: yAxis.tickFormatter })}
                    />
                )}
                {yAxis2.show && !yAxis2.props.hide && (
                    <YAxis {...yAxis2.props} {...(yAxis2.tickFormatter && { tickFormatter: yAxis2.tickFormatter })} />
                )}
                {tooltip.show && <Tooltip {...tooltip.props} content={<Chart.Tooltip />} />}
                {legend.show && <Legend {...legend.props} content={<Chart.Legend />} />}
                {layout.brush &&
                    <Brush
                        {...layout.brush}
                        {...(xAxis.tickFormatter && { tickFormatter: xAxis.tickFormatter })}
                        travellerWidth={10}
                        traveller={(props) => <rect
                            x={props.x}
                            y={props.y}
                            width={props.width}
                            height={props.height}
                            fill="#666"
                            rx={2}
                            ry={2}
                        />}
                    />
                }
                {renderSeries()}
                {references.areas.map((props, i) => (
                    <ReferenceArea key={`refArea-${i}`} {...props} zIndex={1000 + 10 * (composedSeries.length + i)} />
                ))}
                {references.lines.map((props, i) => (
                    <ReferenceLine key={`refLine-${i}`} {...props} zIndex={1000 + 10 * (composedSeries.length + references.areas.length + i)} />
                ))}
                {references.dots.map((props, i) => (
                    <ReferenceDot key={`refDot-${i}`} {...props} zIndex={1000 + 10 * (composedSeries.length + references.areas.length + references.lines.length + i)} />
                ))}
            </ComposedChart>
        </Chart.Root>
    );
}, (prev, next) => composedChartEqual(prev.value, next.value));
