/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
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
    return {
        size: getSomeorUndefined(value.size)?.type,
        variant: getSomeorUndefined(value.variant)?.type,
        colorPalette: getSomeorUndefined(value.colorPalette)?.type,
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

    return (
        <ChakraAvatar.Root {...props}>
            <ChakraAvatar.Fallback name={name} />
            {src && <ChakraAvatar.Image src={src} />}
        </ChakraAvatar.Root>
    );
}, (prev, next) => avatarEqual(prev.value, next.value));
