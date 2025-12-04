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
    return {
        href: value.href,
        variant: getSomeorUndefined(value.variant)?.type,
        colorPalette: getSomeorUndefined(value.colorPalette),
        ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
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
