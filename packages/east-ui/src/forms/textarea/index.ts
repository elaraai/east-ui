/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    variant,
    StringType,
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import { SizeType } from "../../style.js";
import {
    TextareaType,
    TextareaResizeType,
    InputVariantType,
    type TextareaStyle,
} from "./types.js";

// Re-export types
export {
    TextareaType,
    TextareaResizeType,
    InputVariantType,
    type TextareaStyle,
    type TextareaResizeLiteral,
    type InputVariantLiteral,
} from "./types.js";

// ============================================================================
// Textarea Factory
// ============================================================================

/**
 * Creates a Textarea component.
 *
 * @param value - The current text value
 * @param style - Optional style and configuration options
 * @returns An East expression representing the Textarea component
 *
 * @example
 * ```ts
 * import { Textarea } from "@elaraai/east-ui";
 *
 * // Basic textarea
 * const textarea = Textarea.Root("", {
 *   placeholder: "Enter description...",
 *   rows: 4,
 * });
 *
 * // Auto-resizing textarea
 * const autoResizeTextarea = Textarea.Root("", {
 *   placeholder: "Start typing...",
 *   autoresize: true,
 *   variant: "outline",
 * });
 *
 * // Fixed size textarea
 * const fixedTextarea = Textarea.Root("", {
 *   rows: 6,
 *   resize: "none",
 *   maxLength: 500,
 * });
 * ```
 */
function createTextarea(
    value: SubtypeExprOrValue<typeof StringType>,
    style?: TextareaStyle
): ExprType<UIComponentType> {
    // Convert string literal variants to East values
    const variantValue = style?.variant
        ? (typeof style.variant === "string"
            ? East.value(variant(style.variant, null), InputVariantType)
            : style.variant)
        : undefined;

    const sizeValue = style?.size
        ? (typeof style.size === "string"
            ? East.value(variant(style.size, null), SizeType)
            : style.size)
        : undefined;

    const resizeValue = style?.resize
        ? (typeof style.resize === "string"
            ? East.value(variant(style.resize, null), TextareaResizeType)
            : style.resize)
        : undefined;

    // Convert number to bigint for IntegerType fields
    const rowsValue = style?.rows !== undefined
        ? (typeof style.rows === "number" ? BigInt(style.rows) : style.rows)
        : undefined;
    const maxLengthValue = style?.maxLength !== undefined
        ? (typeof style.maxLength === "number" ? BigInt(style.maxLength) : style.maxLength)
        : undefined;

    return East.value(variant("Textarea", {
        value: value,
        placeholder: style?.placeholder !== undefined ? variant("some", style.placeholder) : variant("none", null),
        variant: variantValue ? variant("some", variantValue) : variant("none", null),
        size: sizeValue ? variant("some", sizeValue) : variant("none", null),
        resize: resizeValue ? variant("some", resizeValue) : variant("none", null),
        rows: rowsValue !== undefined ? variant("some", rowsValue) : variant("none", null),
        disabled: style?.disabled !== undefined ? variant("some", style.disabled) : variant("none", null),
        readOnly: style?.readOnly !== undefined ? variant("some", style.readOnly) : variant("none", null),
        invalid: style?.invalid !== undefined ? variant("some", style.invalid) : variant("none", null),
        required: style?.required !== undefined ? variant("some", style.required) : variant("none", null),
        maxLength: maxLengthValue !== undefined ? variant("some", maxLengthValue) : variant("none", null),
        autoresize: style?.autoresize !== undefined ? variant("some", style.autoresize) : variant("none", null),
    }), UIComponentType);
}

// ============================================================================
// Textarea Namespace Export
// ============================================================================

/**
 * Textarea component namespace.
 *
 * @remarks
 * Textarea provides a multi-line text input control for longer text content.
 *
 * @example
 * ```ts
 * import { Textarea } from "@elaraai/east-ui";
 *
 * // Simple textarea
 * const textarea = Textarea.Root("", {
 *   placeholder: "Enter your message...",
 * });
 *
 * // Textarea with constraints
 * const constrainedTextarea = Textarea.Root("", {
 *   rows: 5,
 *   maxLength: 1000,
 *   resize: "vertical",
 * });
 *
 * // Styled textarea
 * const styledTextarea = Textarea.Root("", {
 *   variant: "flushed",
 *   size: "lg",
 *   placeholder: "Notes...",
 * });
 * ```
 */
export const Textarea = {
    /**
     * Creates a Textarea component.
     *
     * @param value - The current text value
     * @param style - Optional style and configuration options
     * @returns An East expression representing the Textarea component
     *
     * @example
     * ```ts
     * import { East } from "@elaraai/east";
     * import { Textarea, UIComponentType } from "@elaraai/east-ui";
     *
     * const example = East.function([], UIComponentType, $ => {
     *     return Textarea.Root("Hello world", {
     *         placeholder: "Enter description",
     *         rows: 4n,
     *     });
     * });
     * ```
     */
    Root: createTextarea,
    Types: {
        /**
         * Type for Textarea component data.
         *
         * @property value - Current text content
         * @property placeholder - Placeholder text when empty
         * @property rows - Number of visible text rows
         * @property resize - Resize behavior (none, vertical, horizontal, both)
         */
        Textarea: TextareaType,
        /**
         * Resize behavior options for Textarea.
         *
         * @property none - No resizing allowed
         * @property vertical - Only vertical resizing
         * @property horizontal - Only horizontal resizing
         * @property both - Both directions allowed
         */
        Resize: TextareaResizeType,
    },
} as const;
