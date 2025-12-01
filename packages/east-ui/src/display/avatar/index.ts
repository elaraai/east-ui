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
} from "@elaraai/east";

import { ColorSchemeType, StyleVariantType, SizeType } from "../../style.js";
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
 * import { Avatar } from "@elaraai/east-ui";
 *
 * // Avatar with image
 * const withImage = Avatar.Root({
 *   src: "https://example.com/avatar.jpg",
 *   name: "John Doe",
 * });
 *
 * // Avatar with name only (shows initials)
 * const initials = Avatar.Root({
 *   name: "Jane Smith",
 *   colorPalette: "blue",
 * });
 *
 * // Styled avatar
 * const styled = Avatar.Root({
 *   name: "Alice",
 *   size: "lg",
 *   variant: "solid",
 *   colorPalette: "purple",
 * });
 *
 * // Access the type
 * const avatarType = Avatar.Types.Avatar;
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

    return East.value(variant("Avatar", {
        src: toStringOption(style?.src),
        name: toStringOption(style?.name),
        size: sizeValue ? variant("some", sizeValue) : variant("none", null),
        variant: variantValue ? variant("some", variantValue) : variant("none", null),
        colorPalette: colorPaletteValue ? variant("some", colorPaletteValue) : variant("none", null),
    }), UIComponentType);
}

/**
 * Avatar component for displaying user profile images or initials.
 *
 * @remarks
 * Use `Avatar.Root(style)` to create an avatar, or access `Avatar.Types.Avatar` for the East type.
 *
 * @example
 * ```ts
 * import { Avatar } from "@elaraai/east-ui";
 *
 * // Create an avatar
 * const avatar = Avatar.Root({ name: "John Doe", colorPalette: "blue" });
 *
 * // Access the type
 * const avatarType = Avatar.Types.Avatar;
 * ```
 */
export const Avatar = {
    Root: createAvatar,
    Types: {
        Avatar: AvatarType,
    },
} as const;
