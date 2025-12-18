/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Chart, useChart } from "@chakra-ui/charts";
import { Line, LineChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, type LineProps } from "recharts";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Chart as EastChart } from "@elaraai/east-ui";
import type { LineChartSeriesType } from "@elaraai/east-ui/internal";
import { getSomeorUndefined } from "../../utils";
import {
    convertChartData,
    convertMultiSeriesData,
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
    createTickFormatter,
    type ChartSeriesItem,
} from "../utils";

// Pre-define the equality function at module level
const lineChartEqual = equalFor(EastChart.Types.LineChart);

/** East LineChart value type */
export type LineChartValue = ValueTypeOf<typeof EastChart.Types.LineChart>;

/** East LineChartSeries value type */
export type LineChartSeriesValue = ValueTypeOf<LineChartSeriesType>;

/** Extended series item with line-specific properties */
interface LineSeriesItem extends ChartSeriesItem {
    strokeWidth?: number;
    strokeDasharray?: string;
    showDots?: boolean;
    showLine?: boolean;
}

/**
 * Converts an East LineChartSeries value to props for Chakra useChart series.
 */
function toLineChartSeries(value: LineChartSeriesValue): LineSeriesItem {
    const result: LineSeriesItem = {
        name: value.name,
        color: getSomeorUndefined(value.color) ?? "teal.solid",
    };

    const stackId = getSomeorUndefined(value.stackId);
    const label = getSomeorUndefined(value.label);
    const strokeWidth = getSomeorUndefined(value.strokeWidth);
    const strokeDasharray = getSomeorUndefined(value.strokeDasharray);
    const showDots = getSomeorUndefined(value.showDots);
    const showLine = getSomeorUndefined(value.showLine);

    if (stackId !== undefined) result.stackId = stackId;
    if (label !== undefined) result.label = label;
    if (strokeWidth !== undefined) result.strokeWidth = Number(strokeWidth);
    if (strokeDasharray !== undefined) result.strokeDasharray = strokeDasharray;
    if (showDots !== undefined) result.showDots = showDots;
    if (showLine !== undefined) result.showLine = showLine;

    return result;
}

export interface EastChakraLineChartProps {
    value: LineChartValue;
}

/**
 * Renders an East UI LineChart value using Chakra UI Charts.
 */
