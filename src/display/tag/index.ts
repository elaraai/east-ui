/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    StringType,
    BooleanType,
    variant,
} from "@elaraai/east";

import { ColorSchemeType, StyleVariantType } from "../../style.js";
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
 * import { Tag } from "@elaraai/east-ui";
 *
 * // Simple tag
 * const tag = Tag.Root("JavaScript");
 *
 * // Styled tag
 * const styled = Tag.Root("Featured", {
 *   colorPalette: "blue",
 *   variant: "solid",
 * });
 *
 * // Closable tag
 * const closable = Tag.Root("React", {
 *   colorPalette: "cyan",
 *   closable: true,
 * });
 *
 * // Access the type
 * const tagType = Tag.Types.Tag;
 * ```
 */
function createTag(
    label: SubtypeExprOrValue<StringType>,
    style?: TagStyle
): ExprType<UIComponentType> {
    const toBoolOption = (val: SubtypeExprOrValue<BooleanType> | undefined) => {
        if (val === undefined) return variant("none", null);
        return variant("some", val);
    };

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

    return East.value(variant("Tag", {
        label: label,
        variant: variantValue ? variant("some", variantValue) : variant("none", null),
        colorPalette: colorPaletteValue ? variant("some", colorPaletteValue) : variant("none", null),
        size: sizeValue ? variant("some", sizeValue) : variant("none", null),
        closable: toBoolOption(style?.closable),
    }), UIComponentType);
}

/**
 * Tag component for categorization, filtering, and labeling.
 *
 * @remarks
 * Use `Tag.Root(label, style)` to create a tag, or access `Tag.Types.Tag` for the East type.
 *
 * @example
 * ```ts
 * import { Tag } from "@elaraai/east-ui";
 *
 * // Create a tag
 * const tag = Tag.Root("JavaScript", { colorPalette: "yellow" });
 *
 * // Access the type
 * const tagType = Tag.Types.Tag;
 * ```
 */
export const Tag = {
    Root: createTag,
    Types: {
        Tag: TagType,
        Size: TagSizeType,
    },
} as const;
