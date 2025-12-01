/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type SubtypeExprOrValue,
    OptionType,
    StructType,
    VariantType,
    StringType,
    BooleanType,
    NullType,
} from "@elaraai/east";

import {
    ColorSchemeType,
    type ColorSchemeLiteral,
} from "../../style.js";

// ============================================================================
// Table Variant Types
// ============================================================================

/**
 * Table variant type for Chakra UI v3 table styling.
 *
 * @remarks
 * Create instances using the {@link TableVariant} function.
 *
 * @property line - Table with horizontal lines between rows
 * @property outline - Table with full border outline
 */
export const TableVariantType = VariantType({
    line: NullType,
    outline: NullType,
});

/**
 * Type representing table variant values.
 */
export type TableVariantType = typeof TableVariantType;

/**
 * String literal type for table variant values.
 */
export type TableVariantLiteral = "line" | "outline";

// ============================================================================
// Table Size Type
// ============================================================================

/**
 * Size options for Table component.
 *
 * @remarks
 * Chakra UI Table only supports sm, md, lg sizes (not xs).
 *
 * @property sm - Small table
 * @property md - Medium table (default)
 * @property lg - Large table
 */
export const TableSizeType = VariantType({
    /** Small table */
    sm: NullType,
    /** Medium table (default) */
    md: NullType,
    /** Large table */
    lg: NullType,
});

/**
 * Type representing the TableSize structure.
 */
export type TableSizeType = typeof TableSizeType;

/**
 * String literal type for table size values.
 */
export type TableSizeLiteral = "sm" | "md" | "lg";

// ============================================================================
// Table Root Style
// ============================================================================

/**
 * Style type for the table root component.
 *
 * @remarks
 * All properties are optional and wrapped in {@link OptionType}.
 *
 * @property variant - Table variant (line or outline)
 * @property size - Table size (sm, md, lg)
 * @property striped - Whether to show zebra stripes on rows
 * @property interactive - Whether to highlight rows on hover
 * @property stickyHeader - Whether the header sticks when scrolling
 * @property showColumnBorder - Whether to show borders between columns
 * @property colorPalette - Color scheme for interactive hover
 */
export const TableStyleType = StructType({
    variant: OptionType(TableVariantType),
    size: OptionType(TableSizeType),
    striped: OptionType(BooleanType),
    interactive: OptionType(BooleanType),
    stickyHeader: OptionType(BooleanType),
    showColumnBorder: OptionType(BooleanType),
    colorPalette: OptionType(ColorSchemeType),
});

/**
 * Type representing the table style structure.
 */
export type TableStyleType = typeof TableStyleType;

/**
 * TypeScript interface for table root styling input.
 *
 * @remarks
 * Accepts both static values and East expressions.
 *
 * @property variant - Table variant (line or outline)
 * @property size - Table size (sm, md, lg)
 * @property striped - Whether to show zebra stripes on rows
 * @property interactive - Whether to highlight rows on hover
 * @property stickyHeader - Whether the header sticks when scrolling
 * @property showColumnBorder - Whether to show borders between columns
 * @property colorPalette - Color scheme for interactive hover
 */
export interface TableStyle {
    variant?: SubtypeExprOrValue<TableVariantType> | TableVariantLiteral;
    size?: SubtypeExprOrValue<TableSizeType> | TableSizeLiteral;
    striped?: SubtypeExprOrValue<BooleanType>;
    interactive?: SubtypeExprOrValue<BooleanType>;
    stickyHeader?: SubtypeExprOrValue<BooleanType>;
    showColumnBorder?: SubtypeExprOrValue<BooleanType>;
    colorPalette?: SubtypeExprOrValue<ColorSchemeType> | ColorSchemeLiteral;
}

// ============================================================================
// Table Column Type (for serialization)
// ============================================================================

/**
 * East type for a table column definition.
 *
 * @remarks
 * Defines the header text and key for a column.
 *
 * @property key - The column key (field name)
 * @property header - Optional header text for the column
 */
export const TableColumnType = StructType({
    key: StringType,
    header: OptionType(StringType),
});

/**
 * Type representing the table column structure.
 */
export type TableColumnType = typeof TableColumnType;
