/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    Expr,
    StructType,
    ArrayType,
    DictType,
    StringType,
    BooleanType,
    OptionType,
    variant,
    type TypeOf, some, type ValueTypeOf
} from "@elaraai/east";

import {
    ColorSchemeType
} from "../../style.js";

import {
    TableVariantType,
    TableStyleType,
    TableColumnType,
    TableSizeType,
    type TableStyle,
    TableValueLiteral,
    type TableValueType,
    TableValueTypeType
} from "./types.js";
import { UIComponentType } from "../../component.js";
import { Text } from "../../typography/index.js";

// Re-export style types
export {
    TableVariantType,
    TableStyleType,
    TableColumnType,
    TableSizeType,
    type TableSizeLiteral,
    type TableStyle,
} from "./types.js";

/**
 * East type for a table cell.
 *
 * @remarks
 * Defines the type for a table cell.
 *
 * @property value - The cell value as a literal
 * @property content - Optional UI component content for the cell
 */
export const TableCellType = StructType({
    value: TableValueLiteral,
    content: UIComponentType,
});


// ============================================================================
// Table Root Type
// ============================================================================

/**
 * Type for Table component data.
 *
 * @remarks
 * Table displays data in rows and columns with optional styling.
 *
 * @property rows - Array of row data (Dict mapping column keys to UI components)
 * @property columns - Array of column definitions
 * @property style - Optional styling configuration
 */
export const TableRootType = StructType({
    rows: ArrayType(DictType(StringType, TableCellType)),
    columns: ArrayType(TableColumnType),
    style: OptionType(TableStyleType),
});



/**
 * Type representing the Table structure.
 */
export type TableRootType = typeof TableRootType;

// ============================================================================
// Table (API following chart pattern)
// ============================================================================

/**
 * Column configuration for the Table API.
 *
 * @typeParam FieldType - The East type of the field being rendered
 *
 * @remarks
 * Defines how a column should be displayed, including header text
 * and an optional render function to convert data to UI components.
 *
 * @property header - Column header text (defaults to column key)
 * @property render - Function to render the cell content from field value
 */
export interface TableColumnConfig<FieldType extends TableValueType = TableValueType> {
    /** Column header text (defaults to column key if not provided) */
    header?: SubtypeExprOrValue<StringType>;
    /** Optional render function - defaults to Text.Root (with auto string conversion for non-strings) */
    render?: (value: ExprType<FieldType>) => ExprType<UIComponentType>;
}

/**
 * Creates a Table component following the chart pattern.
 *
 * @typeParam T - The struct type of each data row
 * @param data - Array of data structs
 * @param columns - Column specification: array of field names, or object with optional config
 * @param style - Optional table styling
 * @returns An East expression representing the table component
 *
 * @remarks
 * Columns can be specified as a simple array of field names, or an object
 * with optional header and render configuration.
 *
 * When render is not provided, fields render as Text automatically:
 * - String fields: `Text.Root(value)`
 * - Other types: `Text.Root(East.str\`\${value}\`)` (auto string conversion)
 *
 * @example
 * ```ts
 * import { Table, Text, Badge } from "@elaraai/east-ui";
 *
 * const data = [
 *   { name: "Alice", age: 30, role: "Admin" },
 *   { name: "Bob", age: 25, role: "User" },
 * ];
 *
 * // Simple: array of field names (uses field name as header)
 * Table.Root(data, ["name", "age", "role"]);
 *
 * // With headers and optional custom rendering
 * Table.Root(data, {
 *   name: { header: "Name" },
 *   age: { header: "Age", render: value => Text.Root(value, { textAlign: "right" }) },
 *   role: { header: "Role", render: value => Badge.Root(value) },
 * });
 * ```
 */

// Helper types to extract struct fields from array data type
type ExtractStructFields<T> = T extends ArrayType<infer S>
    ? S extends StructType
    ? S["fields"]
    : never
    : never;

type DataFields<T extends SubtypeExprOrValue<ArrayType<StructType>>> = ExtractStructFields<TypeOf<T>>;

// Column specification can be array of keys or object config
type ColumnSpec<T extends SubtypeExprOrValue<ArrayType<StructType>>> =
    | (keyof DataFields<NoInfer<T>>)[]
    | { [K in keyof DataFields<NoInfer<T>>]?: TableColumnConfig<DataFields<NoInfer<T>>[K]> };

