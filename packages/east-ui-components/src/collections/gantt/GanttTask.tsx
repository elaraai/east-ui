/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo, useState, useCallback, useEffect } from "react";
import { Text, useToken } from "@chakra-ui/react";
import type { ValueTypeOf } from "@elaraai/east";
import type { Gantt } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

export type GanttTaskValue = ValueTypeOf<typeof Gantt.Types.Task>;

/** Time step configuration for snapping */
export interface TimeStep {
    type: "minutes" | "hours" | "days" | "weeks" | "months";
    value: number;
}

export interface GanttTaskProps {
    x: number;
    y: number;
    width: number;
    height: number;
    value: GanttTaskValue;
    onClick?: (() => void) | undefined;
    onDoubleClick?: (() => void) | undefined;
    /** Callback when task is dragged to a new position */
    onDrag?: ((previousStart: Date, previousEnd: Date, newStart: Date, newEnd: Date) => void) | undefined;
    /** Callback when task duration is changed (dragging the end) */
    onDurationChange?: ((previousEnd: Date, newEnd: Date) => void) | undefined;
    /** Callback when task progress is changed (dragging the progress handle) */
    onProgressChange?: ((previousProgress: number, newProgress: number) => void) | undefined;
    /** Start date of the timeline (for position-to-date conversion) */
    timelineStartDate?: Date | undefined;
    /** End date of the timeline (for position-to-date conversion) */
    timelineEndDate?: Date | undefined;
    /** Width of the timeline in pixels (for position-to-date conversion) */
    timelineWidth?: number | undefined;
    /** Optional step size for drag snapping */
    dragStep?: TimeStep | undefined;
    /** Optional step size for duration change snapping */
    durationStep?: TimeStep | undefined;
}

interface DragState {
    startX: number;
    offset: number;
    taskStart: Date;
    taskEnd: Date;
    hasMoved: boolean;
}

interface DurationDragState {
    startX: number;
    widthOffset: number;
    originalEnd: Date;
    hasMoved: boolean;
}

interface ProgressDragState {
    startX: number;
    originalProgress: number;
    currentProgress: number;
    hasMoved: boolean;
}

/** Convert a time step to milliseconds */
const timeStepToMs = (step: TimeStep): number => {
    switch (step.type) {
        case "minutes": return step.value * 60 * 1000;
        case "hours": return step.value * 60 * 60 * 1000;
        case "days": return step.value * 24 * 60 * 60 * 1000;
        case "weeks": return step.value * 7 * 24 * 60 * 60 * 1000;
        case "months": return step.value * 30 * 24 * 60 * 60 * 1000; // Approximate
    }
};

/** Snap a date to the nearest step */
const snapToStep = (date: Date, step: TimeStep | undefined): Date => {
    if (!step) return date;
    const ms = timeStepToMs(step);
    const snapped = Math.round(date.getTime() / ms) * ms;
    return new Date(snapped);
};

