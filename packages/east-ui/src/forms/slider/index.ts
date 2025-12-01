/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    FloatType,
    BooleanType,
    variant,
} from "@elaraai/east";

import { SizeType, ColorSchemeType, OrientationType } from "../../style.js";
import { UIComponentType } from "../../component.js";
import { SliderType, SliderVariantType, SliderVariant, type SliderStyle } from "./types.js";

// Re-export types
export {
    SliderType,
    SliderVariantType,
    SliderVariant,
    type SliderStyle,
    type SliderVariantLiteral,
} from "./types.js";

// ============================================================================
// Slider Function
// ============================================================================

/**
 * Creates a Slider component with value and optional styling.
 *
 * @param value - Current slider value
 * @param style - Optional styling configuration
 * @returns An East expression representing the slider component
 *
 * @remarks
 * Slider is used for selecting numeric values within a range. It supports
 * custom min/max bounds, step increments, and can be oriented horizontally
 * or vertically.
 *
 * @example
 * ```ts
 * import { Slider } from "@elaraai/east-ui";
 *
 * // Simple slider
 * const slider = Slider.Root(50.0);
 *
 * // Slider with range
 * const ranged = Slider.Root(25.0, {
 *   min: 0,
 *   max: 100,
 *   step: 5,
 * });
 *
 * // Styled slider
 * const styled = Slider.Root(75.0, {
 *   colorPalette: "blue",
 *   size: "md",
 *   variant: "subtle",
 * });
 *
 * // Vertical slider
 * const vertical = Slider.Root(50.0, {
 *   orientation: "vertical",
 *   min: 0,
 *   max: 100,
 * });
 *
 * // Disabled slider
 * const disabled = Slider.Root(30.0, {
 *   disabled: true,
 * });
 * ```
 */
function createSlider(
    value: SubtypeExprOrValue<FloatType>,
    style?: SliderStyle
): ExprType<UIComponentType> {
    const toFloatOption = (val: SubtypeExprOrValue<FloatType> | undefined) => {
        if (val === undefined) return variant("none", null);
        return variant("some", val);
    };

    const toBoolOption = (val: SubtypeExprOrValue<BooleanType> | undefined) => {
        if (val === undefined) return variant("none", null);
        return variant("some", val);
    };

    const orientationValue = style?.orientation
        ? (typeof style.orientation === "string"
            ? East.value(variant(style.orientation, null), OrientationType)
            : style.orientation)
        : undefined;

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

    const variantValue = style?.variant
        ? (typeof style.variant === "string"
            ? East.value(variant(style.variant, null), SliderVariantType)
            : style.variant)
        : undefined;

    return East.value(variant("Slider", {
        value: value,
        min: toFloatOption(style?.min),
        max: toFloatOption(style?.max),
        step: toFloatOption(style?.step),
        orientation: orientationValue ? variant("some", orientationValue) : variant("none", null),
        colorPalette: colorPaletteValue ? variant("some", colorPaletteValue) : variant("none", null),
        size: sizeValue ? variant("some", sizeValue) : variant("none", null),
        variant: variantValue ? variant("some", variantValue) : variant("none", null),
        disabled: toBoolOption(style?.disabled),
    }), UIComponentType);
}

/**
 * Slider component for numeric range selection.
 *
 * @remarks
 * Use `Slider.Root(value, style)` to create a slider, or access `Slider.Types.Slider` for the East type.
 */
export const Slider = {
    Root: createSlider,
    Variant: SliderVariant,
    Types: {
        Slider: SliderType,
        Variant: SliderVariantType,
    },
} as const;
