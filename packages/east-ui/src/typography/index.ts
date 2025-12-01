/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type SubtypeExprOrValue,
    type ExprType,
    East,
    StringType,
    variant,
} from "@elaraai/east";

import {
    BorderStyleType,
    BorderWidthType,
    FontStyleType,
    FontWeightType,
    SizeType,
    TextAlignType,
    TextTransformType,
} from "../style.js";
import { UIComponentType } from "../component.js";
import { TextType, type TextStyle } from "./types.js";

// Re-export types
export { TextType, type TextStyle } from "./types.js";

// ============================================================================
// Text Component
// ============================================================================

/**
 * Creates a Text component with a value and optional styling.
 *
 * @param value - The text value as a string or East expression
 * @param style - Optional styling configuration for the text
 * @returns An East expression representing the styled text component
 *
 * @remarks
 * The value can be a plain string or an East expression of StringType.
 *
 * @example
 * ```ts
 * import { Text } from "@elaraai/east-ui";
 *
 * // Simple text
 * const text = Text.Root("Hello");
 *
 * // Styled text with string literals
 * const styledText = Text.Root("World", {
 *   color: "blue.500",
 *   fontWeight: "bold",
 *   textAlign: "center",
 * });
 *
 * // Access the type
 * const textType = Text.Types.Text;
 * ```
 */
function createText(
    value: SubtypeExprOrValue<StringType>,
    style?: TextStyle
): ExprType<UIComponentType> {
    const fontWeightValue = style?.fontWeight
        ? (typeof style.fontWeight === "string"
            ? East.value(variant(style.fontWeight, null), FontWeightType)
            : style.fontWeight)
        : undefined;

    const fontStyleValue = style?.fontStyle
        ? (typeof style.fontStyle === "string"
            ? East.value(variant(style.fontStyle, null), FontStyleType)
            : style.fontStyle)
        : undefined;


    const fontSize = style?.fontSize
        ? (typeof style.fontSize === "string"
            ? East.value(variant(style.fontSize, null), SizeType)
            : style.fontSize)
        : undefined;

    const textTransformValue = style?.textTransform
        ? (typeof style.textTransform === "string"
            ? East.value(variant(style.textTransform, null), TextTransformType)
            : style.textTransform)
        : undefined;

    const textAlignValue = style?.textAlign
        ? (typeof style.textAlign === "string"
            ? East.value(variant(style.textAlign, null), TextAlignType)
            : style.textAlign)
        : undefined;

    const borderWidthValue = style?.borderWidth
        ? (typeof style.borderWidth === "string"
            ? East.value(variant(style.borderWidth, null), BorderWidthType)
            : style.borderWidth)
        : undefined;

    const borderStyleValue = style?.borderStyle
        ? (typeof style.borderStyle === "string"
            ? East.value(variant(style.borderStyle, null), BorderStyleType)
            : style.borderStyle)
        : undefined;

    return East.value(variant("Text", {
        value: value,
        color: style?.color ? variant("some", style.color) : variant("none", null),
        background: style?.background ? variant("some", style.background) : variant("none", null),
        fontWeight: fontWeightValue ? variant("some", fontWeightValue) : variant("none", null),
        fontStyle: fontStyleValue ? variant("some", fontStyleValue) : variant("none", null),
        fontSize: fontSize ? variant("some", fontSize) : variant("none", null),
        textTransform: textTransformValue ? variant("some", textTransformValue) : variant("none", null),
        textAlign: textAlignValue ? variant("some", textAlignValue) : variant("none", null),
        borderWidth: borderWidthValue ? variant("some", borderWidthValue) : variant("none", null),
        borderStyle: borderStyleValue ? variant("some", borderStyleValue) : variant("none", null),
        borderColor: style?.borderColor ? variant("some", style.borderColor) : variant("none", null),
    }), UIComponentType);
}

/**
 * Text component for displaying styled text content.
 *
 * @remarks
 * Use `Text.Root(value, style)` to create text, or access `Text.Types.Text` for the East type.
 *
 * @example
 * ```ts
 * import { Text } from "@elaraai/east-ui";
 *
 * // Create styled text
 * const text = Text.Root("Hello", { color: "blue.500", fontWeight: "bold" });
 *
 * // Access the type
 * const textType = Text.Types.Text;
 * ```
 */
export const Text = {
    Root: createText,
    Types: {
        Text: TextType,
    },
} as const;
