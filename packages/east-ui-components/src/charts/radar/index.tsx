/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Chart, useChart } from "@chakra-ui/charts";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, Tooltip } from "recharts";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Chart as EastChart } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import {
    convertChartData,
    toChartSeries,
    toRechartsLegend,
    shouldShowLegend,
    toRechartsTooltip,
    shouldShowTooltip,
    toRechartsMargin,
} from "../utils";

// Pre-define the equality function at module level
const radarChartEqual = equalFor(EastChart.Types.RadarChart);

/** East RadarChart value type */
export type RadarChartValue = ValueTypeOf<typeof EastChart.Types.RadarChart>;

export interface EastChakraRadarChartProps {
    value: RadarChartValue;
}

/**
 * Renders an East UI RadarChart value using Chakra UI Charts.
 */
export const EastChakraRadarChart = memo(function EastChakraRadarChart({ value }: EastChakraRadarChartProps) {
    // Convert East data and series to chart format
    const chartData = useMemo(() => convertChartData(value.data), [value.data]);
    const series = useMemo(() => value.series.map(toChartSeries), [value.series]);

    // Initialize the chart hook
    const chart = useChart({
        data: chartData,
        series,
    });

    // Extract option values
    const gridValue = useMemo(() => getSomeorUndefined(value.grid), [value.grid]);
    const legendValue = useMemo(() => getSomeorUndefined(value.legend), [value.legend]);
    const tooltipValue = useMemo(() => getSomeorUndefined(value.tooltip), [value.tooltip]);
    const marginValue = useMemo(() => getSomeorUndefined(value.margin), [value.margin]);

    // Get grid props - for radar, we use PolarGrid
    const showGrid = useMemo(
        () => gridValue ? getSomeorUndefined(gridValue.show) !== false : true,
        [gridValue]
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

    // Get margin props - ensure all properties are defined for RadarChart
    const margin = useMemo(() => {
        const base = { top: 20, right: 30, left: 5, bottom: 5 };
        if (!marginValue) return base;
        const m = toRechartsMargin(marginValue);
        return {
            top: m.top ?? base.top,
            right: m.right ?? base.right,
            bottom: m.bottom ?? base.bottom,
            left: m.left ?? base.left,
        };
    }, [marginValue]);

    // Get chart options
    const options = useMemo(() => ({
        dataKey: getSomeorUndefined(value.dataKey) ?? "name",  // Default to "name" for category labels
        fillOpacity: getSomeorUndefined(value.fillOpacity) ?? 0.3,
    }), [value.dataKey, value.fillOpacity]);

    return (
        <Chart.Root
            chart={chart}
            w="full"
            h="full"
        >
            <RadarChart
                data={chart.data}
                margin={margin}
            >
                {showGrid && <PolarGrid />}
                <PolarAngleAxis dataKey={options.dataKey} />
                <PolarRadiusAxis />
                {showTooltip && (
                    <Tooltip {...tooltipProps} content={<Chart.Tooltip />} />
                )}
                {showLegend && (
                    <Legend {...legendProps} content={<Chart.Legend />} />
                )}
                {chart.series.map((item) => (
                    <Radar
                        key={item.name as string}
                        name={item.name as string}
                        dataKey={chart.key(item.name)}
                        stroke={chart.color(item.color)}
                        fill={chart.color(item.color)}
                        fillOpacity={options.fillOpacity}
                        isAnimationActive={false}
                    />
                ))}
            </RadarChart>
        </Chart.Root>
    );
}, (prev, next) => radarChartEqual(prev.value, next.value));
