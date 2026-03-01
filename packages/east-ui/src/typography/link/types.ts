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
    BooleanType,
} from "@elaraai/east";

import { OverflowType, TextDecorationType } from "../../style.js";
import type { OverflowLiteral, TextDecorationLiteral } from "../../style.js";
import { PaddingType, MarginType } from "../../layout/style.js";

// ============================================================================
// Link Variant Type
// ============================================================================

/**
 * Link variant type for different link styles.
 *
 * @property underline - Always show underline
 * @property plain - No underline by default
 */
export const LinkVariantType = VariantType({
    underline: NullType,
    plain: NullType,
});

export type LinkVariantType = typeof LinkVariantType;
export type LinkVariantLiteral = "underline" | "plain";

// ============================================================================
// Link Type
// ============================================================================

/**
 * The concrete East type for Link component data.
 *
 * @property value - The link text to display
 * @property href - URL the link points to
 * @property external - Whether to open in new tab
 * @property variant - Visual style variant
 * @property colorPalette - Color scheme for the link
 */
export const LinkType = StructType({
    value: StringType,
    href: StringType,
    external: OptionType(BooleanType),
    variant: OptionType(LinkVariantType),
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

export type LinkType = typeof LinkType;

// ============================================================================
// Link Style
// ============================================================================

/**
 * Style configuration for Link components.
 */
export type LinkStyle = {
    /** Whether to open in new tab */
    external?: SubtypeExprOrValue<BooleanType> | boolean;
    /** Visual style variant */
    variant?: SubtypeExprOrValue<LinkVariantType> | LinkVariantLiteral;
    /** Color palette (e.g., "blue", "teal") */
    colorPalette?: SubtypeExprOrValue<StringType>;
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
};
