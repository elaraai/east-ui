/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    StringType,
    ArrayType,
    variant,
    some,
    none,
} from "@elaraai/east";

import { SizeType } from "../../style.js";
import {
    ComboboxItemType,
    ComboboxRootType,
    type ComboboxItemStyle,
    type ComboboxStyle,
} from "./types.js";
import { UIComponentType } from "../../component.js";

// Re-export types
export {
    ComboboxItemType,
    ComboboxRootType,
    type ComboboxItemStyle,
    type ComboboxStyle,
} from "./types.js";

// ============================================================================
// Combobox Item Function
// ============================================================================

/**
 * Creates a ComboboxItem with value, label, and optional styling.
 *
 * @param value - The value submitted when this item is selected
 * @param label - The display text shown to the user
 * @param style - Optional styling configuration
 * @returns An East expression representing the combobox item
 *
 * @example
 * ```ts
 * import { East } from "@elaraai/east";
 * import { Combobox, UIComponentType } from "@elaraai/east-ui";
 *
 * const example = East.function([], UIComponentType, $ => {
 *     return Combobox.Root("", [
 *         Combobox.Item("us", "United States"),
 *         Combobox.Item("restricted", "Restricted", { disabled: true }),
 *     ]);
 * });
 * ```
 */
function createComboboxItem(
    value: SubtypeExprOrValue<StringType>,
    label: SubtypeExprOrValue<StringType>,
    style?: ComboboxItemStyle
): ExprType<ComboboxItemType> {
    return East.value({
        value: value,
        label: label,
        disabled: style?.disabled !== undefined ? some(style.disabled) : none,
    }, ComboboxItemType);
}

// ============================================================================
// Combobox Root Function
// ============================================================================

/**
 * Creates a Combobox component with value, items, and optional styling.
 *
 * @param value - Currently selected value (null/undefined for no selection)
 * @param items - Array of selectable items
 * @param style - Optional styling configuration
 * @returns An East expression representing the combobox component
 *
 * @remarks
 * Combobox is a searchable dropdown control that combines a text input with a
 * listbox, allowing users to type to filter options from a list.
 *
 * @example
 * ```ts
 * import { East } from "@elaraai/east";
 * import { Combobox, UIComponentType } from "@elaraai/east-ui";
 *
 * const example = East.function([], UIComponentType, $ => {
 *     return Combobox.Root("", [
 *         Combobox.Item("us", "United States"),
 *         Combobox.Item("uk", "United Kingdom"),
 *         Combobox.Item("ca", "Canada"),
 *     ], {
 *         placeholder: "Search countries...",
 *     });
 * });
 * ```
 */
export function createComboboxRoot_(
    value: SubtypeExprOrValue<StringType>,
    items: SubtypeExprOrValue<ArrayType<ComboboxItemType>>,
    style?: ComboboxStyle
): ExprType<ComboboxRootType> {
    const toStringOption = (val: SubtypeExprOrValue<StringType> | null | undefined) => {
        if (val === undefined || val === null || val === "") return none;
        return some(val);
    };

    const sizeValue = style?.size
        ? (typeof style.size === "string"
            ? East.value(variant(style.size, null), SizeType)
            : style.size)
        : undefined;

    return East.value({
        value: toStringOption(value),
        items: East.value(items, ArrayType(ComboboxItemType)),
        placeholder: toStringOption(style?.placeholder),
        multiple: style?.multiple !== undefined ? some(style.multiple) : none,
        disabled: style?.disabled !== undefined ? some(style.disabled) : none,
        size: sizeValue ? some(sizeValue) : none,
        allowCustomValue: style?.allowCustomValue !== undefined ? some(style.allowCustomValue) : none,
        onChange: style?.onChange ? some(style.onChange) : none,
        onChangeMultiple: style?.onChangeMultiple ? some(style.onChangeMultiple) : none,
        onInputValueChange: style?.onInputValueChange ? some(style.onInputValueChange) : none,
        onOpenChange: style?.onOpenChange ? some(style.onOpenChange) : none,
    }, ComboboxRootType);
}

function createComboboxRoot(
    value: SubtypeExprOrValue<StringType>,
    items: SubtypeExprOrValue<ArrayType<ComboboxItemType>>,
    style?: ComboboxStyle
): ExprType<UIComponentType> {
    return East.value(variant("Combobox", createComboboxRoot_(value, items, style)), UIComponentType);
}

// ============================================================================
// Combobox Compound Component
// ============================================================================

/**
 * Combobox compound component for searchable dropdown selection.
 *
 * @remarks
 * Use `Combobox.Root` to create the combobox container and `Combobox.Item` for each
 * option in the dropdown. Unlike Select, users can type to filter the available options.
 *
 * @example
 * ```ts
 * import { East } from "@elaraai/east";
 * import { Combobox, UIComponentType } from "@elaraai/east-ui";
 *
 * const example = East.function([], UIComponentType, $ => {
 *     return Combobox.Root("", [
 *         Combobox.Item("us", "United States"),
 *         Combobox.Item("uk", "United Kingdom"),
 *         Combobox.Item("ca", "Canada"),
 *     ], {
 *         placeholder: "Search countries...",
 *     });
 * });
 * ```
 */
export const Combobox = {
    Root: createComboboxRoot,
    Item: createComboboxItem,
    Types: {
        Root: ComboboxRootType,
        Item: ComboboxItemType,
    },
} as const;
