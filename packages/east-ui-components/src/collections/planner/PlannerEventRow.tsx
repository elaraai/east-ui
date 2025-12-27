/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo, useState, useCallback } from "react";
import type { ValueTypeOf } from "@elaraai/east";
import type { Planner } from "@elaraai/east-ui";
import { PlannerEvent } from "./PlannerEvent";
import { PlannerSlotCell } from "./PlannerSlotCell";

export type PlannerEventValue = ValueTypeOf<typeof Planner.Types.Event>;
export type PlannerRowValue = ValueTypeOf<typeof Planner.Types.Row>;

// Re-export PlannerEventValue for external consumers
export type { PlannerEventValue as PlannerEventValueExport } from "./PlannerEvent";

export interface PlannerEventRowProps {
    events: PlannerEventValue[];
    rowIndex: number;
    y: number;
    width: number;
    height: number;
    slotWidth: number;
    slotRangeStart: number;
    slotMode: "single" | "span";
    slotCount: number;
    minSlot?: number;
    maxSlot?: number;
    stepSize?: number;
    readOnly?: boolean;
    onEventClick?: ((event: PlannerEventValue, rowIndex: number, eventIndex: number) => void) | undefined;
    onEventDoubleClick?: ((event: PlannerEventValue, rowIndex: number, eventIndex: number) => void) | undefined;
    onEventDrag?: ((rowIndex: number, eventIndex: number, previousStart: number, previousEnd: number, newStart: number, newEnd: number) => void) | undefined;
    onEventResize?: ((rowIndex: number, eventIndex: number, previousStart: number, previousEnd: number, newStart: number, newEnd: number, edge: "start" | "end") => void) | undefined;
    onEventEdit?: ((event: PlannerEventValue, rowIndex: number, eventIndex: number) => void) | undefined;
    onEventDelete?: ((event: PlannerEventValue, rowIndex: number, eventIndex: number) => void) | undefined;
    onSlotClick?: ((slot: number) => void) | undefined;
}

export const PlannerEventRow = ({
    events,
    rowIndex,
    y,
    height,
    slotWidth,
    slotRangeStart,
    slotMode,
    slotCount,
    minSlot,
    maxSlot,
    stepSize,
    readOnly = false,
    onEventClick,
    onEventDoubleClick,
    onEventDrag,
    onEventResize,
    onEventEdit,
    onEventDelete,
    onSlotClick,
}: PlannerEventRowProps) => {
    // Track current positions of all events (updated via callbacks from PlannerEvent)
    const [eventPositions, setEventPositions] = useState<Map<number, { start: number; end: number }>>(new Map());

    // Callback for events to report their current position
    const handlePositionChange = useCallback((eventIndex: number, start: number, end: number) => {
        setEventPositions(prev => {
            const next = new Map(prev);
            next.set(eventIndex, { start, end });
            return next;
        });
    }, []);

    // Render slot cells only for unoccupied slots (sub-divided by stepSize)
    const renderedSlotCells = useMemo(() => {
        const cells = [];
        const effectiveStepSize = stepSize ?? 1;
        const subSlotWidth = slotWidth * effectiveStepSize;
        const subSlotCount = Math.ceil(slotCount / effectiveStepSize);

        for (let i = 0; i < subSlotCount; i++) {
            const slot = slotRangeStart + (i * effectiveStepSize);
            // Skip slots that have events (check the whole slot this sub-slot belongs to)

            const x = i * subSlotWidth;
            cells.push(
                <PlannerSlotCell
                    key={`slot-${slot}`}
                    x={x}
                    y={y}
                    width={subSlotWidth}
                    height={height}
                    slot={slot}
                    readOnly={readOnly}
                    onClick={onSlotClick}
                />
            );
        }
        return cells;
    }, [onSlotClick, slotCount, slotRangeStart, slotWidth, stepSize, y, height, readOnly]);

    const renderedEvents = useMemo(() => {
        const eventHeight = height - 12;
        const eventY = y + 6;
        const slotRangeEnd = slotRangeStart + slotCount;

        return events.map((event, eventIndex) => {
            // Check if event is visible in the current slot range
            const eventStart = event.start;
            if (eventStart < slotRangeStart || eventStart >= slotRangeEnd) return null;

            return (
                <PlannerEvent
                    key={`${rowIndex}-${eventIndex}`}
                    value={event}
                    y={eventY}
                    height={eventHeight}
                    slotWidth={slotWidth}
                    slotRangeStart={slotRangeStart}
                    slotMode={slotMode}
                    minSlot={minSlot}
                    maxSlot={maxSlot}
                    stepSize={stepSize}
                    readOnly={readOnly}
                    onClick={onEventClick ? () => onEventClick(event, rowIndex, eventIndex) : undefined}
                    onDoubleClick={onEventDoubleClick ? () => onEventDoubleClick(event, rowIndex, eventIndex) : undefined}
                    onDrag={onEventDrag ? (prevStart, prevEnd, newStart, newEnd) => onEventDrag(rowIndex, eventIndex, prevStart, prevEnd, newStart, newEnd) : undefined}
                    onResize={onEventResize ? (prevStart, prevEnd, newStart, newEnd, edge) => onEventResize(rowIndex, eventIndex, prevStart, prevEnd, newStart, newEnd, edge) : undefined}
                    onEdit={onEventEdit ? () => onEventEdit(event, rowIndex, eventIndex) : undefined}
                    onDelete={onEventDelete ? () => onEventDelete(event, rowIndex, eventIndex) : undefined}
                    onPositionChange={(start, end) => handlePositionChange(eventIndex, start, end)}
                />
            );
        }).filter(Boolean);
    }, [events, rowIndex, y, height, slotWidth, slotRangeStart, slotMode, slotCount, minSlot, maxSlot, stepSize, readOnly, onEventClick, onEventDoubleClick, onEventDrag, onEventResize, onEventEdit, onEventDelete, handlePositionChange]);

    return (
        <g>
            {renderedSlotCells}
            {renderedEvents}
        </g>
    );
};
