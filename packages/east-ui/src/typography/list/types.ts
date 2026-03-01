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
    ArrayType,
} from "@elaraai/east";

import { OverflowType } from "../../style.js";
import type { OverflowLiteral } from "../../style.js";
import { PaddingType, MarginType } from "../../layout/style.js";

// ============================================================================
// List Variant Type
// ============================================================================

/**
 * List variant type for ordered vs unordered lists.
 *
 * @property ordered - Numbered list (ol)
 * @property unordered - Bulleted list (ul)
 */
export const ListVariantType = VariantType({
    ordered: NullType,
    unordered: NullType,
});

export type ListVariantType = typeof ListVariantType;
export type ListVariantLiteral = "ordered" | "unordered";

// ============================================================================
// List Type
// ============================================================================

/**
 * The concrete East type for List component data.
 *
 * @property items - Array of list items
 * @property variant - Ordered or unordered list
 * @property gap - Spacing between items
 * @property colorPalette - Color scheme for list markers
 */
export const ListType = StructType({
    items: ArrayType(StringType),
    variant: OptionType(ListVariantType),
    gap: OptionType(StringType),
    colorPalette: OptionType(StringType),
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
    opacity: OptionType(FloatType),
});

export type ListType = typeof ListType;

// ============================================================================
// List Style
// ============================================================================

/**
 * Style configuration for List components.
 */
export type ListStyle = {
    /** Ordered or unordered list */
    variant?: SubtypeExprOrValue<ListVariantType> | ListVariantLiteral;
    /** Spacing between items */
    gap?: SubtypeExprOrValue<StringType>;
    /** Color palette for list markers */
    colorPalette?: SubtypeExprOrValue<StringType>;
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
    /** CSS opacity (0-1) */
    opacity?: SubtypeExprOrValue<FloatType>;
};

