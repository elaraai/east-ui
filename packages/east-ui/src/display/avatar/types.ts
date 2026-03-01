/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type SubtypeExprOrValue,
    FloatType,
    StringType,
    OptionType,
    StructType,
} from "@elaraai/east";

import { ColorSchemeType, OverflowType, StyleVariantType, SizeType } from "../../style.js";
import type { ColorSchemeLiteral, OverflowLiteral, StyleVariantLiteral, SizeLiteral } from "../../style.js";
import { PaddingType, MarginType } from "../../layout/style.js";

// ============================================================================
// Avatar Type
// ============================================================================

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
export const AvatarType = StructType({
    src: OptionType(StringType),
    name: OptionType(StringType),
    size: OptionType(SizeType),
    variant: OptionType(StyleVariantType),
    colorPalette: OptionType(ColorSchemeType),
    opacity: OptionType(FloatType),
    borderRadius: OptionType(StringType),
    overflow: OptionType(OverflowType),
    overflowX: OptionType(OverflowType),
    overflowY: OptionType(OverflowType),
    width: OptionType(StringType),
    height: OptionType(StringType),
    minWidth: OptionType(StringType),
    minHeight: OptionType(StringType),
    maxWidth: OptionType(StringType),
    maxHeight: OptionType(StringType),
    padding: OptionType(PaddingType),
    margin: OptionType(MarginType),
});

/**
 * Type representing the Avatar structure.
 */
export type AvatarType = typeof AvatarType;

// ============================================================================
// Avatar Style
// ============================================================================

/**
 * TypeScript interface for Avatar style options.
 *
 * @property src - Image URL for the avatar
 * @property name - User name (used for initials fallback)
 * @property size - Size of the avatar
 * @property variant - Visual variant (solid, subtle, outline)
 * @property colorPalette - Color scheme for fallback avatar
 */
export interface AvatarStyle {
    /** Image URL for the avatar */
    src?: SubtypeExprOrValue<StringType>;
    /** User name (used for initials fallback) */
    name?: SubtypeExprOrValue<StringType>;
    /** Size of the avatar */
    size?: SubtypeExprOrValue<SizeType> | SizeLiteral;
    /** Visual variant (solid, subtle, outline) */
    variant?: SubtypeExprOrValue<StyleVariantType> | StyleVariantLiteral;
    /** Color scheme for fallback avatar */
    colorPalette?: SubtypeExprOrValue<ColorSchemeType> | ColorSchemeLiteral;
    /** CSS opacity (0-1) */
    opacity?: SubtypeExprOrValue<FloatType>;
    /** Border radius */
    borderRadius?: SubtypeExprOrValue<StringType>;
    /** Overflow behavior */
    overflow?: SubtypeExprOrValue<OverflowType> | OverflowLiteral;
    /** Horizontal overflow */
    overflowX?: SubtypeExprOrValue<OverflowType> | OverflowLiteral;
    /** Vertical overflow */
    overflowY?: SubtypeExprOrValue<OverflowType> | OverflowLiteral;
    /** Width */
    width?: SubtypeExprOrValue<StringType>;
    /** Height */
    height?: SubtypeExprOrValue<StringType>;
    /** Min width */
    minWidth?: SubtypeExprOrValue<StringType>;
    /** Min height */
    minHeight?: SubtypeExprOrValue<StringType>;
    /** Max width */
    maxWidth?: SubtypeExprOrValue<StringType>;
    /** Max height */
    maxHeight?: SubtypeExprOrValue<StringType>;
    /** Padding configuration */
    padding?: SubtypeExprOrValue<PaddingType> | string;
    /** Margin configuration */
    margin?: SubtypeExprOrValue<MarginType> | string;
}