export const EastChakraLineChart = memo(function EastChakraLineChart({ value }: EastChakraLineChartProps) {
    // Check if we have multi-series data (record form)
    const dataSeries = useMemo(() => getSomeorUndefined(value.dataSeries), [value.dataSeries]);
    const valueKey = useMemo(() => getSomeorUndefined(value.valueKey), [value.valueKey]);
    const xAxisDataKey = useMemo(() => {
        const xAxis = getSomeorUndefined(value.xAxis);
        return xAxis ? getSomeorUndefined(xAxis.dataKey) : undefined;
    }, [value.xAxis]);

    // Convert East data and series to chart format
    const chartData = useMemo(() => {
        if (dataSeries && xAxisDataKey && valueKey) {
            // Multi-series data: merge into single array
            return convertMultiSeriesData(dataSeries, xAxisDataKey, valueKey);
        }
        // Single array form: use existing conversion
        return convertChartData(value.data);
    }, [value.data, dataSeries, xAxisDataKey, valueKey]);

    const series = useMemo(() => value.series.map(toLineChartSeries), [value.series]);

    // Initialize the chart hook
    const chart = useChart({
        data: chartData,
        series,
    });

    // Extract option values for axis, grid, legend, tooltip, margin
    const xAxisValue = useMemo(() => getSomeorUndefined(value.xAxis), [value.xAxis]);
    const yAxisValue = useMemo(() => getSomeorUndefined(value.yAxis), [value.yAxis]);
    const gridValue = useMemo(() => getSomeorUndefined(value.grid), [value.grid]);
    const legendValue = useMemo(() => getSomeorUndefined(value.legend), [value.legend]);
    const tooltipValue = useMemo(() => getSomeorUndefined(value.tooltip), [value.tooltip]);
    const marginValue = useMemo(() => getSomeorUndefined(value.margin), [value.margin]);

    // Get axis props (only when values exist)
    const xAxisProps = useMemo(
        () => xAxisValue ? toRechartsXAxis(xAxisValue, chart) : {},
        [xAxisValue, chart]
    );
    const yAxisProps = useMemo(
        () => yAxisValue ? toRechartsYAxis(yAxisValue, chart) : {},
        [yAxisValue, chart]
    );

    // Get tick formatters
    const xAxisTickFormat = useMemo(
        () => xAxisValue ? getAxisTickFormat(xAxisValue) : undefined,
        [xAxisValue]
    );
    const yAxisTickFormat = useMemo(
        () => yAxisValue ? getAxisTickFormat(yAxisValue) : undefined,
        [yAxisValue]
    );
    const xAxisTickFormatter = useMemo(
        () => createTickFormatter(xAxisTickFormat, chart),
        [xAxisTickFormat, chart]
    );
    const yAxisTickFormatter = useMemo(
        () => createTickFormatter(yAxisTickFormat, chart),
        [yAxisTickFormat, chart]
    );

    // Get grid props
    const showGrid = useMemo(
        () => gridValue ? shouldShowGrid(gridValue) : false,
        [gridValue]
    );
    const gridProps = useMemo(
        () => gridValue ? toRechartsCartesianGrid(gridValue, chart) : {},
        [gridValue, chart]
    );

    // Get legend props
    const showLegend = useMemo(
        () => legendValue ? shouldShowLegend(legendValue) : false,
        [legendValue]
    );
    const legendProps = useMemo(
        () => legendValue ? toRechartsLegend(legendValue) : {},
        [legendValue]
    );

    // Get tooltip props
    const showTooltip = useMemo(
        () => tooltipValue ? shouldShowTooltip(tooltipValue) : false,
        [tooltipValue]
    );
    const tooltipProps = useMemo(
        () => tooltipValue ? toRechartsTooltip(tooltipValue) : {},
        [tooltipValue]
    );

    // Get margin props
    const margin = useMemo(
        () => marginValue
            ? toRechartsMargin(marginValue)
            : { top: 20, right: 30, left: 5, bottom: 5 },
        [marginValue]
    );

    // Get chart options (convert bigint to number where needed)
    const options = useMemo(() => {
        const strokeWidth = getSomeorUndefined(value.strokeWidth);
        return {
            curveType: getSomeorUndefined(value.curveType)?.type ?? "linear",
            showDots: getSomeorUndefined(value.showDots) ?? true,
            strokeWidth: strokeWidth !== undefined ? Number(strokeWidth) : 2,
            connectNulls: getSomeorUndefined(value.connectNulls) ?? false,
        };
    }, [value.curveType, value.showDots, value.strokeWidth, value.connectNulls]);

    return (
        <Chart.Root
            chart={chart}
            maxW="full"
            maxH="full"
        >
            <LineChart
                data={chart.data}
                margin={margin}
            >
                {showGrid && <CartesianGrid {...gridProps} />}
                {!xAxisProps.hide && (
                    <XAxis
                        {...xAxisProps}
                        {...(xAxisTickFormatter ? { tickFormatter: xAxisTickFormatter } : {})}
                    />
                )}
                {!yAxisProps.hide && (
                    <YAxis
                        {...yAxisProps}
                        {...(yAxisTickFormatter ? { tickFormatter: yAxisTickFormatter } : {})}
                    />
                )}
                {showTooltip && (
                    <Tooltip {...tooltipProps} content={<Chart.Tooltip />} />
                )}
                {showLegend && (
                    <Legend {...legendProps} content={<Chart.Legend />} />
                )}
                {series.map((item) => {
                    // Per-series values with global fallback
                    const seriesStrokeWidth = item.strokeWidth ?? options.strokeWidth;
                    const seriesShowDots = item.showDots ?? options.showDots;
                    const seriesShowLine = item.showLine ?? true;
                    const seriesStrokeDasharray = item.strokeDasharray;

                    return (
                        <Line
                            key={item.name as string}
                            type={options.curveType as NonNullable<LineProps["type"]>}
                            dataKey={chart.key(item.name)}
                            stroke={seriesShowLine ? chart.color(item.color) : "transparent"}
                            strokeWidth={seriesStrokeWidth}
                            strokeDasharray={seriesStrokeDasharray}
                            dot={seriesShowDots}
                            connectNulls={options.connectNulls}
                            isAnimationActive={false}
                        />
                    );
                })}
            </LineChart>
        </Chart.Root>
    );
}, (prev, next) => lineChartEqual(prev.value, next.value));
