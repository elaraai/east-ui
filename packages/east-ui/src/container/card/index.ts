/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    OptionType,
    StructType,
    ArrayType,
    StringType,
    variant,
} from "@elaraai/east";

import { SizeType } from "../../style.js";
import { UIComponentType } from "../../component.js";
import { CardStyleType, CardVariantType, CardVariant, type CardStyle } from "./types.js";

// Re-export types
export { CardStyleType, CardVariantType, CardVariant, type CardStyle, type CardVariantLiteral } from "./types.js";

// ============================================================================
// Card Type
// ============================================================================

/**
 * The concrete East type for Card component data.
 *
 * @remarks
 * This struct type represents the serializable data structure for a Card component.
 * Card is a container component that can hold child components in its body.
 *
 * @property title - Optional card title
 * @property description - Optional card description
 * @property body - Array of child UI components
 * @property style - Optional styling configuration wrapped in OptionType
 */
export const CardType = StructType({
    title: OptionType(StringType),
    description: OptionType(StringType),
    body: ArrayType(UIComponentType),
    style: OptionType(CardStyleType),
});

/**
 * Type representing the Card component structure.
 */
export type CardType = typeof CardType;

// ============================================================================
// Card Function
// ============================================================================

/**
 * Creates a Card container component with children and optional styling.
 *
 * @param children - Array of child UI components for the card body
 * @param style - Optional styling configuration for the card
 * @returns An East expression representing the styled card component
 *
 * @remarks
 * Card is a container for grouping related content together. It supports
 * titles, descriptions, and contains child components in its body.
 *
 * @example
 * ```ts
 * import { East } from "@elaraai/east";
 * import { Card, Text, Button, UIComponentType } from "@elaraai/east-ui";
 *
 * const example = East.function([], UIComponentType, $ => {
 *     return Card.Root([
 *         Text.Root("Card content here"),
 *         Button.Root("Action"),
 *     ], {
 *         title: "Card Title",
 *         description: "A brief description",
 *         variant: "elevated",
 *     });
 * });
 * ```
 */
function createCard(
    children: SubtypeExprOrValue<ArrayType<UIComponentType>>,
    style?: CardStyle
): ExprType<UIComponentType> {
    const toStringOption = (val: SubtypeExprOrValue<StringType> | undefined) => {
        if (val === undefined) return variant("none", null);
        return variant("some", val);
    };

    const variantValue = style?.variant
        ? (typeof style.variant === "string"
            ? East.value(variant(style.variant, null), CardVariantType)
            : style.variant)
        : undefined;

    const sizeValue = style?.size
        ? (typeof style.size === "string"
            ? East.value(variant(style.size, null), SizeType)
            : style.size)
        : undefined;

    return East.value(variant("Card", {
        title: toStringOption(style?.title),
        description: toStringOption(style?.description),
        body: children,
        style: style ? variant("some", East.value({
            variant: variantValue ? variant("some", variantValue) : variant("none", null),
            size: sizeValue ? variant("some", sizeValue) : variant("none", null),
        }, CardStyleType)) : variant("none", null),
    }), UIComponentType);
}

/**
 * Card container component for grouping related content.
 *
 * @remarks
 * Use `Card.Root(children, style)` to create a card, or access `Card.Types.Card` for the East type.
 */
export const Card = {
    /**
     * Creates a Card container component with children and optional styling.
     *
     * @param children - Array of child UI components
     * @param style - Optional styling configuration including title and description
     * @returns An East expression representing the card component
     *
     * @remarks
     * Card is a container component that groups related content with optional
     * title, description, and visual styling.
     *
     * @example
     * ```ts
     * import { East } from "@elaraai/east";
     * import { Card, Text, Button, UIComponentType } from "@elaraai/east-ui";
     *
     * const example = East.function([], UIComponentType, $ => {
     *     return Card.Root([
     *         Text.Root("Card content here"),
     *         Button.Root("Action"),
     *     ], {
     *         title: "Card Title",
     *         description: "A brief description",
     *     });
     * });
     * ```
     */
    Root: createCard,
    /**
     * Helper function to create card variant values.
     *
     * @param v - The variant string ("elevated", "outline", "subtle")
     * @returns An East expression representing the card variant
     */
    Variant: CardVariant,
    Types: {
        /**
         * The concrete East type for Card component data.
         *
         * @remarks
         * This struct type represents the serializable data structure for a Card component.
         *
         * @property title - Optional card title
         * @property description - Optional card description
         * @property body - Array of child UI components
         * @property style - Optional styling configuration
         */
        Card: CardType,
        /**
         * Style type for Card component configuration.
         *
         * @remarks
         * This struct type defines the styling configuration for a Card.
         *
         * @property variant - Visual variant (elevated, outline, subtle)
         * @property size - Size of the card (sm, md, lg)
         */
        Style: CardStyleType,
        /**
         * Variant type for Card appearance styles.
         *
         * @property elevated - Card with shadow elevation
         * @property outline - Card with border outline
         * @property subtle - Card with subtle background
         */
        Variant: CardVariantType,
    },
} as const;
