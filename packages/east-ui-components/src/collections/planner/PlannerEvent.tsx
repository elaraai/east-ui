/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { Text, useToken, Menu, Portal, Popover, Box } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import type { IconName, IconPrefix } from "@fortawesome/fontawesome-common-types";
import { none, some, variant, type ValueTypeOf } from "@elaraai/east";
import type { Planner, UIComponentType } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";

export type PlannerEventValue = ValueTypeOf<typeof Planner.Types.Event>;
export type EventPopoverContext = ValueTypeOf<typeof Planner.Types.EventPopoverContext>;
export type EventPopoverFn = ((ctx: EventPopoverContext) => ValueTypeOf<UIComponentType>) | undefined;

export interface PlannerEventProps {
    value: PlannerEventValue;
    rowIndex: number;
    eventIndex: number;
    y: number;
    height: number;
    slotWidth: number;
    slotRangeStart: number;
    slotMode: "single" | "span";
    minSlot?: number | undefined;
    maxSlot?: number | undefined;
    stepSize?: number | undefined;
    readOnly?: boolean | undefined;
    eventPopoverFn?: EventPopoverFn;
    eventPopoverTrigger?: "click" | "hover";
    /** Whether this event should be dimmed (another event in the row is hovered) */
    isDimmed?: boolean | undefined;
    onClick?: (() => void) | undefined;
    onDoubleClick?: (() => void) | undefined;
    onDrag?: ((previousStart: number, previousEnd: number, newStart: number, newEnd: number) => void) | undefined;
    onResize?: ((previousStart: number, previousEnd: number, newStart: number, newEnd: number, edge: "start" | "end") => void) | undefined;
    onPositionChange?: ((start: number, end: number) => void) | undefined;
    onEdit?: (() => void) | undefined;
    onDelete?: (() => void) | undefined;
    /** Called when mouse enters this event */
    onHoverStart?: (() => void) | undefined;
    /** Called when mouse leaves this event */
    onHoverEnd?: (() => void) | undefined;
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

/** Consolidated overlay state (context menu or popover) */
interface OverlayState {
    active: "none" | "contextMenu" | "popover";
    contextMenuPosition: { x: number; y: number };
}

export const PlannerEvent = ({
    value,
    rowIndex,
    eventIndex,
    y,
    height,
    slotWidth,
    slotRangeStart,
    slotMode,
    minSlot,
    maxSlot,
    stepSize = 1,
    readOnly = false,
    eventPopoverFn,
    eventPopoverTrigger = "click",
    isDimmed = false,
    onClick,
    onDoubleClick,
    onDrag,
    onResize,
    onPositionChange,
    onEdit,
    onDelete,
    onHoverStart,
    onHoverEnd,
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

    // Consolidated overlay state (context menu or popover)
    const [overlay, setOverlay] = useState<OverlayState>({
        active: "none",
        contextMenuPosition: { x: 0, y: 0 },
    });
    const eventRectRef = useRef<SVGRectElement>(null);

    // Show context menu if either callback is defined
    const hasContextMenu = useMemo(() => !readOnly && (onEdit != null || onDelete != null), [readOnly, onEdit, onDelete]);

    // Show popover if eventPopoverFn is defined
    const hasPopover = useMemo(() => eventPopoverFn != null, [eventPopoverFn]);

    // Derived from props
    const colorPalette = useMemo(() => getSomeorUndefined(value.colorPalette)?.type ?? "blue", [value.colorPalette]);

    // Extract label config (nested object with value, align, verticalAlign, color, etc.)
    const labelProps = useMemo(() => {
        const config = getSomeorUndefined(value.label);
        if (!config) return null;
        return {
            value: config.value,
            align: getSomeorUndefined(config.align)?.type ?? "start",
            verticalAlign: getSomeorUndefined(config.verticalAlign)?.type ?? "center",
            color: getSomeorUndefined(config.color),
            fontWeight: getSomeorUndefined(config.fontWeight)?.type,
            fontStyle: getSomeorUndefined(config.fontStyle)?.type,
            fontSize: getSomeorUndefined(config.fontSize)?.type,
        };
    }, [value.label]);

    // Extract icon config (prefix, name, align, size, color, colorPalette)
    const iconProps = useMemo(() => {
        const config = getSomeorUndefined(value.icon);
        if (!config) return null;
        return {
            prefix: config.prefix,
            name: config.name,
            align: getSomeorUndefined(config.align)?.type ?? "start",
            size: getSomeorUndefined(config.size)?.type ?? "sm",
            color: getSomeorUndefined(config.color),
            colorPalette: getSomeorUndefined(config.colorPalette)?.type,
        };
    }, [value.icon]);

    // Event-level styling
    const backgroundColor = useMemo(() => getSomeorUndefined(value.background), [value.background]);
    const customStrokeColor = useMemo(() => getSomeorUndefined(value.stroke), [value.stroke]);
    const eventOpacity = useMemo(() => getSomeorUndefined(value.opacity), [value.opacity]);

    const [fillColor, paletteStrokeColor] = useToken("colors", [`${colorPalette}.500`, `${colorPalette}.600`]);

    // Use custom colors if provided, otherwise use colorPalette
    const actualFillColor = useMemo(() => backgroundColor ?? fillColor, [backgroundColor, fillColor]);
    const actualStrokeColor = useMemo(() => customStrokeColor ?? paletteStrokeColor, [customStrokeColor, paletteStrokeColor]);

    // Calculate base x and width from local slots
    const { baseX, baseWidth } = useMemo(() => {
        const { start, end } = localSlots;
        const slotIndex = start - slotRangeStart;
        const x = slotIndex * slotWidth + 6; // 6px padding
        const w = slotMode === "span"
            ? (end - start + 1) * slotWidth - 12 // 12px total padding
            : slotWidth - 12;
        return { baseX: x, baseWidth: w };
    }, [localSlots, slotRangeStart, slotWidth, slotMode]);

    const minWidth = useMemo(() => Math.max(slotWidth * stepSize - 12, 20), [slotWidth, stepSize]);

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
    const defaultFontSize = useMemo(() => Math.min(height * 0.7, 14), [height]);
    const fontSize = useMemo(() => labelProps?.fontSize ?? defaultFontSize, [labelProps?.fontSize, defaultFontSize]);
    const isActive = useMemo(() => isHovered || interaction.type !== null, [isHovered, interaction.type]);

    // Compute actual opacity - dim when another event in the row is hovered
    const baseOpacity = useMemo(
        () => isDimmed ? 0.1 : (eventOpacity ?? (isActive ? 1 : 0.9)),
        [isDimmed, eventOpacity, isActive]
    );

    // Conversions with stepSize snapping
    const pixelsToSlots = useCallback((px: number): number => {
        const rawSlots = px / slotWidth;
        // Snap to stepSize
        return Math.round(rawSlots / stepSize) * stepSize;
    }, [slotWidth, stepSize]);
    const slotsToPixels = useCallback((slots: number): number => slots * slotWidth, [slotWidth]);

    // Clamp delta to bounds (minimum event size is stepSize)
    const clampDelta = useCallback((delta: number, type: "drag" | "resize", edge: "start" | "end" | null): number => {
        let clamped = delta;
        const { start, end } = localSlots;
        const minEventSize = stepSize; // Minimum event size is one step

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
            // For end resize, minimum is when end = start + minEventSize
            const min = (start + minEventSize) - end;
            if (clamped < min) clamped = min;
            if (maxSlot !== undefined) {
                const max = maxSlot - end;
                if (clamped > max) clamped = max;
            }
        } else {
            // For start resize, maximum is when start = end - minEventSize
            const max = (end - minEventSize) - start;
            if (clamped > max) clamped = max;
            if (minSlot !== undefined) {
                const min = minSlot - start;
                if (clamped < min) clamped = min;
            }
        }
        return clamped;
    }, [localSlots, minSlot, maxSlot, stepSize]);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        if (readOnly || !onDrag) return;
        (e.target as Element).setPointerCapture(e.pointerId);
        startRef.current = { type: "drag", edge: null, startX: e.clientX };
        setInteraction({ offset: 0, type: "drag", edge: null, hasMoved: false });
        e.preventDefault();
        e.stopPropagation();
    }, [readOnly, onDrag]);

    const handleResizePointerDown = useCallback((e: React.PointerEvent, edge: "start" | "end") => {
        if (readOnly || !onResize) return;
        (e.target as Element).setPointerCapture(e.pointerId);
        startRef.current = { type: "resize", edge, startX: e.clientX };
        setInteraction({ offset: 0, type: "resize", edge, hasMoved: false });
        e.preventDefault();
        e.stopPropagation();
    }, [readOnly, onResize]);

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
                const minEventSize = stepSize; // Minimum event size is one step
                if (start.edge === "end") {
                    newEnd = localSlots.end + slotDelta;
                    // Enforce minimum size
                    if (newEnd < newStart + minEventSize) newEnd = newStart + minEventSize;
                } else {
                    newStart = localSlots.start + slotDelta;
                    // Enforce minimum size
                    if (newStart > newEnd - minEventSize) newStart = newEnd - minEventSize;
                }
                setLocalSlots({ start: newStart, end: newEnd });
                if (onResize) onResize(prevStart, prevEnd, newStart, newEnd, start.edge!);
            }
        }

        startRef.current = null;
        setInteraction({ offset: 0, type: null, edge: null, hasMoved: false });
        setIsHovered(false);
    }, [interaction, localSlots, stepSize, onClick, onDrag, onResize, pixelsToSlots]);

    const handleDoubleClick = useCallback(() => {
        if (onDoubleClick && !interaction.type) onDoubleClick();
    }, [onDoubleClick, interaction.type]);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
        if (onHoverStart) onHoverStart();
    }, [onHoverStart]);
    const handleMouseLeave = useCallback(() => {
        if (!interaction.type) setIsHovered(false);
        if (onHoverEnd) onHoverEnd();
    }, [interaction.type, onHoverEnd]);

    // Context menu handler
    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        if (!hasContextMenu) return;
        e.preventDefault();
        e.stopPropagation();
        setOverlay({ active: "contextMenu", contextMenuPosition: { x: e.clientX, y: e.clientY } });
    }, [hasContextMenu]);

    const handleEditClick = useCallback(() => {
        setOverlay(prev => ({ ...prev, active: "none" }));
        if (onEdit) onEdit();
    }, [onEdit]);

    const handleDeleteClick = useCallback(() => {
        setOverlay(prev => ({ ...prev, active: "none" }));
        if (onDelete) onDelete();
    }, [onDelete]);

    const cursor = useMemo(() =>
        readOnly ? "default" : (interaction.type === "drag" ? "grabbing" : onDrag ? "grab" : (onClick || onDoubleClick || hasPopover ? "pointer" : "default")),
        [readOnly, interaction.type, onDrag, onClick, onDoubleClick, hasPopover]
    );

    // Popover context for eventPopoverFn
    const popoverContext = useMemo((): EventPopoverContext => ({
        rowIndex: BigInt(rowIndex),
        eventIndex: BigInt(eventIndex),
        start: localSlots.start,
        end: localSlots.end,
        label: labelProps?.value ? some(labelProps.value) : none,
        colorPalette: colorPalette ? some(variant(colorPalette, null)) : none,
    }), [rowIndex, eventIndex, localSlots.start, localSlots.end, labelProps?.value, colorPalette]);

    // Popover content (memoized to avoid recomputing on every render)
    const popoverContent = useMemo(() => {
        if (!eventPopoverFn || overlay.active !== "popover") return null;
        try {
            return eventPopoverFn(popoverContext);
        } catch {
            return null;
        }
    }, [eventPopoverFn, overlay.active, popoverContext]);

    // Handle popover click trigger
    const handlePopoverClick = useCallback((e: React.MouseEvent) => {
        if (hasPopover && eventPopoverTrigger === "click" && !interaction.hasMoved) {
            e.stopPropagation();
            setOverlay(prev => ({ ...prev, active: prev.active === "popover" ? "none" : "popover" }));
        }
    }, [hasPopover, eventPopoverTrigger, interaction.hasMoved]);

    // Combined mouse enter handler (hover state + popover + row dimming)
    const handleCombinedMouseEnter = useCallback(() => {
        setIsHovered(true);
        if (onHoverStart) onHoverStart();
        if (hasPopover && eventPopoverTrigger === "hover") {
            setOverlay(prev => ({ ...prev, active: "popover" }));
        }
    }, [hasPopover, eventPopoverTrigger, onHoverStart]);

    // Combined mouse leave handler (hover state + popover + row dimming)
    const handleCombinedMouseLeave = useCallback(() => {
        if (!interaction.type) setIsHovered(false);
        if (onHoverEnd) onHoverEnd();
        if (hasPopover && eventPopoverTrigger === "hover") {
            setOverlay(prev => ({ ...prev, active: "none" }));
        }
    }, [hasPopover, eventPopoverTrigger, interaction.type, onHoverEnd]);

    // Get anchor rect for popover positioning
    const getPopoverAnchorRect = useCallback(() => {
        if (eventRectRef.current) {
            return eventRectRef.current.getBoundingClientRect();
        }
        return { x: 0, y: 0, width: 0, height: 0 };
    }, []);

    return (
        <g>
            <rect
                ref={eventRectRef}
                x={currentX}
                y={y}
                width={eventWidth}
                height={height}
                fill={actualFillColor}
                stroke={actualStrokeColor}
                strokeWidth={isActive ? 3 : 2}
                opacity={baseOpacity}
                rx={4}
                ry={4}
                onClick={handlePopoverClick}
                onDoubleClick={handleDoubleClick}
                onMouseEnter={handleCombinedMouseEnter}
                onMouseLeave={handleCombinedMouseLeave}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onContextMenu={handleContextMenu}
                style={{ cursor, touchAction: "none", transition: "opacity 150ms ease-in-out" }}
            />

            {/* Render label if present */}
            {labelProps && (
                <foreignObject x={currentX + 8} y={y} width={Math.max(eventWidth - 16, 0)} height={height} style={{ pointerEvents: "none" }}>
                    <Box
                        display="flex"
                        alignItems={labelProps.verticalAlign === "start" ? "flex-start" : labelProps.verticalAlign === "end" ? "flex-end" : "center"}
                        justifyContent={labelProps.align === "center" ? "center" : labelProps.align === "end" ? "flex-end" : "flex-start"}
                        height="100%"
                        opacity={baseOpacity}
                        transition="opacity 150ms ease-in-out"
                    >
                        <Text
                            fontSize={typeof fontSize === "number" ? `${fontSize}px` : fontSize}
                            color={labelProps.color ?? "fg.default"}
                            fontWeight={labelProps.fontWeight}
                            fontStyle={labelProps.fontStyle}
                            whiteSpace="nowrap"
                            cursor={cursor}
                            userSelect="none"
                            lineHeight="1"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            m={0}
                            p={0}
                        >
                            {labelProps.value}
                        </Text>
                    </Box>
                </foreignObject>
            )}

            {/* Render icon if present */}
            {iconProps && (
                <foreignObject x={currentX + 8} y={y} width={Math.max(eventWidth - 16, 0)} height={height} style={{ pointerEvents: "none" }}>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent={iconProps.align === "center" ? "center" : iconProps.align === "end" ? "flex-end" : "flex-start"}
                        height="100%"
                        opacity={baseOpacity}
                        transition="opacity 150ms ease-in-out"
                    >
                        <FontAwesomeIcon
                            icon={[iconProps.prefix as IconPrefix, iconProps.name as IconName]}
                            size={iconProps.size as any}
                            color={iconProps.color ?? (iconProps.colorPalette ? `var(--chakra-colors-${iconProps.colorPalette}-500)` : "currentColor")}
                        />
                    </Box>
                </foreignObject>
            )}

            {!readOnly && onResize && (
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
                    open={overlay.active === "contextMenu"}
                    onOpenChange={(e) => setOverlay(prev => ({ ...prev, active: e.open ? "contextMenu" : "none" }))}
                    positioning={{
                        placement: "bottom-start",
                        getAnchorRect: () => ({
                            x: overlay.contextMenuPosition.x,
                            y: overlay.contextMenuPosition.y,
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

            {/* Event popover */}
            {hasPopover && (
                <Popover.Root
                    open={overlay.active === "popover"}
                    onOpenChange={(e) => setOverlay(prev => ({ ...prev, active: e.open ? "popover" : "none" }))}
                    positioning={{
                        placement: "top",
                        getAnchorRect: getPopoverAnchorRect,
                    }}
                >
                    <Portal>
                        <Popover.Positioner>
                            <Popover.Content>
                                <Popover.Body>
                                    {popoverContent && <EastChakraComponent value={popoverContent} />}
                                </Popover.Body>
                            </Popover.Content>
                        </Popover.Positioner>
                    </Portal>
                </Popover.Root>
            )}
        </g>
    );
};
