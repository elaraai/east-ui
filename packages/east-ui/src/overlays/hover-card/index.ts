/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East, OptionType,
    StructType,
    ArrayType,
    variant
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import {
    HoverCardSizeType,
    HoverCardStyleType,
    type HoverCardStyle, PlacementType
} from "./types.js";

// Re-export types
export {
    HoverCardSizeType,
    HoverCardStyleType,
    type HoverCardStyle,
    PlacementType,
} from "./types.js";
export type { HoverCardSizeLiteral, PlacementLiteral } from "./types.js";

// ============================================================================
// HoverCard Type
// ============================================================================

/**
 * East StructType for HoverCard component.
 *
 * @remarks
 * HoverCard displays rich content when hovering over a trigger element.
 * Similar to Tooltip but with more structured content (e.g., user profiles).
 *
 * @property trigger - The UI component that shows the hover card on hover
 * @property body - Array of UI components for hover card content
 * @property style - Optional style configuration
 */
export const HoverCardType = StructType({
    trigger: UIComponentType,
    body: ArrayType(UIComponentType),
    style: OptionType(HoverCardStyleType),
});

/**
 * Type alias for HoverCardType.
 */
export type HoverCardType = typeof HoverCardType;

// ============================================================================
// HoverCard Function
// ============================================================================

/**
 * Creates a HoverCard component with a trigger and body content.
 *
 * @param trigger - The UI component that shows the hover card on hover
 * @param body - Array of UI components for hover card content
 * @param style - Optional styling configuration
 * @returns An East expression representing the hover card component
 *
 * @remarks
 * HoverCard displays rich preview content when hovering over an element.
 * Ideal for user profile previews, link previews, or contextual information.
 *
 * @example
 * ```ts
 * import { HoverCard, Text, Avatar, Stack } from "@elaraai/east-ui";
 *
 * // User profile hover card
 * const profileCard = HoverCard.Root(
 *   Text.Root("@johndoe"),
 *   [
 *     Stack.Root([
 *       Avatar.Root("JD", { name: "John Doe" }),
 *       Text.Root("John Doe"),
 *       Text.Root("Software Engineer"),
 *     ], { gap: "2" }),
 *   ],
 *   { placement: "bottom", openDelay: 200 }
 * );
 *
 * // Link preview hover card
 * const linkPreview = HoverCard.Root(
 *   Text.Root("View documentation"),
 *   [
 *     Text.Root("East UI Documentation"),
 *     Text.Root("Complete guide to East UI components"),
 *   ],
 *   { hasArrow: true }
 * );
 * ```
 */
function createHoverCard(
    trigger: SubtypeExprOrValue<UIComponentType>,
    body: SubtypeExprOrValue<ArrayType<UIComponentType>>,
    style?: HoverCardStyle
): ExprType<UIComponentType> {
    const sizeValue = style?.size
        ? (typeof style.size === "string"
            ? East.value(variant(style.size, null), HoverCardSizeType)
            : style.size)
        : undefined;

    const placementValue = style?.placement
        ? (typeof style.placement === "string"
            ? East.value(variant(style.placement, null), PlacementType)
            : style.placement)
        : undefined;

    return East.value(variant("HoverCard", {
        trigger: trigger,
        body: body,
        style: sizeValue || placementValue || style?.hasArrow !== undefined || style?.openDelay !== undefined || style?.closeDelay !== undefined
            ? variant("some", East.value({
                size: sizeValue ? variant("some", sizeValue) : variant("none", null),
                placement: placementValue ? variant("some", placementValue) : variant("none", null),
                hasArrow: style?.hasArrow !== undefined ? variant("some", style.hasArrow) : variant("none", null),
                openDelay: style?.openDelay !== undefined ? variant("some", style.openDelay) : variant("none", null),
                closeDelay: style?.closeDelay !== undefined ? variant("some", style.closeDelay) : variant("none", null),
            }, HoverCardStyleType))
            : variant("none", null),
    }), UIComponentType);
}

/**
 * HoverCard component for rich hover previews.
 *
 * @remarks
 * Use `HoverCard.Root(trigger, body, style)` to create a hover card, or access `HoverCard.Types` for East types.
 *
 * @example
 * ```ts
 * import { HoverCard, Text, Avatar } from "@elaraai/east-ui";
 *
 * // Create a hover card
 * const hoverCard = HoverCard.Root(
 *   Text.Root("@username"),
 *   [Avatar.Root("UN"), Text.Root("User Name")],
 *   { placement: "bottom" }
 * );
 *
 * // Access the type
 * const styleType = HoverCard.Types.Style;
 * ```
 */
export const HoverCard = {
    Root: createHoverCard,
    Types: {
        HoverCard: HoverCardType,
        Style: HoverCardStyleType,
        Size: HoverCardSizeType,
        Placement: PlacementType,
    },
} as const;
