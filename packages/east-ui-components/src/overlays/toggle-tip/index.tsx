/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useCallback } from "react";
import { Popover as ChakraPopover, Portal } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { ToggleTip } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";

// Pre-define equality function at module level
const toggleTipEqual = equalFor(ToggleTip.Types.ToggleTip);

/** East ToggleTip value type */
export type ToggleTipValue = ValueTypeOf<typeof ToggleTip.Types.ToggleTip>;

export interface EastChakraToggleTipProps {
    value: ToggleTipValue;
}

/**
 * Renders an East UI ToggleTip value using Chakra UI Popover component.
 * ToggleTip is a click-activated tooltip for better accessibility.
 */
export const EastChakraToggleTip = memo(function EastChakraToggleTip({ value }: EastChakraToggleTipProps) {
    const style = useMemo(() => getSomeorUndefined(value.style), [value.style]);
    const placement = useMemo(() => style ? getSomeorUndefined(style.placement)?.type : undefined, [style]);
    const hasArrow = useMemo(() => style ? getSomeorUndefined(style.hasArrow) : undefined, [style]);

    // Extract callbacks from style
    const onOpenChangeFn = useMemo(() => style ? getSomeorUndefined(style.onOpenChange) : undefined, [style]);

    const handleOpenChange = useCallback((details: { open: boolean }) => {
        if (onOpenChangeFn) {
            queueMicrotask(() => onOpenChangeFn(details.open));
        }
    }, [onOpenChangeFn]);

    return (
        <ChakraPopover.Root
            positioning={placement ? { placement } : undefined}
            onOpenChange={onOpenChangeFn ? handleOpenChange : undefined}
        >
            <ChakraPopover.Trigger asChild>
                <span>
                    <EastChakraComponent value={value.trigger} />
                </span>
            </ChakraPopover.Trigger>
            <Portal>
                <ChakraPopover.Positioner>
                    <ChakraPopover.Content padding="2" width="auto">
                        {hasArrow && <ChakraPopover.Arrow />}
                        {value.content}
                    </ChakraPopover.Content>
                </ChakraPopover.Positioner>
            </Portal>
        </ChakraPopover.Root>
    );
}, (prev, next) => toggleTipEqual(prev.value, next.value));
