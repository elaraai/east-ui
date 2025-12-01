/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    StringType,
    variant,
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import {
    AlertType,
    AlertStatusType,
    AlertStatus,
    AlertVariantType,
    AlertVariant,
    type AlertStyle,
    type AlertStatusLiteral,
} from "./types.js";

// Re-export types
export {
    AlertType,
    AlertStatusType,
    AlertStatus,
    AlertVariantType,
    AlertVariant,
    type AlertStyle,
    type AlertStatusLiteral,
    type AlertVariantLiteral,
} from "./types.js";

// ============================================================================
// Alert Function
// ============================================================================

/**
 * Creates an Alert component with status and optional styling.
 *
 * @param status - The alert status (info, warning, success, error)
 * @param style - Optional styling configuration
 * @returns An East expression representing the alert component
 *
 * @remarks
 * Alert is used to display feedback messages to users. Different status
 * types have appropriate color schemes (blue for info, yellow for warning,
 * green for success, red for error).
 *
 * @example
 * ```ts
 * import { Alert, AlertStatus } from "@elaraai/east-ui";
 *
 * // Simple success alert
 * const success = Alert.Root(AlertStatus("success"));
 *
 * // Alert with title
 * const titled = Alert.Root(AlertStatus("info"), {
 *   title: "New update available",
 * });
 *
 * // Alert with title and description
 * const detailed = Alert.Root(AlertStatus("warning"), {
 *   title: "Warning",
 *   description: "Your session will expire in 5 minutes",
 * });
 *
 * // Error alert with styling
 * const error = Alert.Root(AlertStatus("error"), {
 *   title: "Error",
 *   description: "Failed to save changes",
 *   variant: "solid",
 * });
 *
 * // Using string status directly
 * const infoAlert = Alert.Root("info", {
 *   title: "Information",
 * });
 *
 * // Access the type
 * const alertType = Alert.Types.Alert;
 * ```
 */
function createAlert(
    status: SubtypeExprOrValue<AlertStatusType> | AlertStatusLiteral,
    style?: AlertStyle
): ExprType<UIComponentType> {
    const toStringOption = (val: SubtypeExprOrValue<StringType> | undefined) => {
        if (val === undefined) return variant("none", null);
        return variant("some", val);
    };

    const statusValue = typeof status === "string"
        ? East.value(variant(status, null), AlertStatusType)
        : status;

    const variantValue = style?.variant
        ? (typeof style.variant === "string"
            ? East.value(variant(style.variant, null), AlertVariantType)
            : style.variant)
        : undefined;

    return East.value(variant("Alert", {
        status: statusValue,
        title: toStringOption(style?.title),
        description: toStringOption(style?.description),
        variant: variantValue ? variant("some", variantValue) : variant("none", null),
    }), UIComponentType);
}

/**
 * Alert component for displaying feedback messages.
 *
 * @remarks
 * Use `Alert.Root(status, style)` to create an alert, or access `Alert.Types.Alert` for the East type.
 *
 * @example
 * ```ts
 * import { Alert, AlertStatus } from "@elaraai/east-ui";
 *
 * // Create an alert
 * const alert = Alert.Root(AlertStatus("success"), { title: "Saved!" });
 *
 * // Access the type
 * const alertType = Alert.Types.Alert;
 * ```
 */
export const Alert = {
    Root: createAlert,
    Status: AlertStatus,
    Variant: AlertVariant,
    Types: {
        Alert: AlertType,
        Status: AlertStatusType,
        Variant: AlertVariantType,
    },
} as const;
