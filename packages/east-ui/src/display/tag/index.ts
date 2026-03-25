/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    StringType,
    variant,
    some,
    none,
} from "@elaraai/east";

import { BorderStyleType, BorderWidthType, ColorSchemeType, StyleVariantType, OverflowType } from "../../style.js";
import { PaddingType, MarginType } from "../../layout/style.js";
import { UIComponentType } from "../../component.js";
import { TagType, TagSizeType, type TagStyle } from "./types.js";

// Re-export types
export { TagType, TagSizeType, type TagStyle, type TagSizeLiteral } from "./types.js";

// ============================================================================
// Tag Function
// ============================================================================

/**
 * Creates a Tag component with label and optional styling.
 *
 * @param label - The tag text content
 * @param style - Optional styling configuration
 * @returns An East expression representing the tag component
 *
 * @remarks
 * Tag is used for categorization and filtering. Common uses include
 * filter chips, labels, and removable categories.
 *
 * @example
 * ```ts
 * import { East } from "@elaraai/east";
 * import { Tag, UIComponentType } from "@elaraai/east-ui";
 *
 * const example = East.function([], UIComponentType, $ => {
 *     return Tag.Root("Featured", {
 *         colorPalette: "blue",
 *         variant: "solid",
 *     });
 * });
 * ```
 */
function createTag(
    label: SubtypeExprOrValue<StringType>,
    style?: TagStyle
): ExprType<UIComponentType> {
    const variantValue = style?.variant
        ? (typeof style.variant === "string"
            ? East.value(variant(style.variant, null), StyleVariantType)
            : style.variant)
        : undefined;

    const colorPaletteValue = style?.colorPalette
        ? (typeof style.colorPalette === "string"
            ? East.value(variant(style.colorPalette, null), ColorSchemeType)
            : style.colorPalette)
        : undefined;

    const sizeValue = style?.size
        ? (typeof style.size === "string"
            ? East.value(variant(style.size, null), TagSizeType)
            : style.size)
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

    return East.value(variant("Tag", {
        label: label,
        variant: variantValue ? some(variantValue) : none,
        colorPalette: colorPaletteValue ? some(colorPaletteValue) : none,
        size: sizeValue ? some(sizeValue) : none,
        closable: style?.closable !== undefined ? some(style.closable) : none,
        onClose: style?.onClose ? some(style.onClose) : none,
        onClick: style?.onClick ? some(style.onClick) : none,
        opacity: style?.opacity !== undefined ? some(style.opacity) : none,
        color: style?.color ? some(style.color) : none,
        background: style?.background ? some(style.background) : none,
        borderRadius: style?.borderRadius ? some(style.borderRadius) : none,
        borderWidth: borderWidthValue ? some(borderWidthValue) : none,
        borderStyle: borderStyleValue ? some(borderStyleValue) : none,
        borderColor: style?.borderColor ? some(style.borderColor) : none,
        overflow: overflowValue ? some(overflowValue) : none,
        overflowX: overflowXValue ? some(overflowXValue) : none,
        overflowY: overflowYValue ? some(overflowYValue) : none,
        width: style?.width ? some(style.width) : none,
        height: style?.height ? some(style.height) : none,
        minWidth: style?.minWidth ? some(style.minWidth) : none,
        minHeight: style?.minHeight ? some(style.minHeight) : none,
        maxWidth: style?.maxWidth ? some(style.maxWidth) : none,
        maxHeight: style?.maxHeight ? some(style.maxHeight) : none,
        padding: paddingValue ? some(paddingValue) : none,
        margin: marginValue ? some(marginValue) : none,
    }), UIComponentType);
}

/**
 * Tag component for categorization, filtering, and labeling.
 *
 * @remarks
 * Use `Tag.Root(label, style)` to create a tag, or access `Tag.Types.Tag` for the East type.
 */
export const Tag = {
    /**
     * Creates a Tag component with label and optional styling.
     *
     * @param label - The tag text content
     * @param style - Optional styling configuration
     * @returns An East expression representing the tag component
     *
     * @remarks
     * Tag is used for categorization and filtering. Common uses include
     * filter chips, labels, and removable categories.
     *
     * @example
     * ```ts
     * import { East } from "@elaraai/east";
     * import { Tag, UIComponentType } from "@elaraai/east-ui";
     *
     * const example = East.function([], UIComponentType, $ => {
     *     return Tag.Root("Featured", {
     *         colorPalette: "blue",
     *         variant: "solid",
     *     });
     * });
     * ```
     */
    Root: createTag,
    Types: {
        /**
         * Type for Tag component data.
         *
         * @remarks
         * Tag is used for categorization, filtering, and labeling items.
         * Unlike Badge, Tags can be closable/removable.
         *
         * @property label - The tag text content
         * @property variant - Visual variant (solid, subtle, outline)
         * @property colorPalette - Color scheme for the tag
         * @property size - Size of the tag (sm, md, lg, xl)
         * @property closable - Whether the tag shows a close button
         */
        Tag: TagType,
        /**
         * Size variant type for Tag component.
         *
         * @remarks
         * Tag supports sm, md, lg, and xl sizes (no xs).
         *
         * @property sm - Small size
         * @property md - Medium size (default)
         * @property lg - Large size
         * @property xl - Extra large size
         */
        Size: TagSizeType,
    },
} as const;
