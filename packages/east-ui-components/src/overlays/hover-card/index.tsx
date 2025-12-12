/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useCallback } from "react";
import { HoverCard as ChakraHoverCard, Portal } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { HoverCard } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";

// Pre-define equality function at module level
const hoverCardEqual = equalFor(HoverCard.Types.HoverCard);

/** East HoverCard value type */
export type HoverCardValue = ValueTypeOf<typeof HoverCard.Types.HoverCard>;

export interface EastChakraHoverCardProps {
    value: HoverCardValue;
}

/**
 * Renders an East UI HoverCard value using Chakra UI HoverCard component.
 */
export const EastChakraHoverCard = memo(function EastChakraHoverCard({ value }: EastChakraHoverCardProps) {
    const style = useMemo(() => getSomeorUndefined(value.style), [value.style]);
    const placement = useMemo(() => style ? getSomeorUndefined(style.placement)?.type : undefined, [style]);
    const size = useMemo(() => style ? getSomeorUndefined(style.size)?.type : undefined, [style]);
    const hasArrow = useMemo(() => style ? getSomeorUndefined(style.hasArrow) : undefined, [style]);
    const openDelay = useMemo(() => {
        const delay = style ? getSomeorUndefined(style.openDelay) : undefined;
        return delay !== undefined ? Number(delay) : undefined;
    }, [style]);
    const closeDelay = useMemo(() => {
        const delay = style ? getSomeorUndefined(style.closeDelay) : undefined;
        return delay !== undefined ? Number(delay) : undefined;
    }, [style]);

    // Extract callbacks from style
    const onOpenChangeFn = useMemo(() => style ? getSomeorUndefined(style.onOpenChange) : undefined, [style]);

    const handleOpenChange = useCallback((details: { open: boolean }) => {
        if (onOpenChangeFn) {
            queueMicrotask(() => onOpenChangeFn(details.open));
        }
    }, [onOpenChangeFn]);

    return (
        <ChakraHoverCard.Root
            positioning={placement ? { placement } : undefined}
            size={size}
            openDelay={openDelay}
            closeDelay={closeDelay}
            onOpenChange={onOpenChangeFn ? handleOpenChange : undefined}
        >
            <ChakraHoverCard.Trigger asChild>
                <span>
                    <EastChakraComponent value={value.trigger} />
                </span>
            </ChakraHoverCard.Trigger>
            <Portal>
                <ChakraHoverCard.Positioner>
                    <ChakraHoverCard.Content width="fit-content" maxWidth="unset">
                        {hasArrow && <ChakraHoverCard.Arrow />}
                        {value.body.map((child, index) => (
                            <EastChakraComponent key={index} value={child} />
                        ))}
                    </ChakraHoverCard.Content>
                </ChakraHoverCard.Positioner>
            </Portal>
        </ChakraHoverCard.Root>
    );
}, (prev, next) => hoverCardEqual(prev.value, next.value));
