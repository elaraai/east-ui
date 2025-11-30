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
    BooleanType,
    ArrayType,
    variant,
} from "@elaraai/east";

import { ColorSchemeType, OrientationType } from "../../style.js";
import { UIComponentType } from "../../component.js";
import {
    TabsVariantType,
    TabsVariant,
    TabsJustifyType,
    TabsActivationModeType,
    TabsSizeType,
    TabsStyleType,
    type TabsStyle,
    type TabsItemStyle,
} from "./types.js";

// Re-export types
export {
    TabsVariantType,
    TabsVariant,
    TabsJustifyType,
    TabsActivationModeType,
    TabsSizeType,
    TabsStyleType,
    type TabsVariantLiteral,
    type TabsJustifyLiteral,
    type TabsActivationModeLiteral,
    type TabsSizeLiteral,
    type TabsStyle,
    type TabsItemStyle,
} from "./types.js";

// ============================================================================
// Tabs Item Type
// ============================================================================

/**
 * Type for Tabs item data.
 *
 * @remarks
 * Each tab has a value (identifier), trigger (label text),
 * content (child components), and optional disabled state.
 *
 * @property value - Unique identifier for this tab
 * @property trigger - The tab label text
 * @property content - Array of child UI components for the tab panel
 * @property disabled - Whether this tab is disabled
 */
export const TabsItemType = StructType({
    value: StringType,
    trigger: StringType,
    content: ArrayType(UIComponentType),
    disabled: OptionType(BooleanType),
});

/**
 * Type representing the TabsItem structure.
 */
export type TabsItemType = typeof TabsItemType;

// ============================================================================
// Tabs Root Type
// ============================================================================

/**
 * Type for Tabs component data.
 *
 * @remarks
 * Tabs display content in separate panels, with only one panel visible at a time.
 *
 * @property items - Array of tab items
 * @property value - Controlled selected tab value
 * @property defaultValue - Initial selected tab value
 * @property style - Optional styling configuration
 */
export const TabsRootType = StructType({
    items: ArrayType(TabsItemType),
    value: OptionType(StringType),
    defaultValue: OptionType(StringType),
    style: OptionType(TabsStyleType),
});

/**
 * Type representing the Tabs structure.
 */
export type TabsRootType = typeof TabsRootType;

// ============================================================================
// Tabs Item Function
// ============================================================================

/**
 * Creates a Tabs item with trigger and content children.
 *
 * @param value - Unique identifier for this tab
 * @param trigger - The tab label text
 * @param content - Array of child UI components for the tab panel
 * @param style - Optional item configuration
 * @returns An East expression representing the tabs item
 *
 * @example
 * ```ts
 * import { Tabs, Text } from "@elaraai/east-ui";
 *
 * const item = Tabs.Item("overview", "Overview", [
 *   Text.Root("Overview content"),
 * ]);
 *
 * // Disabled tab
 * const disabled = Tabs.Item("disabled", "Disabled Tab", [
 *   Text.Root("This tab is disabled"),
 * ], {
 *   disabled: true,
 * });
 * ```
 */
function createTabsItem(
    value: SubtypeExprOrValue<StringType>,
    trigger: SubtypeExprOrValue<StringType>,
    content: SubtypeExprOrValue<ArrayType<UIComponentType>>,
    style?: TabsItemStyle
): ExprType<TabsItemType> {
    const toBoolOption = (val: SubtypeExprOrValue<BooleanType> | undefined) => {
        if (val === undefined) return variant("none", null);
        return variant("some", val);
    };

    return East.value({
        value: value,
        trigger: trigger,
        content: content,
        disabled: toBoolOption(style?.disabled),
    }, TabsItemType);
}

// ============================================================================
// Tabs Root Function
// ============================================================================

/**
 * Creates a Tabs component with items and optional styling.
 *
 * @param items - Array of Tabs items
 * @param style - Optional styling configuration
 * @returns An East expression representing the tabs component
 *
 * @remarks
 * Tabs are used to organize content into separate views where only one
 * view is visible at a time.
 *
 * @example
 * ```ts
 * import { Tabs, Text } from "@elaraai/east-ui";
 *
 * // Simple tabs
 * const tabs = Tabs.Root([
 *   Tabs.Item("overview", "Overview", [Text.Root("Overview content")]),
 *   Tabs.Item("settings", "Settings", [Text.Root("Settings content")]),
 *   Tabs.Item("billing", "Billing", [Text.Root("Billing content")]),
 * ], {
 *   defaultValue: "overview",
 *   variant: "line",
 * });
 *
 * // Enclosed variant with equal width
 * const enclosed = Tabs.Root([
 *   Tabs.Item("tab1", "Tab 1", [Text.Root("Content 1")]),
 *   Tabs.Item("tab2", "Tab 2", [Text.Root("Content 2")]),
 * ], {
 *   variant: "enclosed",
 *   fitted: true,
 *   size: "lg",
 * });
 *
 * // Vertical tabs
 * const vertical = Tabs.Root([
 *   Tabs.Item("profile", "Profile", [Text.Root("Profile content")]),
 *   Tabs.Item("security", "Security", [Text.Root("Security content")]),
 * ], {
 *   orientation: "vertical",
 *   variant: "subtle",
 * });
 * ```
 */
