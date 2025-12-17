/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { Text, useToken, Menu, Portal } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import type { ValueTypeOf } from "@elaraai/east";
import type { Planner } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

export type PlannerEventValue = ValueTypeOf<typeof Planner.Types.Event>;

export interface PlannerEventProps {
    value: PlannerEventValue;
    y: number;
    height: number;
    slotWidth: number;
    slotRangeStart: bigint;
    slotMode: "single" | "span";
    minSlot?: bigint | undefined;
    maxSlot?: bigint | undefined;
    onClick?: (() => void) | undefined;
    onDoubleClick?: (() => void) | undefined;
    onDrag?: ((previousStart: bigint, previousEnd: bigint, newStart: bigint, newEnd: bigint) => void) | undefined;
    onResize?: ((previousStart: bigint, previousEnd: bigint, newStart: bigint, newEnd: bigint, edge: "start" | "end") => void) | undefined;
    onPositionChange?: ((start: bigint, end: bigint) => void) | undefined;
    onEdit?: (() => void) | undefined;
    onDelete?: (() => void) | undefined;
}

/** Captured at interaction start */
interface InteractionStart {
    type: "drag" | "resize";
    edge: "start" | "end" | null;
    startX: number;
}

/** Minimal interaction state */
interface InteractionState {
    offset: number;
    type: "drag" | "resize" | null;
    edge: "start" | "end" | null;
    hasMoved: boolean;
}

