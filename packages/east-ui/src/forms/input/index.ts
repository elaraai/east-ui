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
    const toStringOption = (val: SubtypeExprOrValue<StringType> | undefined) => {
        if (val === undefined) return variant("none", null);
        return variant("some", val);
    };

    const toIntegerOption = (val: SubtypeExprOrValue<IntegerType> | undefined) => {
        if (val === undefined) return variant("none", null);
        return variant("some", val);
    };

    const toBoolOption = (val: SubtypeExprOrValue<BooleanType> | undefined) => {
        if (val === undefined) return variant("none", null);
        return variant("some", val);
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

    return East.value(variant("StringInput", {
        value: value,
        placeholder: toStringOption(style?.placeholder),
        variant: variantValue ? variant("some", variantValue) : variant("none", null),
        size: sizeValue ? variant("some", sizeValue) : variant("none", null),
        maxLength: toIntegerOption(style?.maxLength),
        pattern: toStringOption(style?.pattern),
        disabled: toBoolOption(style?.disabled),
    }), UIComponentType);
}

function IntegerInput(
    value: SubtypeExprOrValue<IntegerType>,
    style?: IntegerInputStyle
): ExprType<UIComponentType> {
    const toIntegerOption = (val: SubtypeExprOrValue<IntegerType> | undefined) => {
        if (val === undefined) return variant("none", null);
        if (typeof val === "number") return variant("some", BigInt(val));
        if (typeof val === "bigint") return variant("some", val);
        return variant("some", val);
    };

    const toBoolOption = (val: SubtypeExprOrValue<BooleanType> | undefined) => {
        if (val === undefined) return variant("none", null);
        if (typeof val === "boolean") return variant("some", val);
        return variant("some", val);
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
        variant: variantValue ? variant("some", variantValue) : variant("none", null),
        size: sizeValue ? variant("some", sizeValue) : variant("none", null),
        disabled: toBoolOption(style?.disabled),
    }), UIComponentType);
}

function FloatInput(
    value: SubtypeExprOrValue<FloatType>,
    style?: FloatInputStyle
): ExprType<UIComponentType> {
    const toFloatOption = (val: SubtypeExprOrValue<FloatType> | undefined) => {
        if (val === undefined) return variant("none", null);
        if (typeof val === "number") return variant("some", val);
        return variant("some", val);
    };

    const toIntegerOption = (val: SubtypeExprOrValue<IntegerType> | undefined) => {
        if (val === undefined) return variant("none", null);
        if (typeof val === "number") return variant("some", BigInt(val));
        if (typeof val === "bigint") return variant("some", val);
        return variant("some", val);
    };

    const toBoolOption = (val: SubtypeExprOrValue<BooleanType> | undefined) => {
        if (val === undefined) return variant("none", null);
        if (typeof val === "boolean") return variant("some", val);
        return variant("some", val);
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
        variant: variantValue ? variant("some", variantValue) : variant("none", null),
        size: sizeValue ? variant("some", sizeValue) : variant("none", null),
        disabled: toBoolOption(style?.disabled),
    }), UIComponentType);
}

function DateTimeInput(
    value: SubtypeExprOrValue<DateTimeType>,
    style?: DateTimeInputStyle
): ExprType<UIComponentType> {
    const toDateTimeOption = (val: SubtypeExprOrValue<DateTimeType> | undefined) => {
        if (val === undefined) return variant("none", null);
        if (val instanceof Date) return variant("some", val);
        return variant("some", val);
    };

    const toBoolOption = (val: SubtypeExprOrValue<BooleanType> | undefined) => {
        if (val === undefined) return variant("none", null);
        if (typeof val === "boolean") return variant("some", val);
        return variant("some", val);
    };

    const toStringOption = (val: SubtypeExprOrValue<StringType> | undefined) => {
        if (val === undefined) return variant("none", null);
        if (typeof val === "string") return variant("some", val);
        return variant("some", val);
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
        variant: variantValue ? variant("some", variantValue) : variant("none", null),
        size: sizeValue ? variant("some", sizeValue) : variant("none", null),
        disabled: toBoolOption(style?.disabled),
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
 * import { Input } from "@elaraai/east-ui";
 *
 * // String input (accepts plain strings)
 * const nameInput = Input.String("John", {
 *   placeholder: "Enter name",
 *   variant: "outline",
 * });
 *
 * // Integer input with constraints
 * const ageInput = Input.Integer(East.value(25n, IntegerType), {
 *   min: 0n,
 *   max: 150n,
 * });
 *
 * // Float input with precision
 * const priceInput = Input.Float(East.value(19.99, FloatType), {
 *   min: 0,
 *   precision: 2n,
 * });
 *
 * // DateTime input
 * const dateInput = Input.DateTime(East.value(new Date(), DateTimeType), {
 *   showTime: true,
 *   format: "yyyy-MM-dd HH:mm",
 * });
 * ```
 */
export const Input = {
    String: StringInput,
    Integer: IntegerInput,
    Float: FloatInput,
    DateTime: DateTimeInput,
    Variant: InputVariant,
    Types: {
        String: StringInputType,
        Integer: IntegerInputType,
        Float: FloatInputType,
        DateTime: DateTimeInputType,
        Variant: InputVariantType,
    },
} as const;
