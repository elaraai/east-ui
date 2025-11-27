/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type SubtypeExprOrValue,
    OptionType,
    StructType,
    StringType,
} from "@elaraai/east";

import { SizeType, ColorSchemeType, StyleVariantType } from "../../style.js";
import type { SizeLiteral, ColorSchemeLiteral, StyleVariantLiteral } from "../../style.js";

// ============================================================================
// Badge Type
// ============================================================================

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
export const BadgeType = StructType({
    value: StringType,
    variant: OptionType(StyleVariantType),
    colorPalette: OptionType(ColorSchemeType),
    size: OptionType(SizeType),
});

/**
 * Type representing the Badge structure.
 */
export type BadgeType = typeof BadgeType;

// ============================================================================
// Badge Style
// ============================================================================

/**
 * TypeScript interface for Badge style options.
 *
 * @property variant - Visual variant (solid, subtle, outline)
 * @property colorPalette - Color scheme for the badge
 * @property size - Size of the badge
 */
export interface BadgeStyle {
    /** Visual variant (solid, subtle, outline) */
    variant?: SubtypeExprOrValue<StyleVariantType> | StyleVariantLiteral;
    /** Color scheme for the badge */
    colorPalette?: SubtypeExprOrValue<ColorSchemeType> | ColorSchemeLiteral;
    /** Size of the badge */
    size?: SubtypeExprOrValue<SizeType> | SizeLiteral;
}
