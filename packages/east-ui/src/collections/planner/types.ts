/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type SubtypeExprOrValue,
    OptionType,
    StructType,
    VariantType,
    ArrayType,
    StringType,
    BooleanType,
    FloatType,
    IntegerType,
    NullType,
    FunctionType
} from "@elaraai/east";

import { TableCellClickEventType, TableRowClickEventType, TableSortEventType } from "../table/types.js";

import {
    ColorSchemeType,
    type ColorSchemeLiteral,
    FontWeightType,
    FontStyleType,
    SizeType,
    TextAlignType,
} from "../../style.js";

// Import shared types from table
import {
    TableVariantType,
    TableSizeType,
    type TableVariantLiteral,
    type TableSizeLiteral,
} from "../table/types.js";

// Re-export table types used by Planner
export {
    TableVariantType,
    TableSizeType,
    type TableVariantLiteral,
    type TableSizeLiteral,
} from "../table/types.js";

// ============================================================================
// Slot Mode Type
// ============================================================================

/**
 * Slot mode variant type - determines how events occupy slots.
 *
 * @property single - Each event occupies exactly one slot (start only)
 * @property span - Events span from start to end slot (inclusive)
 */
export const SlotModeType = VariantType({
    /** Each event occupies exactly one slot */
    single: NullType,
    /** Events span from start to end slot (inclusive) */
    span: NullType,
});

export type SlotModeType = typeof SlotModeType;

/**
 * String literal type for slot mode values.
 */
export type SlotModeLiteral = "single" | "span";

// ============================================================================
// Event Type
// ============================================================================

/**
 * Event data for Planner.
 *
 * @remarks
 * Represents an event that occupies one or more slots.
 * In single mode, only start is used.
 * In span mode, start and end define the range (inclusive).
 *
 * @property start - Start slot (or single slot if mode=single)
 * @property end - End slot (only used if mode=span)
 * @property label - Optional label to display on the event
 * @property colorPalette - Optional color scheme for the event
 * @property color - Optional text color (overrides colorPalette)
 * @property background - Optional background/fill color (overrides colorPalette)
 * @property stroke - Optional stroke/border color (overrides colorPalette)
 * @property opacity - Optional opacity (0-1)
 * @property fontWeight - Optional font weight for label
 * @property fontStyle - Optional font style for label
 * @property fontSize - Optional font size for label
 * @property textAlign - Optional text alignment for label
 */
export const PlannerEventType = StructType({
    start: IntegerType,
    end: OptionType(IntegerType),
    label: OptionType(StringType),
    colorPalette: OptionType(ColorSchemeType),
    // Text styling
    color: OptionType(StringType),
    background: OptionType(StringType),
    stroke: OptionType(StringType),
    opacity: OptionType(FloatType),
    fontWeight: OptionType(FontWeightType),
    fontStyle: OptionType(FontStyleType),
    fontSize: OptionType(SizeType),
    textAlign: OptionType(TextAlignType),
});

/**
 * Type representing the Planner event structure.
 */
export type PlannerEventType = typeof PlannerEventType;

// ============================================================================
// Callback Event Types
// ============================================================================

/**
 * Event data for event click events.
 *
 * @property rowIndex - Row index (0-based)
 * @property eventIndex - Event index within the row (0-based)
 * @property start - Start slot of the event
 * @property end - End slot of the event (same as start if single-slot mode)
 */
export const EventClickEventType = StructType({
    rowIndex: IntegerType,
    eventIndex: IntegerType,
    start: IntegerType,
    end: IntegerType,
});

export type EventClickEventType = typeof EventClickEventType;

/**
 * Event data for event drag (move) events.
 *
 * @property rowIndex - Row index (0-based)
 * @property eventIndex - Event index within the row (0-based)
 * @property previousStart - Previous start slot
 * @property previousEnd - Previous end slot
 * @property newStart - New start slot
 * @property newEnd - New end slot
 */
export const EventDragEventType = StructType({
    rowIndex: IntegerType,
    eventIndex: IntegerType,
    previousStart: IntegerType,
    previousEnd: IntegerType,
    newStart: IntegerType,
    newEnd: IntegerType,
});

