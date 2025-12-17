/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useCallback, type ReactNode } from "react";
import { Dialog as ChakraDialog, Portal, CloseButton } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Dialog } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";

// Pre-define equality function at module level
const dialogEqual = equalFor(Dialog.Types.Dialog);

/** East Dialog value type */
export type DialogValue = ValueTypeOf<typeof Dialog.Types.Dialog>;

/** East Dialog open input value type */
export type DialogOpenInputValue = ValueTypeOf<typeof Dialog.Types.OpenInput>;

export interface EastChakraDialogProps {
    value: DialogValue;
}

// ============================================================================
// toChakraDialog - Pure function to convert East value to Chakra props
// ============================================================================

/**
 * Converts an East UI Dialog open input value to Chakra UI Dialog props.
 * Pure function - easy to test independently.
 *
 * @param value - The East DialogOpenInputValue
 * @returns Chakra Dialog props
 */
export function toChakraDialog(value: DialogOpenInputValue): Partial<ChakraDialog.RootProps> {
    const style = getSomeorUndefined(value.style);

    return {
        size: style ? getSomeorUndefined(style.size)?.type : undefined,
        placement: style ? getSomeorUndefined(style.placement)?.type : undefined,
        scrollBehavior: style ? getSomeorUndefined(style.scrollBehavior)?.type : undefined,
        motionPreset: style ? getSomeorUndefined(style.motionPreset)?.type : undefined,
        role: style ? getSomeorUndefined(style.role)?.type : undefined,

    };
}

// ============================================================================
// Shared Dialog Content Component
// ============================================================================

export interface DialogContentProps {
    /** Dialog open input value containing body, title, description, style */
    value: DialogOpenInputValue;
    /** Optional trigger element (for trigger-based dialogs) */
    trigger?: ReactNode;
    /** Whether dialog is controlled open (for programmatic dialogs) */
    open?: boolean;
    /** Additional onClose handler (for programmatic dialogs) */
    onClose?: () => void;
}

/**
 * Shared dialog content component used by both trigger-based and programmatic dialogs.
 */
export function DialogContent({ value, trigger, open, onClose }: DialogContentProps) {
    const props = useMemo(() => toChakraDialog(value), [value]);

    // Extract title and description from value
    const title = useMemo(() => getSomeorUndefined(value.title), [value.title]);
    const description = useMemo(() => getSomeorUndefined(value.description), [value.description]);

    // Extract callback functions from style
    const style = useMemo(() => getSomeorUndefined(value.style), [value.style]);
    const onOpenChangeFn = useMemo(() => style ? getSomeorUndefined(style.onOpenChange) : undefined, [style]);
    const onExitCompleteFn = useMemo(() => style ? getSomeorUndefined(style.onExitComplete) : undefined, [style]);
    const onEscapeKeyDownFn = useMemo(() => style ? getSomeorUndefined(style.onEscapeKeyDown) : undefined, [style]);
    const onInteractOutsideFn = useMemo(() => style ? getSomeorUndefined(style.onInteractOutside) : undefined, [style]);

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

    const handleEscapeKeyDown = useCallback(() => {
        if (onEscapeKeyDownFn) {
            queueMicrotask(() => onEscapeKeyDownFn());
        }
    }, [onEscapeKeyDownFn]);

    const handleInteractOutside = useCallback(() => {
        if (onInteractOutsideFn) {
            queueMicrotask(() => onInteractOutsideFn());
        }
    }, [onInteractOutsideFn]);

    return (
        <ChakraDialog.Root
            open={open}
            size={props.size}
            placement={props.placement}
            scrollBehavior={props.scrollBehavior}
            motionPreset={props.motionPreset}
            role={props.role}
            onOpenChange={onOpenChangeFn || onClose ? handleOpenChange : undefined}
            onExitComplete={onExitCompleteFn ? handleExitComplete : undefined}
            onEscapeKeyDown={onEscapeKeyDownFn ? handleEscapeKeyDown : undefined}
            onInteractOutside={onInteractOutsideFn ? handleInteractOutside : undefined}
        >
            {trigger && (
                <ChakraDialog.Trigger asChild>
                    <span>{trigger}</span>
                </ChakraDialog.Trigger>
            )}
            <Portal>
                <ChakraDialog.Backdrop />
                <ChakraDialog.Positioner>
                    <ChakraDialog.Content>
                        <ChakraDialog.CloseTrigger asChild>
                            <CloseButton />
                        </ChakraDialog.CloseTrigger>
                        {title && (
                            <ChakraDialog.Header>
                                <ChakraDialog.Title>{title}</ChakraDialog.Title>
                            </ChakraDialog.Header>
                        )}
                        <ChakraDialog.Body>
                            {description && (
                                <ChakraDialog.Description mb="4">{description}</ChakraDialog.Description>
                            )}
                            {value.body.map((child, index) => (
                                <EastChakraComponent key={index} value={child} />
                            ))}
                        </ChakraDialog.Body>
                    </ChakraDialog.Content>
                </ChakraDialog.Positioner>
            </Portal>
        </ChakraDialog.Root>
    );
}

// ============================================================================
// East Chakra Dialog Component (trigger-based)
// ============================================================================

/**
 * Renders an East UI Dialog value using Chakra UI Dialog component.
 */
export const EastChakraDialog = memo(function EastChakraDialog({ value }: EastChakraDialogProps) {
    // Convert DialogValue to DialogOpenInputValue format (without trigger)
    const openInputValue = useMemo((): DialogOpenInputValue => ({
        body: value.body,
        title: value.title,
        description: value.description,
        style: value.style,
    }), [value.body, value.title, value.description, value.style]);

    return (
        <DialogContent
            value={openInputValue}
            trigger={<EastChakraComponent value={value.trigger} />}
        />
    );
}, (prev, next) => dialogEqual(prev.value, next.value));
