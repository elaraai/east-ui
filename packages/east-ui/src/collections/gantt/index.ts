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
    DateTimeType,
    FloatType,
    variant,
    type ValueTypeOf,
    type TypeOf,
    some,
} from "@elaraai/east";

import { ColorSchemeType } from "../../style.js";
import { UIComponentType } from "../../component.js";
import {
    TableCellType,
    TableColumnType,
    type TableColumnConfig,
} from "../table/index.js";
import {
    TableValueLiteral, TableValueTypeType
} from "../table/types.js";
import { Text } from "../../typography/index.js";

import {
    GanttEventType,
    GanttTaskType,
    GanttMilestoneType,
    GanttStyleType,
    TableVariantType,
    TableSizeType,
    type GanttStyle,
} from "./types.js";

// Re-export types
export {
    GanttEventType,
    GanttTaskType,
    GanttMilestoneType,
    GanttStyleType,
    type GanttStyle,
} from "./types.js";

// ============================================================================
// Gantt Row Type
// ============================================================================

/**
 * East type for a Gantt row.
 *
 * @remarks
 * Each row has table cells (displayed on the left) and events (displayed on the right as a timeline).
 *
 * @property cells - Dict of column key to cell content (same as Table)
 * @property events - Array of events (Task or Milestone variants)
 */
export const GanttRowType = StructType({
    cells: DictType(StringType, TableCellType),
    events: ArrayType(GanttEventType),
});

/**
 * Type representing the Gantt row structure.
 */
export type GanttRowType = typeof GanttRowType;

// ============================================================================
// Gantt Root Type
// ============================================================================

/**
 * Type for Gantt component data.
 *
 * @remarks
 * Gantt displays rows with time-based events (tasks and milestones).
 * The time range is derived from the events' domain.
 *
 * @property rows - Array of Gantt rows
 * @property columns - Array of column definitions (same as Table)
 * @property style - Optional styling configuration
 */
export const GanttRootType = StructType({
    rows: ArrayType(GanttRowType),
    columns: ArrayType(TableColumnType),
    style: OptionType(GanttStyleType),
});

/**
 * Type representing the Gantt structure.
 */
export type GanttRootType = typeof GanttRootType;

// ============================================================================
// Task/Milestone Input Interfaces
// ============================================================================

/**
 * Input interface for creating a Task event.
 *
 * @property start - Start date/time of the task
 * @property end - End date/time of the task
 * @property label - Optional label to display on the task bar
 * @property progress - Optional progress percentage (0-100)
 * @property colorPalette - Optional color scheme for the task bar
 */
export interface TaskInput {
    start: SubtypeExprOrValue<DateTimeType>;
    end: SubtypeExprOrValue<DateTimeType>;
    label?: SubtypeExprOrValue<StringType>;
    progress?: SubtypeExprOrValue<FloatType>;
    colorPalette?: SubtypeExprOrValue<ColorSchemeType> | string;
}

/**
 * Input interface for creating a Milestone event.
 *
 * @property date - The date/time of the milestone
 * @property label - Optional label to display near the milestone
 * @property colorPalette - Optional color scheme for the milestone marker
 */
export interface MilestoneInput {
    date: SubtypeExprOrValue<DateTimeType>;
    label?: SubtypeExprOrValue<StringType>;
    colorPalette?: SubtypeExprOrValue<ColorSchemeType> | string;
}

// ============================================================================
// Factory Functions for Events
// ============================================================================

/**
 * Creates a Task event for a Gantt row.
 *
 * @param input - Task configuration
 * @returns An East expression representing the Task event
 *
 * @example
 * ```ts
 * Gantt.Task({
 *   start: new Date("2024-01-01"),
 *   end: new Date("2024-01-15"),
 *   label: "Design Phase",
 *   progress: 75,
 *   colorPalette: "blue",
 * });
 * ```
 */
