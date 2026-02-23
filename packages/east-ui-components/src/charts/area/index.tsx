/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Chart, useChart } from "@chakra-ui/charts";
import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, Brush, ReferenceLine, ReferenceDot, ReferenceArea, type AreaProps } from "recharts";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Chart as EastChart } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import {
    prepareChartData,
    convertRangeChartData,
    convertMultiSeriesRangeData,
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
} from "../utils";

// Pre-define the equality function at module level
const areaChartEqual = equalFor(EastChart.Types.AreaChart);

/** East AreaChart value type */
export type AreaChartValue = ValueTypeOf<typeof EastChart.Types.AreaChart>;

export interface EastChakraAreaChartProps {
    value: AreaChartValue;
}

/**
 * Renders an East UI AreaChart value using Chakra UI Charts.
 */
export const EastChakraAreaChart = memo(function EastChakraAreaChart({ value }: EastChakraAreaChartProps) {
    // Extract xAxis dataKey for data conversion and brush
    const xAxisDataKey = useMemo(() => {
        const xAxis = getSomeorUndefined(value.xAxis);
        return xAxis ? getSomeorUndefined(xAxis.dataKey) : undefined;
    }, [value.xAxis]);

    // Prepare chart data and series (handles pivot, multi-series, and regular modes)
    const { data: chartData, series, seriesOriginMap, layerIndexMap } = useMemo(() => prepareChartData({
        rawData: value.data,
        dataSeries: getSomeorUndefined(value.dataSeries),
        xAxisKey: xAxisDataKey,
        valueKey: getSomeorUndefined(value.valueKey),
        pivotKey: getSomeorUndefined(value.pivotKey),
        mappedSeries: value.series,
    }), [value.data, value.dataSeries, value.valueKey, value.pivotKey, value.series, xAxisDataKey]);

    // Initialize the chart hook
    const chart = useChart({ data: chartData, series });

    // X-axis configuration
    const xAxis = useMemo(() => {
        const axisValue = getSomeorUndefined(value.xAxis);
        if (!axisValue) return { props: {}, tickFormatter: undefined };
        const axisType = inferAxisType(value.data, xAxisDataKey);
        const props = toRechartsXAxis(axisValue, chart, axisType);
        const tickFormat = getAxisTickFormat(axisValue);
        return { props, tickFormatter: createTickFormatter(tickFormat, chart) };
    }, [value.xAxis, value.data, xAxisDataKey, chart]);

    // Y-axis configuration (primary, left)
    const yAxis = useMemo(() => {
        const axisValue = getSomeorUndefined(value.yAxis);
        if (!axisValue) return { props: {}, tickFormatter: undefined, show: true };
        const yAxisDataKey = getSomeorUndefined(axisValue.dataKey);
        const axisType = inferAxisType(value.data, yAxisDataKey);
        const props = toRechartsYAxis(axisValue, chart, axisType);
        const tickFormat = getAxisTickFormat(axisValue);
        return { props, tickFormatter: createTickFormatter(tickFormat, chart), show: true };
    }, [value.yAxis, value.data, chart]);

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

    // Chart-specific options
    const options = useMemo(() => ({
        curveType: getSomeorUndefined(value.curveType)?.type ?? "linear",
        fillOpacity: getSomeorUndefined(value.fillOpacity) ?? 0.2,
        connectNulls: getSomeorUndefined(value.connectNulls) ?? false,
        defaultStackId: getSomeorUndefined(value.stacked) ? "stack" : undefined,
        stackOffset: getSomeorUndefined(value.stackOffset)?.type,
    }), [value.curveType, value.fillOpacity, value.connectNulls, value.stacked, value.stackOffset]);

    // Reference annotations
    const references = useMemo(() => ({
        lines: getSomeorUndefined(value.referenceLines)?.map(toRechartsReferenceLine) ?? [],
        dots: getSomeorUndefined(value.referenceDots)?.map(toRechartsReferenceDot) ?? [],
        areas: getSomeorUndefined(value.referenceAreas)?.map(toRechartsReferenceArea) ?? [],
    }), [value.referenceLines, value.referenceDots, value.referenceAreas]);

    return (
        <Chart.Root chart={chart} w="full" h="full">
            <AreaChart
                data={chart.data}
                {...(options.stackOffset && { stackOffset: options.stackOffset })}
                margin={layout.margin}
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
                {references.areas.map((props, i) => (
                    <ReferenceArea key={`area-${i}`} {...props} />
                ))}
                {references.lines.map((props, i) => (
                    <ReferenceLine key={`line-${i}`} {...props} />
                ))}
                {references.dots.map((props, i) => (
                    <ReferenceDot key={`dot-${i}`} {...props} />
                ))}
                {[...chart.series]
                    .sort((a, b) => (layerIndexMap.get(a.name as string) ?? 0) - (layerIndexMap.get(b.name as string) ?? 0))
                    .map((item, index) => {
                    // Look up original East config using seriesOriginMap for pivot series
                    const originalName = seriesOriginMap.get(item.name as string) ?? item.name;
                    const eastConfig = value.series.find(s => s.name === originalName);
                    const zIndex = layerIndexMap.get(item.name as string) ?? index;

                    // Extract Recharts AreaProps from East config
                    const yAxisId = eastConfig ? getSomeorUndefined(eastConfig.yAxisId) : undefined;
                    const stackId = (item as { stackId?: string }).stackId ?? options.defaultStackId ?? "0";

                    return (
                        <Area
                            key={item.name as string}
                            type={options.curveType as NonNullable<AreaProps["type"]>}
                            dataKey={chart.key(item.name)}
                            fill={chart.color(item.color)}
                            fillOpacity={options.fillOpacity}
                            stroke={chart.color(item.color)}
                            strokeWidth={2}
                            connectNulls={options.connectNulls}
                            isAnimationActive={false}
                            stackId={stackId}
                            zIndex={zIndex}
                            {...(yAxis2.show && { yAxisId: yAxisId?.type ?? "left" })}
                        />
                    );
                })}
            </AreaChart>
        </Chart.Root>
    );
}, (prev, next) => areaChartEqual(prev.value, next.value));

