/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type SubtypeExprOrValue,
    OptionType,
    StringType,
    StructType,
} from "@elaraai/east";

import {
    FlexDirectionType,
    JustifyContentType,
    AlignItemsType,
    FlexWrapType,
} from "../../style.js";
import type {
    FlexDirectionLiteral,
    JustifyContentLiteral,
    AlignItemsLiteral,
    FlexWrapLiteral,
} from "../../style.js";

/**
 * Style configuration for Stack components.
 *
 * @remarks
 * Stack is a layout component that arranges children in a single direction
 * (row or column) with configurable spacing and alignment.
 *
 * @property direction - Stack direction (row or column)
 * @property gap - Gap between children (Chakra UI spacing token or CSS value)
 * @property align - Cross-axis alignment
 * @property justify - Main-axis alignment
 * @property wrap - Flex wrap behavior
 * @property padding - Padding (Chakra UI spacing token or CSS value)
 * @property margin - Margin (Chakra UI spacing token or CSS value)
 * @property background - Background color (Chakra UI color token or CSS color)
 * @property width - Width (Chakra UI size token or CSS value)
 * @property height - Height (Chakra UI size token or CSS value)
 */
export type StackStyle = {
    /** Stack direction (row or column) */
    direction?: SubtypeExprOrValue<FlexDirectionType> | FlexDirectionLiteral;
    /** Gap between children (Chakra UI spacing token or CSS value) */
    gap?: SubtypeExprOrValue<StringType>;
    /** Cross-axis alignment */
    align?: SubtypeExprOrValue<AlignItemsType> | AlignItemsLiteral;
    /** Main-axis alignment */
    justify?: SubtypeExprOrValue<JustifyContentType> | JustifyContentLiteral;
    /** Flex wrap behavior */
    wrap?: SubtypeExprOrValue<FlexWrapType> | FlexWrapLiteral;
    /** Padding (Chakra UI spacing token or CSS value) */
    padding?: SubtypeExprOrValue<StringType>;
    /** Margin (Chakra UI spacing token or CSS value) */
    margin?: SubtypeExprOrValue<StringType>;
    /** Background color (Chakra UI color token or CSS color) */
    background?: SubtypeExprOrValue<StringType>;
    /** Width (Chakra UI size token or CSS value) */
    width?: SubtypeExprOrValue<StringType>;
    /** Height (Chakra UI size token or CSS value) */
    height?: SubtypeExprOrValue<StringType>;
};

/**
 * The concrete East type for Stack component style data.
 *
 * @remarks
 * All properties are optional and wrapped in {@link OptionType}.
 *
 * @property direction - Stack direction (row or column)
 * @property gap - Gap between children (Chakra UI spacing token or CSS value)
 * @property align - Cross-axis alignment
 * @property justify - Main-axis alignment
 * @property wrap - Flex wrap behavior
 * @property padding - Padding (Chakra UI spacing token or CSS value)
 * @property margin - Margin (Chakra UI spacing token or CSS value)
 * @property background - Background color (Chakra UI color token or CSS color)
 * @property width - Width (Chakra UI size token or CSS value)
 * @property height - Height (Chakra UI size token or CSS value)
 */
export const StackStyleType = StructType({
    direction: OptionType(FlexDirectionType),
    gap: OptionType(StringType),
    align: OptionType(AlignItemsType),
    justify: OptionType(JustifyContentType),
    wrap: OptionType(FlexWrapType),
    padding: OptionType(StringType),
    margin: OptionType(StringType),
    background: OptionType(StringType),
    width: OptionType(StringType),
    height: OptionType(StringType),
});

/**
 * Type representing Stack style structure.
 */
export type StackStyleType = typeof StackStyleType;
