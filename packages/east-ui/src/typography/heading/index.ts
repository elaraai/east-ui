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

import { OverflowType, TextAlignType, TextDecorationType } from "../../style.js";
import { UIComponentType } from "../../component.js";
import { PaddingType, MarginType } from "../../layout/style.js";
import { HeadingType, HeadingSizeType, HeadingAsType, type HeadingStyle } from "./types.js";

// Re-export types
export { HeadingType, HeadingSizeType, HeadingAsType, type HeadingStyle } from "./types.js";

// ============================================================================
// Heading Component
// ============================================================================

/**
 * Creates a Heading component for semantic headings.
 *
 * @param value - The heading text
 * @param style - Optional styling configuration
 * @returns An East expression representing the heading component
 */
function createHeading(
    value: SubtypeExprOrValue<StringType>,
    style?: HeadingStyle
): ExprType<UIComponentType> {
    const sizeValue = style?.size
        ? (typeof style.size === "string"
            ? East.value(variant(style.size, null), HeadingSizeType)
            : style.size)
        : undefined;

    const asValue = style?.as
        ? (typeof style.as === "string"
            ? East.value(variant(style.as, null), HeadingAsType)
            : style.as)
        : undefined;

    const textAlignValue = style?.textAlign
        ? (typeof style.textAlign === "string"
            ? East.value(variant(style.textAlign, null), TextAlignType)
            : style.textAlign)
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

    return East.value(variant("Heading", {
        value: value,
        size: sizeValue ? variant("some", sizeValue) : variant("none", null),
        as: asValue ? variant("some", asValue) : variant("none", null),
        color: style?.color ? variant("some", style.color) : variant("none", null),
        textAlign: textAlignValue ? variant("some", textAlignValue) : variant("none", null),
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
 * Heading component for semantic HTML headings.
 *
 * @remarks
 * Use `Heading.Root(value, style)` to create headings with semantic HTML elements.
 *
 * @example
 * ```ts
 * import { East } from "@elaraai/east";
 * import { Heading, UIComponentType } from "@elaraai/east-ui";
 *
 * const example = East.function([], UIComponentType, $ => {
 *     return Heading.Root("Welcome", {
 *         size: "2xl",
 *         as: "h1",
 *         color: "blue.600",
 *     });
 * });
 * ```
 */
export const Heading = {
    Root: createHeading,
    Types: {
        Heading: HeadingType,
        Size: HeadingSizeType,
        As: HeadingAsType,
    },
} as const;
