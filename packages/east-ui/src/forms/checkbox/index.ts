/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    StringType,
    BooleanType,
    variant,
} from "@elaraai/east";

import { SizeType, ColorSchemeType } from "../../style.js";
import { UIComponentType } from "../../component.js";
import { CheckboxType, type CheckboxStyle } from "./types.js";

// Re-export types
export { CheckboxType, type CheckboxStyle } from "./types.js";

// ============================================================================
// Checkbox Function
// ============================================================================

/**
 * Creates a Checkbox component with checked state and optional styling.
 *
 * @param checked - Whether the checkbox is checked
 * @param style - Optional styling configuration
 * @returns An East expression representing the checkbox component
 *
 * @remarks
 * Checkbox is a form control for boolean selections. It supports labels,
 * indeterminate state for partial selections, and various sizes and colors.
 *
 * @example
 * ```ts
 * import { Checkbox } from "@elaraai/east-ui";
 *
 * // Simple checkbox
 * const checkbox = Checkbox.Root(true);
 *
 * // Checkbox with label
 * const labeled = Checkbox.Root(false, {
 *   label: "Accept terms and conditions",
 * });
 *
 * // Styled checkbox
 * const styled = Checkbox.Root(true, {
 *   label: "Enable notifications",
 *   colorPalette: "blue",
 *   size: "md",
 * });
 *
 * // Indeterminate checkbox (for parent of partially selected children)
 * const indeterminate = Checkbox.Root(false, {
 *   label: "Select all",
 *   indeterminate: true,
 * });
 * ```
 */
function createCheckbox(
    checked: SubtypeExprOrValue<BooleanType>,
    style?: CheckboxStyle
): ExprType<UIComponentType> {
    const toStringOption = (val: SubtypeExprOrValue<StringType> | undefined) => {
        if (val === undefined) return variant("none", null);
        return variant("some", val);
    };

    const toBoolOption = (val: SubtypeExprOrValue<BooleanType> | undefined) => {
        if (val === undefined) return variant("none", null);
        return variant("some", val);
    };

    const colorPaletteValue = style?.colorPalette
        ? (typeof style.colorPalette === "string"
            ? East.value(variant(style.colorPalette, null), ColorSchemeType)
            : style.colorPalette)
        : undefined;

    const sizeValue = style?.size
        ? (typeof style.size === "string"
            ? East.value(variant(style.size, null), SizeType)
            : style.size)
        : undefined;

    return East.value(variant("Checkbox", {
        checked: checked,
        label: toStringOption(style?.label),
        indeterminate: toBoolOption(style?.indeterminate),
        disabled: toBoolOption(style?.disabled),
        colorPalette: colorPaletteValue ? variant("some", colorPaletteValue) : variant("none", null),
        size: sizeValue ? variant("some", sizeValue) : variant("none", null),
    }), UIComponentType);
}

/**
 * Checkbox component for boolean form selections.
 *
 * @remarks
 * Use `Checkbox.Root(checked, style)` to create a checkbox, or access `Checkbox.Types.Checkbox` for the East type.
 */
export const Checkbox = {
    /**
     * Creates a Checkbox component with checked state and optional styling.
     *
     * @param checked - Whether the checkbox is checked
     * @param style - Optional styling configuration
     * @returns An East expression representing the checkbox component
     *
     * @remarks
     * Checkbox is a form control for boolean selections. It supports labels,
     * indeterminate state for partial selections, and various sizes and colors.
     *
     * @example
     * ```ts
     * import { East } from "@elaraai/east";
     * import { Checkbox, UIComponentType } from "@elaraai/east-ui";
     *
     * const example = East.function([], UIComponentType, $ => {
     *     return Checkbox.Root(true, {
     *         label: "Enable notifications",
     *         colorPalette: "blue",
     *         size: "md",
     *     });
     * });
     * ```
     */
    Root: createCheckbox,
    Types: {
        /**
         * Type for Checkbox component data.
         *
         * @remarks
         * Checkbox is a form control for boolean selections with optional label.
         *
         * @property checked - Whether the checkbox is checked
         * @property label - Optional label text displayed next to the checkbox
         * @property indeterminate - Whether to show indeterminate state (partial selection)
         * @property disabled - Whether the checkbox is disabled
         * @property colorPalette - Color scheme for the checkbox
         * @property size - Size of the checkbox
         */
        Checkbox: CheckboxType,
    },
} as const;