export type EventDragEventType = typeof EventDragEventType;

/**
 * Edge variant for resize events.
 *
 * @property start - The start edge was dragged
 * @property end - The end edge was dragged
 */
export const ResizeEdgeType = VariantType({
    start: NullType,
    end: NullType,
});

export type ResizeEdgeType = typeof ResizeEdgeType;

/**
 * Event data for event resize events.
 *
 * @property rowIndex - Row index (0-based)
 * @property eventIndex - Event index within the row (0-based)
 * @property previousStart - Previous start slot
 * @property previousEnd - Previous end slot
 * @property newStart - New start slot
 * @property newEnd - New end slot
 * @property edge - Which edge was dragged (start or end)
 */
export const EventResizeEventType = StructType({
    rowIndex: IntegerType,
    eventIndex: IntegerType,
    previousStart: IntegerType,
    previousEnd: IntegerType,
    newStart: IntegerType,
    newEnd: IntegerType,
    edge: ResizeEdgeType,
});

export type EventResizeEventType = typeof EventResizeEventType;

/**
 * Event data for event add events.
 *
 * @property rowIndex - Row index (0-based)
 * @property slot - Slot where the event should be added
 */
export const EventAddEventType = StructType({
    rowIndex: IntegerType,
    slot: IntegerType,
});

export type EventAddEventType = typeof EventAddEventType;

/**
 * Event data for event delete events.
 *
 * @property rowIndex - Row index (0-based)
 * @property eventIndex - Event index within the row (0-based)
 * @property start - Start slot of the event
 * @property end - End slot of the event
 */
export const EventDeleteEventType = StructType({
    rowIndex: IntegerType,
    eventIndex: IntegerType,
    start: IntegerType,
    end: IntegerType,
});

export type EventDeleteEventType = typeof EventDeleteEventType;

/**
 * Context passed to the eventPopover function.
 *
 * @property rowIndex - Row index (0-based)
 * @property eventIndex - Event index within the row (0-based)
 * @property start - Start slot of the event
 * @property end - End slot of the event
 * @property label - Event label (if any)
 * @property colorPalette - Event color palette (if any)
 */
export const EventPopoverContextType = StructType({
    rowIndex: IntegerType,
    eventIndex: IntegerType,
    start: IntegerType,
    end: IntegerType,
    label: OptionType(StringType),
    colorPalette: OptionType(ColorSchemeType),
});

export type EventPopoverContextType = typeof EventPopoverContextType;

// ============================================================================
// Boundary Type
// ============================================================================

/**
 * Boundary data for Planner - vertical lines at specific slot positions.
 *
 * @remarks
 * Boundaries are vertical lines that span the full height of the chart
 * at a specific x (slot) position. Useful for marking deadlines, milestones,
 * or other significant points.
 *
 * @property x - The slot position for the boundary line
 * @property stroke - Line color (CSS color value)
 * @property strokeWidth - Line width in pixels
 * @property strokeDash - Dash pattern (e.g., "4 2" for dashed line)
 * @property strokeOpacity - Line opacity (0-1)
 */
export const PlannerBoundaryType = StructType({
    x: IntegerType,
    stroke: OptionType(StringType),
    strokeWidth: OptionType(FloatType),
    strokeDash: OptionType(StringType),
    strokeOpacity: OptionType(FloatType),
});

/**
 * Type representing the Planner boundary structure.
 */
export type PlannerBoundaryType = typeof PlannerBoundaryType;

/**
 * TypeScript interface for Planner boundary input.
 *
 * @remarks
 * Accepts both static values and East expressions.
 */
export interface PlannerBoundary {
    /** The slot position for the boundary line */
    x: SubtypeExprOrValue<IntegerType>;
    /** Line color (CSS color value) */
    stroke?: SubtypeExprOrValue<StringType>;
    /** Line width in pixels */
    strokeWidth?: SubtypeExprOrValue<FloatType>;
    /** Dash pattern (e.g., "4 2" for dashed line) */
    strokeDash?: SubtypeExprOrValue<StringType>;
    /** Line opacity (0-1) */
    strokeOpacity?: SubtypeExprOrValue<FloatType>;
}

// ============================================================================
// Style Type
// ============================================================================

