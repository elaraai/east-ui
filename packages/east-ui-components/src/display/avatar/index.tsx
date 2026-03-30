/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useCallback } from "react";
import { Avatar as ChakraAvatar, type AvatarRootProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Avatar } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define equality function at module level
const avatarEqual = equalFor(Avatar.Types.Avatar);

/** East Avatar value type */
export type AvatarValue = ValueTypeOf<typeof Avatar.Types.Avatar>;

/**
 * Converts an East UI Avatar value to Chakra UI Avatar props.
 * Pure function - easy to test independently.
 */
export function toChakraAvatar(value: AvatarValue): AvatarRootProps {
    const padding = getSomeorUndefined(value.padding);
    const margin = getSomeorUndefined(value.margin);

    return {
        size: getSomeorUndefined(value.size)?.type,
        variant: getSomeorUndefined(value.variant)?.type,
        colorPalette: getSomeorUndefined(value.colorPalette)?.type,
        opacity: getSomeorUndefined(value.opacity),
        borderRadius: getSomeorUndefined(value.borderRadius),
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

export interface EastChakraAvatarProps {
    value: AvatarValue;
}

/**
 * Renders an East UI Avatar value using Chakra UI Avatar component.
 */
export const EastChakraAvatar = memo(function EastChakraAvatar({ value }: EastChakraAvatarProps) {
    const props = useMemo(() => toChakraAvatar(value), [value]);
    const src = useMemo(() => getSomeorUndefined(value.src), [value.src]);
    const name = useMemo(() => getSomeorUndefined(value.name), [value.name]);

    const onClickFn = useMemo(() => getSomeorUndefined(value.onClick), [value.onClick]);

    const handleClick = useCallback(() => {
        if (onClickFn) {
            queueMicrotask(() => onClickFn());
        }
    }, [onClickFn]);

    return (
        <ChakraAvatar.Root {...props} onClick={onClickFn ? handleClick : undefined} cursor={onClickFn ? "pointer" : undefined}>
            <ChakraAvatar.Fallback name={name} />
            {src && <ChakraAvatar.Image src={src} />}
        </ChakraAvatar.Root>
    );
}, (prev, next) => avatarEqual(prev.value, next.value));
