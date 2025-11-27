/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    StringType,
    ArrayType,
    variant,
} from "@elaraai/east";

import { SizeType } from "../../style.js";
import {
    SelectItemType,
    SelectRootType,
    type SelectItemStyle,
    type SelectStyle,
} from "./types.js";
import { UIComponentType } from "../../component.js";

// Re-export types
export {
    SelectItemType,
    SelectRootType,
    type SelectItemStyle,
    type SelectStyle,
} from "./types.js";

// ============================================================================
// Select Item Function
// ============================================================================

/**
 * Creates a SelectItem with value, label, and optional styling.
 *
 * @param value - The value submitted when this item is selected
 * @param label - The display text shown to the user
 * @param style - Optional styling configuration
 * @returns An East expression representing the select item
 *
 * @example
 * ```ts
 * import { Select } from "@elaraai/east-ui";
 *
 * // Simple item
 * const item = Select.Item("us", "United States");
 *
 * // Disabled item
 * const disabled = Select.Item("restricted", "Restricted Option", {
 *   disabled: true,
 * });
 * ```
 */
function createSelectItem(
    value: SubtypeExprOrValue<StringType>,
    label: SubtypeExprOrValue<StringType>,
    style?: SelectItemStyle
): ExprType<SelectItemType> {
    const toBoolOption = (val: SelectItemStyle["disabled"]) => {
        if (val === undefined) return variant("none", null);
        return variant("some", val);
    };

    return East.value({
        value: value,
        label: label,
        disabled: toBoolOption(style?.disabled),
    }, SelectItemType);
}

// ============================================================================
// Select Root Function
// ============================================================================

/**
 * Creates a Select component with value, items, and optional styling.
 *
 * @param value - Currently selected value (null/undefined for no selection)
 * @param items - Array of selectable items
 * @param style - Optional styling configuration
 * @returns An East expression representing the select component
 *
 * @remarks
 * Select is a dropdown control for choosing from predefined options.
 *
 * @example
 * ```ts
 * import { Select } from "@elaraai/east-ui";
 *
 * const countries = Select.Root(null, [
 *   Select.Item("us", "United States"),
 *   Select.Item("uk", "United Kingdom"),
 *   Select.Item("ca", "Canada"),
 * ], {
 *   placeholder: "Select a country",
 * });
 * ```
 */
function createSelectRoot(
    value: SubtypeExprOrValue<StringType>,
    items: SubtypeExprOrValue<ArrayType<SelectItemType>>,
    style?: SelectStyle
): ExprType<UIComponentType> {
    const toStringOption = (val: SubtypeExprOrValue<StringType> | null | undefined) => {
        if (val === undefined || val === null) return variant("none", null);
        return variant("some", val);
    };

    const toBoolOption = (val: SelectStyle["disabled"]) => {
        if (val === undefined) return variant("none", null);
        return variant("some", val);
    };

    const sizeValue = style?.size
        ? (typeof style.size === "string"
            ? East.value(variant(style.size, null), SizeType)
            : style.size)
        : undefined;

    return East.value(variant("Select", {
        value: toStringOption(value),
        items: East.value(items, ArrayType(SelectItemType)),
        placeholder: toStringOption(style?.placeholder),
        multiple: toBoolOption(style?.multiple),
        disabled: toBoolOption(style?.disabled),
        size: sizeValue ? variant("some", sizeValue) : variant("none", null),
    }), UIComponentType);
}

// ============================================================================
// Select Compound Component
// ============================================================================

/**
 * Select compound component for dropdown selection.
 *
 * @remarks
 * Use `Select.Root` to create the select container and `Select.Item` for each
 * option in the dropdown.
 *
 * @example
 * ```ts
 * import { Select } from "@elaraai/east-ui";
 *
 * const select = Select.Root(null, [
 *   Select.Item("us", "United States"),
 *   Select.Item("uk", "United Kingdom"),
 * ], {
 *   placeholder: "Select a country",
 * });
 * ```
 */
export const Select = {
    Root: createSelectRoot,
    Item: createSelectItem,
    Types: {
        Root: SelectRootType,
        Item: SelectItemType,
    },
} as const;
