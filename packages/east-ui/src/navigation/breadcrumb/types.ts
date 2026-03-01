/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type SubtypeExprOrValue,
    OptionType,
    StructType,
    StringType,
    BooleanType,
    ArrayType,
    NullType,
    FunctionType,
    VariantType,
} from "@elaraai/east";

import { ColorSchemeType } from "../../style.js";
import type { ColorSchemeLiteral } from "../../style.js";

// ============================================================================
// Breadcrumb Variant Type
// ============================================================================

/**
 * Breadcrumb variant type for visual styling.
 *
 * @property underline - Underlined links with color palette
 * @property plain - Plain text links that highlight on hover
 */
export const BreadcrumbVariantType = VariantType({
    underline: NullType,
    plain: NullType,
});

/**
 * Type representing breadcrumb variant values.
 */
export type BreadcrumbVariantType = typeof BreadcrumbVariantType;

/**
 * String literal type for breadcrumb variant values.
 */
export type BreadcrumbVariantLiteral = "underline" | "plain";

// ============================================================================
// Breadcrumb Size Type
// ============================================================================

/**
 * Size options for Breadcrumb component.
 *
 * @remarks
 * Chakra UI Breadcrumb supports sm, md, lg sizes (not xs).
 *
 * @property sm - Small breadcrumb
 * @property md - Medium breadcrumb (default)
 * @property lg - Large breadcrumb
 */
export const BreadcrumbSizeType = VariantType({
    sm: NullType,
    md: NullType,
    lg: NullType,
});

/**
 * Type representing breadcrumb size values.
 */
export type BreadcrumbSizeType = typeof BreadcrumbSizeType;

/**
 * String literal type for breadcrumb size values.
 */
export type BreadcrumbSizeLiteral = "sm" | "md" | "lg";

// ============================================================================
// Breadcrumb Item Type
// ============================================================================

/**
 * Type for a single breadcrumb item.
 *
 * @property label - The display text for this breadcrumb item
 * @property current - Whether this item represents the current page
 * @property onClick - Optional click handler for navigation
 */
export const BreadcrumbItemType = StructType({
    label: StringType,
    current: OptionType(BooleanType),
    onClick: OptionType(FunctionType([], NullType)),
});

/**
 * Type representing the BreadcrumbItem structure.
 */
export type BreadcrumbItemType = typeof BreadcrumbItemType;

// ============================================================================
// Breadcrumb Root Type
// ============================================================================

/**
 * Type for the Breadcrumb component.
 *
 * @property items - Array of breadcrumb items
 * @property variant - Visual variant (underline or plain)
 * @property size - Size of the breadcrumb (sm, md, lg)
 * @property colorPalette - Color scheme for the breadcrumb
 */
export const BreadcrumbRootType = StructType({
    items: ArrayType(BreadcrumbItemType),
    variant: OptionType(BreadcrumbVariantType),
    size: OptionType(BreadcrumbSizeType),
    colorPalette: OptionType(ColorSchemeType),
});

/**
 * Type representing the Breadcrumb structure.
 */
export type BreadcrumbRootType = typeof BreadcrumbRootType;

// ============================================================================
// Breadcrumb Style
// ============================================================================

/**
 * TypeScript interface for Breadcrumb style options.
 */
export interface BreadcrumbStyle {
    /** Visual variant (underline or plain) */
    variant?: SubtypeExprOrValue<BreadcrumbVariantType> | BreadcrumbVariantLiteral;
    /** Size of the breadcrumb */
    size?: SubtypeExprOrValue<BreadcrumbSizeType> | BreadcrumbSizeLiteral;
    /** Color scheme for the breadcrumb */
    colorPalette?: SubtypeExprOrValue<ColorSchemeType> | ColorSchemeLiteral;
}
