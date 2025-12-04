/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Highlight as ChakraHighlight } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Highlight } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define the equality function at module level
const highlightEqual = equalFor(Highlight.Types.Highlight);

/** East Highlight value type */
export type HighlightValue = ValueTypeOf<typeof Highlight.Types.Highlight>;

export interface HighlightStyleProps {
    query: string[];
    styles?: { bg: string } | undefined;
}

/**
 * Converts an East UI Highlight value to component props.
 * Pure function - easy to test independently.
 */
export function toChakraHighlight(value: HighlightValue): HighlightStyleProps {
    const color = getSomeorUndefined(value.color);
    return {
        query: value.query,
        styles: color ? { bg: color } : undefined,
    };
}

export interface EastChakraHighlightProps {
    value: HighlightValue;
}

/**
 * Renders an East UI Highlight value using Chakra UI Highlight component.
 */
export const EastChakraHighlight = memo(function EastChakraHighlight({ value }: EastChakraHighlightProps) {
    const props = useMemo(() => toChakraHighlight(value), [value]);

    return (
        <ChakraHighlight query={props.query} styles={props.styles}>
            {value.value}
        </ChakraHighlight>
    );
}, (prev, next) => highlightEqual(prev.value, next.value));
