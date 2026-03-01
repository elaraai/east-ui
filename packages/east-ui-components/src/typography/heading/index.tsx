/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Heading as ChakraHeading, type HeadingProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Heading } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define the equality function at module level
const headingEqual = equalFor(Heading.Types.Heading);

/** East Heading value type */
export type HeadingValue = ValueTypeOf<typeof Heading.Types.Heading>;

/**
 * Converts an East UI Heading value to Chakra UI Heading props.
 * Pure function - easy to test independently.
 */
export function toChakraHeading(value: HeadingValue): HeadingProps {
    const padding = getSomeorUndefined(value.padding);
    const margin = getSomeorUndefined(value.margin);

    return {
        size: getSomeorUndefined(value.size)?.type,
        as: getSomeorUndefined(value.as)?.type as HeadingProps["as"],
        color: getSomeorUndefined(value.color),
        textAlign: getSomeorUndefined(value.textAlign)?.type,
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

export interface EastChakraHeadingProps {
    value: HeadingValue;
}

/**
 * Renders an East UI Heading value using Chakra UI Heading component.
 */
export const EastChakraHeading = memo(function EastChakraHeading({ value }: EastChakraHeadingProps) {
    const props = useMemo(() => toChakraHeading(value), [value]);

    return <ChakraHeading {...props}>{value.value}</ChakraHeading>;
}, (prev, next) => headingEqual(prev.value, next.value));
