/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type SubtypeExprOrValue,
    OptionType,
    StructType,
    StringType,
    BooleanType,
    ArrayType,
    NullType,
    FunctionType,
} from "@elaraai/east";

import { SizeType } from "../../style.js";
import type { SizeLiteral } from "../../style.js";

// ============================================================================
// Combobox Item Type
// ============================================================================

/**
 * Type for Combobox item data.
 *
 * @remarks
 * Each item in a Combobox dropdown has a value and display label.
 *
 * @property value - The value submitted when this item is selected
 * @property label - The display text shown to the user
 * @property disabled - Whether this item is disabled
 */
export const ComboboxItemType = StructType({
    value: StringType,
    label: StringType,
    disabled: OptionType(BooleanType),
});

export type ComboboxItemType = typeof ComboboxItemType;

/**
 * TypeScript interface for Combobox item style options.
 *
 * @remarks
 * Use this interface when creating Combobox items with styling.
 *
 * @property disabled - Whether this item is disabled
 */
export interface ComboboxItemStyle {
    /** Whether this item is disabled */
    disabled?: SubtypeExprOrValue<BooleanType>;
}

// ============================================================================
// Combobox Root Type
// ============================================================================

/**
 * Type for Combobox component data.
 *
 * @remarks
 * Combobox is a searchable dropdown selection control that combines a text input
 * with a listbox, allowing users to type to filter options.
 *
 * @property value - Currently selected value (none if nothing selected)
 * @property items - Array of selectable items
 * @property placeholder - Placeholder text when nothing is selected
 * @property multiple - Whether multiple selection is allowed
 * @property disabled - Whether the combobox is disabled
 * @property size - Size of the combobox control
 * @property allowCustomValue - Whether to accept values not in the list
 * @property onChange - Callback triggered when selection changes (single select)
 * @property onChangeMultiple - Callback triggered when selection changes (multi-select)
 * @property onInputValueChange - Callback triggered when input text changes
 * @property onOpenChange - Callback triggered when dropdown opens/closes
 */
export const ComboboxRootType = StructType({
    value: OptionType(StringType),
    items: ArrayType(ComboboxItemType),
    placeholder: OptionType(StringType),
    multiple: OptionType(BooleanType),
    disabled: OptionType(BooleanType),
    size: OptionType(SizeType),
    allowCustomValue: OptionType(BooleanType),
    onChange: OptionType(FunctionType([StringType], NullType)),
    onChangeMultiple: OptionType(FunctionType([ArrayType(StringType)], NullType)),
    onInputValueChange: OptionType(FunctionType([StringType], NullType)),
    onOpenChange: OptionType(FunctionType([BooleanType], NullType)),
});

export type ComboboxRootType = typeof ComboboxRootType;

/**
 * TypeScript interface for Combobox component style options.
 *
 * @remarks
 * Use this interface when creating Combobox components with styling.
 *
 * @property placeholder - Placeholder text when nothing is selected
 * @property multiple - Whether multiple selection is allowed
 * @property disabled - Whether the combobox is disabled
 * @property size - Size of the combobox control
 * @property allowCustomValue - Whether to accept values not in the list
 * @property onChange - Callback triggered when selection changes (single select)
 * @property onChangeMultiple - Callback triggered when selection changes (multi-select)
 * @property onInputValueChange - Callback triggered when input text changes
 * @property onOpenChange - Callback triggered when dropdown opens/closes
 */
export interface ComboboxStyle {
    /** Placeholder text when nothing is selected */
    placeholder?: SubtypeExprOrValue<StringType>;
    /** Whether multiple selection is allowed */
    multiple?: SubtypeExprOrValue<BooleanType>;
    /** Whether the combobox is disabled */
    disabled?: SubtypeExprOrValue<BooleanType>;
    /** Size of the combobox control (xs, sm, md, lg) */
    size?: SubtypeExprOrValue<SizeType> | SizeLiteral;
    /** Whether to accept values not in the list */
    allowCustomValue?: SubtypeExprOrValue<BooleanType>;
    /** Callback triggered when selection changes (single select) */
    onChange?: SubtypeExprOrValue<FunctionType<[StringType], NullType>>;
    /** Callback triggered when selection changes (multi-select) */
    onChangeMultiple?: SubtypeExprOrValue<FunctionType<[ArrayType<StringType>], NullType>>;
    /** Callback triggered when input text changes */
    onInputValueChange?: SubtypeExprOrValue<FunctionType<[StringType], NullType>>;
    /** Callback triggered when dropdown opens/closes */
    onOpenChange?: SubtypeExprOrValue<FunctionType<[BooleanType], NullType>>;
}
