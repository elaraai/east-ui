/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type SubtypeExprOrValue,
    StringType,
    BooleanType,
} from "@elaraai/east";

// ============================================================================
// Field Style Interface
// ============================================================================

/**
 * TypeScript interface for Field configuration options.
 *
 * @remarks
 * Field wraps a form control (Input, Select, Checkbox, etc.) with
 * a label and optional helper/error text.
 *
 * @property label - Label text for the field
 * @property helperText - Optional descriptive help text
 * @property errorText - Optional validation error message
 * @property required - Whether the field is required
 * @property disabled - Whether the field is disabled
 * @property invalid - Whether the field is in an invalid state
 * @property readOnly - Whether the field is read-only
 */
export interface FieldStyle {
    /** Optional descriptive help text */
    helperText?: SubtypeExprOrValue<StringType>;
    /** Optional validation error message */
    errorText?: SubtypeExprOrValue<StringType>;
    /** Whether the field is required */
    required?: SubtypeExprOrValue<BooleanType>;
    /** Whether the field is disabled */
    disabled?: SubtypeExprOrValue<BooleanType>;
    /** Whether the field is in an invalid state */
    invalid?: SubtypeExprOrValue<BooleanType>;
    /** Whether the field is read-only */
    readOnly?: SubtypeExprOrValue<BooleanType>;
}
