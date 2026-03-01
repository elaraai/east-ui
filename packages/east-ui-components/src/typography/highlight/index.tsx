/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Highlight as ChakraHighlight, Box, type BoxProps } from "@chakra-ui/react";
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
    wrapperProps?: BoxProps | undefined;
}

/**
 * Converts an East UI Highlight value to component props.
 * Pure function - easy to test independently.
 */
export function toChakraHighlight(value: HighlightValue): HighlightStyleProps {
    const color = getSomeorUndefined(value.color);
    const padding = getSomeorUndefined(value.padding);
    const margin = getSomeorUndefined(value.margin);

    const wrapperProps: BoxProps = {
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

    // Only include wrapperProps if at least one value is defined
    const hasWrapperProps = Object.values(wrapperProps).some(v => v !== undefined);

    return {
        query: value.query,
        styles: color ? { bg: color } : undefined,
        wrapperProps: hasWrapperProps ? wrapperProps : undefined,
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

    const highlight = (
        <ChakraHighlight query={props.query} styles={props.styles}>
            {value.value}
        </ChakraHighlight>
    );

    if (props.wrapperProps) {
        return <Box as="span" {...props.wrapperProps}>{highlight}</Box>;
    }

    return highlight;
}, (prev, next) => highlightEqual(prev.value, next.value));