export const PlannerEvent = ({
    value,
    y,
    height,
    slotWidth,
    slotRangeStart,
    slotMode,
    minSlot,
    maxSlot,
    onClick,
    onDoubleClick,
    onDrag,
    onResize,
    onPositionChange,
    onEdit,
    onDelete,
}: PlannerEventProps) => {
    const startRef = useRef<InteractionStart | null>(null);

    // Props-derived slot values
    const propsStart = useMemo(() => value.start, [value.start]);
    const propsEnd = useMemo(() => getSomeorUndefined(value.end) ?? value.start, [value.end, value.start]);

    // Local slot values - initialized from props, updated on interaction
    const [localSlots, setLocalSlots] = useState({ start: propsStart, end: propsEnd });

    // Sync local state when props change (parent updated the data)
    useEffect(() => {
        setLocalSlots({ start: propsStart, end: propsEnd });
    }, [propsStart, propsEnd]);

    // Notify parent of position changes
    useEffect(() => {
        if (onPositionChange) {
            onPositionChange(localSlots.start, localSlots.end);
        }
    }, [localSlots, onPositionChange]);

    // Interaction state
    const [interaction, setInteraction] = useState<InteractionState>({
        offset: 0,
        type: null,
        edge: null,
        hasMoved: false,
    });
    const [isHovered, setIsHovered] = useState(false);

    // Context menu state
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

    // Show context menu if either callback is defined
    const hasContextMenu = useMemo(() => onEdit != null || onDelete != null, [onEdit, onDelete]);

    // Derived from props
    const colorPalette = useMemo(() => getSomeorUndefined(value.colorPalette)?.type ?? "blue", [value.colorPalette]);
    const label = useMemo(() => getSomeorUndefined(value.label), [value.label]);

    const [fillColor, strokeColor] = useToken("colors", [`${colorPalette}.500`, `${colorPalette}.600`]);

    // Calculate base x and width from local slots
    const { baseX, baseWidth } = useMemo(() => {
        const { start, end } = localSlots;
        const slotIndex = Number(start - slotRangeStart);
        const x = slotIndex * slotWidth + 6; // 6px padding
        const w = slotMode === "span"
            ? (Number(end - start) + 1) * slotWidth - 12 // 12px total padding
            : slotWidth - 12;
        return { baseX: x, baseWidth: w };
    }, [localSlots, slotRangeStart, slotWidth, slotMode]);

    const minWidth = useMemo(() => Math.max(slotWidth - 12, 20), [slotWidth]);

    // Apply interaction offset to get current visual position
    const { currentX, currentWidth } = useMemo(() => {
        const { offset, type, edge } = interaction;
        if (type === "drag") {
            return { currentX: baseX + offset, currentWidth: baseWidth };
        }
        if (type === "resize") {
            if (edge === "end") {
                return { currentX: baseX, currentWidth: Math.max(baseWidth + offset, minWidth) };
            } else {
                return { currentX: baseX + offset, currentWidth: Math.max(baseWidth - offset, minWidth) };
            }
        }
        return { currentX: baseX, currentWidth: baseWidth };
    }, [baseX, baseWidth, interaction, minWidth]);

    const eventWidth = useMemo(() => Math.max(currentWidth, 4), [currentWidth]);
    const fontSize = useMemo(() => Math.min(height * 0.7, 14), [height]);
    const isActive = useMemo(() => isHovered || interaction.type !== null, [isHovered, interaction.type]);

    // Conversions
    const pixelsToSlots = useCallback((px: number): bigint => BigInt(Math.round(px / slotWidth)), [slotWidth]);
    const slotsToPixels = useCallback((slots: bigint): number => Number(slots) * slotWidth, [slotWidth]);

    // Clamp delta to bounds
    const clampDelta = useCallback((delta: bigint, type: "drag" | "resize", edge: "start" | "end" | null): bigint => {
        let clamped = delta;
        const { start, end } = localSlots;

        if (type === "drag") {
            if (minSlot !== undefined) {
                const min = minSlot - start;
                if (clamped < min) clamped = min;
            }
            if (maxSlot !== undefined) {
                const max = maxSlot - end;
                if (clamped > max) clamped = max;
            }
        } else if (edge === "end") {
            const min = start - end;
            if (clamped < min) clamped = min;
            if (maxSlot !== undefined) {
                const max = maxSlot - end;
                if (clamped > max) clamped = max;
            }
        } else {
            const max = end - start;
            if (clamped > max) clamped = max;
            if (minSlot !== undefined) {
                const min = minSlot - start;
                if (clamped < min) clamped = min;
            }
        }
        return clamped;
    }, [localSlots, minSlot, maxSlot]);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        if (!onDrag) return;
        (e.target as Element).setPointerCapture(e.pointerId);
        startRef.current = { type: "drag", edge: null, startX: e.clientX };
        setInteraction({ offset: 0, type: "drag", edge: null, hasMoved: false });
        e.preventDefault();
        e.stopPropagation();
    }, [onDrag]);

    const handleResizePointerDown = useCallback((e: React.PointerEvent, edge: "start" | "end") => {
        if (!onResize) return;
        (e.target as Element).setPointerCapture(e.pointerId);
        startRef.current = { type: "resize", edge, startX: e.clientX };
        setInteraction({ offset: 0, type: "resize", edge, hasMoved: false });
        e.preventDefault();
        e.stopPropagation();
    }, [onResize]);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        const start = startRef.current;
        if (!start) return;

        const rawOffset = e.clientX - start.startX;
        const slotDelta = clampDelta(pixelsToSlots(rawOffset), start.type, start.edge);
        const offset = slotsToPixels(slotDelta);

        setInteraction(prev => ({ ...prev, offset, hasMoved: prev.hasMoved || Math.abs(rawOffset) > 3 }));
    }, [clampDelta, pixelsToSlots, slotsToPixels]);

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        const start = startRef.current;
        if (!start) return;

        (e.target as Element).releasePointerCapture(e.pointerId);

        if (!interaction.hasMoved) {
            if (start.type === "drag" && onClick) onClick();
        } else {
            const slotDelta = pixelsToSlots(interaction.offset);
            const prevStart = localSlots.start;
            const prevEnd = localSlots.end;

            if (start.type === "drag") {
                const newStart = localSlots.start + slotDelta;
                const newEnd = localSlots.end + slotDelta;
                setLocalSlots({ start: newStart, end: newEnd });
                if (onDrag) onDrag(prevStart, prevEnd, newStart, newEnd);
            } else if (start.type === "resize") {
                let newStart = localSlots.start;
                let newEnd = localSlots.end;
                if (start.edge === "end") {
                    newEnd = localSlots.end + slotDelta;
                    if (newEnd < newStart) newEnd = newStart;
                } else {
                    newStart = localSlots.start + slotDelta;
                    if (newStart > newEnd) newStart = newEnd;
                }
                setLocalSlots({ start: newStart, end: newEnd });
                if (onResize) onResize(prevStart, prevEnd, newStart, newEnd, start.edge!);
            }
        }

        startRef.current = null;
        setInteraction({ offset: 0, type: null, edge: null, hasMoved: false });
        setIsHovered(false);
    }, [interaction, localSlots, onClick, onDrag, onResize, pixelsToSlots]);

    const handleDoubleClick = useCallback(() => {
        if (onDoubleClick && !interaction.type) onDoubleClick();
    }, [onDoubleClick, interaction.type]);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => {
        if (!interaction.type) setIsHovered(false);
    }, [interaction.type]);

    // Context menu handler
    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        if (!hasContextMenu) return;
        e.preventDefault();
        e.stopPropagation();
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
        setContextMenuOpen(true);
    }, [hasContextMenu]);

    const handleEditClick = useCallback(() => {
        setContextMenuOpen(false);
        if (onEdit) onEdit();
    }, [onEdit]);

    const handleDeleteClick = useCallback(() => {
        setContextMenuOpen(false);
        if (onDelete) onDelete();
    }, [onDelete]);

    const cursor = useMemo(() =>
        interaction.type === "drag" ? "grabbing" : onDrag ? "grab" : (onClick || onDoubleClick ? "pointer" : "default"),
        [interaction.type, onDrag, onClick, onDoubleClick]
    );

    return (
        <g>
            <rect
                x={currentX}
                y={y}
                width={eventWidth}
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
                onContextMenu={handleContextMenu}
                style={{ cursor, touchAction: "none" }}
            />

            {label && (
                <foreignObject x={currentX + 8} y={y} width={180} height={height} style={{ pointerEvents: "none" }}>
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

            {onResize && (
                <>
                    <rect
                        x={currentX - 6}
                        y={y}
                        width={12}
                        height={height}
                        fill="transparent"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onPointerDown={(e) => handleResizePointerDown(e, "start")}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        style={{ cursor: "ew-resize", touchAction: "none" }}
                    />
                    <rect
                        x={currentX + eventWidth - 6}
                        y={y}
                        width={12}
                        height={height}
                        fill="transparent"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onPointerDown={(e) => handleResizePointerDown(e, "end")}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        style={{ cursor: "ew-resize", touchAction: "none" }}
                    />
                </>
            )}

            {/* Context menu for Edit/Delete */}
            {hasContextMenu && (
                <Menu.Root
                    open={contextMenuOpen}
                    onOpenChange={(e) => setContextMenuOpen(e.open)}
                    positioning={{
                        placement: "bottom-start",
                        getAnchorRect: () => ({
                            x: contextMenuPosition.x,
                            y: contextMenuPosition.y,
                            width: 0,
                            height: 0,
                        }),
                    }}
                >
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content>
                                {onEdit && (
                                    <Menu.Item value="edit" onClick={handleEditClick}>
                                        <FontAwesomeIcon icon={faPen} style={{ marginRight: 8 }} />
                                        Edit
                                    </Menu.Item>
                                )}
                                {onDelete && (
                                    <Menu.Item value="delete" onClick={handleDeleteClick} color="red.500">
                                        <FontAwesomeIcon icon={faTrash} style={{ marginRight: 8 }} />
                                        Delete
                                    </Menu.Item>
                                )}
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
            )}
        </g>
    );
};
