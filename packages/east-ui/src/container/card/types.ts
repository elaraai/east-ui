/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    NullType,
    OptionType,
    StructType,
    StringType,
    VariantType,
    variant,
} from "@elaraai/east";

import { SizeType } from "../../style.js";
import type { SizeLiteral } from "../../style.js";

// ============================================================================
// Card Variant Type
// ============================================================================

/**
 * Variant types for Card visual style.
 *
 * @remarks
 * - elevated: Card with shadow/elevation
 * - outline: Card with border outline
 * - subtle: Card with subtle background
 */
export const CardVariantType = VariantType({
    /** Card with shadow/elevation */
    elevated: NullType,
    /** Card with border outline */
    outline: NullType,
    /** Card with subtle background */
    subtle: NullType,
});

/**
 * Type representing the CardVariant structure.
 */
export type CardVariantType = typeof CardVariantType;

/**
 * String literal type for card variant values.
 */
export type CardVariantLiteral = "elevated" | "outline" | "subtle";

/**
 * Helper function to create card variant values.
 *
 * @param v - The variant string ("elevated", "outline", "subtle")
 * @returns An East expression representing the card variant
 */
export function CardVariant(v: "elevated" | "outline" | "subtle"): ExprType<CardVariantType> {
    return East.value(variant(v, null), CardVariantType);
}

// ============================================================================
// Card Style Type
// ============================================================================

/**
 * Type for Card style properties.
 *
 * @property variant - Visual variant (elevated, outline, subtle)
 * @property size - Size of the card
 */
export const CardStyleType = StructType({
    variant: OptionType(CardVariantType),
    size: OptionType(SizeType),
});

/**
 * Type representing the CardStyle structure.
 */
export type CardStyleType = typeof CardStyleType;

// ============================================================================
// Card Style Interface
// ============================================================================

/**
 * TypeScript interface for Card style options.
 *
 * @property title - Optional card title
 * @property description - Optional card description
 * @property variant - Visual variant (elevated, outline, subtle)
 * @property size - Size of the card
 */
export interface CardStyle {
    /** Optional card title */
    title?: SubtypeExprOrValue<StringType>;
    /** Optional card description */
    description?: SubtypeExprOrValue<StringType>;
    /** Visual variant (elevated, outline, subtle) */
    variant?: SubtypeExprOrValue<CardVariantType> | CardVariantLiteral;
    /** Size of the card */
    size?: SubtypeExprOrValue<SizeType> | SizeLiteral;
}
