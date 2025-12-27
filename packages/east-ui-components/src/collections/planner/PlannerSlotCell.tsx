/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useState, useCallback, useMemo } from "react";

export interface PlannerSlotCellProps {
    x: number;
    y: number;
    width: number;
    height: number;
    slot: number;
    readOnly?: boolean | undefined;
    onClick?: ((slot: number) => void) | undefined;
}

export const PlannerSlotCell = ({
    x,
    y,
    width,
    height,
    slot,
    readOnly = false,
    onClick,
}: PlannerSlotCellProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = useCallback(() => {
        if (!readOnly) setIsHovered(true);
    }, [readOnly]);

    const handleMouseLeave = useCallback(() => {
        if (!readOnly) setIsHovered(false)
    }, [readOnly]);

    const handleClick = useCallback(() => {
        if (!readOnly && onClick) onClick(slot);
    }, [readOnly, onClick, slot]);

    // Plus icon dimensions - only show if cell is large enough
    const icon = useMemo(() => {
        const minIconSize = 18;
        const size = Math.min(Math.min(width, height) * 0.4, minIconSize);
        return {
            visible: width >= minIconSize + 12 && height >= minIconSize + 12,
            size,
            x: x + (width - size) / 2,
            y: y + (height - size) / 2,
        }
    }, [x, y, width, height]);


    return (
        <g>
            {/* Invisible hit area for the whole slot */}
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill="transparent"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                style={{ cursor: isHovered ? "pointer" : "default" }}
            />

            {/* Hover outline and plus icon - only visible on hover */}
            {isHovered && (
                <>
                    {/* Dashed outline */}
                    <rect
                        x={x + 6}
                        y={y + 6}
                        width={Math.max(width - 12, 0)}
                        height={Math.max(height - 12, 0)}
                        fill="none"
                        stroke="gray"
                        strokeWidth={2}
                        strokeDasharray="4 2"
                        rx={4}
                        ry={4}
                        style={{ pointerEvents: "none" }}
                    />
                    {/* Plus icon - only if cell is large enough */}
                    {icon.visible && (
                        <g
                            transform={`translate(${icon.x}, ${icon.y})`}
                            style={{ pointerEvents: "none" }}
                        >
                            <line
                                x1={icon.size * 0.25}
                                y1={icon.size / 2}
                                x2={icon.size * 0.75}
                                y2={icon.size / 2}
                                stroke="gray"
                                strokeWidth={2}
                                strokeLinecap="round"
                            />
                            <line
                                x1={icon.size / 2}
                                y1={icon.size * 0.25}
                                x2={icon.size / 2}
                                y2={icon.size * 0.75}
                                stroke="gray"
                                strokeWidth={2}
                                strokeLinecap="round"
                            />
                        </g>
                    )}
                </>
            )}
        </g>
    );
};
