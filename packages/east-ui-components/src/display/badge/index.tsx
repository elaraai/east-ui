/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { memo, useMemo } from "react";
import { Badge as ChakraBadge, type BadgeProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Badge } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define equality function at module level
const badgeEqual = equalFor(Badge.Types.Badge);

/** East Badge value type */
export type BadgeValue = ValueTypeOf<typeof Badge.Types.Badge>;

/**
 * Converts an East UI Badge value to Chakra UI Badge props.
 * Pure function - easy to test independently.
 */
export function toChakraBadge(value: BadgeValue): BadgeProps {
    return {
        variant: getSomeorUndefined(value.variant)?.type,
        colorPalette: getSomeorUndefined(value.colorPalette)?.type,
        size: getSomeorUndefined(value.size)?.type,
    };
}

export interface EastChakraBadgeProps {
    value: BadgeValue;
}

/**
 * Renders an East UI Badge value using Chakra UI Badge component.
 */
export const EastChakraBadge = memo(function EastChakraBadge({ value }: EastChakraBadgeProps) {
    const props = useMemo(() => toChakraBadge(value), [value]);

    return <ChakraBadge {...props}>{value.value}</ChakraBadge>;
}, (prev, next) => badgeEqual(prev.value, next.value));
