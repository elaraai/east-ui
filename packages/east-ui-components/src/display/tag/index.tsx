/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useCallback } from "react";
import { Tag as ChakraTag, type TagRootProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Tag } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define equality function at module level
const tagEqual = equalFor(Tag.Types.Tag);

/** East Tag value type */
export type TagValue = ValueTypeOf<typeof Tag.Types.Tag>;

/**
 * Converts an East UI Tag value to Chakra UI Tag props.
 * Pure function - easy to test independently.
 */
export function toChakraTag(value: TagValue): TagRootProps {
    return {
        variant: getSomeorUndefined(value.variant)?.type,
        colorPalette: getSomeorUndefined(value.colorPalette)?.type,
        size: getSomeorUndefined(value.size)?.type,
    };
}

export interface EastChakraTagProps {
    value: TagValue;
}

/**
 * Renders an East UI Tag value using Chakra UI Tag component.
 */
export const EastChakraTag = memo(function EastChakraTag({ value }: EastChakraTagProps) {
    const props = useMemo(() => toChakraTag(value), [value]);
    const closable = useMemo(() => getSomeorUndefined(value.closable), [value.closable]);
    const onCloseFn = useMemo(() => getSomeorUndefined(value.onClose), [value.onClose]);

    const handleClose = useCallback(() => {
        if (onCloseFn) {
            queueMicrotask(() => onCloseFn());
        }
    }, [onCloseFn]);

    return (
        <ChakraTag.Root {...props}>
            <ChakraTag.Label>{value.label}</ChakraTag.Label>
            {closable && (
                <ChakraTag.CloseTrigger onClick={onCloseFn ? handleClose : undefined} />
            )}
        </ChakraTag.Root>
    );
}, (prev, next) => tagEqual(prev.value, next.value));
