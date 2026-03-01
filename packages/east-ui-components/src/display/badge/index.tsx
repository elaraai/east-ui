/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
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
    const opacity = getSomeorUndefined(value.opacity);
    const color = getSomeorUndefined(value.color);
    const background = getSomeorUndefined(value.background);
    const padding = getSomeorUndefined(value.padding);
    const margin = getSomeorUndefined(value.margin);
    const justifyContent = getSomeorUndefined(value.justifyContent)?.type;
    const alignItems = getSomeorUndefined(value.alignItems)?.type;

    return {
        display: "flex",
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
        justifyContent: justifyContent,
        alignItems: alignItems,
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
