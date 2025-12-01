/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type SubtypeExprOrValue,
    OptionType,
    StructType,
    StringType,
    NullType,
    BooleanType,
    VariantType,
    IntegerType,
} from "@elaraai/east";

// ============================================================================
// ActionBar Item Type
// ============================================================================

/**
 * Action bar item variant type.
 *
 * @property Action - A clickable action with value and label
 * @property Separator - A visual separator between actions
 */
export const ActionBarItemType = VariantType({
    Action: StructType({
        value: StringType,
        label: StringType,
        disabled: OptionType(BooleanType),
    }),
    Separator: NullType,
});

export type ActionBarItemType = typeof ActionBarItemType;

// ============================================================================
// ActionBar Style Type
// ============================================================================

/**
 * Style type for ActionBar component.
 *
 * @remarks
 * ActionBar has fixed styling - no size/variant options.
 */
export const ActionBarStyleType = StructType({
    // No size/variant - fixed styling
});

export type ActionBarStyleType = typeof ActionBarStyleType;

// ============================================================================
// ActionBar Style Interface
// ============================================================================

/**
 * TypeScript interface for ActionBar style options.
 */
export interface ActionBarStyle {
    /** Selection count to display */
    selectionCount?: SubtypeExprOrValue<IntegerType>;
    /** Label for selection (e.g., "items selected") */
    selectionLabel?: SubtypeExprOrValue<StringType>;
    /** Controlled open state */
    open?: SubtypeExprOrValue<BooleanType>;
    /** Initial open state */
    defaultOpen?: SubtypeExprOrValue<BooleanType>;
    /** Close when clicking outside */
    closeOnInteractOutside?: SubtypeExprOrValue<BooleanType>;
    /** Close on escape key */
    closeOnEscape?: SubtypeExprOrValue<BooleanType>;
}
