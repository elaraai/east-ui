/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Tooltip as ChakraTooltip } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Tooltip } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";

// Pre-define equality function at module level
const tooltipEqual = equalFor(Tooltip.Types.Tooltip);

/** East Tooltip value type */
export type TooltipValue = ValueTypeOf<typeof Tooltip.Types.Tooltip>;

export interface EastChakraTooltipProps {
    value: TooltipValue;
}

/**
 * Renders an East UI Tooltip value using Chakra UI Tooltip component.
 */
export const EastChakraTooltip = memo(function EastChakraTooltip({ value }: EastChakraTooltipProps) {
    const placement = useMemo(() => getSomeorUndefined(value.placement)?.type, [value.placement]);
    const hasArrow = useMemo(() => getSomeorUndefined(value.hasArrow), [value.hasArrow]);

    return (
        <ChakraTooltip.Root positioning={placement ? { placement } : undefined}>
            <ChakraTooltip.Trigger asChild>
                <span>
                    <EastChakraComponent value={value.trigger} />
                </span>
            </ChakraTooltip.Trigger>
            <ChakraTooltip.Positioner>
                <ChakraTooltip.Content>
                    {hasArrow && <ChakraTooltip.Arrow />}
                    {value.content}
                </ChakraTooltip.Content>
            </ChakraTooltip.Positioner>
        </ChakraTooltip.Root>
    );
}, (prev, next) => tooltipEqual(prev.value, next.value));
