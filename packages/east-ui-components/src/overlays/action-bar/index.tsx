/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useCallback } from "react";
import { ActionBar as ChakraActionBar, Portal, Button } from "@chakra-ui/react";
import { equalFor, match, type ValueTypeOf } from "@elaraai/east";
import { ActionBar } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define equality function at module level
const actionBarEqual = equalFor(ActionBar.Types.ActionBar);

/** East ActionBar value type */
export type ActionBarValue = ValueTypeOf<typeof ActionBar.Types.ActionBar>;

/** East ActionBar item value type */
export type ActionBarItemValue = ValueTypeOf<typeof ActionBar.Types.Item>;

export interface EastChakraActionBarProps {
    value: ActionBarValue;
}

/**
 * Renders an East UI ActionBar value using Chakra UI ActionBar component.
 */
export const EastChakraActionBar = memo(function EastChakraActionBar({ value }: EastChakraActionBarProps) {
    const selectionCount = useMemo(() => getSomeorUndefined(value.selectionCount), [value.selectionCount]);
    const selectionLabel = useMemo(() => getSomeorUndefined(value.selectionLabel), [value.selectionLabel]);
    const style = useMemo(() => getSomeorUndefined(value.style), [value.style]);
    const open = selectionCount !== undefined && selectionCount > 0;

    // Extract callbacks from style
    const onSelectFn = useMemo(() => style ? getSomeorUndefined(style.onSelect) : undefined, [style]);
    const onOpenChangeFn = useMemo(() => style ? getSomeorUndefined(style.onOpenChange) : undefined, [style]);

    const handleOpenChange = useCallback((details: { open: boolean }) => {
        if (onOpenChangeFn) {
            queueMicrotask(() => onOpenChangeFn(details.open));
        }
    }, [onOpenChangeFn]);

    const createSelectHandler = useCallback((actionValue: string) => {
        return () => {
            if (onSelectFn) {
                queueMicrotask(() => onSelectFn(actionValue));
            }
        };
    }, [onSelectFn]);

    return (
        <ChakraActionBar.Root
            open={open}
            onOpenChange={onOpenChangeFn ? handleOpenChange : undefined}
        >
            <Portal>
                <ChakraActionBar.Positioner>
                    <ChakraActionBar.Content>
                        <ChakraActionBar.SelectionTrigger>
                            {selectionCount} {selectionLabel ?? "selected"}
                        </ChakraActionBar.SelectionTrigger>
                        <ChakraActionBar.Separator />
                        {value.items.map((item, index) =>
                            match(item, {
                                Action: (v) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        disabled={getSomeorUndefined(v.disabled)}
                                        onClick={onSelectFn ? createSelectHandler(v.value) : undefined}
                                    >
                                        {v.label}
                                    </Button>
                                ),
                                Separator: () => <ChakraActionBar.Separator key={index} />,
                            })
                        )}
                    </ChakraActionBar.Content>
                </ChakraActionBar.Positioner>
            </Portal>
        </ChakraActionBar.Root>
    );
}, (prev, next) => actionBarEqual(prev.value, next.value));
