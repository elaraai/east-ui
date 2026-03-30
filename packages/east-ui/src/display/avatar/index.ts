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

import { ColorSchemeType, StyleVariantType, SizeType, OverflowType } from "../../style.js";
import { PaddingType, MarginType } from "../../layout/style.js";
import { UIComponentType } from "../../component.js";
import { AvatarType, type AvatarStyle } from "./types.js";

// Re-export types
export { AvatarType, type AvatarStyle } from "./types.js";

// ============================================================================
// Avatar Function
// ============================================================================

/**
 * Creates an Avatar component with optional image and fallback.
 *
 * @param style - Avatar configuration and styling
 * @returns An East expression representing the avatar component
 *
 * @remarks
 * Avatar displays user profile images. When no image is provided or fails
 * to load, it shows initials from the name or a default icon.
 *
 * @example
 * ```ts
 * import { East } from "@elaraai/east";
 * import { Avatar, UIComponentType } from "@elaraai/east-ui";
 *
 * const example = East.function([], UIComponentType, $ => {
 *     return Avatar.Root({
 *         name: "Jane Smith",
 *         colorPalette: "blue",
 *         size: "lg",
 *     });
 * });
 * ```
 */
function createAvatar(style?: AvatarStyle): ExprType<UIComponentType> {
    const toStringOption = (val: SubtypeExprOrValue<StringType> | undefined) => {
        if (val === undefined) return variant("none", null);
        return variant("some", val);
    };

    const sizeValue = style?.size
        ? (typeof style.size === "string"
            ? East.value(variant(style.size, null), SizeType)
            : style.size)
        : undefined;

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

    return East.value(variant("Avatar", {
        src: toStringOption(style?.src),
        name: toStringOption(style?.name),
        size: sizeValue ? variant("some", sizeValue) : variant("none", null),
        variant: variantValue ? variant("some", variantValue) : variant("none", null),
        colorPalette: colorPaletteValue ? variant("some", colorPaletteValue) : variant("none", null),
        opacity: style?.opacity !== undefined ? variant("some", style.opacity) : variant("none", null),
        borderRadius: style?.borderRadius ? variant("some", style.borderRadius) : variant("none", null),
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
        onClick: style?.onClick ? variant("some", style.onClick) : variant("none", null),
    }), UIComponentType);
}

/**
 * Avatar component for displaying user profile images or initials.
 *
 * @remarks
 * Use `Avatar.Root(style)` to create an avatar, or access `Avatar.Types.Avatar` for the East type.
 */
export const Avatar = {
    /**
     * Creates an Avatar component with optional image and fallback.
     *
     * @param style - Avatar configuration and styling
     * @returns An East expression representing the avatar component
     *
     * @remarks
     * Avatar displays user profile images. When no image is provided or fails
     * to load, it shows initials from the name or a default icon.
     *
     * @example
     * ```ts
     * import { East } from "@elaraai/east";
     * import { Avatar, UIComponentType } from "@elaraai/east-ui";
     *
     * const example = East.function([], UIComponentType, $ => {
     *     return Avatar.Root({
     *         name: "Jane Smith",
     *         colorPalette: "blue",
     *     });
     * });
     * ```
     */
    Root: createAvatar,
    Types: {
        /**
         * Type for Avatar component data.
         *
         * @remarks
         * Avatar displays user profile images or initials/icons as fallback.
         *
         * @property src - Image URL for the avatar
         * @property name - User name (used for initials fallback)
         * @property size - Size of the avatar
         * @property variant - Visual variant (solid, subtle, outline)
         * @property colorPalette - Color scheme for fallback avatar
         */
        Avatar: AvatarType,
    },
} as const;
