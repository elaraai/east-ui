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
    StringType,
    NullType,
    VariantType,
    variant,
} from "@elaraai/east";

// ============================================================================
// Alert Status Type
// ============================================================================

/**
 * Status types for Alert component.
 *
 * @remarks
 * - info: Informational alert
 * - warning: Warning alert
 * - success: Success/confirmation alert
 * - error: Error/danger alert
 */
export const AlertStatusType = VariantType({
    /** Informational alert */
    info: NullType,
    /** Warning alert */
    warning: NullType,
    /** Success/confirmation alert */
    success: NullType,
    /** Error/danger alert */
    error: NullType,
});

/**
 * Type representing the AlertStatus structure.
 */
export type AlertStatusType = typeof AlertStatusType;

/**
 * String literal type for alert status values.
 */
export type AlertStatusLiteral = "info" | "warning" | "success" | "error";

/**
 * Helper function to create alert status values.
 *
 * @param status - The status string ("info", "warning", "success", "error")
 * @returns An East expression representing the alert status
 *
 * @example
 * ```ts
 * import { Alert, AlertStatus } from "@elaraai/east-ui";
 *
 * const alert = Alert(AlertStatus("success"), {
 *   title: "Saved!",
 * });
 * ```
 */
export function AlertStatus(status: "info" | "warning" | "success" | "error"): ExprType<AlertStatusType> {
    return East.value(variant(status, null), AlertStatusType);
}

// ============================================================================
// Alert Variant Type
// ============================================================================

/**
 * Variant types for Alert visual style.
 *
 * @remarks
 * - solid: Solid background alert
 * - subtle: Subtle/light background alert
 * - outline: Bordered alert
 */
export const AlertVariantType = VariantType({
    /** Solid background alert */
    solid: NullType,
    /** Subtle/light background alert */
    subtle: NullType,
    /** Bordered alert */
    outline: NullType,
});

/**
 * Type representing the AlertVariant structure.
 */
export type AlertVariantType = typeof AlertVariantType;

/**
 * String literal type for alert variant values.
 */
export type AlertVariantLiteral = "solid" | "subtle" | "outline";

/**
 * Helper function to create alert variant values.
 *
 * @param v - The variant string ("solid", "subtle", "outline")
 * @returns An East expression representing the alert variant
 *
 * @example
 * ```ts
 * import { Alert, AlertStatus, AlertVariant } from "@elaraai/east-ui";
 *
 * const alert = Alert(AlertStatus("info"), {
 *   variant: AlertVariant("subtle"),
 * });
 * ```
 */
export function AlertVariant(v: "solid" | "subtle" | "outline"): ExprType<AlertVariantType> {
    return East.value(variant(v, null), AlertVariantType);
}

// ============================================================================
// Alert Type
// ============================================================================

/**
 * Type for Alert component data.
 *
 * @remarks
 * Alert displays feedback messages to users, indicating status of
 * operations or important information.
 *
 * @property status - The status type (info, warning, success, error)
 * @property title - Optional alert title
 * @property description - Optional alert description
 * @property variant - Visual variant (solid, subtle, outline)
 */
export const AlertType = StructType({
    status: AlertStatusType,
    title: OptionType(StringType),
    description: OptionType(StringType),
    variant: OptionType(AlertVariantType),
});

/**
 * Type representing the Alert structure.
 */
export type AlertType = typeof AlertType;

// ============================================================================
// Alert Style
// ============================================================================

/**
 * TypeScript interface for Alert style options.
 *
 * @property title - Optional alert title
 * @property description - Optional alert description
 * @property variant - Visual variant (solid, subtle, outline)
 */
export interface AlertStyle {
    /** Optional alert title */
    title?: SubtypeExprOrValue<StringType>;
    /** Optional alert description */
    description?: SubtypeExprOrValue<StringType>;
    /** Visual variant (solid, subtle, outline) */
    variant?: SubtypeExprOrValue<AlertVariantType> | AlertVariantLiteral;
}
