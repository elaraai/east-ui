/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type SubtypeExprOrValue,
    StringType,
    BooleanType,
    OptionType,
    StructType,
} from "@elaraai/east";

import { SizeType, ColorSchemeType, StyleVariantType } from "../../style.js";
import type { SizeLiteral, ColorSchemeLiteral, StyleVariantLiteral } from "../../style.js";

// ============================================================================
// Tag Type
// ============================================================================

/**
 * Type for Tag component data.
 *
 * @remarks
 * Tag is used for categorization, filtering, and labeling items.
 * Unlike Badge, Tags can be closable/removable.
 *
 * @property label - The tag text content
 * @property variant - Visual variant (solid, subtle, outline)
 * @property colorPalette - Color scheme for the tag
 * @property size - Size of the tag
 * @property closable - Whether the tag shows a close button
 */
export const TagType = StructType({
    label: StringType,
    variant: OptionType(StyleVariantType),
    colorPalette: OptionType(ColorSchemeType),
    size: OptionType(SizeType),
    closable: OptionType(BooleanType),
});

/**
 * Type representing the Tag structure.
 */
export type TagType = typeof TagType;

// ============================================================================
// Tag Style
// ============================================================================

/**
 * TypeScript interface for Tag style options.
 *
 * @property variant - Visual variant (solid, subtle, outline)
 * @property colorPalette - Color scheme for the tag
 * @property size - Size of the tag
 * @property closable - Whether the tag shows a close button
 */
export interface TagStyle {
    /** Visual variant (solid, subtle, outline) */
    variant?: SubtypeExprOrValue<StyleVariantType> | StyleVariantLiteral;
    /** Color scheme for the tag */
    colorPalette?: SubtypeExprOrValue<ColorSchemeType> | ColorSchemeLiteral;
    /** Size of the tag */
    size?: SubtypeExprOrValue<SizeType> | SizeLiteral;
    /** Whether the tag shows a close button */
    closable?: SubtypeExprOrValue<BooleanType>;
}
