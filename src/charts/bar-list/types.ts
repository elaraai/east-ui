/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type SubtypeExprOrValue,
    OptionType,
    StructType,
    ArrayType,
    StringType,
    FloatType,
    BooleanType,
    VariantType,
    NullType,
} from "@elaraai/east";

import {
    ChartSortType,
    type ChartSort,
} from "../types.js";

// ============================================================================
// Bar List Item Type
// ============================================================================

/**
 * Bar list item data type.
 *
 * @remarks
 * Each item represents a horizontal bar with a name, value, and optional color.
 *
 * @property name - Item label
 * @property value - Numeric value (determines bar length)
 * @property color - Optional bar color
 */
export const BarListItemType = StructType({
    name: StringType,
    value: FloatType,
    color: OptionType(StringType),
});

/**
 * Type representing a bar list item.
 */
export type BarListItemType = typeof BarListItemType;

// ============================================================================
// Bar List Value Format Type
// ============================================================================

/**
 * Value format for bar list values.
 *
 * @property number - Plain number
 * @property currency - Currency format
 * @property percent - Percentage format
 * @property compact - Compact notation (1K, 1M)
 */
export const BarListValueFormatType = VariantType({
    number: NullType,
    currency: NullType,
    percent: NullType,
    compact: NullType,
});

/**
 * Type representing bar list value format.
 */
export type BarListValueFormatType = typeof BarListValueFormatType;

/**
 * String literal type for bar list value format.
 */
export type BarListValueFormatLiteral = "number" | "currency" | "percent" | "compact";

// ============================================================================
// Bar List Type
// ============================================================================

/**
 * Bar list component type.
 *
 * @remarks
 * Bar list is a Chakra-native chart for comparing categories
 * with horizontal bars. Simpler than a full bar chart.
 *
 * @property data - Array of bar list items
 * @property sort - Sort configuration
 * @property showValue - Show value text
 * @property showLabel - Show label text
 * @property valueFormat - Format for values
 * @property color - Default bar color
 */
export const BarListType = StructType({
    data: ArrayType(BarListItemType),
    sort: OptionType(ChartSortType),
    showValue: OptionType(BooleanType),
    showLabel: OptionType(BooleanType),
    valueFormat: OptionType(BarListValueFormatType),
    color: OptionType(StringType),
});

/**
 * Type representing a bar list.
 */
export type BarListType = typeof BarListType;

// ============================================================================
// Bar List Style
// ============================================================================

/**
 * TypeScript interface for Bar list style options.
 */
export interface BarListStyle {
    /** Sort configuration */
    sort?: ChartSort;
    /** Show value text */
    showValue?: SubtypeExprOrValue<BooleanType>;
    /** Show label text */
    showLabel?: SubtypeExprOrValue<BooleanType>;
    /** Format for values */
    valueFormat?: SubtypeExprOrValue<BarListValueFormatType> | BarListValueFormatLiteral;
    /** Default bar color */
    color?: SubtypeExprOrValue<StringType>;
}
