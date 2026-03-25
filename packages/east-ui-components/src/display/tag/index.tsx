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
    const opacity = getSomeorUndefined(value.opacity);
    const color = getSomeorUndefined(value.color);
    const background = getSomeorUndefined(value.background);
    const padding = getSomeorUndefined(value.padding);
    const margin = getSomeorUndefined(value.margin);

    return {
        variant: getSomeorUndefined(value.variant)?.type,
        colorPalette: getSomeorUndefined(value.colorPalette)?.type,
        size: getSomeorUndefined(value.size)?.type,
        opacity: opacity,
        color: color,
        background: background,
        borderRadius: getSomeorUndefined(value.borderRadius),
        borderWidth: getSomeorUndefined(value.borderWidth)?.type,
        borderStyle: getSomeorUndefined(value.borderStyle)?.type,
        borderColor: getSomeorUndefined(value.borderColor),
        overflow: getSomeorUndefined(value.overflow)?.type,
        overflowX: getSomeorUndefined(value.overflowX)?.type,
        overflowY: getSomeorUndefined(value.overflowY)?.type,
        width: getSomeorUndefined(value.width),
        height: getSomeorUndefined(value.height),
        minWidth: getSomeorUndefined(value.minWidth),
        minHeight: getSomeorUndefined(value.minHeight),
        maxWidth: getSomeorUndefined(value.maxWidth),
        maxHeight: getSomeorUndefined(value.maxHeight),
        pt: padding ? getSomeorUndefined(padding.top) : undefined,
        pr: padding ? getSomeorUndefined(padding.right) : undefined,
        pb: padding ? getSomeorUndefined(padding.bottom) : undefined,
        pl: padding ? getSomeorUndefined(padding.left) : undefined,
        mt: margin ? getSomeorUndefined(margin.top) : undefined,
        mr: margin ? getSomeorUndefined(margin.right) : undefined,
        mb: margin ? getSomeorUndefined(margin.bottom) : undefined,
        ml: margin ? getSomeorUndefined(margin.left) : undefined,
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
    const onClickFn = useMemo(() => getSomeorUndefined(value.onClick), [value.onClick]);

    const handleClick = useCallback(() => {
        if (onClickFn) {
            queueMicrotask(() => onClickFn());
        }
    }, [onClickFn]);

    const handleClose = useCallback(() => {
        if (onCloseFn) {
            queueMicrotask(() => onCloseFn());
        }
    }, [onCloseFn]);

    return (
        <ChakraTag.Root {...props} onClick={onClickFn ? handleClick : undefined} cursor={onClickFn ? "pointer" : undefined}>
            <ChakraTag.Label>{value.label}</ChakraTag.Label>
            {closable && (
                <ChakraTag.CloseTrigger onClick={onCloseFn ? handleClose : undefined} />
            )}
        </ChakraTag.Root>
    );
}, (prev, next) => tagEqual(prev.value, next.value));
