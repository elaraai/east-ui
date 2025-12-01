/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type ExprType, East, variant
} from "@elaraai/east";

import type { IconName, IconPrefix } from "@fortawesome/fontawesome-common-types";

import { ColorSchemeType } from "../../style.js";
import { UIComponentType } from "../../component.js";
import {
    IconSizeType,
    IconVariantType,
    IconStyleType,
    IconType,
    type IconStyle
} from "./types.js";

// Re-export types
export {
    IconSizeType,
    IconVariantType,
    IconStyleType,
    IconType,
    type IconSizeLiteral,
    type IconVariantLiteral,
    type IconStyle,
    type IconName,
} from "./types.js";

// ============================================================================
// Icon Factory
// ============================================================================

/**
 * Creates an Icon component.
 *
 * @param prefix - The Font Awesome icon prefix (e.g., "fas", "far", "fab")
 * @param name - The Font Awesome icon name (e.g., "user", "home", "chevron-right")
 * @param style - Optional styling configuration
 * @returns An East expression representing the Icon component
 *
 * @remarks
 * Both prefix and name are typesafe using Font Awesome's TypeScript types.
 * Common prefixes:
 * - `fas` - Solid icons (filled)
 * - `far` - Regular icons (outlined)
 * - `fab` - Brand icons (logos)
 *
 * @example
 * ```ts
 * import { Icon } from "@elaraai/east-ui";
 *
 * // Solid user icon
 * const userIcon = Icon.Root("fas", "user");
 *
 * // Regular heart icon (outlined)
 * const heartIcon = Icon.Root("far", "heart");
 *
 * // Brand icon (GitHub logo)
 * const githubIcon = Icon.Root("fab", "github");
 *
 * // Icon with size and color
 * const coloredIcon = Icon.Root("fas", "heart", {
 *   color: "red.500",
 *   size: "xl",
 * });
 *
 * // Tree view icons
 * const folderIcon = Icon.Root("fas", "folder", { color: "yellow.500" });
 * const fileIcon = Icon.Root("far", "file");
 * const codeIcon = Icon.Root("fas", "file-code", { color: "blue.500" });
 * ```
 */
function createIcon(
    prefix: IconPrefix,
    name: IconName,
    style?: IconStyle
): ExprType<UIComponentType> {
    const sizeValue = style?.size
        ? (typeof style.size === "string"
            ? East.value(variant(style.size, null), IconSizeType)
            : style.size)
        : undefined;

    const variantValue = style?.variant
        ? (typeof style.variant === "string"
            ? East.value(variant(style.variant, null), IconVariantType)
            : style.variant)
        : undefined;

    const colorPaletteValue = style?.colorPalette
        ? (typeof style.colorPalette === "string"
            ? East.value(variant(style.colorPalette, null), ColorSchemeType)
            : style.colorPalette)
        : undefined;

    return East.value(variant("Icon", {
        prefix: prefix,
        name: name,
        style: style ? variant("some", East.value({
            size: sizeValue ? variant("some", sizeValue) : variant("none", null),
            variant: variantValue ? variant("some", variantValue) : variant("none", null),
            color: style.color ? variant("some", style.color) : variant("none", null),
            colorPalette: colorPaletteValue ? variant("some", colorPaletteValue) : variant("none", null),
        }, IconStyleType)) : variant("none", null),
    }), UIComponentType);
}

// ============================================================================
// Icon Namespace Export
// ============================================================================

/**
 * Icon component namespace.
 *
 * @remarks
 * Icon displays Font Awesome icons with typesafe icon names.
 * Use the `variant` prop to select icon style (solid, regular, brands, etc.).
 *
 * @example
 * ```ts
 * import { Icon } from "@elaraai/east-ui";
 *
 * // Navigation icons
 * const homeIcon = Icon.Root("home", { size: "lg" });
 * const menuIcon = Icon.Root("bars", { variant: "solid" });
 *
 * // Status icons
 * const checkIcon = Icon.Root("check", { color: "green.500" });
 * const warningIcon = Icon.Root("triangle-exclamation", { color: "yellow.500" });
 *
 * // Tree view icons
 * const folderIcon = Icon.Root("folder", { variant: "solid" });
 * const fileIcon = Icon.Root("file", { variant: "regular" });
 * ```
 */
export const Icon = {
    /** Creates an Icon component */
    Root: createIcon,
    /** Type definitions */
    Types: {
        /** Icon struct type */
        Icon: IconType,
        /** Icon style struct type */
        Style: IconStyleType,
        /** Icon size variant type */
        Size: IconSizeType,
        /** Icon variant (solid/regular/brands) type */
        Variant: IconVariantType,
    },
} as const;
