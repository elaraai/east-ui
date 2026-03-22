/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import React, { memo, useMemo, useCallback } from "react";
import { usePersistedState } from "../../hooks/usePersistedState";
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

interface SplitterPersistedState {
    panelSizes: number[];
}

export interface EastChakraSplitterProps {
    value: SplitterValue;
    /** Storage key for persisting panel sizes in localStorage. Omit for ephemeral state. */
    storageKey: string;
}

/**
 * Renders an East UI Splitter value using Chakra UI Splitter component.
 */
export const EastChakraSplitter = memo(function EastChakraSplitter({ value, storageKey }: EastChakraSplitterProps) {
    const styleProps = useMemo(() => toChakraSplitter(value), [value]);
    const style = useMemo(() => getSomeorUndefined(value.style), [value.style]);

    // Build panels config for Chakra Splitter
    const panels = useMemo(() => value.panels.map((panel) => ({
        id: panel.id,
        minSize: getSomeorUndefined(panel.minSize),
        maxSize: getSomeorUndefined(panel.maxSize),
    })), [value.panels]);

    // Persisted panel sizes
    const defaultSizes = useMemo(() => value.defaultSize.length > 0 ? [...value.defaultSize] : [], [value.defaultSize]);
    const { state: persistedState, setState: setPersistedState } = usePersistedState<SplitterPersistedState>(
        storageKey,
        { panelSizes: defaultSizes },
    );
    const effectiveDefaultSize = useMemo(
        () => persistedState.panelSizes.length > 0 ? persistedState.panelSizes : defaultSizes,
        [persistedState.panelSizes, defaultSizes],
    );

    // Extract callbacks from style
    const onResizeFn = useMemo(() => style ? getSomeorUndefined(style.onResize) : undefined, [style]);
    const onResizeStartFn = useMemo(() => style ? getSomeorUndefined(style.onResizeStart) : undefined, [style]);
    const onResizeEndFn = useMemo(() => style ? getSomeorUndefined(style.onResizeEnd) : undefined, [style]);

    const handleResize = useCallback((details: { size: number[] }) => {
        if (onResizeFn) {
            queueMicrotask(() => onResizeFn({ size: details.size }));
        }
    }, [onResizeFn]);

    const handleResizeStart = useCallback(() => {
        if (onResizeStartFn) {
            queueMicrotask(() => onResizeStartFn());
        }
    }, [onResizeStartFn]);

    const handleResizeEnd = useCallback((details: { size: number[] }) => {
        setPersistedState(prev => ({ ...prev, panelSizes: details.size }));
        if (onResizeEndFn) {
            queueMicrotask(() => onResizeEndFn({ size: details.size }));
        }
    }, [onResizeEndFn, setPersistedState]);

    return (
        <ChakraSplitter.Root
            {...styleProps}
            defaultSize={effectiveDefaultSize.length > 0 ? effectiveDefaultSize : undefined}
            panels={panels}
            onResize={onResizeFn ? handleResize : undefined}
            onResizeStart={onResizeStartFn ? handleResizeStart : undefined}
            onResizeEnd={handleResizeEnd}
        >
            {value.panels.map((panel, index) => (
                <React.Fragment key={panel.id}>
                    <ChakraSplitter.Panel id={panel.id}>
                        <EastChakraComponent value={panel.content} storageKey={`${storageKey}.${index}`} />
                    </ChakraSplitter.Panel>
                    {index < value.panels.length - 1 && value.panels[index + 1] && (
                        <ChakraSplitter.ResizeTrigger id={`${panel.id}:${value.panels[index + 1]!.id}`} />
                    )}
                </React.Fragment>
            ))}
        </ChakraSplitter.Root>
    );
}, (prev, next) => splitterEqual(prev.value, next.value) && prev.storageKey === next.storageKey);
