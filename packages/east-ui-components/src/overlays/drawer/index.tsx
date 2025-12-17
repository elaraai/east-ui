/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useCallback, useState, type ReactNode } from "react";
import { Drawer as ChakraDrawer, Portal, IconButton, HStack, type DrawerRootProps } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faCompress } from "@fortawesome/free-solid-svg-icons";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Drawer } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";

// Pre-define equality function at module level
const drawerEqual = equalFor(Drawer.Types.Drawer);

/** East Drawer value type */
export type DrawerValue = ValueTypeOf<typeof Drawer.Types.Drawer>;

/** East Drawer open input value type */
export type DrawerOpenInputValue = ValueTypeOf<typeof Drawer.Types.OpenInput>;

export interface EastChakraDrawerProps {
    value: DrawerValue;
}

// ============================================================================
// toChakraDrawer - Pure function to convert East value to Chakra props
// ============================================================================
/**
 * Converts an East UI Drawer open input value to Chakra UI Drawer props.
 * Pure function - easy to test independently.
 *
 * @param value - The East DrawerOpenInputValue
 * @returns Chakra Drawer props
 */
export function toChakraDrawer(value: DrawerOpenInputValue): Partial<DrawerRootProps> {
    const style = getSomeorUndefined(value.style);

    return {
        size: style ? getSomeorUndefined(style.size)?.type : undefined,
        placement: style ? getSomeorUndefined(style.placement)?.type : undefined,
        contained: style ? getSomeorUndefined(style.contained) : undefined,

    };
}

// ============================================================================
// Shared Drawer Content Component
// ============================================================================

export interface DrawerContentProps {
    /** Drawer open input value containing body, title, description, style */
    value: DrawerOpenInputValue;
    /** Optional trigger element (for trigger-based drawers) */
    trigger?: ReactNode;
    /** Whether drawer is controlled open (for programmatic drawers) */
    open?: boolean;
    /** Additional onClose handler (for programmatic drawers) */
    onClose?: () => void;
}

/**
 * Shared drawer content component used by both trigger-based and programmatic drawers.
 */
export function DrawerContent({ value, trigger, open, onClose }: DrawerContentProps) {
    const props = useMemo(() => toChakraDrawer(value), [value]);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Extract title and description from value
    const title = useMemo(() => getSomeorUndefined(value.title), [value.title]);
    const description = useMemo(() => getSomeorUndefined(value.description), [value.description]);

    // Extract callback functions from style
    const style = useMemo(() => getSomeorUndefined(value.style), [value.style]);
    const onOpenChangeFn = useMemo(() => style ? getSomeorUndefined(style.onOpenChange) : undefined, [style]);
    const onExitCompleteFn = useMemo(() => style ? getSomeorUndefined(style.onExitComplete) : undefined, [style]);

    const handleOpenChange = useCallback((details: { open: boolean }) => {
        if (!details.open && onClose) {
            onClose();
        }
        if (onOpenChangeFn) {
            queueMicrotask(() => onOpenChangeFn(details.open));
        }
    }, [onOpenChangeFn, onClose]);

    const handleExitComplete = useCallback(() => {
        if (onExitCompleteFn) {
            queueMicrotask(() => onExitCompleteFn());
        }
    }, [onExitCompleteFn]);

    const toggleFullscreen = useCallback(() => {
        setIsFullscreen(prev => !prev);
    }, []);

    // Use full size when fullscreen, otherwise use props size
    const effectiveSize = isFullscreen ? "full" : props.size;

    return (
        <ChakraDrawer.Root
            open={open}
            size={effectiveSize}
            placement={props.placement}
            contained={props.contained}
            onOpenChange={handleOpenChange}
            onExitComplete={onExitCompleteFn ? handleExitComplete : undefined}
        >
            {trigger && (
                <ChakraDrawer.Trigger asChild>
                    <span>{trigger}</span>
                </ChakraDrawer.Trigger>
            )}
            <Portal>
                <ChakraDrawer.Backdrop />
                <ChakraDrawer.Positioner>
                    <ChakraDrawer.Content>
                        {/* Header buttons positioned together */}
                        <HStack position="absolute" top="2" right="2" gap="1" zIndex="1">
                            <IconButton
                                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                                onClick={toggleFullscreen}
                                variant="ghost"
                                size="sm"
                            >
                                <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
                            </IconButton>
                            {/* <IconButton
                                aria-label="Close"
                                onClick={() => handleOpenChange({ open: false })}
                                variant="ghost"
                                size="sm"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </IconButton> */}
                        </HStack>
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
}

// ============================================================================
// East Chakra Drawer Component (trigger-based)
// ============================================================================

/**
 * Renders an East UI Drawer value using Chakra UI Drawer component.
 */
export const EastChakraDrawer = memo(function EastChakraDrawer({ value }: EastChakraDrawerProps) {
    // Convert DrawerValue to DrawerOpenInputValue format (without trigger)
    const openInputValue = useMemo((): DrawerOpenInputValue => ({
        body: value.body,
        title: value.title,
        description: value.description,
        style: value.style,
    }), [value.body, value.title, value.description, value.style]);

    return (
        <DrawerContent
            value={openInputValue}
            trigger={<EastChakraComponent value={value.trigger} />}
        />
    );
}, (prev, next) => drawerEqual(prev.value, next.value));