/**
 * Style type for the Planner component.
 *
 * @remarks
 * All properties are optional and wrapped in {@link OptionType}.
 * Reuses table styling properties where applicable.
 *
 * @property variant - Table variant (line or outline)
 * @property size - Table size (sm, md, lg)
 * @property striped - Whether to show zebra stripes on rows
 * @property interactive - Whether to highlight rows on hover
 * @property stickyHeader - Whether the header sticks when scrolling
 * @property showColumnBorder - Whether to show borders between columns
 * @property slotMode - single or span (default: span)
 * @property minSlot - Optional min slot override (else derived from data)
 * @property maxSlot - Optional max slot override (else derived from data)
 * @property slotLabel - Custom slot label function
 * @property slotMinWidth - Min width per slot (CSS value, default "60px")
 * @property colorPalette - Default color scheme for events
 * @property slotLineStroke - Vertical grid line color
 * @property slotLineWidth - Vertical grid line width in pixels
 * @property slotLineDash - Vertical grid line dash pattern
 * @property slotLineOpacity - Vertical grid line opacity (0-1)
 * @property boundaries - Array of boundary lines at specific slot positions
 * @property onCellClick - Callback triggered when a cell is clicked
 * @property onCellDoubleClick - Callback triggered when a cell is double-clicked
 * @property onRowClick - Callback triggered when a row is clicked
 * @property onRowDoubleClick - Callback triggered when a row is double-clicked
 * @property onSortChange - Callback triggered when sorting changes
 * @property onEventClick - Callback triggered when an event is clicked
 * @property onEventDoubleClick - Callback triggered when an event is double-clicked
 * @property onEventDrag - Callback triggered when an event is dragged/moved
 * @property onEventResize - Callback triggered when an event is resized
 * @property onEventAdd - Callback triggered when adding a new event (click on empty slot)
 * @property onEventEdit - Callback triggered when editing an event (via context menu)
 * @property onEventDelete - Callback triggered when deleting an event (via context menu)
 */
export const PlannerStyleType = StructType({
    // Table styling (reused from Table)
    variant: OptionType(TableVariantType),
    size: OptionType(TableSizeType),
    striped: OptionType(BooleanType),
    interactive: OptionType(BooleanType),
    stickyHeader: OptionType(BooleanType),
    showColumnBorder: OptionType(BooleanType),

    // Planner-specific
    slotMode: OptionType(SlotModeType),
    minSlot: OptionType(IntegerType),
    maxSlot: OptionType(IntegerType),
    slotLabel: OptionType(FunctionType([IntegerType], StringType)),
    slotMinWidth: OptionType(StringType),
    colorPalette: OptionType(ColorSchemeType),

    // Slot line styling (vertical grid lines)
    slotLineStroke: OptionType(StringType),
    slotLineWidth: OptionType(FloatType),
    slotLineDash: OptionType(StringType),
    slotLineOpacity: OptionType(FloatType),

    // Boundary lines
    boundaries: OptionType(ArrayType(PlannerBoundaryType)),

    // Callbacks
    onCellClick: OptionType(FunctionType([TableCellClickEventType], NullType)),
    onCellDoubleClick: OptionType(FunctionType([TableCellClickEventType], NullType)),
    onRowClick: OptionType(FunctionType([TableRowClickEventType], NullType)),
    onRowDoubleClick: OptionType(FunctionType([TableRowClickEventType], NullType)),
    onSortChange: OptionType(FunctionType([TableSortEventType], NullType)),
    onEventClick: OptionType(FunctionType([EventClickEventType], NullType)),
    onEventDoubleClick: OptionType(FunctionType([EventClickEventType], NullType)),
    onEventDrag: OptionType(FunctionType([EventDragEventType], NullType)),
    onEventResize: OptionType(FunctionType([EventResizeEventType], NullType)),
    onEventAdd: OptionType(FunctionType([EventAddEventType], NullType)),
    onEventEdit: OptionType(FunctionType([EventClickEventType], NullType)),
    onEventDelete: OptionType(FunctionType([EventDeleteEventType], NullType)),
});

/**
 * Type representing the Planner style structure.
 */
export type PlannerStyleType = typeof PlannerStyleType;

