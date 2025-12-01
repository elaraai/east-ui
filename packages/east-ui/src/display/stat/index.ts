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
import { StatType, StatIndicatorType, type StatStyle } from "./types.js";

// Re-export types
export { StatType, StatIndicatorType, StatIndicator, type StatStyle, type StatIndicatorLiteral } from "./types.js";

// ============================================================================
// Stat Function
// ============================================================================

/**
 * Creates a Stat component with label, value, and optional trend info.
 *
 * @param label - The stat label/title
 * @param value - The main stat value
 * @param style - Optional styling configuration
 * @returns An East expression representing the stat component
 *
 * @remarks
 * Stat is used to display key metrics or KPIs with optional trend indicators
 * and help text describing changes.
 *
 * @example
 * ```ts
 * import { Stat, StatIndicator } from "@elaraai/east-ui";
 *
 * // Simple stat
 * const revenue = Stat.Root("Revenue", "$45,231");
 *
 * // Stat with help text
 * const users = Stat.Root("Total Users", "1,234", {
 *   helpText: "From last month",
 * });
 *
 * // Stat with positive trend
 * const growth = Stat.Root("Growth", "+23.36%", {
 *   helpText: "From last week",
 *   indicator: "up",
 * });
 *
 * // Stat with negative trend
 * const bounce = Stat.Root("Bounce Rate", "-12.5%", {
 *   helpText: "Compared to yesterday",
 *   indicator: "down",
 * });
 *
 * // Access the type
 * const statType = Stat.Types.Stat;
 * ```
 */
function createStat(
    label: SubtypeExprOrValue<StringType>,
    value: SubtypeExprOrValue<StringType>,
    style?: StatStyle
): ExprType<UIComponentType> {
    const toStringOption = (val: SubtypeExprOrValue<StringType> | undefined) => {
        if (val === undefined) return variant("none", null);
        return variant("some", val);
    };

    const indicatorValue = style?.indicator
        ? (typeof style.indicator === "string"
            ? East.value(variant(style.indicator, null), StatIndicatorType)
            : style.indicator)
        : undefined;

    return East.value(variant("Stat", {
        label: label,
        value: value,
        helpText: toStringOption(style?.helpText),
        indicator: indicatorValue ? variant("some", indicatorValue) : variant("none", null),
    }), UIComponentType);
}

/**
 * Stat component for displaying key metrics.
 *
 * @remarks
 * Use `Stat.Root(label, value, style)` to create a stat, or access `Stat.Types.Stat` for the East type.
 *
 * @example
 * ```ts
 * import { Stat } from "@elaraai/east-ui";
 *
 * // Create a stat
 * const stat = Stat.Root("Revenue", "$45,231", { indicator: "up" });
 *
 * // Access the type
 * const statType = Stat.Types.Stat;
 * ```
 */
export const Stat = {
    Root: createStat,
    Types: {
        Stat: StatType,
        Indicator: StatIndicatorType,
    },
} as const;
