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
    ArrayType,
    variant
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import {
    PopoverSizeType,
    PopoverStyleType,
    type PopoverStyle, PlacementType
} from "./types.js";

// Re-export types
export {
    PopoverSizeType,
    PopoverStyleType,
    type PopoverStyle,
    PlacementType,
} from "./types.js";
export type { PopoverSizeLiteral, PlacementLiteral } from "./types.js";

// ============================================================================
// Popover Type
// ============================================================================

/**
 * East StructType for Popover component.
 *
 * @remarks
 * Popover is a floating panel that appears near a trigger element.
 * It can contain interactive content and is controlled via click.
 *
 * @property trigger - The UI component that opens the popover
 * @property body - Array of UI components for popover content
 * @property title - Optional popover title
 * @property description - Optional popover description
 * @property style - Optional style configuration
 */
export const PopoverType = StructType({
    trigger: UIComponentType,
    body: ArrayType(UIComponentType),
    title: OptionType(StringType),
    description: OptionType(StringType),
    style: OptionType(PopoverStyleType),
});

/**
 * Type alias for PopoverType.
 */
export type PopoverType = typeof PopoverType;

// ============================================================================
// Popover Function
// ============================================================================

/**
 * Creates a Popover component with a trigger and body content.
 *
 * @param trigger - The UI component that opens the popover
 * @param body - Array of UI components for popover content
 * @param style - Optional styling configuration
 * @returns An East expression representing the popover component
 *
 * @remarks
 * Popover displays rich interactive content in a floating panel.
 * Unlike Tooltip, it's controlled via click and can contain form elements.
 *
 * @example
 * ```ts
 * import { Popover, Button, Text, StringInput } from "@elaraai/east-ui";
 *
 * // Simple popover
 * const popover = Popover.Root(
 *   Button.Root("Edit"),
 *   [Text.Root("Edit your profile")],
 *   { title: "Edit Profile" }
 * );
 *
 * // Popover with form content
 * const formPopover = Popover.Root(
 *   Button.Root("Settings"),
 *   [
 *     StringInput.Root("name", { placeholder: "Enter name" }),
 *     Button.Root("Save"),
 *   ],
 *   {
 *     title: "Quick Settings",
 *     placement: "bottom-start",
 *     closeOnInteractOutside: true,
 *   }
 * );
 * ```
 */
function createPopover(
    trigger: SubtypeExprOrValue<UIComponentType>,
    body: SubtypeExprOrValue<ArrayType<UIComponentType>>,
    style?: PopoverStyle
): ExprType<UIComponentType> {
    const sizeValue = style?.size
        ? (typeof style.size === "string"
            ? East.value(variant(style.size, null), PopoverSizeType)
            : style.size)
        : undefined;

    const placementValue = style?.placement
        ? (typeof style.placement === "string"
            ? East.value(variant(style.placement, null), PlacementType)
            : style.placement)
        : undefined;

    return East.value(variant("Popover", {
        trigger: trigger,
        body: body,
        title: style?.title !== undefined ? variant("some", style.title) : variant("none", null),
        description: style?.description !== undefined ? variant("some", style.description) : variant("none", null),
        style: sizeValue || placementValue || style?.hasArrow !== undefined || style?.gutter !== undefined
            ? variant("some", East.value({
                size: sizeValue ? variant("some", sizeValue) : variant("none", null),
                placement: placementValue ? variant("some", placementValue) : variant("none", null),
                hasArrow: style?.hasArrow !== undefined ? variant("some", style.hasArrow) : variant("none", null),
                gutter: style?.gutter !== undefined ? variant("some", style.gutter) : variant("none", null),
            }, PopoverStyleType))
            : variant("none", null),
    }), UIComponentType);
}

/**
 * Popover component for floating interactive content.
 *
 * @remarks
 * Use `Popover.Root(trigger, body, style)` to create a popover, or access `Popover.Types` for East types.
 *
 * @example
 * ```ts
 * import { Popover, Button, Text } from "@elaraai/east-ui";
 *
 * // Create a popover
 * const popover = Popover.Root(
 *   Button.Root("Open"),
 *   [Text.Root("Content")],
 *   { title: "My Popover", placement: "bottom" }
 * );
 *
 * // Access the type
 * const styleType = Popover.Types.Style;
 * ```
 */
export const Popover = {
    Root: createPopover,
    Types: {
        Popover: PopoverType,
        Style: PopoverStyleType,
        Size: PopoverSizeType,
        Placement: PlacementType,
    },
} as const;
