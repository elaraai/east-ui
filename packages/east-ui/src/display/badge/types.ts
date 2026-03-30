/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type SubtypeExprOrValue,
    OptionType,
    StructType,
    StringType,
    FloatType,
    FunctionType,
    NullType,
} from "@elaraai/east";

import { BorderStyleType, BorderWidthType, OverflowType, SizeType, ColorSchemeType, StyleVariantType, JustifyContentType, AlignItemsType } from "../../style.js";
import type { BorderStyleLiteral, BorderWidthLiteral, OverflowLiteral, SizeLiteral, ColorSchemeLiteral, StyleVariantLiteral, JustifyContentLiteral, AlignItemsLiteral } from "../../style.js";
import { PaddingType, MarginType } from "../../layout/style.js";

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
 * @property opacity - CSS opacity (0-1)
 * @property color - Custom text color (overrides colorPalette)
 * @property background - Custom background color (overrides colorPalette)
 */
export const BadgeType = StructType({
    value: StringType,
    variant: OptionType(StyleVariantType),
    colorPalette: OptionType(ColorSchemeType),
    size: OptionType(SizeType),
    opacity: OptionType(FloatType),
    color: OptionType(StringType),
    background: OptionType(StringType),
    borderRadius: OptionType(StringType),
    borderWidth: OptionType(BorderWidthType),
    borderStyle: OptionType(BorderStyleType),
    borderColor: OptionType(StringType),
    overflow: OptionType(OverflowType),
    overflowX: OptionType(OverflowType),
    overflowY: OptionType(OverflowType),
    justifyContent: OptionType(JustifyContentType),
    alignItems: OptionType(AlignItemsType),
    width: OptionType(StringType),
    height: OptionType(StringType),
    minWidth: OptionType(StringType),
    minHeight: OptionType(StringType),
    maxWidth: OptionType(StringType),
    maxHeight: OptionType(StringType),
    padding: OptionType(PaddingType),
    margin: OptionType(MarginType),
    onClick: OptionType(FunctionType([], NullType)),
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
 * @property opacity - CSS opacity (0-1)
 * @property color - Custom text color (overrides colorPalette)
 * @property background - Custom background color (overrides colorPalette)
 */
export interface BadgeStyle {
    /** Visual variant (solid, subtle, outline) */
    variant?: SubtypeExprOrValue<StyleVariantType> | StyleVariantLiteral;
    /** Color scheme for the badge */
    colorPalette?: SubtypeExprOrValue<ColorSchemeType> | ColorSchemeLiteral;
    /** Size of the badge */
    size?: SubtypeExprOrValue<SizeType> | SizeLiteral;
    /** CSS opacity (0-1) */
    opacity?: SubtypeExprOrValue<FloatType>;
    /** Custom text color (overrides colorPalette) */
    color?: SubtypeExprOrValue<StringType>;
    /** Custom background color (overrides colorPalette) */
    background?: SubtypeExprOrValue<StringType>;
    /** Border radius */
    borderRadius?: SubtypeExprOrValue<StringType>;
    /** Border width */
    borderWidth?: SubtypeExprOrValue<BorderWidthType> | BorderWidthLiteral;
    /** Border style */
    borderStyle?: SubtypeExprOrValue<BorderStyleType> | BorderStyleLiteral;
    /** Border color */
    borderColor?: SubtypeExprOrValue<StringType>;
    /** Overflow behavior */
    overflow?: SubtypeExprOrValue<OverflowType> | OverflowLiteral;
    /** Horizontal overflow */
    overflowX?: SubtypeExprOrValue<OverflowType> | OverflowLiteral;
    /** Vertical overflow */
    overflowY?: SubtypeExprOrValue<OverflowType> | OverflowLiteral;
    /** Horizontal alignment (flex justify-content) */
    justifyContent?: SubtypeExprOrValue<JustifyContentType> | JustifyContentLiteral;
    /** Vertical alignment (flex align-items) */
    alignItems?: SubtypeExprOrValue<AlignItemsType> | AlignItemsLiteral;
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
    /** Callback triggered when clicked */
    onClick?: SubtypeExprOrValue<FunctionType<[], NullType>>;
}
