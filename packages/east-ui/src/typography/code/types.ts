/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type SubtypeExprOrValue,
    FloatType,
    FunctionType,
    OptionType,
    StringType,
    StructType,
    VariantType,
    NullType,
} from "@elaraai/east";

import { OverflowType, SizeType, TextDecorationType } from "../../style.js";
import type { OverflowLiteral, SizeLiteral, TextDecorationLiteral } from "../../style.js";
import { PaddingType, MarginType } from "../../layout/style.js";

// ============================================================================
// Code Variant Type
// ============================================================================

/**
 * Code variant type for different code display styles.
 *
 * @property subtle - Subtle background with colored text
 * @property surface - Surface-level styling
 * @property outline - Transparent background with colored border
 */
export const CodeVariantType = VariantType({
    subtle: NullType,
    surface: NullType,
    outline: NullType,
});

export type CodeVariantType = typeof CodeVariantType;
export type CodeVariantLiteral = "subtle" | "surface" | "outline";

// ============================================================================
// Code Type
// ============================================================================

/**
 * The concrete East type for Code component data.
 *
 * @property value - The code text to display
 * @property variant - Visual style variant
 * @property colorPalette - Color scheme for the code
 * @property size - Size of the code text
 */
export const CodeType = StructType({
    value: StringType,
    variant: OptionType(CodeVariantType),
    colorPalette: OptionType(StringType),
    size: OptionType(SizeType),
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
    onClick: OptionType(FunctionType([], NullType)),
});

export type CodeType = typeof CodeType;

// ============================================================================
// Code Style
// ============================================================================

/**
 * Style configuration for Code components.
 */
export type CodeStyle = {
    /** Visual style variant */
    variant?: SubtypeExprOrValue<CodeVariantType> | CodeVariantLiteral;
    /** Color palette (e.g., "gray", "blue") */
    colorPalette?: SubtypeExprOrValue<StringType>;
    /** Size of the code text */
    size?: SubtypeExprOrValue<SizeType> | SizeLiteral;
    /** Text decoration */
    textDecoration?: SubtypeExprOrValue<TextDecorationType> | TextDecorationLiteral;
    /** Overflow behavior */
    overflow?: SubtypeExprOrValue<OverflowType> | OverflowLiteral;
    /** Horizontal overflow behavior */
    overflowX?: SubtypeExprOrValue<OverflowType> | OverflowLiteral;
    /** Vertical overflow behavior */
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
    /** Callback triggered when clicked */
    onClick?: SubtypeExprOrValue<FunctionType<[], NullType>>;
};
