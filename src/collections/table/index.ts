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
    ArrayType,
    StringType,
    BooleanType,
    variant,
} from "@elaraai/east";

import {
    TextAlignType,
    SizeType,
    ColorSchemeType,
} from "../../style.js";

import {
    TableVariantType,
    TableCellStyleType,
    TableRowStyleType,
    TableStyleType,
    TableColumnType,
    type TableCellStyle,
    type TableRowStyle,
    type TableColumnStyle,
    type TableStyle,
} from "./types.js";

// Re-export style types
export {
    TableVariantType,
    TableCellStyleType,
    TableRowStyleType,
    TableStyleType,
    TableColumnType,
    type TableCellStyle,
    type TableRowStyle,
    type TableColumnStyle,
    type TableStyle,
} from "./types.js";

// ============================================================================
// Table Cell Type
// ============================================================================

/**
 * East type for a table cell.
 *
 * @remarks
 * Cells contain a string value and optional styling.
 *
 * @property value - The cell value as a string
 * @property style - Optional cell styling
 */
export const TableCellType = StructType({
    value: StringType,
    style: OptionType(TableCellStyleType),
});

/**
 * Type representing the table cell structure.
 */
export type TableCellType = typeof TableCellType;

// ============================================================================
// Table Row Type
// ============================================================================

/**
 * East type for a table row.
 *
 * @remarks
 * Rows contain an array of cells (one per column) and optional styling.
 *
 * @property cells - Array of cells in column order
 * @property key - Optional unique key for React rendering
 * @property style - Optional row styling
 */
export const TableRowType = StructType({
    cells: ArrayType(TableCellType),
    key: OptionType(StringType),
    style: OptionType(TableRowStyleType),
});

/**
 * Type representing the table row structure.
 */
export type TableRowType = typeof TableRowType;

// ============================================================================
// Table Root Type
// ============================================================================

/**
 * East type for the complete table structure.
 *
 * @remarks
 * Contains columns, rows, and styling configuration.
 *
 * @property columns - Array of column definitions
 * @property rows - Array of table rows
 * @property style - Optional table styling
 */
export const TableRootType = StructType({
    columns: ArrayType(TableColumnType),
    rows: ArrayType(TableRowType),
    style: OptionType(TableStyleType),
});

/**
 * Type representing the table root structure.
 */
export type TableRootType = typeof TableRootType;

// ============================================================================
// Table Cell Factory
// ============================================================================

/**
 * Creates a table cell with optional styling.
 *
 * @param value - The cell value (string or East expression)
 * @param style - Optional styling for the cell
 * @returns An East expression representing the styled cell
 *
 * @example
 * ```ts
 * import { Table } from "@elaraai/east-ui";
 *
 * // Simple cell
 * Table.Cell("Hello");
 *
 * // Cell with dynamic value
 * Table.Cell(row.name);
 *
 * // Cell with styling
 * Table.Cell("$99.99", {
 *   textAlign: "right",
 *   color: "blue.500",
 * });
 * ```
 */
function TableCell(
    value: SubtypeExprOrValue<typeof StringType>,
    style?: TableCellStyle
): ExprType<TableCellType> {
    const textAlignValue = style?.textAlign
        ? (typeof style.textAlign === "string"
            ? East.value(variant(style.textAlign, null), TextAlignType)
            : style.textAlign)
        : undefined;

    return East.value({
        value: value,
        style: style ? variant("some", East.value({
            textAlign: textAlignValue ? variant("some", textAlignValue) : variant("none", null),
            color: style.color ? variant("some", style.color) : variant("none", null),
            background: style.background ? variant("some", style.background) : variant("none", null),
        }, TableCellStyleType)) : variant("none", null),
    }, TableCellType);
}

// ============================================================================
// Table Row Factory
// ============================================================================

/**
 * Creates a table row from an array of cells.
 *
 * @param cells - Array of cells in column order
 * @param style - Optional row styling including key
 * @returns An East expression representing the row
 *
 * @remarks
 * Rows should include a `key` for efficient React rendering.
 *
 * @example
 * ```ts
 * import { Table } from "@elaraai/east-ui";
 *
 * // Simple row
 * Table.Row([
 *   Table.Cell("Alice"),
 *   Table.Cell("30"),
 * ]);
 *
 * // Row with key
 * Table.Row([
 *   Table.Cell(row.name),
 *   Table.Cell(row.age.toString()),
 * ], {
 *   key: row.id,
 * });
 * ```
 */
function TableRow(
    cells: SubtypeExprOrValue<ArrayType<TableCellType>>,
    style?: TableRowStyle
): ExprType<TableRowType> {
    const cellsValue = Array.isArray(cells)
        ? East.value(cells, ArrayType(TableCellType))
        : cells;

    return East.value({
        cells: cellsValue,
        key: style?.key ? variant("some", style.key) : variant("none", null),
        style: style?.background
            ? variant("some", East.value({
                background: variant("some", style.background),
            }, TableRowStyleType))
            : variant("none", null),
    }, TableRowType);
}

// ============================================================================
// Table Column Factory
// ============================================================================

/**
 * Creates a table column definition.
 *
 * @param header - Column header text
 * @param style - Optional column styling
 * @returns An East expression representing the column
 *
 * @example
 * ```ts
 * import { Table } from "@elaraai/east-ui";
 *
 * // Simple column
 * Table.Column("Name");
 *
 * // Column with styling
 * Table.Column("Price", { textAlign: "right" });
 * ```
 */
