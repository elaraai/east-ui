/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo } from "react";
import type { ValueTypeOf } from "@elaraai/east";
import type { Gantt } from "@elaraai/east-ui";
import { GanttTask, type TimeStep } from "./GanttTask";
import { GanttMilestone } from "./GanttMilestone";

export type GanttEventValue = ValueTypeOf<typeof Gantt.Types.Event>;
export type GanttRowValue = ValueTypeOf<typeof Gantt.Types.Row>;

export interface GanttEventRowProps {
    events: GanttEventValue[];
    rowIndex: number;
    y: number;
    width: number;
    height: number;
    startDate: Date;
    endDate: Date;
    onEventClick?: ((event: GanttEventValue, rowIndex: number, eventIndex: number) => void) | undefined;
    onEventDoubleClick?: ((event: GanttEventValue, rowIndex: number, eventIndex: number) => void) | undefined;
    /** Callback when a task is dragged */
    onTaskDrag?: ((rowIndex: number, eventIndex: number, previousStart: Date, previousEnd: Date, newStart: Date, newEnd: Date) => void) | undefined;
    /** Callback when a task duration is changed (dragging the end) */
    onTaskDurationChange?: ((rowIndex: number, eventIndex: number, previousEnd: Date, newEnd: Date) => void) | undefined;
    /** Callback when task progress is changed (dragging the progress handle) */
    onTaskProgressChange?: ((rowIndex: number, eventIndex: number, previousProgress: number, newProgress: number) => void) | undefined;
    /** Callback when a milestone is dragged */
    onMilestoneDrag?: ((rowIndex: number, eventIndex: number, previousDate: Date, newDate: Date) => void) | undefined;
    /** Optional step size for drag snapping */
    dragStep?: TimeStep | undefined;
    /** Optional step size for duration change snapping */
    durationStep?: TimeStep | undefined;
}

const getEventPosition = (
    event: GanttEventValue,
    startDate: Date,
    endDate: Date,
    width: number
): { x: number; width: number; isMilestone: boolean } => {
    const totalTimespan = endDate.getTime() - startDate.getTime();

    if (event.type === "Milestone") {
        const eventDate = event.value.date;
        const eventTime = eventDate.getTime();

        if (eventTime >= startDate.getTime() && eventTime <= endDate.getTime()) {
            const position = (eventTime - startDate.getTime()) / totalTimespan;
            return {
                x: position * width,
                width: 0,
                isMilestone: true,
            };
        }
        return { x: 0, width: 0, isMilestone: true };
    }

    // Task event
    const taskValue = event.value;
    const eventStart = taskValue.start;
    const eventEnd = taskValue.end;

    const clampedStart = Math.max(eventStart.getTime(), startDate.getTime());
    const clampedEnd = Math.min(eventEnd.getTime(), endDate.getTime());

    const startOffset = (clampedStart - startDate.getTime()) / totalTimespan;
    const duration = (clampedEnd - clampedStart) / totalTimespan;

    return {
        x: startOffset * width,
        width: Math.max(duration * width, 2),
        isMilestone: false,
    };
};

export const GanttEventRow = ({
    events,
    rowIndex,
    y,
    width,
    height,
    startDate,
    endDate,
    onEventClick,
    onEventDoubleClick,
    onTaskDrag,
    onTaskDurationChange,
    onTaskProgressChange,
    onMilestoneDrag,
    dragStep,
    durationStep,
}: GanttEventRowProps) => {
    const renderedEvents = useMemo(() => {
        const eventHeight = height - 24;
        const eventY = y + 12;

        return events.map((event, eventIndex) => {
            const position = getEventPosition(event, startDate, endDate, width);

            if (position.x < 0 || position.x > width) return null;

            if (event.type === "Milestone") {
                return (
                    <GanttMilestone
                        key={`${rowIndex}-${eventIndex}`}
                        x={position.x}
                        y={eventY}
                        height={eventHeight}
                        value={event.value}
                        onClick={onEventClick ? () => onEventClick(event, rowIndex, eventIndex) : undefined}
                        onDoubleClick={onEventDoubleClick ? () => onEventDoubleClick(event, rowIndex, eventIndex) : undefined}
                        onDrag={onMilestoneDrag ? (prevDate, newDate) => onMilestoneDrag(rowIndex, eventIndex, prevDate, newDate) : undefined}
                        timelineStartDate={startDate}
                        timelineEndDate={endDate}
                        timelineWidth={width}
                    />
                );
            }

            return (
                <GanttTask
                    key={`${rowIndex}-${eventIndex}`}
                    x={position.x}
                    y={eventY}
                    width={position.width}
                    height={eventHeight}
                    value={event.value}
                    onClick={onEventClick ? () => onEventClick(event, rowIndex, eventIndex) : undefined}
                    onDoubleClick={onEventDoubleClick ? () => onEventDoubleClick(event, rowIndex, eventIndex) : undefined}
                    onDrag={onTaskDrag ? (prevStart, prevEnd, newStart, newEnd) => onTaskDrag(rowIndex, eventIndex, prevStart, prevEnd, newStart, newEnd) : undefined}
                    onDurationChange={onTaskDurationChange ? (prevEnd, newEnd) => onTaskDurationChange(rowIndex, eventIndex, prevEnd, newEnd) : undefined}
                    onProgressChange={onTaskProgressChange ? (prevProgress, newProgress) => onTaskProgressChange(rowIndex, eventIndex, prevProgress, newProgress) : undefined}
                    timelineStartDate={startDate}
                    timelineEndDate={endDate}
                    timelineWidth={width}
                    dragStep={dragStep}
                    durationStep={durationStep}
                />
            );
        }).filter(Boolean);
    }, [events, rowIndex, y, width, height, startDate, endDate, onEventClick, onEventDoubleClick, onTaskDrag, onTaskDurationChange, onTaskProgressChange, onMilestoneDrag, dragStep, durationStep]);

    return <g>{renderedEvents}</g>;
};
