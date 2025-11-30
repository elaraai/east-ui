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

import { UIComponentType } from "../../component.js";
import {
    AccordionVariantType,
    AccordionVariant,
    AccordionStyleType,
    AccordionItemStyleType,
    type AccordionStyle,
    type AccordionItemStyle,
} from "./types.js";

// Re-export types
export {
    AccordionVariantType,
    AccordionVariant,
    AccordionStyleType,
    AccordionItemStyleType,
    type AccordionVariantLiteral,
    type AccordionStyle,
    type AccordionItemStyle,
} from "./types.js";

// ============================================================================
// Accordion Item Type
// ============================================================================

/**
 * Type for Accordion item data.
 *
 * @remarks
 * Each item in an Accordion has a value (identifier), trigger (label),
 * content (child components), and optional disabled state.
 *
 * @property value - Unique identifier for this item
 * @property trigger - The clickable trigger/label text
 * @property content - Array of child UI components for the collapsible content
 * @property disabled - Whether this item is disabled
 */
export const AccordionItemType = StructType({
    value: StringType,
    trigger: StringType,
    content: ArrayType(UIComponentType),
    disabled: OptionType(BooleanType),
});

/**
 * Type representing the AccordionItem structure.
 */
export type AccordionItemType = typeof AccordionItemType;

// ============================================================================
// Accordion Root Type
// ============================================================================

/**
 * Type for Accordion component data.
 *
 * @remarks
 * Accordion displays collapsible content panels for presenting information
 * in a limited space.
 *
 * @property items - Array of accordion items
 * @property style - Optional styling configuration
 */
export const AccordionRootType = StructType({
    items: ArrayType(AccordionItemType),
    style: OptionType(AccordionStyleType),
});

/**
 * Type representing the Accordion structure.
 */
export type AccordionRootType = typeof AccordionRootType;

// ============================================================================
// Accordion Item Function
// ============================================================================

/**
 * Creates an Accordion item with trigger and content children.
 *
 * @param value - Unique identifier for this item
 * @param trigger - The clickable trigger/label text
 * @param content - Array of child UI components for the collapsible content
 * @param style - Optional item configuration
 * @returns An East expression representing the accordion item
 *
 * @example
 * ```ts
 * import { Accordion, Text } from "@elaraai/east-ui";
 *
 * const item = Accordion.Item("section-1", "Section 1", [
 *   Text.Root("Content for section 1"),
 * ]);
 *
 * // Disabled item
 * const disabled = Accordion.Item("section-2", "Section 2", [
 *   Text.Root("Disabled content"),
 * ], {
 *   disabled: true,
 * });
 * ```
 */
function createAccordionItem(
    value: SubtypeExprOrValue<StringType>,
    trigger: SubtypeExprOrValue<StringType>,
    content: SubtypeExprOrValue<ArrayType<UIComponentType>>,
    style?: AccordionItemStyle
): ExprType<AccordionItemType> {
    const toBoolOption = (val: SubtypeExprOrValue<BooleanType> | undefined) => {
        if (val === undefined) return variant("none", null);
        return variant("some", val);
    };

    return East.value({
        value: value,
        trigger: trigger,
        content: content,
        disabled: toBoolOption(style?.disabled),
    }, AccordionItemType);
}

// ============================================================================
// Accordion Root Function
// ============================================================================

/**
 * Creates an Accordion component with items and optional styling.
 *
 * @param items - Array of Accordion items
 * @param style - Optional styling configuration
 * @returns An East expression representing the accordion component
 *
 * @remarks
 * Accordion is used to display collapsible content panels, useful for FAQs,
 * settings panels, and navigation menus.
 *
 * @example
 * ```ts
 * import { Accordion, Text } from "@elaraai/east-ui";
 *
 * // Simple accordion
 * const faq = Accordion.Root([
 *   Accordion.Item("q1", "What is East UI?", [
 *     Text.Root("East UI is a typed UI library."),
 *   ]),
 *   Accordion.Item("q2", "How do I install it?", [
 *     Text.Root("Run npm install @elaraai/east-ui"),
 *   ]),
 * ]);
 *
 * // Allow multiple panels open
 * const multi = Accordion.Root([
 *   Accordion.Item("a", "Section A", [Text.Root("Content A")]),
 *   Accordion.Item("b", "Section B", [Text.Root("Content B")]),
 * ], {
 *   multiple: true,
 *   variant: "enclosed",
 * });
 * ```
 */
function createAccordionRoot(
    items: SubtypeExprOrValue<ArrayType<AccordionItemType>>,
    style?: AccordionStyle
): ExprType<UIComponentType> {
    const toBoolOption = (val: SubtypeExprOrValue<BooleanType> | undefined) => {
        if (val === undefined) return variant("none", null);
        return variant("some", val);
    };

    const variantValue = style?.variant
        ? (typeof style.variant === "string"
            ? East.value(variant(style.variant, null), AccordionVariantType)
            : style.variant)
        : undefined;

    return East.value(variant("Accordion", {
        items: items,
        style: style ? variant("some", East.value({
            multiple: toBoolOption(style.multiple),
            collapsible: toBoolOption(style.collapsible),
            variant: variantValue ? variant("some", variantValue) : variant("none", null),
        }, AccordionStyleType)) : variant("none", null),
    }), UIComponentType);
}

// ============================================================================
// Accordion Compound Component
// ============================================================================

/**
 * Accordion compound component for collapsible content panels.
 *
 * @remarks
 * Use `Accordion.Root` to create the container and `Accordion.Item` for each
 * collapsible panel. Item content supports child UI components.
 *
 * @example
 * ```ts
 * import { Accordion, Text, Button } from "@elaraai/east-ui";
 *
 * const settingsPanel = Accordion.Root([
 *   Accordion.Item("general", "General Settings", [
 *     Text.Root("General configuration options"),
 *     Button.Root("Save Settings"),
 *   ]),
 *   Accordion.Item("advanced", "Advanced Settings", [
 *     Text.Root("Advanced configuration options"),
 *   ]),
 * ], {
 *   variant: "enclosed",
 *   collapsible: true,
 * });
 * ```
 */
export const Accordion = {
    Root: createAccordionRoot,
    Item: createAccordionItem,
    Variant: AccordionVariant,
    Types: {
        Root: AccordionRootType,
        Item: AccordionItemType,
        Style: AccordionStyleType,
        ItemStyle: AccordionItemStyleType,
        Variant: AccordionVariantType,
    },
} as const;
