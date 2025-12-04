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
    return {
        size: getSomeorUndefined(value.size)?.type,
        as: getSomeorUndefined(value.as)?.type as HeadingProps["as"],
        color: getSomeorUndefined(value.color),
        textAlign: getSomeorUndefined(value.textAlign)?.type,
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
