/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    OptionType,
    StructType,
    StringType,
    BooleanType,
    variant,
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import { type FieldStyle } from "./types.js";

// Re-export types
export { type FieldStyle } from "./types.js";

// ============================================================================
// Field Type
// ============================================================================

/**
 * The concrete East type for Field component data.
 *
 * @remarks
 * Field wraps a form control (Input, Select, Checkbox, etc.) with
 * a label and optional helper/error text for form field presentation.
 *
 * @property label - Label text for the field
 * @property control - The form control component (Input, Select, etc.)
 * @property helperText - Optional descriptive help text
 * @property errorText - Optional validation error message
 * @property required - Whether the field is required
 * @property disabled - Whether the field is disabled
 * @property invalid - Whether the field is in an invalid state
 * @property readOnly - Whether the field is read-only
 */
export const FieldType = StructType({
    label: StringType,
    control: UIComponentType,
    helperText: OptionType(StringType),
    errorText: OptionType(StringType),
    required: OptionType(BooleanType),
    disabled: OptionType(BooleanType),
    invalid: OptionType(BooleanType),
    readOnly: OptionType(BooleanType),
});

/**
 * Type representing the Field component structure.
 */
export type FieldType = typeof FieldType;

// ============================================================================
// Field Function
// ============================================================================

/**
 * Creates a Field component wrapping a form control with label and messages.
 *
 * @param label - Label text for the field
 * @param control - The form control component (Input, Select, Checkbox, etc.)
 * @param style - Optional configuration for helper text, error text, and states
 * @returns An East expression representing the field component
 *
 * @remarks
 * Field provides a consistent way to present form controls with labels,
 * helper text, and validation messages. It wraps any form control component.
 *
 * @example
 * ```ts
 * import { Field, Input } from "@elaraai/east-ui";
 *
 * // Basic field with helper text
 * const emailField = Field.Root(
 *   "Email",
 *   Input.String({ placeholder: "you@example.com" }),
 *   { helperText: "We'll never share your email." }
 * );
 *
 * // Required field with validation error
 * const passwordField = Field.Root(
 *   "Password",
 *   Input.String({ placeholder: "Enter password" }),
 *   {
 *     required: true,
 *     invalid: hasError,
 *     errorText: "Password is required",
 *   }
 * );
 *
 * // Read-only field
 * const readOnlyField = Field.Root(
 *   "Account ID",
 *   Input.String({ value: accountId }),
 *   { readOnly: true }
 * );
 * ```
 */
function createField(
    label: SubtypeExprOrValue<StringType>,
    control: ExprType<UIComponentType>,
    style?: FieldStyle
): ExprType<UIComponentType> {
    const toStringOption = (val: SubtypeExprOrValue<StringType> | undefined) => {
        if (val === undefined) return variant("none", null);
        return variant("some", val);
    };

    const toBoolOption = (val: SubtypeExprOrValue<BooleanType> | undefined) => {
        if (val === undefined) return variant("none", null);
        return variant("some", val);
    };

    return East.value(variant("Field", {
        label: label,
        control: control,
        helperText: toStringOption(style?.helperText),
        errorText: toStringOption(style?.errorText),
        required: toBoolOption(style?.required),
        disabled: toBoolOption(style?.disabled),
        invalid: toBoolOption(style?.invalid),
        readOnly: toBoolOption(style?.readOnly),
    }), UIComponentType);
}

/**
 * Field component for wrapping form controls with labels and messages.
 *
 * @remarks
 * Use `Field.Root(label, control, style)` to create a field wrapper.
 * The control can be any form component like Input, Select, Checkbox, etc.
 *
 * @example
 * ```ts
 * import { Field, Input, Checkbox } from "@elaraai/east-ui";
 *
 * // Text input field
 * const nameField = Field.Root(
 *   "Full Name",
 *   Input.String({ placeholder: "Enter your name" }),
 *   { required: true }
 * );
 *
 * // Checkbox field
 * const termsField = Field.Root(
 *   "Terms",
 *   Checkbox.Root(accepted, { label: "I accept the terms" })
 * );
 * ```
 */
export const Field = {
    Root: createField,
    Types: {
        Field: FieldType,
    },
} as const;
