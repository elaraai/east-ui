/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import React, { memo, useMemo } from "react";
import { Splitter as ChakraSplitter } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Splitter } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";

// Pre-define the equality function at module level
const splitterEqual = equalFor(Splitter.Types.Splitter);

/** East Splitter value type */
export type SplitterValue = ValueTypeOf<typeof Splitter.Types.Splitter>;


/**
 * Splitter style props (without panels, which are rendered separately).
 */
interface SplitterStyleProps {
    orientation?: "horizontal" | "vertical";
    defaultSize?: number[];
}

/**
 * Converts an East UI Splitter value to Chakra UI Splitter style props.
 * Pure function - easy to test independently.
 *
 * @param value - The East Splitter value
 * @returns Splitter style props
 */
export function toChakraSplitter(value: SplitterValue): SplitterStyleProps {
    const style = getSomeorUndefined(value.style);
    const result: SplitterStyleProps = {};

    const orientation = style ? getSomeorUndefined(style.orientation)?.type : undefined;
    if (orientation !== undefined) result.orientation = orientation;

    if (value.defaultSize.length > 0) result.defaultSize = value.defaultSize;

    return result;
}

export interface EastChakraSplitterProps {
    value: SplitterValue;
}

/**
 * Renders an East UI Splitter value using Chakra UI Splitter component.
 */
export const EastChakraSplitter = memo(function EastChakraSplitter({ value }: EastChakraSplitterProps) {
    const styleProps = useMemo(() => toChakraSplitter(value), [value]);

    // Build panels config for Chakra Splitter
    const panels = useMemo(() => value.panels.map((panel) => ({
        id: panel.id,
        minSize: getSomeorUndefined(panel.minSize),
        maxSize: getSomeorUndefined(panel.maxSize),
    })), [value.panels]);

    return (
        <ChakraSplitter.Root {...styleProps} panels={panels}>
            {value.panels.map((panel, index) => (
                <React.Fragment key={panel.id}>
                    <ChakraSplitter.Panel id={panel.id}>
                        <EastChakraComponent value={panel.content} />
                    </ChakraSplitter.Panel>
                    {index < value.panels.length - 1 && value.panels[index + 1] && (
                        <ChakraSplitter.ResizeTrigger id={`${panel.id}:${value.panels[index + 1]!.id}`} />
                    )}
                </React.Fragment>
            ))}
        </ChakraSplitter.Root>
    );
}, (prev, next) => splitterEqual(prev.value, next.value));
