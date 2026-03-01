/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Link as ChakraLink, type LinkProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Link } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define the equality function at module level
const linkEqual = equalFor(Link.Types.Link);

/** East Link value type */
export type LinkValue = ValueTypeOf<typeof Link.Types.Link>;

/**
 * Converts an East UI Link value to Chakra UI Link props.
 * Pure function - easy to test independently.
 */
export function toChakraLink(value: LinkValue): LinkProps {
    const external = getSomeorUndefined(value.external);
    const padding = getSomeorUndefined(value.padding);
    const margin = getSomeorUndefined(value.margin);

    return {
        href: value.href,
        variant: getSomeorUndefined(value.variant)?.type,
        colorPalette: getSomeorUndefined(value.colorPalette),
        ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
        textDecoration: getSomeorUndefined(value.textDecoration)?.type,
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
        lineHeight: getSomeorUndefined(value.lineHeight),
        letterSpacing: getSomeorUndefined(value.letterSpacing),
        opacity: getSomeorUndefined(value.opacity),
    };
}

export interface EastChakraLinkProps {
    value: LinkValue;
}

/**
 * Renders an East UI Link value using Chakra UI Link component.
 */
export const EastChakraLink = memo(function EastChakraLink({ value }: EastChakraLinkProps) {
    const props = useMemo(() => toChakraLink(value), [value]);

    return <ChakraLink {...props}>{value.value}</ChakraLink>;
}, (prev, next) => linkEqual(prev.value, next.value));