/**
 * TypeScript interface for Planner styling input.
 *
 * @remarks
 * Accepts both static values and East expressions.
 */
export interface PlannerStyle {
    /** Table variant (line or outline) */
    variant?: SubtypeExprOrValue<TableVariantType> | TableVariantLiteral;
    /** Table size (sm, md, lg) */
    size?: SubtypeExprOrValue<TableSizeType> | TableSizeLiteral;
    /** Whether to show zebra stripes on rows */
    striped?: SubtypeExprOrValue<BooleanType>;
    /** Whether to highlight rows on hover */
    interactive?: SubtypeExprOrValue<BooleanType>;
    /** Whether the header sticks when scrolling */
    stickyHeader?: SubtypeExprOrValue<BooleanType>;
    /** Whether to show borders between columns */
    showColumnBorder?: SubtypeExprOrValue<BooleanType>;
    /** Slot mode: single or span (default: span) */
    slotMode?: SubtypeExprOrValue<SlotModeType> | SlotModeLiteral;
    /** Optional min slot override (else derived from data) */
    minSlot?: SubtypeExprOrValue<IntegerType>;
    /** Optional max slot override (else derived from data) */
    maxSlot?: SubtypeExprOrValue<IntegerType>;
    /** Custom slot label function */
    slotLabel?: SubtypeExprOrValue<FunctionType<[IntegerType], StringType>>;
    /** Min width per slot (CSS value, default "60px") */
    slotMinWidth?: SubtypeExprOrValue<StringType>;
    /** Default color scheme for events */
    colorPalette?: SubtypeExprOrValue<ColorSchemeType> | ColorSchemeLiteral;
    /** Vertical grid line color */
    slotLineStroke?: SubtypeExprOrValue<StringType>;
    /** Vertical grid line width in pixels */
    slotLineWidth?: SubtypeExprOrValue<FloatType>;
    /** Vertical grid line dash pattern (e.g., "4 2") */
    slotLineDash?: SubtypeExprOrValue<StringType>;
    /** Vertical grid line opacity (0-1) */
    slotLineOpacity?: SubtypeExprOrValue<FloatType>;
    /** Array of boundary lines at specific slot positions */
    boundaries?: PlannerBoundary[];
    /** Callback triggered when a cell is clicked */
    onCellClick?: SubtypeExprOrValue<FunctionType<[TableCellClickEventType], NullType>>;
    /** Callback triggered when a cell is double-clicked */
    onCellDoubleClick?: SubtypeExprOrValue<FunctionType<[TableCellClickEventType], NullType>>;
    /** Callback triggered when a row is clicked */
    onRowClick?: SubtypeExprOrValue<FunctionType<[TableRowClickEventType], NullType>>;
    /** Callback triggered when a row is double-clicked */
    onRowDoubleClick?: SubtypeExprOrValue<FunctionType<[TableRowClickEventType], NullType>>;
    /** Callback triggered when sorting changes */
    onSortChange?: SubtypeExprOrValue<FunctionType<[TableSortEventType], NullType>>;
    /** Callback triggered when an event is clicked */
    onEventClick?: SubtypeExprOrValue<FunctionType<[EventClickEventType], NullType>>;
    /** Callback triggered when an event is double-clicked */
    onEventDoubleClick?: SubtypeExprOrValue<FunctionType<[EventClickEventType], NullType>>;
    /** Callback triggered when an event is dragged/moved */
    onEventDrag?: SubtypeExprOrValue<FunctionType<[EventDragEventType], NullType>>;
    /** Callback triggered when an event is resized */
    onEventResize?: SubtypeExprOrValue<FunctionType<[EventResizeEventType], NullType>>;
    /** Callback triggered when adding a new event (click on empty slot) */
    onEventAdd?: SubtypeExprOrValue<FunctionType<[EventAddEventType], NullType>>;
    /** Callback triggered when editing an event (via context menu) */
    onEventEdit?: SubtypeExprOrValue<FunctionType<[EventClickEventType], NullType>>;
    /** Callback triggered when deleting an event (via context menu) */
    onEventDelete?: SubtypeExprOrValue<FunctionType<[EventDeleteEventType], NullType>>;
}
