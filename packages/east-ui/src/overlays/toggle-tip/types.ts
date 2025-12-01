/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type SubtypeExprOrValue,
    OptionType,
    StructType,
    BooleanType,
} from "@elaraai/east";

import { PlacementType, type PlacementLiteral } from "../tooltip/types.js";

// Re-export PlacementType
export { PlacementType, type PlacementLiteral } from "../tooltip/types.js";

// ============================================================================
// ToggleTip Style Type
// ============================================================================

/**
 * Style type for ToggleTip component.
 *
 * @property placement - Position relative to trigger
 * @property hasArrow - Show arrow pointing to trigger
 */
export const ToggleTipStyleType = StructType({
    placement: OptionType(PlacementType),
    hasArrow: OptionType(BooleanType),
});

export type ToggleTipStyleType = typeof ToggleTipStyleType;

// ============================================================================
// ToggleTip Style Interface
// ============================================================================

/**
 * TypeScript interface for ToggleTip style options.
 */
export interface ToggleTipStyle {
    /** Position relative to trigger */
    placement?: SubtypeExprOrValue<PlacementType> | PlacementLiteral;
    /** Show arrow pointing to trigger */
    hasArrow?: SubtypeExprOrValue<BooleanType>;
    /** Controlled open state */
    open?: SubtypeExprOrValue<BooleanType>;
    /** Initial open state */
    defaultOpen?: SubtypeExprOrValue<BooleanType>;
    /** Close when clicking outside */
    closeOnInteractOutside?: SubtypeExprOrValue<BooleanType>;
    /** Close on escape key */
    closeOnEscape?: SubtypeExprOrValue<BooleanType>;
}
