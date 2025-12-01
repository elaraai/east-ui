/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    StringType, OptionType,
    StructType,
    variant
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import {
    ToggleTipStyleType,
    type ToggleTipStyle,
    PlacementType
} from "./types.js";

// Re-export types
export {
    ToggleTipStyleType,
    type ToggleTipStyle,
    PlacementType,
} from "./types.js";
export type { PlacementLiteral } from "./types.js";

// ============================================================================
// ToggleTip Type
// ============================================================================

/**
 * East StructType for ToggleTip component.
 *
 * @remarks
 * ToggleTip is a click-activated tooltip for accessibility.
 * Unlike Tooltip (hover), ToggleTip is toggled by clicking.
 *
 * @property trigger - The UI component that toggles the tip
 * @property content - The text content of the tip
 * @property style - Optional style configuration
 */
export const ToggleTipType = StructType({
    trigger: UIComponentType,
    content: StringType,
    style: OptionType(ToggleTipStyleType),
});

/**
 * Type alias for ToggleTipType.
 */
export type ToggleTipType = typeof ToggleTipType;

// ============================================================================
// ToggleTip Function
// ============================================================================

/**
 * Creates a ToggleTip component with a trigger and content.
 *
 * @param trigger - The UI component that toggles the tip
 * @param content - The text content of the tip
 * @param style - Optional styling configuration
 * @returns An East expression representing the toggle tip component
 *
 * @remarks
 * ToggleTip provides an accessible alternative to hover-based tooltips.
 * It's activated by clicking, making it accessible to keyboard and touch users.
 *
 * @example
 * ```ts
 * import { ToggleTip, Button, Icon } from "@elaraai/east-ui";
 *
 * // Info toggle tip
 * const infoTip = ToggleTip.Root(
 *   Button.Root("?", { variant: "ghost", size: "sm" }),
 *   "Click to learn more about this feature"
 * );
 *
 * // Toggle tip with placement
 * const bottomTip = ToggleTip.Root(
 *   Icon.Root("info"),
 *   "Additional information here",
 *   { placement: "bottom", hasArrow: true }
 * );
 * ```
 */
function createToggleTip(
    trigger: SubtypeExprOrValue<UIComponentType>,
    content: SubtypeExprOrValue<StringType>,
    style?: ToggleTipStyle
): ExprType<UIComponentType> {
    const placementValue = style?.placement
        ? (typeof style.placement === "string"
            ? East.value(variant(style.placement, null), PlacementType)
            : style.placement)
        : undefined;

    return East.value(variant("ToggleTip", {
        trigger: trigger,
        content: content,
        style: placementValue || style?.hasArrow !== undefined
            ? variant("some", East.value({
                placement: placementValue ? variant("some", placementValue) : variant("none", null),
                hasArrow: style?.hasArrow !== undefined ? variant("some", style.hasArrow) : variant("none", null),
            }, ToggleTipStyleType))
            : variant("none", null),
    }), UIComponentType);
}

/**
 * ToggleTip component for click-activated tips.
 *
 * @remarks
 * Use `ToggleTip.Root(trigger, content, style)` to create a toggle tip, or access `ToggleTip.Types` for East types.
 *
 * @example
 * ```ts
 * import { ToggleTip, Button } from "@elaraai/east-ui";
 *
 * // Create a toggle tip
 * const tip = ToggleTip.Root(
 *   Button.Root("?"),
 *   "Click for help",
 *   { placement: "top" }
 * );
 *
 * // Access the type
 * const styleType = ToggleTip.Types.Style;
 * ```
 */
export const ToggleTip = {
    Root: createToggleTip,
    Types: {
        ToggleTip: ToggleTipType,
        Style: ToggleTipStyleType,
        Placement: PlacementType,
    },
} as const;
