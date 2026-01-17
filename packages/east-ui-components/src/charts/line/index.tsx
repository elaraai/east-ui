/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Chart, useChart } from "@chakra-ui/charts";
import { Line, LineChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, Brush, ReferenceLine, ReferenceDot, ReferenceArea, type LineProps } from "recharts";
import { equalFor, variant, type ValueTypeOf } from "@elaraai/east";
import { Chart as EastChart } from "@elaraai/east-ui";
import type { LineChartSeriesType } from "@elaraai/east-ui/internal";
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
    calculateChartMargin,
    toRechartsBrush,
    createTickFormatter,
    toRechartsReferenceLine,
    toRechartsReferenceDot,
    toRechartsReferenceArea,
    type ChartSeriesItem,
    type ChartSeriesValue,
} from "../utils";

// Pre-define the equality function at module level
const lineChartEqual = equalFor(EastChart.Types.LineChart);

/** East LineChart value type */
export type LineChartValue = ValueTypeOf<typeof EastChart.Types.LineChart>;

/** East LineChartSeries value type */
export type LineChartSeriesValue = ValueTypeOf<LineChartSeriesType>;

/** Extended series item with line-specific properties */
type LineSeriesItem = ChartSeriesItem & {
    strokeWidth?: number | undefined;
    strokeDasharray?: string | undefined;
    showDots?: boolean | undefined;
    showLine?: boolean | undefined;
};

export interface EastChakraLineChartProps {
    value: LineChartValue;
}

/**
 * Renders an East UI LineChart value using Chakra UI Charts.
 */
export const EastChakraLineChart = memo(function EastChakraLineChart({ value }: EastChakraLineChartProps) {
    // Extract xAxis dataKey for data conversion and brush
    const xAxisDataKey = useMemo(() => {
        const xAxis = getSomeorUndefined(value.xAxis);
        return xAxis ? getSomeorUndefined(xAxis.dataKey) : undefined;
    }, [value.xAxis]);

    // Map line series to ChartSeriesValue by adding missing fill/fillOpacity with none values
    const eastSeries: ChartSeriesValue[] = useMemo(() => value.series.map(s => ({
        ...s,
        fill: variant("none", null),
        fillOpacity: variant("none", null),
    })), [value.series]);

    // Prepare chart data and series (handles pivot, multi-series, and regular modes)
    const { data: chartData, series: baseSeries } = useMemo(() => prepareChartData({
        rawData: value.data,
        dataSeries: getSomeorUndefined(value.dataSeries),
        xAxisKey: xAxisDataKey,
        valueKey: getSomeorUndefined(value.valueKey),
        pivotKey: getSomeorUndefined(value.pivotKey),
        eastSeries,
    }), [value.data, value.dataSeries, value.valueKey, value.pivotKey, eastSeries, xAxisDataKey]);

    // Enhance base series with line-specific properties from East config
    const series = useMemo((): LineSeriesItem[] => {
        return baseSeries.map(s => {
            const eastConfig = value.series.find(es => es.name === s.name);
            if (!eastConfig) return s as LineSeriesItem;

            const enhanced: LineSeriesItem = { ...s };
            const strokeWidth = getSomeorUndefined(eastConfig.strokeWidth);
            const strokeDasharray = getSomeorUndefined(eastConfig.strokeDasharray);
            const showDots = getSomeorUndefined(eastConfig.showDots);
            const showLine = getSomeorUndefined(eastConfig.showLine);
            const yAxisId = getSomeorUndefined(eastConfig.yAxisId);

            if (strokeWidth !== undefined) enhanced.strokeWidth = Number(strokeWidth);
            if (strokeDasharray !== undefined) enhanced.strokeDasharray = strokeDasharray;
            if (showDots !== undefined) enhanced.showDots = showDots;
            if (showLine !== undefined) enhanced.showLine = showLine;
            if (yAxisId !== undefined) enhanced.yAxisId = yAxisId.type as "left" | "right";

            return enhanced;
        });
    }, [baseSeries, value.series]);

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
        const strokeWidth = getSomeorUndefined(value.strokeWidth);
        return {
            curveType: getSomeorUndefined(value.curveType)?.type ?? "linear",
            showDots: getSomeorUndefined(value.showDots) ?? true,
            strokeWidth: strokeWidth !== undefined ? Number(strokeWidth) : 2,
            connectNulls: getSomeorUndefined(value.connectNulls) ?? false,
        };
    }, [value.curveType, value.showDots, value.strokeWidth, value.connectNulls]);

    // Reference annotations
    const references = useMemo(() => ({
        lines: getSomeorUndefined(value.referenceLines)?.map(toRechartsReferenceLine) ?? [],
        dots: getSomeorUndefined(value.referenceDots)?.map(toRechartsReferenceDot) ?? [],
        areas: getSomeorUndefined(value.referenceAreas)?.map(toRechartsReferenceArea) ?? [],
    }), [value.referenceLines, value.referenceDots, value.referenceAreas]);

    return (
        <Chart.Root chart={chart} maxW="full" maxH="full">
            <LineChart data={chart.data} margin={layout.margin}>
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
                {series.map((item) => (
                    <Line
                        key={item.name as string}
                        type={options.curveType as NonNullable<LineProps["type"]>}
                        dataKey={chart.key(item.name)}
                        stroke={(item.showLine ?? true) ? chart.color(item.color) : "transparent"}
                        strokeWidth={item.strokeWidth ?? options.strokeWidth}
                        strokeDasharray={item.strokeDasharray}
                        dot={item.showDots ?? options.showDots}
                        connectNulls={options.connectNulls}
                        isAnimationActive={false}
                        {...(yAxis2.show && { yAxisId: item.yAxisId ?? "left" })}
                    />
                ))}
                {references.areas.map((props, i) => (
                    <ReferenceArea key={`area-${i}`} {...props} />
                ))}
                {references.lines.map((props, i) => (
                    <ReferenceLine key={`line-${i}`} {...props} />
                ))}
                {references.dots.map((props, i) => (
                    <ReferenceDot key={`dot-${i}`} {...props} />
                ))}
            </LineChart>
        </Chart.Root>
    );
}, (prev, next) => lineChartEqual(prev.value, next.value));
