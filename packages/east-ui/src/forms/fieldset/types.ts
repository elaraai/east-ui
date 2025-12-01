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
} from "@elaraai/east";

import { SizeType } from "../../style.js";
import type { SizeLiteral } from "../../style.js";

// ============================================================================
// Fieldset Style Type
// ============================================================================

/**
 * Style type for Fieldset component.
 *
 * @remarks
 * Contains optional styling properties for the fieldset.
 *
 * @property size - Size of the fieldset (sm, md, lg)
 */
export const FieldsetStyleType = StructType({
    /** Size of the fieldset */
    size: OptionType(SizeType),
});

/**
 * Type representing the FieldsetStyle structure.
 */
export type FieldsetStyleType = typeof FieldsetStyleType;

// ============================================================================
// Fieldset Style Interface
// ============================================================================

/**
 * TypeScript interface for Fieldset style options.
 *
 * @property legend - Title for the fieldset
 * @property helperText - Descriptive help text
 * @property errorText - Validation error message
 * @property disabled - Whether all fields in the fieldset are disabled
 * @property invalid - Whether the fieldset is in an invalid state
 * @property size - Size of the fieldset (sm, md, lg)
 */
export interface FieldsetStyle {
    /** Title for the fieldset (renders as legend) */
    legend?: SubtypeExprOrValue<StringType>;
    /** Descriptive help text */
    helperText?: SubtypeExprOrValue<StringType>;
    /** Validation error message */
    errorText?: SubtypeExprOrValue<StringType>;
    /** Whether all fields in the fieldset are disabled */
    disabled?: SubtypeExprOrValue<BooleanType>;
    /** Whether the fieldset is in an invalid state */
    invalid?: SubtypeExprOrValue<BooleanType>;
    /** Size of the fieldset (sm, md, lg) */
    size?: SubtypeExprOrValue<SizeType> | SizeLiteral;
}
