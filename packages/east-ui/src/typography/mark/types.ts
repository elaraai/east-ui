/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type SubtypeExprOrValue,
    FloatType,
    OptionType,
    StringType,
    StructType,
    VariantType,
    NullType,
} from "@elaraai/east";

import { OverflowType, TextDecorationType } from "../../style.js";
import type { OverflowLiteral, TextDecorationLiteral } from "../../style.js";
import { PaddingType, MarginType } from "../../layout/style.js";

// ============================================================================
// Mark Variant Type
// ============================================================================

/**
 * Mark variant type for different highlight styles.
 *
 * @property subtle - Subtle highlight effect
 * @property solid - Solid colored highlight
 * @property text - Text-color only highlight
 * @property plain - Plain mark styling
 */
export const MarkVariantType = VariantType({
    subtle: NullType,
    solid: NullType,
    text: NullType,
    plain: NullType,
});

export type MarkVariantType = typeof MarkVariantType;
export type MarkVariantLiteral = "subtle" | "solid" | "text" | "plain";

// ============================================================================
// Mark Type
// ============================================================================

/**
 * The concrete East type for Mark component data.
 *
 * @property value - The text to mark/highlight
 * @property variant - Visual style variant
 * @property colorPalette - Color scheme for the mark
 */
export const MarkType = StructType({
    value: StringType,
    variant: OptionType(MarkVariantType),
    colorPalette: OptionType(StringType),
    textDecoration: OptionType(TextDecorationType),
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
    lineHeight: OptionType(StringType),
    letterSpacing: OptionType(StringType),
    opacity: OptionType(FloatType),
});

export type MarkType = typeof MarkType;

// ============================================================================
// Mark Style
// ============================================================================

/**
 * Style configuration for Mark components.
 */
export type MarkStyle = {
    /** Visual style variant */
    variant?: SubtypeExprOrValue<MarkVariantType> | MarkVariantLiteral;
    /** Color palette (e.g., "yellow", "green") */
    colorPalette?: SubtypeExprOrValue<StringType>;
    /** Text decoration */
    textDecoration?: SubtypeExprOrValue<TextDecorationType> | TextDecorationLiteral;
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
    /** Line height */
    lineHeight?: SubtypeExprOrValue<StringType>;
    /** Letter spacing */
    letterSpacing?: SubtypeExprOrValue<StringType>;
    /** CSS opacity (0-1) */
    opacity?: SubtypeExprOrValue<FloatType>;
};
