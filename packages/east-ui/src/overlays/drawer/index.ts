/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
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
    DrawerSizeType,
    DrawerPlacementType,
    DrawerStyleType,
    type DrawerStyle
} from "./types.js";

// Re-export types
export {
    DrawerSizeType,
    DrawerPlacementType,
    DrawerStyleType,
    type DrawerStyle,
} from "./types.js";
export type { DrawerSizeLiteral, DrawerPlacementLiteral } from "./types.js";

// ============================================================================
// Drawer Type
// ============================================================================

/**
 * East StructType for Drawer component.
 *
 * @remarks
 * Drawer is a panel that slides in from an edge of the screen.
 * The trigger can be any UI component, and body contains UI children.
 *
 * @property trigger - The UI component that opens the drawer
 * @property body - Array of UI components for drawer content
 * @property title - Optional drawer title
 * @property description - Optional drawer description
 * @property style - Optional style configuration
 */
export const DrawerType = StructType({
    trigger: UIComponentType,
    body: ArrayType(UIComponentType),
    title: OptionType(StringType),
    description: OptionType(StringType),
    style: OptionType(DrawerStyleType),
});

/**
 * Type alias for DrawerType.
 */
export type DrawerType = typeof DrawerType;

// ============================================================================
// Drawer Function
// ============================================================================

/**
 * Creates a Drawer component with a trigger and body content.
 *
 * @param trigger - The UI component that opens the drawer
 * @param body - Array of UI components for drawer content
 * @param style - Optional styling configuration
 * @returns An East expression representing the drawer component
 *
 * @remarks
 * Drawer is a panel that slides in from the edge of the viewport.
 * It's typically used for navigation, settings, or detailed content.
 *
 * @example
 * ```ts
 * import { Drawer, Button, Text } from "@elaraai/east-ui";
 *
 * // Simple drawer
 * const drawer = Drawer.Root(
 *   Button.Root("Open Menu"),
 *   [Text.Root("Menu content")],
 *   { title: "Navigation" }
 * );
 *
 * // Drawer from left side
 * const leftDrawer = Drawer.Root(
 *   Button.Root("Settings"),
 *   [Text.Root("Settings panel")],
 *   {
 *     title: "Settings",
 *     placement: "start",
 *     size: "md",
 *   }
 * );
 * ```
 */
function createDrawer(
    trigger: SubtypeExprOrValue<UIComponentType>,
    body: SubtypeExprOrValue<ArrayType<UIComponentType>>,
    style?: DrawerStyle
): ExprType<UIComponentType> {
    const sizeValue = style?.size
        ? (typeof style.size === "string"
            ? East.value(variant(style.size, null), DrawerSizeType)
            : style.size)
        : undefined;

    const placementValue = style?.placement
        ? (typeof style.placement === "string"
            ? East.value(variant(style.placement, null), DrawerPlacementType)
            : style.placement)
        : undefined;

    return East.value(variant("Drawer", {
        trigger: trigger,
        body: body,
        title: style?.title !== undefined ? variant("some", style.title) : variant("none", null),
        description: style?.description !== undefined ? variant("some", style.description) : variant("none", null),
        style: sizeValue || placementValue || style?.contained !== undefined
            ? variant("some", East.value({
                size: sizeValue ? variant("some", sizeValue) : variant("none", null),
                placement: placementValue ? variant("some", placementValue) : variant("none", null),
                contained: style?.contained !== undefined ? variant("some", style.contained) : variant("none", null),
            }, DrawerStyleType))
            : variant("none", null),
    }), UIComponentType);
}

/**
 * Drawer component for slide-in panels.
 *
 * @remarks
 * Use `Drawer.Root(trigger, body, style)` to create a drawer, or access `Drawer.Types` for East types.
 *
 * @example
 * ```ts
 * import { Drawer, Button, Text } from "@elaraai/east-ui";
 *
 * // Create a drawer
 * const drawer = Drawer.Root(
 *   Button.Root("Open"),
 *   [Text.Root("Content")],
 *   { title: "My Drawer", placement: "end" }
 * );
 *
 * // Access the type
 * const styleType = Drawer.Types.Style;
 * ```
 */
export const Drawer = {
    /**
     * Creates a Drawer component with a trigger and body content.
     *
     * @param trigger - The UI component that opens the drawer
     * @param body - Array of UI components for drawer content
     * @param style - Optional styling configuration
     * @returns An East expression representing the drawer component
     *
     * @remarks
     * Drawer is a panel that slides in from the edge of the viewport.
     * It's typically used for navigation, settings, or detailed content.
     *
     * @example
     * ```ts
     * import { East } from "@elaraai/east";
     * import { Drawer, Button, Text, UIComponentType } from "@elaraai/east-ui";
     *
     * const example = East.function([], UIComponentType, $ => {
     *     return Drawer.Root(
     *         Button.Root("Open Drawer"),
     *         [Text.Root("Drawer content")],
     *         { title: "Settings", placement: "end" }
     *     );
     * });
     * ```
     */
    Root: createDrawer,
    Types: {
        /**
         * East StructType for Drawer component.
         *
         * @remarks
         * Drawer is a panel that slides in from an edge of the screen.
         * The trigger can be any UI component, and body contains UI children.
         *
         * @property trigger - The UI component that opens the drawer
         * @property body - Array of UI components for drawer content
         * @property title - Optional drawer title
         * @property description - Optional drawer description
         * @property style - Optional style configuration
         */
        Drawer: DrawerType,
        /**
         * Style type for Drawer component.
         *
         * @property size - Drawer size variant
         * @property placement - Edge placement
         * @property contained - Render within parent container
         */
        Style: DrawerStyleType,
        /**
         * Size variant type for Drawer component.
         *
         * @property xs - Extra small (20rem max width)
         * @property sm - Small (28rem max width)
         * @property md - Medium (32rem max width)
         * @property lg - Large (42rem max width)
         * @property xl - Extra large (56rem max width)
         * @property full - Full viewport
         */
        Size: DrawerSizeType,
        /**
         * Placement variant type for Drawer component.
         *
         * @property start - Left side (RTL-aware)
         * @property end - Right side (RTL-aware)
         * @property top - Top edge
         * @property bottom - Bottom edge
         */
        Placement: DrawerPlacementType,
    },
} as const;
