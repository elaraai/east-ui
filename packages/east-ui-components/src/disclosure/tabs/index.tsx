/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { memo, useMemo } from "react";
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
export const EastChakraTabsContent = memo(function EastChakraTabsContent({ value }: EastChakraTabsItemProps) {
    const props = useMemo(() => toChakraTabsContent(value), [value]);

    return (
        <ChakraTabs.Content {...props}>
            {value.content.map((child, index) => (
                <EastChakraComponent key={index} value={child} />
            ))}
        </ChakraTabs.Content>
    );
}, (prev, next) => tabsItemEqual(prev.value, next.value));

export interface EastChakraTabsProps {
    value: TabsRootValue;
}

/**
 * Renders an East UI Tabs value using Chakra UI Tabs components.
 */
export const EastChakraTabs = memo(function EastChakraTabs({ value }: EastChakraTabsProps) {
    const props = useMemo(() => toChakraTabsRoot(value), [value]);

    return (
        <ChakraTabs.Root {...props}>
            <ChakraTabs.List>
                {value.items.map((item) => (
                    <EastChakraTabsTrigger key={item.value} value={item} />
                ))}
            </ChakraTabs.List>
            {value.items.map((item) => (
                <EastChakraTabsContent key={item.value} value={item} />
            ))}
        </ChakraTabs.Root>
    );
}, (prev, next) => tabsRootEqual(prev.value, next.value));
