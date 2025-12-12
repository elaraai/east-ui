/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo, useState, useCallback, useEffect } from "react";
import { Text, useToken } from "@chakra-ui/react";
import type { ValueTypeOf } from "@elaraai/east";
import type { Gantt } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

export type GanttMilestoneValue = ValueTypeOf<typeof Gantt.Types.Milestone>;

export interface GanttMilestoneProps {
    x: number;
    y: number;
    height: number;
    value: GanttMilestoneValue;
    onClick?: (() => void) | undefined;
    onDoubleClick?: (() => void) | undefined;
    /** Callback when milestone is dragged to a new position */
    onDrag?: ((previousDate: Date, newDate: Date) => void) | undefined;
    /** Start date of the timeline (for position-to-date conversion) */
    timelineStartDate?: Date | undefined;
    /** End date of the timeline (for position-to-date conversion) */
    timelineEndDate?: Date | undefined;
    /** Width of the timeline in pixels (for position-to-date conversion) */
    timelineWidth?: number | undefined;
}

interface DragState {
    startX: number;
    offset: number;
    startDate: Date;
    hasMoved: boolean;
}

const makeDiamondPoints = (x: number, y: number, size: number): string => {
    const centerX = x;
    const centerY = y + size / 2;
    return `${centerX},${y} ${centerX + size / 2},${centerY} ${centerX},${y + size} ${centerX - size / 2},${centerY}`;
};

export const GanttMilestone = ({
    x,
    y,
    height,
    value,
    onClick,
    onDoubleClick,
    onDrag,
    timelineStartDate,
    timelineEndDate,
    timelineWidth,
}: GanttMilestoneProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [dragState, setDragState] = useState<DragState | null>(null);
    // Local position state - reset from props, updated on drag end
    const [position, setPosition] = useState({ x });

    // Reset position when x changes externally (e.g., from store update after callback)
    useEffect(() => {
        setPosition({ x });
    }, [x]);

    // Get color palette from value or default to blue
    const { colorPalette, label } = useMemo(() => ({
        colorPalette: getSomeorUndefined(value.colorPalette)?.type ?? "blue",
        label: getSomeorUndefined(value.label),
    }), [value]);

    // Get Chakra color tokens based on color palette
    const [fillColor, strokeColor] = useToken("colors", [
        `${colorPalette}.500`,
        `${colorPalette}.600`,
    ]);

    // Calculate current position from local state + drag offset
    const currentX = useMemo(() => position.x + (dragState?.offset ?? 0), [position.x, dragState?.offset]);

    const fontSize = useMemo(() => Math.min(height * 0.7, 14), [height]);
    const diamondSize = useMemo(() => height, [height]);
    const textX = currentX + diamondSize / 2 + 4;
    const diamondPoints = useMemo(() => makeDiamondPoints(currentX, y, diamondSize), [currentX, y, diamondSize]);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => {
        if (!dragState) setIsHovered(false);
    }, [dragState]);

    // Convert pixel position to date
    const positionToDate = useCallback((pixelX: number): Date => {
        if (!timelineStartDate || !timelineEndDate || !timelineWidth) {
            return value.date;
        }
        const totalDuration = timelineEndDate.getTime() - timelineStartDate.getTime();
        const ratio = Math.max(0, Math.min(1, pixelX / timelineWidth));
        return new Date(timelineStartDate.getTime() + ratio * totalDuration);
    }, [timelineStartDate, timelineEndDate, timelineWidth, value.date]);

    const isDraggable = onDrag && timelineStartDate && timelineEndDate && timelineWidth;

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        if (!isDraggable) return;
        (e.target as Element).setPointerCapture(e.pointerId);
        setDragState({
            startX: e.clientX,
            offset: 0,
            startDate: value.date,
            hasMoved: false,
        });
        e.preventDefault();
        e.stopPropagation();
    }, [isDraggable, value.date]);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!dragState) return;
        const offset = e.clientX - dragState.startX;
        setDragState(prev => prev ? {
            ...prev,
            offset,
            hasMoved: prev.hasMoved || Math.abs(offset) > 3,
        } : null);
    }, [dragState]);

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        if (!dragState) return;
        (e.target as Element).releasePointerCapture(e.pointerId);

        if (dragState.hasMoved && timelineWidth) {
            // Update local position to persist the drag
            setPosition(prev => ({ x: prev.x + dragState.offset }));
            // Call callback if provided
            if (onDrag) {
                const newDate = positionToDate(position.x + dragState.offset);
                onDrag(dragState.startDate, newDate);
            }
        } else if (!dragState.hasMoved && onClick) {
            onClick();
        }
        setDragState(null);
        setIsHovered(false);
    }, [dragState, onDrag, onClick, positionToDate, position.x, timelineWidth]);

    // Handle double click separately (only when not dragging)
    const handleDoubleClick = useCallback((_e: React.MouseEvent) => {
        if (onDoubleClick && !dragState) {
            onDoubleClick();
        }
    }, [onDoubleClick, dragState]);

    const cursor = dragState ? "grabbing" : isDraggable ? "grab" : (onClick || onDoubleClick ? "pointer" : "default");

    return (
        <g>
            {/* Diamond shape */}
            <polygon
                points={diamondPoints}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isHovered || dragState ? 3 : 2}
                opacity={isHovered || dragState ? 1 : 0.9}
                onDoubleClick={handleDoubleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{ cursor, touchAction: "none" }}
            />

            {/* Label */}
            {label && (
                <foreignObject
                    x={textX}
                    y={y}
                    width={200}
                    height={height}
                    style={{ pointerEvents: "none" }}
                >
                    <Text
                        fontSize={`${fontSize}px`}
                        color="fg.default"
                        opacity={isHovered || dragState ? 1 : 0.9}
                        whiteSpace="nowrap"
                        cursor={cursor}
                        userSelect="none"
                        lineHeight="1"
                        display="flex"
                        alignItems="center"
                        height="100%"
                        m={0}
                        p={0}
                    >
                        {label}
                    </Text>
                </foreignObject>
            )}
        </g>
    );
};
