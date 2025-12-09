/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useCallback } from "react";
import {
    Accordion as ChakraAccordion,
    type AccordionRootProps,
    type AccordionItemProps,
} from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Accordion } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";

// Pre-define equality functions at module level
const accordionRootEqual = equalFor(Accordion.Types.Root);
const accordionItemEqual = equalFor(Accordion.Types.Item);

/** East Accordion Root value type */
export type AccordionRootValue = ValueTypeOf<typeof Accordion.Types.Root>;

/** East Accordion Item value type */
export type AccordionItemValue = ValueTypeOf<typeof Accordion.Types.Item>;

/**
 * Converts an East UI Accordion Root value to Chakra UI AccordionRoot props.
 * Pure function - easy to test independently.
 */
export function toChakraAccordionRoot(value: AccordionRootValue): AccordionRootProps {
    const style = getSomeorUndefined(value.style);

    return {
        multiple: style ? getSomeorUndefined(style.multiple) : undefined,
        collapsible: style ? getSomeorUndefined(style.collapsible) : undefined,
        variant: style ? getSomeorUndefined(style.variant)?.type : undefined,
    };
}

/**
 * Converts an East UI Accordion Item value to Chakra UI AccordionItem props.
 * Pure function - easy to test independently.
 */
export function toChakraAccordionItem(value: AccordionItemValue): AccordionItemProps {
    return {
        value: value.value,
        disabled: getSomeorUndefined(value.disabled),
    };
}

export interface EastChakraAccordionItemProps {
    value: AccordionItemValue;
}

/**
 * Renders an East UI Accordion Item value using Chakra UI Accordion components.
 */
export const EastChakraAccordionItem = memo(function EastChakraAccordionItem({ value }: EastChakraAccordionItemProps) {
    const props = useMemo(() => toChakraAccordionItem(value), [value]);

    return (
        <ChakraAccordion.Item {...props}>
            <ChakraAccordion.ItemTrigger>
                {value.trigger}
                <ChakraAccordion.ItemIndicator />
            </ChakraAccordion.ItemTrigger>
            <ChakraAccordion.ItemContent>
                {value.content.map((child, index) => (
                    <EastChakraComponent key={index} value={child} />
                ))}
            </ChakraAccordion.ItemContent>
        </ChakraAccordion.Item>
    );
}, (prev, next) => accordionItemEqual(prev.value, next.value));

export interface EastChakraAccordionProps {
    value: AccordionRootValue;
}

/**
 * Renders an East UI Accordion value using Chakra UI Accordion components.
 */
export const EastChakraAccordion = memo(function EastChakraAccordion({ value }: EastChakraAccordionProps) {
    const props = useMemo(() => toChakraAccordionRoot(value), [value]);
    const onValueChangeFn = useMemo(() => {
        const style = getSomeorUndefined(value.style);
        return style ? getSomeorUndefined(style.onValueChange) : undefined;
    }, [value.style]);

    const handleValueChange = useCallback((details: { value: string[] }) => {
        if (onValueChangeFn) {
            queueMicrotask(() => onValueChangeFn(details.value));
        }
    }, [onValueChangeFn]);

    return (
        <ChakraAccordion.Root {...props} onValueChange={onValueChangeFn ? handleValueChange : undefined}>
            {value.items.map((item, index) => (
                <EastChakraAccordionItem key={item.value || index} value={item} />
            ))}
        </ChakraAccordion.Root>
    );
}, (prev, next) => accordionRootEqual(prev.value, next.value));
