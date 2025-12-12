/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Chart, useChart } from "@chakra-ui/charts";
import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, type AreaProps } from "recharts";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Chart as EastChart } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import {
    convertChartData,
    toChartSeries,
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
    // Convert East data and series to chart format
    const chartData = useMemo(() => convertChartData(value.data), [value.data]);
    const series = useMemo(() => value.series.map(toChartSeries), [value.series]);

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

    // Get chart options
    const options = useMemo(() => ({
        curveType: getSomeorUndefined(value.curveType)?.type ?? "linear",
        fillOpacity: getSomeorUndefined(value.fillOpacity) ?? 0.2,
        connectNulls: getSomeorUndefined(value.connectNulls) ?? false,
        defaultStackId: getSomeorUndefined(value.stacked) ? "stack" : undefined,
        stackOffset: getSomeorUndefined(value.stackOffset)?.type,
    }), [value.curveType, value.fillOpacity, value.connectNulls, value.stacked, value.stackOffset]);

    return (
        <Chart.Root
            chart={chart}
            maxW="full"
            maxH="full"
            
        >
            <AreaChart
                data={chart.data}
                {...(options.stackOffset ? { stackOffset: options.stackOffset } : {})}
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
                {chart.series.map((item) => (
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
                        stackId={item.stackId ?? options.defaultStackId ?? "0"}
                        
                    />
                ))}
            </AreaChart>
        </Chart.Root>
    );
}, (prev, next) => areaChartEqual(prev.value, next.value));
