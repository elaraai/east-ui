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
} from "@elaraai/east";

import { BorderStyleType, BorderWidthType, SizeType, ColorSchemeType, StyleVariantType, OverflowType } from "../../style.js";
import { PaddingType, MarginType } from "../../layout/style.js";
import { UIComponentType } from "../../component.js";
import { BadgeType, type BadgeStyle } from "./types.js";

// Re-export types
export { BadgeType, type BadgeStyle } from "./types.js";

// ============================================================================
// Badge Function
// ============================================================================

/**
 * Creates a Badge component with value and optional styling.
 *
 * @param value - The badge text content
 * @param style - Optional styling configuration
 * @returns An East expression representing the badge component
 *
 * @remarks
 * Badge is used to display short labels, counts, or status indicators.
 * Common uses include notification counts, status labels, and category tags.
 *
 * @example
 * ```ts
 * import { East } from "@elaraai/east";
 * import { Badge, UIComponentType } from "@elaraai/east-ui";
 *
 * const example = East.function([], UIComponentType, $ => {
 *     return Badge.Root("Active", {
 *         colorPalette: "green",
 *         variant: "solid",
 *     });
 * });
 * ```
 */
function createBadge(
    value: SubtypeExprOrValue<StringType>,
    style?: BadgeStyle
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
            ? East.value(variant(style.size, null), SizeType)
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

    return East.value(variant("Badge", {
        value: value,
        variant: variantValue ? variant("some", variantValue) : variant("none", null),
        colorPalette: colorPaletteValue ? variant("some", colorPaletteValue) : variant("none", null),
        size: sizeValue ? variant("some", sizeValue) : variant("none", null),
        opacity: style?.opacity !== undefined ? variant("some", style.opacity) : variant("none", null),
        color: style?.color ? variant("some", style.color) : variant("none", null),
        background: style?.background ? variant("some", style.background) : variant("none", null),
        borderRadius: style?.borderRadius ? variant("some", style.borderRadius) : variant("none", null),
        borderWidth: borderWidthValue ? variant("some", borderWidthValue) : variant("none", null),
        borderStyle: borderStyleValue ? variant("some", borderStyleValue) : variant("none", null),
        borderColor: style?.borderColor ? variant("some", style.borderColor) : variant("none", null),
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
    }), UIComponentType);
}

/**
 * Badge component for displaying short labels, counts, or status indicators.
 *
 * @remarks
 * Use `Badge.Root(value, style)` to create a badge, or access `Badge.Types.Badge` for the East type.
 */
export const Badge = {
    /**
     * Creates a Badge component with value and optional styling.
     *
     * @param value - The badge text content
     * @param style - Optional styling configuration
     * @returns An East expression representing the badge component
     *
     * @remarks
     * Badge is used to display short labels, counts, or status indicators.
     * Common uses include notification counts, status labels, and category tags.
     *
     * @example
     * ```ts
     * import { East } from "@elaraai/east";
     * import { Badge, UIComponentType } from "@elaraai/east-ui";
     *
     * const example = East.function([], UIComponentType, $ => {
     *     return Badge.Root("Active", {
     *         colorPalette: "green",
     *         variant: "solid",
     *     });
     * });
     * ```
     */
    Root: createBadge,
    Types: {
        /**
         * Type for Badge component data.
         *
         * @remarks
         * Badge displays short labels, counts, or status indicators.
         *
         * @property value - The badge text content
         * @property variant - Visual variant (solid, subtle, outline)
         * @property colorPalette - Color scheme for the badge
         * @property size - Size of the badge
         */
        Badge: BadgeType,
    },
} as const;