function createTabsRoot(
    items: SubtypeExprOrValue<ArrayType<TabsItemType>>,
    style?: TabsStyle
): ExprType<UIComponentType> {
    const toBoolOption = (val: SubtypeExprOrValue<BooleanType> | undefined) => {
        if (val === undefined) return variant("none", null);
        return variant("some", val);
    };

    const toStringOption = (val: SubtypeExprOrValue<StringType> | undefined) => {
        if (val === undefined) return variant("none", null);
        return variant("some", val);
    };

    const variantValue = style?.variant
        ? (typeof style.variant === "string"
            ? East.value(variant(style.variant, null), TabsVariantType)
            : style.variant)
        : undefined;

    const sizeValue = style?.size
        ? (typeof style.size === "string"
            ? East.value(variant(style.size, null), TabsSizeType)
            : style.size)
        : undefined;

    const orientationValue = style?.orientation
        ? (typeof style.orientation === "string"
            ? East.value(variant(style.orientation, null), OrientationType)
            : style.orientation)
        : undefined;

    const activationModeValue = style?.activationMode
        ? (typeof style.activationMode === "string"
            ? East.value(variant(style.activationMode, null), TabsActivationModeType)
            : style.activationMode)
        : undefined;

    const justifyValue = style?.justify
        ? (typeof style.justify === "string"
            ? East.value(variant(style.justify, null), TabsJustifyType)
            : style.justify)
        : undefined;

    const colorPaletteValue = style?.colorPalette
        ? (typeof style.colorPalette === "string"
            ? East.value(variant(style.colorPalette, null), ColorSchemeType)
            : style.colorPalette)
        : undefined;

    return East.value(variant("Tabs", {
        items: items,
        value: toStringOption(style?.value),
        defaultValue: toStringOption(style?.defaultValue),
        style: style ? variant("some", East.value({
            variant: variantValue ? variant("some", variantValue) : variant("none", null),
            size: sizeValue ? variant("some", sizeValue) : variant("none", null),
            orientation: orientationValue ? variant("some", orientationValue) : variant("none", null),
            activationMode: activationModeValue ? variant("some", activationModeValue) : variant("none", null),
            fitted: toBoolOption(style.fitted),
            justify: justifyValue ? variant("some", justifyValue) : variant("none", null),
            lazyMount: toBoolOption(style.lazyMount),
            unmountOnExit: toBoolOption(style.unmountOnExit),
            colorPalette: colorPaletteValue ? variant("some", colorPaletteValue) : variant("none", null),
        }, TabsStyleType)) : variant("none", null),
    }), UIComponentType);
}

// ============================================================================
// Tabs Compound Component
// ============================================================================

/**
 * Tabs compound component for tabbed content panels.
 *
 * @remarks
 * Use `Tabs.Root` to create the container and `Tabs.Item` for each
 * tab panel. Tab content supports child UI components.
 *
 * @example
 * ```ts
 * import { Tabs, Text, Button } from "@elaraai/east-ui";
 *
 * const settingsTabs = Tabs.Root([
 *   Tabs.Item("general", "General", [
 *     Text.Root("General settings"),
 *     Button.Root("Save"),
 *   ]),
 *   Tabs.Item("advanced", "Advanced", [
 *     Text.Root("Advanced settings"),
 *   ]),
 * ], {
 *   variant: "enclosed",
 *   defaultValue: "general",
 * });
 * ```
 */
export const Tabs = {
    Root: createTabsRoot,
    Item: createTabsItem,
    Variant: TabsVariant,
    Types: {
        Root: TabsRootType,
        Item: TabsItemType,
        Style: TabsStyleType,
        Variant: TabsVariantType,
        Size: TabsSizeType,
        Justify: TabsJustifyType,
        ActivationMode: TabsActivationModeType,
    },
} as const;
