/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useCallback } from "react";
import { usePersistedState } from "../../hooks/usePersistedState";
import {
    Tabs as ChakraTabs,
    type TabsRootProps,
    type TabsTriggerProps,
    type TabsContentProps,
} from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Tabs } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";

// Pre-define equality functions at module level
const tabsRootEqual = equalFor(Tabs.Types.Root);
const tabsItemEqual = equalFor(Tabs.Types.Item);

/** East Tabs Root value type */
export type TabsRootValue = ValueTypeOf<typeof Tabs.Types.Root>;

/** East Tabs Item value type */
export type TabsItemValue = ValueTypeOf<typeof Tabs.Types.Item>;

/**
 * Converts an East UI Tabs Root value to Chakra UI TabsRoot props.
 * Pure function - easy to test independently.
 */
export function toChakraTabsRoot(value: TabsRootValue): TabsRootProps {
    const style = getSomeorUndefined(value.style);

    return {
        defaultValue: getSomeorUndefined(value.defaultValue),
        value: getSomeorUndefined(value.value),
        variant: style ? getSomeorUndefined(style.variant)?.type : undefined,
        size: style ? getSomeorUndefined(style.size)?.type : undefined,
        orientation: style ? getSomeorUndefined(style.orientation)?.type : undefined,
        activationMode: style ? getSomeorUndefined(style.activationMode)?.type : undefined,
        fitted: style ? getSomeorUndefined(style.fitted) : undefined,
        justify: style ? getSomeorUndefined(style.justify)?.type : undefined,
        lazyMount: style ? getSomeorUndefined(style.lazyMount) : undefined,
        unmountOnExit: style ? getSomeorUndefined(style.unmountOnExit) : undefined,
        colorPalette: style ? getSomeorUndefined(style.colorPalette)?.type : undefined,
    };
}

/**
 * Converts an East UI Tabs Item value to Chakra UI TabsTrigger props.
 * Pure function - easy to test independently.
 */
export function toChakraTabsTrigger(value: TabsItemValue): TabsTriggerProps {
    return {
        value: value.value,
        disabled: getSomeorUndefined(value.disabled),
    };
}

/**
 * Converts an East UI Tabs Item value to Chakra UI TabsContent props.
 * Pure function - easy to test independently.
 */
export function toChakraTabsContent(value: TabsItemValue): TabsContentProps {
    return {
        value: value.value,
    };
}

export interface EastChakraTabsItemProps {
    value: TabsItemValue;
    storageKey: string;
}

/**
 * Renders an East UI Tabs Item trigger using Chakra UI Tabs components.
 */
export const EastChakraTabsTrigger = memo(function EastChakraTabsTrigger({ value }: EastChakraTabsItemProps) {
    const props = useMemo(() => toChakraTabsTrigger(value), [value]);

    return (
        <ChakraTabs.Trigger {...props}>
            {value.trigger}
        </ChakraTabs.Trigger>
    );
}, (prev, next) => tabsItemEqual(prev.value, next.value));

/**
 * Renders an East UI Tabs Item content using Chakra UI Tabs components.
 */
export const EastChakraTabsContent = memo(function EastChakraTabsContent({ value, storageKey }: EastChakraTabsItemProps) {
    const props = useMemo(() => toChakraTabsContent(value), [value]);

    return (
        <ChakraTabs.Content {...props}>
            {value.content.map((child, index) => (
                <EastChakraComponent key={index} value={child} storageKey={`${storageKey}.${index}`} />
            ))}
        </ChakraTabs.Content>
    );
}, (prev, next) => tabsItemEqual(prev.value, next.value) && prev.storageKey === next.storageKey);

interface TabsPersistedState {
    selectedValue: string | undefined;
}

export interface EastChakraTabsProps {
    value: TabsRootValue;
    /** Storage key for persisting selected tab in localStorage. Omit for ephemeral state. */
    storageKey: string;
}

/**
 * Renders an East UI Tabs value using Chakra UI Tabs components.
 */
export const EastChakraTabs = memo(function EastChakraTabs({ value, storageKey }: EastChakraTabsProps) {
    const props = useMemo(() => toChakraTabsRoot(value), [value]);
    const onValueChangeFn = useMemo(() => {
        const style = getSomeorUndefined(value.style);
        return style ? getSomeorUndefined(style.onValueChange) : undefined;
    }, [value.style]);

    const defaultValue = useMemo(() => getSomeorUndefined(value.defaultValue), [value.defaultValue]);
    const controlledValue = useMemo(() => getSomeorUndefined(value.value), [value.value]);

    const { state: persistedState, setState: setPersistedState } = usePersistedState<TabsPersistedState>(
        storageKey,
        { selectedValue: defaultValue },
    );

    const handleValueChange = useCallback((details: { value: string }) => {
        setPersistedState(prev => ({ ...prev, selectedValue: details.value }));
        if (onValueChangeFn) {
            queueMicrotask(() => onValueChangeFn(details.value));
        }
    }, [onValueChangeFn, setPersistedState]);

    // Persisted value takes priority, then controlled prop
    const effectiveValue = useMemo(
        () => persistedState.selectedValue ?? controlledValue,
        [persistedState.selectedValue, controlledValue],
    );

    return (
        <ChakraTabs.Root
            {...props}
            value={effectiveValue}
            onValueChange={handleValueChange}
        >
            <ChakraTabs.List>
                {value.items.map((item, index) => (
                    <EastChakraTabsTrigger key={item.value} value={item} storageKey={`${storageKey}.${index}`} />
                ))}
            </ChakraTabs.List>
            {value.items.map((item, index) => (
                <EastChakraTabsContent key={item.value} value={item} storageKey={`${storageKey}.${index}`} />
            ))}
        </ChakraTabs.Root>
    );
}, (prev, next) => tabsRootEqual(prev.value, next.value) && prev.storageKey === next.storageKey);
