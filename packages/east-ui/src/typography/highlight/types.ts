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
    ArrayType,
} from "@elaraai/east";

import { OverflowType, TextDecorationType } from "../../style.js";
import type { OverflowLiteral, TextDecorationLiteral } from "../../style.js";
import { PaddingType, MarginType } from "../../layout/style.js";

// ============================================================================
// Highlight Type
// ============================================================================

/**
 * The concrete East type for Highlight component data.
 *
 * @property value - The text containing content to highlight
 * @property query - String or array of strings to highlight within the text
 * @property color - Background color for highlighted portions
 */
export const HighlightType = StructType({
    value: StringType,
    query: ArrayType(StringType),
    color: OptionType(StringType),
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

export type HighlightType = typeof HighlightType;

// ============================================================================
// Highlight Style
// ============================================================================

/**
 * Style configuration for Highlight components.
 */
export type HighlightStyle = {
    /** Background color for highlighted text */
    color?: SubtypeExprOrValue<StringType>;
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
