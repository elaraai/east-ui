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
    IntegerType,
    OptionType,
    variant,
    type ValueTypeOf,
    type TypeOf,
    some,
    none,
    toEastTypeValue,
    type EastType,
    type EastTypeValue,
    LiteralValueType,
} from "@elaraai/east";

import { ColorSchemeType } from "../../style.js";
import { UIComponentType } from "../../component.js";
import {
    TableCellType,
    TableColumnType,
    type TableColumnConfig,
} from "../table/index.js";
import { Text } from "../../typography/index.js";

import {
    PlannerStyleType,
    SlotModeType,
    TableVariantType,
    TableSizeType,
    type PlannerStyle,
    EventClickEventType,
    EventDragEventType,
    EventResizeEventType,
    EventDeleteEventType,
    PlannerEventType,
    PlannerBoundaryType,
} from "./types.js";

// Re-export types
export {
    PlannerStyleType,
    SlotModeType,
    type PlannerStyle,
    type SlotModeLiteral,
    EventClickEventType,
    EventDragEventType,
    EventResizeEventType,
    EventDeleteEventType,
    ResizeEdgeType,
    PlannerEventType,
    PlannerBoundaryType,
    type PlannerBoundary,
} from "./types.js";

// ============================================================================
// Planner Row Type
// ============================================================================

/**
 * East type for an Planner row.
 *
 * @remarks
 * Each row has table cells (displayed on the left) and events (displayed on the right as slots).
 *
 * @property cells - Dict of column key to cell content (same as Table)
 * @property events - Array of events (with optional popover content)
 */
export const PlannerRowType = StructType({
    cells: DictType(StringType, TableCellType),
    events: ArrayType(PlannerEventType),
});

/**
 * Type representing the Planner row structure.
 */
export type PlannerRowType = typeof PlannerRowType;

// ============================================================================
// Planner Root Type
// ============================================================================

/**
 * Type for Planner component data.
 *
 * @remarks
 * Planner displays rows with integer-based events (slots).
 * The slot range is derived from the events' domain, with optional min/max overrides.
 *
 * @property rows - Array of Planner rows
 * @property columns - Array of column definitions (same as Table)
 * @property style - Optional styling configuration
 */
export const PlannerRootType = StructType({
    rows: ArrayType(PlannerRowType),
    columns: ArrayType(TableColumnType),
    style: OptionType(PlannerStyleType),
});

/**
 * Type representing the Planner structure.
 */
export type PlannerRootType = typeof PlannerRootType;

// ============================================================================
// Event Input Interface
// ============================================================================

/**
 * Input interface for creating a Planner event.
 *
 * @remarks
 * This interface provides an ergonomic way to create events
 * by accepting both plain values and East expressions.
 *
 * @property start - Start slot (or single slot if mode=single)
 * @property end - End slot (only used if mode=span)
 * @property label - Optional label to display on the event
 * @property colorPalette - Optional color scheme for the event
 */
export interface EventInput {
    start: SubtypeExprOrValue<IntegerType>;
    end?: SubtypeExprOrValue<IntegerType>;
    label?: SubtypeExprOrValue<StringType>;
    colorPalette?: SubtypeExprOrValue<ColorSchemeType> | string;
}

// ============================================================================
// Event Factory Function
// ============================================================================

/**
 * Creates a Planner event.
 *
 * @param input - Event configuration
 * @returns An East expression representing the Planner event
 *
 * @example
 * ```ts
 * import { East } from "@elaraai/east";
 * import { Planner, UIComponentType } from "@elaraai/east-ui";
 *
 * const example = East.function([], UIComponentType, $ => {
 *     return Planner.Root(
 *         [{ name: "Alice", slot: 1n }],
 *         ["name"],
 *         row => [Planner.Event({
 *             start: row.slot,
 *             end: row.slot.add(2n),
 *             label: "Task",
 *             colorPalette: "blue",
 *         })]
 *     );
 * });
 * ```
 */
function createEvent(input: EventInput): ExprType<PlannerEventType> {
    const colorPaletteValue = input.colorPalette
        ? (typeof input.colorPalette === "string"
            ? East.value(variant(input.colorPalette as any, null), ColorSchemeType)
            : input.colorPalette)
        : undefined;

    return East.value({
        start: input.start,
        end: input.end ? variant("some", input.end) : variant("none", null),
        label: input.label ? variant("some", input.label) : variant("none", null),
        colorPalette: colorPaletteValue ? variant("some", colorPaletteValue) : variant("none", null),
    }, PlannerEventType);
}

