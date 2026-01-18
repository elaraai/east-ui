/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Chart, useChart } from "@chakra-ui/charts";
import { Scatter, ScatterChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, ReferenceLine, ReferenceDot, ReferenceArea } from "recharts";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Chart as EastChart } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import {
    prepareChartData,
    toRechartsXAxis,
    toRechartsYAxis,
    getAxisTickFormat,
    toRechartsCartesianGrid,
    shouldShowGrid,
    toRechartsLegend,
    shouldShowLegend,
    toRechartsTooltip,
    shouldShowTooltip,
    toRechartsMargin,
    DEFAULT_CHART_MARGIN,
    createTickFormatter,
    toRechartsReferenceLine,
    toRechartsReferenceDot,
    toRechartsReferenceArea,
} from "../utils";

// Pre-define the equality function at module level
const scatterChartEqual = equalFor(EastChart.Types.ScatterChart);

/** East ScatterChart value type */
export type ScatterChartValue = ValueTypeOf<typeof EastChart.Types.ScatterChart>;

export interface EastChakraScatterChartProps {
    value: ScatterChartValue;
}

/**
 * Renders an East UI ScatterChart value using Chakra UI Charts.
 */
export const EastChakraScatterChart = memo(function EastChakraScatterChart({ value }: EastChakraScatterChartProps) {
    // Extract xDataKey for data conversion (prefer top-level xDataKey, fallback to xAxis.dataKey)
    const xDataKey = useMemo(() => {
        const topLevel = getSomeorUndefined(value.xDataKey);
        if (topLevel) return topLevel;
        const xAxis = getSomeorUndefined(value.xAxis);
        return xAxis ? getSomeorUndefined(xAxis.dataKey) : undefined;
    }, [value.xDataKey, value.xAxis]);

    // Extract yDataKey (prefer top-level yDataKey, then valueKey for multi-series, fallback to yAxis.dataKey)
    const yDataKey = useMemo(() => {
        const topLevel = getSomeorUndefined(value.yDataKey);
        if (topLevel) return topLevel;
        const valueKey = getSomeorUndefined(value.valueKey);
        if (valueKey) return valueKey;
        const yAxis = getSomeorUndefined(value.yAxis);
        return yAxis ? getSomeorUndefined(yAxis.dataKey) : undefined;
    }, [value.yDataKey, value.valueKey, value.yAxis]);

    // Check for multi-series mode
    const isMultiSeries = useMemo(() => {
        return getSomeorUndefined(value.dataSeries) !== undefined;
    }, [value.dataSeries]);

    // Prepare chart data and series (handles pivot, multi-series, and regular modes)
    const { data: chartData, series } = useMemo(() => prepareChartData({
        rawData: value.data,
        dataSeries: getSomeorUndefined(value.dataSeries),
        xAxisKey: xDataKey,
        valueKey: getSomeorUndefined(value.valueKey),
        pivotKey: getSomeorUndefined(value.pivotKey),
        mappedSeries: value.series,
    }), [value.data, value.dataSeries, value.valueKey, value.pivotKey, value.series, xDataKey]);

    // Initialize the chart hook
    const chart = useChart({ data: chartData, series });

    // X-axis configuration
    const xAxis = useMemo(() => {
        const axisValue = getSomeorUndefined(value.xAxis);
        if (!axisValue) return { props: {}, tickFormatter: undefined };
        const props = toRechartsXAxis(axisValue, chart);
        const tickFormat = getAxisTickFormat(axisValue);
        return { props, tickFormatter: createTickFormatter(tickFormat, chart) };
    }, [value.xAxis, chart]);

    // Y-axis configuration (primary, left)
    const yAxis = useMemo(() => {
        const axisValue = getSomeorUndefined(value.yAxis);
        if (!axisValue) return { props: {}, tickFormatter: undefined, show: true };
        const props = toRechartsYAxis(axisValue, chart);
        const tickFormat = getAxisTickFormat(axisValue);
        return { props, tickFormatter: createTickFormatter(tickFormat, chart), show: true };
    }, [value.yAxis, chart]);

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

    // Tooltip configuration
    const tooltip = useMemo(() => {
        const tooltipValue = getSomeorUndefined(value.tooltip);
        if (!tooltipValue) return { show: false, props: {} };
        return { show: shouldShowTooltip(tooltipValue), props: toRechartsTooltip(tooltipValue) };
    }, [value.tooltip]);

    // Layout: margin (note: brush is not supported for ScatterChart in Recharts)
    const margin = useMemo(() => {
        const marginValue = getSomeorUndefined(value.margin);
        return marginValue ? toRechartsMargin(marginValue) : DEFAULT_CHART_MARGIN;
    }, [value.margin]);

    // Multi-series handling: compute transformed data and axis dataKeys
    const scatterData = useMemo(() => {
        const needsTransform = isMultiSeries || chart.series.length > 1;
        if (!needsTransform || !xDataKey) {
            return {
                xAxisDataKey: xDataKey,
                yAxisDataKey: yDataKey ?? "y",
                seriesDataMap: null,
            };
        }
        const seriesDataMap = new Map<string, Array<{ x: unknown; y: unknown }>>();
        for (const item of chart.series) {
            const seriesName = item.name as string;
            seriesDataMap.set(
                seriesName,
                chart.data
                    .filter(d => d[seriesName] != null)
                    .map(d => ({ x: d[xDataKey], y: d[seriesName] }))
            );
        }
        return {
            xAxisDataKey: "x",
            yAxisDataKey: "y",
            seriesDataMap,
        };
    }, [isMultiSeries, chart.series, chart.data, xDataKey, yDataKey]);

    // Reference annotations
    const references = useMemo(() => ({
        lines: getSomeorUndefined(value.referenceLines)?.map(toRechartsReferenceLine) ?? [],
        dots: getSomeorUndefined(value.referenceDots)?.map(toRechartsReferenceDot) ?? [],
        areas: getSomeorUndefined(value.referenceAreas)?.map(toRechartsReferenceArea) ?? [],
    }), [value.referenceLines, value.referenceDots, value.referenceAreas]);

    return (
        <Chart.Root chart={chart} maxW="full" maxH="full">
            <ScatterChart data={chart.data} margin={margin}>
                {grid.show && <CartesianGrid {...grid.props} />}
                {!xAxis.props.hide && scatterData.xAxisDataKey && (
                    <XAxis
                        {...xAxis.props}
                        type="number"
                        dataKey={scatterData.xAxisDataKey}
                        {...(xAxis.tickFormatter && { tickFormatter: xAxis.tickFormatter })}
                    />
                )}
                {!yAxis.props.hide && scatterData.yAxisDataKey && (
                    <YAxis
                        {...yAxis.props}
                        type="number"
                        dataKey={scatterData.yAxisDataKey}
                        {...(yAxis2.show && { yAxisId: "left" })}
                        {...(yAxis.tickFormatter && { tickFormatter: yAxis.tickFormatter })}
                    />
                )}
                {yAxis2.show && !yAxis2.props.hide && (
                    <YAxis
                        {...yAxis2.props}
                        type="number"
                        dataKey={scatterData.yAxisDataKey}
                        {...(yAxis2.tickFormatter && { tickFormatter: yAxis2.tickFormatter })}
                    />
                )}
                {tooltip.show && <Tooltip {...tooltip.props} content={<Chart.Tooltip />} />}
                {legend.show && <Legend {...legend.props} content={<Chart.Legend />} />}

                {chart.series.map((item) => {
                    const seriesName = item.name as string;
                    const seriesConfig = value.series.find(s => s.name === seriesName);
                    const yAxisId = seriesConfig ? getSomeorUndefined(seriesConfig.yAxisId) : undefined;

                    return (
                        <Scatter
                            key={seriesName}
                            name={seriesName}
                            data={scatterData.seriesDataMap?.get(seriesName) ?? chart.data}
                            fill={chart.color(item.color)}
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
            </ScatterChart>
        </Chart.Root>
    );
}, (prev, next) => scatterChartEqual(prev.value, next.value));