function createTask(input: TaskInput): ExprType<GanttEventType> {
    const colorPaletteValue = input.colorPalette
        ? (typeof input.colorPalette === "string"
            ? East.value(variant(input.colorPalette as any, null), ColorSchemeType)
            : input.colorPalette)
        : undefined;

    return East.value(variant("Task", {
        start: input.start,
        end: input.end,
        label: input.label ? variant("some", input.label) : variant("none", null),
        progress: input.progress ? variant("some", input.progress) : variant("none", null),
        colorPalette: colorPaletteValue ? variant("some", colorPaletteValue) : variant("none", null),
    }), GanttEventType);
}

/**
 * Creates a Milestone event for a Gantt row.
 *
 * @param input - Milestone configuration
 * @returns An East expression representing the Milestone event
 *
 * @example
 * ```ts
 * Gantt.Milestone({
 *   date: new Date("2024-01-15"),
 *   label: "Design Complete",
 *   colorPalette: "green",
 * });
 * ```
 */
function createMilestone(input: MilestoneInput): ExprType<GanttEventType> {
    const colorPaletteValue = input.colorPalette
        ? (typeof input.colorPalette === "string"
            ? East.value(variant(input.colorPalette as any, null), ColorSchemeType)
            : input.colorPalette)
        : undefined;

    return East.value(variant("Milestone", {
        date: input.date,
        label: input.label ? variant("some", input.label) : variant("none", null),
        colorPalette: colorPaletteValue ? variant("some", colorPaletteValue) : variant("none", null),
    }), GanttEventType);
}

// ============================================================================
// Gantt Column Configuration
// ============================================================================

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

// ============================================================================
// Main Gantt Factory
// ============================================================================

/**
 * Creates a Gantt component following the Table pattern.
 *
 * @typeParam T - The struct type of each data row
 * @param data - Array of data structs
 * @param columns - Column specification for the left-side table columns
 * @param events - Function to extract events from each row
 * @param style - Optional Gantt styling
 * @returns An East expression representing the Gantt component
 *
 * @example
 * ```ts
 * import { Gantt } from "@elaraai/east-ui";
 *
 * const data = [
 *   { name: "Design", start: new Date("2024-01-01"), end: new Date("2024-01-15") },
 *   { name: "Development", start: new Date("2024-01-10"), end: new Date("2024-02-01") },
 * ];
 *
 * // Simple: array of column names, events extracted from row fields
 * Gantt.Root(data, ["name"], row => [
 *   Gantt.Task({ start: row.start, end: row.end }),
 * ]);
 *
 * // With column config and styling
 * Gantt.Root(data, {
 *   name: { header: "Task Name" },
 * }, row => [
 *   Gantt.Task({ start: row.start, end: row.end, colorPalette: "blue" }),
 * ], { variant: "line", showToday: true });
 * ```
 */