// ============================================================================
// Column Configuration
// ============================================================================

// Helper types to extract struct fields from array data type
type ExtractStructFields<T> = T extends ArrayType<infer S>
    ? S extends StructType
    ? S["fields"]
    : never
    : never;

type ExtractElement<T> = T extends ArrayType<infer E> ? E : never;

// Helper type to extract the row element type from an array type (always StructType due to constraint)
type ExtractRowType<T> = T extends ArrayType<infer S>
    ? S extends StructType
    ? S
    : StructType
    : StructType;

type DataFields<T extends SubtypeExprOrValue<ArrayType<StructType>>> = ExtractStructFields<TypeOf<T>>;

type RowElement<T extends SubtypeExprOrValue<ArrayType<StructType>>> = ExtractElement<TypeOf<T>>;

type DataRowType<T extends SubtypeExprOrValue<ArrayType<StructType>>> = ExtractRowType<TypeOf<T>>;

// Column specification can be array of keys or object config
type ColumnSpec<T extends SubtypeExprOrValue<ArrayType<StructType>>> =
    | (keyof DataFields<NoInfer<T>>)[]
    | { [K in keyof DataFields<NoInfer<T>>]?: TableColumnConfig<DataFields<NoInfer<T>>[K], DataRowType<NoInfer<T>>> };

// ============================================================================
// Main Planner Factory
// ============================================================================

/**
 * Creates an Planner component following the Table/Gantt pattern.
 *
 * @typeParam T - The struct type of each data row
 * @param data - Array of data structs
 * @param columns - Column specification for the left-side table columns
 * @param events - Function to extract events from each row
 * @param style - Optional Planner styling
 * @returns An East expression representing the Planner component
 *
 * @example
 * ```ts
 * import { East, IntegerType, StringType } from "@elaraai/east";
 * import { Planner, UIComponentType } from "@elaraai/east-ui";
 *
 * const example = East.function([], UIComponentType, $ => {
 *     return Planner.Root(
 *         [
 *             { name: "Alice", start: 1n, end: 3n },
 *             { name: "Bob", start: 2n, end: 5n },
 *         ],
 *         ["name"],
 *         row => [Planner.Event({ start: row.start, end: row.end })],
 *         {
 *             slotLabel: East.function([IntegerType], StringType, ($, slot) => {
 *                 return East.str`Day ${slot}`;
 *             }),
 *         }
 *     );
 * });
 * ```
 */
