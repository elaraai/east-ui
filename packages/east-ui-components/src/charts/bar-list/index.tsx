/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { memo, useMemo, useCallback } from "react";
import { BarList, type BarListData, useChart } from "@chakra-ui/charts";
import { equalFor, match, type ValueTypeOf } from "@elaraai/east";
import { Chart as EastChart } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define the equality function at module level
const barListEqual = equalFor(EastChart.Types.BarList);

/** East BarList value type */
export type BarListValue = ValueTypeOf<typeof EastChart.Types.BarList>;

export interface EastChakraBarListProps {
    value: BarListValue;
}

/**
 * Creates a value formatter based on the tick format configuration.
 */
function createValueFormatter(format: BarListValue["valueFormat"]): ((value: number) => string) | undefined {
    const formatValue = getSomeorUndefined(format);
    if (!formatValue) return undefined;

    return (value: number) => {
        return match(formatValue, {
            number: (opts) => {
                const minDigits = getSomeorUndefined(opts.minimumFractionDigits);
                const maxDigits = getSomeorUndefined(opts.maximumFractionDigits);
                return new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: minDigits !== undefined ? Number(minDigits) : undefined,
                    maximumFractionDigits: maxDigits !== undefined ? Number(maxDigits) : undefined,
                }).format(value);
            },
            currency: (opts) => {
                const currency = opts.currency.type;
                const minDigits = getSomeorUndefined(opts.minimumFractionDigits);
                const maxDigits = getSomeorUndefined(opts.maximumFractionDigits);
                return new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency,
                    minimumFractionDigits: minDigits !== undefined ? Number(minDigits) : undefined,
                    maximumFractionDigits: maxDigits !== undefined ? Number(maxDigits) : undefined,
                }).format(value);
            },
            percent: (opts) => {
                const minDigits = getSomeorUndefined(opts.minimumFractionDigits);
                const maxDigits = getSomeorUndefined(opts.maximumFractionDigits);
                return new Intl.NumberFormat("en-US", {
                    style: "percent",
                    minimumFractionDigits: minDigits !== undefined ? Number(minDigits) : undefined,
                    maximumFractionDigits: maxDigits !== undefined ? Number(maxDigits) : undefined,
                }).format(value);
            },
            compact: () => {
                return new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                }).format(value);
            },
            unit: (opts) => {
                const unit = opts.unit.type;
                const display = getSomeorUndefined(opts.display)?.type ?? "short";
                return new Intl.NumberFormat("en-US", {
                    style: "unit",
                    unit,
                    unitDisplay: display,
                }).format(value);
            },
            scientific: () => {
                return value.toExponential(2);
            },
            engineering: () => {
                return value.toExponential(2);
            },
            date: () => value.toString(),
            time: () => value.toString(),
            datetime: () => value.toString(),
        });
    };
}

/**
 * Renders an East UI BarList value using Chakra UI BarList.
 */
export const EastChakraBarList = memo(function EastChakraBarList({ value }: EastChakraBarListProps) {
    // Convert East data to Chakra format
    const data = useMemo(() => value.data.map((item) => ({
        name: item.name,
        value: item.value,
    })), [value.data]);

    const defaultColor = useMemo(() => getSomeorUndefined(value.color) ?? "teal.subtle", [value.color]);
    const showValue = useMemo(() => getSomeorUndefined(value.showValue) ?? true, [value.showValue]);
    const showLabel = useMemo(() => getSomeorUndefined(value.showLabel) ?? true, [value.showLabel]);

    const valueFormatter = useMemo(
        () => createValueFormatter(value.valueFormat),
        [value.valueFormat]
    );

    // Build sort config if provided
    const sortConfig = useMemo(() => {
        const sortValue = getSomeorUndefined(value.sort);
        if (!sortValue) return undefined;
        return {
            by: sortValue.by as "name" | "value",
            direction: sortValue.direction.type,
        };
    }, [value.sort]);

    // BarList uses series: [{ name: "name", color }] - "name" identifies the label field
    const chart = useChart<BarListData>({
        data,
        ...(sortConfig && { sort: sortConfig }),
        series: [{ name: "name", color: defaultColor }],
    });

    // Wrap valueFormatter in useCallback for stable reference
    const stableValueFormatter = useCallback(
        (val: number) => valueFormatter ? valueFormatter(val) : val.toLocaleString(),
        [valueFormatter]
    );

    return (
        <BarList.Root chart={chart}>
            <BarList.Content>
                {showLabel && <BarList.Label title="Name" />}
                <BarList.Bar />
                {showValue && <BarList.Value valueFormatter={stableValueFormatter} />}
            </BarList.Content>
        </BarList.Root>
    );
}, (prev, next) => barListEqual(prev.value, next.value));
