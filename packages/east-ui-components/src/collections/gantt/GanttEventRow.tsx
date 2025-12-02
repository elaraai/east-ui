/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo } from "react";
import type { ValueTypeOf } from "@elaraai/east";
import type { Gantt } from "@elaraai/east-ui";
import { GanttTask } from "./GanttTask";
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
                        onClick={onEventClick ? () => onEventClick(event, rowIndex, eventIndex) : () => {}}
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
                    onClick={onEventClick ? () => onEventClick(event, rowIndex, eventIndex) : () => {}}
                />
            );
        }).filter(Boolean);
    }, [events, rowIndex, y, width, height, startDate, endDate, onEventClick]);

    return <g>{renderedEvents}</g>;
};
