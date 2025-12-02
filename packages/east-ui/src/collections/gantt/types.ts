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
    DateTimeType,
    FloatType,
} from "@elaraai/east";

import {
    ColorSchemeType,
    type ColorSchemeLiteral,
} from "../../style.js";

// Import shared types from table
import {
    TableVariantType,
    TableSizeType,
    type TableVariantLiteral,
    type TableSizeLiteral,
} from "../table/types.js";

// Re-export table types used by Gantt
export {
    TableVariantType,
    TableSizeType,
    type TableVariantLiteral,
    type TableSizeLiteral,
} from "../table/types.js";

// ============================================================================
// Gantt Event Types
// ============================================================================

/**
 * Task event data for Gantt charts.
 *
 * @remarks
 * Represents a task bar spanning from start to end date.
 *
 * @property start - Start date/time of the task
 * @property end - End date/time of the task
 * @property label - Optional label to display on the task bar
 * @property progress - Optional progress percentage (0-100)
 * @property colorPalette - Optional color scheme for the task bar
 */
export const GanttTaskType = StructType({
    start: DateTimeType,
    end: DateTimeType,
    label: OptionType(StringType),
    progress: OptionType(FloatType),
    colorPalette: OptionType(ColorSchemeType),
});

/**
 * Type representing the Gantt task structure.
 */
export type GanttTaskType = typeof GanttTaskType;

/**
 * Milestone event data for Gantt charts.
 *
 * @remarks
 * Represents a single point in time milestone.
 *
 * @property date - The date/time of the milestone
 * @property label - Optional label to display near the milestone
 * @property colorPalette - Optional color scheme for the milestone marker
 */
export const GanttMilestoneType = StructType({
    date: DateTimeType,
    label: OptionType(StringType),
    colorPalette: OptionType(ColorSchemeType),
});

/**
 * Type representing the Gantt milestone structure.
 */
export type GanttMilestoneType = typeof GanttMilestoneType;

/**
 * Gantt event variant type.
 *
 * @remarks
 * Events can be either tasks (with duration) or milestones (single point).
 *
 * @property Task - A task spanning from start to end date
 * @property Milestone - A milestone at a specific date
 */
export const GanttEventType = VariantType({
    Task: GanttTaskType,
    Milestone: GanttMilestoneType,
});

/**
 * Type representing the Gantt event variant.
 */
export type GanttEventType = typeof GanttEventType;

// ============================================================================
// Gantt Style Type
// ============================================================================

/**
 * Style type for the Gantt component.
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
 * @property colorPalette - Default color scheme for events
 * @property showToday - Whether to show a today marker line
 */
export const GanttStyleType = StructType({
    variant: OptionType(TableVariantType),
    size: OptionType(TableSizeType),
    striped: OptionType(BooleanType),
    interactive: OptionType(BooleanType),
    stickyHeader: OptionType(BooleanType),
    showColumnBorder: OptionType(BooleanType),
    colorPalette: OptionType(ColorSchemeType),
    showToday: OptionType(BooleanType),
});

/**
 * Type representing the Gantt style structure.
 */
export type GanttStyleType = typeof GanttStyleType;

/**
 * TypeScript interface for Gantt styling input.
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
 * @property colorPalette - Default color scheme for events
 * @property showToday - Whether to show a today marker line
 */
export interface GanttStyle {
    variant?: SubtypeExprOrValue<TableVariantType> | TableVariantLiteral;
    size?: SubtypeExprOrValue<TableSizeType> | TableSizeLiteral;
    striped?: SubtypeExprOrValue<BooleanType>;
    interactive?: SubtypeExprOrValue<BooleanType>;
    stickyHeader?: SubtypeExprOrValue<BooleanType>;
    showColumnBorder?: SubtypeExprOrValue<BooleanType>;
    colorPalette?: SubtypeExprOrValue<ColorSchemeType> | ColorSchemeLiteral;
    showToday?: SubtypeExprOrValue<BooleanType>;
}
