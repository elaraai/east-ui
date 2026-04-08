/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type SubtypeExprOrValue,
    type ExprType,
    East,
    StringType,
    variant,
    some,
} from "@elaraai/east";

import { OverflowType, SizeType, TextDecorationType } from "../../style.js";
import { UIComponentType } from "../../component.js";
import { PaddingType, MarginType } from "../../layout/style.js";
import { CodeType, CodeVariantType, type CodeStyle } from "./types.js";

// Re-export types
export { CodeType, CodeVariantType, type CodeStyle } from "./types.js";

// ============================================================================
// Code Component
// ============================================================================

/**
 * Creates a Code component for displaying inline code.
 *
 * @param value - The code text to display
 * @param style - Optional styling configuration
 * @returns An East expression representing the code component
 */
function createCode(
    value: SubtypeExprOrValue<StringType>,
    style?: CodeStyle
): ExprType<UIComponentType> {
    const variantValue = style?.variant
        ? (typeof style.variant === "string"
            ? East.value(variant(style.variant, null), CodeVariantType)
            : style.variant)
        : undefined;

    const sizeValue = style?.size
        ? (typeof style.size === "string"
            ? East.value(variant(style.size, null), SizeType)
            : style.size)
        : undefined;

    const textDecorationValue = style?.textDecoration
        ? (typeof style.textDecoration === "string"
            ? East.value(variant(style.textDecoration, null), TextDecorationType)
            : style.textDecoration)
        : undefined;

    const overflowValue = style?.overflow
        ? (typeof style.overflow === "string"
            ? East.value(variant(style.overflow, null), OverflowType)
            : style.overflow)
        : undefined;

    const overflowXValue = style?.overflowX
        ? (typeof style.overflowX === "string"
            ? East.value(variant(style.overflowX, null), OverflowType)
            : style.overflowX)
        : undefined;

    const overflowYValue = style?.overflowY
        ? (typeof style.overflowY === "string"
            ? East.value(variant(style.overflowY, null), OverflowType)
            : style.overflowY)
        : undefined;

    const paddingValue = style?.padding
        ? (typeof style.padding === "string"
            ? East.value({
                top: some(style.padding),
                right: some(style.padding),
                bottom: some(style.padding),
                left: some(style.padding)
            }, PaddingType)
            : style.padding)
        : undefined;

    const marginValue = style?.margin
        ? (typeof style.margin === "string"
            ? East.value({
                top: some(style.margin),
                right: some(style.margin),
                bottom: some(style.margin),
                left: some(style.margin)
            }, MarginType)
            : style.margin)
        : undefined;

    return East.value(variant("Code", {
        value: value,
        variant: variantValue ? variant("some", variantValue) : variant("none", null),
        colorPalette: style?.colorPalette ? variant("some", style.colorPalette) : variant("none", null),
        size: sizeValue ? variant("some", sizeValue) : variant("none", null),
        textDecoration: textDecorationValue ? variant("some", textDecorationValue) : variant("none", null),
        overflow: overflowValue ? variant("some", overflowValue) : variant("none", null),
        overflowX: overflowXValue ? variant("some", overflowXValue) : variant("none", null),
        overflowY: overflowYValue ? variant("some", overflowYValue) : variant("none", null),
        width: style?.width ? variant("some", style.width) : variant("none", null),
        height: style?.height ? variant("some", style.height) : variant("none", null),
        minWidth: style?.minWidth ? variant("some", style.minWidth) : variant("none", null),
        minHeight: style?.minHeight ? variant("some", style.minHeight) : variant("none", null),
        maxWidth: style?.maxWidth ? variant("some", style.maxWidth) : variant("none", null),
        maxHeight: style?.maxHeight ? variant("some", style.maxHeight) : variant("none", null),
        padding: paddingValue ? variant("some", paddingValue) : variant("none", null),
        margin: marginValue ? variant("some", marginValue) : variant("none", null),
        lineHeight: style?.lineHeight ? variant("some", style.lineHeight) : variant("none", null),
        letterSpacing: style?.letterSpacing ? variant("some", style.letterSpacing) : variant("none", null),
        opacity: style?.opacity !== undefined ? variant("some", style.opacity) : variant("none", null),
        onClick: style?.onClick ? variant("some", style.onClick) : variant("none", null),
    }), UIComponentType);
}

/**
 * Code component for displaying inline code snippets.
 *
 * @remarks
 * Use `Code.Root(value, style)` to create inline code display.
 *
 * @example
 * ```ts
 * import { East } from "@elaraai/east";
 * import { Code, UIComponentType } from "@elaraai/east-ui";
 *
 * const example = East.function([], UIComponentType, $ => {
 *     return Code.Root("const x = 42", {
 *         colorPalette: "purple",
 *         variant: "surface",
 *     });
 * });
 * ```
 */
export const Code = {
    Root: createCode,
    Types: {
        Code: CodeType,
        Variant: CodeVariantType,
    },
} as const;