function createGantt<T extends SubtypeExprOrValue<ArrayType<StructType>>>(
    data: T,
    columns: ColumnSpec<T>,
    events: (row: ExprType<TypeOf<T> extends ArrayType<infer E> ? E : never>) => SubtypeExprOrValue<ArrayType<GanttEventType>>,
    style?: GanttStyle
): ExprType<UIComponentType> {
    const data_expr = East.value(data) as ExprType<ArrayType<StructType>>;
    const field_types = Expr.type(data_expr).value.fields;

    // Normalize columns to object format
    const columns_obj: Record<string, TableColumnConfig & { type: ValueTypeOf<typeof TableValueTypeType> }> = Array.isArray(columns)
        ? Object.fromEntries((columns as string[]).map(key => [key, {
            type: variant(field_types[key as keyof typeof field_types].type, null)
        }])) as Record<string, TableColumnConfig & { type: ValueTypeOf<typeof TableValueTypeType> }>
        : Object.fromEntries((Object.entries(columns)).map(([key, value]) => [key, {
            ...value,
            type: variant(field_types[key as keyof typeof field_types].type, null)
        }])) as Record<string, TableColumnConfig & { type: ValueTypeOf<typeof TableValueTypeType> }>;

    // Map each data row to a GanttRow with cells and events
    const rows_mapped = data_expr.map(($, datum) => {
        // Build cells dict (same as Table)
        const cells = $.let(new Map(), DictType(StringType, StructType({
            value: TableValueLiteral,
            content: UIComponentType
        })));

        for (const [col_key, col_config] of Object.entries(columns_obj)) {
            const field_value = (datum as any)[col_key];
            const field_type = field_types[col_key];
            const value = variant(field_type.type, field_value);

            let content: ValueTypeOf<UIComponentType>;
            if (col_config.render) {
                content = col_config.render(field_value) as any;
            } else {
                content = Text.Root(East.str`${field_value}`, {
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }) as any;
            }
            $(cells.insert(col_key, { value, content }));
        }

        // Get events from the row using the events function
        const row_events = events(datum as any);

        return East.value({
            cells: cells,
            events: row_events,
        }, GanttRowType);
    });

    // Create columns array from the columns config
    const columns_mapped: ValueTypeOf<ArrayType<typeof TableColumnType>> = [];
    for (const [key, config] of Object.entries(columns_obj)) {
        if (config.type.type !== "Boolean" &&
            config.type.type !== "Integer" &&
            config.type.type !== "Float" &&
            config.type.type !== "String" &&
            config.type.type !== "DateTime") {
            throw new Error(`Gantt column type for key "${key}" must be one of Boolean, Integer, Float, String, or DateTime.`);
        }
        columns_mapped.push({
            key: key,
            type: config.type,
            header: config?.header !== undefined ? some(config.header) : some(key) as any,
        });
    }

    // Build style value
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
            ? East.value(variant(style.colorPalette as any, null), ColorSchemeType)
            : style.colorPalette)
        : undefined;

    const toBoolOption = (value: SubtypeExprOrValue<typeof BooleanType> | undefined) => {
        if (value === undefined) return variant("none", null);
        return variant("some", value);
    };

    const styleValue = style ? East.value({
        variant: variantValue ? variant("some", variantValue) : variant("none", null),
        size: sizeValue ? variant("some", sizeValue) : variant("none", null),
        striped: toBoolOption(style.striped),
        interactive: toBoolOption(style.interactive),
        stickyHeader: toBoolOption(style.stickyHeader),
        showColumnBorder: toBoolOption(style.showColumnBorder),
        colorPalette: colorPaletteValue ? variant("some", colorPaletteValue) : variant("none", null),
        showToday: toBoolOption(style.showToday),
    }, GanttStyleType) : undefined;

    return East.value(variant("Gantt", {
        rows: rows_mapped,
        columns: columns_mapped as ValueTypeOf<typeof GanttRootType>["columns"],
        style: styleValue ? variant("some", styleValue) : variant("none", null),
    }), UIComponentType);
}

// ============================================================================
// Namespace Export
// ============================================================================

/**
 * Gantt namespace for creating Gantt chart components.
 *
 * @remarks
 * Gantt charts display time-based events (tasks and milestones) in rows.
 * Each row has table columns on the left and a timeline with events on the right.
 * The API follows the Table pattern for column configuration.
 *
 * @example
 * ```ts
 * import { Gantt } from "@elaraai/east-ui";
 *
 * const tasks = [
 *   { name: "Design", owner: "Alice", start: new Date("2024-01-01"), end: new Date("2024-01-15") },
 *   { name: "Development", owner: "Bob", start: new Date("2024-01-10"), end: new Date("2024-02-01") },
 * ];
 *
 * const gantt = Gantt.Root(tasks, {
 *   name: { header: "Task" },
 *   owner: { header: "Owner" },
 * }, row => [
 *   Gantt.Task({
 *     start: row.start,
 *     end: row.end,
 *     colorPalette: "blue",
 *   }),
 * ], {
 *   variant: "line",
 *   showToday: true,
 * });
 * ```
 */
export const Gantt = {
    /** Create a Gantt chart component */
    Root: createGantt,
    /** Create a Task event (spans time range) */
    Task: createTask,
    /** Create a Milestone event (single point in time) */
    Milestone: createMilestone,
    /** Type definitions for Gantt components */
    Types: {
        Root: GanttRootType,
        Row: GanttRowType,
        Event: GanttEventType,
        Task: GanttTaskType,
        Milestone: GanttMilestoneType,
        Style: GanttStyleType,
        Column: TableColumnType,
        Cell: TableCellType,
    },
} as const;
