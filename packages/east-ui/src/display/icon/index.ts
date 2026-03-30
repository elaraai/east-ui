/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType, East, variant, some,
} from "@elaraai/east";

import type { IconName, IconPrefix } from "@fortawesome/fontawesome-common-types";

import { ColorSchemeType, OverflowType } from "../../style.js";
import { PaddingType, MarginType } from "../../layout/style.js";
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
 * import { East } from "@elaraai/east";
 * import { Icon, UIComponentType } from "@elaraai/east-ui";
 *
 * const example = East.function([], UIComponentType, $ => {
 *     return Icon.Root("fas", "user");
 * });
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

    return East.value(variant("Icon", {
        prefix: prefix,
        name: name,
        style: style ? variant("some", East.value({
            size: sizeValue ? variant("some", sizeValue) : variant("none", null),
            variant: variantValue ? variant("some", variantValue) : variant("none", null),
            color: style.color ? variant("some", style.color) : variant("none", null),
            colorPalette: colorPaletteValue ? variant("some", colorPaletteValue) : variant("none", null),
            opacity: style.opacity !== undefined ? variant("some", style.opacity) : variant("none", null),
            borderRadius: style.borderRadius ? variant("some", style.borderRadius) : variant("none", null),
            overflow: overflowValue ? variant("some", overflowValue) : variant("none", null),
            overflowX: overflowXValue ? variant("some", overflowXValue) : variant("none", null),
            overflowY: overflowYValue ? variant("some", overflowYValue) : variant("none", null),
            width: style.width ? variant("some", style.width) : variant("none", null),
            height: style.height ? variant("some", style.height) : variant("none", null),
            minWidth: style.minWidth ? variant("some", style.minWidth) : variant("none", null),
            minHeight: style.minHeight ? variant("some", style.minHeight) : variant("none", null),
            maxWidth: style.maxWidth ? variant("some", style.maxWidth) : variant("none", null),
            maxHeight: style.maxHeight ? variant("some", style.maxHeight) : variant("none", null),
            padding: paddingValue ? variant("some", paddingValue) : variant("none", null),
            margin: marginValue ? variant("some", marginValue) : variant("none", null),
            onClick: style?.onClick ? variant("some", style.onClick) : variant("none", null),
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
 */
export const Icon = {
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
     * import { East } from "@elaraai/east";
     * import { Icon, UIComponentType } from "@elaraai/east-ui";
     *
     * const example = East.function([], UIComponentType, $ => {
     *     return Icon.Root("fas", "user");
     * });
     *
     * const styledExample = East.function([], UIComponentType, $ => {
     *     return Icon.Root("fas", "heart", {
     *         color: "red.500",
     *         size: "xl",
     *     });
     * });
     * ```
     */
    Root: createIcon,
    Types: {
        /**
         * Type for Icon component data.
         *
         * @remarks
         * Icon displays a Font Awesome icon with optional styling.
         *
         * @property name - The Font Awesome icon name (e.g., "user", "home", "chevron-right")
         * @property prefix - The Font Awesome prefix (e.g., "fas", "far", "fab")
         * @property style - Optional styling configuration
         */
        Icon: IconType,
        /**
         * Style type for the Icon component.
         *
         * @remarks
         * All properties are optional and wrapped in OptionType.
         *
         * @property size - Icon size (xs, sm, md, lg, xl, 2xl)
         * @property variant - Icon style/weight (solid, regular, light, thin, brands)
         * @property color - Icon color (CSS color or Chakra color token)
         * @property colorPalette - Color scheme for the icon
         */
        Style: IconStyleType,
        /**
         * Size options for Icon component.
         *
         * @remarks
         * Maps to Font Awesome size classes.
         *
         * @property xs - Extra small icon
         * @property sm - Small icon
         * @property md - Medium icon (default)
         * @property lg - Large icon
         * @property xl - Extra large icon
         * @property 2xl - 2x large icon
         */
        Size: IconSizeType,
        /**
         * Font Awesome icon style/variant.
         *
         * @remarks
         * Determines which icon set to use.
         *
         * @property solid - Solid filled icons (fas)
         * @property regular - Regular outlined icons (far)
         * @property light - Light weight icons (fal) - requires FA Pro
         * @property thin - Thin weight icons (fat) - requires FA Pro
         * @property brands - Brand logos (fab)
         */
        Variant: IconVariantType,
    },
} as const;
