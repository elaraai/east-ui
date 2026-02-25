/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useState, useMemo, useCallback } from "react";
import { Portal } from "@chakra-ui/react";
import { Combobox as ChakraCombobox, createListCollection } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Combobox } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define equality function at module level
const comboboxRootEqual = equalFor(Combobox.Types.Root);

/** East Combobox Root value type */
export type ComboboxRootValue = ValueTypeOf<typeof Combobox.Types.Root>;

/** East Combobox Item value type */
export type ComboboxItemValue = ValueTypeOf<typeof Combobox.Types.Item>;

/**
 * Converts an East UI Combobox value to Chakra UI Combobox props.
 * Pure function - easy to test independently.
 */
export function toChakraCombobox(value: ComboboxRootValue) {
    const selectedValue = getSomeorUndefined(value.value);

    return {
        defaultValue: selectedValue ? [selectedValue] : [],
        multiple: getSomeorUndefined(value.multiple),
        disabled: getSomeorUndefined(value.disabled),
        size: getSomeorUndefined(value.size)?.type,
        allowCustomValue: getSomeorUndefined(value.allowCustomValue),
    };
}

export interface EastChakraComboboxProps {
    value: ComboboxRootValue;
}

/**
 * Renders an East UI Combobox value using Chakra UI Combobox component.
 */
export const EastChakraCombobox = memo(function EastChakraCombobox({ value }: EastChakraComboboxProps) {
    const props = useMemo(() => toChakraCombobox(value), [value]);
    const placeholder = useMemo(() => getSomeorUndefined(value.placeholder), [value.placeholder]);
    const onChangeFn = useMemo(() => getSomeorUndefined(value.onChange), [value.onChange]);
    const onChangeMultipleFn = useMemo(() => getSomeorUndefined(value.onChangeMultiple), [value.onChangeMultiple]);
    const onInputValueChangeFn = useMemo(() => getSomeorUndefined(value.onInputValueChange), [value.onInputValueChange]);
    const onOpenChangeFn = useMemo(() => getSomeorUndefined(value.onOpenChange), [value.onOpenChange]);
    const isMultiple = useMemo(() => getSomeorUndefined(value.multiple), [value.multiple]);

    const [inputValue, setInputValue] = useState("");

    const allItems = useMemo(() => {
        return value.items.map(item => ({
            value: item.value,
            label: item.label,
            disabled: getSomeorUndefined(item.disabled) ?? false,
        }));
    }, [value.items]);

    const collection = useMemo(() => {
        const filtered = allItems.filter(item =>
            item.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        return createListCollection({ items: filtered });
    }, [allItems, inputValue]);

    const handleValueChange = useCallback((details: { value: string[] }) => {
        if (isMultiple && onChangeMultipleFn) {
            queueMicrotask(() => onChangeMultipleFn(details.value));
        } else if (!isMultiple && onChangeFn && details.value.length > 0) {
            queueMicrotask(() => onChangeFn(details.value[0]!));
        }
    }, [isMultiple, onChangeFn, onChangeMultipleFn]);

    const handleInputValueChange = useCallback((details: { inputValue: string }) => {
        setInputValue(details.inputValue);
        if (onInputValueChangeFn) {
            queueMicrotask(() => onInputValueChangeFn(details.inputValue));
        }
    }, [onInputValueChangeFn]);

    const handleOpenChange = useCallback((details: { open: boolean }) => {
        if (onOpenChangeFn) {
            queueMicrotask(() => onOpenChangeFn(details.open));
        }
    }, [onOpenChangeFn]);

    return (
        <ChakraCombobox.Root
            collection={collection}
            defaultValue={props.defaultValue}
            multiple={props.multiple}
            disabled={props.disabled}
            size={props.size}
            allowCustomValue={props.allowCustomValue}
            inputValue={inputValue}
            onValueChange={(onChangeFn || onChangeMultipleFn) ? handleValueChange : undefined}
            onInputValueChange={handleInputValueChange}
            onOpenChange={onOpenChangeFn ? handleOpenChange : undefined}
        >
            <ChakraCombobox.Control>
                <ChakraCombobox.Input placeholder={placeholder ?? "Search..."} />
                <ChakraCombobox.IndicatorGroup>
                    <ChakraCombobox.ClearTrigger />
                    <ChakraCombobox.Trigger />
                </ChakraCombobox.IndicatorGroup>
            </ChakraCombobox.Control>
            <Portal>
                <ChakraCombobox.Positioner>
                    <ChakraCombobox.Content>
                        <ChakraCombobox.Empty>No results found</ChakraCombobox.Empty>
                        {collection.items.map((item) => (
                            <ChakraCombobox.Item key={item.value} item={item}>
                                {item.label}
                                <ChakraCombobox.ItemIndicator />
                            </ChakraCombobox.Item>
                        ))}
                    </ChakraCombobox.Content>
                </ChakraCombobox.Positioner>
            </Portal>
        </ChakraCombobox.Root>
    );
}, (prev, next) => comboboxRootEqual(prev.value, next.value));
