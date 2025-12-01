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
    DialogSizeType,
    DialogPlacementType,
    DialogScrollBehaviorType,
    DialogMotionPresetType,
    DialogRoleType,
    DialogStyleType,
    type DialogStyle
} from "./types.js";

// Re-export types
export {
    DialogSizeType,
    DialogPlacementType,
    DialogScrollBehaviorType,
    DialogMotionPresetType,
    DialogRoleType,
    DialogStyleType,
    type DialogStyle,
} from "./types.js";
export type { DialogSizeLiteral, DialogPlacementLiteral, DialogScrollBehaviorLiteral, DialogMotionPresetLiteral, DialogRoleLiteral } from "./types.js";

// ============================================================================
// Dialog Type
// ============================================================================

/**
 * East StructType for Dialog component.
 *
 * @remarks
 * Dialog is a modal overlay with a trigger and body content.
 * The trigger can be any UI component, and body contains UI children.
 *
 * @property trigger - The UI component that opens the dialog
 * @property body - Array of UI components for dialog content
 * @property title - Optional dialog title
 * @property description - Optional dialog description
 * @property style - Optional style configuration
 */
export const DialogType = StructType({
    trigger: UIComponentType,
    body: ArrayType(UIComponentType),
    title: OptionType(StringType),
    description: OptionType(StringType),
    style: OptionType(DialogStyleType),
});

/**
 * Type alias for DialogType.
 */
export type DialogType = typeof DialogType;

// ============================================================================
// Dialog Function
// ============================================================================

/**
 * Creates a Dialog component with a trigger and body content.
 *
 * @param trigger - The UI component that opens the dialog
 * @param body - Array of UI components for dialog content
 * @param style - Optional styling configuration
 * @returns An East expression representing the dialog component
 *
 * @remarks
 * Dialog is a modal window that appears above the main content.
 * It captures focus and prevents interaction with the underlying page.
 *
 * @example
 * ```ts
 * import { Dialog, Button, Text } from "@elaraai/east-ui";
 *
 * // Simple dialog
 * const dialog = Dialog.Root(
 *   Button.Root("Open Dialog"),
 *   [Text.Root("Dialog content here")],
 *   { title: "My Dialog" }
 * );
 *
 * // Dialog with size and placement
 * const largeDialog = Dialog.Root(
 *   Button.Root("Settings"),
 *   [Text.Root("Settings content")],
 *   {
 *     title: "Settings",
 *     size: "lg",
 *     placement: "center",
 *     closeOnEscape: true,
 *   }
 * );
 * ```
 */
function createDialog(
    trigger: SubtypeExprOrValue<UIComponentType>,
    body: SubtypeExprOrValue<ArrayType<UIComponentType>>,
    style?: DialogStyle
): ExprType<UIComponentType> {
    const sizeValue = style?.size
        ? (typeof style.size === "string"
            ? East.value(variant(style.size, null), DialogSizeType)
            : style.size)
        : undefined;

    const placementValue = style?.placement
        ? (typeof style.placement === "string"
            ? East.value(variant(style.placement, null), DialogPlacementType)
            : style.placement)
        : undefined;

    const scrollBehaviorValue = style?.scrollBehavior
        ? (typeof style.scrollBehavior === "string"
            ? East.value(variant(style.scrollBehavior, null), DialogScrollBehaviorType)
            : style.scrollBehavior)
        : undefined;

    const motionPresetValue = style?.motionPreset
        ? (typeof style.motionPreset === "string"
            ? East.value(variant(style.motionPreset, null), DialogMotionPresetType)
            : style.motionPreset)
        : undefined;

    const roleValue = style?.role
        ? (typeof style.role === "string"
            ? East.value(variant(style.role, null), DialogRoleType)
            : style.role)
        : undefined;

    return East.value(variant("Dialog", {
        trigger: trigger,
        body: body,
        title: style?.title !== undefined ? variant("some", style.title) : variant("none", null),
        description: style?.description !== undefined ? variant("some", style.description) : variant("none", null),
        style: sizeValue || placementValue || scrollBehaviorValue || motionPresetValue || roleValue
            ? variant("some", East.value({
                size: sizeValue ? variant("some", sizeValue) : variant("none", null),
                placement: placementValue ? variant("some", placementValue) : variant("none", null),
                scrollBehavior: scrollBehaviorValue ? variant("some", scrollBehaviorValue) : variant("none", null),
                motionPreset: motionPresetValue ? variant("some", motionPresetValue) : variant("none", null),
                role: roleValue ? variant("some", roleValue) : variant("none", null),
            }, DialogStyleType))
            : variant("none", null),
    }), UIComponentType);
}

/**
 * Dialog component for modal overlays.
 *
 * @remarks
 * Use `Dialog.Root(trigger, body, style)` to create a dialog, or access `Dialog.Types` for East types.
 *
 * @example
 * ```ts
 * import { Dialog, Button, Text } from "@elaraai/east-ui";
 *
 * // Create a dialog
 * const dialog = Dialog.Root(
 *   Button.Root("Open"),
 *   [Text.Root("Content")],
 *   { title: "My Dialog" }
 * );
 *
 * // Access the type
 * const styleType = Dialog.Types.Style;
 * ```
 */
export const Dialog = {
    Root: createDialog,
    Types: {
        Dialog: DialogType,
        Style: DialogStyleType,
        Size: DialogSizeType,
        Placement: DialogPlacementType,
        ScrollBehavior: DialogScrollBehaviorType,
        MotionPreset: DialogMotionPresetType,
        Role: DialogRoleType,
    },
} as const;
