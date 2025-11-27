/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    OptionType,
    StructType,
    NullType,
    BooleanType,
    VariantType,
    variant,
} from "@elaraai/east";

// ============================================================================
// Placement Type
// ============================================================================

/**
 * Placement options for Tooltip positioning.
 *
 * @remarks
 * Controls where the tooltip appears relative to its trigger element.
 * Supports all cardinal directions with start/end variations.
 *
 * @property top - Centered above the trigger
 * @property top_start - Above, aligned to start
 * @property top_end - Above, aligned to end
 * @property bottom - Centered below the trigger
 * @property bottom_start - Below, aligned to start
 * @property bottom_end - Below, aligned to end
 * @property left - Centered to the left
 * @property left_start - Left, aligned to start
 * @property left_end - Left, aligned to end
 * @property right - Centered to the right
 * @property right_start - Right, aligned to start
 * @property right_end - Right, aligned to end
 */
export const PlacementType = VariantType({
    /** Centered above the trigger */
    top: NullType,
    /** Above, aligned to start */
    top_start: NullType,
    /** Above, aligned to end */
    top_end: NullType,
    /** Centered below the trigger */
    bottom: NullType,
    /** Below, aligned to start */
    bottom_start: NullType,
    /** Below, aligned to end */
    bottom_end: NullType,
    /** Centered to the left */
    left: NullType,
    /** Left, aligned to start */
    left_start: NullType,
    /** Left, aligned to end */
    left_end: NullType,
    /** Centered to the right */
    right: NullType,
    /** Right, aligned to start */
    right_start: NullType,
    /** Right, aligned to end */
    right_end: NullType,
});

/**
 * Type representing the Placement structure.
 */
export type PlacementType = typeof PlacementType;

/**
 * String literal type for placement values.
 */
export type PlacementLiteral =
    | "top" | "top_start" | "top_end"
    | "bottom" | "bottom_start" | "bottom_end"
    | "left" | "left_start" | "left_end"
    | "right" | "right_start" | "right_end";

/**
 * Helper function to create placement values.
 *
 * @param placement - The placement string
 * @returns An East expression representing the placement
 *
 * @example
 * ```ts
 * import { Tooltip, Placement } from "@elaraai/east-ui";
 *
 * const tooltip = Tooltip.Root(trigger, "Help text", {
 *   placement: Placement("top"),
 * });
 * ```
 */
export function Placement(placement: PlacementLiteral): ExprType<PlacementType> {
    return East.value(variant(placement, null), PlacementType);
}

// ============================================================================
// Tooltip Style Type
// ============================================================================

/**
 * Style type for Tooltip component.
 *
 * @remarks
 * Contains optional styling properties for the tooltip.
 *
 * @property placement - Where to position the tooltip
 * @property hasArrow - Whether to show an arrow pointing to the trigger
 */
export const TooltipStyleType = StructType({
    placement: OptionType(PlacementType),
    hasArrow: OptionType(BooleanType),
});

/**
 * Type representing the TooltipStyle structure.
 */
export type TooltipStyleType = typeof TooltipStyleType;

// ============================================================================
// Tooltip Style Interface
// ============================================================================

/**
 * TypeScript interface for Tooltip style options.
 *
 * @property placement - Where to position the tooltip
 * @property hasArrow - Whether to show an arrow pointing to the trigger
 */
export interface TooltipStyle {
    /** Where to position the tooltip */
    placement?: SubtypeExprOrValue<PlacementType> | PlacementLiteral;
    /** Whether to show an arrow pointing to the trigger */
    hasArrow?: SubtypeExprOrValue<BooleanType>;
}
