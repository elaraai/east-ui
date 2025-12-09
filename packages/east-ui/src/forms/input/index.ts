/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    StringType,
    IntegerType,
    FloatType,
    DateTimeType,
    BooleanType,
    variant,
    some,
    none,
} from "@elaraai/east";

import { SizeType } from "../../style.js";
import { UIComponentType } from "../../component.js";
import {
    InputVariantType,
    InputVariant,
    StringInputType,
    IntegerInputType,
    FloatInputType,
    DateTimeInputType,
    type StringInputStyle,
    type IntegerInputStyle,
    type FloatInputStyle,
    type DateTimeInputStyle,
} from "./types.js";

// Re-export types
export {
    InputVariantType,
    InputVariant,
    StringInputType,
    IntegerInputType,
    FloatInputType,
    DateTimeInputType,
    InputRootType,
    type StringInputStyle,
    type IntegerInputStyle,
    type FloatInputStyle,
    type DateTimeInputStyle,
    type InputVariantLiteral,
} from "./types.js";

// ============================================================================
// Input Functions
// ============================================================================

function StringInput(
    value: SubtypeExprOrValue<StringType>,
    style?: StringInputStyle
): ExprType<UIComponentType> {
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

    return East.value(variant("StringInput", {
        value: value,
        placeholder: style?.placeholder ? some(style.placeholder) : none,
        variant: variantValue ? some(variantValue) : none,
        size: sizeValue ? some(sizeValue) : none,
        maxLength: style?.maxLength !== undefined ? some(style.maxLength) : none,
        pattern: style?.pattern ? some(style.pattern) : none,
        disabled: style?.disabled !== undefined ? some(style.disabled) : none,
        onChange: style?.onChange ? some(style.onChange) : none,
        onBlur: style?.onBlur ? some(style.onBlur) : none,
        onFocus: style?.onFocus ? some(style.onFocus) : none,
    }), UIComponentType);
}

function IntegerInput(
    value: SubtypeExprOrValue<IntegerType>,
    style?: IntegerInputStyle
): ExprType<UIComponentType> {
    const toIntegerOption = (val: SubtypeExprOrValue<IntegerType> | undefined) => {
        if (val === undefined) return none;
        return some(val);
    };

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

    return East.value(variant("IntegerInput", {
        value: value,
        min: toIntegerOption(style?.min),
        max: toIntegerOption(style?.max),
        step: toIntegerOption(style?.step),
        variant: variantValue ? some(variantValue) : none,
        size: sizeValue ? some(sizeValue) : none,
        disabled: style?.disabled !== undefined ? some(style.disabled) : none,
        onChange: style?.onChange ? some(style.onChange) : none,
        onBlur: style?.onBlur ? some(style.onBlur) : none,
        onFocus: style?.onFocus ? some(style.onFocus) : none,
    }), UIComponentType);
}

function FloatInput(
    value: SubtypeExprOrValue<FloatType>,
    style?: FloatInputStyle
): ExprType<UIComponentType> {
    const toFloatOption = (val: SubtypeExprOrValue<FloatType> | undefined) => {
        if (val === undefined) return none;
        return some(val);
    };

    const toIntegerOption = (val: SubtypeExprOrValue<IntegerType> | undefined) => {
        if (val === undefined) return none;
        return some(val);
    };

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

    return East.value(variant("FloatInput", {
        value: value,
        min: toFloatOption(style?.min),
        max: toFloatOption(style?.max),
        step: toFloatOption(style?.step),
        precision: toIntegerOption(style?.precision),
        variant: variantValue ? some(variantValue) : none,
        size: sizeValue ? some(sizeValue) : none,
        disabled: style?.disabled !== undefined ? some(style.disabled) : none,
        onChange: style?.onChange ? some(style.onChange) : none,
        onBlur: style?.onBlur ? some(style.onBlur) : none,
        onFocus: style?.onFocus ? some(style.onFocus) : none,
    }), UIComponentType);
}

function DateTimeInput(
    value: SubtypeExprOrValue<DateTimeType>,
    style?: DateTimeInputStyle
): ExprType<UIComponentType> {
    const toDateTimeOption = (val: SubtypeExprOrValue<DateTimeType> | Date | undefined) => {
        if (val === undefined) return none;
        if (val instanceof Date) return some(val);
        return some(val);
    };

    const toStringOption = (val: SubtypeExprOrValue<StringType> | string | undefined) => {
        if (val === undefined) return none;
        return some(val);
    };

    const toBoolOption = (val: SubtypeExprOrValue<BooleanType> | boolean | undefined) => {
        if (val === undefined) return none;
        return some(val);
    };

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

    return East.value(variant("DateTimeInput", {
        value: value,
        min: toDateTimeOption(style?.min),
        max: toDateTimeOption(style?.max),
        showTime: toBoolOption(style?.showTime),
        format: toStringOption(style?.format),
        variant: variantValue ? some(variantValue) : none,
        size: sizeValue ? some(sizeValue) : none,
        disabled: toBoolOption(style?.disabled),
        onChange: style?.onChange ? some(style.onChange) : none,
        onBlur: style?.onBlur ? some(style.onBlur) : none,
        onFocus: style?.onFocus ? some(style.onFocus) : none,
    }), UIComponentType);
}

/**
 * Input compound component for form data entry.
 *
 * @remarks
 * Input provides typed input components for different data types.
 * Each input type has specific validation and formatting options.
 *
 * @example
 * ```ts
 * import { East } from "@elaraai/east";
 * import { Input, UIComponentType } from "@elaraai/east-ui";
 *
 * // String input
 * const stringExample = East.function([], UIComponentType, $ => {
 *     return Input.String("John", {
 *         placeholder: "Enter name",
 *         variant: "outline",
 *     });
 * });
 *
 * // Integer input with constraints
 * const integerExample = East.function([], UIComponentType, $ => {
 *     return Input.Integer(25n, {
 *         min: 0n,
 *         max: 150n,
 *     });
 * });
 *
 * // Float input with precision
 * const floatExample = East.function([], UIComponentType, $ => {
 *     return Input.Float(19.99, {
 *         min: 0,
 *         precision: 2n,
 *     });
 * });
 *
 * // DateTime input
 * const dateExample = East.function([], UIComponentType, $ => {
 *     return Input.DateTime(new Date(), {
 *         showTime: true,
 *         format: "yyyy-MM-dd HH:mm",
 *     });
 * });
 * ```
 */
export const Input = {
    String: StringInput,
    Integer: IntegerInput,
    Float: FloatInput,
    DateTime: DateTimeInput,
    /**
     * Creates an input variant expression.
     *
     * @param inputVariant - The input variant style
     * @returns An East expression representing the input variant
     *
     * @example
     * ```ts
     * import { East } from "@elaraai/east";
     * import { Input, UIComponentType } from "@elaraai/east-ui";
     *
     * const example = East.function([], UIComponentType, $ => {
     *     return Input.String("", {
     *         variant: Input.Variant("outline"),
     *     });
     * });
     * ```
     */
    Variant: InputVariant,
    Types: {
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
        String: StringInputType,
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
        Integer: IntegerInputType,
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
        Float: FloatInputType,
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
        DateTime: DateTimeInputType,
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
        Variant: InputVariantType,
    },
} as const;