export function createTable<T extends SubtypeExprOrValue<ArrayType<StructType>>>(
    data: T,
    columns: ColumnSpec<T>,
    style?: TableStyle
): ExprType<UIComponentType> {
    const data_expr = East.value(data) as ExprType<ArrayType<StructType>>;
    const field_types = Expr.type(data_expr).value.fields;

    // Normalize columns to object format
    const columns_obj: Record<string, TableColumnConfig & { type: ValueTypeOf<typeof TableValueTypeType> }> = Array.isArray(columns)
        ? Object.fromEntries((columns as string[]).map(key => [key, {
            type: variant(field_types[key as keyof typeof field_types].type, null)
        }]))  as Record<string, TableColumnConfig & { type: ValueTypeOf<typeof TableValueTypeType> }>
        : Object.fromEntries((Object.entries(columns)).map(([key, value]) => [key, {
            ...value,
            type: variant(field_types[key as keyof typeof field_types].type, null)
        }])) as Record<string, TableColumnConfig & { type: ValueTypeOf<typeof TableValueTypeType> }>;
    // Map each data row to a Dict<String, UIComponentType> by calling render functions
    const rows_mapped = data_expr.map(($, datum) => {
        const ret = $.let(new Map(), DictType(StringType, StructType({
            value: TableValueLiteral,
            content: UIComponentType
        })));
        for (const [col_key, col_config] of Object.entries(columns_obj)) {
            const field_value = (datum as any)[col_key];
            const field_type = field_types[col_key];
            let value = variant(field_type.type, field_value);
            // Use custom render if provided, otherwise default to Text with ellipsis overflow
            let content: ValueTypeOf<UIComponentType>;
            if (col_config.render) {
                content = col_config.render(field_value) as any
            } else {
                content = Text.Root(East.str`${field_value}`, {
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }) as any
            }
            $(ret.insert(col_key, { value, content }));
        }
        return ret;
    });

    // Create columns array from the columns config
    const columns_mapped: ValueTypeOf<ArrayType<typeof TableColumnType>> = []
    for(const [key, config] of Object.entries(columns_obj)) {
        if(config.type.type !== "Boolean" &&
           config.type.type !== "Integer" &&
           config.type.type !== "Float" &&
           config.type.type !== "String" &&
           config.type.type !== "DateTime") {
            throw new Error(`Table column type for key "${key}" must be one of Boolean, Integer, Float, String, or DateTime.`);
        }
        columns_mapped.push({
            key: key,
            type: config.type,
            header: config?.header !== undefined ? some(config.header) : some(key) as any,
        });
    }
    // Build the style object
    const variantValue = style?.variant
        ? (typeof style.variant === "string"
            ? East.value(variant(style.variant, null), TableVariantType)
            : style.variant)
        : undefined;

    const sizeValue = style?.size
        ? (typeof style.size === "string"
            ? East.value(variant(style.size, null), TableSizeType)
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

    return East.value(variant("Table", {
        rows: rows_mapped,
        columns: columns_mapped as ValueTypeOf<typeof TableRootType>["columns"],
        style: style ? variant("some", East.value({
            variant: variantValue ? variant("some", variantValue) : variant("none", null),
            size: sizeValue ? variant("some", sizeValue) : variant("none", null),
            striped: toBoolOption(style.striped),
            interactive: toBoolOption(style.interactive),
            stickyHeader: toBoolOption(style.stickyHeader),
            showColumnBorder: toBoolOption(style.showColumnBorder),
            colorPalette: colorPaletteValue ? variant("some", colorPaletteValue) : variant("none", null),
        }, TableStyleType)) : variant("none", null),
    }), UIComponentType);
}

/**
 * Table namespace following the chart pattern.
 *
 * @remarks
 * Pass data as an array of structs and configure columns with either
 * an array of field names or an object with optional header/render config.
 *
 * @example
 * ```ts
 * import { Table, Text, Badge } from "@elaraai/east-ui";
 *
 * const data = [
 *   { name: "Alice", age: 30, role: "Admin" },
 *   { name: "Bob", age: 25, role: "User" },
 * ];
 *
 * // Simple: array of field names
 * Table.Root(data, ["name", "age", "role"]);
 *
 * // With config
 * Table.Root(data, {
 *   name: { header: "Name" },
 *   age: { header: "Age" },
 *   role: { header: "Role", render: value => Badge.Root(value) },
 * }, { variant: "line" });
 * ```
 */
export const Table = {
    /**
     * Creates a Table component following the chart pattern.
     *
     * @typeParam T - The struct type of each data row
     * @param data - Array of data structs
     * @param columns - Column specification: array of field names, or object with optional config
     * @param style - Optional table styling
     * @returns An East expression representing the table component
     *
     * @remarks
     * Columns can be specified as a simple array of field names, or an object
     * with optional header and render configuration.
     *
     * When render is not provided, fields render as Text automatically:
     * - String fields: `Text.Root(value)`
     * - Other types: `Text.Root(East.str\`\${value}\`)` (auto string conversion)
     *
     * @example
     * ```ts
     * import { East } from "@elaraai/east";
     * import { Table, UIComponentType } from "@elaraai/east-ui";
     *
     * const example = East.function([], UIComponentType, $ => {
     *     return Table.Root(
     *         [
     *             { name: "Alice", age: 30n, role: "Admin" },
     *             { name: "Bob", age: 25n, role: "User" },
     *         ],
     *         ["name", "age", "role"],
     *         { variant: "line", striped: true }
     *     );
     * });
     * ```
     */
    Root: createTable,
    Types: {
        /**
         * Type for Table component data.
         *
         * @remarks
         * Table displays data in rows and columns with optional styling.
         *
         * @property rows - Array of row data (Dict mapping column keys to UI components)
         * @property columns - Array of column definitions
         * @property style - Optional styling configuration
         */
        Root: TableRootType,
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
        Style: TableStyleType,
        /**
         * East type for a table column definition.
         *
         * @remarks
         * Defines the header text and key for a column.
         *
         * @property key - The column key (field name)
         * @property type - The column value type
         * @property header - Optional header text for the column
         */
        Column: TableColumnType,
        /**
         * East type for a table cell.
         *
         * @remarks
         * Defines the type for a table cell.
         *
         * @property value - The cell value as a literal
         * @property content - Optional UI component content for the cell
         */
        Cell: TableCellType,
        /**
         * Type representing the Table structure.
         */
        Value: TableValueLiteral,
        /**
         * Table variant type for Chakra UI v3 table styling.
         *
         * @remarks
         * Create instances using the {@link TableVariant} function.
         *
         * @property line - Table with horizontal lines between rows
         * @property outline - Table with full border outline
         */
        Variant: TableVariantType,
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
        Size: TableSizeType,
    },
} as const;
