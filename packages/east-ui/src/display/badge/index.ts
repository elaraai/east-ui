/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    StringType,
    variant,
} from "@elaraai/east";

import { SizeType, ColorSchemeType, StyleVariantType } from "../../style.js";
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
 * import { Badge } from "@elaraai/east-ui";
 *
 * // Simple badge
 * const badge = Badge.Root("New");
 *
 * // Styled badge
 * const status = Badge.Root("Active", {
 *   colorPalette: "green",
 *   variant: "solid",
 * });
 *
 * // Access the type
 * const type = Badge.Types.Badge;
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

    return East.value(variant("Badge", {
        value: value,
        variant: variantValue ? variant("some", variantValue) : variant("none", null),
        colorPalette: colorPaletteValue ? variant("some", colorPaletteValue) : variant("none", null),
        size: sizeValue ? variant("some", sizeValue) : variant("none", null),
    }), UIComponentType);
}

/**
 * Badge component for displaying short labels, counts, or status indicators.
 *
 * @remarks
 * Use `Badge.Root(value, style)` to create a badge, or access `Badge.Types.Badge` for the East type.
 *
 * @example
 * ```ts
 * import { Badge } from "@elaraai/east-ui";
 *
 * // Create a badge
 * const badge = Badge.Root("New", { colorPalette: "green" });
 *
 * // Access the type
 * const badgeType = Badge.Types.Badge;
 * ```
 */
export const Badge = {
    Root: createBadge,
    Types: {
        Badge: BadgeType,
    },
} as const;
