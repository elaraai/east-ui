/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useCallback } from "react";
import { Popover as ChakraPopover, Portal } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Popover } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";

// Pre-define equality function at module level
const popoverEqual = equalFor(Popover.Types.Popover);

/** East Popover value type */
export type PopoverValue = ValueTypeOf<typeof Popover.Types.Popover>;

export interface EastChakraPopoverProps {
    value: PopoverValue;
    storageKey: string;
}

/**
 * Renders an East UI Popover value using Chakra UI Popover component.
 */
export const EastChakraPopover = memo(function EastChakraPopover({ value, storageKey }: EastChakraPopoverProps) {
    const style = useMemo(() => getSomeorUndefined(value.style), [value.style]);
    const placement = useMemo(() => style ? getSomeorUndefined(style.placement)?.type : undefined, [style]);
    const size = useMemo(() => style ? getSomeorUndefined(style.size)?.type : undefined, [style]);
    const hasArrow = useMemo(() => style ? getSomeorUndefined(style.hasArrow) : undefined, [style]);
    const title = useMemo(() => getSomeorUndefined(value.title), [value.title]);
    const description = useMemo(() => getSomeorUndefined(value.description), [value.description]);

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
            size={size}
            lazyMount
            unmountOnExit
            onOpenChange={onOpenChangeFn ? handleOpenChange : undefined}
        >
            <ChakraPopover.Trigger asChild>
                <span>
                    <EastChakraComponent value={value.trigger} storageKey={`${storageKey}.trigger`} />
                </span>
            </ChakraPopover.Trigger>
            <Portal>
                <ChakraPopover.Positioner>
                    <ChakraPopover.Content>
                        {hasArrow && <ChakraPopover.Arrow />}
                        <ChakraPopover.Body p="1">
                            {title && <ChakraPopover.Title fontWeight="medium">{title}</ChakraPopover.Title>}
                            {description && <ChakraPopover.Description>{description}</ChakraPopover.Description>}
                            {value.body.map((child, index) => (
                                <EastChakraComponent key={index} value={child} storageKey={`${storageKey}.${index}`} />
                            ))}
                        </ChakraPopover.Body>
                    </ChakraPopover.Content>
                </ChakraPopover.Positioner>
            </Portal>
        </ChakraPopover.Root>
    );
}, (prev, next) => popoverEqual(prev.value, next.value) && prev.storageKey === next.storageKey);
