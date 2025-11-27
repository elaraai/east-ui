/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type SubtypeExprOrValue,
    OptionType,
    StructType,
    StringType,
    BooleanType,
    ArrayType,
} from "@elaraai/east";

import { SizeType } from "../../style.js";
import type { SizeLiteral } from "../../style.js";

// ============================================================================
// Select Item Type
// ============================================================================

/**
 * Type for Select item data.
 *
 * @remarks
 * Each item in a Select dropdown has a value and display label.
 *
 * @property value - The value submitted when this item is selected
 * @property label - The display text shown to the user
 * @property disabled - Whether this item is disabled
 */
export const SelectItemType = StructType({
    value: StringType,
    label: StringType,
    disabled: OptionType(BooleanType),
});

export type SelectItemType = typeof SelectItemType;

export interface SelectItemStyle {
    disabled?: SubtypeExprOrValue<BooleanType>;
}

// ============================================================================
// Select Root Type
// ============================================================================

/**
 * Type for Select component data.
 *
 * @remarks
 * Select is a dropdown selection control for choosing from a list of options.
 *
 * @property value - Currently selected value (none if nothing selected)
 * @property items - Array of selectable items
 * @property placeholder - Placeholder text when nothing is selected
 * @property multiple - Whether multiple selection is allowed
 * @property disabled - Whether the select is disabled
 * @property size - Size of the select control
 */
export const SelectRootType = StructType({
    value: OptionType(StringType),
    items: ArrayType(SelectItemType),
    placeholder: OptionType(StringType),
    multiple: OptionType(BooleanType),
    disabled: OptionType(BooleanType),
    size: OptionType(SizeType),
});

export type SelectRootType = typeof SelectRootType;

export interface SelectStyle {
    placeholder?: SubtypeExprOrValue<StringType>;
    multiple?: SubtypeExprOrValue<BooleanType>;
    disabled?: SubtypeExprOrValue<BooleanType>;
    size?: SubtypeExprOrValue<SizeType> | SizeLiteral;
}