function TableColumn(
    header: SubtypeExprOrValue<typeof StringType>,
    style?: Omit<TableColumnStyle, "header">
): ExprType<TableColumnType> {
    const textAlignValue = style?.textAlign
        ? (typeof style.textAlign === "string"
            ? East.value(variant(style.textAlign, null), TextAlignType)
            : style.textAlign)
        : undefined;

    return East.value({
        key: header, // Use header as key for simplicity
        header: variant("some", header),
        style: textAlignValue ? variant("some", East.value({
            textAlign: variant("some", textAlignValue),
            color: variant("none", null),
            background: variant("none", null),
        }, TableCellStyleType)) : variant("none", null),
    }, TableColumnType);
}

// ============================================================================
// Table Root Factory
// ============================================================================

/**
 * Creates a Table component with columns, rows, and styling.
 *
 * @param columns - Array of column definitions
 * @param rows - Array of table rows
 * @param style - Optional table styling
 * @returns An East expression representing the table
 *
 * @example
 * ```ts
 * import { Table } from "@elaraai/east-ui";
 *
 * // Simple table
 * const table = Table.Root(
 *   [
 *     Table.Column("Name"),
 *     Table.Column("Age", { textAlign: "right" }),
 *   ],
 *   [
 *     Table.Row([Table.Cell("Alice"), Table.Cell("30")]),
 *     Table.Row([Table.Cell("Bob"), Table.Cell("25")]),
 *   ],
 *   { variant: "line", striped: true }
 * );
 *
 * // Dynamic table from data
 * const dynamicTable = Table.Root(
 *   [
 *     Table.Column("Product"),
 *     Table.Column("Price", { textAlign: "right" }),
 *   ],
 *   data.map(($, item) => Table.Row([
 *     Table.Cell(item.name),
 *     Table.Cell(item.price.toString()),
 *   ], { key: item.id })),
 *   { variant: "outline", size: "md" }
 * );
 * ```
 */
function TableRoot(
    columns: SubtypeExprOrValue<ArrayType<TableColumnType>>,
    rows: SubtypeExprOrValue<ArrayType<TableRowType>>,
    style?: TableStyle
): ExprType<TableRootType> {
    const columnsValue = Array.isArray(columns)
        ? East.value(columns, ArrayType(TableColumnType))
        : columns;

    const rowsValue = Array.isArray(rows)
        ? East.value(rows, ArrayType(TableRowType))
        : rows;

    const variantValue = style?.variant
        ? (typeof style.variant === "string"
            ? East.value(variant(style.variant, null), TableVariantType)
            : style.variant)
        : undefined;

    const sizeValue = style?.size
        ? (typeof style.size === "string"
            ? East.value(variant(style.size, null), SizeType)
            : style.size)
        : undefined;

    const colorPaletteValue = style?.colorPalette
        ? (typeof style.colorPalette === "string"
            ? East.value(variant(style.colorPalette, null), ColorSchemeType)
            : style.colorPalette)
        : undefined;

    const toBoolOption = (value: SubtypeExprOrValue<typeof BooleanType> | undefined) => {
        if (value === undefined) return variant("none", null);
        return variant("some", value);
    };

    return East.value({
        columns: columnsValue,
        rows: rowsValue,
        style: style ? variant("some", East.value({
            variant: variantValue ? variant("some", variantValue) : variant("none", null),
            size: sizeValue ? variant("some", sizeValue) : variant("none", null),
            striped: toBoolOption(style.striped),
            interactive: toBoolOption(style.interactive),
            stickyHeader: toBoolOption(style.stickyHeader),
            showColumnBorder: toBoolOption(style.showColumnBorder),
            colorPalette: colorPaletteValue ? variant("some", colorPaletteValue) : variant("none", null),
        }, TableStyleType)) : variant("none", null),
    }, TableRootType);
}

// ============================================================================
// Table Namespace Export
// ============================================================================

/**
 * Table compound component for data display.
 *
 * @remarks
 * Table provides a way to create data tables with:
 * - Column definitions with headers and styling
 * - Rows with cells and optional keys
 * - Table-level styling (variant, size, striped, etc.)
 *
 * @example
 * ```ts
 * import { Table } from "@elaraai/east-ui";
 *
 * // Static table
 * const table = Table.Root(
 *   [
 *     Table.Column("Name"),
 *     Table.Column("Email"),
 *     Table.Column("Role"),
 *   ],
 *   [
 *     Table.Row([
 *       Table.Cell("Alice Smith"),
 *       Table.Cell("alice@example.com"),
 *       Table.Cell("Admin"),
 *     ]),
 *     Table.Row([
 *       Table.Cell("Bob Jones"),
 *       Table.Cell("bob@example.com"),
 *       Table.Cell("User"),
 *     ]),
 *   ],
 *   { variant: "line", size: "md" }
 * );
 * ```
 */
export const Table = {
    Root: TableRoot,
    Row: TableRow,
    Cell: TableCell,
    Column: TableColumn,
    Types: {
        Root: TableRootType,
        Row: TableRowType,
        Cell: TableCellType,
        Column: TableColumnType,
        CellStyle: TableCellStyleType,
        RowStyle: TableRowStyleType,
        Style: TableStyleType,
        Variant: TableVariantType,
    },
} as const;
