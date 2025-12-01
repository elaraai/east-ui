/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType,
    East,
    VariantType,
    OptionType,
    StructType,
    StringType,
    IntegerType,
    FloatType,
    DateTimeType,
    BooleanType,
    NullType,
    variant,
    type SubtypeExprOrValue,
} from "@elaraai/east";

import { SizeType } from "../../style.js";
import type { SizeLiteral } from "../../style.js";

// ============================================================================
// Input Variant Type
// ============================================================================

/**
 * Variant type for Input appearance styles.
 *
 * @remarks
 * Create instances using the {@link InputVariant} function.
 *
 * @property outline - Outlined input with border (default)
 * @property subtle - Input with muted background
 * @property flushed - Underlined input without border
 */
export const InputVariantType = VariantType({
    outline: NullType,
    subtle: NullType,
    flushed: NullType,
});

/**
 * Type representing input variant values.
 */
export type InputVariantType = typeof InputVariantType;

/**
 * String literal type for input variant values.
 */
export type InputVariantLiteral = "outline" | "subtle" | "flushed";

/**
 * Creates an input variant expression.
 *
 * @param inputVariant - The input variant style
 * @returns An East expression representing the input variant
 *
 * @example
 * ```ts
 * import { InputVariant } from "@elaraai/east-ui";
 *
 * InputVariant("outline");
 * InputVariant("subtle");
 * ```
 */
export function InputVariant(inputVariant: "outline" | "subtle" | "flushed"): ExprType<InputVariantType> {
    return East.value(variant(inputVariant, null), InputVariantType);
}

// ============================================================================
// String Input Type
// ============================================================================

/**
 * Type for String input component data.
 *
 * @property value - The current string value
 * @property placeholder - Placeholder text when empty
 * @property variant - Input appearance variant
 * @property size - Size of the input
 * @property maxLength - Maximum character count
 * @property pattern - Regex pattern for validation
 * @property disabled - Whether the input is disabled
 */
export const StringInputType = StructType({
    value: StringType,
    placeholder: OptionType(StringType),
    variant: OptionType(InputVariantType),
    size: OptionType(SizeType),
    maxLength: OptionType(IntegerType),
    pattern: OptionType(StringType),
    disabled: OptionType(BooleanType),
});

export type StringInputType = typeof StringInputType;

export interface StringInputStyle {
    placeholder?: SubtypeExprOrValue<StringType>;
    variant?: SubtypeExprOrValue<InputVariantType> | InputVariantLiteral;
    size?: SubtypeExprOrValue<SizeType> | SizeLiteral;
    maxLength?: SubtypeExprOrValue<IntegerType>;
    pattern?: SubtypeExprOrValue<StringType>;
    disabled?: SubtypeExprOrValue<BooleanType>;
}

// ============================================================================
// Integer Input Type
// ============================================================================

/**
 * Type for Integer input component data.
 *
 * @property value - The current integer value
 * @property min - Minimum allowed value
 * @property max - Maximum allowed value
 * @property step - Step increment for stepper controls
 * @property variant - Input appearance variant
 * @property size - Size of the input
 * @property disabled - Whether the input is disabled
 */
export const IntegerInputType = StructType({
    value: IntegerType,
    min: OptionType(IntegerType),
    max: OptionType(IntegerType),
    step: OptionType(IntegerType),
    variant: OptionType(InputVariantType),
    size: OptionType(SizeType),
    disabled: OptionType(BooleanType),
});

export type IntegerInputType = typeof IntegerInputType;

export interface IntegerInputStyle {
    min?: SubtypeExprOrValue<IntegerType>;
    max?: SubtypeExprOrValue<IntegerType>;
    step?: SubtypeExprOrValue<IntegerType>;
    variant?: SubtypeExprOrValue<InputVariantType> | InputVariantLiteral;
    size?: SubtypeExprOrValue<SizeType> | SizeLiteral;
    disabled?: SubtypeExprOrValue<BooleanType>;
}

// ============================================================================
// Float Input Type
// ============================================================================

/**
 * Type for Float input component data.
 *
 * @property value - The current float value
 * @property min - Minimum allowed value
 * @property max - Maximum allowed value
 * @property step - Step increment for stepper controls
 * @property precision - Number of decimal places
 * @property variant - Input appearance variant
 * @property size - Size of the input
 * @property disabled - Whether the input is disabled
 */
export const FloatInputType = StructType({
    value: FloatType,
    min: OptionType(FloatType),
    max: OptionType(FloatType),
    step: OptionType(FloatType),
    precision: OptionType(IntegerType),
    variant: OptionType(InputVariantType),
    size: OptionType(SizeType),
    disabled: OptionType(BooleanType),
});

export type FloatInputType = typeof FloatInputType;

export interface FloatInputStyle {
    min?: SubtypeExprOrValue<FloatType>;
    max?: SubtypeExprOrValue<FloatType>;
    step?: SubtypeExprOrValue<FloatType>;
    precision?: SubtypeExprOrValue<IntegerType>;
    variant?: SubtypeExprOrValue<InputVariantType> | InputVariantLiteral;
    size?: SubtypeExprOrValue<SizeType> | SizeLiteral;
    disabled?: SubtypeExprOrValue<BooleanType>;
}

// ============================================================================
// DateTime Input Type
// ============================================================================

/**
 * Type for DateTime input component data.
 *
 * @property value - The current DateTime value
 * @property min - Minimum allowed date/time
 * @property max - Maximum allowed date/time
 * @property showTime - Whether to show time picker
 * @property format - Display format string
 * @property variant - Input appearance variant
 * @property size - Size of the input
 * @property disabled - Whether the input is disabled
 */
export const DateTimeInputType = StructType({
    value: DateTimeType,
    min: OptionType(DateTimeType),
    max: OptionType(DateTimeType),
    showTime: OptionType(BooleanType),
    format: OptionType(StringType),
    variant: OptionType(InputVariantType),
    size: OptionType(SizeType),
    disabled: OptionType(BooleanType),
});

export type DateTimeInputType = typeof DateTimeInputType;

export interface DateTimeInputStyle {
    min?: SubtypeExprOrValue<DateTimeType> | Date;
    max?: SubtypeExprOrValue<DateTimeType> | Date;
    showTime?: SubtypeExprOrValue<BooleanType> | boolean;
    format?: SubtypeExprOrValue<StringType> | string;
    variant?: SubtypeExprOrValue<InputVariantType> | InputVariantLiteral;
    size?: SubtypeExprOrValue<SizeType> | SizeLiteral;
    disabled?: SubtypeExprOrValue<BooleanType> | boolean;
}

// ============================================================================
// Input Root Type
// ============================================================================

/**
 * Unified Input type as a variant of all input types.
 *
 * @property String - String text input
 * @property Integer - Integer number input
 * @property Float - Float number input
 * @property DateTime - Date/time picker input
 */
export const InputRootType = VariantType({
    String: StringInputType,
    Integer: IntegerInputType,
    Float: FloatInputType,
    DateTime: DateTimeInputType,
});

export type InputRootType = typeof InputRootType;
