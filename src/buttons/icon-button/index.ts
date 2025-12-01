/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type ExprType, East, variant
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import { SizeType, ColorSchemeType } from "../../style.js";
import {
    IconButtonStyleType,
    IconButtonType,
    ButtonVariantType,
    type IconButtonStyle,
} from "./types.js";

import type { IconName, IconPrefix } from "@fortawesome/fontawesome-common-types";

// Re-export types
export {
    IconButtonStyleType,
    IconButtonType,
    type IconButtonStyle,
} from "./types.js";

// ============================================================================
// IconButton Function
// ============================================================================

/**
 * Creates an IconButton component with an icon and optional styling.
 *
 * @param icon - The icon name (Font Awesome icon name) or IconType expression
 * @param style - Optional styling configuration
 * @returns An East expression representing the icon button component
 *
 * @remarks
 * IconButton renders an icon within a button. It's useful for toolbar actions,
 * close buttons, and other icon-only interactive elements.
 *
 * @example
 * ```ts
 * import { IconButton } from "@elaraai/east-ui";
 *
 * // Simple icon button
 * const closeBtn = IconButton.Root("xmark");
 *
 * // Icon button with styling
 * const menuBtn = IconButton.Root("bars", {
 *   variant: "ghost",
 *   size: "lg",
 * });
 *
 * // Colored icon button
 * const deleteBtn = IconButton.Root("trash", {
 *   variant: "solid",
 *   colorPalette: "red",
 * });
 *
 * // Loading icon button
 * const refreshBtn = IconButton.Root("rotate", {
 *   loading: true,
 * });
 * ```
 */
function createIconButton(
    prefix: IconPrefix,
    name: IconName,
    style?: IconButtonStyle
): ExprType<UIComponentType> {
    const variantValue = style?.variant
        ? (typeof style.variant === "string"
            ? East.value(variant(style.variant, null), ButtonVariantType)
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

    const hasStyle = variantValue || colorPaletteValue || sizeValue ||
        style?.loading !== undefined || style?.disabled !== undefined;

    return East.value(variant("IconButton", {
        prefix: prefix,
        name: name,
        style: hasStyle
            ? variant("some", East.value({
                variant: variantValue ? variant("some", variantValue) : variant("none", null),
                colorPalette: colorPaletteValue ? variant("some", colorPaletteValue) : variant("none", null),
                size: sizeValue ? variant("some", sizeValue) : variant("none", null),
                loading: style?.loading !== undefined ? variant("some", style.loading) : variant("none", null),
                disabled: style?.disabled !== undefined ? variant("some", style.disabled) : variant("none", null),
            }, IconButtonStyleType))
            : variant("none", null),
    }), UIComponentType);
}

/**
 * IconButton component for icon-only buttons.
 *
 * @remarks
 * Use `IconButton.Root(icon, style)` to create an icon button, or access `IconButton.Types` for East types.
 *
 * @example
 * ```ts
 * import { IconButton } from "@elaraai/east-ui";
 *
 * // Create an icon button
 * const btn = IconButton.Root("chevron-right", { variant: "ghost" });
 *
 * // Access the type
 * const styleType = IconButton.Types.Style;
 * ```
 */
export const IconButton = {
    Root: createIconButton,
    Types: {
        IconButton: IconButtonType,
        Style: IconButtonStyleType,
        Variant: ButtonVariantType,
    },
} as const;
