/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Portal } from "@chakra-ui/react";
import { Select as ChakraSelect, createListCollection, type SelectRootProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Select } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define equality function at module level
const selectRootEqual = equalFor(Select.Types.Root);

/** East Select Root value type */
export type SelectRootValue = ValueTypeOf<typeof Select.Types.Root>;

/** East Select Item value type */
export type SelectItemValue = ValueTypeOf<typeof Select.Types.Item>;

/** Select item for collection */
interface SelectCollectionItem {
    value: string;
    label: string;
    disabled?: boolean;
}

/**
 * Converts an East UI Select value to Chakra UI Select props.
 * Pure function - easy to test independently.
 */
export function toChakraSelect(value: SelectRootValue): Omit<SelectRootProps<SelectCollectionItem>, "collection"> {
    const selectedValue = getSomeorUndefined(value.value);

    return {
        value: selectedValue ? [selectedValue] : [],
        multiple: getSomeorUndefined(value.multiple),
        disabled: getSomeorUndefined(value.disabled),
        size: getSomeorUndefined(value.size)?.type,
    };
}

export interface EastChakraSelectProps {
    value: SelectRootValue;
}

/**
 * Renders an East UI Select value using Chakra UI Select component.
 */
export const EastChakraSelect = memo(function EastChakraSelect({ value }: EastChakraSelectProps) {
    const props = useMemo(() => toChakraSelect(value), [value]);
    const placeholder = useMemo(() => getSomeorUndefined(value.placeholder), [value.placeholder]);

    const collection = useMemo(() => {
        const items = value.items.map(item => ({
            value: item.value,
            label: item.label,
            disabled: getSomeorUndefined(item.disabled) ?? false,
        }));
        return createListCollection({ items });
    }, [value.items]);

    return (
        <ChakraSelect.Root collection={collection} {...props}>
            <ChakraSelect.HiddenSelect />
            <ChakraSelect.Control>
                <ChakraSelect.Trigger>
                    <ChakraSelect.ValueText placeholder={placeholder ?? "Select..."} />
                </ChakraSelect.Trigger>
                <ChakraSelect.IndicatorGroup>
                    <ChakraSelect.Indicator />
                </ChakraSelect.IndicatorGroup>
            </ChakraSelect.Control>
            <Portal>
                <ChakraSelect.Positioner>
                    <ChakraSelect.Content>
                        {collection.items.map((item) => (
                            <ChakraSelect.Item key={item.value} item={item}>
                                {item.label}
                                <ChakraSelect.ItemIndicator />
                            </ChakraSelect.Item>
                        ))}
                    </ChakraSelect.Content>
                </ChakraSelect.Positioner>
            </Portal>
        </ChakraSelect.Root>
    );
}, (prev, next) => selectRootEqual(prev.value, next.value));