function createPlanner<T extends SubtypeExprOrValue<ArrayType<StructType>>>(
    data: T,
    columns: ColumnSpec<T>,
    events: (row: ExprType<RowElement<T>>) => SubtypeExprOrValue<ArrayType<PlannerEventType>>,
    style?: PlannerStyle
): ExprType<UIComponentType> {
    const data_expr = East.value(data) as ExprType<ArrayType<StructType>>;
    const field_types = Expr.type(data_expr).value.fields;

    // Normalize columns to object format, converting field types to EastTypeValue
    const columns_obj = Array.isArray(columns)
        ? Object.fromEntries((columns as string[]).map(key => [key, {
            type: toEastTypeValue(field_types[key as keyof typeof field_types] as EastType)
        }])) as Record<string, TableColumnConfig & { type: EastTypeValue }>
        : Object.fromEntries((Object.entries(columns)).map(([key, value]) => [key, {
            ...value,
            type: toEastTypeValue(field_types[key as keyof typeof field_types] as EastType)
        }])) as Record<string, TableColumnConfig & { type: EastTypeValue }>;

    // Map each data row to an PlannerRow with cells and events
    const rows_mapped = data_expr.map(($, datum) => {
        // Build cells dict (same as Table)
        const cells = $.let(new Map(), DictType(StringType, StructType({
            value: LiteralValueType,
            content: UIComponentType
        })));

        for (const [col_key, col_config] of Object.entries(columns_obj)) {
            const field_value = (datum as any)[col_key];
            const field_type = field_types[col_key];

            // Get cell value: use custom value function if provided, otherwise use field value directly
            let cellValue;
            if ((col_config as any).value) {
                const customValue = East.value((col_config as any).value(field_value, datum as any));
                const customValueType = Expr.type(customValue) as EastType;
                cellValue = variant(customValueType.type as any, customValue);
            } else {
                cellValue = variant(field_type.type, field_value);
            }

            $(cells.insert(col_key, {
                value: cellValue,
                content: East.value(
                    col_config.render ?
                        col_config.render(field_value, datum as any) :
                        Text.Root(East.str`${field_value}`, {
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }),
                    UIComponentType
                ),
            }));
        }

        // Get events from the row using the events function
        const row_events = $.let(events(datum as any), ArrayType(PlannerEventType));

        return East.value({
            cells: cells,
            events: row_events,
        }, PlannerRowType);
    });

    // Create columns array from the columns config
    const columns_mapped: ValueTypeOf<ArrayType<typeof TableColumnType>> = [];
    for (const [key, config] of Object.entries(columns_obj)) {
        columns_mapped.push({
            key: key,
            type: config.type,
            header: config?.header !== undefined ? some(config.header) : some(key) as any,
            width: config?.width !== undefined ? some(config.width) : none as any,
            minWidth: config?.minWidth !== undefined ? some(config.minWidth) : none as any,
            maxWidth: config?.maxWidth !== undefined ? some(config.maxWidth) : none as any,
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

    const slotModeValue = style?.slotMode
        ? (typeof style.slotMode === "string"
            ? East.value(variant(style.slotMode, null), SlotModeType)
            : style.slotMode)
        : undefined;

    const colorPaletteValue = style?.colorPalette
        ? (typeof style.colorPalette === "string"
            ? East.value(variant(style.colorPalette as any, null), ColorSchemeType)
            : style.colorPalette)
        : undefined;

    const styleValue = style ? East.value({
        variant: variantValue ? some(variantValue) : none,
        size: sizeValue ? some(sizeValue) : none,
        striped: style.striped !== undefined ? some(style.striped) : none,
        interactive: style.interactive !== undefined ? some(style.interactive) : none,
        stickyHeader: style.stickyHeader !== undefined ? some(style.stickyHeader) : none,
        showColumnBorder: style.showColumnBorder !== undefined ? some(style.showColumnBorder) : none,
        slotMode: slotModeValue ? some(slotModeValue) : none,
        minSlot: style.minSlot !== undefined ? some(style.minSlot) : none,
        maxSlot: style.maxSlot !== undefined ? some(style.maxSlot) : none,
        slotLabel: style.slotLabel ? some(style.slotLabel) : none,
        slotMinWidth: style.slotMinWidth ? some(style.slotMinWidth) : none,
        colorPalette: colorPaletteValue ? some(colorPaletteValue) : none,
        slotLineStroke: style.slotLineStroke ? some(style.slotLineStroke) : none,
        slotLineWidth: style.slotLineWidth !== undefined ? some(style.slotLineWidth) : none,
        slotLineDash: style.slotLineDash ? some(style.slotLineDash) : none,
        slotLineOpacity: style.slotLineOpacity !== undefined ? some(style.slotLineOpacity) : none,
        boundaries: style.boundaries ? some(style.boundaries.map(b => East.value({
            x: b.x,
            stroke: b.stroke ? some(b.stroke) : none,
            strokeWidth: b.strokeWidth !== undefined ? some(b.strokeWidth) : none,
            strokeDash: b.strokeDash ? some(b.strokeDash) : none,
            strokeOpacity: b.strokeOpacity !== undefined ? some(b.strokeOpacity) : none,
        }, PlannerBoundaryType))) : none,
        onCellClick: style.onCellClick ? some(style.onCellClick) : none,
        onCellDoubleClick: style.onCellDoubleClick ? some(style.onCellDoubleClick) : none,
        onRowClick: style.onRowClick ? some(style.onRowClick) : none,
        onRowDoubleClick: style.onRowDoubleClick ? some(style.onRowDoubleClick) : none,
        onSortChange: style.onSortChange ? some(style.onSortChange) : none,
        onEventClick: style.onEventClick ? some(style.onEventClick) : none,
        onEventDoubleClick: style.onEventDoubleClick ? some(style.onEventDoubleClick) : none,
        onEventDrag: style.onEventDrag ? some(style.onEventDrag) : none,
        onEventResize: style.onEventResize ? some(style.onEventResize) : none,
        onEventAdd: style.onEventAdd ? some(style.onEventAdd) : none,
        onEventEdit: style.onEventEdit ? some(style.onEventEdit) : none,
        onEventDelete: style.onEventDelete ? some(style.onEventDelete) : none,
    }, PlannerStyleType) : undefined;

    return East.value(variant("Planner", {
        rows: rows_mapped,
        columns: columns_mapped as ValueTypeOf<typeof PlannerRootType>["columns"],
        style: styleValue ? some(styleValue) : none,
    }), UIComponentType);
}

// ============================================================================
// Namespace Export
// ============================================================================

/** Type for the Planner namespace */
interface PlannerNamespace {
    Root: typeof createPlanner;
    Event: typeof createEvent;
    Types: {
        Root: typeof PlannerRootType;
        Row: typeof PlannerRowType;
        Event: typeof PlannerEventType;
        Style: typeof PlannerStyleType;
        SlotMode: typeof SlotModeType;
        Boundary: typeof PlannerBoundaryType;
        ClickEvent: typeof EventClickEventType;
        DragEvent: typeof EventDragEventType;
        ResizeEvent: typeof EventResizeEventType;
        DeleteEvent: typeof EventDeleteEventType;
        Column: typeof TableColumnType;
        Cell: typeof TableCellType;
    };
}

/**
 * Planner namespace for creating integer-slot-based scheduling components.
 *
 * @remarks
 * Planner displays rows with integer-based events (slots).
 * Each row has table columns on the left and a slot grid with events on the right.
 * The API follows the Table/Gantt pattern for column configuration.
 */
export const Planner: PlannerNamespace = {
    /**
     * Creates an Planner component following the Table/Gantt pattern.
     *
     * @typeParam T - The struct type of each data row
     * @param data - Array of data structs
     * @param columns - Column specification for the left-side table columns
     * @param events - Function to extract events from each row
     * @param style - Optional Planner styling
     * @returns An East expression representing the Planner component
     *
     * @remarks
     * Planner displays rows with integer-based events (slots).
     * Each row has table columns on the left and a slot grid with events on the right.
     * The slot range is derived from event data with optional min/max overrides.
     *
     * @example
     * ```ts
     * import { East, IntegerType, StringType } from "@elaraai/east";
     * import { Planner, UIComponentType } from "@elaraai/east-ui";
     *
     * const example = East.function([], UIComponentType, $ => {
     *     return Planner.Root(
     *         [
     *             { name: "Alice", start: 1n, end: 3n },
     *             { name: "Bob", start: 2n, end: 5n },
     *         ],
     *         ["name"],
     *         row => [Planner.Event({ start: row.start, end: row.end })],
     *         {
     *             slotLabel: East.function([IntegerType], StringType, ($, slot) => {
     *                 return East.str`Day ${slot}`;
     *             }),
     *         }
     *     );
     * });
     * ```
     */
    Root: createPlanner,
    /**
     * Creates a Planner event.
     *
     * @param input - Event configuration with start, end, label, colorPalette
     * @returns An East expression representing the Planner event
     */
    Event: createEvent,
    Types: {
        /**
         * Type for Planner component data.
         *
         * @property rows - Array of Planner rows
         * @property columns - Array of column definitions
         * @property style - Optional styling configuration
         */
        Root: PlannerRootType,
        /**
         * East type for an Planner row.
         *
         * @property cells - Dict of column key to cell content
         * @property events - Array of events
         */
        Row: PlannerRowType,
        /**
         * Event data for Planner.
         *
         * @property start - Start slot
         * @property end - End slot (optional, for span mode)
         * @property label - Optional label
         * @property colorPalette - Optional color scheme
         */
        Event: PlannerEventType,
        /**
         * Style type for the Planner component.
         */
        Style: PlannerStyleType,
        /**
         * Slot mode variant type.
         *
         * @property single - Each event occupies one slot
         * @property span - Events span from start to end
         */
        SlotMode: SlotModeType,
        /**
         * Boundary data for vertical lines at specific slot positions.
         *
         * @property x - Slot position for the boundary line
         * @property stroke - Line color
         * @property strokeWidth - Line width in pixels
         * @property strokeDash - Dash pattern
         * @property strokeOpacity - Line opacity (0-1)
         */
        Boundary: PlannerBoundaryType,
        /**
         * Event data for event click events.
         */
        ClickEvent: EventClickEventType,
        /**
         * Event data for event drag (move) events.
         */
        DragEvent: EventDragEventType,
        /**
         * Event data for event resize events.
         */
        ResizeEvent: EventResizeEventType,
        /**
         * Event data for event delete events.
         */
        DeleteEvent: EventDeleteEventType,
        /**
         * East type for a table column definition.
         */
        Column: TableColumnType,
        /**
         * East type for a table cell.
         */
        Cell: TableCellType,
    },
};