export const GanttTask = ({
    x,
    y,
    width,
    height,
    value,
    onClick,
    onDoubleClick,
    onDrag,
    onDurationChange,
    onProgressChange,
    timelineStartDate,
    timelineEndDate,
    timelineWidth,
    dragStep,
    durationStep,
}: GanttTaskProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [dragState, setDragState] = useState<DragState | null>(null);
    const [durationDragState, setDurationDragState] = useState<DurationDragState | null>(null);
    const [progressDragState, setProgressDragState] = useState<ProgressDragState | null>(null);
    // Local position/width state - reset from props, updated on drag end
    const [position, setPosition] = useState({ x, width });

    // Get color palette from value or default to blue
    const { colorPalette, label, progress: propsProgress } = useMemo(() => ({
        colorPalette: getSomeorUndefined(value.colorPalette)?.type ?? "blue",
        label: getSomeorUndefined(value.label),
        progress: getSomeorUndefined(value.progress),
    }), [value]);

    // Local progress state - reset from props, updated on drag end
    const [localProgress, setLocalProgress] = useState(propsProgress ?? 0);

    // Reset position when x or width changes externally (e.g., from store update after callback)
    useEffect(() => {
        setPosition({ x, width });
    }, [x, width]);

    // Reset local progress when props change externally
    useEffect(() => {
        setLocalProgress(propsProgress ?? 0);
    }, [propsProgress]);

    // Get Chakra color tokens based on color palette
    const [fillColor, strokeColor] = useToken("colors", [
        `${colorPalette}.500`,
        `${colorPalette}.600`,
    ]);

    // Calculate current position from local state + drag offset
    const currentX = useMemo(() => position.x + (dragState?.offset ?? 0), [position.x, dragState?.offset]);
    // Calculate current width from local state + duration drag offset
    const currentWidth = useMemo(() => Math.max(position.width + (durationDragState?.widthOffset ?? 0), 4), [position.width, durationDragState?.widthOffset]);

    const fontSize = useMemo(() => Math.min(height * 0.7, 14), [height]);
    const textX = currentX + 8;
    const taskWidth = useMemo(() => Math.max(currentWidth, 4), [currentWidth]);
    // Use progressDragState.currentProgress during drag, otherwise use local progress state
    const currentProgress = useMemo(() => progressDragState?.currentProgress ?? localProgress, [progressDragState, localProgress]);
    const progressWidth = useMemo(() => taskWidth * (currentProgress / 100), [taskWidth, currentProgress]);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => {
        if (!dragState && !durationDragState && !progressDragState) setIsHovered(false);
    }, [dragState, durationDragState, progressDragState]);

    // Convert pixel offset to duration offset in milliseconds
    const offsetToDuration = useCallback((pixelOffset: number): number => {
        if (!timelineStartDate || !timelineEndDate || !timelineWidth) {
            return 0;
        }
        const totalDuration = timelineEndDate.getTime() - timelineStartDate.getTime();
        return (pixelOffset / timelineWidth) * totalDuration;
    }, [timelineStartDate, timelineEndDate, timelineWidth]);

    // Convert duration offset (ms) to pixel offset
    const durationToOffset = useCallback((durationMs: number): number => {
        if (!timelineStartDate || !timelineEndDate || !timelineWidth) {
            return 0;
        }
        const totalDuration = timelineEndDate.getTime() - timelineStartDate.getTime();
        return (durationMs / totalDuration) * timelineWidth;
    }, [timelineStartDate, timelineEndDate, timelineWidth]);

    const isDraggable = useMemo(() => onDrag && timelineStartDate && timelineEndDate && timelineWidth, [onDrag, timelineStartDate, timelineEndDate, timelineWidth]);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        if (!isDraggable) return;
        (e.target as Element).setPointerCapture(e.pointerId);
        setDragState({
            startX: e.clientX,
            offset: 0,
            taskStart: value.start,
            taskEnd: value.end,
            hasMoved: false,
        });
        e.preventDefault();
        e.stopPropagation();
    }, [isDraggable, value.start, value.end]);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!dragState) return;
        const rawOffset = e.clientX - dragState.startX;

        // Apply snapping during drag for visual feedback
        let offset = rawOffset;
        if (dragStep && timelineWidth && timelineStartDate && timelineEndDate) {
            const durationOffset = offsetToDuration(rawOffset);
            const rawNewStart = new Date(dragState.taskStart.getTime() + durationOffset);
            const snappedNewStart = snapToStep(rawNewStart, dragStep);
            const snappedDurationOffset = snappedNewStart.getTime() - dragState.taskStart.getTime();
            offset = durationToOffset(snappedDurationOffset);
        }

        setDragState(prev => prev ? {
            ...prev,
            offset,
            hasMoved: prev.hasMoved || Math.abs(rawOffset) > 3,
        } : null);
    }, [dragState, dragStep, timelineWidth, timelineStartDate, timelineEndDate, offsetToDuration, durationToOffset]);

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        if (!dragState) return;
        (e.target as Element).releasePointerCapture(e.pointerId);

        if (dragState.hasMoved && timelineWidth) {
            const durationOffset = offsetToDuration(dragState.offset);
            const rawNewStart = new Date(dragState.taskStart.getTime() + durationOffset);
            const rawNewEnd = new Date(dragState.taskEnd.getTime() + durationOffset);
            // Apply step snapping
            const newStart = snapToStep(rawNewStart, dragStep);
            const newEnd = snapToStep(rawNewEnd, dragStep);

            // Calculate snapped pixel offset for visual position
            const snappedDurationOffset = newStart.getTime() - dragState.taskStart.getTime();
            const snappedPixelOffset = durationToOffset(snappedDurationOffset);

            // Update local position with snapped offset
            setPosition(prev => ({ ...prev, x: prev.x + snappedPixelOffset }));

            // Call callback if provided
            if (onDrag) {
                onDrag(dragState.taskStart, dragState.taskEnd, newStart, newEnd);
            }
        } else if (!dragState.hasMoved && onClick) {
            onClick();
        }
        setDragState(null);
        setIsHovered(false);
    }, [dragState, onDrag, onClick, offsetToDuration, durationToOffset, timelineWidth, dragStep]);

    // Handle double click separately (only when not dragging)
    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        if (onDoubleClick && !dragState && !durationDragState) {
            onDoubleClick();
        }
    }, [onDoubleClick, dragState, durationDragState]);

    // Duration resize handling
    const isDurationDraggable = useMemo(() => onDurationChange && timelineStartDate && timelineEndDate && timelineWidth, [onDurationChange, timelineStartDate, timelineEndDate, timelineWidth]);

    const handleDurationPointerDown = useCallback((e: React.PointerEvent) => {
        if (!isDurationDraggable) return;
        (e.target as Element).setPointerCapture(e.pointerId);
        setDurationDragState({
            startX: e.clientX,
            widthOffset: 0,
            originalEnd: value.end,
            hasMoved: false,
        });
        e.preventDefault();
        e.stopPropagation();
    }, [isDurationDraggable, value.end]);

    const handleDurationPointerMove = useCallback((e: React.PointerEvent) => {
        if (!durationDragState) return;
        const rawWidthOffset = e.clientX - durationDragState.startX;

        // Apply snapping during drag for visual feedback
        let widthOffset = rawWidthOffset;
        if (durationStep && timelineWidth && timelineStartDate && timelineEndDate) {
            const durationOffset = offsetToDuration(rawWidthOffset);
            const rawNewEnd = new Date(durationDragState.originalEnd.getTime() + durationOffset);
            const snappedNewEnd = snapToStep(rawNewEnd, durationStep);
            const snappedDurationOffset = snappedNewEnd.getTime() - durationDragState.originalEnd.getTime();
            widthOffset = durationToOffset(snappedDurationOffset);
        }

        setDurationDragState(prev => prev ? {
            ...prev,
            widthOffset,
            hasMoved: prev.hasMoved || Math.abs(rawWidthOffset) > 3,
        } : null);
    }, [durationDragState, durationStep, timelineWidth, timelineStartDate, timelineEndDate, offsetToDuration, durationToOffset]);

    const handleDurationPointerUp = useCallback((e: React.PointerEvent) => {
        if (!durationDragState) return;
        (e.target as Element).releasePointerCapture(e.pointerId);

        if (durationDragState.hasMoved && timelineWidth) {
            // Calculate new end date
            const durationOffset = offsetToDuration(durationDragState.widthOffset);
            const rawNewEnd = new Date(durationDragState.originalEnd.getTime() + durationOffset);
            // Apply step snapping
            const newEnd = snapToStep(rawNewEnd, durationStep);

            // Calculate snapped pixel offset for visual width
            const snappedDurationOffset = newEnd.getTime() - durationDragState.originalEnd.getTime();
            const snappedPixelOffset = durationToOffset(snappedDurationOffset);

            // Update local width with snapped offset
            setPosition(prev => ({ ...prev, width: prev.width + snappedPixelOffset }));

            // Call callback if provided
            if (onDurationChange) {
                onDurationChange(durationDragState.originalEnd, newEnd);
            }
        }
        setDurationDragState(null);
        setIsHovered(false);
    }, [durationDragState, onDurationChange, offsetToDuration, durationToOffset, timelineWidth, durationStep]);

    // Progress change handling
    const isProgressDraggable = useMemo(() => onProgressChange && propsProgress !== undefined, [onProgressChange, propsProgress]);

    const handleProgressPointerDown = useCallback((e: React.PointerEvent) => {
        if (!isProgressDraggable) return;
        (e.target as Element).setPointerCapture(e.pointerId);
        setProgressDragState({
            startX: e.clientX,
            originalProgress: localProgress,
            currentProgress: localProgress,
            hasMoved: false,
        });
        e.preventDefault();
        e.stopPropagation();
    }, [isProgressDraggable, localProgress]);

    const handleProgressPointerMove = useCallback((e: React.PointerEvent) => {
        if (!progressDragState) return;
        const pixelOffset = e.clientX - progressDragState.startX;
        // Convert pixel offset to progress percentage based on task width
        const progressOffset = (pixelOffset / taskWidth) * 100;
        const newProgress = Math.max(0, Math.min(100, progressDragState.originalProgress + progressOffset));
        setProgressDragState(prev => prev ? {
            ...prev,
            currentProgress: newProgress,
            hasMoved: prev.hasMoved || Math.abs(pixelOffset) > 3,
        } : null);
    }, [progressDragState, taskWidth]);

    const handleProgressPointerUp = useCallback((e: React.PointerEvent) => {
        if (!progressDragState) return;
        (e.target as Element).releasePointerCapture(e.pointerId);

        if (progressDragState.hasMoved) {
            // Update local progress to persist the drag
            setLocalProgress(progressDragState.currentProgress);
            // Call callback if provided
            if (onProgressChange) {
                onProgressChange(progressDragState.originalProgress, progressDragState.currentProgress);
            }
        }
        setProgressDragState(null);
        setIsHovered(false);
    }, [progressDragState, onProgressChange]);

    const cursor = useMemo(() => dragState ? "grabbing" : isDraggable ? "grab" : (onClick || onDoubleClick ? "pointer" : "default"), [dragState, isDraggable, onClick, onDoubleClick]);
    const resizeCursor = useMemo(() => durationDragState ? "ew-resize" : "ew-resize", [durationDragState]);
    const progressCursor = useMemo(() => progressDragState ? "ew-resize" : "ew-resize", [progressDragState]);
    const isActive = useMemo(() => isHovered || dragState || durationDragState || progressDragState, [isHovered, dragState, durationDragState, progressDragState]);

    return (
        <g>
            {/* Task bar */}
            <rect
                x={currentX}
                y={y}
                width={taskWidth}
                height={height}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isActive ? 3 : 2}
                opacity={isActive ? 1 : 0.9}
                rx={4}
                ry={4}
                onDoubleClick={handleDoubleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{ cursor, touchAction: "none" }}
            />

            {/* Progress indicator */}
            {propsProgress !== undefined && (
                <rect
                    x={currentX}
                    y={y}
                    width={progressWidth}
                    height={height}
                    fill="rgba(255,255,255,0.3)"
                    rx={4}
                    ry={4}
                    style={{ pointerEvents: "none" }}
                />
            )}

            {/* Label */}
            {label && (
                <foreignObject
                    x={textX}
                    y={y}
                    width={180}
                    height={height}
                    style={{ pointerEvents: "none" }}
                >
                    <Text
                        fontSize={`${fontSize}px`}
                        color="fg.default"
                        opacity={isActive ? 1 : 0.9}
                        whiteSpace="nowrap"
                        cursor={cursor}
                        userSelect="none"
                        lineHeight="1"
                        overflow="hidden"
                        textOverflow="ellipsis"
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

            {/* Duration resize handle (right edge) */}
            {isDurationDraggable && (
                <rect
                    x={currentX + taskWidth - 6}
                    y={y}
                    width={12}
                    height={height}
                    fill="transparent"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onPointerDown={handleDurationPointerDown}
                    onPointerMove={handleDurationPointerMove}
                    onPointerUp={handleDurationPointerUp}
                    style={{ cursor: resizeCursor, touchAction: "none" }}
                />
            )}

            {/* Progress drag handle (at right edge of progress indicator) */}
            {isProgressDraggable && progressWidth > 8 && (
                <rect
                    x={currentX + progressWidth - 6}
                    y={y}
                    width={12}
                    height={height}
                    fill="transparent"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onPointerDown={handleProgressPointerDown}
                    onPointerMove={handleProgressPointerMove}
                    onPointerUp={handleProgressPointerUp}
                    style={{ cursor: progressCursor, touchAction: "none" }}
                />
            )}
        </g>
    );
};
