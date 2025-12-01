/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Chart, useChart } from "@chakra-ui/charts";
import { Scatter, ScatterChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
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

    // Get chart options (convert bigint to number where needed)
    const options = useMemo(() => {
        const pointSize = getSomeorUndefined(value.pointSize);
        return {
            xDataKey: getSomeorUndefined(value.xDataKey),
            yDataKey: getSomeorUndefined(value.yDataKey),
            pointSize: pointSize !== undefined ? Number(pointSize) : 60,
        };
    }, [value.xDataKey, value.yDataKey, value.pointSize]);

    return (
        <Chart.Root
            chart={chart}
            maxW="full"
            maxH="full"
        >
            <ScatterChart
                data={chart.data}
                margin={margin}
            >
                {showGrid && <CartesianGrid {...gridProps} />}
                {!xAxisProps.hide && (
                    <XAxis
                        {...xAxisProps}
                        type="number"
                        {...(options.xDataKey && { dataKey: options.xDataKey })}
                        {...(xAxisTickFormatter ? { tickFormatter: xAxisTickFormatter } : {})}
                    />
                )}
                {!yAxisProps.hide && (
                    <YAxis
                        {...yAxisProps}
                        type="number"
                        {...(options.yDataKey && { dataKey: options.yDataKey })}
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
                    <Scatter
                        key={item.name as string}
                        name={item.name as string}
                        data={chart.data}
                        fill={chart.color(item.color)}
                        isAnimationActive={false}
                    />
                ))}
            </ScatterChart>
        </Chart.Root>
    );
}, (prev, next) => scatterChartEqual(prev.value, next.value));
