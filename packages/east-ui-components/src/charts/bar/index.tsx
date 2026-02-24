/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Chart, useChart } from "@chakra-ui/charts";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, Brush, ReferenceLine, ReferenceDot, ReferenceArea } from "recharts";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
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
} from "../utils";

// Pre-define the equality function at module level
const barChartEqual = equalFor(EastChart.Types.BarChart);

/** East BarChart value type */
export type BarChartValue = ValueTypeOf<typeof EastChart.Types.BarChart>;

export interface EastChakraBarChartProps {
    value: BarChartValue;
}

/**
 * Renders an East UI BarChart value using Chakra UI Charts.
 */
export const EastChakraBarChart = memo(function EastChakraBarChart({ value }: EastChakraBarChartProps) {
    // Extract xAxis dataKey for data conversion and brush
    const xAxisDataKey = useMemo(() => {
        const xAxis = getSomeorUndefined(value.xAxis);
        return xAxis ? getSomeorUndefined(xAxis.dataKey) : undefined;
    }, [value.xAxis]);

    // Prepare chart data and series (handles pivot, multi-series, and regular modes)
    const { data: chartData, series, layerIndexMap } = useMemo(() => prepareChartData({
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

    // Chart-specific options
    const options = useMemo(() => {
        const barSize = getSomeorUndefined(value.barSize);
        const barGap = getSomeorUndefined(value.barGap);
        const radius = getSomeorUndefined(value.radius);
        return {
            layout: getSomeorUndefined(value.layout)?.type ?? "horizontal",
            stacked: getSomeorUndefined(value.stacked) ?? false,
            stackOffset: getSomeorUndefined(value.stackOffset)?.type,
            barSize: barSize !== undefined ? Number(barSize) : undefined,
            barGap: barGap !== undefined ? Number(barGap) : undefined,
            radius: radius !== undefined ? Number(radius) : 0,
        };
    }, [value.layout, value.stacked, value.stackOffset, value.barSize, value.barGap, value.radius]);

    // Reference annotations
    const references = useMemo(() => ({
        lines: getSomeorUndefined(value.referenceLines)?.map(toRechartsReferenceLine) ?? [],
        dots: getSomeorUndefined(value.referenceDots)?.map(toRechartsReferenceDot) ?? [],
        areas: getSomeorUndefined(value.referenceAreas)?.map(toRechartsReferenceArea) ?? [],
    }), [value.referenceLines, value.referenceDots, value.referenceAreas]);

    const defaultStackId = options.stacked ? "stack" : undefined;

    return (
        <Chart.Root chart={chart} w="full" h="full">
            <BarChart
                data={chart.data}
                layout={options.layout}
                {...(options.stackOffset && { stackOffset: options.stackOffset })}
                {...(options.barSize && { barSize: options.barSize })}
                {...(options.barGap !== undefined && { barGap: options.barGap })}
                margin={layout.margin}
            >
                {grid.show && <CartesianGrid {...grid.props} />}
                {!xAxis.props.hide && (
                    <XAxis
                        {...xAxis.props}
                        {...(options.layout === "vertical" && { type: "number" })}
                        {...(xAxis.tickFormatter && { tickFormatter: xAxis.tickFormatter })}
                    />
                )}
                {!yAxis.props.hide && (
                    <YAxis
                        {...yAxis.props}
                        {...(yAxis2.show && { yAxisId: "left" })}
                        {...(options.layout === "vertical" && { type: "category" })}
                        {...(yAxis.tickFormatter && { tickFormatter: yAxis.tickFormatter })}
                    />
                )}
                {yAxis2.show && !yAxis2.props.hide && (
                    <YAxis
                        {...yAxis2.props}
                        {...(options.layout === "vertical" && { type: "category" })}
                        {...(yAxis2.tickFormatter && { tickFormatter: yAxis2.tickFormatter })}
                    />
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
                {[...chart.series]
                    .sort((a, b) => (layerIndexMap.get(a.name as string) ?? 0) - (layerIndexMap.get(b.name as string) ?? 0))
                    .map((item, index) => {
                    const stackId = (item as { stackId?: string }).stackId ?? defaultStackId;
                    const seriesConfig = value.series.find(s => s.name === item.name);
                    const yAxisId = seriesConfig ? getSomeorUndefined(seriesConfig.yAxisId) : undefined;
                    const zIndex = layerIndexMap.get(item.name as string) ?? index;

                    return (
                        <Bar
                            key={item.name as string}
                            dataKey={chart.key(item.name)}
                            fill={chart.color(item.color)}
                            stroke={chart.color(item.color)}
                            isAnimationActive={false}
                            {...(stackId && { stackId })}
                            radius={options.radius}
                            zIndex={zIndex}
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
            </BarChart>
        </Chart.Root>
    );
}, (prev, next) => barChartEqual(prev.value, next.value));
