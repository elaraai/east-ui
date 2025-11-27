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
    PlacementType,
    Placement,
    TooltipStyleType,
    type TooltipStyle,
} from "./types.js";

// Re-export types
export {
    PlacementType,
    Placement,
    TooltipStyleType,
    type TooltipStyle,
    type PlacementLiteral,
} from "./types.js";

// ============================================================================
// Tooltip Function
// ============================================================================

/**
 * Creates a Tooltip component with a trigger element and content.
 *
 * @param trigger - The UI component that triggers the tooltip on hover
 * @param content - The tooltip text content
 * @param style - Optional styling configuration
 * @returns An East expression representing the tooltip component
 *
 * @remarks
 * Tooltip displays additional information when hovering over an element.
 * The trigger can be any UI component (button, text, icon, etc.).
 *
 * @example
 * ```ts
 * import { Tooltip, Button, Text } from "@elaraai/east-ui";
 *
 * // Simple tooltip on a button
 * const tooltipButton = Tooltip.Root(
 *   Button.Root("Hover me"),
 *   "This is a helpful tip"
 * );
 *
 * // Tooltip with placement
 * const topTooltip = Tooltip.Root(
 *   Text.Root("Hover for info"),
 *   "Additional information",
 *   { placement: "top" }
 * );
 *
 * // Tooltip with arrow
 * const arrowTooltip = Tooltip.Root(
 *   Button.Root("Save"),
 *   "Save your changes",
 *   { placement: "bottom", hasArrow: true }
 * );
 *
 * // Access the type
 * const tooltipType = Tooltip.Types.Style;
 * ```
 */
function createTooltip(
    trigger: SubtypeExprOrValue<UIComponentType>,
    content: SubtypeExprOrValue<StringType>,
    style?: TooltipStyle
): ExprType<UIComponentType> {
    const placementValue = style?.placement
        ? (typeof style.placement === "string"
            ? East.value(variant(style.placement, null), PlacementType)
            : style.placement)
        : undefined;

    return East.value(variant("Tooltip", {
        trigger: trigger,
        content: content,
        placement: placementValue ? variant("some", placementValue) : variant("none", null),
        hasArrow: style?.hasArrow !== undefined ? variant("some", style.hasArrow) : variant("none", null),
    }), UIComponentType);
}

/**
 * Tooltip component for displaying additional information on hover.
 *
 * @remarks
 * Use `Tooltip.Root(trigger, content, style)` to create a tooltip, or access `Tooltip.Types` for East types.
 *
 * @example
 * ```ts
 * import { Tooltip, Button } from "@elaraai/east-ui";
 *
 * // Create a tooltip
 * const tooltip = Tooltip.Root(Button.Root("Help"), "Click for help");
 *
 * // Access the type
 * const styleType = Tooltip.Types.Style;
 * ```
 */
export const Tooltip = {
    Root: createTooltip,
    Placement: Placement,
    Types: {
        Style: TooltipStyleType,
        Placement: PlacementType,
    },
} as const;
