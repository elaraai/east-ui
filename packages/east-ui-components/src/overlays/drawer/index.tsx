/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useCallback } from "react";
import { Drawer as ChakraDrawer, Portal, CloseButton } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Drawer } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";

// Pre-define equality function at module level
const drawerEqual = equalFor(Drawer.Types.Drawer);

/** East Drawer value type */
export type DrawerValue = ValueTypeOf<typeof Drawer.Types.Drawer>;

export interface EastChakraDrawerProps {
    value: DrawerValue;
}

/**
 * Renders an East UI Drawer value using Chakra UI Drawer component.
 */
export const EastChakraDrawer = memo(function EastChakraDrawer({ value }: EastChakraDrawerProps) {
    const style = useMemo(() => getSomeorUndefined(value.style), [value.style]);
    const size = useMemo(() => style ? getSomeorUndefined(style.size)?.type : undefined, [style]);
    const placement = useMemo(() => style ? getSomeorUndefined(style.placement)?.type : undefined, [style]);
    const contained = useMemo(() => style ? getSomeorUndefined(style.contained) : undefined, [style]);
    const title = useMemo(() => getSomeorUndefined(value.title), [value.title]);
    const description = useMemo(() => getSomeorUndefined(value.description), [value.description]);

    // Extract callbacks from style
    const onOpenChangeFn = useMemo(() => style ? getSomeorUndefined(style.onOpenChange) : undefined, [style]);
    const onExitCompleteFn = useMemo(() => style ? getSomeorUndefined(style.onExitComplete) : undefined, [style]);

    const handleOpenChange = useCallback((details: { open: boolean }) => {
        if (onOpenChangeFn) {
            queueMicrotask(() => onOpenChangeFn(details.open));
        }
    }, [onOpenChangeFn]);

    const handleExitComplete = useCallback(() => {
        if (onExitCompleteFn) {
            queueMicrotask(() => onExitCompleteFn());
        }
    }, [onExitCompleteFn]);

    return (
        <ChakraDrawer.Root
            size={size}
            placement={placement}
            contained={contained}
            onOpenChange={onOpenChangeFn ? handleOpenChange : undefined}
            onExitComplete={onExitCompleteFn ? handleExitComplete : undefined}
        >
            <ChakraDrawer.Trigger asChild>
                <span>
                    <EastChakraComponent value={value.trigger} />
                </span>
            </ChakraDrawer.Trigger>
            <Portal>
                <ChakraDrawer.Backdrop />
                <ChakraDrawer.Positioner>
                    <ChakraDrawer.Content>
                        <ChakraDrawer.CloseTrigger asChild>
                            <CloseButton />
                        </ChakraDrawer.CloseTrigger>
                        <ChakraDrawer.Header>
                            {title && <ChakraDrawer.Title>{title}</ChakraDrawer.Title>}
                        </ChakraDrawer.Header>
                        <ChakraDrawer.Body>
                            {description && (
                                <ChakraDrawer.Description mb="4">{description}</ChakraDrawer.Description>
                            )}
                            {value.body.map((child, index) => (
                                <EastChakraComponent key={index} value={child} />
                            ))}
                        </ChakraDrawer.Body>
                    </ChakraDrawer.Content>
                </ChakraDrawer.Positioner>
            </Portal>
        </ChakraDrawer.Root>
    );
}, (prev, next) => drawerEqual(prev.value, next.value));
