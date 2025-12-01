/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { memo, useMemo } from "react";
import { Dialog as ChakraDialog, Portal, CloseButton } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Dialog } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";

// Pre-define equality function at module level
const dialogEqual = equalFor(Dialog.Types.Dialog);

/** East Dialog value type */
export type DialogValue = ValueTypeOf<typeof Dialog.Types.Dialog>;

export interface EastChakraDialogProps {
    value: DialogValue;
}

/**
 * Renders an East UI Dialog value using Chakra UI Dialog component.
 */
export const EastChakraDialog = memo(function EastChakraDialog({ value }: EastChakraDialogProps) {
    const style = useMemo(() => getSomeorUndefined(value.style), [value.style]);
    const size = useMemo(() => style ? getSomeorUndefined(style.size)?.type : undefined, [style]);
    const placement = useMemo(() => style ? getSomeorUndefined(style.placement)?.type : undefined, [style]);
    const scrollBehavior = useMemo(() => style ? getSomeorUndefined(style.scrollBehavior)?.type : undefined, [style]);
    const motionPreset = useMemo(() => style ? getSomeorUndefined(style.motionPreset)?.type : undefined, [style]);
    const role = useMemo(() => style ? getSomeorUndefined(style.role)?.type : undefined, [style]);
    const title = useMemo(() => getSomeorUndefined(value.title), [value.title]);
    const description = useMemo(() => getSomeorUndefined(value.description), [value.description]);

    return (
        <ChakraDialog.Root
            size={size}
            placement={placement}
            scrollBehavior={scrollBehavior}
            motionPreset={motionPreset}
            role={role}
        >
            <ChakraDialog.Trigger asChild>
                <span>
                    <EastChakraComponent value={value.trigger} />
                </span>
            </ChakraDialog.Trigger>
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
}, (prev, next) => dialogEqual(prev.value, next.value));
