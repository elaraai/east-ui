/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
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
    TextAlignType,
    SizeType,
    ColorSchemeType,
    type TextAlignLiteral,
    type SizeLiteral,
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
// Table Cell Style
// ============================================================================

/**
 * Style type for table cells.
 *
 * @remarks
 * All properties are optional and wrapped in {@link OptionType}.
 *
 * @property textAlign - Text alignment within the cell
 * @property color - Text color (Chakra UI color token)
 * @property background - Background color
 */
export const TableCellStyleType = StructType({
    textAlign: OptionType(TextAlignType),
    color: OptionType(StringType),
    background: OptionType(StringType),
});

/**
 * Type representing the table cell style structure.
 */
export type TableCellStyleType = typeof TableCellStyleType;

/**
 * TypeScript interface for table cell styling input.
 *
 * @remarks
 * Accepts both static values and East expressions.
 *
 * @property textAlign - Text alignment (left, center, right, justify)
 * @property color - Text color (Chakra UI color token or CSS color)
 * @property background - Background color
 */
export interface TableCellStyle {
    textAlign?: SubtypeExprOrValue<TextAlignType> | TextAlignLiteral;
    color?: SubtypeExprOrValue<StringType>;
    background?: SubtypeExprOrValue<StringType>;
}

// ============================================================================
// Table Row Style
// ============================================================================

/**
 * Style type for table rows.
 *
 * @remarks
 * All properties are optional and wrapped in {@link OptionType}.
 *
 * @property background - Background color for the row
 */
export const TableRowStyleType = StructType({
    background: OptionType(StringType),
});

/**
 * Type representing the table row style structure.
 */
export type TableRowStyleType = typeof TableRowStyleType;

/**
 * TypeScript interface for table row styling input.
 *
 * @remarks
 * Includes key for React rendering optimization.
 *
 * @property key - Unique key for the row (for React rendering)
 * @property background - Background color for the row
 */
export interface TableRowStyle {
    key?: SubtypeExprOrValue<StringType>;
    background?: SubtypeExprOrValue<StringType>;
}

// ============================================================================
// Table Column Style
// ============================================================================

/**
 * TypeScript interface for table column configuration.
 *
 * @property header - Column header text
 * @property textAlign - Default text alignment for cells in this column
 */
export interface TableColumnStyle {
    header?: SubtypeExprOrValue<StringType>;
    textAlign?: SubtypeExprOrValue<TextAlignType> | TextAlignLiteral;
}

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
    size: OptionType(SizeType),
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
    size?: SubtypeExprOrValue<SizeType> | SizeLiteral;
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
 * @property style - Optional default cell style for the column
 */
export const TableColumnType = StructType({
    key: StringType,
    header: OptionType(StringType),
    style: OptionType(TableCellStyleType),
});

/**
 * Type representing the table column structure.
 */
export type TableColumnType = typeof TableColumnType;
