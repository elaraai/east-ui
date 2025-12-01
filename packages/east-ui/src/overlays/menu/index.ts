/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    variant,
    StringType,
    BooleanType,
    ArrayType,
    OptionType,
    StructType,
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import {
    MenuItemType,
    MenuStyleType,
    type MenuStyle,
    PlacementType,
} from "./types.js";

// Re-export types
export {
    MenuItemType,
    MenuStyleType,
    type MenuStyle,
    PlacementType,
    type PlacementLiteral,
} from "./types.js";

// ============================================================================
// Menu Type
// ============================================================================

/**
 * East StructType for Menu component.
 *
 * @remarks
 * Menu wraps a trigger element and displays a dropdown menu on click.
 * The trigger can be any UI component.
 *
 * @property trigger - The UI component that triggers the menu on click
 * @property items - Array of menu items (Item or Separator)
 * @property placement - Optional placement position
 */
export const MenuType = StructType({
    trigger: UIComponentType,
    items: ArrayType(MenuItemType),
    placement: OptionType(PlacementType),
});

/**
 * Type alias for MenuType.
 */
export type MenuType = typeof MenuType;

// ============================================================================
// Menu Item Factories
// ============================================================================

/**
 * Creates a menu item.
 *
 * @param value - Unique identifier for the item
 * @param label - Display text for the item
 * @param disabled - Whether the item is disabled
 * @returns An East expression representing the menu item
 *
 * @example
 * ```ts
 * import { Menu } from "@elaraai/east-ui";
 *
 * const item = Menu.Item("edit", "Edit");
 * const disabledItem = Menu.Item("delete", "Delete", true);
 * ```
 */
function createMenuItem(
    value: SubtypeExprOrValue<typeof StringType>,
    label: SubtypeExprOrValue<typeof StringType>,
    disabled?: SubtypeExprOrValue<typeof BooleanType>
): ExprType<MenuItemType> {
    return East.value(variant("Item", {
        value: value,
        label: label,
        disabled: disabled !== undefined ? variant("some", disabled) : variant("none", null),
    }), MenuItemType);
}

/**
 * Creates a menu separator.
 *
 * @returns An East expression representing a menu separator
 *
 * @example
 * ```ts
 * import { Menu } from "@elaraai/east-ui";
 *
 * const separator = Menu.Separator();
 * ```
 */
function createMenuSeparator(): ExprType<MenuItemType> {
    return East.value(variant("Separator", null), MenuItemType);
}

// ============================================================================
// Menu Factory
// ============================================================================

/**
 * Creates a Menu component.
 *
 * @param trigger - The element that triggers the menu
 * @param items - Array of menu items
 * @param style - Optional style configuration
 * @returns An East expression representing the Menu component
 *
 * @example
 * ```ts
 * import { Menu, Button } from "@elaraai/east-ui";
 *
 * const menu = Menu.Root(
 *     Button.Root("Actions"),
 *     [
 *         Menu.Item("edit", "Edit"),
 *         Menu.Item("duplicate", "Duplicate"),
 *         Menu.Separator(),
 *         Menu.Item("delete", "Delete"),
 *     ],
 *     { placement: "bottom-start" }
 * );
 * ```
 */
function createMenu(
    trigger: SubtypeExprOrValue<UIComponentType>,
    items: SubtypeExprOrValue<ArrayType<MenuItemType>>,
    style?: MenuStyle
): ExprType<UIComponentType> {
    const placementValue = style?.placement
        ? (typeof style.placement === "string"
            ? East.value(variant(style.placement, null), PlacementType)
            : style.placement)
        : undefined;

    return East.value(variant("Menu", {
        trigger: trigger,
        items: items,
        placement: placementValue ? variant("some", placementValue) : variant("none", null),
    }), UIComponentType);
}

// ============================================================================
// Menu Namespace Export
// ============================================================================

/**
 * Menu component namespace.
 *
 * @remarks
 * Menu provides a dropdown menu triggered by a UI element.
 *
 * @example
 * ```ts
 * import { Menu, Button } from "@elaraai/east-ui";
 *
 * // Basic menu
 * const menu = Menu.Root(
 *     Button.Root("Options"),
 *     [
 *         Menu.Item("view", "View"),
 *         Menu.Item("edit", "Edit"),
 *         Menu.Separator(),
 *         Menu.Item("delete", "Delete"),
 *     ]
 * );
 *
 * // Menu with placement
 * const menuWithPlacement = Menu.Root(
 *     Button.Root("Actions"),
 *     [
 *         Menu.Item("copy", "Copy"),
 *         Menu.Item("paste", "Paste"),
 *     ],
 *     { placement: "bottom-end" }
 * );
 * ```
 */
export const Menu = {
    /** Creates a Menu component */
    Root: createMenu,
    /** Creates a menu item */
    Item: createMenuItem,
    /** Creates a menu separator */
    Separator: createMenuSeparator,
    /** Type definitions */
    Types: {
        /** Menu struct type */
        Menu: MenuType,
        /** Menu item variant type */
        Item: MenuItemType,
        /** Menu style struct type */
        Style: MenuStyleType,
        /** Placement variant type */
        Placement: PlacementType,
    },
} as const;
