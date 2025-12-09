/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    variant,
    ArrayType,
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import { SizeType } from "../../style.js";
import {
    FieldsetStyleType,
    type FieldsetStyle,
} from "./types.js";

// Re-export types
export {
    FieldsetStyleType,
    type FieldsetStyle,
} from "./types.js";

// ============================================================================
// Fieldset Factory
// ============================================================================

/**
 * Creates a Fieldset component.
 *
 * @param content - Array of UI components (typically Field components)
 * @param style - Optional style and configuration options
 * @returns An East expression representing the Fieldset component
 *
 * @example
 * ```ts
 * import { East } from "@elaraai/east";
 * import { Fieldset, Field, Input, UIComponentType } from "@elaraai/east-ui";
 *
 * const example = East.function([], UIComponentType, $ => {
 *     return Fieldset.Root([
 *         Field.Root("First Name", Input.String("", { placeholder: "First name" })),
 *         Field.Root("Last Name", Input.String("", { placeholder: "Last name" })),
 *     ], {
 *         legend: "Personal Information",
 *     });
 * });
 * ```
 */
function createFieldset(
    content: SubtypeExprOrValue<ArrayType<UIComponentType>>,
    style?: FieldsetStyle
): ExprType<UIComponentType> {
    // Convert size string literal to variant
    const sizeValue = style?.size
        ? (typeof style.size === "string"
            ? East.value(variant(style.size, null), SizeType)
            : style.size)
        : undefined;

    return East.value(variant("Fieldset", {
        legend: style?.legend !== undefined ? variant("some", style.legend) : variant("none", null),
        helperText: style?.helperText !== undefined ? variant("some", style.helperText) : variant("none", null),
        errorText: style?.errorText !== undefined ? variant("some", style.errorText) : variant("none", null),
        content: content,
        disabled: style?.disabled !== undefined ? variant("some", style.disabled) : variant("none", null),
        invalid: style?.invalid !== undefined ? variant("some", style.invalid) : variant("none", null),
        style: sizeValue ? variant("some", East.value({
            size: variant("some", sizeValue),
        }, FieldsetStyleType)) : variant("none", null),
    }), UIComponentType);
}

// ============================================================================
// Fieldset Namespace Export
// ============================================================================

/**
 * Fieldset component namespace.
 *
 * @remarks
 * Fieldset groups related form fields together with a legend and optional
 * helper/error text. It renders as a native HTML `<fieldset>` element.
 */
export const Fieldset = {
    /**
     * Creates a Fieldset component.
     *
     * @param content - Array of UI components (typically Field components)
     * @param style - Optional style and configuration options
     * @returns An East expression representing the Fieldset component
     *
     * @example
     * ```ts
     * import { East } from "@elaraai/east";
     * import { Fieldset, Field, Input, UIComponentType } from "@elaraai/east-ui";
     *
     * const example = East.function([], UIComponentType, $ => {
     *     return Fieldset.Root([
     *         Field.Root("First Name", Input.String("", { placeholder: "First name" })),
     *         Field.Root("Last Name", Input.String("", { placeholder: "Last name" })),
     *     ], {
     *         legend: "Personal Information",
     *     });
     * });
     * ```
     */
    Root: createFieldset,
    Types: {
        /**
         * Style type for Fieldset component.
         *
         * @remarks
         * Contains optional styling properties for the fieldset.
         *
         * @property size - Size of the fieldset (sm, md, lg)
         */
        Style: FieldsetStyleType,
    },
} as const;