// ============================================================================
// Area Range Chart
// ============================================================================

// Pre-define the equality function at module level
const areaRangeChartEqual = equalFor(EastChart.Types.AreaRangeChart);

/** East AreaRangeChart value type */
export type AreaRangeChartValue = ValueTypeOf<typeof EastChart.Types.AreaRangeChart>;

export interface EastChakraAreaRangeChartProps {
    value: AreaRangeChartValue;
}

/**
 * Renders an East UI AreaRangeChart value using Chakra UI Charts.
 *
 * @remarks
 * Area range charts display bands between two values (low/high).
 * Each Area component uses a dataKey that returns [low, high] array.
 */
export const EastChakraAreaRangeChart = memo(function EastChakraAreaRangeChart({ value }: EastChakraAreaRangeChartProps) {
    // Extract xAxis dataKey
    const xAxisDataKey = useMemo(() => {
        const xAxis = getSomeorUndefined(value.xAxis);
        return xAxis ? getSomeorUndefined(xAxis.dataKey) : undefined;
    }, [value.xAxis]);

    // Convert East data to range chart format
    const chartData = useMemo(() => {
        const dataSeries = getSomeorUndefined(value.dataSeries);
        const lowKey = getSomeorUndefined(value.lowKey);
        const highKey = getSomeorUndefined(value.highKey);

        if (dataSeries && xAxisDataKey && lowKey && highKey) {
            return convertMultiSeriesRangeData(dataSeries, xAxisDataKey, lowKey, highKey);
        }
        // Convert series to the format expected by convertRangeChartData
        const rangeSeriesConfig = value.series.map(s => ({
            name: s.name,
            lowKey: s.lowKey,
            highKey: s.highKey,
        }));
        return convertRangeChartData(value.data, rangeSeriesConfig);
    }, [value.data, value.dataSeries, value.lowKey, value.highKey, value.series, xAxisDataKey]);

    // Convert series to chart format
    const series = useMemo(() => value.series.map(s => ({
        name: s.name,
        color: getSomeorUndefined(s.color) ?? "gray.solid",
        label: getSomeorUndefined(s.label),
    })), [value.series]);

    // Initialize the chart hook
    const chart = useChart({ data: chartData, series });

    // X-axis configuration
    const xAxis = useMemo(() => {
        const axisValue = getSomeorUndefined(value.xAxis);
        if (!axisValue) return { props: {}, tickFormatter: undefined };
        const axisType = inferAxisType(value.data, xAxisDataKey);
        const props = toRechartsXAxis(axisValue, chart, axisType);
        const tickFormat = getAxisTickFormat(axisValue);
        return { props, tickFormatter: createTickFormatter(tickFormat, chart) };
    }, [value.xAxis, value.data, xAxisDataKey, chart]);

    // Y-axis configuration (primary, left)
    const yAxis = useMemo(() => {
        const axisValue = getSomeorUndefined(value.yAxis);
        if (!axisValue) return { props: {}, tickFormatter: undefined, show: true };
        const yAxisDataKey = getSomeorUndefined(axisValue.dataKey);
        const axisType = inferAxisType(value.data, yAxisDataKey);
        const props = toRechartsYAxis(axisValue, chart, axisType);
        const tickFormat = getAxisTickFormat(axisValue);
        return { props, tickFormatter: createTickFormatter(tickFormat, chart), show: true };
    }, [value.yAxis, value.data, chart]);

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

    // Layout: margin
    const layout = useMemo(() => {
        const marginValue = getSomeorUndefined(value.margin);
        const xAxisValue = getSomeorUndefined(value.xAxis);
        const hasXAxisLabel = xAxisValue ? getSomeorUndefined(xAxisValue.label) !== undefined : false;
        return {
            margin: calculateChartMargin(marginValue, hasXAxisLabel, false),
        };
    }, [value.margin, value.xAxis]);

    // Chart-specific options
    const options = useMemo(() => ({
        curveType: getSomeorUndefined(value.curveType)?.type ?? "linear",
        fillOpacity: getSomeorUndefined(value.fillOpacity) ?? 0.4,
        connectNulls: getSomeorUndefined(value.connectNulls) ?? false,
    }), [value.curveType, value.fillOpacity, value.connectNulls]);

    // Reference annotations
    const references = useMemo(() => ({
        lines: getSomeorUndefined(value.referenceLines)?.map(toRechartsReferenceLine) ?? [],
        dots: getSomeorUndefined(value.referenceDots)?.map(toRechartsReferenceDot) ?? [],
        areas: getSomeorUndefined(value.referenceAreas)?.map(toRechartsReferenceArea) ?? [],
    }), [value.referenceLines, value.referenceDots, value.referenceAreas]);

    return (
        <Chart.Root chart={chart} w="full" h="full">
            <AreaChart
                data={chart.data}
                margin={layout.margin}
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

                {chart.series.map((item) => {
                    const seriesConfig = value.series.find(s => s.name === item.name);
                    const fillOpacity = seriesConfig ? getSomeorUndefined(seriesConfig.fillOpacity) ?? options.fillOpacity : options.fillOpacity;
                    const strokeWidthValue = seriesConfig ? getSomeorUndefined(seriesConfig.strokeWidth) : undefined;
                    const strokeWidth = strokeWidthValue !== undefined ? Number(strokeWidthValue) : 2;
                    const strokeColor = seriesConfig ? getSomeorUndefined(seriesConfig.stroke) : undefined;
                    const yAxisId = seriesConfig ? getSomeorUndefined(seriesConfig.yAxisId) : undefined;

                    return (
                        <Area
                            key={item.name as string}
                            type={options.curveType as NonNullable<AreaProps["type"]>}
                            dataKey={item.name as string}
                            fill={chart.color(item.color)}
                            fillOpacity={fillOpacity}
                            stroke={strokeColor ? chart.color(strokeColor) : chart.color(item.color)}
                            strokeWidth={strokeWidth}
                            connectNulls={options.connectNulls}
                            isAnimationActive={false}
                            {...(yAxis2.show && { yAxisId: yAxisId?.type ?? "left" })}
                        />
                    );
                })}
                {references.areas.map((props, i) => (
                    <ReferenceArea key={`area-${i}`} {...props} />
                ))}
                {references.lines.map((props, i) => (
                    <ReferenceLine key={`line-${i}`} {...props} />
                ))}
                {references.dots.map((props, i) => (
                    <ReferenceDot key={`dot-${i}`} {...props} />
                ))}
            </AreaChart>
        </Chart.Root>
    );
}, (prev, next) => areaRangeChartEqual(prev.value, next.value));
