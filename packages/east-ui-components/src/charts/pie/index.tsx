/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Chart, useChart } from "@chakra-ui/charts";
import { Pie, PieChart, Legend, Tooltip, Cell } from "recharts";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Chart as EastChart } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import {
    toRechartsLegend,
    shouldShowLegend,
    toRechartsTooltip,
    shouldShowTooltip,
    toRechartsMargin,
} from "../utils";

// Pre-define the equality function at module level
const pieChartEqual = equalFor(EastChart.Types.PieChart);

/** East PieChart value type */
export type PieChartValue = ValueTypeOf<typeof EastChart.Types.PieChart>;

export interface EastChakraPieChartProps {
    value: PieChartValue;
}

/**
 * Converts pie slice data from East format to Recharts format.
 */
function convertPieData(data: PieChartValue["data"]): Array<{ name: string; value: number; color?: string }> {
    return data.map((slice) => {
        const color = getSomeorUndefined(slice.color);
        return {
            name: slice.name,
            value: slice.value,
            ...(color && { color }),
        };
    });
}

/**
 * Renders an East UI PieChart value using Chakra UI Charts.
 */
export const EastChakraPieChart = memo(function EastChakraPieChart({ value }: EastChakraPieChartProps) {
    // Convert East data to chart format
    const chartData = useMemo(() => convertPieData(value.data), [value.data]);

    // Initialize the chart hook - pie doesn't use series in the standard way
    const chart = useChart({
        data: chartData,
    });

    // Extract option values
    const legendValue = useMemo(() => getSomeorUndefined(value.legend), [value.legend]);
    const tooltipValue = useMemo(() => getSomeorUndefined(value.tooltip), [value.tooltip]);
    const marginValue = useMemo(() => getSomeorUndefined(value.margin), [value.margin]);

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

    // Get margin props - ensure all properties are defined for PieChart
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
        innerRadius: getSomeorUndefined(value.innerRadius) ?? 0,
        outerRadius: getSomeorUndefined(value.outerRadius) ?? 80,
        startAngle: getSomeorUndefined(value.startAngle) ?? 0,
        endAngle: getSomeorUndefined(value.endAngle) ?? 360,
        paddingAngle: getSomeorUndefined(value.paddingAngle) ?? 0,
        showLabels: getSomeorUndefined(value.showLabels) ?? false,
    }), [value.innerRadius, value.outerRadius, value.startAngle, value.endAngle, value.paddingAngle, value.showLabels]);

    return (
        <Chart.Root
            chart={chart}
            w="full"
            h="full"
        >
            <PieChart margin={margin}>
                {showTooltip && (
                    <Tooltip {...tooltipProps} content={<Chart.Tooltip />} />
                )}
                {showLegend && (
                    <Legend {...legendProps} content={<Chart.Legend />} />
                )}
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={options.innerRadius}
                    outerRadius={options.outerRadius}
                    startAngle={options.startAngle}
                    endAngle={options.endAngle}
                    paddingAngle={options.paddingAngle}
                    label={options.showLabels}
                    isAnimationActive={false}
                >
                    {chartData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={chart.color(entry.color ?? `chart.${index + 1}`)}
                        />
                    ))}
                </Pie>
            </PieChart>
        </Chart.Root>
    );
}, (prev, next) => pieChartEqual(prev.value, next.value));
